import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FlaskConical, Trees, Calendar } from 'lucide-react';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await adminAPI.getSoilReports();
        if (res.data.success) {
          setReports(res.data.reports);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Aggregating regional soil nutrient test reports..." />;
  }

  return (
    <div className="pb-5">
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Aggregated Soil Health Reports</h3>
        <p className="text-muted small mb-0">Overview of registered farmer soil nutrient tests across districts</p>
      </div>

      <div className="krishi-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle small mb-0">
            <thead className="table-light">
              <tr>
                <th>Farmer</th>
                <th>Farm Plot & Location</th>
                <th>Soil Health Score</th>
                <th>pH</th>
                <th>N-P-K (kg/ha)</th>
                <th>Moisture</th>
                <th>Organic Carbon</th>
                <th>Test Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="fw-bold text-dark">{r.userId?.name}</div>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>{r.userId?.email}</span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{r.farmId?.farmName}</div>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{r.farmId?.location}</span>
                  </td>
                  <td>
                    <span className="badge bg-success fs-6 fw-bold">
                      {r.healthScore}/100
                    </span>
                  </td>
                  <td className="fw-bold">{r.pH}</td>
                  <td className="text-muted">
                    {r.nitrogen} - {r.phosphorus} - {r.potassium}
                  </td>
                  <td>{r.moisture}%</td>
                  <td className="fw-semibold text-success">{r.organicCarbon}%</td>
                  <td className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
