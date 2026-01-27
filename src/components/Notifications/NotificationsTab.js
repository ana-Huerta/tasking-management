import React, { useState, useEffect } from 'react';
import { Storage } from '../../services/storage';
import './NotificationsTab.css';

const NotificationsTab = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;

    const allNotifications = Storage.getNotifications().filter(n => 
      n.userId === user.id && !n.read
    );

    const formattedNotifications = allNotifications.map(notif => ({
      ...notif,
      date: new Date(notif.createdAt).toLocaleString('es-ES')
    }));

    setNotifications(formattedNotifications);
  };

  const markAsRead = () => {
    if (!user) return;

    Storage.markNotificationsRead(user.id);
    loadNotifications();
    alert('Notificaciones marcadas como leídas');
  };

  return (
    <div className="notifications-tab">
      <div className="notifications-header">
        <h2>Notificaciones</h2>
      </div>

      <div className="notifications-content">
        <div className="notifications-actions-card">
          <h3>Acciones</h3>
          <div className="form-actions">
            <button onClick={loadNotifications} className="btn-primary">
              Cargar Notificaciones
            </button>
            <button onClick={markAsRead} className="btn-secondary">
              Marcar como Leídas
            </button>
          </div>
        </div>

        <div className="notifications-list-card">
          <h3>
            Notificaciones
            {notifications.length > 0 && ` (${notifications.length})`}
          </h3>
          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map(notif => (
                <div key={notif.id} className="notification-item">
                  <div className="notification-header">
                    <span className="notification-type">{notif.type}</span>
                    <span className="notification-date">{notif.date}</span>
                  </div>
                  <div className="notification-message">{notif.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay notificaciones nuevas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
