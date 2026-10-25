import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Sprout, ShoppingCart, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-2" style={{ backgroundColor: '#12372A' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 brand-font fs-4" to="/">
          <span className="p-1 rounded bg-success bg-opacity-25 d-flex align-items-center justify-content-center">
            <Sprout className="text-warning" size={26} />
          </span>
          <span className="text-white">Krishi<span style={{ color: '#E9C46A' }}>Connect</span></span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#krishiNav"
          aria-controls="krishiNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="krishiNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <Link className="nav-link text-light text-opacity-75" to="/">{t('nav.home')}</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light text-opacity-75" href="/#features">{t('nav.features')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light text-opacity-75" href="/#how-it-works">{t('nav.howItWorks')}</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light text-opacity-75" to="/market">{t('nav.krishiMarket')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light text-opacity-75" to="/community">{t('nav.community')}</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 rounded-pill px-3 py-1 text-light"
              style={{ fontSize: '0.84rem' }}
              title="Toggle English / Hindi"
            >
              <Globe size={15} />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Cart Link */}
            <Link to="/cart" className="btn btn-sm btn-outline-light rounded-pill position-relative px-2 py-1">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="btn btn-sm btn-success d-flex align-items-center gap-1 px-3 py-1 text-white rounded-pill fw-semibold"
                  style={{ backgroundColor: '#2D6A4F', border: 'none' }}
                >
                  <LayoutDashboard size={16} />
                  <span>{isAdmin ? t('nav.adminDashboard') : t('nav.dashboard')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-light rounded-pill p-1 px-2"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-light rounded-pill px-3 py-1">
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm btn-gold rounded-pill px-3 py-1"
                >
                  {t('nav.getStarted')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
