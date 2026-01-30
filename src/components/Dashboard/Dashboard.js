import React, { useState } from 'react';
import Header from './Header';
import Tabs from './Tabs';
import TasksTab from '../Tasks/TasksTab';
import ProjectsTab from '../Projects/ProjectsTab';
import CommentsTab from '../Comments/CommentsTab';
import HistoryTab from '../History/HistoryTab';
import NotificationsTab from '../Notifications/NotificationsTab';
import UsersTab from '../Users/UsersTab';
import ReportsTab from '../Reports/ReportsTab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faClockRotateLeft, faUserPlus, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faFolderOpen, faComment, faBell } from '@fortawesome/free-regular-svg-icons';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const tabs = [
    { id: 'tasks', label: 'Tareas', icon: <FontAwesomeIcon icon={faListCheck} size="lg" /> },
    { id: 'projects', label: 'Proyectos', icon: <FontAwesomeIcon icon={faFolderOpen} size="lg" /> },
    { id: 'comments', label: 'Comentarios', icon: <FontAwesomeIcon icon={faComment} size="lg" /> },
    { id: 'history', label: 'Historial', icon: <FontAwesomeIcon icon={faClockRotateLeft} size="lg" /> },
    { id: 'notifications', label: 'Notificaciones', icon: <FontAwesomeIcon icon={faBell} size="lg" /> },
    { id: 'users', label: 'Usuarios', icon: <FontAwesomeIcon icon={faUserPlus} size="lg" /> },
    { id: 'reports', label: 'Reportes', icon: <FontAwesomeIcon icon={faBookOpen} size="lg" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksTab user={user} />;
      case 'projects':
        return <ProjectsTab />;
      case 'comments':
        return <CommentsTab user={user} />;
      case 'history':
        return <HistoryTab />;
      case 'notifications':
        return <NotificationsTab user={user} />;
      case 'users':
        return <UsersTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <TasksTab user={user} />;
    }
  };

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />
      <div className="dashboard-content">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="tab-content-wrapper">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
