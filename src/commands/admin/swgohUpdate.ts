/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category, Description } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Client, Discord, Guard, Slash, SlashChoice, SlashOption } from "discordx";
import { container, injectable } from "tsyringe";

import { DatabaseManager } from "../../database/databaseManager.js";
import { Admin, CommandEnabled, CountryCode, PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { I18NResolver } from "../../i18n/I18nResolver.js";
import { MessageCodes } from "../../i18n/languages/MessageCodes.js";
import { Character } from "../../models/swgoh/character.js";
import { executeCommand, interactionType } from "../../utils/CommandHelper.js";
import { HttpFetcher } from "../../utils/httpFetcher.js";
import { CommandList } from "../metaData/commandList.js";
import { Ability } from "../../models/swgoh/ability.js";

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
  async update(
    @SlashChoice(
      ...[
        { name: "abilities", value: "abilities" },
        { name: "characterData", value: "characterData" },
      ]
    )
    @SlashOption("to_update", {
      description: "Choose what to update",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    to_update: string,
    interaction: CommandInteraction,
    client: Client,
    guardData: object
  ): Promise<void> {
    executeCommand(this.updateImpl, interaction, true, to_update);
  }

  private async updateImpl(interaction: interactionType, database: DatabaseManager, toUpdate: string): Promise<number[]> {
    var data;
    var message: number[];
    switch (toUpdate) {
      case "abilities":
        data = await container.resolve(HttpFetcher).get<Ability>(Ability);
        message = [MessageCodes.ABILITY_UPDATE_FINISHED];
        break;
      case "characterData":
        data = await container.resolve(HttpFetcher).get<Character>(Character);
        message = [MessageCodes.CHARACTER_UPDATE_FINISHED];
        break;
      default:
        return [MessageCodes.GENERIC_ERROR];
    }
    for (var object of data) {
      await database.save<typeof object>(object);
    }
    return message;
  }
}
