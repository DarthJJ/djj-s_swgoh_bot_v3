import { singleton } from "tsyringe";
import { connect, Trilogy } from "trilogy";
import path from "path";
import { Config } from "../utils/config.js";
import { PlayerTable } from "./tables/playerTable.js";
import { Player } from "../models/player.js";
import { Allycode } from "../models/allycode.js";
import { AbilityTable } from "./tables/abilityTable.js";

@singleton()
export class DatabaseManager {
  private _database: Trilogy;
  private _players: PlayerTable;
  private _abilities: AbilityTable;

  constructor(config: Config) {
    this.connectDb(config.DEV_MODE);
    this.initialize(config.RECREATE_DB, config.FILL_TEST_DATA);
  }

  public get players() {
    return this._players;
  }

  private async initialize(RECREATE_DB: boolean, FILL_TEST_DATA: boolean) {
    if (RECREATE_DB) {
      await this.updateDb();
    }
    await this._database.model(
      PlayerTable.playerTableName,
      PlayerTable.playerTableSQL()
    );
    await this._database.model(
      PlayerTable.allycodeTableName,
      PlayerTable.allycodePlayerTableSQL()
    );
    //await this._database.model(AbilityTable.tableName, AbilityTable.abilityTableSQL());
    this.initTables();
    if (FILL_TEST_DATA) {
      await this.fillTestData();
    }
  }

  private initTables() {
    this._players = new PlayerTable(this._database);
  }
  private async updateDb() {
    await this._database.knex.schema.dropTableIfExists(
      PlayerTable.playerTableName
    );
    await this._database.knex.schema.dropTableIfExists(
      PlayerTable.allycodeTableName
    );
    await this._database.knex.schema.dropTableIfExists(AbilityTable.tableName);
  }

  private async fillTestData() {
    const player: Player = new Player(
      "405842805441822721",
      "Darth JarJar",
      "en",
      [new Allycode(393333993, "405842805441822721", true)]
    );
    await this._players.save(player);
  }

  private connectDb(DEV_MODE: boolean) {
    let dbName: string;
    if (DEV_MODE) {
      dbName = "./database_dev.db";
    } else {
      dbName = "./database.db";
    }
    this._database = connect(dbName, {
      dir: path.resolve("./"),
    });
  }
}
