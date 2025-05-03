const { Schema, model } = require('mongoose');

const MatchSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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

// Compound index to ensure unique matches between two users
// The order of users doesn't matter (user1-user2 is the same as user2-user1)
MatchSchema.index({ user1: 1, user2: 1 }, { unique: true });
MatchSchema.index({ user2: 1, user1: 1 }, { unique: true });

module.exports = model('Match', MatchSchema); 