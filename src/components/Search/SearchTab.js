import React, { useState, useEffect } from 'react';
import { Storage } from '../../services/storage';
import './SearchTab.css';

const SearchTab = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState(0);
  const [results, setResults] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(Storage.getProjects());
  }, []);

  const handleSearch = () => {
    const tasks = Storage.getTasks();
    const filtered = tasks.filter(task => {
      if (searchText && 
          !task.title.toLowerCase().includes(searchText.toLowerCase()) && 
          !task.description.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      if (statusFilter && task.status !== statusFilter) {
        return false;
      }
      if (priorityFilter && task.priority !== priorityFilter) {
        return false;
      }
      if (projectFilter > 0 && task.projectId !== projectFilter) {
        return false;
      }
      return true;
    });

    setResults(filtered);
  };

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

  return (
    <div className="search-tab">
      <div className="search-header">
        <h2>Búsqueda Avanzada</h2>
      </div>

      <div className="search-content">
        <div className="search-form-card">
          <h3>Filtros de Búsqueda</h3>
          <div className="form-group">
            <label htmlFor="searchText">Texto</label>
            <input
              type="text"
              id="searchText"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar en título o descripción..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="statusFilter">Estado</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="priorityFilter">Prioridad</label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="projectFilter">Proyecto</label>
            <select
              id="projectFilter"
              value={projectFilter}
              onChange={(e) => setProjectFilter(parseInt(e.target.value) || 0)}
            >
              <option value="0">Todos</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleSearch} className="btn-primary">
            Buscar
          </button>
        </div>

        <div className="search-results-card">
          <h3>
            Resultados
            {results.length > 0 && ` (${results.length})`}
          </h3>
          {results.length > 0 ? (
            <div className="search-results-container">
              <table className="search-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Proyecto</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <tr key={task.id}>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay resultados</p>
              <p className="empty-hint">Usa los filtros para buscar tareas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTab;
