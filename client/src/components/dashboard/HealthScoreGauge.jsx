import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HealthScoreGauge = ({ healthData }) => {
  const score = healthData?.score || 84;
  const metrics = healthData?.metrics || {
    soil: { status: 'Good', label: 'Soil Health', color: 'success' },
    crops: { status: 'Healthy', label: 'Crops Health', color: 'success' },
    water: { status: 'Needs Attention', label: 'Water Management', color: 'warning' },
    pest: { status: 'Low', label: 'Pest Risk', color: 'success' },
  };
  const suggestions = healthData?.suggestions || [
    'Apply 2 tons of organic vermicompost to elevate organic carbon and microbial activity.',
    'Upgrade from flood to micro-drip irrigation to save 45% water.',
    'Deploy yellow sticky and pheromone traps to control active insect pests early.',
  ];

  // Circle SVG stroke values
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 80) return '#2D6A4F';
    if (val >= 60) return '#E9C46A';
    return '#E76F51';
  };

  return (
    <div className="krishi-card p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Farm Health Score</h6>
            <span className="text-muted small">Real-time agronomic rating</span>
          </div>
        </div>
        <Link to="/analytics" className="btn btn-sm btn-link text-success p-0 text-decoration-none small d-flex align-items-center">
          Full Report <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="row align-items-center my-3 g-3">
        {/* Gauge Circular Meter */}
        <div className="col-sm-5 text-center position-relative d-flex justify-content-center">
          <svg width="140" height="140" className="transform -rotate-90">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#E8ECE9"
              strokeWidth="11"
              fill="transparent"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={getScoreColor(score)}
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <div className="display-6 fw-bold text-dark lh-1">{score}</div>
            <div className="text-muted small fw-semibold">/ 100</div>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="col-sm-7">
          <div className="d-flex flex-column gap-2">
            {Object.entries(metrics).map(([key, item]) => {
              const isGood = item.color === 'success';
              return (
                <div
                  key={key}
                  className="p-2 px-3 rounded-3 border border-light-subtle d-flex align-items-center justify-content-between bg-light bg-opacity-25"
                >
                  <div className="d-flex align-items-center gap-2 small fw-semibold text-dark">
                    <span style={{ color: isGood ? '#2D6A4F' : '#E76F51' }}>
                      {isGood ? '🟢' : '🟡'}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`badge ${
                      isGood ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'
                    } small`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions Box */}
      <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#FEFAE0', border: '1px solid #FAEDCD' }}>
        <div className="d-flex align-items-center gap-2 text-warning-emphasis fw-bold small mb-2">
          <Lightbulb size={16} className="text-warning" />
          <span>Improve Your Score:</span>
        </div>
        <ul className="mb-0 ps-3 small text-dark d-flex flex-column gap-1">
          {suggestions.slice(0, 2).map((sug, i) => (
            <li key={i} className="lh-sm">{sug}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HealthScoreGauge;
