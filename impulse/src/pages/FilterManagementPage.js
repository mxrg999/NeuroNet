import React, { useState, useEffect } from 'react';
import { getAllThings, getAllUsers, getAllPlaces, searchElements } from '../services/filterService'; // Ensure this path is correct

const FilterManagementPage = () => {
  const [things, setThings] = useState([]);
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [username, setUsername] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [thingName, setThingName] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    fetchAllThings();
    fetchAllUsers();
    fetchAllPlaces();
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

  const fetchAllUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching users');
      setMessageColor('red');
    }
  };

  const fetchAllPlaces = async () => {
    try {
      const placesData = await getAllPlaces();
      setPlaces(placesData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching places');
      setMessageColor('red');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const resultsData = await searchElements(username, placeName, thingName);
      setResults(resultsData);
      setMessage('Search completed successfully');
      setMessageColor('green');
    } catch (error) {
      setMessage(error.message || 'An error occurred while searching');
      setMessageColor('red');
    }
  };

  return (
    <div>
      <h2>Filter Management</h2>
      {message && <p style={{ color: messageColor }}>{message}</p>}

      <form onSubmit={handleSearch}>
        <div>
          <label>Username:</label>
          <select value={username} onChange={(e) => setUsername(e.target.value)}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Place Name:</label>
          <select value={placeName} onChange={(e) => setPlaceName(e.target.value)}>
            <option value="">Select Place</option>
            {places.map((place) => (
              <option key={place.id} value={place.name}>
                {place.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Thing Name:</label>
          <select value={thingName} onChange={(e) => setThingName(e.target.value)}>
            <option value="">Select Thing</option>
            {things.map((thing) => (
              <option key={thing.id} value={thing.name}>
                {thing.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Search</button>
      </form>

      <h3>Search Results</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Metadata</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td>{result.id}</td>
              <td>{result.name}</td>
              <td>{result.description}</td>
              <td>{result.labels ? result.labels.join(', ') : 'N/A'}</td>
              <td>{JSON.stringify(result.metadata)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilterManagementPage;
