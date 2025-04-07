// const {Schema, model} = require("mongoose");

// const userSchema = Schema({
//   name: {type: String, required: true},
//   //email: {type: String, required: true},
//   createAt: {type: Date, default: Date.now}
// //   passwordHash: String,
// //   gender: String, // "male", "female", "non-binary", etc.
// //   birthday: Date,
// //   bio: String,
// //   departamento: String, // Ej: "Antioquia"
// //   ciudad: String, // Ej: "Medellín"
// //   photos: [String], // URLs
// //   interests: [String], // ["cine", "viajar", "cocinar"]
// //   preferences: {
// //     gender: [String], // ["female", "non-binary"]
// //     ageRange: { min: Number, max: Number },
// //     location: {
// //       departamento: [String], // ["Antioquia", "Cundinamarca"]
// //       ciudad: [String], // ["Medellín", "Bogotá"]
// //     },
// //   },
// //   swipes: {
// //     liked: [ObjectId], // IDs de usuarios que este usuario ha dado like
// //     disliked: [ObjectId], // IDs que ha rechazado
// //   },
// //   matches: [ObjectId], // IDs de los usuarios con los que hizo match
// //   createdAt: Date,
// //   updatedAt: Date,
// });

// module.exports = model('User', userSchema)

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
    trim: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar updatedAt automáticamente
// UserSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

module.exports = mongoose.model("User", UserSchema);
