import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Package, Truck, CheckCircle2, Clock, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const ORDER_STEPS = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMy();
      if (res.data.success) {
        setOrders(res.data.orders);
        if (res.data.orders.length > 0) {
          setExpandedId(res.data.orders[0]._id);
        }
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge bg-success text-white">Delivered</span>;
      case 'Shipped':
        return <span className="badge bg-primary text-white">Out for Delivery</span>;
      case 'Processing':
        return <span className="badge bg-warning text-dark">Processing</span>;
      case 'Cancelled':
        return <span className="badge bg-danger text-white">Cancelled</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary">{status}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your orders and logistics timeline..." />;
  }

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
            <Package size={24} />
          </span>
          <h3 className="fw-bold text-dark mb-0">My Farm Resource Orders</h3>
        </div>
        <p className="text-muted small mb-0">
          Track the delivery of certified seeds, fertilizers, and irrigation kits straight to your farm gate.
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Placed Yet"
          description="Browse Krishi Market to purchase genuine agricultural products with subsidized doorstep delivery."
          actionText="Visit Krishi Market"
          onAction={() => (window.location.href = '/market')}
        />
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order._id;
            const currentStepIdx = ORDER_STEPS.indexOf(order.status);

            return (
              <div key={order._id} className="krishi-card p-4">
                {/* Order Summary Bar */}
                <div
                  className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 cursor-pointer pb-2"
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-dark">Order #{order._id.slice(-6).toUpperCase()}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-muted small">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="text-sm-end">
                      <div className="fw-extrabold text-success fs-5">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <span className="text-muted small">{order.items?.length} items</span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
                  </div>
                </div>

                {/* Visual Order Tracking Timeline */}
                {order.status !== 'Cancelled' && (
                  <div className="py-4 my-2 border-top border-bottom border-light-subtle">
                    <div className="stage-tracker mb-0">
                      <div className="stage-line" style={{ top: '15px' }}></div>
                      {ORDER_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        return (
                          <div key={step} className={`stage-step ${isDone ? 'active' : ''}`}>
                            <div
                              className="stage-dot"
                              style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: isDone ? '#2D6A4F' : '#E2E8E4',
                                boxShadow: isDone ? '0 0 0 3px rgba(45, 106, 79, 0.2)' : 'none',
                              }}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className="small fw-semibold mt-1">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Expanded Items & Address Breakdown */}
                {isExpanded && (
                  <div className="pt-3">
                    <h6 className="fw-bold text-dark mb-2 small text-uppercase">Ordered Products</h6>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {order.items?.map((item, i) => (
                        <div
                          key={i}
                          className="p-2 px-3 rounded-3 bg-light d-flex justify-content-between align-items-center small"
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded object-fit-cover"
                                style={{ width: '38px', height: '38px' }}
                              />
                            )}
                            <div>
                              <div className="fw-bold text-dark">{item.name}</div>
                              <span className="text-muted">Quantity: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="fw-bold text-dark">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-3 bg-sand small text-dark d-flex flex-column flex-sm-row justify-content-between gap-2 border border-warning border-opacity-25">
                      <div>
                        <strong>Delivery Address: </strong>
                        {order.shippingAddress?.recipientName}, {order.shippingAddress?.street}, {order.shippingAddress?.villageOrCity}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </div>
                      <div className="text-sm-end text-muted">
                        Phone: {order.shippingAddress?.phone} &middot; {order.paymentMethod}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
