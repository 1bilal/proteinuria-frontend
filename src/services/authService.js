import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.43.137:8000/api/'; // Replace with your actual backend URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Utility function to retrieve the token from storage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    console.log('Retrieved token from storage:', token);  // Add this line
    return token;
  } catch (error) {
    console.error('Error getting token from storage', error);
    return null;
  }
};


// Setting up the Authorization header for authenticated requests
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`; // Updated to use 'Token' instead of 'Bearer'
      console.log('Attached auth token to request:', token); // Debug log
    } else {
      console.log('No auth token found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);



// POST request to login user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}token/`, {
      username,
      password,
    });
    // Save the token to AsyncStorage
    const { token } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    return token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Fetching test results from the backend
export const getTestResults = async () => {
  try {
    const response = await api.get('test-results/');
    return response.data;
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
};

// Posting new test result to the backend
export const postTestResult = async (testResultData, isMultipart = false) => {
  try {
    // Ensure entry_method is hardcoded to 'manual'
    const updatedTestResultData = {
      ...testResultData,
      entry_method: 'manual',
    };

    const headers = isMultipart
      ? { 'Content-Type': 'multipart/form-data' }
      : undefined;

    const response = await api.post('test-results/', updatedTestResultData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting test result:', error.response?.data || error.message);
    throw error;
  }
};


// Log out by removing the token from AsyncStorage
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
