const RiwayatController = require('../controllers/RiwayatController');
const RiwayatRepository = require('../repositories/RiwayatRepository');

jest.mock('../repositories/RiwayatRepository');

describe('RiwayatController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('getAll berhasil mengembalikan daftar riwayat', async () => {
    const mockData = [{ id: 1, nama: 'Pasien A' }];
    RiwayatRepository.getAll.mockResolvedValue(mockData);

    await RiwayatController.getAll(req, res);
    expect(RiwayatRepository.getAll).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getAll gagal karena error repository', async () => {
    const mockError = new Error('Gagal mengambil data');
    RiwayatRepository.getAll.mockRejectedValue(mockError);

    await RiwayatController.getAll(req, res);
    expect(RiwayatRepository.getAll).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('cancel berhasil membatalkan reservasi', async () => {
    req.params.id = '1';

    await RiwayatController.cancel(req, res);
    expect(RiwayatRepository.cancel).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Reservasi dibatalkan' });
  });

  test('cancel gagal karena error repository', async () => {
    req.params.id = '1';
    const mockError = new Error('Gagal membatalkan');

    RiwayatRepository.cancel.mockRejectedValue(mockError);

    await RiwayatController.cancel(req, res);
    expect(RiwayatRepository.cancel).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('getAntrian berhasil mengembalikan data antrian', async () => {
    req.params.id = '1';
    const mockAntrian = [{ id: 1, nomorAntrian: 5 }];
    RiwayatRepository.getAntrian.mockResolvedValue(mockAntrian);

    await RiwayatController.getAntrian(req, res);
    expect(RiwayatRepository.getAntrian).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAntrian);
  });

  test('getAntrian gagal karena error repository', async () => {
    req.params.id = '1';
    const mockError = new Error('Gagal mengambil antrian');
    RiwayatRepository.getAntrian.mockRejectedValue(mockError);

    await RiwayatController.getAntrian(req, res);
    expect(RiwayatRepository.getAntrian).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('getRiwayatById berhasil mengembalikan data riwayat berdasarkan ID', async () => {
    req.params.id = '1';
    const mockHistory = { id: 1, nama: 'Pasien A' };
    RiwayatRepository.getRiwayatById.mockResolvedValue(mockHistory);

    await RiwayatController.getRiwayatById(req, res);
    expect(RiwayatRepository.getRiwayatById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHistory);
  });

  test('getRiwayatById gagal karena error repository', async () => {
    req.params.id = '1';
    const mockError = new Error('Gagal mengambil riwayat');

    RiwayatRepository.getRiwayatById.mockRejectedValue(mockError);

    await RiwayatController.getRiwayatById(req, res);
    expect(RiwayatRepository.getRiwayatById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });
    test('cancel gagal karena riwayat tidak ditemukan', async () => {
    req.params.id = '99';
    const mockError = new Error('Riwayat tidak ditemukan');
    RiwayatRepository.cancel.mockRejectedValue(mockError);

    await RiwayatController.cancel(req, res);
    expect(RiwayatRepository.cancel).toHaveBeenCalledWith('99');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('getAntrian gagal karena data tidak ditemukan', async () => {
    req.params.id = '123';
    const mockError = new Error('Data tidak ditemukan');
    RiwayatRepository.getAntrian.mockRejectedValue(mockError);

    await RiwayatController.getAntrian(req, res);
    expect(RiwayatRepository.getAntrian).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('getRiwayatById gagal karena data tidak ditemukan', async () => {
    req.params.id = '999';
    const mockError = new Error('Data tidak ditemukan');
    RiwayatRepository.getRiwayatById.mockRejectedValue(mockError);

    await RiwayatController.getRiwayatById(req, res);
    expect(RiwayatRepository.getRiwayatById).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('delete berhasil menghapus riwayat', async () => {
    req.params.id = '1';
    await RiwayatController.delete(req, res);
    expect(RiwayatRepository.delete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Riwayat berhasil dihapus" });
  });

  test('delete gagal karena riwayat tidak ditemukan', async () => {
    req.params.id = '123';
    const mockError = new Error("Riwayat tidak ditemukan");
    RiwayatRepository.delete.mockRejectedValue(mockError);

    await RiwayatController.delete(req, res);
    expect(RiwayatRepository.delete).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('delete gagal karena error umum dari repository', async () => {
    req.params.id = '456';
    const mockError = new Error("Gagal menghapus riwayat");
    RiwayatRepository.delete.mockRejectedValue(mockError);

    await RiwayatController.delete(req, res);
    expect(RiwayatRepository.delete).toHaveBeenCalledWith('456');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });
  test('getRiwayatById gagal karena data tidak ditemukan', async () => {
    req.params.id = '1';
    const mockError = new Error('Data tidak ditemukan');
    RiwayatRepository.getRiwayatById.mockRejectedValue(mockError);

    await RiwayatController.getRiwayatById(req, res);
    expect(RiwayatRepository.getRiwayatById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

  test('getRiwayatById gagal karena error lain', async () => {
    req.params.id = '1';
    const mockError = new Error('Kesalahan server');
    RiwayatRepository.getRiwayatById.mockRejectedValue(mockError);

    await RiwayatController.getRiwayatById(req, res);
    expect(RiwayatRepository.getRiwayatById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });

test('delete berhasil menghapus riwayat', async () => {
  req.params.id = '1';
  RiwayatRepository.delete = jest.fn().mockResolvedValue(true);

  await RiwayatController.delete(req, res);

  expect(RiwayatRepository.delete).toHaveBeenCalledWith('1');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Riwayat berhasil dihapus' });
});

test('delete gagal karena riwayat tidak ditemukan', async () => {
  req.params.id = '99';
  const error = new Error('Riwayat tidak ditemukan');
  RiwayatRepository.delete = jest.fn().mockRejectedValue(error);

  await RiwayatController.delete(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Riwayat tidak ditemukan' });
});

test('delete gagal karena error lain', async () => {
  req.params.id = '2';
  const error = new Error('Database error');
  RiwayatRepository.delete = jest.fn().mockRejectedValue(error);

  await RiwayatController.delete(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
});



});
