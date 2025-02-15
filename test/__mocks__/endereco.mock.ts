import { Endereco } from '../../src/endereco/domain/endereco.entity';
import { CriarEnderecoDto } from '../../src/endereco/presenter/dto/criar-endereco.dto';

export const mockEndereco = new Endereco(
  '04713010',
  'Avenida Brigadeiro Faria Lima',
  '3477',
  'Itaim Bibi',
  'São Paulo',
  'São Paulo',
  'Brasil',
);

export const mockEnderecoDto = {
  cep: '04713010',
  logradouro: 'Avenida Brigadeiro Faria Lima',
  numero: '3477',
  bairro: 'Itaim Bibi',
  cidade: 'São Paulo',
  estado: 'São Paulo',
  pais: 'Brasil',
  toEntity: () => mockEndereco,
} as unknown as CriarEnderecoDto;

export const mockEnderecoInvalidoDto = new CriarEnderecoDto(
  '12345678',
  'Avenida Brigadeiro Faria Lima',
  '3477',
  'Itaim Bibi',
  'São Paulo',
  'São Paulo',
  'Brasil',
);


export const enderecoEntidade = {
  cep: '12345678',
  logradouro: 'Rua Teste',
  numero: '123',
  bairro: 'Bairro Teste',
  cidade: 'Cidade Teste',
  estado: 'SP'
}as unknown as Endereco;
