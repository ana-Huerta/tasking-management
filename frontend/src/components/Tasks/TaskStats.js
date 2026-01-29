import React from 'react';
import './TaskStats.css';

const TaskStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completada').length,
    pending: tasks.filter(t => t.status !== 'Completada').length,
    highPriority: tasks.filter(t => t.priority === 'Alta' || t.priority === 'Crítica').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.status === 'Completada') return false;
      const due = new Date(t.dueDate);
      const now = new Date();
      return due < now;
    }).length
  };

  return (
    <div className="task-stats">
      <div className="stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Completadas</span>
        <span className="stat-value success">{stats.completed}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Pendientes</span>
        <span className="stat-value">{stats.pending}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Alta Prioridad</span>
        <span className="stat-value warning">{stats.highPriority}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Vencidas</span>
        <span className="stat-value error">{stats.overdue}</span>
      </div>
    </div>
  );
};

export default TaskStats;
