import React, { useState } from 'react';
import { api } from '../../services/index';
import './CommentsTab.css';

const CommentsTab = ({ user }) => {
  const [taskId, setTaskId] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    const tid = taskId.trim();
    if (!tid) {
      alert('ID de tarea requerido');
      return;
    }
    if (!commentText.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }
    setLoading(true);
    try {
      await api.addComment({
        taskId: tid,
        userId: user.id,
        commentText: commentText.trim()
      });
      setCommentText('');
      await loadComments();
    } catch (err) {
      alert(err.message || 'Error al agregar comentario');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    const tid = taskId.trim();
    if (!tid) {
      setComments([]);
      return;
    }
    setLoading(true);
    try {
      const [commentsRes, usersRes] = await Promise.all([
        api.getComments(tid),
        api.getUsers()
      ]);
      const users = Array.isArray(usersRes) ? usersRes : [];
      const list = Array.isArray(commentsRes) ? commentsRes : [];
      const formatted = list.map(c => {
        const u = users.find(x => x.id === c.userId);
        return {
          ...c,
          username: u ? u.username : 'Usuario',
          date: new Date(c.createdAt).toLocaleString('es-ES')
        };
      });
      setComments(formatted);
    } catch (err) {
      setComments([]);
    } finally {
      setLoading(false);
    }
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
              type="text"
              id="taskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="ID de la tarea (MongoDB)"
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
            <button onClick={handleAddComment} className="btn-primary" disabled={loading}>
              {loading ? 'Enviando…' : 'Agregar Comentario'}
            </button>
            <button onClick={loadComments} className="btn-secondary" disabled={loading}>
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
            loading ? (
              <div className="empty-state"><p>Cargando…</p></div>
            ) : comments.length > 0 ? (
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
