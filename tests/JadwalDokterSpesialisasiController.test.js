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

    expect(JadwalDokterSpesialisasiRepository.getAll).toHaveBeenCalledWith(req, res);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('getAll gagal karena server error', async () => {
    JadwalDokterSpesialisasiRepository.getAll.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });

  test('getJadwalDokterSpesialisasiById berhasil mengembalikan data berdasarkan ID', async () => {
    req.params.id = 1;
    const data = { id: 1, hari: 'Senin' };
    JadwalDokterSpesialisasiRepository.getJadwalDokterSpesialisasiById.mockResolvedValue(data);

    await JadwalDokterSpesialisasiController.getJadwalDokterSpesialisasiById(req, res);

    expect(JadwalDokterSpesialisasiRepository.getJadwalDokterSpesialisasiById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('getJadwalDokterSpesialisasiById gagal karena server error', async () => {
    req.params.id = 1;
    JadwalDokterSpesialisasiRepository.getJadwalDokterSpesialisasiById.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.getJadwalDokterSpesialisasiById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });

  test('createJadwalDokterSpesialisasi berhasil membuat data baru', async () => {
    req.body = { hari: 'Selasa' };
    const created = { id: 2, hari: 'Selasa' };
    JadwalDokterSpesialisasiRepository.create.mockResolvedValue(created);

    await JadwalDokterSpesialisasiController.createJadwalDokterSpesialisasi(req, res);

    expect(JadwalDokterSpesialisasiRepository.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil menambahkan Jadwal dokter Spesialis',
      data: created,
    });
  });

  test('createJadwalDokterSpesialisasi gagal karena server error', async () => {
    req.body = { hari: 'Selasa' };
    JadwalDokterSpesialisasiRepository.create.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.createJadwalDokterSpesialisasi(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });

  test('updateJadwalDokterSpesialisasi berhasil memperbarui data', async () => {
    req.params.id = 1;
    req.body = { hari: 'Rabu' };
    const updated = { id: 1, hari: 'Rabu' };
    JadwalDokterSpesialisasiRepository.update.mockResolvedValue(updated);

    await JadwalDokterSpesialisasiController.updateJadwalDokterSpesialisasi(req, res);

    expect(JadwalDokterSpesialisasiRepository.update).toHaveBeenCalledWith(1, req.body);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil mengubah jadwal dokter spesialis',
      data: updated,
    });
  });

  test('updateJadwalDokterSpesialisasi gagal karena server error', async () => {
    req.params.id = 1;
    req.body = { hari: 'Rabu' };
    JadwalDokterSpesialisasiRepository.update.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.updateJadwalDokterSpesialisasi(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });

  test('deleteJadwalDokterSpesialisasi berhasil menghapus data', async () => {
    req.params.id = 1;
    const deleted = { message: 'Deleted successfully' };
    JadwalDokterSpesialisasiRepository.delete.mockResolvedValue(deleted);

    await JadwalDokterSpesialisasiController.deleteJadwalDokterSpesialisasi(req, res);

    expect(JadwalDokterSpesialisasiRepository.delete).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil menghapus jadwal dokter spesialis',
      data: deleted,
    });
  });

  test('deleteJadwalDokterSpesialisasi gagal karena server error', async () => {
    req.params.id = 1;
    JadwalDokterSpesialisasiRepository.delete.mockRejectedValue(new Error('Server error'));

    await JadwalDokterSpesialisasiController.deleteJadwalDokterSpesialisasi(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });
});
