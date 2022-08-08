import { Allycode } from "./allycode.js";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

@Entity({ name: "players" })
export class Player {
  @PrimaryColumn({ name: "discordId" })
  public discordId: string;
  //@OneToMany(type => Allycode)
  public allycode: Allycode[];
  @Column({ name: "name" })
  public name: string;
  @Column({ name: "localePref" })
  public localePref: string;

  constructor(discordId: string, name: string, localePref: string, allycodes?: Allycode[]) {
    this.allycode = allycodes ?? [];
    this.name = name;
    this.localePref = localePref;
    this.discordId = discordId ? discordId : "-1";
  }
}
