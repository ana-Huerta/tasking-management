import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './HistoryTab.css';

const HistoryTab = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingTasks(true);
      try {
        const data = await api.getTasks();
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    load();
  }, []);

  const taskById = Object.fromEntries(tasks.map(t => [t.id, t]));

  const loadHistory = async () => {
    const tid = selectedTaskId.trim();
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
        const task = taskById[entry.taskId];
        return {
          ...entry,
          username: u ? u.username : 'Desconocido',
          taskTitle: task ? task.title : null,
          date: new Date(entry.timestamp).toLocaleString('es-ES')
        };
      });
      setHistory(formatted);
    } catch {
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
        const task = taskById[entry.taskId];
        return {
          ...entry,
          username: u ? u.username : 'Desconocido',
          taskTitle: task ? task.title : null,
          date: new Date(entry.timestamp).toLocaleString('es-ES')
        };
      });
      setHistory(formatted);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="history-tab">
      <div className="history-header">
        <h2>Historial de Cambios</h2>
      </div>

      <div className="history-content">
        <div className="history-form-card">
          <h3>Filtros</h3>
          <div className="form-group">
            <label htmlFor="taskSelect">Tarea</label>
            <select
              id="taskSelect"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={loadingTasks}
            >
              <option value="">Seleccionar tarea (opcional)</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title || '(sin título)'}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button onClick={loadHistory} className="btn-primary" disabled={loading || !selectedTaskId}>
              Cargar Historial de la Tarea
            </button>
            <button onClick={loadAllHistory} className="btn-secondary" disabled={loading}>
              Cargar Todo el Historial
            </button>
          </div>
        </div>

        <div className="history-list-card">
          <h3>
            Historial
            {selectedTask && ` - ${selectedTask.title}`}
            {!selectedTaskId && history.length > 0 && ' (todo)'}
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
                      <span className="detail-value">{entry.taskTitle || entry.taskId}</span>
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
              <p className="empty-hint">Selecciona una tarea y carga su historial, o carga todo el historial</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
