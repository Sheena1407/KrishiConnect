import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Scale,
  IndianRupee,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2D6A4F', '#40916C', '#52B788', '#DDA15E', '#BC6C25', '#1565C0', '#E76F51'];

const FarmAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getFarmer();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Generating farm agronomic charts and revenue models..." />;
  }

  const summary = data?.summary || {};
  const cropDistribution = data?.charts?.cropDistribution || [];
  const performanceTrend = data?.charts?.performanceTrend || [];
  const cropYieldBreakdown = data?.cropYieldBreakdown || [];

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
              <BarChart3 size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Farm Analytics & Harvest Estimates</h3>
          </div>
          <p className="text-muted small mb-0">
            Interactive agronomic data visualization, productivity benchmarks, and revenue forecasting.
          </p>
        </div>

        <span className="badge bg-light text-secondary border px-3 py-2 small">
          Data Verified: 2026-2027 Season
        </span>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="krishi-card p-3">
            <span className="text-muted small fw-semibold text-uppercase">Total Land</span>
            <h3 className="fw-bold text-dark my-1">{summary.farmArea} Acres</h3>
            <span className="text-success small fw-semibold">100% Utilized</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="krishi-card p-3">
            <span className="text-muted small fw-semibold text-uppercase">Active Crops</span>
            <h3 className="fw-bold text-dark my-1">{summary.totalCrops} Crops</h3>
            <span className="text-muted small">Cultivated plots</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="krishi-card p-3">
            <span className="text-muted small fw-semibold text-uppercase">Expected Harvest</span>
            <h3 className="fw-bold text-success my-1">{summary.expectedHarvestTons} Tons</h3>
            <span className="text-muted small">Demo Benchmark Calculation</span>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="krishi-card p-3">
            <span className="text-muted small fw-semibold text-uppercase">Projected Revenue</span>
            <h3 className="fw-bold text-warning-emphasis my-1">
              ₹{summary.estimatedIncome?.toLocaleString('en-IN')}
            </h3>
            <span className="text-success small fw-semibold">At Current MSP</span>
          </div>
        </div>
      </div>

      {/* Row 1: Crop Acreage Distribution & Revenue Growth Timeline */}
      <div className="row g-4 mb-4">
        {/* Doughnut Chart: Crop Area Distribution */}
        <div className="col-lg-5">
          <div className="krishi-card p-4 h-100">
            <h5 className="fw-bold text-dark mb-1">Crop Acreage Distribution</h5>
            <p className="text-muted small mb-3">Area allocation across different crops (Acres)</p>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={cropDistribution}
                    dataKey="area"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {cropDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} Acres`, 'Cultivated Area']}
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Line Chart: Farm Performance Timeline */}
        <div className="col-lg-7">
          <div className="krishi-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h5 className="fw-bold text-dark mb-0">Seasonal Income Trajectory</h5>
              <span className="badge bg-success bg-opacity-10 text-success small">Cumulative (₹)</span>
            </div>
            <p className="text-muted small mb-3">Projected cumulative harvest income through season progression</p>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Income']}
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#2D6A4F"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#2D6A4F' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Harvest Estimates by Crop Table & Calculation Badge */}
      <div className="krishi-card p-4 mb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
          <div>
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <Scale size={20} className="text-warning" />
              <span>Section 33: Estimated Harvest Breakdown</span>
            </h5>
            <span className="text-muted small">
              Estimated / Demo Calculation based on area and historical agro-productivity factors.
            </span>
          </div>

          <div className="badge bg-warning bg-opacity-25 text-warning-emphasis px-3 py-2 small fw-semibold">
            Estimated / Demo Calculation (Non-Guaranteed)
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Crop Name</th>
                <th>Variety</th>
                <th>Cultivated Area</th>
                <th>Growth Stage</th>
                <th>Health Status</th>
                <th>Estimated Harvest</th>
                <th className="text-end">Estimated Value</th>
              </tr>
            </thead>
            <tbody>
              {cropYieldBreakdown.map((crop, i) => (
                <tr key={i}>
                  <td className="fw-bold text-dark">{crop.name}</td>
                  <td className="text-muted">{crop.variety}</td>
                  <td>{crop.area} Acres</td>
                  <td>
                    <span className="badge bg-light text-secondary border">
                      {crop.growthStage}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        crop.health === 'Healthy'
                          ? 'bg-success-subtle text-success'
                          : 'bg-warning-subtle text-warning-emphasis'
                      }`}
                    >
                      {crop.health}
                    </span>
                  </td>
                  <td className="fw-bold text-success">
                    {crop.estimatedYieldTons} Tons ({crop.estimatedYieldQuintals} Quintals)
                  </td>
                  <td className="text-end fw-extrabold text-dark">
                    ₹{crop.estimatedIncome?.toLocaleString('en-IN')}
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

export default FarmAnalytics;
