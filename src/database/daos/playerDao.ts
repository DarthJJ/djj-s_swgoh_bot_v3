import { iTable } from "./iTable";
import { Player } from "../../models/player.js";
import { Log } from "../../utils/log.js";
import { container } from "tsyringe";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { Allycode } from "../../models/allycode.js";
import { DatabaseManager } from "../databaseManager.js";
import { Repository } from "typeorm";

export class PlayerDao implements iTable<Player> {
  private readonly _database: Repository<Player>;
  public static playerTableName = "players";
  public static allycodeTableName = "allycode";
  constructor(database: Repository<Player>) {
    this._database = database;
  }

  async getById(id: string): Promise<Player | null> {
    try {
      const player = await this._database.findOneBy({
        discordId: id,
      });
      if (!player) {
        return null;
      }
      return player;
    } catch (exception: unknown) {
      container.resolve(Log).Logger.error(exception);
      throw new DatabaseError("Something went wrong retrieving the player by discordID.", exception);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const player = await this._database.findOneBy({
        discordId: id,
      });
      if (player) {
        await this._database.remove(player);
      }
    } catch (exception: unknown) {
      container.resolve(Log).Logger.error(exception);
      throw new DatabaseError("Something went wrong saving a player: " + id, exception);
    }
  }

  async save(object: Player): Promise<void> {
    try {
      await this._database.save(object);
    } catch (exception: unknown) {
      container.resolve(Log).Logger.error(exception);
      throw new DatabaseError("Something went wrong saving a player: " + object, exception);
    }
  }
}
