import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  ShoppingCart,
  Check,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All',
  'Seeds',
  'Fertilizers',
  'Organic Manure',
  'Farming Tools',
  'Irrigation Equipment',
  'Plant Protection',
];

const KrishiMarket = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [addedIds, setAddedIds] = useState({});

  const { addToCart, cartCount } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await resourceAPI.getAll({
        category: selectedCategory,
        search: searchTerm,
        sortBy,
      });
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
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-warning bg-opacity-25 text-warning-emphasis">
              <ShoppingBag size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Krishi Market (कृषि बाज़ार)</h3>
          </div>
          <p className="text-muted small mb-0">
            Certified seeds, bio-fertilizers, organic manure, tools and micro-irrigation kits.
          </p>
        </div>

        <Link to="/cart" className="btn btn-krishi position-relative px-4">
          <ShoppingCart size={18} />
          <span>View Cart</span>
          {cartCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="krishi-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={15} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search certified seeds, fertilizers, sprayers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-center gap-1">
              <Filter size={15} className="text-muted" />
              <select
                className="form-select form-select-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </form>
      </div>

      {/* Category Quick Chips */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn btn-sm rounded-pill px-3 py-1 ${
              selectedCategory === cat
                ? 'btn-success text-white fw-bold'
                : 'btn-outline-secondary bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading agricultural products and stock levels..." />
      ) : products.length === 0 ? (
        <div className="krishi-card p-5 text-center text-muted">
          No agricultural products found matching your search.
        </div>
      ) : (
        <div className="row g-4">
          {products.map((p) => {
            const isAdded = addedIds[p._id];

            return (
              <div key={p._id} className="col-sm-6 col-md-4 col-lg-4">
                <div className="krishi-card h-100 d-flex flex-column overflow-hidden krishi-card-hover">
                  <div className="position-relative" style={{ height: '200px' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white small px-2 py-1">
                      {p.category}
                    </span>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted">{p.seller}</span>
                      <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
                        <Star size={14} fill="#FFC107" />
                        <span>{p.rating}</span>
                      </div>
                    </div>

                    <h5 className="fw-bold text-dark mb-2 line-clamp-2">{p.name}</h5>
                    <p className="small text-muted flex-grow-1 line-clamp-3 mb-3" style={{ lineHeight: 1.5 }}>
                      {p.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light-subtle mt-auto">
                      <div>
                        <div className="fw-extrabold text-success fs-4 mb-0">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                        <span className="small text-muted" style={{ fontSize: '0.72rem' }}>
                          In Stock: {p.stock} {p.unit}s
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock <= 0}
                        className={`btn btn-sm ${
                          isAdded ? 'btn-success text-white' : 'btn-krishi'
                        } rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} /> Added!
                          </>
                        ) : (
                          <>
                            <Plus size={16} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KrishiMarket;
