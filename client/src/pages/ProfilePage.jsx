import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authAPI, farmAPI, cropAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Globe, Trees, Sprout, Check, Camera } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    language: user?.language || language || 'en',
    profileImage: user?.profileImage || '',
  });

  const [farmsCount, setFarmsCount] = useState(0);
  const [cropsCount, setCropsCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [f, c] = await Promise.all([farmAPI.getAll(), cropAPI.getAll()]);
        if (f.data.success) setFarmsCount(f.data.count);
        if (c.data.success) setCropsCount(c.data.count);
      } catch (e) {
        // ignore
      }
    };
    fetchCounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await authAPI.updateProfile(formData);
      if (res.data.success) {
        updateUser(res.data.user);
        setLanguage(formData.language);
        setMessage({ text: 'Farmer profile updated successfully!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
            <User size={24} />
          </span>
          <h3 className="fw-bold text-dark mb-0">Farmer Profile & Settings</h3>
        </div>
        <p className="text-muted small mb-0">
          Manage your personal details, language preference, and agricultural credentials.
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left: Profile Summary Card */}
        <div className="col-lg-4">
          <div className="krishi-card p-4 text-center">
            <div className="position-relative d-inline-block mb-3">
              <img
                src={formData.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name}
                className="rounded-circle object-fit-cover shadow-sm"
                style={{ width: '110px', height: '110px', border: '3px solid #2D6A4F' }}
              />
            </div>

            <h4 className="fw-bold text-dark mb-1">{user?.name}</h4>
            <div className="badge bg-success bg-opacity-10 text-success mb-3 px-3 py-1">
              Role: {user?.role}
            </div>

            <p className="text-muted small d-flex align-items-center justify-content-center gap-1 mb-3">
              <MapPin size={14} className="text-danger" /> {user?.location || 'Madhya Pradesh, India'}
            </p>

            <div className="row g-2 py-3 border-top border-bottom border-light-subtle my-3 text-center">
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light">
                  <Trees size={18} className="text-success mb-1" />
                  <div className="fw-bold text-dark fs-5">{farmsCount}</div>
                  <span className="small text-muted" style={{ fontSize: '0.72rem' }}>Registered Farms</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light">
                  <Sprout size={18} className="text-success mb-1" />
                  <div className="fw-bold text-dark fs-5">{cropsCount}</div>
                  <span className="small text-muted" style={{ fontSize: '0.72rem' }}>Active Crops</span>
                </div>
              </div>
            </div>

            <div className="small text-muted text-start mt-2">
              <div>Email: <strong>{user?.email}</strong></div>
              <div>Phone: <strong>{user?.phone || 'Not provided'}</strong></div>
              <div>Account Status: <span className="text-success fw-bold">Active & Verified</span></div>
            </div>
          </div>
        </div>

        {/* Right: Edit Profile Form */}
        <div className="col-lg-8">
          <div className="krishi-card p-4 p-md-5">
            <h5 className="fw-bold text-dark mb-4">Edit Profile Information</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={user?.email}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98260 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Location / District</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sehore, Madhya Pradesh"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Preferred Interface Language</label>
                  <select
                    className="form-select"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="en">English (default)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Profile Avatar URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top border-light-subtle d-flex justify-content-end">
                <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                  {submitting ? 'Updating...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
