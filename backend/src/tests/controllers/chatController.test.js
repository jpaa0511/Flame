const getChatHistory = require('../../controllers/chatController').getChatHistory;
const Message = require('../../models/Message');
const Match = require('../../models/Match');
const httpMock = require('node-mocks-http');
const { successResponse, errorResponse } = require('../../helpers/responseHelper');

jest.mock('../../models/Message');
jest.mock('../../models/Match');
jest.mock('../../helpers/responseHelper', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn()
}));

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  Types: {
    ObjectId: jest.fn().mockImplementation((id) => ({ id }))
  }
}));

describe('getChatHistory', () => {
    const req = httpMock.createRequest({
        method: 'GET',
        url: '/chat/12345',
        params: {
        matchId: '12345'
        }
    });
    const res = httpMock.createResponse();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('debe devolver el historial de mensajes si el match existe', async () => {
        const fakeMatch = { _id: '12345', isActive: true };
        const fakeMessages = [
        { sender: 'user1', content: 'Hello', createdAt: new Date() },
        { sender: 'user2', content: 'Hi', createdAt: new Date() }
        ];
    
        Match.findOne.mockResolvedValue(fakeMatch);
        Message.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(fakeMessages)
        })
        });
    
        await getChatHistory(req, res);
    
        expect(Match.findOne).toHaveBeenCalledWith({
        _id: req.params.matchId,
        isActive: true
        });
        expect(Message.find).toHaveBeenCalledWith({
        match: req.params.matchId
        });
        expect(successResponse).toHaveBeenCalledWith(res, { messages: fakeMessages });
    });
    
    it('debe devolver un error si el match no existe', async () => {
        Match.findOne.mockResolvedValue(null);
    
        await getChatHistory(req, res);
    
        expect(Match.findOne).toHaveBeenCalledWith({
        _id: req.params.matchId,
        isActive: true
        });
        expect(errorResponse).toHaveBeenCalledWith(res, 'Match not found', 404);
    });
    
    it('debe manejar errores inesperados', async () => {
        const errorMessage = 'Database error';
        Match.findOne.mockRejectedValue(new Error(errorMessage));
    
        await getChatHistory(req, res);
    
        expect(errorResponse).toHaveBeenCalledWith(res, errorMessage);
    });
    });