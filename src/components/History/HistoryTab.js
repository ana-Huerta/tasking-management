import React, { useState } from 'react';
import { api } from '../../services/index';
import './HistoryTab.css';

const HistoryTab = () => {
  const [taskId, setTaskId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    const tid = taskId.trim();
    if (!tid) {
      setHistory([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getHistory(tid);
      const usersRes = await api.getUsers();
      const users = Array.isArray(usersRes) ? usersRes : [];
      const list = Array.isArray(data) ? data : [];
      const formatted = list.map(entry => {
        const u = users.find(x => x.id === entry.userId);
        return {
          ...entry,
          username: u ? u.username : 'Desconocido',
          date: new Date(entry.timestamp).toLocaleString('es-ES')
        };
      });
      setHistory(formatted);
    } catch (err) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      const usersRes = await api.getUsers();
      const users = Array.isArray(usersRes) ? usersRes : [];
      const list = Array.isArray(data) ? data : [];
      const formatted = list.map(entry => {
        const u = users.find(x => x.id === entry.userId);
        return {
          ...entry,
          username: u ? u.username : 'Desconocido',
          date: new Date(entry.timestamp).toLocaleString('es-ES')
        };
      });
      setHistory(formatted);
    } catch (err) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
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
              type="text"
              id="taskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="ID de la tarea (opcional)"
            />
          </div>
          <div className="form-actions">
            <button onClick={loadHistory} className="btn-primary" disabled={loading}>
              Cargar Historial
            </button>
            <button onClick={loadAllHistory} className="btn-secondary" disabled={loading}>
              Cargar Todo el Historial
            </button>
          </div>
        </div>

        <div className="history-list-card">
          <h3>
            Historial {taskId && `- Tarea #${taskId}`}
            {history.length > 0 && ` (${history.length})`}
          </h3>
          {loading ? (
            <div className="empty-state"><p>Cargando…</p></div>
          ) : history.length > 0 ? (
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
