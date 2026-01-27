import React, { useState, useEffect } from 'react';
import { Storage } from '../../services/storage';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import './ProjectsTab.css';

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(Storage.getProjects());
  };

  const handleAddProject = (projectData) => {
    Storage.addProject(projectData);
    loadProjects();
    setSelectedProject(null);
  };

  const handleUpdateProject = (projectData) => {
    if (!selectedProject) return;
    Storage.updateProject(selectedProject.id, projectData);
    loadProjects();
    setSelectedProject(null);
  };

  const handleDeleteProject = (projectId) => {
    const project = Storage.getProjects().find(p => p.id === projectId);
    if (!project) return;

    if (window.confirm('¿Eliminar proyecto: ' + project.name + '?')) {
      Storage.deleteProject(projectId);
      loadProjects();
      setSelectedProject(null);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleClearForm = () => {
    setSelectedProject(null);
  };

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
