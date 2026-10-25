import React, { useState, useEffect } from 'react';
import { cropAPI, farmAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Sprout,
  Plus,
  Calendar,
  Layers,
  Droplets,
  Edit2,
  Trash2,
  Trees,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Clock,
} from 'lucide-react';

const STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest Ready'];

const CropManagement = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterStage, setFilterStage] = useState('All');
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    farmId: '',
    cropName: '',
    variety: '',
    area: '',
    sowingDate: '',
    expectedHarvestDate: '',
    growthStage: 'Vegetative',
    health: 'Healthy',
    irrigationStatus: 'Adequate',
    fertilizerUsed: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [cropsRes, farmsRes] = await Promise.all([cropAPI.getAll(), farmAPI.getAll()]);
      if (cropsRes.data.success) setCrops(cropsRes.data.crops);
      if (farmsRes.data.success) setFarms(farmsRes.data.farms);
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
    setEditingCrop(null);
    setFormData({
      farmId: farms[0]?._id || '',
      cropName: '',
      variety: '',
      area: '',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      growthStage: 'Vegetative',
      health: 'Healthy',
      irrigationStatus: 'Adequate',
      fertilizerUsed: 'Vermicompost + DAP',
      notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId?._id || crop.farmId,
      cropName: crop.cropName,
      variety: crop.variety,
      area: crop.area,
      sowingDate: crop.sowingDate ? new Date(crop.sowingDate).toISOString().split('T')[0] : '',
      expectedHarvestDate: crop.expectedHarvestDate
        ? new Date(crop.expectedHarvestDate).toISOString().split('T')[0]
        : '',
      growthStage: crop.growthStage,
      health: crop.health,
      irrigationStatus: crop.irrigationStatus,
      fertilizerUsed: crop.fertilizerUsed || '',
      notes: crop.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      if (editingCrop) {
        await cropAPI.update(editingCrop._id, formData);
        setMessage({ text: 'Crop details updated successfully!', type: 'success' });
      } else {
        await cropAPI.create(formData);
        setMessage({ text: 'Crop added to your farm portfolio!', type: 'success' });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Operation failed', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete crop "${name}"?`)) {
      try {
        await cropAPI.delete(id);
        setMessage({ text: 'Crop removed successfully', type: 'success' });
        fetchData();
      } catch (err) {
        setMessage({ text: 'Failed to delete crop', type: 'danger' });
      }
    }
  };

  const getDaysRemaining = (harvestDate) => {
    if (!harvestDate) return 0;
    const diff = new Date(harvestDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredCrops = filterStage === 'All' ? crops : crops.filter((c) => c.growthStage === filterStage);

  if (loading) {
    return <LoadingSpinner message="Loading your cultivated crops and growth stage data..." />;
  }

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">{t('crops.title')}</h3>
          <p className="text-muted small mb-0">{t('crops.subtitle')}</p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="All">All Growth Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={openAddModal} className="btn btn-krishi btn-sm px-3">
            <Plus size={16} /> {t('crops.addCrop')}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {crops.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No Crops Added Yet"
          description={t('crops.noCrops')}
          actionText="+ Add Your First Crop"
          onAction={openAddModal}
        />
      ) : (
        <div className="row g-4">
          {filteredCrops.map((crop) => {
            const currentStageIndex = STAGES.indexOf(crop.growthStage);
            const daysLeft = getDaysRemaining(crop.expectedHarvestDate);

            return (
              <div key={crop._id} className="col-md-6 col-lg-6">
                <div className="krishi-card p-4 h-100 d-flex flex-column krishi-card-hover">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                        <Sprout size={24} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="fw-bold text-dark mb-0">{crop.cropName}</h5>
                          <span
                            className={`badge ${
                              crop.health === 'Healthy'
                                ? 'bg-success-subtle text-success'
                                : crop.health === 'Moderate'
                                ? 'bg-warning-subtle text-warning-emphasis'
                                : 'bg-danger-subtle text-danger'
                            } small`}
                          >
                            {crop.health}
                          </span>
                        </div>
                        <span className="text-muted small">
                          Variety: <strong>{crop.variety}</strong> &middot; Farm: {crop.farmId?.farmName || 'Assigned Farm'}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex gap-1">
                      <button
                        onClick={() => openEditModal(crop)}
                        className="btn btn-sm btn-light border p-1 rounded-circle"
                        title="Edit crop"
                      >
                        <Edit2 size={14} className="text-secondary" />
                      </button>
                      <button
                        onClick={() => handleDelete(crop._id, crop.cropName)}
                        className="btn btn-sm btn-light border p-1 rounded-circle text-danger"
                        title="Delete crop"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Growth Stage Stepper Tracker */}
                  <div className="py-2">
                    <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
                      <span className="fw-semibold text-dark">Stage: {crop.growthStage}</span>
                      <span className="text-success fw-bold">
                        {Math.round(((currentStageIndex + 1) / STAGES.length) * 100)}% Complete
                      </span>
                    </div>

                    <div className="stage-tracker">
                      <div className="stage-line"></div>
                      {STAGES.map((st, i) => {
                        const isPastOrActive = i <= currentStageIndex;
                        return (
                          <div key={st} className={`stage-step ${isPastOrActive ? 'active' : ''}`}>
                            <div className="stage-dot">
                              {i < currentStageIndex ? '✓' : i + 1}
                            </div>
                            <span className="d-none d-sm-inline" style={{ fontSize: '0.7rem' }}>{st}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cultivation Key Info Grid */}
                  <div className="row g-2 py-3 border-top border-bottom border-light-subtle my-2 text-center">
                    <div className="col-4">
                      <span className="text-muted small d-block">Area</span>
                      <span className="fw-bold text-dark">{crop.area} Acres</span>
                    </div>
                    <div className="col-4 border-start border-end border-light-subtle">
                      <span className="text-muted small d-block">Irrigation</span>
                      <span className="fw-semibold text-dark small">{crop.irrigationStatus}</span>
                    </div>
                    <div className="col-4">
                      <span className="text-muted small d-block">Harvest In</span>
                      <span className="fw-bold text-success">
                        {daysLeft > 0 ? `${daysLeft} Days` : 'Ready!'}
                      </span>
                    </div>
                  </div>

                  <div className="small text-muted mt-2 flex-grow-1">
                    <div><strong>Fertilizer:</strong> {crop.fertilizerUsed || 'N/A'}</div>
                    {crop.notes && <div className="mt-1"><strong>Notes:</strong> {crop.notes}</div>}
                  </div>

                  <div className="mt-3 pt-2 border-top border-light-subtle d-flex justify-content-between align-items-center small text-muted">
                    <span>Sown: {new Date(crop.sowingDate).toLocaleDateString()}</span>
                    <span>Expected: {new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">
                  {editingCrop ? 'Edit Crop Parameters' : 'Add New Crop Record'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Select Farm Plot *</label>
                      <select
                        className="form-select"
                        value={formData.farmId}
                        onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                        required
                      >
                        {farms.map((f) => (
                          <option key={f._id} value={f._id}>{f.farmName} ({f.area} Acres)</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Crop Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Wheat, Soybean, Tomato"
                        value={formData.cropName}
                        onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Variety / Hybrid</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sharbati C-306"
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Cultivated Area (Acres) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="form-control"
                        placeholder="e.g. 4.0"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Sowing Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.sowingDate}
                        onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Expected Harvest Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.expectedHarvestDate}
                        onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Growth Stage</label>
                      <select
                        className="form-select"
                        value={formData.growthStage}
                        onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Crop Health</label>
                      <select
                        className="form-select"
                        value={formData.health}
                        onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                      >
                        <option value="Healthy">Healthy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Diseased">Diseased</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Irrigation Status</label>
                      <select
                        className="form-select"
                        value={formData.irrigationStatus}
                        onChange={(e) => setFormData({ ...formData, irrigationStatus: e.target.value })}
                      >
                        <option value="Adequate">Adequate</option>
                        <option value="Due Soon">Due Soon</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Not Needed">Not Needed</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Fertilizers / Manure Applied</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Vermicompost + Bio-NPK"
                        value={formData.fertilizerUsed}
                        onChange={(e) => setFormData({ ...formData, fertilizerUsed: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Field Observations / Notes</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Good vegetative branching, zero weed flushes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Saving...' : editingCrop ? 'Save Changes' : 'Add Crop'}
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

export default CropManagement;
