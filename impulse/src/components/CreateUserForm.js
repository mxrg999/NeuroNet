import React, { useState } from 'react';
import { createUser } from '../services/userService';

const CreateUserForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState(''); // New state to manage message color

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      email,
    };
    try {
      const response = await createUser(userData);
      setMessage(response.message);
      setMessageColor('green'); // Set message color to green on success
    } catch (error) {
      const errorMessage = error.detail || error.message || 'An error occurred';
      setMessage(errorMessage);
      setMessageColor('red'); // Set message color to red on error
    }
  };

  return (
    <div className="create-user-form">
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>
      {message && <p style={{ color: messageColor }}>{message}</p>} {/* Display message with color */}
    </div>
  );
};

export default CreateUserForm;
