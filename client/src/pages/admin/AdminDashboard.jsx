import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import {
  Users,
  Trees,
  Sprout,
  Package,
  ShoppingBag,
  GraduationCap,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await analyticsAPI.getAdmin();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading KrishiConnect platform administration statistics..." />;
  }

  const metrics = data?.metrics || {};
  const orderStatuses = data?.orderStatuses || [];
  const recentUsers = data?.recentUsers || [];

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">KrishiConnect Command Central</h3>
          <p className="text-muted small mb-0">
            Platform governance: monitoring farmers, farms, commerce orders, expert network, and alerts.
          </p>
        </div>
        <span className="badge bg-danger text-white px-3 py-2 fw-semibold">
          ADMINISTRATOR ACCESS
        </span>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <StatCard title="Farmers" value={metrics.totalFarmers} icon={Users} color="success" />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <StatCard title="Farms" value={metrics.totalFarms} icon={Trees} color="primary" />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <StatCard title="Crops" value={metrics.totalCrops} icon={Sprout} color="success" />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <StatCard title="Orders" value={metrics.totalOrders} icon={Package} color="warning" />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <StatCard title="Products" value={metrics.totalProducts} icon={ShoppingBag} color="gold" />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <StatCard title="Revenue" value={`₹${metrics.totalRevenue?.toLocaleString('en-IN')}`} icon={IndianRupee} color="purple" />
        </div>
      </div>

      {/* Analytics Chart & Orders by Status */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="krishi-card p-4 h-100">
            <h5 className="fw-bold text-dark mb-1">Orders Breakdown by Logistics Status</h5>
            <p className="text-muted small mb-3">Live fulfillment pipeline across all registered farmer purchases</p>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={orderStatuses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" fontSize={12} stroke="#666" />
                  <YAxis fontSize={12} stroke="#666" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Administrative Shortcuts */}
        <div className="col-lg-5">
          <div className="krishi-card p-4 h-100 d-flex flex-column justify-content-between">
            <h5 className="fw-bold text-dark mb-3">Administrative Management Modules</h5>

            <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-around">
              <Link to="/admin/users" className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between text-decoration-none text-dark hover-shadow">
                <div className="d-flex align-items-center gap-2">
                  <Users size={18} className="text-success" />
                  <span className="fw-semibold small">Manage Farmers & User Accounts</span>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>

              <Link to="/admin/products" className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between text-decoration-none text-dark hover-shadow">
                <div className="d-flex align-items-center gap-2">
                  <ShoppingBag size={18} className="text-warning" />
                  <span className="fw-semibold small">Krishi Market Catalog & Stock</span>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>

              <Link to="/admin/orders" className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between text-decoration-none text-dark hover-shadow">
                <div className="d-flex align-items-center gap-2">
                  <Package size={18} className="text-primary" />
                  <span className="fw-semibold small">Fulfill & Track Customer Orders</span>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>

              <Link to="/admin/pests" className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between text-decoration-none text-dark hover-shadow">
                <div className="d-flex align-items-center gap-2">
                  <ShieldAlert size={18} className="text-danger" />
                  <span className="fw-semibold small">Publish Regional Pest Alerts</span>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registered Farmers Table */}
      <div className="krishi-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">Recently Registered Farmers</h5>
          <Link to="/admin/users" className="small text-success fw-semibold text-decoration-none">
            View All Users &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Farmer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u._id}>
                  <td className="fw-bold text-dark d-flex align-items-center gap-2">
                    <img
                      src={u.profileImage}
                      alt={u.name}
                      className="rounded-circle object-fit-cover"
                      style={{ width: '30px', height: '30px' }}
                    />
                    <span>{u.name}</span>
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td className="text-muted">{u.phone || 'N/A'}</td>
                  <td>{u.location}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success">{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'bg-success' : 'bg-danger'} text-white`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
