import React from 'react';

const StatCard = ({ title, value, unit, icon: Icon, color = 'success', subtitle, trend, trendDirection = 'up' }) => {
  const colorMap = {
    success: { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' },
    warning: { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082' },
    primary: { bg: '#E3F2FD', text: '#1565C0', border: '#BBDEFB' },
    gold: { bg: '#FEFAE0', text: '#BC6C25', border: '#FAEDCD' },
    purple: { bg: '#F3E5F5', text: '#7B1FA2', border: '#E1BEE7' },
  };

  const currentTheme = colorMap[color] || colorMap.success;

  return (
    <div className="krishi-card p-3 p-md-4 h-100 position-relative overflow-hidden">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '0.6px', fontSize: '0.78rem' }}>
          {title}
        </span>
        <div
          className="rounded-3 p-2 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div className="d-flex align-items-baseline gap-1 mb-1">
        <h2 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{value}</h2>
        {unit && <span className="text-muted fw-semibold small">{unit}</span>}
      </div>

      {(subtitle || trend) && (
        <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-light-subtle small text-muted">
          <span>{subtitle}</span>
          {trend && (
            <span className={`fw-semibold ${trendDirection === 'up' ? 'text-success' : 'text-danger'}`}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
