import { iTable } from './iTable';
import { Player } from '../../models/player.js';
import { LooseObject, SchemaRaw, Trilogy, Model } from 'trilogy';
import { Log } from '../../utils/log.js';
import { container } from 'tsyringe';
import { DatabaseError } from '../../exceptions/databaseError.js';
import { Allycode } from '../../models/allycode.js';

export class PlayerTable implements iTable<Player>{
    private readonly _database: Trilogy;
    public static playerTableName = 'players';
    public static allycodeTableName = "allycode";
    private readonly _playerModel: Model;
    private readonly _allycodeModel: Model;
    constructor(database: Trilogy) {
        this._database = database;
        this._playerModel = this._database.getModel(PlayerTable.playerTableName);
        this._allycodeModel = this._database.getModel(PlayerTable.allycodeTableName);
    }

    public static playerTableSQL(): SchemaRaw<LooseObject> {
        return {
            discordId: { type: String, primary: true },
            name: { type: String, notNullable: true },
            localePref: { type: String, defaultTo: 'en' },
        }
    };

    public static allycodePlayerTableSQL(): SchemaRaw<LooseObject> {
        return {
            discordId: { type: String, unique: true },
            allycode: { type: Number, unique: true },
            isMain: { type: Boolean, notNullable: true }
        }
    }

    async getById(id: string): Promise<Player | null> {
        try {
            const player = await this._playerModel.findOne({ discordId: id });
            if (!player) {
                return null;
            }
            const allycodes = await this._allycodeModel.find({ discordId: id });
            if (!allycodes) {
                return null;
            }
            const mappedAllycodes = allycodes.map((allycode) => {
                return new Allycode(allycode[0], allycode[1], allycode[2]);
            })
            return new Player(player.discordId, player.name, player.localePref, mappedAllycodes);
        } catch (exception: unknown) {
            container.resolve(Log).Logger.error(exception);
            throw new DatabaseError("Something went wrong retrieving the player by discordID.", exception);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this._playerModel.remove({ discordId: id });
            await this._allycodeModel.remove({ discordId: id });
        } catch (exception: unknown) {
            container.resolve(Log).Logger.error(exception);
            throw new DatabaseError("Someting went wrong deleting the player account", exception);
        }
    }

    async save(object: Player): Promise<void> {
        try {
            await this._playerModel.updateOrCreate({ discordId: object.discordId }, object.toDbModel());
            for (let i = 0; i < object.allycode.length; i++) {
                let allycode = object.allycode[i];
                await this._allycodeModel.updateOrCreate({ discordId: object.discordId, allycode: allycode.allycode }, allycode.toDbModel());

            }
        } catch (exception: unknown) {
            container.resolve(Log).Logger.error(exception);
            throw new DatabaseError("Something went wrong saving a player: " + object, exception);
        }
    }

}