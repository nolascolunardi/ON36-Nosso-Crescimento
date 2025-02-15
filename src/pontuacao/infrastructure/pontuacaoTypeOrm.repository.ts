import { InjectRepository } from '@nestjs/typeorm';
import { PontuacaoRepository } from '../application/ports/pontuacao.repository';
import { Repository, UpdateResult } from 'typeorm';
import { Pontuacao } from '../domain/pontuacao.entity';

export class PontuacaoTypeOrmRepository extends PontuacaoRepository {
  constructor(
    @InjectRepository(Pontuacao)
    private readonly pontuacaoRepository: Repository<Pontuacao>,
  ) {
    super();
  }

  async salvar(ponto: Pontuacao): Promise<Pontuacao> {
    return await this.pontuacaoRepository.save(ponto);
  }

  async atualizar(id: string, ponto: Pontuacao): Promise<Pontuacao> {
    await this.pontuacaoRepository.update(id, ponto);
    return await this.buscarPontuacao(id);
  }

  async buscarPontuacao(id: string): Promise<Pontuacao> {
    return this.pontuacaoRepository.findOne({
      where: { pessoa: { id: id } },
      relations: ['pessoa'],
    });
  }
}
