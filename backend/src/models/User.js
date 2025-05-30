const { Schema, model } = require("mongoose");

// Expresión regular básica para validar emails
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede superar los 50 caracteres'],
  },
  age: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [18, 'Debes tener al menos 18 años'],
    max: [100, 'La edad máxima permitida es 100 años'],
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [emailRegex, 'El correo electrónico no es válido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false, // ⚠️ Buena práctica: evita que se devuelva por defecto
  },
  gender: {
    type: String,
    required: [true, 'El género es obligatorio'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'El género debe ser male, female u other',
    },
  },
  department: {
    type: String,
    default: '',
    trim: true,
    maxlength: [50, 'El nombre del departamento no puede superar 50 caracteres'],
  },
  city: {
    type: String,
    required: [true, 'La ciudad es obligatoria'],
    trim: true,
    maxlength: [50, 'El nombre de la ciudad no puede superar 50 caracteres'],
  },
  interests: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => Array.isArray(arr),
      message: 'Los intereses deben ser un arreglo de strings',
    },
  },
  photos: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => Array.isArray(arr),
      message: 'Las fotos deben ser un arreglo de URLs',
    },
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [300, 'La biografía no puede superar los 300 caracteres'],
    default: "",
  },
  preferences: {
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'any'],
      default: 'any',
    },
    ageRange: {
      min: {
        type: Number,
        default: 18,
        min: [18, 'Edad mínima no puede ser menor a 18'],
        max: [99, 'Edad mínima no puede superar 99'],
      },
      max: {
        type: Number,
        default: 99,
        min: [18, 'Edad máxima no puede ser menor a 18'],
        max: [100, 'Edad máxima no puede superar 100'],
      },
    },
    location: {
      department: {
        type: String,
        default: '',
        trim: true,
      },
      city: {
        type: String,
        default: '',
        trim: true,
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
  }]
}, {
  timestamps: true, // ✅ Agrega createdAt y updatedAt automáticamente
  versionKey: false  // ❌ Oculta el campo __v
});

// Middleware para actualizar `updatedAt` manualmente si fuera necesario
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = model("User", UserSchema);

