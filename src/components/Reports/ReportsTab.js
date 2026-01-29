import React, { useState } from 'react';
import { api } from '../../services/api';
import './ReportsTab.css';

const ReportsTab = () => {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const generateReport = async (type) => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.getTasks(),
        api.getProjects(),
        api.getUsers()
      ]);
      const tasks = Array.isArray(tasksRes) ? tasksRes : [];
      const projects = Array.isArray(projectsRes) ? projectsRes : [];
      const users = Array.isArray(usersRes) ? usersRes : [];

      let text = `=== REPORTE: ${type.toUpperCase()} ===\n\n`;

      if (type === 'tasks') {
        const statusCount = {};
        tasks.forEach(task => {
          const status = task.status || 'Pendiente';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        Object.keys(statusCount).forEach(status => {
          text += `${status}: ${statusCount[status]} tareas\n`;
        });
      } else if (type === 'projects') {
        projects.forEach(project => {
          const count = tasks.filter(t => t.projectId === project.id).length;
          text += `${project.name}: ${count} tareas\n`;
        });
      } else if (type === 'users') {
        users.forEach(user => {
          const count = tasks.filter(t => t.assignedTo === user.id).length;
          text += `${user.username}: ${count} tareas asignadas\n`;
        });
      }

      setReport(text);
    } catch (err) {
      setReport('Error al generar reporte: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.getTasks(),
        api.getProjects()
      ]);
      const tasks = Array.isArray(tasksRes) ? tasksRes : [];
      const projects = Array.isArray(projectsRes) ? projectsRes : [];

      let csv = 'ID,Título,Estado,Prioridad,Proyecto\n';
      tasks.forEach(task => {
        const project = projects.find(p => p.id === task.projectId);
        csv += `${task.id},"${(task.title || '').replace(/"/g, '""')}","${task.status || 'Pendiente'}","${task.priority || 'Media'}","${project ? project.name : 'Sin proyecto'}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export_tasks.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      alert('Exportado a export_tasks.csv');
    } catch (err) {
      alert(err.message || 'Error al exportar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-tab">
      <div className="reports-header">
        <h2>Generación de Reportes</h2>
      </div>

      <div className="reports-content">
        <div className="reports-actions-card">
          <h3>Generar Reporte</h3>
          <div className="form-actions">
            <button onClick={() => generateReport('tasks')} className="btn-primary" disabled={loading}>
              Reporte de Tareas
            </button>
            <button onClick={() => generateReport('projects')} className="btn-primary" disabled={loading}>
              Reporte de Proyectos
            </button>
            <button onClick={() => generateReport('users')} className="btn-primary" disabled={loading}>
              Reporte de Usuarios
            </button>
            <button onClick={exportCSV} className="btn-secondary" disabled={loading}>
              Exportar a CSV
            </button>
          </div>
        </div>

        <div className="reports-display-card">
          <h3>Reporte</h3>
          <div className="report-display">
            {loading ? (
              <div className="empty-state"><p>Generando…</p></div>
            ) : report ? (
              <pre className="report-content">{report}</pre>
            ) : (
              <div className="empty-state">
                <p>Genera un reporte para ver los resultados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
