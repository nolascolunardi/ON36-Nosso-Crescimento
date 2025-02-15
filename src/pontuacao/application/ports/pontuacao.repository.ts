import { Pontuacao } from '../../domain/pontuacao.entity';
import { UpdateResult } from 'typeorm';

export abstract class PontuacaoRepository {
  abstract salvar(pontuacao: Pontuacao): Promise<Pontuacao>;
  abstract atualizar(id: string, pontuacao: Pontuacao): Promise<Pontuacao>;
  abstract buscarPontuacao(id: string): Promise<Pontuacao>;
}
