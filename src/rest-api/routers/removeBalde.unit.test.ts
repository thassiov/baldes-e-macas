import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { BaldeService } from '../../services/balde';
import { removeBaldeHandlerFactory } from './removeBalde';

describe('REST: balde removeBaldeHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const mockBaldeService = {
    create: jest.fn(),
    remove: jest.fn(),
    moveToBalde: jest.fn(),
    moveFromBalde: jest.fn(),
    listBaldes: jest.fn(),
  };

  it('remove um balde existente', async () => {
    (mockBaldeService.remove as jest.Mock).mockResolvedValueOnce(1);

    const mockReq = getMockReq({
      params: { id: '1' },
    });
    const mockRes = getMockRes().res;
    const removeBaldeHandler = removeBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await removeBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('falha ao tentar remover um balde que nao existe', async () => {
    (mockBaldeService.remove as jest.Mock).mockResolvedValueOnce({
      removed: 0,
      message: 'O balde nao existe',
    });

    const mockReq = getMockReq({
      params: { id: '1' },
    });
    const mockRes = getMockRes().res;
    const removeBaldeHandler = removeBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await removeBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O balde nao existe',
    });
  });

  it('falha ao tentar remover um balde que nao esta vazio', async () => {
    (mockBaldeService.remove as jest.Mock).mockResolvedValueOnce({
      removed: 0,
      message: 'O balde nao esta vazio e por isso nao pode ser removido',
    });

    const mockReq = getMockReq({
      params: { id: '1' },
    });
    const mockRes = getMockRes().res;
    const removeBaldeHandler = removeBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await removeBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O balde nao esta vazio e por isso nao pode ser removido',
    });
  });
});
