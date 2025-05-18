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

MatchSchema.index({ user1: 1, user2: 1 });
MatchSchema.index({ user2: 1, user1: 1 });

MatchSchema.statics.findMatch = async function(user1Id, user2Id) {
  return this.findOne({
    $or: [
      { user1: user1Id, user2: user2Id },
      { user1: user2Id, user2: user1Id }
    ],
    isActive: true
  });
};

module.exports = model('Match', MatchSchema); 