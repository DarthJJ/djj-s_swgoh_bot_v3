import { Repository } from "typeorm";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { Ability } from "../../models/swgoh/ability.js";
import { iDao } from "./iDao.js";

export class AbilityDao implements iDao<Ability> {
  private readonly _database: Repository<Ability>;

  constructor(database: Repository<Ability>) {
    this._database = database;
  }
  getById(id: string | number): Promise<Ability | null> {
    throw new Error("Method not implemented.");
  }
  async save(object: Ability): Promise<void> {
    try {
      await this._database.save(object);
    } catch (exception: unknown) {
      throw new DatabaseError("Something went wrong saving the ability", exception);
    }
  }

  async saveAll(object: Ability[]): Promise<void> {
    for (var ability of object) {
      await this.save(ability);
    }
  }

  delete(id: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
