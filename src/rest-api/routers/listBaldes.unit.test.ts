import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { BaldeService } from '../../services/balde';
import { listBaldesHandlerFactory } from './listBaldes';

describe('REST: balde listBaldesHandler', () => {
  const mockBaldeService = {
    create: jest.fn(),
    remove: jest.fn(),
    moveToBalde: jest.fn(),
    moveFromBalde: jest.fn(),
    listBaldes: jest.fn(),
  };

  it('list baldes e seus conteudos', async () => {
    const mockBaldeInfo = {
      id: 1,
      nome: 'A',
      capacidade: 1,
      ocupacao: 100,
      valorTotal: 1,
    };

    (mockBaldeService.listBaldes as jest.Mock).mockResolvedValueOnce([
      mockBaldeInfo,
    ]);

    const mockReq = getMockReq();
    const mockRes = getMockRes().res;
    const listBaldesHandler = listBaldesHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await listBaldesHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockRes.json).toHaveBeenCalledWith({ baldes: [mockBaldeInfo] });
  });
});
