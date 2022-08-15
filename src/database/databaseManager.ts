import { singleton } from "tsyringe";
import { DataSource } from "typeorm";

import { Allycode } from "../models/allycode.js";
import { User } from "../models/user.js";
import { Ability } from "../models/swgoh/ability.js";
import { Character } from "../models/swgoh/character.js";
import { Ship } from "../models/swgoh/ship.js";
import { Config } from "../utils/config.js";
import { AbilityDao } from "./daos/abilityDao.js";
import { CharacterDao } from "./daos/characterDao.js";
import { UserDao } from "./daos/userDao.js";
import { ShipDao } from "./daos/shipDao.js";

@singleton()
export class DatabaseManager {
  private database: DataSource;
  private readonly entities = [User, Allycode, Ability, Character, Ship];
  private playerDao: UserDao;
  private abilityDao: AbilityDao;
  private characterDao: CharacterDao;
  private shipDao: ShipDao;

  constructor(config: Config) {
    this.initDb(config.DEV_MODE, config.RECREATE_DB, config.FILL_TEST_DATA);
  }

  public get players(): UserDao {
    return this.playerDao;
  }

  public get abilities(): AbilityDao {
    return this.abilityDao;
  }

  public get characters(): CharacterDao {
    return this.characterDao;
  }

  public get ships(): ShipDao {
    return this.shipDao;
  }

  private initDaos() {
    this.playerDao = new UserDao(this.database.getRepository(User));
    this.abilityDao = new AbilityDao(this.database.getRepository(Ability));
    this.characterDao = new CharacterDao(this.database.getRepository(Character));
    this.shipDao = new ShipDao(this.database.getRepository(Ship));
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
      logging: ["error", "warn", "info", "query"],
    });
    await this.database.initialize().catch((error) => console.error(error));
    this.initDaos();
    if (FILL_TEST_DATA) {
      var player = new User("405842805441822721", "Darth JarJar", "en", [new Allycode(123123123, "405842805441822721", true)]);
      await this.playerDao.save(player);
    }
  }
}
