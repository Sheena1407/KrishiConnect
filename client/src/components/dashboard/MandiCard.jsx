import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mandiAPI } from '../../services/api';
import { TrendingUp, ArrowRight, Store } from 'lucide-react';

const MandiCard = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMandi = async () => {
      try {
        const res = await mandiAPI.get();
        if (res.data.success) {
          setRates(res.data.markets.slice(0, 4));
        }
      } catch (e) {
        console.error('Mandi load error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMandi();
  }, []);

  return (
    <div className="krishi-card p-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 bg-warning bg-opacity-25 text-warning">
            <Store size={20} className="text-dark" />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Today's Mandi Prices</h6>
            <span className="badge bg-light text-secondary border small" style={{ fontSize: '0.68rem' }}>
              Sample Market Rates (Agmarknet Linked)
            </span>
          </div>
        </div>
        <Link to="/mandi-prices" className="btn btn-sm btn-link text-success p-0 text-decoration-none fw-semibold small d-flex align-items-center gap-1">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex-grow-1 d-flex flex-column gap-2 justify-content-around">
        {loading ? (
          <div className="text-center py-4 text-muted small">Loading market rates...</div>
        ) : (
          rates.map((item) => (
            <div
              key={item.id}
              className="p-2 px-3 rounded-3 border border-light-subtle d-flex align-items-center justify-content-between bg-light bg-opacity-50 hover-shadow transition"
            >
              <div>
                <div className="fw-bold text-dark small">{item.crop}</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {item.mandi} &middot; {item.variety}
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold text-dark">
                  ₹{item.price.toLocaleString('en-IN')}<span className="text-muted small fw-normal">/{item.unit.replace('₹/', '')}</span>
                </div>
                <span
                  className={`small fw-semibold ${
                    item.change >= 0 ? 'text-success' : 'text-danger'
                  }`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-2 border-top border-light-subtle d-flex justify-content-between align-items-center small text-muted">
        <span>Updated Today, 10:30 AM</span>
        <span className="text-success fw-semibold">12+ Mandis Active</span>
      </div>
    </div>
  );
};

export default MandiCard;
