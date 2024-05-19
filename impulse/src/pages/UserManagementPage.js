import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, getUserByUsername } from '../services/userService';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      setMessage(error.message || 'An error occurred while fetching users');
      setMessageColor('red');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const userData = await getUserByUsername(searchUsername);
      setUsers([userData]);
      setMessage('User found successfully');
      setMessageColor('green');
    } catch (error) {
      setMessage(error.detail || error.message || 'User not found');
      setMessageColor('red');
      setUsers([]);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(newUser);
      setMessage(response.message);
      setMessageColor('green');
      setNewUser({ username: '', email: '' });
      fetchAllUsers();
    } catch (error) {
      setMessage(error.message || 'An error occurred while creating user');
      setMessageColor('red');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await updateUser(editingUser.user_id, { username: editUsername, email: editEmail });
      setMessage(response.message);
      setMessageColor('green');
      setEditingUser(null);
      setEditUsername('');
      setEditEmail('');
      fetchAllUsers();
    } catch (error) {
      setMessage(error.message || 'An error occurred while updating user');
      setMessageColor('red');
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      {message && <p style={{ color: messageColor }}>{message}</p>}

      <form onSubmit={handleSearch}>
        <div>
          <label>Search by Username:</label>
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
        <button type="button" onClick={fetchAllUsers}>Show All Users</button>
      </form>

      <h3>Create New User</h3>
      <form onSubmit={handleCreateUser}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>

      <h3>All Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={() => {
              setEditingUser(user);
              setEditUsername(user.username);
              setEditEmail(user.email);
            }}>
              Edit
            </button>
          </li>
        ))}
      </ul>

      {editingUser && (
        <div>
          <h3>Edit User</h3>
          <form onSubmit={handleEditUser}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Update User</button>
            <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
