import { iTable } from "./iTable.js";
import { LooseObject, Model, SchemaRaw, Trilogy } from "trilogy";
import { Ability } from "../../models/ability.js";

export class AbilityTable implements iTable<Ability> {
  private readonly _database: Trilogy;
  public static tableName = "Ability";
  private readonly _abilityModel: Model;

  constructor(database: Trilogy) {
    this._database = database;
    this._abilityModel = this._database.getModel(AbilityTable.tableName);
  }

  public static abilityTableSQL(): SchemaRaw<LooseObject> {
    return {};
  }

  getById(id: string | number): Promise<Ability | null> {
    throw new Error("Method not implemented.");
  }
  save(object: Ability): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string | number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
