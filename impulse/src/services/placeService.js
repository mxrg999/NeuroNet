import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createPlace = async (placeData) => {
  try {
    const response = await api.post('/places/', placeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const getPlaceById = async (id) => {
  try {
    const response = await api.get(`/places/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const getPlaceByName = async (name) => {
  try {
    const response = await api.get(`/places/name/${name}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const updatePlace = async (id, placeData) => {
  try {
    const response = await api.put(`/places/${id}`, placeData);
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

export const deletePlace = async (id) => {
  try {
    const response = await api.delete(`/places/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};
