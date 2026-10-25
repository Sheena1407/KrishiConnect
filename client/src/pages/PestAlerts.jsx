import React, { useState, useEffect } from 'react';
import { pestAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { ShieldAlert, Bug, CheckCircle2, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

const PestAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('All');
  const [resolvedIds, setResolvedIds] = useState([]);

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

  const toggleResolved = (id) => {
    setResolvedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getRiskBadge = (risk) => {
    if (risk === 'High') {
      return <span className="badge bg-danger text-white px-3 py-1">High Risk Alert</span>;
    }
    if (risk === 'Medium') {
      return <span className="badge bg-warning text-dark px-3 py-1">Medium Risk</span>;
    }
    return <span className="badge bg-success text-white px-3 py-1">Low Risk / Advisory</span>;
  };

  const filtered = filterRisk === 'All' ? alerts : alerts.filter((a) => a.riskLevel === filterRisk);

  if (loading) {
    return <LoadingSpinner message="Scanning regional pest outbreak surveillance data..." />;
  }

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
              <ShieldAlert size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Active Pest & Disease Alerts</h3>
          </div>
          <p className="text-muted small mb-0">
            Regional agricultural warnings and early containment strategies for your area.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Filter size={16} className="text-muted" />
          <select
            className="form-select form-select-sm"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Active Outbreaks Reported"
          description="Your block and crops currently have zero active disease or pest outbreak warnings."
        />
      ) : (
        <div className="row g-4">
          {filtered.map((item) => {
            const isResolved = resolvedIds.includes(item._id);

            return (
              <div key={item._id} className="col-lg-6">
                <div
                  className={`krishi-card p-4 h-100 d-flex flex-column transition ${
                    isResolved ? 'opacity-75 bg-light' : ''
                  }`}
                  style={{
                    borderLeft: `5px solid ${
                      item.riskLevel === 'High' ? '#DC3545' : item.riskLevel === 'Medium' ? '#FFC107' : '#198754'
                    }`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-light text-secondary border small">
                          Crop: {item.crop}
                        </span>
                        {getRiskBadge(item.riskLevel)}
                      </div>
                      <h4 className="fw-bold text-dark mb-0">{item.pestName}</h4>
                    </div>

                    <button
                      onClick={() => toggleResolved(item._id)}
                      className={`btn btn-sm ${
                        isResolved ? 'btn-success text-white' : 'btn-outline-secondary'
                      } rounded-pill px-3 py-1 small`}
                    >
                      {isResolved ? '✓ Resolved' : 'Mark as Inspected'}
                    </button>
                  </div>

                  <div className="mb-3">
                    <span className="text-muted small d-block fw-semibold">Symptoms to Look For:</span>
                    <p className="small text-dark mb-0 bg-light p-2 rounded-2 border border-light-subtle">
                      {item.symptoms}
                    </p>
                  </div>

                  <div className="mb-3">
                    <span className="text-success small d-block fw-bold">Recommended Treatment:</span>
                    <div className="small text-dark p-2 rounded-2 bg-success bg-opacity-10 border border-success border-opacity-25">
                      {item.recommendation}
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-top border-light-subtle d-flex justify-content-between align-items-center small text-muted">
                    <span>Prevention: <strong>{item.prevention}</strong></span>
                    <span>Surveillance Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PestAlerts;
