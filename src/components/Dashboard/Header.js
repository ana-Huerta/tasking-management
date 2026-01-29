import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Task Manager</h1>
        </div>
        <div className="header-right">
          <span className="user-info">
            <span className="user-label">Usuario:</span>
            <span className="user-name">{user.username}</span>
          </span>
          <button onClick={onLogout} className="btn-logout">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
