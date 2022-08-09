import { Allycode } from "./allycode.js";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

@Entity({ name: "player" })
export class Player {
  @PrimaryColumn({ name: "discordId" })
  public discordId: string;
  @OneToMany(() => Allycode, (allycode) => allycode.discordId, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  public allycodes: Allycode[];
  @Column({ name: "name" })
  public name: string;
  @Column({ name: "localePref" })
  public localePref: string;

  constructor(discordId: string, name: string, localePref: string, allycodes: Allycode[]) {
    this.allycodes = allycodes;
    this.name = name;
    this.localePref = localePref;
    this.discordId = discordId ? discordId : "-1";
  }
}
