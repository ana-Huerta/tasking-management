const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commentText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

commentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.taskId = ret.taskId.toString();
    ret.userId = ret.userId.toString();
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Comment', commentSchema);