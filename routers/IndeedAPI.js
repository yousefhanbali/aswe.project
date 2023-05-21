const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  const { start } = req.query; 

  const options = {
    method: 'GET',
    url: 'https://indeed12.p.rapidapi.com/company/Ubisoft/jobs',
    params: { start },
    headers: {
      'X-RapidAPI-Key': 'bf07d1bcadmsh1a5ceb557fde6b6p10b8abjsn95b283f95708',
      'X-RapidAPI-Host': 'indeed12.p.rapidapi.com'
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
