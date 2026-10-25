import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  CloudSun,
  Package,
  GraduationCap,
  Users,
  CheckCircle2,
  CalendarCheck,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getAll();
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pest':
        return <ShieldAlert size={20} className="text-danger" />;
      case 'weather':
        return <CloudSun size={20} className="text-info" />;
      case 'order':
        return <Package size={20} className="text-warning" />;
      case 'consultation':
        return <GraduationCap size={20} className="text-success" />;
      case 'community':
        return <Users size={20} className="text-primary" />;
      case 'activity':
        return <CalendarCheck size={20} className="text-success" />;
      default:
        return <Bell size={20} className="text-secondary" />;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Checking real-time agricultural alerts..." />;
  }

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
              <Bell size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Notifications & Alerts</h3>
            {unreadCount > 0 && (
              <span className="badge rounded-pill bg-danger text-white ms-2 small">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-muted small mb-0">
            Real-time updates regarding weather alerts, pest outbreaks, scheduled activities, and market orders.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are completely caught up! We will alert you when critical weather or pest updates occur."
        />
      ) : (
        <div className="d-flex flex-column gap-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`krishi-card p-3 p-md-4 transition d-flex align-items-start gap-3 ${
                !item.isRead ? 'border-success bg-success bg-opacity-10' : 'bg-white'
              }`}
            >
              <div className="p-2 rounded-circle bg-white shadow-sm flex-shrink-0 mt-1">
                {getTypeIcon(item.type)}
              </div>

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <h6 className="fw-bold text-dark mb-0">{item.title}</h6>
                  <span className="small text-muted" style={{ fontSize: '0.72rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="small text-muted mb-2 lh-sm">{item.message}</p>

                <div className="d-flex align-items-center gap-3">
                  {item.link && (
                    <Link
                      to={item.link}
                      className="text-success small fw-semibold text-decoration-none"
                    >
                      View Details &rarr;
                    </Link>
                  )}
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item._id)}
                      className="btn btn-sm btn-link text-secondary p-0 text-decoration-none small"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
