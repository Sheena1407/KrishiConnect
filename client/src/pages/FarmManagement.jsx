import React, { useState, useEffect } from 'react';
import { farmAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Trees, Plus, MapPin, Droplets, Layers, Edit2, Trash2, X, Check } from 'lucide-react';

const FarmManagement = () => {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    area: '',
    soilType: 'Black Soil',
    irrigationType: 'Drip Irrigation',
    waterSource: 'Borewell',
    farmingMethod: 'Organic Farming',
    description: '',
  });

  const fetchFarms = async () => {
    try {
      const res = await farmAPI.getAll();
      if (res.data.success) {
        setFarms(res.data.farms);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const openAddModal = () => {
    setEditingFarm(null);
    setFormData({
      farmName: '',
      location: '',
      area: '',
      soilType: 'Black Soil',
      irrigationType: 'Drip Irrigation',
      waterSource: 'Borewell',
      farmingMethod: 'Organic Farming',
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setFormData({
      farmName: farm.farmName,
      location: farm.location,
      area: farm.area,
      soilType: farm.soilType,
      irrigationType: farm.irrigationType,
      waterSource: farm.waterSource,
      farmingMethod: farm.farmingMethod,
      description: farm.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      if (editingFarm) {
        await farmAPI.update(editingFarm._id, formData);
        setMessage({ text: 'Farm details updated successfully!', type: 'success' });
      } else {
        await farmAPI.create(formData);
        setMessage({ text: 'New farm registered successfully!', type: 'success' });
      }
      setShowModal(false);
      fetchFarms();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Operation failed', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? Associated crops will also be removed.`)) {
      try {
        await farmAPI.delete(id);
        setMessage({ text: 'Farm removed successfully', type: 'success' });
        fetchFarms();
      } catch (err) {
        setMessage({ text: 'Failed to delete farm', type: 'danger' });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your registered agricultural farms..." />;
  }

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">{t('farms.title')}</h3>
          <p className="text-muted small mb-0">{t('farms.subtitle')}</p>
        </div>
        <button onClick={openAddModal} className="btn btn-krishi">
          <Plus size={16} /> {t('farms.addFarm')}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Farms List */}
      {farms.length === 0 ? (
        <EmptyState
          icon={Trees}
          title="No Farms Registered Yet"
          description="Register your first farm plot to begin managing crops, soil health parameters, and field activities."
          actionText="+ Register First Farm"
          onAction={openAddModal}
        />
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id} className="col-md-6 col-lg-4">
              <div className="krishi-card p-4 h-100 d-flex flex-column krishi-card-hover">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                      <Trees size={22} />
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-0">{farm.farmName}</h5>
                      <span className="text-muted small d-flex align-items-center gap-1 mt-1">
                        <MapPin size={13} className="text-danger" /> {farm.location}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      onClick={() => openEditModal(farm)}
                      className="btn btn-sm btn-light border p-1 rounded-circle"
                      title="Edit farm"
                    >
                      <Edit2 size={14} className="text-secondary" />
                    </button>
                    <button
                      onClick={() => handleDelete(farm._id, farm.farmName)}
                      className="btn btn-sm btn-light border p-1 rounded-circle text-danger"
                      title="Delete farm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="row g-2 py-3 border-top border-bottom border-light-subtle my-2">
                  <div className="col-6">
                    <span className="text-muted small">Total Area:</span>
                    <div className="fw-bold text-dark">{farm.area} Acres</div>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small">Soil Type:</span>
                    <div className="fw-semibold text-dark small">{farm.soilType}</div>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small">Irrigation:</span>
                    <div className="fw-semibold text-dark small d-flex align-items-center gap-1">
                      <Droplets size={13} className="text-info" /> {farm.irrigationType}
                    </div>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small">Method:</span>
                    <div className="fw-semibold text-success small">{farm.farmingMethod}</div>
                  </div>
                </div>

                <p className="small text-muted flex-grow-1 mt-2 mb-0" style={{ lineHeight: 1.5 }}>
                  {farm.description || 'No additional plot notes specified.'}
                </p>

                <div className="mt-3 pt-2 border-top border-light-subtle d-flex justify-content-between align-items-center small text-muted">
                  <span>Water: <strong>{farm.waterSource}</strong></span>
                  <span className="text-success fw-semibold">Active Plot</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Farm Modal (Add / Edit) */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">
                  {editingFarm ? 'Edit Farm Details' : 'Register New Farm'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Farm Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Green Valley Farm"
                        value={formData.farmName}
                        onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Farm Location / Village *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Shyampur, Sehore, MP"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Area (in Acres) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="form-control"
                        placeholder="e.g. 5.5"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Soil Type</label>
                      <select
                        className="form-select"
                        value={formData.soilType}
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                      >
                        <option value="Black Soil">Black Soil</option>
                        <option value="Alluvial Soil">Alluvial Soil</option>
                        <option value="Red Soil">Red Soil</option>
                        <option value="Clay Soil">Clay Soil</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Laterite Soil">Laterite Soil</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Irrigation Type</label>
                      <select
                        className="form-select"
                        value={formData.irrigationType}
                        onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                      >
                        <option value="Drip Irrigation">Drip Irrigation</option>
                        <option value="Sprinkler">Sprinkler</option>
                        <option value="Canal/Flood">Canal/Flood</option>
                        <option value="Tube Well">Tube Well</option>
                        <option value="Rainfed">Rainfed</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Water Source</label>
                      <select
                        className="form-select"
                        value={formData.waterSource}
                        onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
                      >
                        <option value="Borewell">Borewell</option>
                        <option value="Canal">Canal</option>
                        <option value="River">River</option>
                        <option value="Pond/Lake">Pond/Lake</option>
                        <option value="Rainwater Harvesting">Rainwater Harvesting</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Farming Method</label>
                      <select
                        className="form-select"
                        value={formData.farmingMethod}
                        onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value })}
                      >
                        <option value="Organic Farming">Organic Farming</option>
                        <option value="Conventional">Conventional</option>
                        <option value="Natural/Zero Budget">Natural/Zero Budget</option>
                        <option value="Hydroponics">Hydroponics</option>
                        <option value="Precision Farming">Precision Farming</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Plot Description / Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Add notes about solar pump, fencing, crop history, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Saving...' : editingFarm ? 'Save Changes' : 'Register Farm'}
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

export default FarmManagement;
