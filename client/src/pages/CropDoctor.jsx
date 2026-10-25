import React, { useState } from 'react';
import { cropDoctorAPI } from '../services/api';
import {
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';

const SYMPTOMS_LIST = [
  { id: 'Yellow leaves', label: 'Yellow Leaves (पत्तियों का पीला पड़ना)', icon: '🍂' },
  { id: 'Brown spots', label: 'Brown Spots / Blight (भूरे धब्बे या झुलसा)', icon: '🟤' },
  { id: 'Wilting', label: 'Wilting / Drooping (मुरझाना या सूखना)', icon: '🥀' },
  { id: 'Leaf holes', label: 'Leaf Holes / Chewed Leaves (पत्तियों में छेद)', icon: '🐛' },
  { id: 'Insect damage', label: 'Visible Insects / Sucking Pests (कीट प्रकोप)', icon: '🐜' },
  { id: 'Slow growth', label: 'Slow Growth / Stunted Bush (कमज़ोर विकास)', icon: '🌱' },
];

const CROPS_LIST = [
  'Wheat',
  'Soybean',
  'Cotton',
  'Chickpea (Chana)',
  'Tomato',
  'Mustard',
  'General',
];

const CropDoctor = () => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedSymptom, setSelectedSymptom] = useState('Yellow leaves');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (crop = selectedCrop, symptom = selectedSymptom) => {
    setLoading(true);
    try {
      const res = await cropDoctorAPI.diagnose({ crop, symptom });
      if (res.data.success) {
        setDiagnosis(res.data.diagnosis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Initial diagnose on load
  React.useEffect(() => {
    handleDiagnose('Wheat', 'Yellow leaves');
  }, []);

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
            <Stethoscope size={24} />
          </span>
          <h3 className="fw-bold text-dark mb-0">Crop Doctor (रोग एवं कीट निदान)</h3>
        </div>
        <p className="text-muted small">
          Instant agronomic diagnosis: Select your crop and observed field symptom to uncover root causes and clinical remediation.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Selector Panel */}
        <div className="col-lg-5">
          <div className="krishi-card p-4">
            <h5 className="fw-bold text-dark mb-3">1. Select Crop</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {CROPS_LIST.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => {
                    setSelectedCrop(crop);
                    handleDiagnose(crop, selectedSymptom);
                  }}
                  className={`btn btn-sm rounded-pill px-3 py-1 ${
                    selectedCrop === crop ? 'btn-success fw-bold text-white' : 'btn-outline-secondary'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            <h5 className="fw-bold text-dark mb-3">2. Select Observed Symptom</h5>
            <div className="d-flex flex-column gap-2 mb-4">
              {SYMPTOMS_LIST.map((sym) => (
                <div
                  key={sym.id}
                  onClick={() => {
                    setSelectedSymptom(sym.id);
                    handleDiagnose(selectedCrop, sym.id);
                  }}
                  className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer transition ${
                    selectedSymptom === sym.id
                      ? 'border-success bg-success bg-opacity-10'
                      : 'border-light-subtle bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5">{sym.icon}</span>
                    <span className="small fw-semibold text-dark">{sym.label}</span>
                  </div>
                  {selectedSymptom === sym.id && <CheckCircle2 size={18} className="text-success" />}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleDiagnose(selectedCrop, selectedSymptom)}
              disabled={loading}
              className="btn btn-krishi w-100 py-2"
            >
              {loading ? 'Diagnosing...' : 'Run Clinical Diagnosis'}
            </button>
          </div>
        </div>

        {/* Right Diagnosis Result Card */}
        <div className="col-lg-7">
          {loading ? (
            <div className="krishi-card p-5 text-center text-muted">
              <div className="spinner-border text-danger spinner-border-sm me-2"></div>
              Analyzing plant pathology symptoms...
            </div>
          ) : !diagnosis ? (
            <div className="krishi-card p-5 text-center text-muted">
              Select a crop and symptom on the left to see diagnosis.
            </div>
          ) : (
            <div className="krishi-card p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="badge bg-danger-subtle text-danger small px-3 py-1 mb-2">
                    Diagnosis: {diagnosis.crop} &middot; {diagnosis.symptom}
                  </span>
                  <h3 className="fw-bold text-dark mb-1">{diagnosis.problem}</h3>
                  <span className="badge bg-warning-subtle text-warning-emphasis small">
                    Severity: {diagnosis.severity}
                  </span>
                </div>
                <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger">
                  <Stethoscope size={28} />
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="mb-4">
                <h6 className="fw-bold text-secondary text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                  Pathological Symptoms Observed
                </h6>
                <p className="text-dark small bg-light p-3 rounded-3 border border-light-subtle mb-0 lh-base">
                  {diagnosis.symptomsObserved}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="mb-4">
                <h6 className="fw-bold text-success text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                  Recommended Action (उपचार)
                </h6>
                <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 small text-dark lh-base">
                  <strong>Dosage & Spray: </strong>{diagnosis.recommendedAction}
                </div>
              </div>

              {/* Prevention Guide */}
              <div className="mb-4">
                <h6 className="fw-bold text-warning-emphasis text-uppercase small" style={{ letterSpacing: '0.5px' }}>
                  Long-term Prevention & Cultural Practices
                </h6>
                <div className="p-3 rounded-3 bg-sand border border-warning border-opacity-25 small text-dark lh-base">
                  {diagnosis.prevention}
                </div>
              </div>

              {/* Required Educational Disclaimer */}
              <div className="p-3 rounded-3 bg-light border border-light-subtle small text-muted d-flex align-items-start gap-2">
                <Info size={18} className="text-secondary flex-shrink-0 mt-1" />
                <span className="lh-sm" style={{ fontSize: '0.78rem' }}>
                  <strong>Educational Disclaimer:</strong> {diagnosis.disclaimer}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDoctor;
