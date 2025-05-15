const PatientController = require('../controllers/PatientController');
const PatientRepository = require('../repositories/PatientRepository');
const { getFileUrl } = require('../utils/fileUtils');

jest.mock('../repositories/PatientRepository');
jest.mock('../utils/fileUtils');

describe('PatientController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: {},
      file: { filename: 'patient.jpg' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    getFileUrl.mockReturnValue('http://localhost/uploads/patient.jpg');
  });

  describe('getAll', () => {
    it('should return all patients', async () => {
      const mockPatients = [{ id: 1, name: 'Patient A' }];
      PatientRepository.getAll.mockResolvedValue(mockPatients);

      await PatientController.getAll(req, res);

      expect(PatientRepository.getAll).toHaveBeenCalledWith(req, res);
      expect(res.json).toHaveBeenCalledWith(mockPatients);
    });

    it('should handle error in getAll', async () => {
      PatientRepository.getAll.mockRejectedValue(new Error('DB error'));

      await PatientController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('DB error');
    });
  });

  describe('getPatientById', () => {
    it('should return a patient with fotoUrl', async () => {
      const mockPatient = {
        id: 1,
        name: 'Patient A',
        foto: 'patient.jpg',
        toJSON: () => ({
          id: 1,
          name: 'Patient A',
          foto: 'patient.jpg'
        })
      };
      PatientRepository.getPatientById.mockResolvedValue(mockPatient);

      await PatientController.getPatientById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Patient A',
        foto: 'patient.jpg',
        fotoUrl: 'http://localhost/uploads/patient.jpg'
      });
    });

    it('should return 404 if patient not found', async () => {
      PatientRepository.getPatientById.mockResolvedValue(null);

      await PatientController.getPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'patient not found' });
    });

    it('should handle error in getPatientById', async () => {
      PatientRepository.getPatientById.mockRejectedValue(new Error('Error'));

      await PatientController.getPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error');
    });
  });

  describe('uploadFoto', () => {
    it('should return 400 if no file uploaded', async () => {
      req.file = null;

      await PatientController.uploadFoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
    });

    it('should update and return patient with fotoUrl', async () => {
      const updatedPatient = {
        id: 1,
        name: 'Updated Patient',
        foto: 'patient.jpg',
        toJSON: () => ({
          id: 1,
          name: 'Updated Patient',
          foto: 'patient.jpg'
        })
      };
      PatientRepository.updatePatient.mockResolvedValue(updatedPatient);

      await PatientController.uploadFoto(req, res);

      expect(PatientRepository.updatePatient).toHaveBeenCalledWith(1, {
        foto: 'patient.jpg'
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Patient',
        foto: 'patient.jpg',
        fotoUrl: 'http://localhost/uploads/patient.jpg'
      });
    });

    it('should handle error in uploadFoto', async () => {
      PatientRepository.updatePatient.mockRejectedValue(new Error('Update error'));

      await PatientController.uploadFoto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Update error');
    });
  });
});
