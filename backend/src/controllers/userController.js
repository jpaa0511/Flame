const User = require("../models/User");
const { hashPassword } = require("../middlewares/authMiddleware");

// Register User
const registerUser = async (req, res) => {
  const {
    name,
    age,
    email,
    gender,
    department,
    city,
    interests,
    photos,
    bio,
    preferences,
    password
  } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      age,
      email,
      gender,
      department,
      city,
      interests: interests || [],
      photos: photos || [],
      bio,
      password: hashedPassword,
      preferences: preferences || {
        gender: "any",
        ageRange: {
          min: 18,
          max: 99
        },
        location: {
          department: "",
          city: ""
        }
      }
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser };
