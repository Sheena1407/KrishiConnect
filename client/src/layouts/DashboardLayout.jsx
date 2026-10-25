import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, Globe, Bell, ShoppingCart, User, LogOut, Sprout } from 'lucide-react';
import { useCart } from '../context/CartContext';

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#F4F7F4' }}>
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        closeMobileSidebar={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100 overflow-hidden">
        {/* Top Header Navbar */}
        <header
          className="sticky-top bg-white border-bottom border-light-subtle px-3 px-md-4 py-2 d-flex align-items-center justify-content-between"
          style={{ zIndex: 1020, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-light border d-lg-none p-2"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
            <div className="d-none d-sm-block">
              <span className="small text-muted">Platform: </span>
              <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
                {isAdmin ? 'KrishiConnect Admin Central' : 'KrishiConnect Smart Agro Portal'}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 d-flex align-items-center gap-1"
              style={{ fontSize: '0.8rem' }}
              title="Toggle English / हिंदी"
            >
              <Globe size={14} className="text-success" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="btn btn-sm btn-light border rounded-circle position-relative p-2"
              title="Shopping Cart"
            >
              <ShoppingCart size={18} className="text-secondary" />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications Bell */}
            <Link
              to="/notifications"
              className="btn btn-sm btn-light border rounded-circle position-relative p-2"
              title="Notifications"
            >
              <Bell size={18} className="text-secondary" />
            </Link>

            {/* Profile Pill */}
            <Link
              to="/profile"
              className="btn btn-sm btn-light border rounded-pill d-flex align-items-center gap-2 px-2 py-1 text-decoration-none text-dark"
            >
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name || 'User'}
                className="rounded-circle object-fit-cover"
                style={{ width: '28px', height: '28px' }}
              />
              <span className="d-none d-md-inline small fw-semibold text-truncate" style={{ maxWidth: '100px' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-grow-1 p-3 p-md-4 overflow-y-auto">
          <div className="container-fluid px-0" style={{ maxWidth: '1400px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
