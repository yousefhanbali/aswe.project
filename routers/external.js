const express = require('express');
const indeedJobsClient = require('../middlewares/jsonPlaceholder');

const router = express.Router();


router.get('/posts', async (req, res) => {
  const { id } = req.query;
  console.log(id);

  try {
    const posts = await indeedJobsClient.getPosts();

    // Filter the posts based on the ID
    const filteredPosts = posts.filter((post) => post.id == id);

    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

module.exports = router;
