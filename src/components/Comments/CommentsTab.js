import React, { useState } from 'react';
import { Storage } from '../../services/storage';
import './CommentsTab.css';

const CommentsTab = ({ user }) => {
  const [taskId, setTaskId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const handleAddComment = () => {
    const taskIdNum = parseInt(taskId);
    if (!taskIdNum) {
      alert('ID de tarea requerido');
      return;
    }

    if (!commentText.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    Storage.addComment({
      taskId: taskIdNum,
      userId: user.id,
      commentText: commentText.trim()
    });

    setCommentText('');
    loadComments();
    alert('Comentario agregado');
  };

  const loadComments = () => {
    const taskIdNum = parseInt(taskId);
    if (!taskIdNum) {
      setComments([]);
      return;
    }

    const allComments = Storage.getComments().filter(c => c.taskId === taskIdNum);
    const users = Storage.getUsers();
    
    const formattedComments = allComments.map(comment => {
      const commentUser = users.find(u => u.id === comment.userId);
      return {
        ...comment,
        username: commentUser ? commentUser.username : 'Usuario',
        date: new Date(comment.createdAt).toLocaleString('es-ES')
      };
    });

    setComments(formattedComments);
  };

  return (
    <div className="comments-tab">
      <div className="comments-header">
        <h2>Comentarios de Tareas</h2>
      </div>

      <div className="comments-content">
        <div className="comments-form-card">
          <h3>Agregar Comentario</h3>
          <div className="form-group">
            <label htmlFor="taskId">ID Tarea</label>
            <input
              type="number"
              id="taskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="ID de la tarea"
            />
          </div>
          <div className="form-group">
            <label htmlFor="commentText">Comentario</label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="4"
              placeholder="Escribe tu comentario aquí..."
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAddComment} className="btn-primary">
              Agregar Comentario
            </button>
            <button onClick={loadComments} className="btn-secondary">
              Cargar Comentarios
            </button>
          </div>
        </div>

        <div className="comments-list-card">
          <h3>
            Comentarios {taskId && `- Tarea #${taskId}`}
            {comments.length > 0 && ` (${comments.length})`}
          </h3>
          {taskId ? (
            comments.length > 0 ? (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.username}</span>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                    <div className="comment-text">{comment.commentText}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay comentarios para esta tarea</p>
              </div>
            )
          ) : (
            <div className="empty-state">
              <p>Ingresa un ID de tarea para ver los comentarios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsTab;
