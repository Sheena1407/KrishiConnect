import React, { useState, useEffect } from 'react';
import { pestAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShieldAlert, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

const AdminPests = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    crop: '',
    pestName: '',
    symptoms: '',
    riskLevel: 'Medium',
    prevention: '',
    recommendation: '',
  });

  const fetchAlerts = async () => {
    try {
      const res = await pestAPI.getAll();
      if (res.data.success) {
        setAlerts(res.data.alerts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const openAddModal = () => {
    setEditingAlert(null);
    setFormData({
      crop: 'Wheat',
      pestName: '',
      symptoms: '',
      riskLevel: 'Medium',
      prevention: '',
      recommendation: '',
    });
    setShowModal(true);
  };

  const openEditModal = (a) => {
    setEditingAlert(a);
    setFormData({
      crop: a.crop,
      pestName: a.pestName,
      symptoms: a.symptoms,
      riskLevel: a.riskLevel,
      prevention: a.prevention,
      recommendation: a.recommendation,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      if (editingAlert) {
        await pestAPI.update(editingAlert._id, formData);
        setMessage({ text: 'Pest alert updated!', type: 'success' });
      } else {
        await pestAPI.create(formData);
        setMessage({ text: 'New regional pest alert published!', type: 'success' });
      }
      setShowModal(false);
      fetchAlerts();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete pest alert "${name}"?`)) {
      try {
        await pestAPI.delete(id);
        setMessage({ text: 'Alert deleted', type: 'success' });
        fetchAlerts();
      } catch (err) {
        setMessage({ text: 'Delete failed', type: 'danger' });
      }
    }
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Regional Pest & Disease Alerts Management</h3>
          <p className="text-muted small mb-0">Publish district-level warnings and recommended chemical/bio controls</p>
        </div>
        <button onClick={openAddModal} className="btn btn-krishi">
          <Plus size={16} /> Publish New Alert
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading pest surveillance alerts..." />
      ) : (
        <div className="krishi-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Target Crop</th>
                  <th>Pest / Disease Name</th>
                  <th>Risk Level</th>
                  <th>Symptoms</th>
                  <th>Treatment / Action</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <span className="badge bg-light text-secondary border fw-bold">{a.crop}</span>
                    </td>
                    <td className="fw-bold text-dark">{a.pestName}</td>
                    <td>
                      <span className={`badge ${a.riskLevel === 'High' ? 'bg-danger' : a.riskLevel === 'Medium' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {a.riskLevel} Risk
                      </span>
                    </td>
                    <td className="text-muted small line-clamp-2" style={{ maxWidth: '250px' }}>{a.symptoms}</td>
                    <td className="small text-dark line-clamp-2" style={{ maxWidth: '250px' }}>{a.recommendation}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => openEditModal(a)}
                          className="btn btn-sm btn-outline-secondary py-1 px-2"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id, a.pestName)}
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
      )}

      {/* Add / Edit Alert Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-danger text-white py-3 rounded-top-4">
                <h5 className="modal-title fw-bold">
                  {editingAlert ? 'Edit Pest Alert' : 'Publish Regional Pest Alert'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Target Crop *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Wheat, Soybean, Cotton..."
                        value={formData.crop}
                        onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Pest / Pathogen Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Yellow Stripe Rust"
                        value={formData.pestName}
                        onChange={(e) => setFormData({ ...formData, pestName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Risk Level</label>
                      <select
                        className="form-select"
                        value={formData.riskLevel}
                        onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                      >
                        <option value="Low">Low Risk</option>
                        <option value="Medium">Medium Risk</option>
                        <option value="High">High Critical Risk</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Identifiable Symptoms *</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Description of visual signs on leaves, stems or pods"
                        value={formData.symptoms}
                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Recommended Chemical / Bio Treatment *</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Dosage per acre, chemical name, water dilution"
                        value={formData.recommendation}
                        onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Cultural & Preventive Practices *</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Resistant varieties, pheromone traps, field sanitation"
                        value={formData.prevention}
                        onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-danger px-4">
                    {submitting ? 'Publishing...' : 'Publish Alert'}
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

export default AdminPests;
