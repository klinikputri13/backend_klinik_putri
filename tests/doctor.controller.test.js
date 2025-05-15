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
    req = { body: {}, params: {}, file: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('createDoctor berhasil mengembalikan dokter yang dibuat', async () => {
    req.body = { nama: 'Dr. Baru', spesialisasi: 'Umum' };
    req.file = { filename: 'foto.jpg' };

    const createdDoctor = {
      foto: 'foto.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. Baru', spesialisasi: 'Umum', foto: 'foto.jpg' })
    };

    DoctorRepository.createDoctor = jest.fn().mockResolvedValue(createdDoctor);

    await DoctorController.createDoctor(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Dr. Baru',
      spesialisasi: 'Umum',
      foto: 'foto.jpg',
      fotoUrl: 'http://example.com/doctor/foto.jpg'
    });
  });

  test('createDoctor gagal karena kesalahan repository', async () => {
    req.body = { nama: 'Dr. Baru', spesialisasi: 'Umum' };
    req.file = { filename: 'foto.jpg' };

    DoctorRepository.createDoctor = jest.fn().mockRejectedValue(new Error('Repository Error'));

    await DoctorController.createDoctor(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });

  test('getDoctorById berhasil mengembalikan data dokter', async () => {
    req.params.id = 1;
    const doctor = {
      foto: 'foto.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. A', foto: 'foto.jpg' })
    };
    DoctorRepository.getDoctorById = jest.fn().mockResolvedValue(doctor);

    await DoctorController.getDoctorById(req, res);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Dr. A',
      foto: 'foto.jpg',
      fotoUrl: 'http://example.com/doctor/foto.jpg'
    });
  });

  test('getDoctorById gagal dengan spesialisasi tidak ditemukan', async () => {
    req.params.id = 999;
    DoctorRepository.getDoctorById = jest.fn().mockResolvedValue(null);

    await DoctorController.getDoctorById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Spesialisasi not found' });
  });

  test('getDoctorById gagal karena kesalahan repository', async () => {
    req.params.id = 1;
    DoctorRepository.getDoctorById = jest.fn().mockRejectedValue(new Error('Repository Error'));

    await DoctorController.getDoctorById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });

  test('uploadFoto berhasil memperbarui foto dokter', async () => {
    req.params.id = 1;
    req.file = { filename: 'newFoto.jpg' };

    const updatedDoctor = {
      foto: 'newFoto.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. A', foto: 'newFoto.jpg' })
    };

    DoctorRepository.updateDoctor = jest.fn().mockResolvedValue(updatedDoctor);

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
    expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
  });

  test('uploadFoto gagal karena kesalahan repository', async () => {
    req.params.id = 1;
    req.file = { filename: 'newFoto.jpg' };

    DoctorRepository.updateDoctor = jest.fn().mockRejectedValue(new Error('Repository Error'));

    await DoctorController.uploadFoto(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });

  test('updateDoctor berhasil memperbarui data dokter', async () => {
    req.params.id = 1;
    req.body = { nama: 'Dr. Updated' };
    req.file = { filename: 'updatedFoto.jpg' };

    const updatedDoctor = {
      foto: 'updatedFoto.jpg',
      toJSON: () => ({ id: 1, nama: 'Dr. Updated', foto: 'updatedFoto.jpg' })
    };

    DoctorRepository.updateDoctor = jest.fn().mockResolvedValue(updatedDoctor);

    await DoctorController.updateDoctor(req, res);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Dr. Updated',
      foto: 'updatedFoto.jpg',
      fotoUrl: 'http://example.com/doctor/foto.jpg'
    });
  });

  test('deleteDoctor berhasil menghapus dokter', async () => {
    req.params.id = 1;
    const deleteResponse = 'ok';

    DoctorRepository.deleteDoctor = jest.fn().mockResolvedValue(deleteResponse);

    await DoctorController.deleteDoctor(req, res);
    expect(res.json).toHaveBeenCalledWith({
      response: 'ok',
      message: 'Doctor deleted successfully'
    });
  });

  test('deleteDoctor gagal karena kesalahan repository', async () => {
    req.params.id = 1;
    DoctorRepository.deleteDoctor = jest.fn().mockRejectedValue(new Error('Repository Error'));

    await DoctorController.deleteDoctor(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });

  test('getAll berhasil mengembalikan semua data dokter', async () => {
    const doctors = [
      { id: 1, nama: 'Dr. A', spesialisasi: 'Umum' },
      { id: 2, nama: 'Dr. B', spesialisasi: 'Bedah' },
    ];

    DoctorRepository.getAll = jest.fn().mockResolvedValue(doctors);

    await DoctorController.getAll(req, res);
    expect(res.json).toHaveBeenCalledWith(doctors);
  });

  test('getAll gagal karena error', async () => {
    DoctorRepository.getAll = jest.fn().mockRejectedValue(new Error('Error fetching data'));

    await DoctorController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error fetching data');
  });

  test('getAll gagal karena kesalahan repository', async () => {
    DoctorRepository.getAll = jest.fn().mockRejectedValue(new Error('Repository Error'));

    await DoctorController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Repository Error');
  });
  it('should handle error when updating doctor', async () => {
    const req = {
      params: { id: 1 },
      body: { nama: 'dr. Error' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  
    // Paksa repository melempar error
    jest.spyOn(DoctorRepository, 'updateDoctor').mockRejectedValue(new Error('Something went wrong'));
  
    await DoctorController.updateDoctor(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Something went wrong');
  });

  it('should return 404 if doctor not found', async () => {
    const req = { params: { id: 999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    jest.spyOn(DoctorRepository, 'getDoctorById').mockResolvedValue(null);
  
    await DoctorController.getDoctorById(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Spesialisasi not found' });
  });
  it('should create a doctor without a file', async () => {
    const req = {
      body: {
        nama: 'Dr. Tes',
        spesialisasiId: 1,
      },
      file: undefined, // ini penting!
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    const mockDoctor = {
      toJSON: () => ({
        id: 1,
        nama: 'Dr. Tes',
        spesialisasiId: 1,
        foto: null
      }),
      foto: null,
    };
  
    jest.spyOn(DoctorRepository, 'createDoctor').mockResolvedValue(mockDoctor);
  
    await DoctorController.createDoctor(req, res);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
  
});
