import React, { useState, useEffect } from 'react';
import { expertAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { GraduationCap, Plus, Edit2, Trash2, Star, Calendar, MessageSquare } from 'lucide-react';

const SPECIALIZATIONS = [
  'Soil Science',
  'Crop Management',
  'Pest Management',
  'Organic Farming',
  'Irrigation',
  'Horticulture',
];

const AdminExperts = () => {
  const [experts, setExperts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('experts');
  const [showModal, setShowModal] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Soil Science',
    experience: '10+ Years',
    qualification: 'Ph.D. Agriculture',
    rating: 4.8,
    consultationFee: 0,
    availability: 'Mon - Fri (10 AM - 4 PM)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  });

  const fetchData = async () => {
    try {
      const [expRes, consRes] = await Promise.all([
        expertAPI.getAll(),
        expertAPI.getAllAdmin(),
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
  }, []);

  const openAddModal = () => {
    setEditingExpert(null);
    setFormData({
      name: '',
      specialization: 'Soil Science',
      experience: '10+ Years',
      qualification: 'Ph.D. Agriculture',
      rating: 4.8,
      consultationFee: 0,
      availability: 'Mon - Fri (10 AM - 4 PM)',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });
    setShowModal(true);
  };

  const openEditModal = (exp) => {
    setEditingExpert(exp);
    setFormData({
      name: exp.name,
      specialization: exp.specialization,
      experience: exp.experience,
      qualification: exp.qualification,
      rating: exp.rating,
      consultationFee: exp.consultationFee,
      availability: exp.availability,
      image: exp.image,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      if (editingExpert) {
        await expertAPI.update(editingExpert._id, formData);
        setMessage({ text: 'Expert profile updated!', type: 'success' });
      } else {
        await expertAPI.create(formData);
        setMessage({ text: 'New expert verified and published!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete expert "${name}" from directory?`)) {
      try {
        await expertAPI.delete(id);
        setMessage({ text: 'Expert removed', type: 'success' });
        fetchData();
      } catch (err) {
        setMessage({ text: 'Delete failed', type: 'danger' });
      }
    }
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Agricultural Experts & Consultations</h3>
          <p className="text-muted small mb-0">Onboard scientists and review farmer appointments</p>
        </div>

        <div className="d-flex gap-2">
          <div className="btn-group btn-group-sm">
            <button
              onClick={() => setActiveTab('experts')}
              className={`btn ${activeTab === 'experts' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
            >
              Experts Directory ({experts.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`btn ${activeTab === 'bookings' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
            >
              All Appointments ({consultations.length})
            </button>
          </div>

          <button onClick={openAddModal} className="btn btn-krishi btn-sm px-3">
            <Plus size={16} /> Add Expert
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading expert registry..." />
      ) : activeTab === 'experts' ? (
        <div className="krishi-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Expert Name</th>
                  <th>Specialization</th>
                  <th>Experience & Qualification</th>
                  <th>Rating</th>
                  <th>Fee</th>
                  <th>Availability</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experts.map((exp) => (
                  <tr key={exp._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={exp.image}
                          alt={exp.name}
                          className="rounded-circle object-fit-cover"
                          style={{ width: '38px', height: '38px' }}
                        />
                        <span className="fw-bold text-dark">{exp.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success">{exp.specialization}</span>
                    </td>
                    <td className="text-muted">
                      {exp.experience} &middot; {exp.qualification}
                    </td>
                    <td>⭐ {exp.rating}</td>
                    <td className="fw-bold text-success">
                      {exp.consultationFee === 0 ? 'FREE' : `₹${exp.consultationFee}`}
                    </td>
                    <td className="text-muted small">{exp.availability}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="btn btn-sm btn-outline-secondary py-1 px-2"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id, exp.name)}
                          className="btn btn-sm btn-outline-danger py-1 px-2"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Consultations Table */
        <div className="krishi-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Farmer</th>
                  <th>Assigned Expert</th>
                  <th>Topic & Question</th>
                  <th>Appointment Date/Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="fw-bold text-dark">{c.userId?.name}</div>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>{c.userId?.email}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{c.expertId?.name}</div>
                      <span className="text-muted small">{c.expertId?.specialization}</span>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div className="fw-bold text-dark small">{c.topic}</div>
                      <div className="text-muted line-clamp-2 small">{c.question}</div>
                    </td>
                    <td>{c.date} at {c.time}</td>
                    <td>
                      <span className="badge bg-success small">{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Expert Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">
                  {editingExpert ? 'Edit Expert Profile' : 'Onboard Agricultural Expert'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Expert Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Dr. Rajesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Specialization *</label>
                      <select
                        className="form-select"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      >
                        {SPECIALIZATIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Experience *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="14+ Years"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Degree / Qualification</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ph.D. Soil Agronomy, ICAR"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        className="form-control"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0 for Free"
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({ ...formData, consultationFee: parseFloat(e.target.value) })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Availability Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Mon - Fri (10 AM - 4 PM)"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Photo Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Saving...' : 'Save Expert'}
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

export default AdminExperts;
