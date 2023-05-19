const express = require('express');
const indeedJobsClient = require('../middlewares/jsonPlaceholder');

const router = express.Router();


router.get('/posts', async (req, res) => {
  const { bs } = req.query;
  console.log(bs);

  try {
    const posts = await indeedJobsClient.getPosts();

    // Filter the posts based on the bs
    const filteredPosts = posts.filter((post) => post.company.bs.includes(bs));

    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

module.exports = router;
