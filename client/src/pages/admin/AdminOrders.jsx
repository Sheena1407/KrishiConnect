import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Package, Truck, CheckCircle2, Clock, Filter, AlertTriangle } from 'lucide-react';

const STATUSES = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAllAdmin();
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setMessage({ text: `Order status updated to ${newStatus}`, type: 'success' });
      fetchOrders();
    } catch (e) {
      setMessage({ text: 'Status update failed', type: 'danger' });
    }
  };

  const filtered = filterStatus === 'All' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Customer Orders & Logistics</h3>
          <p className="text-muted small mb-0">Update dispatch statuses and monitor farmer deliveries</p>
        </div>

        <select
          className="form-select form-select-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading orders..." />
      ) : (
        <div className="krishi-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer Farmer</th>
                  <th>Products Ordered</th>
                  <th>Total Amount</th>
                  <th>Destination Address</th>
                  <th>Current Status</th>
                  <th className="text-end">Update Logistics Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-bold text-dark">
                      #{order._id.slice(-6).toUpperCase()}
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{order.shippingAddress?.recipientName || order.userId?.name}</div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {order.shippingAddress?.phone || order.userId?.phone}
                      </span>
                    </td>
                    <td>
                      <div className="small">
                        {order.items?.map((it, i) => (
                          <div key={i} className="text-truncate" style={{ maxWidth: '200px' }}>
                            &bull; {it.name} (x{it.quantity})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="fw-extrabold text-success">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="small text-muted" style={{ maxWidth: '200px' }}>
                      {order.shippingAddress?.villageOrCity}, {order.shippingAddress?.state} ({order.shippingAddress?.pincode})
                    </td>
                    <td>
                      <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Shipped' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ width: '135px', display: 'inline-block' }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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

export default AdminOrders;
