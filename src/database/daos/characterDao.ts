import { iTable } from "./iTable.js";
import { Character } from "../../models/swgoh/character.js";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { Repository } from "typeorm";

export class CharacterDao implements iTable<Character> {
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
  async delete(id: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
