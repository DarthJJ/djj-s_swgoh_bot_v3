import { Serializable } from "../modelHelpers/serializable.js";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Ability } from "./ability.js";

@Entity({ name: "character" })
export class Character extends Serializable {
  @PrimaryColumn({ name: "baseId" })
  base_id: string;
  @Column({ name: "name" })
  name: string;
  @Column({ name: "pk" })
  pk: number;
  @Column({ name: "url" })
  url: string;
  @Column({ name: "image" })
  image: string;
  @Column({ name: "power" })
  power: number;
  @Column({ name: "description" })
  description: string;
  @Column({ name: "combatType" })
  combat_type: number;
  //gear_levels: GEARLEVEL object
  @Column({ name: "alignment" })
  alignment: string;
  //categories: category object
  //abilityclasses :ability classes object
  @Column({ name: "role" })
  role: string;
  @Column({ name: "ship", nullable: true })
  ship: string;
  @Column({ name: "shipSlot", nullable: true })
  shipSlot: number;
  @Column({ name: "activateShardCount" })
  activate_shard_count: number;

  @OneToMany(() => Ability, (ability) => ability.character_base_id)
  abilities: Ability[];
}
