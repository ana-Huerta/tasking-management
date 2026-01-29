import React, { useState, useEffect } from 'react';
import { api } from '../../services/index';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import './ProjectsTab.css';

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar proyectos');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      await api.addProject(projectData);
      loadProjects();
      setSelectedProject(null);
    } catch (err) {
      alert(err.message || 'Error al agregar proyecto');
    }
  };

  const handleUpdateProject = async (projectData) => {
    if (!selectedProject) return;
    try {
      await api.updateProject(selectedProject.id, projectData);
      loadProjects();
      setSelectedProject(null);
    } catch (err) {
      alert(err.message || 'Error al actualizar proyecto');
    }
  };

  const handleDeleteProject = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    if (!window.confirm('¿Eliminar proyecto: ' + project.name + '?')) return;
    try {
      await api.deleteProject(projectId);
      loadProjects();
      setSelectedProject(null);
    } catch (err) {
      alert(err.message || 'Error al eliminar proyecto');
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleClearForm = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="projects-tab">
        <div className="projects-header"><h2>Gestión de Proyectos</h2></div>
        <div className="loading-state">Cargando…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-tab">
        <div className="projects-header"><h2>Gestión de Proyectos</h2></div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="projects-tab">
      <div className="projects-header">
        <h2>Gestión de Proyectos</h2>
      </div>

      <div className="projects-content">
        <div className="projects-form-section">
          <ProjectForm
            project={selectedProject}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            onClear={handleClearForm}
          />
        </div>

        <div className="projects-list-section">
          <ProjectList
            projects={projects}
            onSelect={handleSelectProject}
            selectedProjectId={selectedProject?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsTab;
