import React, { useState, useEffect } from 'react';
import { activityAPI, farmAPI, cropAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  CalendarCheck,
  Plus,
  Droplets,
  FlaskConical,
  Bug,
  Scissors,
  CheckCircle2,
  Trash2,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';

const FarmPlanner = () => {
  const [activities, setActivities] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    farmId: '',
    cropId: '',
    title: '',
    description: '',
    activityType: 'Irrigation',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 AM',
  });

  const fetchData = async () => {
    try {
      const [actsRes, farmsRes, cropsRes] = await Promise.all([
        activityAPI.getAll(),
        farmAPI.getAll(),
        cropAPI.getAll(),
      ]);
      if (actsRes.data.success) setActivities(actsRes.data.activities);
      if (farmsRes.data.success) {
        setFarms(farmsRes.data.farms);
        if (farmsRes.data.farms.length > 0 && !formData.farmId) {
          setFormData((prev) => ({ ...prev, farmId: farmsRes.data.farms[0]._id }));
        }
      }
      if (cropsRes.data.success) setCrops(cropsRes.data.crops);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await activityAPI.create(formData);
      setMessage({ text: 'Activity scheduled successfully in farm planner!', type: 'success' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to schedule', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await activityAPI.toggle(id);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this scheduled activity?')) {
      try {
        await activityAPI.delete(id);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getActivityBadge = (type) => {
    switch (type) {
      case 'Irrigation':
        return <span className="badge bg-info-subtle text-info"><Droplets size={12} className="me-1" /> Irrigation</span>;
      case 'Fertilizer':
        return <span className="badge bg-warning-subtle text-warning-emphasis"><FlaskConical size={12} className="me-1" /> Fertilizer</span>;
      case 'Pest inspection':
        return <span className="badge bg-danger-subtle text-danger"><Bug size={12} className="me-1" /> Pest Scouting</span>;
      case 'Harvesting':
        return <span className="badge bg-success-subtle text-success"><Scissors size={12} className="me-1" /> Harvesting</span>;
      case 'Sowing':
        return <span className="badge bg-success text-white">Sowing</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary">General Task</span>;
    }
  };

  const filtered = filterType === 'All' ? activities : activities.filter((a) => a.activityType === filterType);

  if (loading) {
    return <LoadingSpinner message="Loading your farm operational calendar..." />;
  }

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
              <CalendarCheck size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Farm Planner (कृषि कार्य योजना)</h3>
          </div>
          <p className="text-muted small mb-0">
            Schedule, monitor, and check off field tasks like irrigation cycles, fertilizer doses, and scouting.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Toggle View */}
          <div className="btn-group btn-group-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`btn ${viewMode === 'calendar' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
            >
              Calendar Cards
            </button>
          </div>

          <button onClick={() => setShowModal(true)} className="btn btn-krishi btn-sm px-3">
            <Plus size={16} /> Schedule Task
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Filter Chips */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {['All', 'Irrigation', 'Fertilizer', 'Pest inspection', 'Harvesting', 'Sowing', 'Soil testing'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`btn btn-sm rounded-pill px-3 py-1 ${
              filterType === type ? 'btn-success text-white fw-bold' : 'btn-outline-secondary bg-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Scheduled Farm Tasks"
          description="Your planner is currently free. Add a new task for irrigation, spraying, or harvesting."
          actionText="+ Schedule First Task"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="row g-3">
          {filtered.map((act) => (
            <div key={act._id} className={viewMode === 'calendar' ? 'col-md-6 col-lg-4' : 'col-12'}>
              <div
                className={`krishi-card p-3 p-md-4 h-100 d-flex flex-column transition ${
                  act.status === 'Completed' ? 'bg-light text-muted opacity-75' : 'bg-white'
                }`}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    {getActivityBadge(act.activityType)}
                    <span className="badge bg-light text-secondary border small">
                      {act.status}
                    </span>
                  </div>

                  <div className="d-flex gap-1">
                    <button
                      onClick={() => handleToggle(act._id)}
                      className={`btn btn-sm ${
                        act.status === 'Completed' ? 'btn-success text-white' : 'btn-outline-secondary'
                      } rounded-pill px-2 py-0 small`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {act.status === 'Completed' ? '✓ Done' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => handleDelete(act._id)}
                      className="btn btn-sm btn-link text-danger p-0 ms-2"
                      title="Delete activity"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h5 className={`fw-bold mb-1 ${act.status === 'Completed' ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                  {act.title}
                </h5>

                {act.description && (
                  <p className="small text-muted mb-2 flex-grow-1">{act.description}</p>
                )}

                <div className="mt-auto pt-2 border-top border-light-subtle d-flex flex-wrap justify-content-between align-items-center small text-muted">
                  <span className="d-flex align-items-center gap-1">
                    <Calendar size={14} className="text-success" />
                    <strong>{act.date}</strong> at {act.time}
                  </span>
                  <span>
                    Plot: <strong>{act.farmId?.farmName || 'Farm'}</strong>
                    {act.cropId && ` (${act.cropId?.cropName})`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Activity Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">Schedule Farm Activity</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Task Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. CRI Irrigation & Urea Feeding"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Activity Type</label>
                      <select
                        className="form-select"
                        value={formData.activityType}
                        onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                      >
                        <option value="Irrigation">Irrigation</option>
                        <option value="Fertilizer">Fertilizer Application</option>
                        <option value="Pest inspection">Pest Inspection</option>
                        <option value="Harvesting">Harvesting</option>
                        <option value="Sowing">Sowing</option>
                        <option value="Soil testing">Soil Testing</option>
                        <option value="General">General Maintenance</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Target Farm *</label>
                      <select
                        className="form-select"
                        value={formData.farmId}
                        onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                        required
                      >
                        {farms.map((f) => (
                          <option key={f._id} value={f._id}>{f.farmName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Associated Crop</label>
                      <select
                        className="form-select"
                        value={formData.cropId}
                        onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                      >
                        <option value="">None / General Plot</option>
                        {crops.map((c) => (
                          <option key={c._id} value={c._id}>{c.cropName} ({c.variety})</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Time of Day</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 07:30 AM"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description & Instructions</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="e.g. Apply 25 kg/acre urea before morning watering"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Scheduling...' : 'Save Activity'}
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

export default FarmPlanner;
