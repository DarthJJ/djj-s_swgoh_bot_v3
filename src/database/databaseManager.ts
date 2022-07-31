import { singleton } from "tsyringe";
import { connect, Trilogy } from 'trilogy';
import path from "path";
import { Config } from "../utils/config.js";
import { PlayerTable } from './tables/playerTable.js';

@singleton()
export class DatabaseManager {
    private _database: Trilogy;
    private _players: PlayerTable;
    constructor(config: Config) {
        this.connectDb(config.DEV_MODE);
        this.initDb();
        this.updateDb(config.RECREATE_DB);
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

    private async updateDb(RECREATE_DB: Boolean) {
        if (!RECREATE_DB) {
            return;
        }
        if (await this._database.hasModel(PlayerTable.tableName)) {
            await this._database.dropModel(PlayerTable.tableName);
        }
        this.initDb();
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