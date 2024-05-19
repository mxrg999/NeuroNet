import api from './api';


export const createThing = async (thingData) => {
    try {
      const response = await api.post('/things/', thingData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const getThingByName = async (name) => {
    try {
      const response = await api.get(`/things/name/${name}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const updateThing = async (thingId, thingData) => {
    try {
      const response = await api.put(`/things/${thingId}`, thingData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const getAllThings = async () => {
    try {
      const response = await api.get('/things/');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };