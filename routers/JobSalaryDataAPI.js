const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  const { job_title, location, radius } = req.query;

  const options = {
    method: 'GET',
    url: 'https://job-salary-data.p.rapidapi.com/job-salary',
    params: {
      job_title,
      location,
      radius
    },
    headers: {
      'X-RapidAPI-Key': 'bf07d1bcadmsh1a5ceb557fde6b6p10b8abjsn95b283f95708',
      'X-RapidAPI-Host': 'job-salary-data.p.rapidapi.com'
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
