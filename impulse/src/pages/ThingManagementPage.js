import React, { useState, useEffect } from 'react';
import { getAllThings, createThing, updateThing, deleteThing, getThingByName } from '../services/thingService';

const ThingManagementPage = () => {
  const [things, setThings] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [newThing, setNewThing] = useState({ name: '', description: '' });
  const [editingThing, setEditingThing] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newMetadata, setNewMetadata] = useState([]);
  const [editMetadata, setEditMetadata] = useState([]);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    fetchAllThings();
  }, []);

  const fetchAllThings = async () => {
    try {
      const thingsData = await getAllThings();
      setThings(thingsData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching things');
      setMessageColor('red');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const thingData = await getThingByName(searchName);
      setThings([thingData]);
      setMessage('Thing found successfully');
      setMessageColor('green');
    } catch (error) {
      setMessage(error.detail || error.message || 'Thing not found');
      setMessageColor('red');
      setThings([]);
    }
  };

  const handleCreateThing = async (e) => {
    e.preventDefault();
    const metadataObj = newMetadata.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
    const thingData = {
      ...newThing,
      metadata: metadataObj,
    };
    try {
      const response = await createThing(thingData);
      setMessage(response.message);
      setMessageColor('green');
      setNewThing({ name: '', description: '' });
      setNewMetadata([]);
      fetchAllThings();
    } catch (error) {
      setMessage(error.message || 'An error occurred while creating thing');
      setMessageColor('red');
    }
  };

  const handleEditThing = async (e) => {
    e.preventDefault();
    if (!editingThing) return;

    const metadataObj = editMetadata.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});

    try {
      const response = await updateThing(editingThing.id, { name: editName, description: editDescription, metadata: metadataObj });
      setMessage(response.message);
      setMessageColor('green');
      setEditingThing(null);
      setEditName('');
      setEditDescription('');
      setEditMetadata([]);
      fetchAllThings();
    } catch (error) {
      setMessage(error.message || 'An error occurred while updating thing');
      setMessageColor('red');
    }
  };

  const handleDeleteThing = async (thingId) => {
    try {
      const response = await deleteThing(thingId);
      setMessage(response.message);
      setMessageColor('green');
      fetchAllThings();
    } catch (error) {
      setMessage(error.message || 'An error occurred while deleting thing');
      setMessageColor('red');
    }
  };

  const handleAddMetadata = () => {
    setNewMetadata([...newMetadata, { key: '', value: '' }]);
  };

  const handleRemoveMetadata = (index) => {
    const newMetadataList = [...newMetadata];
    newMetadataList.splice(index, 1);
    setNewMetadata(newMetadataList);
  };

  const handleMetadataChange = (index, key, value) => {
    const newMetadataList = [...newMetadata];
    newMetadataList[index][key] = value;
    setNewMetadata(newMetadataList);
  };

  const handleAddEditMetadata = () => {
    setEditMetadata([...editMetadata, { key: '', value: '' }]);
  };

  const handleRemoveEditMetadata = (index) => {
    const newMetadataList = [...editMetadata];
    newMetadataList.splice(index, 1);
    setEditMetadata(newMetadataList);
  };

  const handleEditMetadataChange = (index, key, value) => {
    const newMetadataList = [...editMetadata];
    newMetadataList[index][key] = value;
    setEditMetadata(newMetadataList);
  };

  return (
    <div>
      <h2>Thing Management</h2>
      {message && <p style={{ color: messageColor }}>{message}</p>}

      <form onSubmit={handleSearch}>
        <div>
          <label>Search by Name:</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
        <button type="button" onClick={fetchAllThings}>Show All Things</button>
      </form>

      <h3>Create New Thing</h3>
      <form onSubmit={handleCreateThing}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newThing.name}
            onChange={(e) => setNewThing({ ...newThing, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={newThing.description}
            onChange={(e) => setNewThing({ ...newThing, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Metadata:</label>
          {newMetadata.map((metadata, index) => (
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
        <button type="submit">Create Thing</button>
      </form>

      <h3>All Things</h3>
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
          {things.map((thing) => (
            <tr key={thing.id}>
              <td>{thing.name}</td>
              <td>{thing.description}</td>
              <td>{JSON.stringify(thing.metadata)}</td>
              <td>
                <button onClick={() => {
                  setEditingThing(thing);
                  setEditName(thing.name);
                  setEditDescription(thing.description);
                  const thingMetadata = Object.entries(thing.metadata || {}).map(([key, value]) => ({ key, value }));
                  setEditMetadata(thingMetadata);
                }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteThing(thing.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingThing && (
        <div>
          <h3>Edit Thing</h3>
          <form onSubmit={handleEditThing}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
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
                    onChange={(e) => handleEditMetadataChange(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={metadata.value}
                    onChange={(e) => handleEditMetadataChange(index, 'value', e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveEditMetadata(index)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddEditMetadata}>Add Metadata</button>
            </div>
            <button type="submit">Update Thing</button>
            <button type="button" onClick={() => setEditingThing(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ThingManagementPage;
