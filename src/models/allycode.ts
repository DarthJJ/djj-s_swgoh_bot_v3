import { iModel } from "./iModel.js";

export class Allycode implements iModel {
  private _allycode: number;
  private _discordId: string;
  private _isMain: boolean;

  constructor(allycode: number, discordId: string, isMain: boolean) {
    this._allycode = allycode;
    this._discordId = discordId;
    this._isMain = isMain;
  }

  public get allycode(): number {
    return this._allycode;
  }

  public get discordId(): string {
    return this._discordId;
  }

  public get isMain(): boolean {
    return this._isMain;
  }

  toDbModel(): object {
    return {
      allycode: this._allycode,
      discordId: this._discordId,
      isMain: this._isMain,
    };
  }
}
