import { Serializable } from "./modelHelpers/serializable.js";

export class Ability extends Serializable {
  private _base_id: string;
  private _name: string;
  private _image: string;
  private _url: string;
  private _tier_max: number;
  private _is_zeta: boolean;
  private _is_omega: boolean;
  private _is_omicron: boolean;
  private _description: string;
  private _combat_type: number;
  private _omicron_mode: number;
  private _type: number;
  private _character_base_id: string | null;
  private _ship_base_id: string | null;
  private _omicron_battle_types: string[];

  public get base_id(): string {
    return this._base_id;
  }

  public set base_id(base_id: string) {
    this._base_id = base_id;
  }

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get image(): string {
    return this._image;
  }

  public set image(image: string) {
    this._image = image;
  }

  public get url(): string {
    return this._url;
  }

  public set url(url: string) {
    this._url = url;
  }

  public get tier_max(): number {
    return this._tier_max;
  }

  public set tier_max(tier_max: number) {
    this._tier_max = tier_max;
  }

  public get is_zeta(): boolean {
    return this._is_zeta;
  }

  public set is_zeta(is_zeta: boolean) {
    this._is_zeta = is_zeta;
  }

  public get is_omega(): boolean {
    return this._is_omega;
  }

  public set is_omega(is_omega: boolean) {
    this._is_omega = is_omega;
  }

  public get is_omicron(): boolean {
    return this._is_omicron;
  }

  public set is_omicron(is_omicron: boolean) {
    this._is_omicron = is_omicron;
  }

  public get description(): string {
    return this._description;
  }

  public set description(description: string) {
    this._description = description;
  }

  public get combat_type(): number {
    return this._combat_type;
  }

  public set combat_type(combat_type: number) {
    this._combat_type = combat_type;
  }

  public get omicron_mode(): number {
    return this._omicron_mode;
  }

  public set omicron_mode(omicron_mode: number) {
    this._omicron_mode = omicron_mode;
  }

  public get type(): number {
    return this._type;
  }

  public set type(type: number) {
    this._type = type;
  }

  public get character_base_id(): string {
    return this._character_base_id!;
  }

  public set character_base_id(character_base_id: string) {
    this._character_base_id = character_base_id;
  }

  public get ship_base_id(): string {
    return this._ship_base_id!;
  }

  public set ship_base_id(ship_base_id: string) {
    this._ship_base_id = ship_base_id;
  }

  public get omicron_battle_types(): string[] {
    return this._omicron_battle_types;
  }

  public set omicron_battle_types(omicron_battle_types: string[]) {
    this._omicron_battle_types = omicron_battle_types;
  }

  toDbModel(): object {
    return {
      baseId: this._base_id,
      name: this._name,
      image: this._image,
      url: this._url,
      tierMax: this._tier_max,
      isZeta: this._is_zeta,
      isOmega: this._is_omega,
      isOmicron: this._is_omicron,
      description: this._description,
      combatType: this._combat_type,
      omicronMode: this._omicron_mode,
      type: this._type,
      characterBaseId: this._character_base_id,
      shipBaseId: this._ship_base_id,
      omicronBattleTypes: this._omicron_battle_types ? this._omicron_battle_types.join(";") : this._omicron_battle_types,
    };
  }
}
