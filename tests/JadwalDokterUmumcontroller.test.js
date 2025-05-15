const JadwalDokterUmumController = require('../controllers/JadwalDokterUmumController');
const JadwalDokterUmumRepository = require('../repositories/JadwalDokterUmumRepository');

jest.mock('../repositories/JadwalDokterUmumRepository');

describe('JadwalDokterUmumController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    JadwalDokterUmumRepository.getAll = jest.fn();
    JadwalDokterUmumRepository.getJadwalDokterUmumById = jest.fn();
    JadwalDokterUmumRepository.create = jest.fn();
    JadwalDokterUmumRepository.update = jest.fn();
    JadwalDokterUmumRepository.delete = jest.fn();

    jest.clearAllMocks();
  });

  test('getAll berhasil mengembalikan daftar jadwal dokter umum', async () => {
    const jadwal = [{ id: 1, nama: 'Dr. A' }];
    JadwalDokterUmumRepository.getAll.mockResolvedValue(jadwal);

    await JadwalDokterUmumController.getAll(req, res);
    expect(res.json).toHaveBeenCalledWith(jadwal);
  });

  test('getAll gagal karena error dari repository', async () => {
    JadwalDokterUmumRepository.getAll.mockRejectedValue(new Error('DB Error'));

    await JadwalDokterUmumController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('DB Error');
  });

  test('getJadwalDokterUmumById berhasil mengembalikan data jadwal', async () => {
    req.params.id = 1;
    const jadwal = { id: 1, nama: 'Dr. A' };
    JadwalDokterUmumRepository.getJadwalDokterUmumById.mockResolvedValue(jadwal);

    await JadwalDokterUmumController.getJadwalDokterUmumById(req, res);
    expect(res.json).toHaveBeenCalledWith(jadwal);
  });

  test('getJadwalDokterUmumById gagal karena error dari repository', async () => {
    req.params.id = 1;
    JadwalDokterUmumRepository.getJadwalDokterUmumById.mockRejectedValue(new Error('DB Error'));

    await JadwalDokterUmumController.getJadwalDokterUmumById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('DB Error');
  });

  test('createJadwalDokterUmum berhasil membuat data baru', async () => {
    req.body = { nama: 'Dr. B' };
    const created = { id: 2, nama: 'Dr. B' };
    JadwalDokterUmumRepository.create.mockResolvedValue(created);

    await JadwalDokterUmumController.createJadwalDokterUmum(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test('createJadwalDokterUmum gagal karena error dari repository', async () => {
    req.body = { nama: 'Dr. B' };
    JadwalDokterUmumRepository.create.mockRejectedValue(new Error('DB Error'));

    await JadwalDokterUmumController.createJadwalDokterUmum(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('DB Error');
  });

  test('updateJadwalDokterUmum berhasil memperbarui data', async () => {
    req.params.id = 1;
    req.body = { nama: 'Dr. C' };
    const updated = { id: 1, nama: 'Dr. C' };
    JadwalDokterUmumRepository.update.mockResolvedValue(updated);

    await JadwalDokterUmumController.updateJadwalDokterUmum(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('updateJadwalDokterUmum gagal karena error dari repository', async () => {
    req.params.id = 1;
    req.body = { nama: 'Dr. C' };
    JadwalDokterUmumRepository.update.mockRejectedValue(new Error('DB Error'));

    await JadwalDokterUmumController.updateJadwalDokterUmum(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('DB Error');
  });

  test('deleteJadwalDokterUmum berhasil menghapus data', async () => {
    req.params.id = 1;
    const deleted = { message: 'Jadwal deleted' };
    JadwalDokterUmumRepository.delete.mockResolvedValue(deleted);

    await JadwalDokterUmumController.deleteJadwalDokterUmum(req, res);
    expect(res.json).toHaveBeenCalledWith(deleted);
  });

  test('deleteJadwalDokterUmum gagal karena error dari repository', async () => {
    req.params.id = 1;
    JadwalDokterUmumRepository.delete.mockRejectedValue(new Error('DB Error'));

    await JadwalDokterUmumController.deleteJadwalDokterUmum(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('DB Error');
  });
});
