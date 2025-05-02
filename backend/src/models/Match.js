const { Schema, model } = require('mongoose');

const MatchSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice compuesto para búsqueda eficiente de matches entre dos usuarios
MatchSchema.index({ users: 1 }, { unique: true });

module.exports = model('Match', MatchSchema); 