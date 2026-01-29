import React, { useState, useEffect } from 'react';
import './ProjectForm.css';

const ProjectForm = ({ project, onAdd, onUpdate, onDelete, onClear }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (project) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }
  };

  return (
    <div className="project-form-card">
      <h3>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="name">Nombre *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nombre del proyecto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Descripción del proyecto"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {project ? 'Actualizar' : 'Agregar'}
          </button>
          {project && (
            <button
              type="button"
              onClick={() => onDelete(project.id)}
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

export default ProjectForm;
