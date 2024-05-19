import React, { useState } from 'react';
import { getUserByUsername, updateUser } from '../services/userService';

const UpdateUserPage = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const userData = await getUserByUsername(username);
      setUser(userData);
      setEmail(userData.email);
      setMessage('User found successfully');
      setMessageColor('green');
    } catch (error) {
      setMessage(error.detail || error.message || 'User not found');
      setMessageColor('red');
      setUser(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        email,
      };
      const response = await updateUser(user.user_id, updatedUserData);
      setMessage(response.message);
      setMessageColor('green');
    } catch (error) {
      setMessage(error.detail || error.message || 'An error occurred');
      setMessageColor('red');
    }
  };

  return (
    <div>
      <h2>Update User</h2>
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
        <form onSubmit={handleUpdate}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update User</button>
          <button type="button" onClick={() => setUser(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default UpdateUserPage;
