const mongoose = require('mongoose');

const adminTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h', // Token expires after 1 hour
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});
// Export the model
module.exports = mongoose.model('AdminToken', adminTokenSchema);