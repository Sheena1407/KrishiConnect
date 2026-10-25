import React, { useState, useEffect } from 'react';
import { expertAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  GraduationCap,
  Star,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Filter,
  User,
} from 'lucide-react';

const SPECIALIZATIONS = [
  'All',
  'Soil Science',
  'Crop Management',
  'Pest Management',
  'Organic Farming',
  'Irrigation',
  'Horticulture',
];

const ExpertConsultation = () => {
  const [experts, setExperts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [activeTab, setActiveTab] = useState('experts'); // 'experts' or 'myBookings'
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [bookingForm, setBookingForm] = useState({
    topic: '',
    question: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
  });

  const fetchData = async () => {
    try {
      const [expRes, consRes] = await Promise.all([
        expertAPI.getAll({ specialization: selectedSpecialization }),
        expertAPI.getMyConsultations(),
      ]);
      if (expRes.data.success) setExperts(expRes.data.experts);
      if (consRes.data.success) setConsultations(consRes.data.consultations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSpecialization]);

  const openBookingModal = (expert) => {
    setSelectedExpert(expert);
    setBookingForm({
      topic: '',
      question: '',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
    });
    setShowModal(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await expertAPI.book({
        expertId: selectedExpert._id,
        topic: bookingForm.topic,
        question: bookingForm.question,
        date: bookingForm.date,
        time: bookingForm.time,
      });

      setMessage({
        text: `Consultation booked with ${selectedExpert.name}! Check 'My Consultations' tab.`,
        type: 'success',
      });
      setShowModal(false);
      fetchData();
      setActiveTab('myBookings');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Booking failed', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Connecting with Agricultural Scientists and KVK specialists..." />;
  }

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
              <GraduationCap size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Ask an Agricultural Expert</h3>
          </div>
          <p className="text-muted small mb-0">
            One-on-one personalized agronomic advisory from certified ICAR scientists and university agronomists.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="btn-group btn-group-sm">
          <button
            onClick={() => setActiveTab('experts')}
            className={`btn ${activeTab === 'experts' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
          >
            Verified Experts ({experts.length})
          </button>
          <button
            onClick={() => setActiveTab('myBookings')}
            className={`btn ${activeTab === 'myBookings' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
          >
            My Appointments ({consultations.length})
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {activeTab === 'experts' ? (
        <>
          {/* Specialization Chips */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {SPECIALIZATIONS.map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSpecialization(sp)}
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedSpecialization === sp
                    ? 'btn-success text-white fw-bold'
                    : 'btn-outline-secondary bg-white'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {experts.map((exp) => (
              <div key={exp._id} className="col-md-6 col-lg-6">
                <div className="krishi-card p-4 h-100 d-flex flex-column krishi-card-hover">
                  <div className="d-flex gap-3 mb-3">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="rounded-4 object-fit-cover shadow-sm"
                      style={{ width: '84px', height: '84px' }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="fw-bold text-dark mb-1">{exp.name}</h5>
                          <span className="badge bg-success bg-opacity-10 text-success fw-semibold small">
                            {exp.specialization}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
                          <Star size={15} fill="#FFC107" />
                          <span>{exp.rating}</span>
                        </div>
                      </div>

                      <div className="small text-muted mt-2">
                        <div><strong>Experience:</strong> {exp.experience}</div>
                        <div><strong>Qualification:</strong> {exp.qualification}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 px-3 rounded-3 bg-light d-flex justify-content-between align-items-center small text-muted my-2">
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={14} className="text-secondary" /> {exp.availability}
                    </span>
                    <span className="text-success fw-bold">
                      {exp.consultationFee === 0 ? 'FREE / Govt KVK Subsidized' : `₹${exp.consultationFee}`}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light-subtle mt-auto">
                    <span className="small text-muted">
                      Languages: <strong>{exp.languages?.join(', ')}</strong>
                    </span>

                    <button
                      onClick={() => openBookingModal(exp)}
                      className="btn btn-krishi btn-sm px-4 rounded-pill"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* My Appointments Tab */
        <div>
          {consultations.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No Appointments Scheduled"
              description="You have not booked any expert consultations yet. Reach out to an agronomist to resolve your soil and crop questions."
              actionText="Browse Agricultural Scientists"
              onAction={() => setActiveTab('experts')}
            />
          ) : (
            <div className="d-flex flex-column gap-3">
              {consultations.map((item) => (
                <div key={item._id} className="krishi-card p-4">
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.expertId?.image}
                        alt={item.expertId?.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: '50px', height: '50px' }}
                      />
                      <div>
                        <h5 className="fw-bold text-dark mb-0">{item.expertId?.name}</h5>
                        <span className="text-muted small">
                          Specialist in {item.expertId?.specialization}
                        </span>
                      </div>
                    </div>

                    <span className="badge bg-success-subtle text-success small px-3 py-1">
                      {item.status}
                    </span>
                  </div>

                  <div className="my-3 p-3 rounded-3 bg-light border border-light-subtle">
                    <div className="fw-bold text-dark small mb-1">
                      Topic: {item.topic}
                    </div>
                    <p className="text-muted small mb-0 lh-base">
                      <strong>Your Question: </strong>{item.question}
                    </p>
                  </div>

                  {item.expertReply && (
                    <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 small text-dark mb-3">
                      <strong>Scientist's Reply: </strong>{item.expertReply}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center small text-muted border-top border-light-subtle pt-2">
                    <span className="d-flex align-items-center gap-1">
                      <Calendar size={14} className="text-success" /> Scheduled for: {item.date} at {item.time}
                    </span>
                    <span className="text-success fw-semibold">Consultation Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Consultation Modal */}
      {showModal && selectedExpert && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">Schedule Consultation with {selectedExpert.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleBookSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Topic *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Yellow Rust Spray Advice or Soil pH Correction"
                      value={bookingForm.topic}
                      onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Preferred Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Preferred Time *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 11:30 AM"
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Describe Your Question in Detail *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Include details on crop variety, soil symptoms, previous fertilizer applications, or weather events..."
                      value={bookingForm.question}
                      onChange={(e) => setBookingForm({ ...bookingForm, question: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="p-2 rounded bg-light small text-muted">
                    Fee: <strong>{selectedExpert.consultationFee === 0 ? 'FREE' : `₹${selectedExpert.consultationFee}`}</strong> &middot; Availability: {selectedExpert.availability}
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Confirming...' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertConsultation;
