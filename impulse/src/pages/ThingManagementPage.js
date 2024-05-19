import React, { useState, useEffect } from 'react';
import { getAllThings, createThing, updateThing, getThingByName } from '../services/thingService';

const ThingManagementPage = () => {
  const [things, setThings] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [newThing, setNewThing] = useState({ name: '', description: '' });
  const [editingThing, setEditingThing] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
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
    try {
      const response = await createThing(newThing);
      setMessage(response.message);
      setMessageColor('green');
      setNewThing({ name: '', description: '' });
      fetchAllThings();
    } catch (error) {
      setMessage(error.message || 'An error occurred while creating thing');
      setMessageColor('red');
    }
  };

  const handleEditThing = async (e) => {
    e.preventDefault();
    if (!editingThing) return;

    try {
      const response = await updateThing(editingThing.id, { name: editName, description: editDescription });
      setMessage(response.message);
      setMessageColor('green');
      setEditingThing(null);
      setEditName('');
      setEditDescription('');
      fetchAllThings();
    } catch (error) {
      setMessage(error.message || 'An error occurred while updating thing');
      setMessageColor('red');
    }
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
        <button type="submit">Create Thing</button>
      </form>

      <h3>All Things</h3>
      <ul>
        {things.map((thing) => (
          <li key={thing.id}>
            <p>Name: {thing.name}</p>
            <p>Description: {thing.description}</p>
            <button onClick={() => {
              setEditingThing(thing);
              setEditName(thing.name);
              setEditDescription(thing.description);
            }}>
              Edit
            </button>
          </li>
        ))}
      </ul>

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
            <button type="submit">Update Thing</button>
            <button type="button" onClick={() => setEditingThing(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ThingManagementPage;
