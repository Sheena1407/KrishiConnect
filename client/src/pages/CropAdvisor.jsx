import React, { useState, useEffect } from 'react';
import { cropAdvisorAPI, farmAPI } from '../services/api';
import { Compass, Sparkles, Droplets, Calendar, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';

const CropAdvisor = () => {
  const [inputs, setInputs] = useState({
    location: 'Bhopal, Madhya Pradesh',
    soilType: 'Black Soil',
    soilPH: 7.0,
    season: 'Rabi',
    waterAvailability: 'Moderate',
    farmSize: 5,
  });

  const [farms, setFarms] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await farmAPI.getAll();
        if (res.data.success && res.data.farms.length > 0) {
          setFarms(res.data.farms);
          const first = res.data.farms[0];
          setInputs((prev) => ({
            ...prev,
            location: first.location,
            soilType: first.soilType,
            farmSize: first.area,
          }));
        }
      } catch (e) {
        // ignore
      }
    };
    fetchFarms();
    // initial recommendation
    handleEvaluate();
  }, []);

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await cropAdvisorAPI.recommend(inputs);
      if (res.data.success) {
        setRecommendations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectFarm = (farmId) => {
    const selected = farms.find((f) => f._id === farmId);
    if (selected) {
      setInputs((prev) => ({
        ...prev,
        location: selected.location,
        soilType: selected.soilType,
        farmSize: selected.area,
      }));
    }
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
            <Compass size={24} />
          </span>
          <h3 className="fw-bold text-dark mb-0">Smart Crop Advisor</h3>
        </div>
        <p className="text-muted small">
          Rule-based agronomic engine recommending best crops matching your plot's soil chemistry, season and water supply.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Form: Inputs */}
        <div className="col-lg-4">
          <div className="krishi-card p-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <span>🌾</span> Farm Parameters
            </h5>

            {farms.length > 0 && (
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Auto-fill from Your Farm</label>
                <select className="form-select form-select-sm" onChange={(e) => selectFarm(e.target.value)}>
                  <option value="">-- Choose My Farm Plot --</option>
                  {farms.map((f) => (
                    <option key={f._id} value={f._id}>{f.farmName} ({f.soilType})</option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleEvaluate}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Location / Region</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={inputs.location}
                  onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Soil Type</label>
                <select
                  className="form-select form-select-sm"
                  value={inputs.soilType}
                  onChange={(e) => setInputs({ ...inputs, soilType: e.target.value })}
                >
                  <option value="Black Soil">Black Cotton Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Clay Soil">Clay Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="form-label small fw-semibold text-dark">Soil pH Level</label>
                  <span className="badge bg-success-subtle text-success small">{inputs.soilPH}</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="5.5"
                  max="8.5"
                  step="0.1"
                  value={inputs.soilPH}
                  onChange={(e) => setInputs({ ...inputs, soilPH: parseFloat(e.target.value) })}
                />
                <div className="d-flex justify-content-between small text-muted" style={{ fontSize: '0.72rem' }}>
                  <span>5.5 (Acidic)</span>
                  <span>7.0 (Neutral)</span>
                  <span>8.5 (Alkaline)</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Farming Season</label>
                <select
                  className="form-select form-select-sm"
                  value={inputs.season}
                  onChange={(e) => setInputs({ ...inputs, season: e.target.value })}
                >
                  <option value="Rabi">Rabi (Winter: Oct - Mar)</option>
                  <option value="Kharif">Kharif (Monsoon: Jun - Oct)</option>
                  <option value="Zaid">Zaid (Summer: Mar - Jun)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Water Availability</label>
                <select
                  className="form-select form-select-sm"
                  value={inputs.waterAvailability}
                  onChange={(e) => setInputs({ ...inputs, waterAvailability: e.target.value })}
                >
                  <option value="High">Abundant (Canal + Borewell Drip)</option>
                  <option value="Moderate">Moderate (Borewell / Sprinkler)</option>
                  <option value="Low">Limited / Rainfed Only</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Plot Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  className="form-control form-control-sm"
                  value={inputs.farmSize}
                  onChange={(e) => setInputs({ ...inputs, farmSize: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-krishi w-100 py-2">
                {loading ? 'Evaluating Agronomy...' : 'Generate Recommendations'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Area: Recommendations Cards */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <Sparkles size={18} className="text-warning" />
              <span>Recommended Crops ({recommendations?.topRecommendations?.length || 0})</span>
            </h5>
            <span className="text-muted small">
              Matched for {inputs.season} &middot; {inputs.soilType}
            </span>
          </div>

          {loading ? (
            <div className="krishi-card p-5 text-center text-muted small">
              <div className="spinner-border text-success spinner-border-sm me-2"></div>
              Calculating suitability scores against ICAR crop matrix...
            </div>
          ) : !recommendations?.topRecommendations ? (
            <div className="krishi-card p-5 text-center text-muted">
              Adjust parameters and click generate to see matched crops.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {recommendations.topRecommendations.map((crop, idx) => (
                <div key={crop.name} className="krishi-card p-4 krishi-card-hover">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-circle bg-success text-white px-2 py-1 small">
                          #{idx + 1}
                        </span>
                        <h4 className="fw-bold text-dark mb-0">{crop.name}</h4>
                        <span className="badge bg-success bg-opacity-10 text-success fw-semibold small">
                          {crop.suitabilityRating}
                        </span>
                      </div>
                      <p className="text-muted small mb-0 mt-1">{crop.description}</p>
                    </div>

                    {/* Suitability Score Pill */}
                    <div className="text-md-end">
                      <div className="display-6 fw-bold text-success lh-1">{crop.suitabilityScore}%</div>
                      <span className="text-muted small fw-semibold">Suitability Score</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="row g-2 py-3 border-top border-bottom border-light-subtle my-2 text-center bg-light bg-opacity-50 rounded-3">
                    <div className="col-sm-3 col-6">
                      <span className="text-muted small d-block">Duration</span>
                      <span className="fw-bold text-dark small">{crop.durationDays}</span>
                    </div>
                    <div className="col-sm-3 col-6">
                      <span className="text-muted small d-block">Water Needed</span>
                      <span className="fw-bold text-primary small">{crop.waterRequirement}</span>
                    </div>
                    <div className="col-sm-3 col-6">
                      <span className="text-muted small d-block">Expected Yield / Acre</span>
                      <span className="fw-bold text-success small">{crop.expectedYieldPerAcre}</span>
                    </div>
                    <div className="col-sm-3 col-6">
                      <span className="text-muted small d-block">Profit Potential</span>
                      <span className="fw-bold text-warning-emphasis small">{crop.profitPotential}</span>
                    </div>
                  </div>

                  {/* Agronomic Care Tip */}
                  <div className="p-3 rounded-3 bg-sand small text-dark mt-2 border border-warning border-opacity-25">
                    <strong>💡 Agronomic Care Tip:</strong> {crop.basicCare}
                  </div>

                  <div className="mt-3 pt-2 d-flex justify-content-between align-items-center small text-muted">
                    <span>Recommended Hybrids: <strong>{crop.varietyOptions.join(', ')}</strong></span>
                    <span className="text-success fw-semibold">Demand: {crop.marketDemand}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropAdvisor;
