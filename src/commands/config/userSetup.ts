/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category } from "@discordx/utilities";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, MessageActionRowComponentBuilder } from "discord.js";
import { ButtonComponent, Client, Discord, Guard, Slash, SlashChoice, SlashOption } from "discordx";
import { injectable } from "tsyringe";

import { DatabaseManager } from "../../database/databaseManager.js";
import { PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { availableTranslations, I18NResolver } from "../../i18n/I18nResolver.js";
import { MessageCodes } from "../../i18n/languages/MessageCodes.js";
import { Allycode } from "../../models/allycode.js";
import { User } from "../../models/user.js";
import { executeCommand, interactionType } from "../../utils/CommandHelper.js";
import { Config } from "../../utils/config.js";
import { CommandList } from "../metaData/commandList.js";

@Discord()
@injectable()
export class UserSetup {
  private _config: Config;
  private _i18n: I18NResolver;
  constructor(config: Config, i18n: I18NResolver) {
    this._config = config;
    this._i18n = i18n;
  }

  @Slash({ name: CommandList.REGISTER })
  @Category("UserSetup")
  @Guard()
  async register(
    @SlashOption({ name: "allycode", description: "Your SWGOH allycode, format <XXXXXXXXX>", required: true, type: ApplicationCommandOptionType.Number, minValue: 100000000, maxValue: 1000000000 })
    allycode: number,

    @SlashChoice(...(Object.keys(availableTranslations) as Array<keyof typeof availableTranslations>).map((key) => ({ name: key, value: availableTranslations[key] })))
    @SlashOption({ name: "language", description: "If you want a different language than English", required: false, type: ApplicationCommandOptionType.String })
    language: string,
    interaction: CommandInteraction,
    client: Client,
    guardData: object
  ): Promise<void> {
    executeCommand(this.registerImpl, interaction, true, allycode, language ? language : this._config.DEFAULT_LOCALE_PREF);
  }

  @Slash({ name: CommandList.CHANGE_LANGEUAGE_PREF })
  @Category("UserSetup")
  @Guard(PlayerRegistered)
  async changeLanguage(
    @SlashChoice(...(Object.keys(availableTranslations) as Array<keyof typeof availableTranslations>).map((key) => ({ name: key, value: availableTranslations[key] })))
    @SlashOption({ name: "language", description: "If you want a different language than English", required: true, type: ApplicationCommandOptionType.String })
    language: string,
    interaction: CommandInteraction,
    client: Client,
    guardData: { player: User }
  ): Promise<void> {
    executeCommand(this.changeLanguageImpl, interaction, true, guardData.player, language);
  }
  @Slash({ name: CommandList.DELETE_ACCOUNT })
  @Category("UserSetup")
  @Guard(PlayerRegistered)
  async deleteAccount(interaction: CommandInteraction, client: Client, guardData: { player: User }): Promise<void> {
    await interaction.deferReply();
    const confirmButton = new ButtonBuilder()
      .setLabel(this._i18n.getTranslation(guardData.player.localePref, MessageCodes.REQUEST_CONFIRM))
      .setStyle(ButtonStyle.Danger)
      .setCustomId("confirm-account-deletion");
    const cancelButton = new ButtonBuilder()
      .setLabel(this._i18n.getTranslation(guardData.player.localePref, MessageCodes.REQUEST_CANCEL))
      .setStyle(ButtonStyle.Success)
      .setCustomId("cancel-account-deletion");
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton);
    interaction.editReply({
      components: [row],
      content: this._i18n.getTranslation(guardData.player.localePref, MessageCodes.REQUEST_ARE_YOU_SURE),
    });
  }

  @ButtonComponent({ id: "confirm-account-deletion" })
  @Guard(PlayerRegistered)
  async confirmAccountDeletion(interaction: ButtonInteraction, client: Client, guardData: { player: User }): Promise<void> {
    await interaction.message.edit({
      components: [],
      content: this._i18n.getTranslation(guardData.player.localePref, MessageCodes.PLEASE_WAIT),
    });
    executeCommand(this.deleteAccountImpl, interaction, true, guardData.player);
  }

  @ButtonComponent({ id: "cancel-account-deletion" })
  @Guard(PlayerRegistered)
  async cancelAccountDeletion(interaction: ButtonInteraction, client: Client, guardData: { player: User }): Promise<void> {
    await await interaction.message.edit({
      components: [],
      content: this._i18n.getTranslation(guardData.player.localePref, MessageCodes.REQUEST_CANCELLED),
    });
  }

  async deleteAccountImpl(interaction: interactionType, database: DatabaseManager, player: User): Promise<number[]> {
    await database.players.delete(player.discordId);
    return [MessageCodes.DELETE_ACCOUNT_FINISHED];
  }

  async changeLanguageImpl(interction: interactionType, database: DatabaseManager, player: User, languagePref: string): Promise<number[]> {
    player.localePref = languagePref;
    await database.players.save(player);
    return [MessageCodes.LANGUAGE_PREF_UPDATED, MessageCodes.ENJOY_USING_BOT];
  }

  async registerImpl(interaction: interactionType, database: DatabaseManager, allycode: number, languagePref: string): Promise<number[]> {
    let player = await database.players.getById(interaction.member?.user.id!);
    if (player) {
      return [MessageCodes.REGISTER_ALREADY_DONE, MessageCodes.ENJOY_USING_BOT];
    }
    player = new User(interaction.member?.user.id!, interaction.user.username, languagePref, [new Allycode(allycode, interaction.member?.user.id!, true)]);
    await database.players.save(player);
    return [MessageCodes.REGISTER_FINSIED, MessageCodes.ENJOY_USING_BOT];
  }
}
