// tests/JadwalDokterSpesialisasiController.test.js
const JadwalDokterSpesialisasiController = require('../controllers/JadwalDokterSpesialisasiController');
const JadwalDokterSpesialisasiRepository = require('../repositories/JadwalDokterSpesialisasiRepository');

jest.mock('../repositories/JadwalDokterSpesialisasiRepository');

describe('JadwalDokterSpesialisasiController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('getAll berhasil mengembalikan daftar jadwal', async () => {
    const data = [{ id: 1, hari: 'Senin' }];
    JadwalDokterSpesialisasiRepository.getAll.mockResolvedValue(data);

    await JadwalDokterSpesialisasiController.getAll(req, res);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('getAll gagal mengembalikan daftar jadwal karena server error', async () => {
    const errorMessage = { error: 'Server error', message: 'Terjadi kesalahan pada server' };
    JadwalDokterSpesialisasiRepository.getAll.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });

  test('getJadwalDokterSpesialisasiById berhasil mengembalikan data berdasarkan ID', async () => {
    req.params.id = 1;
    const data = { id: 1, hari: 'Senin' };
    JadwalDokterSpesialisasiRepository.getJadwalDokterSpesialisasiById.mockResolvedValue(data);

    await JadwalDokterSpesialisasiController.getJadwalDokterSpesialisasiById(req, res);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('getJadwalDokterSpesialisasiById gagal karena data tidak ditemukan', async () => {
    req.params.id = 1;
    JadwalDokterSpesialisasiRepository.getJadwalDokterSpesialisasiById.mockResolvedValue(null);

    await JadwalDokterSpesialisasiController.getJadwalDokterSpesialisasiById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Data jadwal tidak ditemukan' });
  });

  test('getJadwalDokterSpesialisasiById gagal karena server error', async () => {
    const errorMessage = { error: 'Server error', message: 'Terjadi kesalahan pada server' };
    req.params.id = 1;
    JadwalDokterSpesialisasiRepository.getJadwalDokterSpesialisasiById.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.getJadwalDokterSpesialisasiById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });

  test('createJadwalDokterSpesialisasi berhasil membuat data baru', async () => {
    req.body = { hari: 'Selasa' };
    const created = { id: 2, hari: 'Selasa' };
    JadwalDokterSpesialisasiRepository.create.mockResolvedValue(created);

    await JadwalDokterSpesialisasiController.createJadwalDokterSpesialisasi(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test('createJadwalDokterSpesialisasi gagal karena data tidak valid', async () => {
    req.body = {};  // Invalid data
    await JadwalDokterSpesialisasiController.createJadwalDokterSpesialisasi(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Data tidak valid' });
  });

  test('createJadwalDokterSpesialisasi gagal karena server error', async () => {
    const errorMessage = { error: 'Server error', message: 'Terjadi kesalahan pada server' };
    req.body = { hari: 'Selasa' };
    JadwalDokterSpesialisasiRepository.create.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.createJadwalDokterSpesialisasi(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });

  test('updateJadwalDokterSpesialisasi berhasil memperbarui data', async () => {
    req.params.id = 1;
    req.body = { hari: 'Rabu' };
    const updated = { id: 1, hari: 'Rabu' };
    JadwalDokterSpesialisasiRepository.update.mockResolvedValue(updated);

    await JadwalDokterSpesialisasiController.updateJadwalDokterSpesialisasi(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('updateJadwalDokterSpesialisasi gagal karena data tidak ditemukan', async () => {
    req.params.id = 1;
    req.body = { hari: 'Rabu' };
    JadwalDokterSpesialisasiRepository.update.mockResolvedValue(null);

    await JadwalDokterSpesialisasiController.updateJadwalDokterSpesialisasi(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Data jadwal tidak ditemukan' });
  });

  test('updateJadwalDokterSpesialisasi gagal karena server error', async () => {
    const errorMessage = { error: 'Server error', message: 'Terjadi kesalahan pada server' };
    req.params.id = 1;
    req.body = { hari: 'Rabu' };
    JadwalDokterSpesialisasiRepository.update.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.updateJadwalDokterSpesialisasi(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });

  test('deleteJadwalDokterSpesialisasi berhasil menghapus data', async () => {
    req.params.id = 1;
    const deleted = { message: 'Deleted successfully' };
    JadwalDokterSpesialisasiRepository.delete.mockResolvedValue(deleted);

    await JadwalDokterSpesialisasiController.deleteJadwalDokterSpesialisasi(req, res);
    expect(res.json).toHaveBeenCalledWith(deleted);
  });

  test('deleteJadwalDokterSpesialisasi gagal karena data tidak ditemukan', async () => {
    req.params.id = 1;
    JadwalDokterSpesialisasiRepository.delete.mockResolvedValue(null);

    await JadwalDokterSpesialisasiController.deleteJadwalDokterSpesialisasi(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Data jadwal tidak ditemukan' });
  });

  test('deleteJadwalDokterSpesialisasi gagal karena server error', async () => {
    const errorMessage = { error: 'Server error', message: 'Terjadi kesalahan pada server' };
    req.params.id = 1;
    JadwalDokterSpesialisasiRepository.delete.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.deleteJadwalDokterSpesialisasi(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });
});
