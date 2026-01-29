const mongoose = require('mongoose');

const historyEntrySchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  oldValue: { type: String, default: '' },
  newValue: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { versionKey: false });

historyEntrySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.taskId = ret.taskId.toString();
    ret.userId = ret.userId.toString();
    ret.timestamp = ret.timestamp?.toISOString?.() || ret.timestamp;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('HistoryEntry', historyEntrySchema);