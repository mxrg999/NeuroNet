import React from 'react';
import CreateUserForm from './components/CreateUserForm';
import SearchUserForm from './components/SearchUserForm';
import './styles.css';

const App = () => {
  return (
    <div className="App">
      <h1>User Management</h1>
      <CreateUserForm />
      <SearchUserForm />
    </div>
  );
};

export default App;
