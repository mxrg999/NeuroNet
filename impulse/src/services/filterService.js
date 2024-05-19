
import api from './api';

export const getAllThings = async () => {
    try {
      const response = await api.get('/things/');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const getAllUsers = async () => {
    try {
      const response = await api.get('/users/');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const getAllPlaces = async () => {
    try {
      const response = await api.get('/places/');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const searchElements = async (username, placeName, thingName) => {
    try {
      const response = await api.get('/search', {
        params: {
          username,
          place_name: placeName,
          thing_name: thingName,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };