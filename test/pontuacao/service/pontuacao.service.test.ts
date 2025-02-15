import { Test, TestingModule } from '@nestjs/testing';
import { PontuacaoService } from '../../../src/pontuacao/application/pontuacao.service';
import { PontuacaoRepository } from '../../../src/pontuacao/application/ports/pontuacao.repository';
import { PessoaService } from '../../../src/pessoa/application/pessoa.service';
import { pontuacaoEntidade, pontuacaoEntidadeAtualizada } from "../../__mocks__/pontuacao.mock";
import { pessoaEntidade } from '../../__mocks__/pessoa.mock';
import { Consulta } from '../../../src/consulta/domain/consulta.entity';
import { StatusEnum } from '../../../src/utils/status.enum';
import { UpdateResult } from "typeorm";
import { NotFoundException } from "@nestjs/common";

describe('PontuacaoService', () => {
  let service: PontuacaoService;
  let pontuacaoRepository: PontuacaoRepository;
  let pessoaService: PessoaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PontuacaoService,
        {
          provide: PontuacaoRepository,
          useValue: {
            salvar: jest.fn(),
            buscarPontuacao: jest.fn(),
            atualizar: jest.fn(),
          },
        },
        {
          provide: PessoaService,
          useValue: {
            buscarPorEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PontuacaoService>(PontuacaoService);
    pontuacaoRepository = module.get<PontuacaoRepository>(PontuacaoRepository);
    pessoaService = module.get<PessoaService>(PessoaService);
  });

  describe('criarPontuacao', () => {
    it('deve criar uma nova pontuação', async () => {
      jest.spyOn(pontuacaoRepository, 'salvar').mockResolvedValue(pontuacaoEntidade);

      const result = await service.criarPontuacao();

      expect(result).toEqual(pontuacaoEntidade);
      expect(pontuacaoRepository.salvar).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('buscarPontuacao', () => {
    it('deve retornar a pontuação de uma pessoa pelo email', async () => {
      jest.spyOn(pessoaService, 'buscarPorEmail').mockResolvedValue(pessoaEntidade);
      jest.spyOn(pontuacaoRepository, 'buscarPontuacao').mockResolvedValue(pontuacaoEntidade);

      const result = await service.buscarPontuacao('pessoa@ex.com');

      expect(result).toEqual(expect.any(Object));
      expect(pessoaService.buscarPorEmail).toHaveBeenCalledWith('pessoa@ex.com');
      expect(pontuacaoRepository.buscarPontuacao).toHaveBeenCalledWith(pessoaEntidade.id);
    });
  });

  describe('contabilizarPontuacao', () => {
    it('deve atualizar a pontuação se a consulta foi realizada', async () => {
      const consulta = { status: StatusEnum.REALIZADA, pessoa: pessoaEntidade, pontos: 10 } as Consulta;
      jest.spyOn(service, 'atualizarPontuacao').mockResolvedValue();

      await service.contabilizarPontuacao(consulta);

      expect(service.atualizarPontuacao).toHaveBeenCalledWith(pessoaEntidade, 10);
    });

    it('não deve atualizar a pontuação se a consulta não foi realizada', async () => {
      const consulta = { status: StatusEnum.NAO_REALIZADA, pessoa: pessoaEntidade, pontos: 10 } as Consulta;
      jest.spyOn(service, 'atualizarPontuacao').mockResolvedValue();

      await service.contabilizarPontuacao(consulta);

      expect(service.atualizarPontuacao).not.toHaveBeenCalled();
    });
  });

  describe('atualizarPontuacao', () => {
    it('deve atualizar a pontuação de uma pessoa', async () => {
      jest.spyOn(pontuacaoRepository, 'buscarPontuacao').mockResolvedValue(pontuacaoEntidade);
      jest.spyOn(pontuacaoRepository, 'atualizar').mockResolvedValue(pontuacaoEntidadeAtualizada);

      await service.atualizarPontuacao(pessoaEntidade, 10);

      expect(pontuacaoRepository.buscarPontuacao).toHaveBeenCalledWith(pessoaEntidade.id);
      expect(pontuacaoEntidade.pontos).toBe(10);
      expect(pontuacaoRepository.atualizar).toHaveBeenCalledWith(pontuacaoEntidade.id, pontuacaoEntidade);
    });
  });
});