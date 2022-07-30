import { singleton } from "tsyringe";
import { connect, Trilogy } from 'trilogy';
import { DatabaseCreation as dbCreate } from "./databaseCreation.js";

@singleton()
export class DatabaseManager {
    private database: Trilogy;
    private databaseName: string;
    constructor() {
        if (process.env.DEV) {
            this.databaseName = "database_dev.db";
        } else {
            this.databaseName = "database.db";
        }
        this.database = connect(this.databaseName, {
            client: 'sql.js'
        });
        if (process.env.RECREATE_DB) {
            new dbCreate().execute(this.database);
        }
    }

    query() {
        return this.database;
    }
}