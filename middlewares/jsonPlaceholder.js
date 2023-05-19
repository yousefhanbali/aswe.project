const axios = require('axios');

async function getPosts() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    throw new Error('Failed to retrieve posts');
  }
}

module.exports = {
  getPosts,
};
