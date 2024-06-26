import api from './api';


export const createRelation = async (relationData) => {
    try {
      const response = await api.post('/relations/', relationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const getRelations = async (sourceId, targetId, relationType) => {
    try {
      const response = await api.get('/relations/', {
        params: {
          source_id: sourceId,
          target_id: targetId,
          relation_type: relationType,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };
  
  export const deleteRelation = async (relationId) => {
    try {
      const response = await api.delete(`/relations/${relationId}`);
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
  
  export const getAllRelations = async () => {
    try {
      const response = await api.get('/relations/all');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };

  export const updateRelation = async (relationId, relationData) => {
    try {
      const response = await api.put(`/relations/${relationId}`, relationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };