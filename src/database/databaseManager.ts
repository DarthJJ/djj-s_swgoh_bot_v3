import { singleton } from "tsyringe";
import { Config } from "../utils/config.js";
import { DataSource, Repository } from "typeorm";
import { Player } from "../models/player.js";
import { PlayerDao } from "./daos/playerDao.js";
import { Allycode } from "../models/allycode.js";

@singleton()
export class DatabaseManager {
  private database: DataSource;
  private readonly entities = [Player, Allycode];
  private playerDao: PlayerDao;

  constructor(config: Config) {
    this.initDb(config.DEV_MODE, config.RECREATE_DB, config.FILL_TEST_DATA);
  }

  public get players(): PlayerDao {
    return this.playerDao;
  }

  private async initDb(DEV_MODE: boolean, RECREATE_DB: boolean, FILL_TEST_DATA: boolean) {
    let dbName: string;
    if (DEV_MODE) {
      dbName = "./database_dev.db";
    } else {
      dbName = "./database.db";
    }
    this.database = new DataSource({
      type: "sqlite",
      entities: this.entities,
      database: dbName,
      dropSchema: RECREATE_DB,
      synchronize: RECREATE_DB,
      logging: true,
    });
    await this.database.initialize().catch((error) => console.error(error));
    this.playerDao = new PlayerDao(this.database.getRepository(Player));
    if (FILL_TEST_DATA) {
      var player = new Player("405842805441822721", "Darth JarJar", "en", [new Allycode(123123123, "405842805441822721", true)]);
      await this.players.save(player);
    }
  }
}
