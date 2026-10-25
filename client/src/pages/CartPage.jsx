import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import EmptyState from '../components/common/EmptyState';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    recipientName: user?.name || '',
    phone: user?.phone || '',
    street: 'Plot No. 14, Gram Panchayat Road',
    villageOrCity: user?.location ? user.location.split(',')[0].trim() : 'Sehore',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    pincode: '466001',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          resourceId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          unit: item.unit,
        })),
        shippingAddress,
        paymentMethod,
      };

      const res = await orderAPI.create(orderData);
      if (res.data.success) {
        clearCart();
        setOrderSuccess(res.data.order);
        // trigger festive celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="py-5 text-center">
        <div className="krishi-card p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="rounded-circle p-3 bg-success bg-opacity-10 text-success d-inline-flex mb-3">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="fw-bold text-dark mb-2">Order Confirmed!</h2>
          <p className="text-muted small mb-3">
            Thank you, {shippingAddress.recipientName}! Your agricultural resources have been booked for delivery.
          </p>
          <div className="p-3 bg-light rounded-3 mb-4 text-start small">
            <div><strong>Order ID:</strong> #{orderSuccess._id.slice(-6).toUpperCase()}</div>
            <div><strong>Total Amount:</strong> ₹{orderSuccess.totalAmount.toLocaleString('en-IN')}</div>
            <div><strong>Payment Mode:</strong> {orderSuccess.paymentMethod}</div>
            <div><strong>Shipping To:</strong> {orderSuccess.shippingAddress?.street}, {orderSuccess.shippingAddress?.villageOrCity}, {orderSuccess.shippingAddress?.state}</div>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/orders" className="btn btn-krishi">
              View Order Tracking &rarr;
            </Link>
            <Link to="/market" className="btn btn-outline-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pb-5">
        <EmptyState
          icon={ShoppingCart}
          title="Your Cart is Empty"
          description="Browse the Krishi Market to find certified seeds, organic fertilizers, tools, and irrigation kits."
          actionText="Browse Krishi Market"
          onAction={() => navigate('/market')}
        />
      </div>
    );
  }

  return (
    <div className="pb-5">
      <div className="d-flex align-items-center gap-2 mb-4">
        <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
          <ShoppingCart size={24} />
        </span>
        <h3 className="fw-bold text-dark mb-0">Shopping Cart & Checkout</h3>
      </div>

      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      <div className="row g-4">
        {/* Left: Cart Items List */}
        <div className="col-lg-7">
          <div className="krishi-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light-subtle">
              <h5 className="fw-bold text-dark mb-0">Items in Your Cart ({cartItems.length})</h5>
              <button onClick={clearCart} className="btn btn-sm btn-link text-danger p-0 text-decoration-none">
                Clear All
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="p-3 rounded-3 border border-light-subtle d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 bg-light bg-opacity-25"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-3 object-fit-cover"
                      style={{ width: '64px', height: '64px' }}
                    />
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{item.name}</h6>
                      <div className="text-muted small">
                        ₹{item.price.toLocaleString('en-IN')} per {item.unit || 'unit'}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center border rounded-pill bg-white px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="btn btn-sm btn-link text-dark p-0"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 fw-bold small">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="btn btn-sm btn-link text-dark p-0"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="fw-bold text-dark text-end" style={{ minWidth: '90px' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn btn-sm btn-link text-danger p-1"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-top border-light-subtle d-flex justify-content-between text-muted small">
              <span className="d-flex align-items-center gap-1">
                <Truck size={16} className="text-success" /> Free delivery across all agricultural blocks
              </span>
              <span className="d-flex align-items-center gap-1">
                <ShieldCheck size={16} className="text-success" /> 100% Genuine Certified Stock
              </span>
            </div>
          </div>
        </div>

        {/* Right: Checkout & Address Details */}
        <div className="col-lg-5">
          <div className="krishi-card p-4">
            <h5 className="fw-bold text-dark mb-3">Delivery & Summary</h5>

            <form onSubmit={handleCheckout}>
              <div className="row g-2 mb-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Farmer / Recipient Name *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.recipientName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, recipientName: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Contact Phone *</label>
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Farm Address / Street *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Village / City *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.villageOrCity}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, villageOrCity: e.target.value })}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">State *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Pincode *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Payment Option</label>
                <select
                  className="form-select form-select-sm"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash on Delivery">Cash on Delivery (Pay at Farm Delivery)</option>
                  <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC Subsidized)</option>
                  <option value="UPI / Online Net Banking">UPI / Digital Kisan Pay</option>
                </select>
              </div>

              <div className="border-top border-bottom border-light-subtle py-3 my-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Delivery Charge</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <div className="d-flex justify-content-between fw-bold text-dark fs-5">
                  <span>Total Amount</span>
                  <span className="text-success">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold w-100 py-2 fw-bold"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
