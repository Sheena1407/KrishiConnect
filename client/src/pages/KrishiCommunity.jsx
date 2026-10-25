import React, { useState, useEffect } from 'react';
import { communityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  Users,
  MessageSquare,
  Heart,
  Plus,
  Search,
  Filter,
  Send,
  Trash2,
  MapPin,
  Calendar,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Crop Problems',
  'Soil Health',
  'Weather',
  'Pest Control',
  'Irrigation',
  'Organic Farming',
  'Market Prices',
];

const KrishiCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    category: 'Crop Problems',
  });

  const fetchPosts = async () => {
    try {
      const res = await communityAPI.getAll({
        category: selectedCategory,
        search,
      });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await communityAPI.create(postForm);
      setPostForm({ title: '', content: '', category: 'Crop Problems' });
      setShowPostModal(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await communityAPI.toggleLike(postId);
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      await communityAPI.addComment(postId, newComment);
      setNewComment('');
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Delete this community post?')) {
      try {
        await communityAPI.delete(postId);
        fetchPosts();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
              <Users size={24} />
            </span>
            <h3 className="fw-bold text-dark mb-0">Krishi Community (कृषि चौपाल)</h3>
          </div>
          <p className="text-muted small mb-0">
            Share farming knowledge, discuss mandi rate trends, and ask questions to fellow farmers across India.
          </p>
        </div>

        <button onClick={() => setShowPostModal(true)} className="btn btn-krishi px-4">
          <Plus size={16} /> Create New Discussion
        </button>
      </div>

      {/* Filter and Search Bar */}
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
                placeholder="Search community posts, pest issues, questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-md-end">
            <select
              className="form-select form-select-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ maxWidth: '220px' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
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
        <LoadingSpinner message="Loading farmer community discussions..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Discussions Found"
          description="Be the first progressive farmer to start a conversation in this topic!"
          actionText="+ Start Discussion"
          onAction={() => setShowPostModal(true)}
        />
      ) : (
        <div className="d-flex flex-column gap-4">
          {posts.map((post) => {
            const isLiked = post.likes?.some((id) => id === user?._id || id?._id === user?._id);
            const showComments = activeCommentsPostId === post._id;

            return (
              <div key={post._id} className="krishi-card p-4">
                {/* Author Info */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={post.userId?.profileImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250'}
                      alt={post.authorName}
                      className="rounded-circle object-fit-cover"
                      style={{ width: '42px', height: '42px', border: '2px solid #52B788' }}
                    />
                    <div>
                      <div className="fw-bold text-dark">{post.authorName}</div>
                      <span className="text-muted small d-flex align-items-center gap-1">
                        <MapPin size={12} className="text-danger" /> {post.authorLocation} &middot; {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success bg-opacity-10 text-success small">
                      {post.category}
                    </span>
                    {(post.userId?._id === user?._id || user?.role === 'Admin') && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="btn btn-sm btn-link text-danger p-0 ms-2"
                        title="Delete post"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="fw-bold text-dark mb-2">{post.title}</h4>
                <p className="text-muted small mb-3 lh-base" style={{ whiteSpace: 'pre-line' }}>
                  {post.content}
                </p>

                {/* Actions: Likes & Comments count */}
                <div className="d-flex align-items-center gap-4 py-2 border-top border-bottom border-light-subtle my-2 small">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`btn btn-sm btn-link p-0 text-decoration-none d-flex align-items-center gap-1 ${
                      isLiked ? 'text-danger fw-bold' : 'text-secondary'
                    }`}
                  >
                    <Heart size={16} fill={isLiked ? '#DC3545' : 'transparent'} />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPostId(showComments ? null : post._id)}
                    className="btn btn-sm btn-link text-secondary p-0 text-decoration-none d-flex align-items-center gap-1"
                  >
                    <MessageSquare size={16} />
                    <span>{post.comments?.length || 0} Comments</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <div className="pt-3">
                    <h6 className="fw-bold text-dark small mb-2">Replies & Advice ({post.comments?.length || 0})</h6>

                    <div className="d-flex flex-column gap-2 mb-3">
                      {post.comments?.map((c, idx) => (
                        <div key={idx} className="p-2 px-3 rounded-3 bg-light small">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="fw-bold text-dark">{c.userName}</span>
                            <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.68rem' }}>
                              {c.userRole}
                            </span>
                          </div>
                          <div className="text-muted">{c.comment}</div>
                        </div>
                      ))}
                    </div>

                    {/* New Comment Input */}
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a helpful answer or tip..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="btn btn-krishi px-3"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-success text-white py-3 rounded-top-4" style={{ backgroundColor: '#1B4D3E' }}>
                <h5 className="modal-title fw-bold">Ask or Share with Farming Community</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPostModal(false)}></button>
              </div>

              <form onSubmit={handleCreatePost}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Topic / Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Managing Yellow Mosaic in Soybean crop"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category *</label>
                    <select
                      className="form-select"
                      value={postForm.category}
                      onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Content & Experience *</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Share your practical farming experience, questions about crop issues, or market recommendations..."
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPostModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-krishi px-4">
                    {submitting ? 'Publishing...' : 'Publish Discussion'}
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

export default KrishiCommunity;
