const AdminController = require('../controllers/AdminController');
const AdminRepository = require('../repositories/AdminRepository');
const { getFileUrl } = require('../utils/fileUtils');

jest.mock('../repositories/AdminRepository');
jest.mock('../utils/fileUtils', () => ({
  getFileUrl: jest.fn().mockReturnValue('http://localhost/admin/foto.jpg'),
}));

describe('AdminController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, file: null, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  // getAllAdmin
  test('getAllAdmin berhasil mengembalikan daftar admin', async () => {
    const mockAdmins = {
      data: [
        { id: 1, nama: 'Admin A', username: 'admina' },
        { id: 2, nama: 'Admin B', username: 'adminb' },
      ],
      total: 2,
      page: 1,
      limit: 10,
    };
    AdminRepository.getAllAdmin.mockResolvedValue(mockAdmins);

    await AdminController.getAllAdmin(req, res);

    expect(AdminRepository.getAllAdmin).toHaveBeenCalledWith(req, res);
    expect(res.json).toHaveBeenCalledWith(mockAdmins);
  });

  test('getAllAdmin gagal karena error internal', async () => {
    const error = new Error('Server error');
    AdminRepository.getAllAdmin.mockRejectedValue(error);

    await AdminController.getAllAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });

  // getAdminById
  test('getAdminById berhasil mengembalikan admin', async () => {
    const mockAdmin = { id: 1, nama: 'Admin A', username: 'admina' };
    req.params.id = 1;
    AdminRepository.getAdminById.mockResolvedValue(mockAdmin);

    await AdminController.getAdminById(req, res);

    expect(AdminRepository.getAdminById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockAdmin);
  });

  test('getAdminById gagal karena admin tidak ditemukan', async () => {
    const error = new Error('Admin tidak ditemukan');
    req.params.id = 99;
    AdminRepository.getAdminById.mockRejectedValue(error);

    await AdminController.getAdminById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Admin tidak ditemukan');
  });

  // createAdmin
  test('createAdmin berhasil membuat admin', async () => {
    const newAdmin = {
      nama: 'Admin Baru',
      username: 'adminbaru',
      password: 'rahasia123',
      foto: 'admin.jpg',
      aktif: true,
    };
    req.body = newAdmin;
    const createdAdmin = { id: 3, ...newAdmin };
    AdminRepository.createAdmin.mockResolvedValue(createdAdmin);

    await AdminController.createAdmin(req, res);

    expect(AdminRepository.createAdmin).toHaveBeenCalledWith(newAdmin);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdAdmin);
  });

  test('createAdmin gagal karena data tidak valid', async () => {
    req.body = { nama: 'Admin Invalid' };
    const error = new Error('Data tidak valid');
    AdminRepository.createAdmin.mockRejectedValue(error);

    await AdminController.createAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Data tidak valid');
  });

  // uploadFoto
  test('uploadFoto berhasil mengunggah foto admin', async () => {
    req.params.id = 1;
    req.file = { filename: 'foto.jpg' };

    const updatedAdmin = {
      id: 1,
      nama: 'Admin Foto',
      foto: 'foto.jpg',
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        nama: 'Admin Foto',
        foto: 'foto.jpg',
      }),
    };

    AdminRepository.updateAdmin.mockResolvedValue(updatedAdmin);

    await AdminController.uploadFoto(req, res);

    expect(AdminRepository.updateAdmin).toHaveBeenCalledWith(1, { foto: 'foto.jpg' });
    expect(getFileUrl).toHaveBeenCalledWith('foto.jpg', req, 'admin');
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Admin Foto',
      foto: 'foto.jpg',
      fotoUrl: 'http://localhost/admin/foto.jpg',
    });
  });

  test('uploadFoto gagal karena tidak ada file', async () => {
    req.file = null;

    await AdminController.uploadFoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
  });

  test('uploadFoto gagal karena error saat update', async () => {
    req.params.id = 1;
    req.file = { filename: 'foto.jpg' };

    AdminRepository.updateAdmin.mockRejectedValue(new Error('Gagal update'));

    await AdminController.uploadFoto(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Gagal update');
  });

  // updateFoto
  test('updateFoto berhasil memperbarui foto admin', async () => {
    req.params.id = 1;
    req.file = { filename: 'foto_baru.jpg' };

    const updatedAdmin = {
      id: 1,
      nama: 'Admin Update',
      foto: 'foto_baru.jpg',
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        nama: 'Admin Update',
        foto: 'foto_baru.jpg',
      }),
    };

    AdminRepository.updateAdmin.mockResolvedValue(updatedAdmin);

    await AdminController.updateFoto(req, res);

    expect(AdminRepository.updateAdmin).toHaveBeenCalledWith(1, { foto: 'foto_baru.jpg' });
    expect(getFileUrl).toHaveBeenCalledWith('foto_baru.jpg', req, 'admin');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Admin Update',
      foto: 'foto_baru.jpg',
      fotoUrl: 'http://localhost/admin/foto.jpg',
    });
  });

  test('updateFoto gagal karena tidak ada file', async () => {
    req.file = null;

    await AdminController.updateFoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
  });

  test('updateFoto gagal karena error saat update', async () => {
    req.params.id = 1;
    req.file = { filename: 'foto_baru.jpg' };

    AdminRepository.updateAdmin.mockRejectedValue(new Error('Update gagal'));

    await AdminController.updateFoto(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Update gagal' });
  });
});
