import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { ICreateMacaDto } from '../../models';
import { MacaService } from '../../services/maca';
import { MacaEvictionService } from '../../services/maca-eviction';
import { createMacaHandlerFactory } from './createMaca';

describe('REST: maca createMacaHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const mockMacaService = {
    create: jest.fn(),
    remove: jest.fn(),
  };

  const mockMonitoramentoService = {
    adicionarMacaAListadeMonitoramentoDeValidade: jest.fn(),
    removerMacaDaListadeMonitoramentoDeValidade: jest.fn(),
  };

  it('cria uma nova maca', async () => {
    const mockMaca = {
      preco: 1.5,
      nome: 'maca',
      expiracao: '4s',
    } as ICreateMacaDto;

    (mockMacaService.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
      expiracao: new Date(),
    });

    const mockReq = getMockReq({
      body: mockMaca,
    });
    const mockRes = getMockRes().res;
    const createMacaHandler = createMacaHandlerFactory(
      mockMacaService as any as MacaService,
      mockMonitoramentoService as any as MacaEvictionService
    );

    await createMacaHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('falha ao tentar criar uma maca com formato invalido', async () => {
    const mockMaca = {
      preco: 'w',
      nome: 'maca',
      expiracao: '4s',
    } as any as ICreateMacaDto;

    const mockReq = getMockReq({
      body: mockMaca,
    });
    const mockRes = getMockRes().res;
    const createMacaHandler = createMacaHandlerFactory(
      mockMacaService as any as MacaService,
      mockMonitoramentoService as any as MacaEvictionService
    );

    await createMacaHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O formato de maca enviado e invalido',
    });
  });

  it('falha ao tentar criar uma maca que expira com tempo negativo', async () => {
    const mockMaca = {
      preco: 1.5,
      nome: 'maca',
      expiracao: '-4s',
    } as any as ICreateMacaDto;

    const mockReq = getMockReq({
      body: mockMaca,
    });
    const mockRes = getMockRes().res;
    const createMacaHandler = createMacaHandlerFactory(
      mockMacaService as any as MacaService,
      mockMonitoramentoService as any as MacaEvictionService
    );

    await createMacaHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'O formato de maca enviado e invalido',
    });
  });

  it('falha ao tentar criar uma maca que expira imediatamente (0 segundos)', async () => {
    const mockMaca = {
      preco: 1.5,
      nome: 'maca',
      expiracao: '0s',
    } as any as ICreateMacaDto;

    (mockMacaService.create as jest.Mock).mockRejectedValueOnce(
      new Error('A expiracao deve ser maior que 0 segundos')
    );

    const mockReq = getMockReq({
      body: mockMaca,
    });
    const mockRes = getMockRes().res;
    const createMacaHandler = createMacaHandlerFactory(
      mockMacaService as any as MacaService,
      mockMonitoramentoService as any as MacaEvictionService
    );

    await createMacaHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'A expiracao deve ser maior que 0 segundos',
    });
  });
});
