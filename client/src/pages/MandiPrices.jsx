import React, { useState, useEffect } from 'react';
import { mandiAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  TrendingUp,
  Search,
  Store,
  ArrowUpDown,
  Filter,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';

const MandiPrices = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await mandiAPI.get({
        search: searchTerm,
        crop: selectedCrop,
        state: selectedState,
        sortBy,
      });
      if (res.data.success) {
        setRates(res.data.markets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [selectedCrop, selectedState, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRates();
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-warning bg-opacity-25 text-warning-emphasis">
              <TrendingUp size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Mandi Price Tracker</h3>
          </div>
          <p className="text-muted small mb-0">
            Real-time daily arrivals, minimum-maximum wholesale auction prices across key Indian APMC Mandis.
          </p>
        </div>

        <span className="badge bg-success bg-opacity-10 text-success fw-semibold px-3 py-2 border border-success border-opacity-25">
          Updated: Today, 10:30 AM (Agmarknet Live Link)
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="krishi-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={15} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search crop, variety or mandi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="all">All Crops</option>
              <option value="Wheat">Wheat (गेहूँ)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Chickpea">Chickpea / Chana (चना)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Maize">Maize (मक्का)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Paddy">Paddy / Rice (धान)</option>
            </select>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="all">All States</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Haryana">Haryana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="change">Top Gainers (%)</option>
            </select>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching live mandi market prices..." />
      ) : rates.length === 0 ? (
        <div className="krishi-card p-5 text-center text-muted">
          No mandi prices found matching your search. Try resetting filters.
        </div>
      ) : (
        <div className="row g-3">
          {rates.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="krishi-card p-4 h-100 d-flex flex-column krishi-card-hover">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{item.crop}</h5>
                    <span className="badge bg-light text-secondary border small mt-1">
                      {item.variety}
                    </span>
                  </div>
                  <div className="text-end">
                    <span
                      className={`badge small fw-bold px-2 py-1 ${
                        item.change >= 0
                          ? 'bg-success-subtle text-success'
                          : 'bg-danger-subtle text-danger'
                      }`}
                    >
                      {item.change >= 0 ? '↑ +' : '↓ '}{item.change}%
                    </span>
                  </div>
                </div>

                <div className="my-3 py-2 border-top border-bottom border-light-subtle d-flex justify-content-between align-items-baseline">
                  <div>
                    <span className="text-muted small d-block">Modal Price</span>
                    <h3 className="fw-extrabold text-success mb-0">
                      ₹{item.price.toLocaleString('en-IN')}
                      <span className="text-muted fw-normal small">/{item.unit.replace('₹/', '')}</span>
                    </h3>
                  </div>
                  <div className="text-end small text-muted">
                    <div>Min: ₹{item.minPrice}</div>
                    <div>Max: ₹{item.maxPrice}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between small text-muted mb-2">
                  <span className="d-flex align-items-center gap-1">
                    <Store size={14} className="text-warning" />
                    <strong>{item.mandi}</strong>
                  </span>
                  <span>{item.state}</span>
                </div>

                <div className="mt-auto pt-2 border-top border-light-subtle d-flex justify-content-between align-items-center small text-muted">
                  <span>Arrivals: <strong>{item.arrivals}</strong></span>
                  <span style={{ fontSize: '0.72rem' }}>{item.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MandiPrices;
