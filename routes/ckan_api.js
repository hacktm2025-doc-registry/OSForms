require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.CKAN_API_TOKEN;
const CKAN_URL = process.env.CKAN_API_URL

let createUser = async ({ email, name, password, fullname }) => {
  // Check if user already exists
  let newUser = {
    name: name,
    email: email,
    password: password,
    fullname: fullname || name, // Use name as fullname if not provided
    role: 'user' // Default role
  };
 try {
    const response = await axios.post(
      `${CKAN_URL}/api/3/action/user_create`,
      newUser,
      {
        headers: {
          'Authorization': TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('User created:', response.data.result);
    return response.data.result;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    return null;
  }
}

const getUser = async (username) => {
  try {
    const response = await axios.post(
      `${CKAN_URL}/api/3/action/user_show`,
      { id: username },
      {
        headers: {
          'Authorization': TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ User found:', response.data.result);
    return response.data.result;
  } catch (err) {
    if (err.response?.data?.error?.__type === 'NotFound') {
      console.log(`❌ User "${username}" does not exist.`);
    } else {
      console.error('⚠️ Error:', err.response?.data || err.message);
    }
    return null;
  }
};

module.exports = {
  createUser,
  getUser
};