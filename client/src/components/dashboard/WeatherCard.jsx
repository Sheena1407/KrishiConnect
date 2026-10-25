import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { weatherAPI } from '../../services/api';
import { CloudSun, Droplets, Wind, CloudRain, Sunrise, ArrowRight, Compass } from 'lucide-react';

const WeatherCard = ({ userLocation = 'Bhopal' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await weatherAPI.get(userLocation);
        if (res.data.success) {
          setWeather(res.data);
        }
      } catch (err) {
        console.error('Weather load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [userLocation]);

  if (loading) {
    return (
      <div className="krishi-card p-4 h-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success spinner-border-sm me-2"></div>
        <span className="small text-muted">Fetching farm weather intelligence...</span>
      </div>
    );
  }

  const current = weather?.current || {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 64,
    windSpeed: 12,
    rainProbability: 15,
  };

  const primaryAdvisory = weather?.advisories?.[0] || {
    text: '🌱 Good day for field inspection and nutrient spray.',
  };

  return (
    <div
      className="krishi-card p-4 h-100 position-relative overflow-hidden text-white"
      style={{
        background: 'linear-gradient(135deg, #1B4D3E 0%, #2D6A4F 60%, #40916C 100%)',
        boxShadow: '0 8px 24px rgba(27, 77, 62, 0.25)',
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="badge rounded-pill bg-white bg-opacity-20 text-white small px-3 py-1 mb-2 d-inline-flex align-items-center gap-1">
            <Compass size={13} /> {weather?.location || userLocation}, {weather?.state || 'India'}
          </span>
          <h2 className="display-5 fw-bold mb-0 text-white">{current.temperature}°C</h2>
          <div className="fw-semibold text-warning" style={{ fontSize: '1.05rem' }}>
            {current.condition}
          </div>
        </div>
        <div className="p-3 rounded-circle bg-white bg-opacity-15 text-warning">
          <CloudSun size={38} />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-2 py-3 border-top border-bottom border-white border-opacity-15 my-3 text-center">
        <div className="col-4">
          <div className="d-flex align-items-center justify-content-center gap-1 text-white text-opacity-75 small">
            <Droplets size={14} className="text-info" /> Humidity
          </div>
          <div className="fw-bold mt-1 text-white">{current.humidity}%</div>
        </div>
        <div className="col-4 border-start border-end border-white border-opacity-15">
          <div className="d-flex align-items-center justify-content-center gap-1 text-white text-opacity-75 small">
            <Wind size={14} className="text-white" /> Wind
          </div>
          <div className="fw-bold mt-1 text-white">{current.windSpeed} km/h</div>
        </div>
        <div className="col-4">
          <div className="d-flex align-items-center justify-content-center gap-1 text-white text-opacity-75 small">
            <CloudRain size={14} className="text-warning" /> Rain Prob.
          </div>
          <div className="fw-bold mt-1 text-white">{current.rainProbability}%</div>
        </div>
      </div>

      {/* Agri Recommendation Callout */}
      <div className="p-2 px-3 rounded-3 bg-white bg-opacity-15 mb-3 small d-flex align-items-center gap-2">
        <span className="fs-5">🌱</span>
        <div className="text-white fw-medium lh-sm" style={{ fontSize: '0.86rem' }}>
          {primaryAdvisory.text}
        </div>
      </div>

      {/* View Full 7-Day Forecast */}
      <div className="d-flex justify-content-end">
        <Link
          to="/weather"
          className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 text-white small"
          style={{ fontSize: '0.8rem' }}
        >
          <span>7-Day Agri Forecast</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default WeatherCard;
