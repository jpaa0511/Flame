const { loginUser } = require('../../controllers/authController');
const User = require('../../models/User');
const httpMock = require('node-mocks-http');
const { comparePassword } = require('../../middlewares/authMiddleware');
const { generateToken, errorResponse, authResponse  } = require('../../helpers/responseHelper');

jest.mock("../../models/User");
jest.mock("../../middlewares/authMiddleware");
jest.mock("../../helpers/responseHelper");

describe("loginUser", () => {
  const req = {
    body: {
      email: "usertest@dominiotest.com",
      password: "123456"
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe responder con error si el usuario no existe", async () => {
    User.findOne.mockResolvedValue(null);

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(errorResponse).toHaveBeenCalledWith(res, 'Incorrect email or password', 401);
  });

  it("debe responder con error si la contraseña es incorrecta", async () => {
    const fakeUser = { email: "usertest@dominiotest.com", password: "hashedpass" };
    User.findOne.mockResolvedValue(fakeUser);
    comparePassword.mockResolvedValue(false);

    await loginUser(req, res);

    expect(comparePassword).toHaveBeenCalledWith(req.body.password, fakeUser.password);
    expect(errorResponse).toHaveBeenCalledWith(res, 'Incorrect email or password', 401);
  });

  it("debe responder con token si las credenciales son correctas", async () => {
    const fakeUser = { id: 1, email: "usertest@dominiotest.com", password: "hashedpass" };
    const token = "fake.jwt.token";
    User.findOne.mockResolvedValue(fakeUser);
    comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue(token);

    await loginUser(req, res);

    expect(authResponse).toHaveBeenCalledWith(res, fakeUser, token);
  });

  it("debe manejar errores inesperados", async () => {
    const error = new Error("DB error");
    User.findOne.mockRejectedValue(error);

    console.error = jest.fn(); // Evita que el error se imprima en consola

    await loginUser(req, res);

    expect(console.error).toHaveBeenCalledWith('Error in login:', error);
    expect(errorResponse).toHaveBeenCalledWith(res);
  });
});