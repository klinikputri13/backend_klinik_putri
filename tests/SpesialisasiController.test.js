const SpesialisasiController = require('../controllers/SpesialisasiController');
const SpesialisasiRepository = require('../repositories/SpesialisasiRepository');
const { getFileUrl } = require('../utils/fileUtils');

jest.mock('../repositories/SpesialisasiRepository');
jest.mock('../utils/fileUtils');

describe('SpesialisasiController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // getAll
  test('getAll berhasil mengembalikan data spesialisasi', async () => {
    const mockData = { data: [{ toJSON: () => ({ id: 1, nama: 'Dokter Gigi', foto: 'gigi.jpg' }) }] };
    SpesialisasiRepository.getAll.mockResolvedValue(mockData);
    getFileUrl.mockReturnValue('http://localhost/uploads/spesialisasi/gigi.jpg');

    await SpesialisasiController.getAll(req, res);

    expect(SpesialisasiRepository.getAll).toHaveBeenCalledWith(req, res);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: 1, nama: 'Dokter Gigi', foto: 'gigi.jpg', fotoUrl: 'http://localhost/uploads/spesialisasi/gigi.jpg' }]
    });
  });

  test('getAll gagal mengembalikan data spesialisasi dan menangani error', async () => {
    SpesialisasiRepository.getAll.mockRejectedValue(new Error('Database error'));

    await SpesialisasiController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Database error');
  });

  // getSpesialisasiById
  test('getSpesialisasiById berhasil mengembalikan spesialisasi berdasarkan ID', async () => {
    req.params.id = '1';
    const mockData = { toJSON: () => ({ id: 1, nama: 'Dokter Umum', foto: 'umum.jpg' }) };
    SpesialisasiRepository.getSpesialisasiById.mockResolvedValue(mockData);
    getFileUrl.mockReturnValue('http://localhost/uploads/spesialisasi/umum.jpg');

    await SpesialisasiController.getSpesialisasiById(req, res);

    expect(SpesialisasiRepository.getSpesialisasiById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Dokter Umum',
      foto: 'umum.jpg',
      fotoUrl: 'http://localhost/uploads/spesialisasi/umum.jpg'
    });
  });

  test('getSpesialisasiById returns 404 when spesialisasi not found', async () => {
    req.params.id = 999;
    SpesialisasiRepository.getSpesialisasiById.mockResolvedValue(null);

    await SpesialisasiController.getSpesialisasiById(req, res);

    expect(SpesialisasiRepository.getSpesialisasiById).toHaveBeenCalledWith(999);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Spesialisasi not found' });
  });

  // createSpesialisasi
  test('createSpesialisasi berhasil membuat spesialisasi baru', async () => {
    req.file = { filename: 'baru.jpg' };
    req.body = { nama: 'Dokter Anak' };

    const mockData = { toJSON: () => ({ id: 1, nama: 'Dokter Anak', foto: 'baru.jpg' }) };
    SpesialisasiRepository.createSpesialisasi.mockResolvedValue(mockData);
    getFileUrl.mockReturnValue('http://localhost/uploads/spesialisasi/baru.jpg');

    await SpesialisasiController.createSpesialisasi(req, res);

    expect(SpesialisasiRepository.createSpesialisasi).toHaveBeenCalledWith({ nama: 'Dokter Anak', foto: 'baru.jpg' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil menambahkan layanan Spesialisasi',
      data: {
        id: 1,
        nama: 'Dokter Anak',
        foto: 'baru.jpg',
        fotoUrl: 'http://localhost/uploads/spesialisasi/baru.jpg'
      }
    });
  });

  test('createSpesialisasi gagal saat terjadi error', async () => {
    SpesialisasiRepository.createSpesialisasi.mockRejectedValue(new Error('Error creating spesialisasi'));

    await SpesialisasiController.createSpesialisasi(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error creating spesialisasi');
  });

  // uploadFoto
  test('uploadFoto berhasil mengunggah foto baru', async () => {
    req.params.id = '1';
    req.file = { filename: 'foto-baru.jpg' };

    const mockData = { toJSON: () => ({ id: 1, nama: 'Dokter Gizi', foto: 'foto-baru.jpg' }) };
    SpesialisasiRepository.updateSpesialisasi.mockResolvedValue(mockData);
    getFileUrl.mockReturnValue('http://localhost/uploads/spesialisasi/foto-baru.jpg');

    await SpesialisasiController.uploadFoto(req, res);

    expect(SpesialisasiRepository.updateSpesialisasi).toHaveBeenCalledWith('1', { foto: 'foto-baru.jpg' });
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nama: 'Dokter Gizi',
      foto: 'foto-baru.jpg',
      fotoUrl: 'http://localhost/uploads/spesialisasi/foto-baru.jpg'
    });
  });

  test('uploadFoto returns 400 if no file uploaded', async () => {
    req.params.id = '1';
    req.file = null;

    await SpesialisasiController.uploadFoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
  });

  // updateSpesialisasi
  test('updateSpesialisasi berhasil memperbarui data spesialisasi dengan file', async () => {
    req.params.id = '1';
    req.file = { filename: 'update.jpg' };
    req.body = { nama: 'Dokter Mata' };

    const mockData = { toJSON: () => ({ id: 1, nama: 'Dokter Mata', foto: 'update.jpg' }) };
    SpesialisasiRepository.updateSpesialisasi.mockResolvedValue(mockData);
    getFileUrl.mockReturnValue('http://localhost/uploads/spesialisasi/update.jpg');

    await SpesialisasiController.updateSpesialisasi(req, res);

    expect(SpesialisasiRepository.updateSpesialisasi).toHaveBeenCalledWith('1', { nama: 'Dokter Mata', foto: 'update.jpg' });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil mengubah layanan Spesialisasi',
      data: {
        id: 1,
        nama: 'Dokter Mata',
        foto: 'update.jpg',
        fotoUrl: 'http://localhost/uploads/spesialisasi/update.jpg'
      }
    });
  });

  test('updateSpesialisasi berhasil memperbarui data spesialisasi tanpa file', async () => {
    req.params.id = '1';
    req.file = null;
    req.body = { nama: 'Dokter Mata Tanpa Foto' };

    const mockData = { toJSON: () => ({ id: 1, nama: 'Dokter Mata Tanpa Foto', foto: null }) };
    SpesialisasiRepository.updateSpesialisasi.mockResolvedValue(mockData);
    getFileUrl.mockReturnValue('http://localhost/uploads/spesialisasi/default.jpg');

    await SpesialisasiController.updateSpesialisasi(req, res);

    expect(SpesialisasiRepository.updateSpesialisasi).toHaveBeenCalledWith('1', { nama: 'Dokter Mata Tanpa Foto' });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Berhasil mengubah layanan Spesialisasi',
      data: {
        id: 1,
        nama: 'Dokter Mata Tanpa Foto',
        foto: null,
        fotoUrl: 'http://localhost/uploads/spesialisasi/default.jpg'
      }
    });
  });

  // deleteSpesialisasi
  test('deleteSpesialisasi berhasil menghapus spesialisasi', async () => {
    req.params.id = '1';
    SpesialisasiRepository.deleteSpesialisasi.mockResolvedValue(true);

    await SpesialisasiController.deleteSpesialisasi(req, res);

    expect(SpesialisasiRepository.deleteSpesialisasi).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ response: true, message: 'Spesialisasi deleted successfully' });
  });

  test('deleteSpesialisasi gagal saat terjadi error', async () => {
    SpesialisasiRepository.deleteSpesialisasi.mockRejectedValue(new Error('Error deleting spesialisasi'));

    await SpesialisasiController.deleteSpesialisasi(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error deleting spesialisasi');
  });
  // Tambahkan test yang memicu error
test('getAll harus handle error dan panggil res.status 500', async () => {
  SpesialisasiRepository.getAll.mockRejectedValue(new Error('Database error'));

  await SpesialisasiController.getAll(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Database error');
});
test('uploadFoto harus mengembalikan 400 jika file tidak ada', async () => {
  req.file = null;
  await SpesialisasiController.uploadFoto(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
});
test('updateSpesialisasi berhasil tanpa file', async () => {
  req.file = null;
  req.params.id = '1';
  req.body = { nama: 'Test Update' };

  SpesialisasiRepository.updateSpesialisasi.mockResolvedValue({ toJSON: () => ({ id: 1, nama: 'Test Update', foto: null }) });
  getFileUrl.mockReturnValue('http://localhost/uploads/spesialisasi/default.jpg');

  await SpesialisasiController.updateSpesialisasi(req, res);

  expect(SpesialisasiRepository.updateSpesialisasi).toHaveBeenCalledWith('1', { nama: 'Test Update' });
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
});

});
