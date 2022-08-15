import { Entity, JoinTable, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.js";
@Entity({ name: "allycode" })
export class Allycode {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: "allycode" })
  public allycode: number;
  @ManyToOne(() => User, (player) => player.allycodes, {
    onDelete: "CASCADE",
  })
  @JoinTable({
    name: "discordId",
  })
  public discordId: string;
  @Column({
    name: "isMain",
  })
  public isMain: boolean;

  constructor(allycode: number, discordId: string, isMain: boolean) {
    this.allycode = allycode;
    this.discordId = discordId;
    this.isMain = isMain;
  }
}
