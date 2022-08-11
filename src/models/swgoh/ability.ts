import { Serializable } from "../modelHelpers/serializable.js";
import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Character } from "./character.js";

@Entity({ name: "ability" })
export class Ability extends Serializable {
  @PrimaryColumn({ name: "baseId" })
  base_id: string;
  @Column({ name: "name" })
  name: string;
  @Column({ name: "image" })
  image: string;
  @Column({ name: "url" })
  url: string;
  @Column({ name: "tierMax" })
  tier_max: number;
  @Column({ name: "isZeta" })
  is_zeta: boolean;
  @Column({ name: "isOmega" })
  is_omega: boolean;
  @Column({ name: "isOmicron" })
  is_omicron: boolean;
  @Column({ name: "description`" })
  description: string;
  @Column({ name: "combatType" })
  combat_type: number;
  @Column({ name: "omicronMode" })
  omicron_mode: number;
  @Column({ name: "type" })
  type: number;
  @ManyToOne(() => Character, (character) => character.base_id)
  @Column({ name: "characterBaseId", nullable: true, type: "varchar" })
  character_base_id: string | null;
  @Column({ name: "shipBaseId", nullable: true, type: "varchar" })
  ship_base_id: string | null;
  @Column({ name: "omicronBattleTypes", nullable: true })
  omicronBattleTypes: string;
  omicron_battle_types: string[];

  constructor() {
    super();
    this.omicronBattleTypes = this.omicron_battle_types ? this.omicron_battle_types.join(";") : "";
  }
}
