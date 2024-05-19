import React, { useState } from 'react';
import { getUserByUsername } from '../services/userService';

const SearchUserForm = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await getUserByUsername(username);
      setUser(response);
      setMessage('User found successfully');
      setMessageColor('green');
    } catch (error) {
      setMessage(error.detail || error.message || 'An error occurred');
      setMessageColor('red');
      setUser(null);
    }
  };

  return (
    <div className="search-user-form">
      <h2>Search User</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {message && <p style={{ color: messageColor }}>{message}</p>}
      {user && (
        <div>
          <h3>User Details</h3>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default SearchUserForm;
