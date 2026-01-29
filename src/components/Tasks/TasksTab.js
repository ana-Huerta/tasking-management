import React, { useState, useEffect } from 'react';
import { api } from '../../services/index';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import './TasksTab.css';

const TasksTab = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.getTasks(),
        api.getProjects(),
        api.getUsers()
      ]);
      setTasks(Array.isArray(tasksRes) ? tasksRes : []);
      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
      setTasks([]);
      setProjects([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await api.addTask({
        ...taskData,
        createdBy: user.id
      });
      loadData();
      setSelectedTask(null);
    } catch (err) {
      alert(err.message || 'Error al agregar tarea');
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!selectedTask) return;
    try {
      await api.updateTask(selectedTask.id, {
        ...taskData,
        userId: user.id
      });
      loadData();
      setSelectedTask(null);
    } catch (err) {
      alert(err.message || 'Error al actualizar tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    if (!window.confirm('¿Eliminar tarea: ' + task.title + '?')) return;
    try {
      await api.deleteTask(taskId, user.id);
      loadData();
      setSelectedTask(null);
    } catch (err) {
      alert(err.message || 'Error al eliminar tarea');
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  const handleClearForm = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="tasks-tab">
        <div className="tasks-header"><h2>Gestión de Tareas</h2></div>
        <div className="loading-state">Cargando…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-tab">
        <div className="tasks-header"><h2>Gestión de Tareas</h2></div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h2>Gestión de Tareas</h2>
      </div>

      <div className="tasks-content">
        <div className="tasks-form-section">
          <TaskForm
            task={selectedTask}
            projects={projects}
            users={users}
            onAdd={handleAddTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onClear={handleClearForm}
          />
        </div>

        <div className="tasks-list-section">
          <TaskList
            tasks={tasks}
            projects={projects}
            users={users}
            onSelect={handleSelectTask}
            selectedTaskId={selectedTask?.id}
          />
        </div>
      </div>

      <TaskStats tasks={tasks} />
    </div>
  );
};

export default TasksTab;
