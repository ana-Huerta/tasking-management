import React, { useState, useEffect } from 'react';
import { Storage } from '../../services/storage';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import './TasksTab.css';

const TasksTab = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(Storage.getTasks());
    setProjects(Storage.getProjects());
    setUsers(Storage.getUsers());
  };

  const handleAddTask = (taskData) => {
    const task = {
      ...taskData,
      createdBy: user.id
    };

    const taskId = Storage.addTask(task);

    Storage.addHistory({
      taskId: taskId,
      userId: user.id,
      action: 'CREATED',
      oldValue: '',
      newValue: task.title
    });

    if (task.assignedTo > 0) {
      Storage.addNotification({
        userId: task.assignedTo,
        message: 'Nueva tarea asignada: ' + task.title,
        type: 'task_assigned'
      });
    }

    loadData();
    setSelectedTask(null);
  };

  const handleUpdateTask = (taskData) => {
    if (!selectedTask) return;

    const oldTask = Storage.getTasks().find(t => t.id === selectedTask.id);
    if (!oldTask) return;

    const task = {
      ...taskData,
      id: selectedTask.id,
      createdBy: oldTask.createdBy,
      createdAt: oldTask.createdAt,
      actualHours: oldTask.actualHours || 0
    };

    if (oldTask.status !== task.status) {
      Storage.addHistory({
        taskId: selectedTask.id,
        userId: user.id,
        action: 'STATUS_CHANGED',
        oldValue: oldTask.status,
        newValue: task.status
      });
    }

    if (oldTask.title !== task.title) {
      Storage.addHistory({
        taskId: selectedTask.id,
        userId: user.id,
        action: 'TITLE_CHANGED',
        oldValue: oldTask.title,
        newValue: task.title
      });
    }

    Storage.updateTask(selectedTask.id, task);

    if (task.assignedTo > 0) {
      Storage.addNotification({
        userId: task.assignedTo,
        message: 'Tarea actualizada: ' + task.title,
        type: 'task_updated'
      });
    }

    loadData();
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId) => {
    const task = Storage.getTasks().find(t => t.id === taskId);
    if (!task) return;

    if (window.confirm('¿Eliminar tarea: ' + task.title + '?')) {
      Storage.addHistory({
        taskId: taskId,
        userId: user.id,
        action: 'DELETED',
        oldValue: task.title,
        newValue: ''
      });

      Storage.deleteTask(taskId);
      loadData();
      setSelectedTask(null);
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  const handleClearForm = () => {
    setSelectedTask(null);
  };

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
