import React from 'react';
import './ProjectList.css';

const ProjectList = ({ projects, onSelect, selectedProjectId }) => {
  if (projects.length === 0) {
    return (
      <div className="project-list-card">
        <h3>Lista de Proyectos</h3>
        <div className="empty-state">
          <p>No hay proyectos disponibles</p>
          <p className="empty-hint">Crea un nuevo proyecto usando el formulario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-list-card">
      <h3>Lista de Proyectos ({projects.length})</h3>
      <div className="project-list-container">
        <table className="project-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => {
              const isSelected = selectedProjectId === project.id;

              return (
                <tr
                  key={project.id}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => onSelect(project)}
                >
                  <td>{project.id}</td>
                  <td className="project-name">{project.name}</td>
                  <td>{project.description || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
