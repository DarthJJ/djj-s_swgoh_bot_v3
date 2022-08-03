import { singleton } from "tsyringe";
import { connect, Trilogy } from 'trilogy';
import path from "path";
import { Config } from "../utils/config.js";
import { PlayerTable } from './tables/playerTable.js';
import { Player } from "../models/player.js";

@singleton()
export class DatabaseManager {
    private _database: Trilogy;
    private _players: PlayerTable;
    constructor(config: Config) {
        this.connectDb(config.DEV_MODE);
        this.initDb();
        this.updateDb(config.RECREATE_DB, config.FILL_TEST_DATA);
        this.initTables();
    }

    public get players() {
        return this._players;
    }

    private initTables() {
        this._players = new PlayerTable(this._database);
    }

    private async initDb() {
        await this._database.model(PlayerTable.tableName, PlayerTable.creationObject());
    }

    private async updateDb(RECREATE_DB: boolean, FILL_TEST_DATA: boolean) {
        if (!RECREATE_DB) {
            return;
        }
        if (await this._database.hasModel(PlayerTable.tableName)) {
            await this._database.dropModel(PlayerTable.tableName);
        }
        await this.initDb();
        if (FILL_TEST_DATA) {
            this.fillTestData();
        }
    }

    private fillTestData() {
        let player: Player = new Player(393333993, "Darth JarJar", 'en', '405842805441822721');
        this._players.save(player);
    }

    private connectDb(DEV_MODE: boolean) {
        var dbName: string;
        if (DEV_MODE) {
            dbName = "./database_dev.db";
        } else {
            dbName = "./database.db";
        }
        this._database = connect(dbName, {
            dir: path.resolve('./')
        });
    }
}