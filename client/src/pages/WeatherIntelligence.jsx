import React, { useState, useEffect } from 'react';
import { weatherAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sunrise,
  Sunset,
  Search,
  MapPin,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const WeatherIntelligence = () => {
  const [locationQuery, setLocationQuery] = useState('Bhopal');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (loc = locationQuery) => {
    setLoading(true);
    try {
      const res = await weatherAPI.get(loc);
      if (res.data.success) {
        setWeatherData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (locationQuery.trim()) {
      fetchWeather(locationQuery);
    }
  };

  const current = weatherData?.current || {
    temperature: 28,
    humidity: 64,
    windSpeed: 12,
    rainProbability: 20,
    condition: 'Partly Cloudy',
    sunrise: '06:14 AM',
    sunset: '06:05 PM',
  };

  return (
    <div className="pb-5">
      {/* Header & City Search Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
              <CloudSun size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Agro-Weather Intelligence</h3>
          </div>
          <p className="text-muted small mb-0">
            Real-time atmospheric monitoring, 7-day precipitation forecasts, and field operational advisories.
          </p>
        </div>

        <form onSubmit={handleSearch} className="d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <MapPin size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search Indian City / Mandi"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              style={{ minWidth: '220px' }}
            />
          </div>
          <button type="submit" className="btn btn-krishi px-3">
            <Search size={16} />
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message={`Fetching satellite radar forecast for ${locationQuery}...`} />
      ) : (
        <>
          {/* Main Weather Hero Card */}
          <div
            className="krishi-card p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1B4D3E 0%, #2D6A4F 60%, #40916C 100%)',
              boxShadow: '0 12px 32px rgba(27, 77, 62, 0.2)',
            }}
          >
            <div className="row align-items-center g-4">
              <div className="col-md-7">
                <span className="badge rounded-pill bg-white bg-opacity-20 text-white px-3 py-1 mb-3 d-inline-flex align-items-center gap-1">
                  <MapPin size={14} /> {weatherData?.location}, {weatherData?.state}
                </span>
                <div className="d-flex align-items-baseline gap-3 mb-2">
                  <h1 className="display-3 fw-extrabold text-white mb-0">{current.temperature}°C</h1>
                  <div>
                    <h4 className="fw-semibold text-warning mb-0">{current.condition}</h4>
                    <span className="text-white text-opacity-75 small">Feels like {current.feelsLike || current.temperature + 2}°C</span>
                  </div>
                </div>
                <p className="text-white text-opacity-80 small mb-0">
                  Data source: {weatherData?.source} &middot; Updated {new Date(weatherData?.lastUpdated).toLocaleTimeString()}
                </p>
              </div>

              <div className="col-md-5">
                <div className="row g-3 text-center bg-white bg-opacity-10 p-3 rounded-4 backdrop-blur">
                  <div className="col-4">
                    <Droplets size={20} className="text-info mb-1" />
                    <div className="small text-white text-opacity-75">Humidity</div>
                    <div className="fw-bold fs-5 text-white">{current.humidity}%</div>
                  </div>
                  <div className="col-4 border-start border-end border-white border-opacity-25">
                    <Wind size={20} className="text-white mb-1" />
                    <div className="small text-white text-opacity-75">Wind Speed</div>
                    <div className="fw-bold fs-5 text-white">{current.windSpeed} km/h</div>
                  </div>
                  <div className="col-4">
                    <CloudRain size={20} className="text-warning mb-1" />
                    <div className="small text-white text-opacity-75">Rain Prob.</div>
                    <div className="fw-bold fs-5 text-white">{current.rainProbability}%</div>
                  </div>
                  <div className="col-6 pt-2 border-top border-white border-opacity-25">
                    <Sunrise size={18} className="text-warning mb-1" />
                    <div className="small text-white text-opacity-75">Sunrise</div>
                    <div className="fw-semibold text-white small">{current.sunrise}</div>
                  </div>
                  <div className="col-6 pt-2 border-top border-white border-opacity-25">
                    <Sunset size={18} className="text-warning mb-1" />
                    <div className="small text-white text-opacity-75">Sunset</div>
                    <div className="fw-semibold text-white small">{current.sunset}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Farming Recommendations Grid */}
          <div className="mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Lightbulb size={20} className="text-warning" />
              <span>Smart Farming Operational Advisories</span>
            </h5>
            <div className="row g-3">
              {weatherData?.advisories?.map((adv, idx) => (
                <div key={idx} className="col-md-6">
                  <div
                    className="krishi-card p-3 h-100 border-start border-4 border-success d-flex align-items-start gap-3"
                    style={{ backgroundColor: '#FEFAE0' }}
                  >
                    <div className="mt-1">
                      <CheckCircle2 size={20} className="text-success" />
                    </div>
                    <div>
                      <div className="fw-bold text-dark small mb-1">{adv.action}</div>
                      <p className="text-muted small mb-0 lh-sm">{adv.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast Cards Carousel/Grid */}
          <div>
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <span>7-Day Agricultural Forecast</span>
            </h5>

            <div className="row g-3">
              {weatherData?.forecast?.map((day, i) => (
                <div key={day.date} className="col-6 col-md-3 col-lg">
                  <div className="krishi-card p-3 text-center h-100 krishi-card-hover">
                    <div className="text-muted small fw-bold mb-1">{day.day.slice(0, 3)}</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{day.date.slice(5)}</div>
                    <div className="py-2 text-warning">
                      <CloudSun size={28} />
                    </div>
                    <div className="fw-bold text-dark fs-5">{day.maxTemp}°</div>
                    <div className="text-muted small">{day.minTemp}°C</div>
                    <div className="badge bg-light text-secondary border small mt-2 w-100" style={{ fontSize: '0.7rem' }}>
                      Rain: {day.rainProbability}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherIntelligence;
