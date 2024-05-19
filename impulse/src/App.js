import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserManagementPage from './pages/UserManagementPage';
import ThingManagementPage from './pages/ThingManagementPage'; // Import the ThingManagementPage
import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/user-management">User Management</Link>
            </li>
            <li>
              <Link to="/thing-management">Thing Management</Link> {/* Add link to Thing Management */}
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/thing-management" element={<ThingManagementPage />} /> {/* Add route for Thing Management */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
