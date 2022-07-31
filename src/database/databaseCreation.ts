import { Trilogy } from 'trilogy';
import { PlayerTable } from './tables/playerTable.js';
import { Player } from '../models/player.js'
export class DatabaseCreation {
    private _players: PlayerTable;
    private _database: Trilogy;
    async execute(
        database: Trilogy
    ) {
        this._database = database;
        this.deleteDb();
        this.createDb();
        this.initTableModels();
        this.fillTestData();
    }

    private async initTableModels() {
        this._players = new PlayerTable(this._database);
    }

    private async deleteDb() {
        if (await this._database.hasModel(PlayerTable.tableName)) {
            await this._database.dropModel(PlayerTable.tableName);
        }
    }

    private async createDb() {
        await this._database.model(PlayerTable.tableName, PlayerTable.creationObject());
    }

    private fillTestData() {
        var player = new Player(393333992, 'Darth JarJar', 'en');
        this._players.save(player);
    }
}