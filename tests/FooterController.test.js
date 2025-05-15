const FooterController = require('../controllers/FooterController');
const FooterRepository = require('../repositories/FooterRepository');

jest.mock('../repositories/FooterRepository');

describe('FooterController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: { text: 'Updated footer text' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('getFooterById', () => {
    it('should return footer by id', async () => {
      const mockFooter = { id: 1, text: 'Footer text' };
      FooterRepository.getFooterById.mockResolvedValue(mockFooter);

      await FooterController.getFooterById(req, res);

      expect(FooterRepository.getFooterById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockFooter);
    });

    it('should handle error if getFooterById fails', async () => {
      FooterRepository.getFooterById.mockRejectedValue(new Error('Error getting footer'));

      await FooterController.getFooterById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error getting footer');
    });
  });

  describe('updateFooter', () => {
    it('should update footer by id', async () => {
      const updatedFooter = { id: 1, text: 'Updated footer text' };
      FooterRepository.updateFooter.mockResolvedValue(updatedFooter);

      await FooterController.updateFooter(req, res);

      expect(FooterRepository.updateFooter).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(updatedFooter);
    });

    it('should handle error if updateFooter fails', async () => {
      FooterRepository.updateFooter.mockRejectedValue(new Error('Error updating footer'));

      await FooterController.updateFooter(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error updating footer');
    });
  });
});
