import React, { useState } from 'react';
import { Storage } from '../../services/storage';
import './HistoryTab.css';

const HistoryTab = () => {
  const [taskId, setTaskId] = useState('');
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    const taskIdNum = parseInt(taskId);
    if (!taskIdNum) {
      setHistory([]);
      return;
    }

    const allHistory = Storage.getHistory().filter(h => h.taskId === taskIdNum);
    const users = Storage.getUsers();
    
    const formattedHistory = allHistory.map(entry => {
      const entryUser = users.find(u => u.id === entry.userId);
      return {
        ...entry,
        username: entryUser ? entryUser.username : 'Desconocido',
        date: new Date(entry.timestamp).toLocaleString('es-ES')
      };
    });

    setHistory(formattedHistory);
  };

  const loadAllHistory = () => {
    const allHistory = Storage.getHistory();
    const users = Storage.getUsers();
    
    const formattedHistory = allHistory
      .slice(-100)
      .reverse()
      .map(entry => {
        const entryUser = users.find(u => u.id === entry.userId);
        return {
          ...entry,
          username: entryUser ? entryUser.username : 'Desconocido',
          date: new Date(entry.timestamp).toLocaleString('es-ES')
        };
      });

    setHistory(formattedHistory);
  };

  return (
    <div className="history-tab">
      <div className="history-header">
        <h2>Historial de Cambios</h2>
      </div>

      <div className="history-content">
        <div className="history-form-card">
          <h3>Filtros</h3>
          <div className="form-group">
            <label htmlFor="taskId">ID Tarea</label>
            <input
              type="number"
              id="taskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="ID de la tarea"
            />
          </div>
          <div className="form-actions">
            <button onClick={loadHistory} className="btn-primary">
              Cargar Historial
            </button>
            <button onClick={loadAllHistory} className="btn-secondary">
              Cargar Todo el Historial
            </button>
          </div>
        </div>

        <div className="history-list-card">
          <h3>
            Historial {taskId && `- Tarea #${taskId}`}
            {history.length > 0 && ` (${history.length})`}
          </h3>
          {history.length > 0 ? (
            <div className="history-list">
              {history.map(entry => (
                <div key={entry.id} className="history-item">
                  <div className="history-header-item">
                    <span className="history-action">{entry.action}</span>
                    <span className="history-date">{entry.date}</span>
                  </div>
                  <div className="history-details">
                    <div className="history-detail">
                      <span className="detail-label">Tarea:</span>
                      <span className="detail-value">#{entry.taskId}</span>
                    </div>
                    <div className="history-detail">
                      <span className="detail-label">Usuario:</span>
                      <span className="detail-value">{entry.username}</span>
                    </div>
                    <div className="history-detail">
                      <span className="detail-label">Antes:</span>
                      <span className="detail-value">{entry.oldValue || '(vacío)'}</span>
                    </div>
                    <div className="history-detail">
                      <span className="detail-label">Después:</span>
                      <span className="detail-value">{entry.newValue || '(vacío)'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay historial disponible</p>
              <p className="empty-hint">Carga el historial de una tarea o todo el historial</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
