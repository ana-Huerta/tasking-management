import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './UsersTab.css';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const u = username.trim();
    const p = password.trim();
    if (!u) {
      alert('El nombre de usuario es requerido');
      return;
    }
    if (!p) {
      alert('La contraseña es requerida');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.addUser(u, p);
      setUsername('');
      setPassword('');
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error al agregar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="users-tab">
        <div className="users-header"><h2>Agregar Usuarios</h2></div>
        <div className="loading-state">Cargando…</div>
      </div>
    );
  }

  return (
    <div className="users-tab">
      <div className="users-header">
        <h2>Agregar Usuarios</h2>
      </div>

      <div className="users-content">
        <div className="users-form-card">
          <h3>Nuevo Usuario</h3>
          <form onSubmit={handleSubmit} className="user-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">Usuario *</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Agregando…' : 'Agregar Usuario'}
            </button>
          </form>
        </div>

        <div className="users-list-card">
          <h3>Usuarios ({users.length})</h3>
          {users.length > 0 ? (
            <ul className="users-list">
              {users.map(u => (
                <li key={u.id} className="user-item">
                  <span className="user-username">{u.username}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No hay usuarios registrados</p>
              <p className="empty-hint">Agrega usuarios con el formulario</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
