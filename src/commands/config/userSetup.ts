/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Discord,
  Client,
  Guard,
  Slash,
  SlashChoice,
  SlashOption,
  ButtonComponent,
} from "discordx";
import {
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonInteraction,
} from "discord.js";
import { DatabaseManager } from "../../database/databaseManager.js";
import { injectable } from "tsyringe";
import { Player } from "../../models/player.js";
import { Config } from "../../utils/config.js";
import { availableTranslations } from "../../i18n/I18nResolver.js";
import { MessageCodes } from "../../i18n/languages/MessageCodes.js";
import { PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { Category } from "@discordx/utilities";
import { CommandList } from "../metaData/commandList.js";
import { executeCommand, interactionType } from "../../utils/commandHelper.js";
import { I18NResolver } from "../../i18n/I18nResolver.js";
import { Allycode } from "../../models/allycode.js";

@Discord()
@injectable()
export class UserSetup {
  constructor(private _config: Config, private _i18n: I18NResolver) {}

  @Slash(CommandList.REGISTER)
  @Category("Profile")
  @Guard()
  async register(
    @SlashOption("allycode", {
      description: "Your SWGOH allycode, format <XXXXXXXXX>",
      required: true,
      type: ApplicationCommandOptionType.Number,
      minValue: 100000000,
      maxValue: 1000000000,
    })
    allycode: number,

    @SlashChoice(
      ...(
        Object.keys(availableTranslations) as Array<
          keyof typeof availableTranslations
        >
      ).map((key) => ({ name: key, value: availableTranslations[key] }))
    )
    @SlashOption("language", {
      description: "If you want a different language than English",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    language: string,
    interaction: CommandInteraction,
    client: Client,
    guardData: object
  ): Promise<void> {
    executeCommand(
      this.registerImpl,
      interaction,
      true,
      allycode,
      language ? language : this._config.DEFAULT_LOCALE_PREF
    );
  }

  @Slash(CommandList.CHANGE_LANGEUAGE_PREF)
  @Category("Profile")
  @Guard(PlayerRegistered)
  async changeLanguage(
    @SlashChoice(
      ...(
        Object.keys(availableTranslations) as Array<
          keyof typeof availableTranslations
        >
      ).map((key) => ({ name: key, value: availableTranslations[key] }))
    )
    @SlashOption("language", {
      description: "If you want a different language than English",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    language: string,
    interaction: CommandInteraction,
    client: Client,
    guardData: { player: Player }
  ): Promise<void> {
    executeCommand(
      this.changeLanguageImpl,
      interaction,
      true,
      guardData.player,
      language
    );
  }
  @Slash(CommandList.DELETE_ACCOUNT)
  @Category("Profile")
  @Guard(PlayerRegistered)
  async deleteAccount(
    interaction: CommandInteraction,
    client: Client,
    guardData: { player: Player }
  ): Promise<void> {
    await interaction.deferReply();
    const confirmButton = new ButtonBuilder()
      .setLabel(
        this._i18n.getTranslation(
          guardData.player.localePref,
          MessageCodes.REQUEST_CONFIRM
        )
      )
      .setStyle(ButtonStyle.Danger)
      .setCustomId("confirm-account-deletion");
    const cancelButton = new ButtonBuilder()
      .setLabel(
        this._i18n.getTranslation(
          guardData.player.localePref,
          MessageCodes.REQUEST_CANCEL
        )
      )
      .setStyle(ButtonStyle.Success)
      .setCustomId("cancel-account-deletion");
    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        confirmButton,
        cancelButton
      );
    interaction.editReply({
      components: [row],
      content: this._i18n.getTranslation(
        guardData.player.localePref,
        MessageCodes.REQUEST_ARE_YOU_SURE
      ),
    });
  }

  @ButtonComponent("confirm-account-deletion")
  @Guard(PlayerRegistered)
  async confirmAccountDeletion(
    interaction: ButtonInteraction,
    client: Client,
    guardData: { player: Player }
  ): Promise<void> {
    await interaction.message.edit({
      components: [],
      content: this._i18n.getTranslation(
        guardData.player.localePref,
        MessageCodes.PLEASE_WAIT
      ),
    });
    executeCommand(this.deleteAccountImpl, interaction, true, guardData.player);
  }

  @ButtonComponent("cancel-account-deletion")
  @Guard(PlayerRegistered)
  async cancelAccountDeletion(
    interaction: ButtonInteraction,
    client: Client,
    guardData: { player: Player }
  ): Promise<void> {
    await await interaction.message.edit({
      components: [],
      content: this._i18n.getTranslation(
        guardData.player.localePref,
        MessageCodes.REQUEST_CANCELLED
      ),
    });
  }

  async deleteAccountImpl(
    interaction: interactionType,
    database: DatabaseManager,
    player: Player
  ): Promise<number[]> {
    console.log("test");
    await database.players.delete(player.discordId);
    return [MessageCodes.DELETE_ACCOUNT_FINISHED];
  }

  async changeLanguageImpl(
    interction: interactionType,
    database: DatabaseManager,
    player: Player,
    languagePref: string
  ): Promise<number[]> {
    player.localePref = languagePref;
    await database.players.save(player);
    return [MessageCodes.LANGUAGE_PREF_UPDATED, MessageCodes.ENJOY_USING_BOT];
  }

  async registerImpl(
    interaction: interactionType,
    database: DatabaseManager,
    allycode: number,
    languagePref: string
  ): Promise<number[]> {
    let player = await database.players.getById(interaction.member?.user.id!);
    if (player) {
      return [MessageCodes.REGISTER_ALREADY_DONE, MessageCodes.ENJOY_USING_BOT];
    }
    player = new Player(
      interaction.member?.user.id!,
      interaction.user.username,
      languagePref,
      [new Allycode(allycode, interaction.member?.user.id!, true)]
    );
    await database.players.save(player);
    return [MessageCodes.REGISTER_FINSIED, MessageCodes.ENJOY_USING_BOT];
  }
}
