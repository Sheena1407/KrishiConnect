import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShoppingBag, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

const CATEGORIES = [
  'Seeds',
  'Fertilizers',
  'Organic Manure',
  'Farming Tools',
  'Irrigation Equipment',
  'Plant Protection',
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    category: 'Seeds',
    description: '',
    price: '',
    unit: 'bag',
    stock: 50,
    seller: 'Krishi Agro Kendra',
    image: '',
  });

  const fetchProducts = async () => {
    try {
      const res = await resourceAPI.getAll();
      if (res.data.success) {
        setProducts(res.data.resources);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Seeds',
      description: '',
      price: '',
      unit: 'bag',
      stock: 50,
      seller: 'Krishi Agro Kendra',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&q=80&w=400',
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      seller: p.seller,
      image: p.image,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      if (editingProduct) {
        await resourceAPI.update(editingProduct._id, formData);
        setMessage({ text: 'Product updated successfully!', type: 'success' });
      } else {
        await resourceAPI.create(formData);
        setMessage({ text: 'Product added to Krishi Market!', type: 'success' });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to save product', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete product "${name}" from store?`)) {
      try {
        await resourceAPI.delete(id);
        setMessage({ text: 'Product deleted', type: 'success' });
        fetchProducts();
      } catch (err) {
        setMessage({ text: 'Delete failed', type: 'danger' });
      }
    }
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Krishi Market Product Catalog</h3>
          <p className="text-muted small mb-0">Manage seed inventories, fertilizer stocks, prices and descriptions</p>
        </div>
        <button onClick={openAddModal} className="btn btn-krishi">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show small py-2 mb-3`} role="alert">
          {message.text}
          <button type="button" className="btn-close py-2" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading catalog..." />
      ) : (
        <div className="krishi-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Available</th>
                  <th>Seller</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="rounded object-fit-cover"
                          style={{ width: '40px', height: '40px' }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{p.name}</div>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Rating: ⭐ {p.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">{p.category}</span>
                    </td>
                    <td className="fw-bold text-success">
                      ₹{p.price.toLocaleString('en-IN')}/{p.unit}
                    </td>
                    <td>
                      <span className={`fw-bold ${p.stock > 10 ? 'text-dark' : 'text-danger'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="text-muted">{p.seller}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn btn-sm btn-outline-secondary py-1 px-2"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="btn btn-sm btn-outline-danger py-1 px-2"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">
                  {editingProduct ? 'Edit Product Details' : 'Add Product to Market'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Certified Sharbati Wheat Seeds (40 kg)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="1850"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Unit Type</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="bag, bottle, kit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Stock Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Seller / Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.seller}
                        onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Specifications, certified germination rate, dosage, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
