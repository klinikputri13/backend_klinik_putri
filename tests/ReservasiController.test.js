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

      // Mock the repositories
      ReservasiRepository.createReservasi.mockResolvedValue(mockReservasi);
      RiwayatRepository.getQueueNumber.mockResolvedValue('002');
      RiwayatRepository.create.mockResolvedValue(mockRiwayat);

      await ReservasiController.createReservation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ reservasi: mockReservasi, riwayat: mockRiwayat });
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
        params: { id: 1 },  // spesialisasiId
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock repository to throw error
      ReservasiRepository.createReservasi.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.createReservation(req, res);

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
      expect(res.json).toHaveBeenCalledWith({ reservasi: mockReservasi });
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

  // Test deleteReservasi
  describe('deleteReservasi', () => {
    it('should delete a reservation', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.deleteReservasi.mockResolvedValue(true);

      await ReservasiController.deleteReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reservasi deleted successfully' });
    });

    it('should return 404 if reservation not found to delete', async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.deleteReservasi.mockResolvedValue(null);

      await ReservasiController.deleteReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reservasi not found' });
    });

    it('should handle errors in deleteReservasi', async () => {
      const errorMessage = 'Failed to delete reservation';
      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ReservasiRepository.deleteReservasi.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.deleteReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
// Menambahkan tes untuk bagian yang belum tercakup (63-91)
describe('ReservasiController - Additional Tests', () => {
  
  // Test untuk createReservasi
  describe('createReservasi', () => {
    it('should create a new reservation', async () => {
      const mockReservasi = {
        id: 1,
        spesialisasiId: 1,
        nama: 'Jane Doe',
        umur: 25,
        no_hp: '081234567890',
        alamat: 'Test Address',
        jenis_kelamin: 'P',
        appointmentDate: '2025-06-01',
        appointmentTime: '12:00',
        status: 'proses',
      };
      const mockRiwayat = {
        id: 1,
        reservasiId: 1,
        spesialisasiId: 1,
        appointmentDate: '2025-06-01',
        appointmentTime: '12:00',
        nama: 'Jane Doe',
        status: 'proses',
        nomorAntrian: '001',
      };

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

      // Mock the repository methods
      ReservasiRepository.createReservasi.mockResolvedValue(mockReservasi);
      RiwayatRepository.getQueueNumber.mockResolvedValue('001');
      RiwayatRepository.create.mockResolvedValue(mockRiwayat);

      await ReservasiController.createReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        reservasi: mockReservasi,
        riwayat: mockRiwayat,
      });
    });

    it('should handle errors in createReservasi', async () => {
      const errorMessage = 'Failed to create new reservation';
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

      // Mock repository to throw error
      ReservasiRepository.createReservasi.mockRejectedValue(new Error(errorMessage));

      await ReservasiController.createReservasi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Test untuk updateReservasi (sudah ada di bagian sebelumnya)
  describe('updateReservasi', () => {
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
});

});
