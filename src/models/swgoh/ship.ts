import { Serializable } from "../modelHelpers/serializable.js";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Ability } from "./ability.js";

@Entity({ name: "ships" })
export class Ship extends Serializable {
  @PrimaryColumn({ name: "baseId" })
  base_id: string;
  @Column({ name: "name" })
  name: string;
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
  @Column({ name: "alignment" })
  alignment: string;
  //categories: category object
  //abilityclasses: ability classed object
  @Column({ name: "role" })
  role: string;
  @Column({ name: "capitalShip" })
  capital_ship: boolean;
  @Column({ name: "activateShardCount" })
  activate_shard_count: number;
  @OneToMany(() => Ability, (ability) => ability.base_id, { eager: true })
  abilities: Ability[];
}
