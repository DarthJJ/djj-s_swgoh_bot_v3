/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category, Description } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { Client, Discord, Guard, Slash } from "discordx";
import { container, injectable } from "tsyringe";

import { DatabaseManager } from "../../database/databaseManager.js";
import { Admin, CommandEnabled, CountryCode, PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { I18NResolver } from "../../i18n/I18nResolver.js";
import { MessageCodes } from "../../i18n/languages/MessageCodes.js";
import { Player } from "../../models/player.js";
import { Ability } from "../../models/swgoh/ability.js";
import { Character } from "../../models/swgoh/character.js";
import { Ship } from "../../models/swgoh/ship.js";
import { botResponse, executeCommand, interactionType } from "../../utils/CommandHelper.js";
import { HttpFetcher } from "../../utils/httpFetcher.js";
import { CommandList } from "../metaData/commandList.js";

@Discord()
@injectable()
@Category("SWGOH Update commands")
export class SwgohUpdate {
  private _database: DatabaseManager;
  private _i18n: I18NResolver;

  constructor(database: DatabaseManager, i18n: I18NResolver) {
    this._database = database;
    this._i18n = i18n;
  }

  @Slash(CommandList.UPDATE)
  @Guard(CommandEnabled, PlayerRegistered, Admin, CountryCode)
  @Description("Update static data from swgoh.gg")
  async update(interaction: CommandInteraction, client: Client, guardData: { player: Player }): Promise<void> {
    executeCommand(this.updateImpl, interaction, true, guardData.player);
  }

  private async updateImpl(interaction: interactionType, database: DatabaseManager, player: Player): Promise<number[]> {
    const httpFetcher = container.resolve(HttpFetcher);
    botResponse(interaction, player.localePref, [MessageCodes.START_UPDATE_CHARACTERS]);
    await database.characters.saveAll(await httpFetcher.get<Character>(Character));
    botResponse(interaction, player.localePref, [MessageCodes.START_UPDATE_SHIPS]);
    await database.ships.saveAll(await httpFetcher.get<Ship>(Ship));
    botResponse(interaction, player.localePref, [MessageCodes.START_UPDATE_ABILITIES]);
    await database.abilities.saveAll(await httpFetcher.get<Ability>(Ability));
    return [MessageCodes.UPDATE_FINISHED];
  }
}
