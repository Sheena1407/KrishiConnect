import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { notificationAPI } from '../../services/api';
import {
  LayoutDashboard,
  Trees,
  Sprout,
  Compass,
  FlaskConical,
  TrendingUp,
  CloudSun,
  ShieldAlert,
  Stethoscope,
  CalendarCheck,
  ShoppingBag,
  Package,
  GraduationCap,
  Users,
  BotMessageSquare,
  BarChart3,
  Bell,
  User,
  LogOut,
  Settings,
  X,
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationAPI.getAll();
        if (res.data.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (e) {
        // ignore
      }
    };
    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const farmerLinks = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/farms', label: t('nav.myFarm'), icon: Trees },
    { to: '/crops', label: t('nav.myCrops'), icon: Sprout },
    { to: '/crop-advisor', label: t('nav.cropAdvisor'), icon: Compass },
    { to: '/soil-health', label: t('nav.soilHealth'), icon: FlaskConical },
    { to: '/mandi-prices', label: t('nav.mandiPrices'), icon: TrendingUp },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/pest-alerts', label: t('nav.pestAlerts'), icon: ShieldAlert },
    { to: '/crop-doctor', label: t('nav.cropDoctor'), icon: Stethoscope },
    { to: '/planner', label: t('nav.farmPlanner'), icon: CalendarCheck },
    { to: '/market', label: t('nav.krishiMarket'), icon: ShoppingBag },
    { to: '/orders', label: t('nav.myOrders'), icon: Package },
    { to: '/experts', label: t('nav.askExpert'), icon: GraduationCap },
    { to: '/community', label: t('nav.community'), icon: Users },
    { to: '/assistant', label: t('nav.assistant'), icon: BotMessageSquare },
    { to: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
    { to: '/notifications', label: t('nav.notifications'), icon: Bell, badge: unreadCount },
    { to: '/profile', label: t('nav.profile'), icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/farms', label: 'Farms', icon: Trees },
    { to: '/admin/crops', label: 'Crops', icon: Sprout },
    { to: '/admin/soil-reports', label: 'Soil Reports', icon: FlaskConical },
    { to: '/admin/products', label: 'Products', icon: ShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: Package },
    { to: '/admin/experts', label: 'Experts', icon: GraduationCap },
    { to: '/admin/pests', label: 'Pest Alerts', icon: ShieldAlert },
    { to: '/community', label: 'Community', icon: Users },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const links = isAdmin ? adminLinks : farmerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`sidebar d-flex flex-column p-3 ${
          isMobileOpen ? 'position-fixed start-0 top-0 h-100' : 'd-none d-lg-flex'
        }`}
        style={{ zIndex: 1045, width: '260px' }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 px-2">
          <NavLink to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <span className="p-1 rounded bg-success bg-opacity-25 d-flex align-items-center justify-content-center">
              <Sprout className="text-warning" size={24} />
            </span>
            <div className="d-flex flex-column">
              <span className="text-white brand-font fw-bold fs-5">
                Krishi<span style={{ color: '#E9C46A' }}>Connect</span>
              </span>
              <span className="text-success small fw-medium" style={{ fontSize: '0.72rem', letterSpacing: '0.3px' }}>
                {isAdmin ? 'ADMIN CONTROL PANEL' : 'SMART AGRI PLATFORM'}
              </span>
            </div>
          </NavLink>
          {isMobileOpen && (
            <button className="btn btn-sm btn-link text-light p-0 d-lg-none" onClick={closeMobileSidebar}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="p-2 mb-3 rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name || 'User'}
            className="rounded-circle object-fit-cover"
            style={{ width: '40px', height: '40px', border: '2px solid #52B788' }}
          />
          <div className="text-truncate" style={{ maxWidth: '160px' }}>
            <div className="text-white fw-semibold small text-truncate">{user?.name}</div>
            <div className="badge bg-success bg-opacity-25 text-warning small px-2 py-0" style={{ fontSize: '0.7rem' }}>
              {user?.role}
            </div>
          </div>
        </div>

        {/* Navigation Links Scrollable */}
        <div className="flex-grow-1 overflow-y-auto pe-1" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          <nav className="d-flex flex-column gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/dashboard' || link.to === '/admin'}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `sidebar-nav-link d-flex align-items-center justify-content-between ${
                      isActive ? 'active' : ''
                    }`
                  }
                >
                  <div className="d-flex align-items-center gap-2 text-truncate">
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="text-truncate">{link.label}</span>
                  </div>
                  {link.badge > 0 && (
                    <span className="badge rounded-pill bg-danger text-white small px-2 py-0">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-3 border-top border-secondary border-opacity-25 mt-2">
          <button
            onClick={handleLogout}
            className="sidebar-nav-link w-100 text-danger border-0 bg-transparent text-start d-flex align-items-center gap-2"
          >
            <LogOut size={18} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
