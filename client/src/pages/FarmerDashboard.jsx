import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { analyticsAPI } from '../services/api';
import StatCard from '../components/common/StatCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import MandiCard from '../components/dashboard/MandiCard';
import HealthScoreGauge from '../components/dashboard/HealthScoreGauge';
import UpcomingActivities from '../components/dashboard/UpcomingActivities';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Sprout,
  Trees,
  Scale,
  IndianRupee,
  PlusCircle,
  FlaskConical,
  Stethoscope,
  BotMessageSquare,
  ShoppingBag,
} from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getFarmer();
        if (res.data.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Gathering farm agronomy & satellite data..." />;
  }

  const summary = analytics?.summary || {
    totalCrops: 4,
    farmArea: 12,
    expectedHarvestTons: 8.5,
    estimatedIncome: 206410,
  };

  return (
    <div className="pb-5">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            {t('dashboard.greeting')}, {user?.name} 🌾
          </h3>
          <p className="text-muted small mb-0">
            {user?.location || 'Madhya Pradesh'} &middot; {t('dashboard.overview')}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="d-flex flex-wrap gap-2">
          <Link to="/crops" className="btn btn-sm btn-krishi">
            <PlusCircle size={15} /> Add Crop
          </Link>
          <Link to="/soil-health" className="btn btn-sm btn-outline-krishi">
            <FlaskConical size={15} /> Check Soil
          </Link>
          <Link to="/crop-doctor" className="btn btn-sm btn-outline-secondary">
            <Stethoscope size={15} /> Crop Doctor
          </Link>
        </div>
      </div>

      {/* 1. Summary Cards Row */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard
            title={t('dashboard.myCrops')}
            value={summary.totalCrops}
            unit="Varieties"
            icon={Sprout}
            color="success"
            subtitle="Active across plots"
            trend="Active"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            title={t('dashboard.farmArea')}
            value={summary.farmArea}
            unit={t('dashboard.acres')}
            icon={Trees}
            color="primary"
            subtitle="Cultivated Land"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            title={t('dashboard.expectedHarvest')}
            value={summary.expectedHarvestTons}
            unit={t('dashboard.tons')}
            icon={Scale}
            color="warning"
            subtitle="Estimated yield"
            trend="+12% YoY"
            trendDirection="up"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            title={t('dashboard.estimatedIncome')}
            value={`₹${summary.estimatedIncome?.toLocaleString('en-IN')}`}
            icon={IndianRupee}
            color="gold"
            subtitle="At current mandi rates"
            trend="Strong"
          />
        </div>
      </div>

      {/* 2. Primary Intelligence Row: Weather & Farm Health Score */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-lg-6">
          <WeatherCard userLocation={user?.location || 'Bhopal'} />
        </div>
        <div className="col-lg-6">
          <HealthScoreGauge healthData={analytics?.healthScore} />
        </div>
      </div>

      {/* 3. Operational Row: Mandi Prices & Upcoming Farm Planner */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-lg-6">
          <MandiCard />
        </div>
        <div className="col-lg-6">
          <UpcomingActivities />
        </div>
      </div>

      {/* 4. Quick Advisory Discovery Cards */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="krishi-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
              <BotMessageSquare size={24} />
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-dark">Krishi Assistant</h6>
              <p className="text-muted small mb-1">Have farming questions? Get instant agronomic guidance.</p>
              <Link to="/assistant" className="text-success small fw-semibold text-decoration-none">
                Ask AI Assistant &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="krishi-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-warning bg-opacity-25 text-warning-emphasis">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-dark">Krishi Market</h6>
              <p className="text-muted small mb-1">Certified seeds, bio-fertilizers & drip irrigation kits.</p>
              <Link to="/market" className="text-success small fw-semibold text-decoration-none">
                Visit Agricultural Store &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="krishi-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
              <FlaskConical size={24} />
            </div>
            <div>
              <h6 className="fw-bold mb-1 text-dark">Crop Advisor</h6>
              <p className="text-muted small mb-1">Find the most profitable crops for your specific soil & season.</p>
              <Link to="/crop-advisor" className="text-success small fw-semibold text-decoration-none">
                Get Recommendations &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
