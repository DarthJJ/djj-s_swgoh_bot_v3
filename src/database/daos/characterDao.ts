import { Repository } from "typeorm";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { Character } from "../../models/swgoh/character.js";
import { iDao } from "./iDao.js";

export class CharacterDao implements iDao<Character> {
  private readonly _database: Repository<Character>;

  constructor(database: Repository<Character>) {
    this._database = database;
  }
  async getById(id: string | number): Promise<Character | null> {
    throw new Error("Method not implemented.");
  }
  async save(object: Character): Promise<void> {
    try {
      await this._database.save(object);
    } catch (exception: unknown) {
      throw new DatabaseError("Something went wrong saving the character", exception);
    }
  }

  async saveAll(object: Character[]): Promise<void> {
    for (var character of object) {
      await this.save(character);
    }
  }

  async delete(id: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
