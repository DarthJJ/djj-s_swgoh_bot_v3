import { iTable } from './iTable';
import { Player } from '../../models/player';
import { LooseObject, SchemaRaw, Trilogy, Model } from 'trilogy';

export class PlayerTable implements iTable<Player>{
    private readonly _database: Trilogy;
    public static tableName = 'players';
    dbModel: Model;
    constructor(database: Trilogy) {
        this._database = database;
        this.dbModel = this._database.getModel(PlayerTable.tableName);
    }

    public static creationObject(): SchemaRaw<LooseObject> {
        return {
            allycode: { type: Number, primary: true },
            name: String,
            localePref: { type: String, defaultTo: 'en' }
        }
    };

    getById(id: Number): Player {
        throw new Error('Method not implemented.');
    }

    save(object: Player) {
        this.dbModel.create(object.toDbModel());
    }

}