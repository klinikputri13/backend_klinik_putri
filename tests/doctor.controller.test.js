const DoctorController = require('../controllers/DoctorController');
const DoctorRepository = require('../repositories/DoctorRepository');
const { getFileUrl } = require('../utils/fileUtils');

jest.mock('../repositories/DoctorRepository');
jest.mock('../utils/fileUtils', () => ({
  getFileUrl: jest.fn(() => 'http://example.com/doctor/foto.jpg')
}));

describe('DoctorController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, file: null };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  // ==================== GET ALL ====================
  test('getAll berhasil mengembalikan semua data dokter', async () => {
    const doctors = [{ id: 1, nama: 'Dr. A' }, { id: 2, nama: 'Dr. B' }];
    DoctorRepository.getAll.mockResolvedValue(doctors);

    await DoctorController.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(doctors);
  });

  test('getAll gagal karena kesalahan repository', async () => {
    DoctorRepository.getAll.mockRejectedValue(new Error('Repository Error'));

    await DoctorController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });

  // ==================== GET BY ID ====================
  test('getDoctorById berhasil mengembalikan data dokter', async () => {
    req.params.id = 1;
    const doctor = {
      foto: 'foto.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. A', foto: 'foto.jpg' })
    };
    DoctorRepository.getDoctorById.mockResolvedValue(doctor);

    await DoctorController.getDoctorById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Dr. A',
      foto: 'foto.jpg',
      fotoUrl: 'http://example.com/doctor/foto.jpg'
    });
  });

  test('getDoctorById gagal karena dokter tidak ditemukan', async () => {
    req.params.id = 999;
    DoctorRepository.getDoctorById.mockResolvedValue(null);

    await DoctorController.getDoctorById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Dokter tidak ditemukan' });
  });

  test('getDoctorById gagal karena kesalahan repository', async () => {
    req.params.id = 1;
    DoctorRepository.getDoctorById.mockRejectedValue(new Error('Repository Error'));

    await DoctorController.getDoctorById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });

  // ==================== CREATE ====================
  test('createDoctor berhasil mengembalikan dokter yang dibuat dengan foto', async () => {
    req.body = { nama: 'Dr. Baru' };
    req.file = { filename: 'foto.jpg' };

    const createdDoctor = {
      foto: 'foto.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. Baru', foto: 'foto.jpg' })
    };

    DoctorRepository.createDoctor.mockResolvedValue(createdDoctor);

    await DoctorController.createDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil menambahkan data dokter!',
      data: {
        id: 1,
        nama: 'Dr. Baru',
        foto: 'foto.jpg',
        fotoUrl: 'http://example.com/doctor/foto.jpg'
      }
    });
  });

  test('createDoctor berhasil mengembalikan dokter yang dibuat tanpa foto', async () => {
    req.body = { nama: 'Dr. Tanpa Foto' };
    req.file = undefined;

    const createdDoctor = {
      foto: undefined,
      toJSON: () => ({ id: 2, nama: 'Dr. Tanpa Foto', foto: undefined })
    };

    DoctorRepository.createDoctor.mockResolvedValue(createdDoctor);

    await DoctorController.createDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil menambahkan data dokter!',
      data: {
        id: 2,
        nama: 'Dr. Tanpa Foto',
        foto: undefined,
        fotoUrl: 'http://example.com/doctor/foto.jpg'
      }
    });
  });

  test('createDoctor gagal karena kesalahan repository', async () => {
    req.body = { nama: 'Dr. Error' };
    req.file = undefined;

    DoctorRepository.createDoctor.mockRejectedValue(new Error('Database error'));

    await DoctorController.createDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Database error');
  });

  // ==================== UPDATE ====================
  test('updateDoctor berhasil memperbarui data dokter', async () => {
    req.params.id = 1;
    req.body = { nama: 'Dr. Updated' };
    req.file = { filename: 'updated.jpg' };

    const updatedDoctor = {
      foto: 'updated.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. Updated', foto: 'updated.jpg' })
    };

    DoctorRepository.updateDoctor.mockResolvedValue(updatedDoctor);

    await DoctorController.updateDoctor(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil mengubah data dokter',
      data: {
        id: 1,
        nama: 'Dr. Updated',
        foto: 'updated.jpg',
        fotoUrl: 'http://example.com/doctor/foto.jpg'
      }
    });
  });

  test('updateDoctor gagal karena kesalahan repository', async () => {
    req.params.id = 1;
    req.body = { nama: 'dr. Error' };

    DoctorRepository.updateDoctor.mockRejectedValue(new Error('Something went wrong'));

    await DoctorController.updateDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Something went wrong');
  });

  // ==================== DELETE ====================
  test('deleteDoctor berhasil menghapus dokter', async () => {
    req.params.id = 1;
    const response = 'ok';

    DoctorRepository.deleteDoctor.mockResolvedValue(response);

    await DoctorController.deleteDoctor(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil menghapus dokter',
      response
    });
  });

  test('deleteDoctor gagal karena kesalahan repository', async () => {
    req.params.id = 1;
    DoctorRepository.deleteDoctor.mockRejectedValue(new Error('Repository Error'));

    await DoctorController.deleteDoctor(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });

  // ==================== UPLOAD FOTO ====================
  test('uploadFoto berhasil memperbarui foto dokter', async () => {
    req.params.id = 1;
    req.file = { filename: 'newFoto.jpg' };

    const updatedDoctor = {
      foto: 'newFoto.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. A', foto: 'newFoto.jpg' })
    };

    DoctorRepository.updateDoctor.mockResolvedValue(updatedDoctor);

    await DoctorController.uploadFoto(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Dr. A',
      foto: 'newFoto.jpg',
      fotoUrl: 'http://example.com/doctor/foto.jpg'
    });
  });

  test('uploadFoto gagal karena file tidak ada', async () => {
    req.params.id = 1;
    req.file = null;

    await DoctorController.uploadFoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'File tidak ditemukan' });
  });

  test('uploadFoto gagal karena kesalahan repository', async () => {
    req.params.id = 1;
    req.file = { filename: 'newFoto.jpg' };

    DoctorRepository.updateDoctor.mockRejectedValue(new Error('Repository Error'));

    await DoctorController.uploadFoto(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });
});
