const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, default: 'Pendiente' },
  priority: { type: String, default: 'Media' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dueDate: { type: String, default: '' },
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

taskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.projectId = ret.projectId ? ret.projectId.toString() : null;
    ret.assignedTo = ret.assignedTo ? ret.assignedTo.toString() : null;
    ret.createdBy = ret.createdBy ? ret.createdBy.toString() : null;
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    ret.updatedAt = ret.updatedAt?.toISOString?.() || ret.updatedAt;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Task', taskSchema);