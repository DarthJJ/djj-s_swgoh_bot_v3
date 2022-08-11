import { Serializable } from "../modelHelpers/serializable.js";
import { Entity, Column, PrimaryColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Character } from "./character.js";
import { Ship } from "./ship.js";

@Entity({ name: "ability" })
export class Ability extends Serializable {
  @PrimaryColumn({ name: "baseId" })
  base_id: string;
  @Column({ name: "name" })
  name: string;
  @Column({ name: "image" })
  image: string;
  @Column({ name: "url", nullable: true })
  url: string;
  @Column({ name: "tierMax" })
  tier_max: number;
  @Column({ name: "isZeta" })
  is_zeta: boolean;
  @Column({ name: "isOmega" })
  is_omega: boolean;
  @Column({ name: "isOmicron" })
  is_omicron: boolean;
  @Column({ name: "description" })
  description: string;
  @Column({ name: "combatType" })
  combat_type: number;
  @Column({ name: "omicronMode", nullable: true })
  omicron_mode: number;
  @Column({ name: "type", nullable: true })
  type: number;
  // @ManyToOne(() => Character, (character) => character.base_id)
  @ManyToOne(() => Character, (character) => character.base_id, { nullable: true })
  //@Column({ name: "characterBaseId", nullable: true, type: "varchar" })
  @JoinColumn({ name: "characterBaseId", foreignKeyConstraintName: "FK_characterBaseId" })
  character_base_id: string | null;
  @ManyToOne(() => Ship, (ship) => ship.base_id, { nullable: true })
  // @Column({ name: "shipBaseId", nullable: true, type: "varchar" })
  @JoinColumn({ name: "shipBaseId", foreignKeyConstraintName: "FK_shipBaseId" })
  ship_base_id: string | null;
  @Column({ name: "omicronBattleTypes", nullable: true })
  omicronBattleTypes: string;
  omicron_battle_types: string[];

  constructor() {
    super();
    this.omicronBattleTypes = this.omicron_battle_types ? this.omicron_battle_types.join(";") : "";
  }
}
