import { singleton } from "tsyringe";
import { DataSource } from "typeorm";

import { Allycode } from "../models/allycode.js";
import { Player } from "../models/player.js";
import { Ability } from "../models/swgoh/ability.js";
import { Character } from "../models/swgoh/character.js";
import { Config } from "../utils/config.js";
import { AbilityDao } from "./daos/abilityDao.js";
import { CharacterDao } from "./daos/characterDao.js";
import { PlayerDao } from "./daos/playerDao.js";

@singleton()
export class DatabaseManager {
  private database: DataSource;
  private readonly entities = [Player, Allycode, Ability, Character];
  private playerDao: PlayerDao;
  private abilityDao: AbilityDao;
  private characterDao: CharacterDao;

  constructor(config: Config) {
    this.initDb(config.DEV_MODE, config.RECREATE_DB, config.FILL_TEST_DATA);
  }

  public async save<T>(object: T): Promise<void> {
    switch (true) {
      case object instanceof Ability:
        return await this.abilityDao.save(object as unknown as Ability);
      case object instanceof Character:
        return await this.characterDao.save(object as unknown as Character);
      case object instanceof Player:
        return await this.playerDao.save(object as unknown as Player);
    }
  }

  public get players(): PlayerDao {
    return this.playerDao;
  }

  public get abilities(): AbilityDao {
    return this.abilityDao;
  }

  public get character(): CharacterDao {
    return this.characterDao;
  }

  private initDaos() {
    this.playerDao = new PlayerDao(this.database.getRepository(Player));
    this.abilityDao = new AbilityDao(this.database.getRepository(Ability));
    this.characterDao = new CharacterDao(this.database.getRepository(Character));
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
      logging: ["error", "warn"],
    });
    await this.database.initialize().catch((error) => console.error(error));
    this.initDaos();
    if (FILL_TEST_DATA) {
      var player = new Player("405842805441822721", "Darth JarJar", "en", [new Allycode(123123123, "405842805441822721", true)]);
      await this.players.save(player);
    }
  }
}
