import { Test, TestingModule } from '@nestjs/testing';
import { PessoaService } from '../../../src/pessoa/application/pessoa.service';
import { PessoaRepository } from '../../../src/pessoa/application/ports/pessoa.repository';
import { EnderecoService } from '../../../src/endereco/application/endereco.service';
import { PontuacaoService } from '../../../src/pontuacao/application/pontuacao.service';
import { criarPessoaDto, pessoaEntidade, pessoaDto } from '../../__mocks__/pessoa.mock';
import { enderecoEntidade } from '../../__mocks__/endereco.mock';
import { pontuacaoEntidade } from '../../__mocks__/pontuacao.mock';
import { ForbiddenException, NotFoundException } from "@nestjs/common";

describe('PessoaService', () => {
  let service: PessoaService;
  let repository: PessoaRepository;
  let enderecoService: EnderecoService;
  let pontuacaoService: PontuacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaService,
        {
          provide: PessoaRepository,
          useValue: {
            salvar: jest.fn(),
            deletar: jest.fn(),
            listarTodas: jest.fn(),
            buscarPorId: jest.fn(),
            buscarPorEmail: jest.fn(),
            buscarPorCpf: jest.fn(),
            atualizar: jest.fn(),
          },
        },
        {
          provide: EnderecoService,
          useValue: {
            criar: jest.fn(),
          },
        },
        {
          provide: PontuacaoService,
          useValue: {
            criarPontuacao: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PessoaService>(PessoaService);
    repository = module.get<PessoaRepository>(PessoaRepository);
    enderecoService = module.get<EnderecoService>(EnderecoService);
    pontuacaoService = module.get<PontuacaoService>(PontuacaoService);
  });

  describe('criar', () => {
    it('deve criar uma nova Pessoa', async () => {
      jest.spyOn(repository, 'buscarPorCpf').mockResolvedValue(null);
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);
      jest.spyOn(enderecoService, 'criar').mockResolvedValue(enderecoEntidade);
      jest.spyOn(pontuacaoService, 'criarPontuacao').mockResolvedValue(pontuacaoEntidade);
      jest.spyOn(repository, 'salvar').mockResolvedValue(pessoaEntidade);

      const result = await service.criar(criarPessoaDto);

      expect(result).toEqual(pessoaDto);
      expect(repository.buscarPorCpf).toHaveBeenCalledWith(criarPessoaDto.cpf);
      expect(repository.buscarPorEmail).toHaveBeenCalledWith(criarPessoaDto.email);
      expect(enderecoService.criar).toHaveBeenCalledWith(criarPessoaDto.toEnderecoDto());
      expect(pontuacaoService.criarPontuacao).toHaveBeenCalled();
      expect(repository.salvar).toHaveBeenCalledWith(pessoaEntidade);
    });
  });
  describe('validarCPFeEmail', () => {
    it('deve lançar ForbiddenException se CPF ou email já existirem', async () => {
      jest.spyOn(repository, 'buscarPorCpf').mockResolvedValue(pessoaEntidade);
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);

      await expect(service.validarCPFeEmail('12345678901', 'pessoa@ex.com')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('buscarPorEmail', () => {
    it('deve retornar uma pessoa se o email existir', async () => {
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(pessoaEntidade);

      const result = await service.buscarPorEmail('pessoa@ex.com');
      expect(result).toEqual(pessoaEntidade);
    });

    it('deve lançar NotFoundException se o email não existir', async () => {
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);

      await expect(service.buscarPorEmail('pessoa@ex.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarTodos', () => {
    it('deve retornar uma lista de pessoas', async () => {
      jest.spyOn(repository, 'listarTodas').mockResolvedValue([pessoaEntidade]);

      const result = await service.listarTodos();
      expect(result).toEqual([pessoaDto]);
    });

    it('deve lançar NotFoundException se não houver pessoas', async () => {
      jest.spyOn(repository, 'listarTodas').mockResolvedValue([]);

      await expect(service.listarTodos()).rejects.toThrow(NotFoundException);
    });
  });

  describe('atualizarInformacoes', () => {
    it('deve atualizar as informações de uma pessoa', async () => {
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(pessoaEntidade);
      jest.spyOn(repository, 'atualizar').mockResolvedValue(pessoaEntidade);

      const result = await service.atualizarInformacoes('pessoa@ex.com', { nome: 'Novo Nome' });
      expect(result).toEqual(pessoaDto);
    });
  });

  describe('deletar', () => {
    it('deve deletar uma pessoa', async () => {
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(pessoaEntidade);
      jest.spyOn(repository, 'deletar').mockResolvedValue(null);

      await service.deletar('pessoa@ex.com');
      expect(repository.deletar).toHaveBeenCalledWith('pessoa@ex.com');
    });

    it('deve lançar NotFoundException se o email não existir', async () => {
      jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);

      await expect(service.deletar('pessoa@ex.com')).rejects.toThrow(NotFoundException);
    });
  });
});