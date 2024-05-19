import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateUserPage from './pages/CreateUserPage';
import SearchUserPage from './pages/SearchUserPage';
import ListUsersPage from './pages/ListUsersPage';
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
              <Link to="/create-user">Create User</Link>
            </li>
            <li>
              <Link to="/search-user">Search User</Link>
            </li>
            <li>
              <Link to="/list-users">List Users</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/search-user" element={<SearchUserPage />} />
          <Route path="/list-users" element={<ListUsersPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
