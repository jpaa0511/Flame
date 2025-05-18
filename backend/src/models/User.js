const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  department: {
    type: String,
    required: false,
    default: '',
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  interests: {
    type: [String],
    default: [],
  },
  photos: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  preferences: {
    gender: {
      type: String,
      enum: ["male", "female", "other", "any"],
      default: "any",
    },
    ageRange: {
      min: {
        type: Number,
        default: 18,
      },
      max: {
        type: Number,
        default: 99,
      },
    },
    location: {
      department: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
    },
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRegistrationComplete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", UserSchema);
