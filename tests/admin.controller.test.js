const AdminController = require('../controllers/AdminController');
const AdminRepository = require('../repositories/AdminRepository');

jest.mock('../repositories/AdminRepository');

describe('AdminController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  test('getAllAdmin berhasil mengembalikan daftar admin', async () => {
    const mockAdmins = [
      { id: 1, nama: 'Admin A', username: 'admina' },
      { id: 2, nama: 'Admin B', username: 'adminb' }
    ];
    AdminRepository.getAllAdmin.mockResolvedValue(mockAdmins);

    await AdminController.getAllAdmin(req, res);

    expect(res.json).toHaveBeenCalledWith(mockAdmins);
  });

  test('getAllAdmin gagal mengembalikan daftar admin karena kesalahan server', async () => {
    const error = new Error('Something went wrong');
    AdminRepository.getAllAdmin.mockRejectedValue(error);

    await AdminController.getAllAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Something went wrong');
  });

  test('getAdminById berhasil mengembalikan admin berdasarkan ID', async () => {
    const mockAdmin = { id: 1, nama: 'Admin A', username: 'admina' };
    req.params.id = 1;
    AdminRepository.getAdminById.mockResolvedValue(mockAdmin);

    await AdminController.getAdminById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockAdmin);
  });

  test('getAdminById gagal mengembalikan admin karena ID tidak ditemukan', async () => {
    const error = new Error('Admin tidak ditemukan');
    req.params.id = 999;  // ID yang tidak ada
    AdminRepository.getAdminById.mockRejectedValue(error);

    await AdminController.getAdminById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Admin tidak ditemukan');
  });

  test('createAdmin berhasil mengembalikan data admin yang dibuat', async () => {
    const newAdmin = {
      nama: 'Admin Baru',
      username: 'adminbaru',
      password: 'rahasia123',
      foto: 'admin.jpg',
      aktif: true
    };
    req.body = newAdmin;

    const createdAdmin = { id: 3, ...newAdmin };
    AdminRepository.createAdmin.mockResolvedValue(createdAdmin);

    await AdminController.createAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdAdmin);
  });

  test('createAdmin gagal karena data tidak valid', async () => {
    const invalidAdmin = { nama: 'Admin Invalid' };  // Data tidak lengkap
    req.body = invalidAdmin;

    const error = new Error('Data tidak valid');
    AdminRepository.createAdmin.mockRejectedValue(error);

    await AdminController.createAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Data tidak valid');
  });
});
