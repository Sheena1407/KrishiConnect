import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, Search, Trash2, Power, MapPin, CheckCircle, XCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers({ search, role: roleFilter });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(id);
      setMessage({
        text: `User account has been ${!currentStatus ? 'activated' : 'deactivated'}`,
        type: 'success',
      });
      fetchUsers();
    } catch (err) {
      setMessage({ text: 'Status update failed', type: 'danger' });
    }
  };

  const handleDelete = async (id, name, role) => {
    if (role === 'Admin') {
      alert('Admin account cannot be deleted');
      return;
    }
    if (window.confirm(`Delete user "${name}" and all associated farms and crops?`)) {
      try {
        await adminAPI.deleteUser(id);
        setMessage({ text: `User ${name} deleted successfully`, type: 'success' });
        fetchUsers();
      } catch (err) {
        setMessage({ text: err.response?.data?.message || 'Delete failed', type: 'danger' });
      }
    }
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">User & Farmer Management</h3>
          <p className="text-muted small mb-0">Search, monitor and manage active and deactivated user accounts</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="krishi-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={15} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search name, email, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-md-end gap-2">
            <select
              className="form-select form-select-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ maxWidth: '160px' }}
            >
              <option value="All">All Roles</option>
              <option value="Farmer">Farmer</option>
              <option value="Admin">Admin</option>
            </select>
            <button onClick={fetchUsers} className="btn btn-sm btn-krishi">
              Search
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : (
        <div className="krishi-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.profileImage}
                          alt={u.name}
                          className="rounded-circle object-fit-cover"
                          style={{ width: '36px', height: '36px' }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{u.name}</div>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{u.phone || 'N/A'}</td>
                    <td>{u.location}</td>
                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'bg-danger' : 'bg-success bg-opacity-10 text-success'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {u.role !== 'Admin' && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u._id, u.isActive)}
                              className={`btn btn-sm ${u.isActive ? 'btn-outline-warning' : 'btn-outline-success'} py-0 px-2`}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                              style={{ fontSize: '0.75rem' }}
                            >
                              <Power size={13} className="me-1" />
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(u._id, u.name, u.role)}
                              className="btn btn-sm btn-outline-danger py-0 px-2"
                              title="Delete user"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
