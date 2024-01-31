import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { BaldeService } from '../../services/balde';
import { moveFromBaldeHandlerFactory } from './moveFromBalde';

describe('REST: balde moveFromBaldeHandler', () => {
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

  it('remove uma maca de um balde', async () => {
    (mockBaldeService.moveFromBalde as jest.Mock).mockResolvedValueOnce({
      moved: 1,
    });

    const mockReq = getMockReq({
      params: { baldeId: '1', macaId: '1' },
    });
    const mockRes = getMockRes().res;
    const moveFromBaldeHandler = moveFromBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await moveFromBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockRes.json).toHaveBeenCalledWith({ result: true });
  });

  it('falha ao tentar remove uma maca de um balde que nao existe', async () => {
    (mockBaldeService.moveFromBalde as jest.Mock).mockResolvedValueOnce({
      moved: 0,
      message: 'O balde nao existe',
    });

    const mockReq = getMockReq({
      params: { baldeId: '1', macaId: '1' },
    });
    const mockRes = getMockRes().res;
    const moveFromBaldeHandler = moveFromBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await moveFromBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O balde nao existe',
    });
  });

  it('falha ao tentar remove uma maca que nao existe de um balde', async () => {
    (mockBaldeService.moveFromBalde as jest.Mock).mockResolvedValueOnce({
      moved: 0,
      message: 'A maca nao existe',
    });

    const mockReq = getMockReq({
      params: { baldeId: '1', macaId: '1' },
    });
    const mockRes = getMockRes().res;
    const moveFromBaldeHandler = moveFromBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await moveFromBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'A maca nao existe',
    });
  });

  it('falha ao tentar remover uma maca com id invalido', async () => {
    const mockReq = getMockReq({
      params: { baldeId: '1', macaId: 'w' },
    });
    const mockRes = getMockRes().res;
    const moveFromBaldeHandler = moveFromBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await moveFromBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O formato do macaId enviado e invalido',
    });
  });

  it('falha ao tentar remover uma maca com o id do balde invalido', async () => {
    const mockReq = getMockReq({
      params: { baldeId: 'w', macaId: '1' },
    });
    const mockRes = getMockRes().res;
    const moveFromBaldeHandler = moveFromBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await moveFromBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O formato do baldeId enviado e invalido',
    });
  });

  it('falha ao tentar remover uma maca sem o id do balde', async () => {
    const mockReq = getMockReq({
      params: { macaId: '1' },
    });
    const mockRes = getMockRes().res;
    const moveFromBaldeHandler = moveFromBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await moveFromBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O formato do baldeId enviado e invalido',
    });
  });

  it('falha ao tentar remover uma maca sem o id da maca', async () => {
    const mockReq = getMockReq({
      params: { baldeId: '1' },
    });
    const mockRes = getMockRes().res;
    const moveFromBaldeHandler = moveFromBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await moveFromBaldeHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O formato do macaId enviado e invalido',
    });
  });
});
