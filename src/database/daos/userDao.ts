import { iDao } from "./iDao";
import { User } from "../../models/user.js";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { Repository } from "typeorm";

export class UserDao implements iDao<User> {
  private readonly _database: Repository<User>;

  constructor(database: Repository<User>) {
    this._database = database;
  }

  async getById(id: string): Promise<User | null> {
    try {
      const player = await this._database.findOne({
        where: {
          discordId: id,
        },
      });
      if (!player) {
        return null;
      }
      return player;
    } catch (exception: unknown) {
      throw new DatabaseError("Something went wrong retrieving the player by discordID.", exception);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const player = await this.getById(id);
      if (player) {
        await this._database.remove(player);
      }
    } catch (exception: unknown) {
      throw new DatabaseError("Something went wrong saving a player: " + id, exception);
    }
  }

  async save(object: User): Promise<void> {
    try {
      await this._database.save(object);
    } catch (exception: unknown) {
      throw new DatabaseError("Something went wrong saving a player: " + object, exception);
    }
  }

  async saveAll(object: User[]): Promise<void> {
    throw new Error("Not implemented");
  }
}
