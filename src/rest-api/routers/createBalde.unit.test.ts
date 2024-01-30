import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { ICreateBaldeDto } from '../../models';
import { BaldeService } from '../../services/balde';
import { createBaldeHandlerFactory } from './createBalde';

describe('REST: balde createBaldeHandler', () => {
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

  it('cria um novo balde', async () => {
    const mockBalde = {
      capacidade: 1,
      nome: 'balde A',
    } as ICreateBaldeDto;

    (mockBaldeService.create as jest.Mock).mockResolvedValueOnce(1);

    const mockReq = getMockReq({
      body: mockBalde,
    });
    const mockRes = getMockRes().res;
    const createBaldeHandler = createBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await createBaldeHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('falha ao tentar criar um balde com formato invalido', async () => {
    const mockBalde = {
      id: 1,
      capacidade: '1',
      nome: 'balde A',
    } as any as ICreateBaldeDto;

    const mockReq = getMockReq({
      body: mockBalde,
    });
    const mockRes = getMockRes().res;
    const createBaldeHandler = createBaldeHandlerFactory(
      mockBaldeService as any as BaldeService
    );

    await createBaldeHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O formato de balde enviado e invalido',
    });
  });
});
