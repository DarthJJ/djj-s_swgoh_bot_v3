/* eslint-disable @typescript-eslint/no-unused-vars */

import { Category, Description } from "@discordx/utilities";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashOption, Client } from "discordx";
import { injectable } from "tsyringe";
import { DatabaseManager } from "../../database/databaseManager.js";
import { CommandEnabled, CountryCode, PlayerRegistered, Admin } from "../../guard/genericCommandGuard.js";
import { I18NResolver } from "../../i18n/I18nResolver";
import { executeCommand, interactionType } from "../../utils/commandHelper.js";
import { HttpFetcher } from "../../utils/httpFetcher.js";
import { CommandList } from "../metaData/commandList.js";

@Discord()
@injectable()
@Category("SWGOH Update commands")
export class SwgohUpdate {
  private _database: DatabaseManager;
  private _i18n: I18NResolver;
  private _httpFetcher: HttpFetcher;

  constructor(database: DatabaseManager, i18n: I18NResolver, httpFetcher: HttpFetcher) {
    this._database = database;
    this._i18n = i18n;
    this._httpFetcher = httpFetcher;
  }

  @Slash(CommandList.UPDATE)
  @Guard(CommandEnabled, PlayerRegistered, Admin, CountryCode)
  @Description("Update static data from swgoh.gg")
  async update(
    @SlashChoice(...[{ name: "abilities", value: "abilities" }])
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

  async updateImpl(interaction: interactionType, database: DatabaseManager, toUpdate: string): Promise<number[]> {
    this._httpFetcher.getAbilities().then((test) => {
      console.log(test);
    });
    return [];
  }
}
