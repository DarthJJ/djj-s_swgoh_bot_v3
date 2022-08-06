import { iTable } from './iTable';
import { Player } from '../../models/player.js';
import { LooseObject, SchemaRaw, Trilogy, Model } from 'trilogy';
import { Log } from '../../utils/log.js';
import { container } from 'tsyringe';
import { DatabaseError } from '../../exceptions/databaseError.js';

export class PlayerTable implements iTable<Player>{
    private readonly _database: Trilogy;
    public static tableName = 'players';
    private readonly _dbModel: Model;
    constructor(database: Trilogy) {
        this._database = database;
        this._dbModel = this._database.getModel(PlayerTable.tableName);
    }

    public static creationObject(): SchemaRaw<LooseObject> {
        return {
            allycode: { type: Number, primary: true },
            name: String,
            localePref: { type: String, defaultTo: 'en' },
            discordId: { type: String, defaultTo: -1 }
        }
    };

    async getById(id: string): Promise<Player | null> {
        try {
            const player = await this._dbModel.findOne({ discordId: id });
            if (!player) {
                return null;
            }
            return new Player(player.allycode, player.name, player.localePref, player.discordId);
        } catch (exception: unknown) {
            container.resolve(Log).Logger.error(exception);
            throw new DatabaseError("Something went wrong retrieving the player by discordID.", exception);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this._dbModel.remove({ discordId: id })
        } catch (exception: unknown) {
            container.resolve(Log).Logger.error(exception);
            throw new DatabaseError("Someting went wrong deleting the player account", exception);
        }
    }

    async save(object: Player): Promise<void> {
        try {
            await this._dbModel.updateOrCreate({ allycode: object.allycode }, object.toDbModel());
        } catch (exception: unknown) {
            container.resolve(Log).Logger.error(exception);
            throw new DatabaseError("Something went wrong saving a player: " + object, exception);
        }
    }

}