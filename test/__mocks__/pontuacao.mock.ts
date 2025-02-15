import { Pontuacao } from "../../src/pontuacao/domain/pontuacao.entity";
import { pessoaEntidade } from "./pessoa.mock";


export const pontuacaoEntidade={
  id: "1",
  pontos: 0,
  atualizadoEm: new Date('2024-09-01'),
  pessoa: pessoaEntidade
} as unknown as Pontuacao;

export const pontuacaoEntidadeAtualizada={
  id: "1",
  pontos: 10,
  atualizadoEm: new Date('2024-09-01'),
  pessoa: pessoaEntidade
} as unknown as Pontuacao;
