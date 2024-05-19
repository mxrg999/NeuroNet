import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserManagementPage from './pages/UserManagementPage';
import ThingManagementPage from './pages/ThingManagementPage';
import PlaceManagementPage from './pages/PlaceManagementPage';
import RelationManagementPage from './pages/RelationManagementPage';
import FilterManagementPage from './pages/FilterManagementPage';
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
              <Link to="/thing-management">Thing Management</Link>
            </li>
            <li>
              <Link to="/place-management">Place Management</Link>
            </li>
            <li>
              <Link to="/relation-management">Relation Management</Link>
            </li>
            <li>
              <Link to="/filter-management">Filter Management</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/thing-management" element={<ThingManagementPage />} />
          <Route path="/place-management" element={<PlaceManagementPage />} />
          <Route path="/relation-management" element={<RelationManagementPage />} />
          <Route path="/filter-management" element={<FilterManagementPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
