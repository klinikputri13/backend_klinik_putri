const ReservasiController = require('../controllers/ReservasiController');
const ReservasiRepository = require('../repositories/ReservasiRepository');
const RiwayatRepository = require('../repositories/RiwayatRepository');

jest.mock('../repositories/ReservasiRepository');
jest.mock('../repositories/RiwayatRepository');

describe('ReservasiController', () => {
  
  // Test getAllReservasi
  describe('getAllReservasi', () => {
    it('should return all reservations', async () => {
      const mockReservasi = [{ id: 1, nama: 'John Doe' }];
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.getAll.mockResolvedValue(mockReservasi);

      await ReservasiController.getAllReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReservasi);
    });

    it('should handle errors in getAllReservasi', async () => {
      const errorMessage = 'Failed to fetch reservations';
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.getAll.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.getAllReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Test getReservasiById
  describe('getReservasiById', () => {
    it('should return a reservation by id', async () => {
      const mockReservasi = { id: 1, nama: 'John Doe' };
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.getReservasiById.mockResolvedValue(mockReservasi);

      await ReservasiController.getReservasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReservasi);
    });

    it('should return 404 if reservation not found', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.getReservasiById.mockResolvedValue(null);

      await ReservasiController.getReservasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reservasi not found' });
    });

    it('should handle errors in getReservasiById', async () => {
      const errorMessage = 'Failed to fetch reservation by id';
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.getReservasiById.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.getReservasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Test createReservation
  describe('createReservation', () => {
    it('should create a reservation with riwayat', async () => {
      const mockReservasi = { id: 1, nama: 'Jane Doe' };
      const mockRiwayat = { id: 1, nomorAntrian: '002' };

      const req = {
        body: {
          nama: 'Jane Doe',
          umur: 25,
          no_hp: '081234567890',
          alamat: 'Test Address',
          jenis_kelamin: 'P',
          appointmentDate: '2025-06-01',
          appointmentTime: '12:00',
        },
        params: { id: 1 },  // spesialisasiId
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.createReservasi.mockResolvedValue(mockReservasi);
      RiwayatRepository.getQueueNumber.mockResolvedValue('002');
      RiwayatRepository.create.mockResolvedValue(mockRiwayat);

      await ReservasiController.createReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Berhasil menambahkan reservasi online',
        reservasi: mockReservasi,
        riwayat: mockRiwayat,
      });
    });

    it('should handle errors in createReservation', async () => {
      const errorMessage = 'Failed to create reservation';

      const req = {
        body: {
          nama: 'Jane Doe',
          umur: 25,
          no_hp: '081234567890',
          alamat: 'Test Address',
          jenis_kelamin: 'P',
          appointmentDate: '2025-06-01',
          appointmentTime: '12:00',
        },
        params: { id: 1 },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.createReservasi.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.createReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Test createReservasi (Onsite reservation)
  describe('createReservasi', () => {
    it('should create a new onsite reservation with riwayat', async () => {
      const mockReservasi = { id: 1, nama: 'Jane Doe' };
      const mockRiwayat = { id: 1, nomorAntrian: '003' };

      const req = {
        body: {
          spesialisasiId: 1,
          nama: 'Jane Doe',
          umur: 25,
          no_hp: '081234567890',
          alamat: 'Test Address',
          jenis_kelamin: 'P',
          appointmentDate: '2025-06-01',
          appointmentTime: '12:00',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.createReservasi.mockResolvedValue(mockReservasi);
      RiwayatRepository.getQueueNumber.mockResolvedValue('003');
      RiwayatRepository.create.mockResolvedValue(mockRiwayat);

      await ReservasiController.createReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Berhasil menambahkan Reservasi Onsite',
        reservasi: mockReservasi,
        riwayat: mockRiwayat,
      });
    });

    it('should handle errors in createReservasi', async () => {
      const errorMessage = 'Failed to create onsite reservation';

      const req = {
        body: {
          spesialisasiId: 1,
          nama: 'Jane Doe',
          umur: 25,
          no_hp: '081234567890',
          alamat: 'Test Address',
          jenis_kelamin: 'P',
          appointmentDate: '2025-06-01',
          appointmentTime: '12:00',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.createReservasi.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.createReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Test updateReservasi
  describe('updateReservasi', () => {
    it('should update a reservation', async () => {
      const mockReservasi = { id: 1, nama: 'Updated Name' };
      const req = { params: { id: 1 }, body: { nama: 'Updated Name' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.updateReservasi.mockResolvedValue(mockReservasi);

      await ReservasiController.updateReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Berhasil mengubah reservasi',
        reservasi: mockReservasi,
      });
    });

    it('should return 404 if reservation not found to update', async () => {
      const req = { params: { id: 1 }, body: { nama: 'Updated Name' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.updateReservasi.mockResolvedValue(null);

      await ReservasiController.updateReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reservasi not found' });
    });

    it('should handle errors in updateReservasi', async () => {
      const errorMessage = 'Failed to update reservation';
      const req = { params: { id: 1 }, body: { nama: 'Updated Name' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.updateReservasi.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.updateReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteReservasi', () => {
  it('deleteReservasi berhasil menghapus data reservasi', async () => {
    const mockReservasi = { id: 1, nama: 'John Doe' };
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    ReservasiRepository.deleteReservasi = jest.fn().mockResolvedValue(mockReservasi);

    await ReservasiController.deleteReservasi(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Data reservasi berhasil dihapus',
      data: mockReservasi,
    });
  });

  it('deleteReservasi gagal karena reservasi tidak ditemukan', async () => {
    const req = { params: { id: 999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    ReservasiRepository.deleteReservasi = jest.fn().mockResolvedValue(null);

    await ReservasiController.deleteReservasi(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Reservasi not found' });
  });

  it('deleteReservasi gagal karena error dari server', async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    ReservasiRepository.deleteReservasi = jest.fn().mockRejectedValue(new Error('Internal Error'));

    await ReservasiController.deleteReservasi(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Error' });
  });
});



});
