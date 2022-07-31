import { singleton } from "tsyringe";
import { connect, Trilogy } from 'trilogy';
import { DatabaseCreation as dbCreate } from "./databaseCreation.js";
import path from "path";
import { Config } from "../utils/config.js";
import { PlayerTable } from './tables/playerTable.js';

@singleton()
export class DatabaseManager {
    private database: Trilogy;
    private players: PlayerTable;
    constructor(config: Config) {
        this.connectDb(config.DEV_MODE);
        this.recreateDb(config.RECREATE_DB);
        this.initTables();
    }

    private initTables() {
        this.players = new PlayerTable(this.database);
    }

    private recreateDb(RECREATE_DB: boolean) {
        if (RECREATE_DB) {
            new dbCreate().execute(this.database);
        }
    }

    private connectDb(DEV_MODE: boolean) {
        var dbName: string;
        if (DEV_MODE) {
            dbName = "./database_dev.db";
        } else {
            dbName = "./database.db";
        }
        this.database = connect(dbName, {
            dir: path.resolve('./')
        });
    }
}