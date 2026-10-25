const CommunityPost = require('../models/CommunityPost');

// @desc    Get all community posts
// @route   GET /api/community
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await CommunityPost.find(filter)
      .populate('userId', 'name role profileImage location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/community/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id).populate(
      'userId',
      'name role profileImage location'
    );
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new post
// @route   POST /api/community
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content and category are required',
      });
    }

    const post = await CommunityPost.create({
      userId: req.user._id,
      authorName: req.user.name,
      authorLocation: req.user.location || 'India',
      title,
      content,
      category,
      likes: [],
      comments: [],
    });

    const populated = await CommunityPost.findById(post._id).populate(
      'userId',
      'name role profileImage location'
    );

    res.status(201).json({
      success: true,
      message: 'Post published to Krishi Community!',
      post: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like / unlike a post
// @route   POST /api/community/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyLikedIndex = post.likes.findIndex((id) => id.toString() === userIdStr);

    if (alreadyLikedIndex !== -1) {
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length, isLiked: alreadyLikedIndex === -1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/community/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      comment: comment.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added',
      comment: newComment,
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete post (Owner or Admin)
// @route   DELETE /api/community/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  toggleLike,
  addComment,
  deletePost,
};
