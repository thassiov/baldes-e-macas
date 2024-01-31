import { getMockReq, getMockRes } from '@jest-mock/express';
import { StatusCodes } from 'http-status-codes';

import { MacaService } from '../../services/maca';
import { MacaEvictionService } from '../../services/maca-eviction';
import { removeMacaHandlerFactory } from './removeMaca';

describe('REST: maca removeMacaHandler', () => {
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

  it('remove uma maca existente', async () => {
    (mockMacaService.remove as jest.Mock).mockResolvedValueOnce({ removed: 1 });

    const mockReq = getMockReq({
      params: { id: '1' },
    });
    const mockRes = getMockRes().res;
    const removeMacaHandler = removeMacaHandlerFactory(
      mockMacaService as any as MacaService,
      mockMonitoramentoService as any as MacaEvictionService
    );

    await removeMacaHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('falha ao tentar remover uma maca que nao existe', async () => {
    (mockMacaService.remove as jest.Mock).mockResolvedValueOnce({
      removed: 0,
      message: 'A maca nao existe',
    });

    const mockReq = getMockReq({
      params: { id: '1' },
    });
    const mockRes = getMockRes().res;
    const removeMacaHandler = removeMacaHandlerFactory(
      mockMacaService as any as MacaService,
      mockMonitoramentoService as any as MacaEvictionService
    );

    await removeMacaHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'A maca nao existe' });
  });
});
