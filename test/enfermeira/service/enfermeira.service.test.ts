import { Test, TestingModule } from '@nestjs/testing';
import { EnfermeiraService } from '../../../src/enfermeira/application/enfermeira.service';
import {
  criarEnfermeiraDto,
  enfermeiraDto,
  enfermeiraRetornoBanco

} from "../../__mocks__/enfermeira.mock";
import { EnfermeiraRepository } from '../../../src/enfermeira/application/ports/enfermeira.repository';

let service: EnfermeiraService;
let repository: EnfermeiraRepository;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      EnfermeiraService,
      {
        provide: EnfermeiraRepository,
        useValue: {
          salvar: jest.fn(),
          validarCpf: jest.fn(),
          validarEmail: jest.fn(),
          deletar: jest.fn(),
          listarTodos: jest.fn(),
          atualizar: jest.fn(),
          buscarPorCpf: jest.fn(),
          buscarPorEmail: jest.fn(),
        },
      },
    ],
  }).compile();

  service = module.get<EnfermeiraService>(EnfermeiraService);
  repository = module.get<EnfermeiraRepository>(EnfermeiraRepository);
});

describe('EnfermeiraService', () => {
  describe('criar', () => {
    it('deve criar um novo Enfermeiro', async () => {
      jest.spyOn(repository, 'buscarPorCpf').mockResolvedValue(null);
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'salvar').mockResolvedValue(enfermeiraRetornoBanco);

      const result = await service.criar(criarEnfermeiraDto);

      expect(result).toEqual(enfermeiraDto);
    });
    it('deve retornar uma erro se o cpf já estiver cadastrado no sistema', async () => {
      jest.spyOn(repository, 'buscarPorCpf').mockResolvedValue(enfermeiraRetornoBanco);

      await expect(service.criar(criarEnfermeiraDto)).rejects.toThrowError(
        'Cpf inválido',
      );
    });
    it('deve retornar um erro se o email já estiver cadastrado no sistema', async () => {
      jest.spyOn(repository, 'buscarPorCpf').mockResolvedValue(null);
      jest
        .spyOn(repository, 'buscarPorEmail')
        .mockResolvedValue(enfermeiraRetornoBanco);

      await expect(service.criar(criarEnfermeiraDto)).rejects.toThrowError(
        'Email inválido',
      );
    });
  });

  describe('validarCpf', () => {
    it('deve validar um cpf  valido', async () => {
      jest.spyOn(repository, 'buscarPorCpf').mockResolvedValue(null);

      const result = await service.validarCpf('12347854440');

      expect(repository.buscarPorCpf).toBeCalledWith('12347854440');
      expect(result).toBeUndefined();
    });
    it('deve retornar um erro ao validar um cpf inválido', async () => {
      jest.spyOn(repository, 'buscarPorCpf').mockResolvedValue(enfermeiraRetornoBanco);

      await expect(service.validarCpf('12345678901')).rejects.toThrowError(
        'Cpf inválido',
      );
    });
  });

  describe('validarEmail', () => {
    it('deve validar um email valido', async () => {
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);

      const result = await service.validarEmail('juliana@ex.com');

      expect(repository.buscarPorEmail).toBeCalledWith('juliana@ex.com');
      expect(result).toBeUndefined();
    });
    it('deve retornar um erro ao validar um email inválido', async () => {
      jest
        .spyOn(repository, 'buscarPorEmail')
        .mockResolvedValue(enfermeiraRetornoBanco);

      await expect(
        service.validarEmail('maria.clara@exemplo.com'),
      ).rejects.toThrowError('Email inválido');
    });
  });

  describe('listarTodos', () => {
    it('deve listar todas as enfermeiras', async () => {
      jest.spyOn(repository, 'listarTodos').mockResolvedValue([enfermeiraRetornoBanco]);

      const result = await service.listarTodos();

      expect(result).toEqual([enfermeiraDto]);
    });
    it('deve retornar um erro se não houver enfermeiras cadastradas', async () => {
      jest.spyOn(repository, 'listarTodos').mockResolvedValue([]);

      await expect(service.listarTodos()).rejects.toThrowError(
        'Nenhuma enfermeira encontrada',
      );
    });
  });
});
