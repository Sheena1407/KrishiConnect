import React, { useState, useEffect } from 'react';
import { soilAPI, farmAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  FlaskConical,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';

const SoilHealth = () => {
  const [reports, setReports] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    farmId: '',
    pH: 7.2,
    nitrogen: 320,
    phosphorus: 35,
    potassium: 210,
    moisture: 42,
    organicCarbon: 0.75,
  });

  const fetchData = async () => {
    try {
      const [reportsRes, farmsRes] = await Promise.all([soilAPI.getAll(), farmAPI.getAll()]);
      if (reportsRes.data.success) {
        setReports(reportsRes.data.reports);
        if (reportsRes.data.reports.length > 0 && !activeReport) {
          setActiveReport(reportsRes.data.reports[0]);
        }
      }
      if (farmsRes.data.success) {
        setFarms(farmsRes.data.farms);
        if (farmsRes.data.farms.length > 0 && !formData.farmId) {
          setFormData((prev) => ({ ...prev, farmId: farmsRes.data.farms[0]._id }));
        }
      }
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
      const res = await soilAPI.create(formData);
      if (res.data.success) {
        setMessage({ text: 'Soil test report calculated and saved!', type: 'success' });
        setActiveReport(res.data.report);
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Calculation failed', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this soil health record?')) {
      try {
        await soilAPI.delete(id);
        setMessage({ text: 'Soil report deleted', type: 'success' });
        fetchData();
        if (activeReport?._id === id) {
          setActiveReport(null);
        }
      } catch (e) {
        setMessage({ text: 'Failed to delete report', type: 'danger' });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving laboratory soil health assays..." />;
  }

  // Active report metrics
  const rep = activeReport || reports[0];

  const getStatus = (val, minOpt, maxOpt) => {
    if (val >= minOpt && val <= maxOpt) return { label: 'Optimal', badge: 'bg-success-subtle text-success' };
    if (val < minOpt) return { label: 'Low', badge: 'bg-warning-subtle text-warning-emphasis' };
    return { label: 'High', badge: 'bg-info-subtle text-info' };
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
              <FlaskConical size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Soil Health & Soil Score</h3>
          </div>
          <p className="text-muted small mb-0">
            Monitor macronutrients (N-P-K), soil pH acidity, moisture, and organic carbon retention.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-krishi">
          <Plus size={16} /> Enter New Soil Test
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {reports.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No Soil Reports Saved"
          description="Enter your soil testing parameters (pH, Nitrogen, Phosphorus, Potassium, Moisture, Organic Carbon) to calculate your Soil Health Score."
          actionText="+ Calculate First Soil Score"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="row g-4">
          {/* Main Selected Soil Health Overview */}
          <div className="col-lg-8">
            <div className="krishi-card p-4 mb-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-2 mb-4">
                <div>
                  <span className="badge bg-success bg-opacity-10 text-success small px-3 py-1 mb-2">
                    Plot: {rep?.farmId?.farmName || 'Primary Farm'} &middot; {rep?.farmId?.soilType || 'Black Soil'}
                  </span>
                  <h4 className="fw-bold text-dark mb-1">Comprehensive Soil Health Assessment</h4>
                  <span className="text-muted small d-flex align-items-center gap-1">
                    <Calendar size={14} /> Tested on: {new Date(rep?.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Score Big Pill */}
                <div className="text-sm-end p-3 rounded-4 text-center" style={{ backgroundColor: '#E8F5E9', minWidth: '130px' }}>
                  <div className="display-5 fw-extrabold text-success lh-1">{rep?.healthScore}</div>
                  <span className="text-muted small fw-semibold">Soil Health Score</span>
                </div>
              </div>

              {/* Nutrient Progress Bars Grid */}
              <div className="row g-3 mb-4">
                {/* 1. pH */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">Soil pH</span>
                      <span className={`badge ${getStatus(rep?.pH, 6.5, 7.5).badge} small`}>
                        {rep?.pH} ({getStatus(rep?.pH, 6.5, 7.5).label})
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${Math.min(100, (rep?.pH / 14) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                      <span>Acidic (&lt;6.5)</span>
                      <span>Optimal (6.5-7.5)</span>
                      <span>Alkaline (&gt;7.5)</span>
                    </div>
                  </div>
                </div>

                {/* 2. Nitrogen */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">Available Nitrogen (N)</span>
                      <span className={`badge ${getStatus(rep?.nitrogen, 280, 450).badge} small`}>
                        {rep?.nitrogen} kg/ha
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${Math.min(100, (rep?.nitrogen / 500) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                      <span>Deficient (&lt;280)</span>
                      <span>Medium (280-450)</span>
                      <span>High (&gt;450)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Phosphorus */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">Available Phosphorus (P)</span>
                      <span className={`badge ${getStatus(rep?.phosphorus, 25, 55).badge} small`}>
                        {rep?.phosphorus} kg/ha
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${Math.min(100, (rep?.phosphorus / 60) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                      <span>Low (&lt;25)</span>
                      <span>Adequate (25-55)</span>
                      <span>High (&gt;55)</span>
                    </div>
                  </div>
                </div>

                {/* 4. Potassium */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">Available Potassium (K)</span>
                      <span className={`badge ${getStatus(rep?.potassium, 150, 300).badge} small`}>
                        {rep?.potassium} kg/ha
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${Math.min(100, (rep?.potassium / 350) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                      <span>Low (&lt;150)</span>
                      <span>Medium (150-300)</span>
                      <span>High (&gt;300)</span>
                    </div>
                  </div>
                </div>

                {/* 5. Moisture */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">Soil Moisture</span>
                      <span className="badge bg-secondary-subtle text-secondary small">{rep?.moisture}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-teal"
                        role="progressbar"
                        style={{ width: `${rep?.moisture}%`, backgroundColor: '#20c997' }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                      <span>Dry (&lt;30%)</span>
                      <span>Optimal (35-60%)</span>
                      <span>Saturated (&gt;65%)</span>
                    </div>
                  </div>
                </div>

                {/* 6. Organic Carbon */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border border-light-subtle bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">Organic Carbon (OC)</span>
                      <span className={`badge ${getStatus(rep?.organicCarbon, 0.75, 1.5).badge} small`}>
                        {rep?.organicCarbon}%
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${Math.min(100, (rep?.organicCarbon / 1.5) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                      <span>Low (&lt;0.5%)</span>
                      <span>Medium (0.5-0.75%)</span>
                      <span>High (&gt;0.75%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Recommendations Box */}
              <div className="p-3 rounded-3" style={{ backgroundColor: '#FEFAE0', border: '1px solid #FAEDCD' }}>
                <h6 className="fw-bold text-warning-emphasis mb-2 d-flex align-items-center gap-2">
                  <Lightbulb size={18} className="text-warning" />
                  <span>Clinical Soil Recommendations</span>
                </h6>
                <ul className="mb-0 ps-3 small text-dark d-flex flex-column gap-2">
                  {rep?.recommendations?.map((rec, i) => (
                    <li key={i} className="lh-sm">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* History / Previous Soil Reports List */}
          <div className="col-lg-4">
            <div className="krishi-card p-4">
              <h5 className="fw-bold text-dark mb-3">Saved Test Reports</h5>
              <div className="d-flex flex-column gap-2">
                {reports.map((r) => (
                  <div
                    key={r._id}
                    onClick={() => setActiveReport(r)}
                    className={`p-3 rounded-3 border cursor-pointer transition ${
                      r._id === rep?._id ? 'border-success bg-success bg-opacity-10' : 'bg-light bg-opacity-50'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small">
                        {r.farmId?.farmName || 'Farm Plot'}
                      </span>
                      <span className="badge bg-success text-white small">
                        Score: {r.healthScore}/100
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center text-muted small" style={{ fontSize: '0.78rem' }}>
                      <span>pH: {r.pH} &middot; OC: {r.organicCarbon}%</span>
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-end mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r._id);
                        }}
                        className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                        style={{ fontSize: '0.72rem' }}
                      >
                        Delete Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enter New Soil Report Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">Enter Laboratory Soil Health Assay</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Select Farm Plot *</label>
                      <select
                        className="form-select"
                        value={formData.farmId}
                        onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                        required
                      >
                        {farms.map((f) => (
                          <option key={f._id} value={f._id}>{f.farmName} ({f.location})</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Soil pH (0 - 14) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        className="form-control"
                        value={formData.pH}
                        onChange={(e) => setFormData({ ...formData, pH: parseFloat(e.target.value) })}
                        required
                      />
                      <span className="small text-muted" style={{ fontSize: '0.7rem' }}>Optimal: 6.5 - 7.5</span>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Nitrogen (kg/ha) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.nitrogen}
                        onChange={(e) => setFormData({ ...formData, nitrogen: parseFloat(e.target.value) })}
                        required
                      />
                      <span className="small text-muted" style={{ fontSize: '0.7rem' }}>Optimal: 280 - 450</span>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Phosphorus (kg/ha) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.phosphorus}
                        onChange={(e) => setFormData({ ...formData, phosphorus: parseFloat(e.target.value) })}
                        required
                      />
                      <span className="small text-muted" style={{ fontSize: '0.7rem' }}>Optimal: 25 - 55</span>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Potassium (kg/ha) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.potassium}
                        onChange={(e) => setFormData({ ...formData, potassium: parseFloat(e.target.value) })}
                        required
                      />
                      <span className="small text-muted" style={{ fontSize: '0.7rem' }}>Optimal: 150 - 300</span>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Moisture (%) *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        value={formData.moisture}
                        onChange={(e) => setFormData({ ...formData, moisture: parseFloat(e.target.value) })}
                        required
                      />
                      <span className="small text-muted" style={{ fontSize: '0.7rem' }}>Optimal: 35% - 60%</span>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Organic Carbon (%) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        value={formData.organicCarbon}
                        onChange={(e) => setFormData({ ...formData, organicCarbon: parseFloat(e.target.value) })}
                        required
                      />
                      <span className="small text-muted" style={{ fontSize: '0.7rem' }}>Optimal: &gt; 0.75%</span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Calculating...' : 'Compute Health Score & Save'}
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

export default SoilHealth;
