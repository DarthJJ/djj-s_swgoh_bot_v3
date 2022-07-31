import { iModel } from './iModel';
export class Player implements iModel {
    private _allycode: number;
    private _name: string;
    private _localePref: string;

    constructor(allycode: number, name: string, localePref: string) {
        this._allycode = allycode;
        this._name = name;
        this._localePref = localePref;
    }

    public get allycode() {
        return this._allycode;
    }

    public get name() {
        return this._name;
    }

    public get localePref() {
        return this._localePref;
    }

    public toDbModel() {
        return {
            allycode: this._allycode,
            name: this._name,
            localePref: this._localePref
        }
    }
}