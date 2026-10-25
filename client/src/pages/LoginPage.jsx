import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="py-5 bg-light min-vh-80 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="krishi-card p-4 p-sm-5 shadow-md">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ backgroundColor: '#E8F5E9', color: '#2D6A4F' }}
                >
                  <Sprout size={32} />
                </div>
                <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                <p className="text-muted small">Sign in to manage your crops, soil and mandi rates</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label className="form-label small fw-semibold text-dark">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control border-start-0 border-end-0 ps-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text bg-white border-start-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-krishi w-100 py-2 fw-semibold mt-2"
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              {/* Demo Accounts 1-Click Fillers */}
              <div className="mt-4 pt-3 border-top border-light-subtle">
                <div className="d-flex align-items-center gap-1 text-muted small fw-semibold mb-2">
                  <ShieldCheck size={15} className="text-success" />
                  <span>Quick Demo Access (Click to auto-fill):</span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillCredentials('farmer@krishiconnect.demo', 'Farmer@123')}
                    className="btn btn-sm btn-outline-success flex-grow-1 small py-1"
                  >
                    🌾 Farmer Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin@krishiconnect.demo', 'Admin@123')}
                    className="btn btn-sm btn-outline-dark flex-grow-1 small py-1"
                  >
                    🛡️ Admin Demo
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-success fw-bold text-decoration-none">
                  Register as Farmer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
