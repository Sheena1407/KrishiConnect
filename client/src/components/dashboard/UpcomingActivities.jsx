import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityAPI } from '../../services/api';
import { CalendarCheck, Droplets, FlaskConical, Bug, Scissors, Plus, ArrowRight, Check } from 'lucide-react';

const UpcomingActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await activityAPI.getAll();
      if (res.data.success) {
        setActivities(res.data.activities.slice(0, 4));
      }
    } catch (e) {
      console.error('Activities load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleToggle = async (id) => {
    try {
      await activityAPI.toggle(id);
      fetchActivities();
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Irrigation':
        return <Droplets size={16} className="text-info" />;
      case 'Fertilizer':
        return <FlaskConical size={16} className="text-warning" />;
      case 'Pest inspection':
        return <Bug size={16} className="text-danger" />;
      case 'Harvesting':
        return <Scissors size={16} className="text-success" />;
      default:
        return <CalendarCheck size={16} className="text-secondary" />;
    }
  };

  return (
    <div className="krishi-card p-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
            <CalendarCheck size={20} />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Upcoming Activities</h6>
            <span className="text-muted small">Field planner tasks</span>
          </div>
        </div>
        <Link to="/planner" className="btn btn-sm btn-outline-krishi py-1 px-3 small d-flex align-items-center gap-1">
          <span>View Planner</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex-grow-1 d-flex flex-column gap-2 justify-content-around">
        {loading ? (
          <div className="text-center py-4 text-muted small">Loading scheduled tasks...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            No upcoming tasks scheduled.{' '}
            <Link to="/planner" className="text-success fw-semibold">Schedule now</Link>
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act._id}
              className={`p-2 px-3 rounded-3 border d-flex align-items-center justify-content-between transition ${
                act.status === 'Completed'
                  ? 'bg-light text-muted border-light-subtle opacity-75'
                  : 'bg-white border-light-subtle'
              }`}
            >
              <div className="d-flex align-items-center gap-3">
                <button
                  onClick={() => handleToggle(act._id)}
                  className={`btn btn-sm p-1 rounded-circle border d-flex align-items-center justify-content-center ${
                    act.status === 'Completed' ? 'btn-success text-white' : 'btn-outline-secondary'
                  }`}
                  style={{ width: '24px', height: '24px' }}
                  title="Toggle complete"
                >
                  {act.status === 'Completed' && <Check size={12} />}
                </button>

                <div>
                  <div className={`fw-semibold small ${act.status === 'Completed' ? 'text-decoration-line-through' : 'text-dark'}`}>
                    {act.title}
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.75rem' }}>
                    <span>{getIcon(act.activityType)}</span>
                    <span>{act.cropId?.cropName || act.farmId?.farmName || 'General'}</span>
                    <span>&middot;</span>
                    <span>{act.date} at {act.time}</span>
                  </div>
                </div>
              </div>

              <span
                className={`badge small ${
                  act.status === 'Completed'
                    ? 'bg-success-subtle text-success'
                    : act.status === 'Overdue'
                    ? 'bg-danger-subtle text-danger'
                    : 'bg-primary-subtle text-primary'
                }`}
              >
                {act.status}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-2 border-top border-light-subtle d-flex justify-content-between align-items-center small text-muted">
        <span>Organized farm calendar</span>
        <Link to="/planner" className="text-success text-decoration-none fw-semibold">
          + Add Task
        </Link>
      </div>
    </div>
  );
};

export default UpcomingActivities;
