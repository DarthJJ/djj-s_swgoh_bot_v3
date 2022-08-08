import { iTable } from "./iTable.js";
import { Ability } from "../../models/ability.js";
import { container } from "tsyringe";
import { Log } from "../../utils/log.js";
import { DatabaseError } from "../../exceptions/databaseError.js";
import { stringify } from "querystring";
import { DatabaseManager } from "../databaseManager.js";

export class AbilityTable {
  // implements iTable<Ability> {
  // private readonly _database: DatabaseManager;
  // public static tableName = "ability";
  // private readonly _abilityModel: Model;
  // constructor(database: DatabaseManager) {
  //   this._database = database;
  //   this._abilityModel = this._database.getModel(AbilityTable.tableName);
  // }
  // public static abilityTableSQL(): SchemaRaw<LooseObject> {
  //   return {
  //     baseId: { type: String, primary: true },
  //     name: { type: String, unique: true },
  //     image: { type: String, unique: true },
  //     url: { type: String, unique: true },
  //     tierMax: { type: Number, notNullable: true },
  //     isZeta: { type: Boolean, notNullable: true },
  //     isOmega: { type: Boolean, notNullable: true },
  //     isOmicron: { type: Boolean, notNullable: true },
  //     description: { type: String, notNullable: true },
  //     combatType: { type: Number, notNullable: true },
  //     omicronMode: { type: Number, notNullable: true },
  //     type: { type: Number, notNullable: true },
  //     characterBaseId: { type: String },
  //     shipBaseId: { type: String },
  //     omicronBattleTypes: { type: String },
  //   };
  // }
  // async getById(id: string | number): Promise<Ability | null> {
  //   throw new Error("Method not implemented.");
  // }
  // async save(object: Ability): Promise<void> {
  //   try {
  //     await this._abilityModel.updateOrCreate({ base_id: object.base_id }, object.toDbModel());
  //   } catch (exception: unknown) {
  //     container.resolve(Log).Logger.error(exception);
  //     throw new DatabaseError("Something went wrong saving the ability: " + object, exception);
  //   }
  // }
  // async delete(id: string | number): Promise<void> {
  //   throw new Error("Method not implemented.");
  // }
}
