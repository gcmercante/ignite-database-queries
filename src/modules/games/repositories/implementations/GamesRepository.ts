import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const result = await this.repository
      .createQueryBuilder()
      .where("LOWER(title) LIKE LOWER(:title)", { title: `%${param}%` })
      .getMany();

    return result;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(id) FROM games;");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder()
      .relation(Game, 'users')
      .of(id)
      .loadMany();
  }
}
