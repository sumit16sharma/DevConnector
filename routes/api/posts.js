const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route   POST /api/posts
// @desc    Create a Post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is Required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // date -1 means most recent post comes first
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not Found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);

    if (error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not Found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (error) {
    console.error(error.message);

    if (error.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }

    res.status(500).send('Server Error');
  }
});

module.exports = router;
