import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, projects, users, onSelect, selectedTaskId }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': '#64748b',
      'En Progreso': '#3b82f6',
      'Completada': '#10b981',
      'Bloqueada': '#f59e0b',
      'Cancelada': '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Baja': '#64748b',
      'Media': '#3b82f6',
      'Alta': '#f59e0b',
      'Crítica': '#ef4444'
    };
    return colors[priority] || '#64748b';
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list-card">
        <h3>Lista de Tareas</h3>
        <div className="empty-state">
          <p>No hay tareas disponibles</p>
          <p className="empty-hint">Crea una nueva tarea usando el formulario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-card">
      <h3>Lista de Tareas ({tasks.length})</h3>
      <div className="task-list-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Proyecto</th>
              <th>Asignado</th>
              <th>Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              const user = users.find(u => u.id === task.assignedTo);
              const isSelected = selectedTaskId === task.id;

              return (
                <tr
                  key={task.id}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => onSelect(task)}
                >
                  <td>{task.id}</td>
                  <td className="task-title">{task.title}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.status || 'Pendiente') }}
                    >
                      {task.status || 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    <span
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priority || 'Media') }}
                    >
                      {task.priority || 'Media'}
                    </span>
                  </td>
                  <td>{project ? project.name : 'Sin proyecto'}</td>
                  <td>{user ? user.username : 'Sin asignar'}</td>
                  <td>{task.dueDate || 'Sin fecha'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
