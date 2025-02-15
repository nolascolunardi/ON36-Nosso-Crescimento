import { Enfermeira } from '../../src/enfermeira/domain/enfermeira.entity';
import { CriarEnfermeiraDto } from '../../src/enfermeira/presenter/dto/criar-enfermeira.dto';
import { EnfermeiraDto } from "../../src/enfermeira/presenter/dto/enfermeira.dto";

export const criarEnfermeiraDto = {
  nomeCompleto: 'Maria Clara Souza',
  email: 'maria.clara@ex.com',
  senha: 'senhaSegura123',
  telefone: '11987654321',
  coren: '123456',
  cpf: '12345678901',
  unidadeDeAtendimento: 'Hospital São Lucas',
  descricao: 'Enfermeira com 5 anos de experiência em atendimento clínico.',
  toEntity: () => enfermeiraEntidade,
} as unknown as CriarEnfermeiraDto;

export const enfermeiraEntidade = new Enfermeira(
  'Maria Clara Souza',
  'maria.clara@ex.com',
  'senhaSegura123',
  '11987654321',
  '123456',
  '12345678901',
  'Hospital São Lucas',
  'Enfermeira com 5 anos de experiência em atendimento clínico.',
);

export const enfermeiraRetornoBanco = {
  id: 1,
  nomeCompleto: 'Maria Clara Souza',
  email: 'maria.clara@ex.com',
  senha: 'senhaSegura123',
  telefone: '11987654321',
  coren: '123456',
  cpf: '12345678901',
  unidadeDeAtendimento: 'Hospital São Lucas',
  descricao: 'Enfermeira com 5 anos de experiência em atendimento clínico.'
}as unknown as Enfermeira

export const enfermeiraDto = {
  id: 1,
  nome_completo:'Maria Clara Souza',
  email: 'maria.clara@ex.com',
  telefone: '11987654321',
  coren: '123456',
  unidade_de_atendimento: 'Hospital São Lucas',
  descricao: 'Enfermeira com 5 anos de experiência em atendimento clínico.'
} as unknown as EnfermeiraDto;