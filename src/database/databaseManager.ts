import { singleton } from "tsyringe";
import { Config } from "../utils/config.js";
import { PlayerTable } from "./tables/playerTable.js";
import { AbilityTable } from "./tables/abilityTable.js";
import { Knex } from "knex";
import knex from "knex";

@singleton()
export class DatabaseManager {
  //private _database: Trilogy;
  private _players: PlayerTable;
  private _abilities: AbilityTable;
  private knexConfig: Knex.Config;
  private knexInstance: Knex;

  constructor(config: Config) {
    this.connectDb(config.DEV_MODE);
    this.initialize(config.UPDATE_DB, config.RECREATE_DB, config.FILL_TEST_DATA);
  }

  public get players(): PlayerTable {
    return this._players;
  }

  public get abilities(): AbilityTable {
    return this._abilities;
  }

  private initialize(UPDATE_DB: boolean, RECREATE_DB: boolean, FILL_TEST_DATA: boolean) {
    this.knexInstance.schema.createTable(PlayerTable.playerTableName, (table) => {
      table.string("discordId").primary();
      table.string("name").notNullable();
      table.integer("allycode").unique();
    });
  }

  private connectDb(DEV_MODE: boolean) {
    let dbName: string;
    if (DEV_MODE) {
      dbName = "./database_dev.db";
    } else {
      dbName = "./database.db";
    }
    this.knexConfig = {
      client: "sqlite3",
      connection: {
        filename: dbName,
        debug: DEV_MODE,
      },
    };
    this.knexInstance = knex(this.knexConfig);
  }
}
