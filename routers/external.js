const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  const searchTerms = req.query.search_terms || 'python programmer';
  const location = req.query.location || 'Chicago, IL';
  const page = req.query.page || '1';

  const options = {
    method: 'POST',
    url: 'https://linkedin-jobs-search.p.rapidapi.com/',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'bf07d1bcadmsh1a5ceb557fde6b6p10b8abjsn95b283f95708',
      'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
    },
    data: {
      search_terms: searchTerms,
      location: location,
      page: page
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
