const User = require("../models/User");
const { comparePassword } = require("../middlewares/authMiddleware");

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Email o contraseña incorrectos' 
      });
    }

    // Verificar contraseña
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Email o contraseña incorrectos' 
      });
    }

    // Si todo es correcto, devolver datos básicos del usuario
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      message: 'Error en el servidor' 
    });
  }
};

module.exports = { loginUser };
