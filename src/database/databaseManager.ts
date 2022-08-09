import { singleton } from 'tsyringe';
import { DataSource } from 'typeorm';

import { Ability } from '../models/ability.js';
import { Allycode } from '../models/allycode.js';
import { Player } from '../models/player.js';
import { Config } from '../utils/config.js';
import { AbilityDao } from './daos/abilityDao.js';
import { PlayerDao } from './daos/playerDao.js';

@singleton()
export class DatabaseManager {
  private database: DataSource;
  private readonly entities = [Player, Allycode, Ability];
  private playerDao: PlayerDao;
  private abilityDao: AbilityDao;

  constructor(config: Config) {
    this.initDb(config.DEV_MODE, config.RECREATE_DB, config.FILL_TEST_DATA);
  }

  public get players(): PlayerDao {
    return this.playerDao;
  }

  public get abilities(): AbilityDao {
    return this.abilityDao;
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
    this.abilityDao = new AbilityDao(this.database.getRepository(Ability));
    if (FILL_TEST_DATA) {
      var player = new Player("405842805441822721", "Darth JarJar", "en", [new Allycode(123123123, "405842805441822721", true)]);
      await this.players.save(player);
    }
  }
}
