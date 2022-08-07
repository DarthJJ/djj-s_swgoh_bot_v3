import { Allycode } from "./allycode.js";
import { iModel } from "./iModel";
export class Player implements iModel {
  private _discordId: string;
  private _allycode: Allycode[];
  private _name: string;
  private _localePref: string;

  constructor(
    discordId: string,
    name: string,
    localePref: string,
    allycodes?: Allycode[]
  ) {
    this._allycode = allycodes ?? [];
    this._name = name;
    this._localePref = localePref;
    this._discordId = discordId ? discordId : "-1";
  }

  public get allycode(): Allycode[] {
    return this._allycode;
  }

  public get name(): string {
    return this._name;
  }

  public get localePref(): string {
    return this._localePref;
  }

  public set localePref(newLocalePref: string) {
    this._localePref = newLocalePref;
  }

  public get discordId(): string {
    return this._discordId;
  }

  public toDbModel(): object {
    return {
      discordId: this._discordId,
      name: this._name,
      localePref: this._localePref,
    };
  }
}
