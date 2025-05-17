const AuthController = require('../controllers/AuthController');
const AuthService = require('../services/authService');
const jwt = require('jsonwebtoken');

jest.mock('../services/authService');
jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('login berhasil mengembalikan user, token, dan role', async () => {
    const mockUser = { id: 1, username: 'admin' };
    const mockToken = 'mockedToken123';
    req.body = { username: 'admin', password: 'password123' };

    AuthService.login.mockResolvedValue({ user: mockUser, token: mockToken });
    jwt.decode.mockReturnValue({ role: 'admin' });

    await AuthController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      user: mockUser,
      token: mockToken,
      role: 'admin'
    });
  });

  test('login gagal karena kesalahan login', async () => {
    const error = new Error('Invalid username or password');
    req.body = { username: 'admin', password: 'wrongpassword' };

    AuthService.login.mockRejectedValue(error);

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
  });

  test('register berhasil mengembalikan user yang terdaftar', async () => {
    const mockUser = { id: 1, username: 'newuser' };
    req.body = { username: 'newuser', password: 'newpassword123' };

    AuthService.register.mockResolvedValue(mockUser);

    await AuthController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('register gagal karena kesalahan pendaftaran', async () => {
    const error = new Error('Registration failed');
    req.body = { username: 'newuser' };

    AuthService.register.mockRejectedValue(error);

    await AuthController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Registration failed' });
  });

  test('adminRegister berhasil mengembalikan user yang terdaftar', async () => {
    const mockAdmin = { id: 1, username: 'admin' };
    req.body = { username: 'admin', password: 'adminpassword123' };

    AuthService.adminRegister.mockResolvedValue(mockAdmin);

    await AuthController.adminRegister(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockAdmin);
  });

  test('adminRegister gagal karena kesalahan pendaftaran admin', async () => {
    const error = new Error('Admin registration failed');
    req.body = { username: 'admin' };

    AuthService.adminRegister.mockRejectedValue(error);

    await AuthController.adminRegister(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin registration failed' });
  });

  test('adminLogin berhasil mengembalikan admin, token, dan role', async () => {
    const mockAdmin = { id: 1, username: 'admin' };
    const mockToken = 'adminMockedToken123';
    req.body = { username: 'admin', password: 'adminpassword123' };

    AuthService.adminLogin.mockResolvedValue({ admin: mockAdmin, token: mockToken });
    jwt.decode.mockReturnValue({ role: 'admin' });

    await AuthController.adminLogin(req, res);

    expect(res.json).toHaveBeenCalledWith({
      admin: mockAdmin,
      token: mockToken,
      role: 'admin'
    });
  });

  test('adminLogin gagal karena kesalahan login admin', async () => {
    const error = new Error('Invalid admin credentials');
    req.body = { username: 'admin', password: 'wrongpassword' };

    AuthService.adminLogin.mockRejectedValue(error);

    await AuthController.adminLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid admin credentials' });
  });
});
