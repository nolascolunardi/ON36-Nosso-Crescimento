import { ConsultaService } from "../../../src/consulta/application/consulta.service";
import { ConsultaRepository } from "../../../src/consulta/application/ports/consulta.repository";
import { PontuacaoService } from "../../../src/pontuacao/application/pontuacao.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PessoaService } from "../../../src/pessoa/application/pessoa.service";
import { pessoaMock } from "../../__mocks__/pessoa.mock";
import {
  atualizarConsultaDto,
  consultaDto, consultaDTO2,
  consultaRetornoBanco, consultaRetornoBanco2, criarConsultaDto

} from "../../__mocks__/consulta.mock";
import { TIPOS_CONSULTA } from "../../../src/consulta/domain/enum/TipoConsulta.enum";

let service : ConsultaService;
let repository : ConsultaRepository;
let pontuacaoService : PontuacaoService;
let pessoaService : PessoaService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ConsultaService,
      {
        provide: ConsultaRepository,
        useValue: {
          salvar: jest.fn(),
          deletar: jest.fn(),
          listarTodas: jest.fn(),
          buscarPorId: jest.fn(),
          buscarPorEmail: jest.fn(),
          listarTodosPorPessoa: jest.fn(),
          atualizar: jest.fn(),
        },
      },
      {
        provide: PontuacaoService,
        useValue: {
          contabilizarPontuacao: jest.fn(),
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

  service = module.get<ConsultaService>(ConsultaService);
  repository = module.get<ConsultaRepository>(ConsultaRepository);
  pontuacaoService = module.get<PontuacaoService>(PontuacaoService);
  pessoaService = module.get<PessoaService>(PessoaService);
});

describe('ConsultaService', () => {
  describe('criar', () => {
    it('deve criar uma nova Consulta', async () => {
      jest.spyOn(pessoaService, 'buscarPorEmail').mockResolvedValue(pessoaMock);
      jest.spyOn(repository, 'salvar').mockResolvedValue(consultaRetornoBanco);

      const result = await service.criar(criarConsultaDto);

      expect(result).toEqual(consultaDto);
    });
    it ('deve retornar um erro caso a pessoa não seja encontrada', async () => {
      jest.spyOn(pessoaService, 'buscarPorEmail').mockResolvedValue(null);

      await expect(service.criar(criarConsultaDto)).rejects.toThrow();
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar uma consulta', async () => {
      jest.spyOn(repository, 'buscarPorId').mockResolvedValue(consultaRetornoBanco);

      const result = await service.buscarPorId('1');

      expect(result).toEqual(consultaRetornoBanco);
    });
    it('deve retornar um erro caso a consulta não seja encontrada', async () => {
      jest.spyOn(repository, 'buscarPorId').mockResolvedValue(null);

      await expect(service.buscarPorId('1')).rejects.toThrow();
    });
  });

  describe('listarTodas', () => {
    it('deve retornar uma lista de consultas', async () => {
      jest.spyOn(repository, 'listarTodas').mockResolvedValue([consultaRetornoBanco2]);

      const result = await service.listarTodas();

      expect(result).toEqual([consultaDTO2]);
    });
    it('deve retornar um erro caso não haja consultas', async () => {
      jest.spyOn(repository, 'listarTodas').mockResolvedValue(null);

      await expect(service.listarTodas()).rejects.toThrow();
    });
  });

  describe('listarTodasPorEmail', () => {
    it('deve retornar uma lista de consultas', async () => {
      jest.spyOn(repository, 'listarTodosPorPessoa').mockResolvedValue([consultaRetornoBanco2]);

      const result = await service.listarTodasPorEmail('1');

      expect(result).toEqual([consultaDTO2]);
    });
    it('deve retornar um erro caso não haja consultas', async () => {
      jest.spyOn(repository, 'listarTodosPorPessoa').mockResolvedValue(null);

      await expect(service.listarTodasPorEmail('1')).rejects.toThrow();
    });
  });

  describe('validarTipoConsulta', () => {
    it('deve retornar a pontuação de uma consulta', async () => {
      const result = await service.validarTipoConsulta('Pediatria');

      expect(result).toEqual(TIPOS_CONSULTA.Pediatria.pontuacao);
    });
    it('deve retornar um erro caso o tipo de consulta seja inválido', async () => {
      await expect(service.validarTipoConsulta('Ortopedia')).rejects.toThrow();
    });
  });

  describe('validarStatus', () => {
    it('deve validar o status de uma consulta', async () => {
      await service.validarStatus(consultaRetornoBanco.status, atualizarConsultaDto.status);
    });
    it('deve retornar um erro caso o status da consulta seja inválido', async () => {
      await expect(service.validarStatus(consultaRetornoBanco2.status, atualizarConsultaDto.status)).rejects.toThrow();
    });
  });

  describe('deletar', () => {
    it('deve deletar uma consulta', async () => {
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(consultaRetornoBanco);
      jest.spyOn(repository, 'deletar').mockResolvedValue();

      await service.deletar('1');

    });
    it('deve retornar um erro caso a consulta já tenha sido realizada', async () => {
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(consultaRetornoBanco2);

      await expect(service.deletar('1')).rejects.toThrow();
    });
  });

  describe('atualizarStatus', () => {
    it('deve atualizar o status de uma consulta', async () => {
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(consultaRetornoBanco);
      jest.spyOn(pontuacaoService, 'contabilizarPontuacao').mockResolvedValue();
      jest.spyOn(repository, 'atualizar').mockResolvedValue(consultaRetornoBanco2);

      const result = await service.atualizarStatus('1', atualizarConsultaDto);

      expect(result).toEqual(consultaDTO2);
    });
    it('deve retornar um erro caso a consulta não seja encontrada', async () => {
      jest.spyOn(service, 'buscarPorId').mockResolvedValue(null);

      await expect(service.atualizarStatus('1', atualizarConsultaDto)).rejects.toThrow();
    });
  });
});