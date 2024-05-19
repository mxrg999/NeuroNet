import React, { useState, useEffect } from 'react';
import { createPlace, updatePlace, deletePlace, getAllPlaces } from '../services/placeService';

const PlaceManagementPage = () => {
  const [places, setPlaces] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState({});
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [editingPlace, setEditingPlace] = useState(null);
  const [editMetadata, setEditMetadata] = useState([]);

  useEffect(() => {
    fetchAllPlaces();
  }, []);

  const fetchAllPlaces = async () => {
    try {
      const placesData = await getAllPlaces();
      setPlaces(placesData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching places');
      setMessageColor('red');
    }
  };

  const handleAddMetadata = () => {
    setEditMetadata([...editMetadata, { key: '', value: '' }]);
  };

  const handleRemoveMetadata = (index) => {
    const newMetadata = [...editMetadata];
    newMetadata.splice(index, 1);
    setEditMetadata(newMetadata);
  };

  const handleMetadataChange = (index, key, value) => {
    const newMetadata = [...editMetadata];
    newMetadata[index][key] = value;
    setEditMetadata(newMetadata);
  };

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    const metadataObj = editMetadata.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
    const placeData = {
      name,
      description,
      metadata: metadataObj,
    };
    try {
      const response = await createPlace(placeData);
      setMessage('Place created successfully');
      setMessageColor('green');
      fetchAllPlaces();
    } catch (error) {
      setMessage(error.message || 'An error occurred while creating place');
      setMessageColor('red');
    }
  };

  const handleEditPlace = (place) => {
    setEditingPlace(place);
    setName(place.name);
    setDescription(place.description);
    const placeMetadata = Object.entries(place.metadata || {}).map(([key, value]) => ({ key, value }));
    setEditMetadata(placeMetadata);
  };

  const handleSaveEdit = async () => {
    if (!editingPlace) return;
    const metadataObj = editMetadata.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
    const placeData = {
      name,
      description,
      metadata: metadataObj,
    };
    try {
      await updatePlace(editingPlace.id, placeData);
      setMessage('Place updated successfully');
      setMessageColor('green');
      setEditingPlace(null);
      fetchAllPlaces();
    } catch (error) {
      setMessage(error.message || 'An error occurred while updating place');
      setMessageColor('red');
    }
  };

  const handleDeletePlace = async (placeId) => {
    try {
      const response = await deletePlace(placeId);
      setMessage(response.message);
      setMessageColor('green');
      fetchAllPlaces();
    } catch (error) {
      setMessage(error.message || 'An error occurred while deleting place');
      setMessageColor('red');
    }
  };

  return (
    <div>
      <h2>Place Management</h2>
      {message && <p style={{ color: messageColor }}>{message}</p>}

      <form onSubmit={handleCreatePlace}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Metadata:</label>
          {editMetadata.map((metadata, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Key"
                value={metadata.key}
                onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={metadata.value}
                onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveMetadata(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddMetadata}>Add Metadata</button>
        </div>
        <button type="submit">Create Place</button>
      </form>

      <h3>All Places</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Metadata</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place) => (
            <tr key={place.id}>
              <td>{place.name}</td>
              <td>{place.description}</td>
              <td>{JSON.stringify(place.metadata)}</td>
              <td>
                <button onClick={() => handleEditPlace(place)}>Edit</button>
                <button onClick={() => handleDeletePlace(place.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPlace && (
        <div>
          <h3>Edit Place</h3>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label>Metadata:</label>
            {editMetadata.map((metadata, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Key"
                  value={metadata.key}
                  onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={metadata.value}
                  onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveMetadata(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={handleAddMetadata}>Add Metadata</button>
          </div>
          <button type="button" onClick={handleSaveEdit}>Save</button>
          <button type="button" onClick={() => setEditingPlace(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PlaceManagementPage;
