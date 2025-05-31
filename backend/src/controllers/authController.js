const User = require("../models/User");
const { comparePassword, hashPassword, generateToken } = require("../middlewares/authMiddleware");
const { errorResponse } = require("../helpers/responseHelper");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Usuario no registrado', 404);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Contraseña incorrecta', 401);
    }

    const token = generateToken(user);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.status(200).json({
      success: true,
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(res);
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, name, age, gender, city, department, interests, preferences, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'El correo ya está registrado', 409);
    }

    const hashedPassword = await hashPassword(password);

    const photos = req.files ? req.files.map(file => file.path) : [];

    const parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;
    const parsedPreferences = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;

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

    const token = generateToken(user);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.status(200).json({
      success: true,
      token: token,
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

const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ exists: false, message: 'Email requerido' });
    }
    const user = await User.findOne({ email });
    return res.json({ exists: !!user });
  } catch (error) {
    return res.status(500).json({ exists: false, message: 'Error al verificar email' });
  }
};

module.exports = { loginUser, registerUser, logoutUser, checkEmailExists };
