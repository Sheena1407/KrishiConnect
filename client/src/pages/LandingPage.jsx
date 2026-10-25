import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  FlaskConical,
  CloudSun,
  ShieldAlert,
  BarChart3,
  ShoppingBag,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: Sprout,
      title: 'Smart Crop Management',
      description: 'Monitor crops from sowing to harvest with stage progression trackers and harvest countdowns.',
      link: '/crops',
      color: '#2D6A4F',
    },
    {
      icon: FlaskConical,
      title: 'Soil Health Intelligence',
      description: 'Input pH, N-P-K, and organic carbon to compute a clinical Soil Health Score with customized remedies.',
      link: '/soil-health',
      color: '#BC6C25',
    },
    {
      icon: CloudSun,
      title: 'Weather Intelligence',
      description: 'Hyper-local weather forecasts and actionable agricultural advisories for spray & irrigation timing.',
      link: '/weather',
      color: '#1565C0',
    },
    {
      icon: ShieldAlert,
      title: 'Pest & Disease Alerts',
      description: 'Real-time warning notifications for yellow rust, bollworms, and blight with preventive action guides.',
      link: '/pest-alerts',
      color: '#C62828',
    },
    {
      icon: BarChart3,
      title: 'Farm Analytics',
      description: 'Interactive visual charts displaying crop distribution, yield estimation, and farm income benchmarks.',
      link: '/analytics',
      color: '#6A1B9A',
    },
    {
      icon: ShoppingBag,
      title: 'Krishi Market',
      description: 'Certified seeds, bio-fertilizers, organic compost, and modern drip equipment delivered directly.',
      link: '/market',
      color: '#DDA15E',
    },
    {
      icon: GraduationCap,
      title: 'Expert Consultation',
      description: 'Schedule appointments with certified agronomists and soil scientists for tailored advice.',
      link: '/experts',
      color: '#00897B',
    },
    {
      icon: Users,
      title: 'Farmer Community',
      description: 'Connect with progressive farmers across India to exchange field techniques and market news.',
      link: '/community',
      color: '#E76F51',
    },
  ];

  const steps = [
    { num: '01', title: 'Create Your Farm', desc: 'Register your land plots, location, soil profile, and irrigation sources.' },
    { num: '02', title: 'Add Your Crops', desc: 'Record sown varieties, sowing dates, and track real-time growth stages.' },
    { num: '03', title: 'Check Soil Health', desc: 'Enter soil test values to receive instant N-P-K remediation recipes.' },
    { num: '04', title: 'Monitor Weather', desc: 'View 7-day agro-met forecasts and rain advisories before field spraying.' },
    { num: '05', title: 'Get Smart Alerts', desc: 'Receive instant pest outbreak and weather warnings for your specific district.' },
    { num: '06', title: 'Improve Your Harvest', desc: 'Maximize yields with data-backed harvest estimates and market price timing.' },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-bg py-5">
        <div className="container py-lg-5">
          <div className="row align-items-center">
            <div className="col-lg-8 text-start">
              <span className="badge rounded-pill px-3 py-2 bg-success bg-opacity-25 text-warning fw-semibold mb-3 d-inline-flex align-items-center gap-2 border border-warning border-opacity-25">
                <Sparkles size={16} /> Digital AgriTech Platform for Progressive Farmers
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.15 }}>
                Smart Farming Starts Here.
              </h1>
              <p className="lead text-white text-opacity-90 mb-4 pe-lg-5" style={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
                Make better decisions, grow healthier crops, and manage your farm smarter with <strong className="text-warning">KrishiConnect</strong>.
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Link
                  to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/register'}
                  className="btn btn-gold btn-lg px-4 py-3 rounded-pill fw-bold"
                >
                  <span>{isAuthenticated ? 'Explore My Farm' : 'Get Started Free'}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to={isAuthenticated ? '/dashboard' : '/login'}
                  className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-semibold"
                >
                  {isAuthenticated ? 'Open Dashboard' : 'Farmer Login'}
                </Link>
              </div>

              {/* Demo Credentials Quick Pill */}
              <div className="mt-4 p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-50 text-white small d-inline-block">
                <span className="text-warning fw-bold">Demo Login: </span>
                <span className="text-light">farmer@krishiconnect.demo &middot; Farmer@123</span>
                <span className="mx-2 text-secondary">|</span>
                <span className="text-warning fw-bold">Admin: </span>
                <span className="text-light">admin@krishiconnect.demo &middot; Admin@123</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="py-4 bg-white border-bottom border-light-subtle shadow-sm">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3 border-end border-light-subtle">
              <h2 className="display-6 fw-bold text-success mb-0">10K+</h2>
              <div className="fw-semibold text-dark small mt-1">Active Farmers</div>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>Sample Network</span>
            </div>
            <div className="col-6 col-md-3 border-end border-light-subtle">
              <h2 className="display-6 fw-bold text-success mb-0">50+</h2>
              <div className="fw-semibold text-dark small mt-1">Crop Cultivation Guides</div>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>ICAR Aligned</span>
            </div>
            <div className="col-6 col-md-3 border-end border-light-subtle">
              <h2 className="display-6 fw-bold text-success mb-0">100+</h2>
              <div className="fw-semibold text-dark small mt-1">Smart Farming Tips</div>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>Validated Knowledge</span>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-6 fw-bold text-success mb-0">25+</h2>
              <div className="fw-semibold text-dark small mt-1">Mandi Locations</div>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>Live Indian Markets</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="badge rounded-pill bg-success bg-opacity-10 text-success fw-bold px-3 py-1 mb-2">
              POWERFUL CAPABILITIES
            </span>
            <h2 className="display-5 fw-bold text-dark">Everything You Need for Modern Farming</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Built with precision agronomy to guide you from seed selection to final harvest and mandi selling.
            </p>
          </div>

          <div className="row g-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="col-md-6 col-lg-3">
                  <div className="krishi-card p-4 h-100 d-flex flex-column krishi-card-hover">
                    <div
                      className="rounded-3 p-3 mb-3 d-inline-flex align-items-center justify-content-center"
                      style={{ backgroundColor: `${f.color}15`, color: f.color }}
                    >
                      <Icon size={28} />
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{f.title}</h5>
                    <p className="text-muted small flex-grow-1" style={{ lineHeight: 1.6 }}>
                      {f.description}
                    </p>
                    <Link
                      to={isAuthenticated ? f.link : '/login'}
                      className="fw-semibold text-decoration-none small d-flex align-items-center gap-1 mt-2"
                      style={{ color: f.color }}
                    >
                      Explore Feature <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-5 bg-white border-top border-bottom border-light-subtle">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="badge rounded-pill bg-warning bg-opacity-25 text-warning-emphasis fw-bold px-3 py-1 mb-2">
              SIMPLE 6-STEP WORKFLOW
            </span>
            <h2 className="display-5 fw-bold text-dark">How KrishiConnect Works for You</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '580px' }}>
              Streamlined workflow designed specifically for ease of use by farmers across India.
            </p>
          </div>

          <div className="row g-4">
            {steps.map((st, i) => (
              <div key={i} className="col-md-4">
                <div className="p-4 rounded-4 border border-light-subtle h-100 bg-light bg-opacity-50">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="display-6 fw-extrabold text-success text-opacity-50">{st.num}</span>
                    <CheckCircle2 size={24} className="text-success" />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{st.title}</h5>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #12372A 0%, #1B4D3E 100%)' }}>
        <div className="container py-4 text-center text-white">
          <h2 className="display-5 fw-bold text-white mb-3">Ready to Transform Your Farm Management?</h2>
          <p className="lead text-white text-opacity-75 mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Join thousands of progressive farmers leveraging digital agronomy, real-time market prices, and soil health monitoring.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-gold btn-lg px-4 py-2 rounded-pill fw-bold">
              Create Farmer Account
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill fw-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
