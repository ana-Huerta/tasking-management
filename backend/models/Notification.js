const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.userId = ret.userId.toString();
    ret.createdAt = ret.createdAt?.toISOString?.() || ret.createdAt;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
