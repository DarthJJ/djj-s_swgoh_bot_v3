import { iTable } from "./iTable.js";
import { Ability } from "../../models/swgoh/ability.js";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { Repository } from "typeorm";

export class AbilityDao implements iTable<Ability> {
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
  delete(id: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
