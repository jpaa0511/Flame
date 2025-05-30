const User = require("../models/User");
const { comparePassword, hashPassword, generateToken } = require("../middlewares/authMiddleware");
const { errorResponse } = require("../helpers/responseHelper");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subir fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/photos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Solo se permiten archivos .jpg y .png'));
      return;
    }
    cb(null, true);
  }
}).array('photos', 5);

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Usuario no registrado', 404);
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Contraseña incorrecta', 401);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Configurar la cookie segura
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      path: '/'
    });

    // Enviar respuesta con el token en el cuerpo
    return res.status(200).json({
      success: true,
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

    console.log(token);

  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(res);
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { email, password, name, age, gender, city, department, interests, preferences, bio } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'El correo ya está registrado', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Procesar las fotos subidas
    const photos = req.files ? req.files.map(file => file.path) : [];

    // Parsear los campos JSON
    const parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;
    const parsedPreferences = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      city,
      department,
      interests: parsedInterests || [],
      photos: photos,
      bio: bio || '',
      preferences: parsedPreferences || {
        gender: 'any',
        ageRange: {
          min: 18,
          max: 99
        },
        location: {
          department: '',
          city: ''
        }
      },
      isRegistrationComplete: true
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return errorResponse(res, 'Error al registrar usuario: ' + error.message, 500);
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
  return res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
};

module.exports = { loginUser, registerUser, logoutUser };
