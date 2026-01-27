import React, { useState, useEffect } from 'react';
import { Storage } from './services/storage';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Storage.init();
    // Verificar si hay un usuario guardado en sessionStorage
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
