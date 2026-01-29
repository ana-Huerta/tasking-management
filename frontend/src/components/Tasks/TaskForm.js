import React, { useState, useEffect } from 'react';
import './TaskForm.css';

const TaskForm = ({ task, projects, users, onAdd, onUpdate, onDelete, onClear }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    projectId: 0,
    assignedTo: 0,
    dueDate: '',
    estimatedHours: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pendiente',
        priority: task.priority || 'Media',
        projectId: task.projectId ?? 0,
        assignedTo: task.assignedTo ?? 0,
        dueDate: task.dueDate || '',
        estimatedHours: task.estimatedHours ?? ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pendiente',
        priority: 'Media',
        projectId: 0,
        assignedTo: 0,
        dueDate: '',
        estimatedHours: ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === 'projectId' || name === 'assignedTo') {
      next = value === '' || value === '0' ? 0 : value;
    }
    setFormData(prev => ({ ...prev, [name]: next }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      projectId: formData.projectId,
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
      estimatedHours: parseFloat(formData.estimatedHours) || 0
    };

    if (task) {
      onUpdate(taskData);
    } else {
      onAdd(taskData);
    }
  };

  return (
    <div className="task-form-card">
      <h3>{task ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Título de la tarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Descripción de la tarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
              <option value="Bloqueada">Bloqueada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="projectId">Proyecto</label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="0">Sin proyecto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Asignado a</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="0">Sin asignar</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Fecha Vencimiento</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimatedHours">Horas Estimadas</label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              step="0.5"
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {task ? 'Actualizar' : 'Agregar'}
          </button>
          {task && (
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="btn-danger"
            >
              Eliminar
            </button>
          )}
          <button
            type="button"
            onClick={onClear}
            className="btn-secondary"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
