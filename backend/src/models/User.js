const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
    required: true,
    trim: true,
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

module.exports = mongoose.model("User", UserSchema);
