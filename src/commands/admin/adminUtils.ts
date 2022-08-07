import { ChannelType, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { Admin, CommandEnabled, CountryCode, PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { injectable } from "tsyringe";
import { DatabaseManager } from "../../database/databaseManager.js";
import { I18NResolver } from "../../i18n/I18nResolver.js";
import { Config } from "../../utils/config.js";
import { Category, Description } from "@discordx/utilities";
import { MessageCodes } from "../../i18n/languages/MessageCodes.js";

@Discord()
@injectable()
@Category("Admin commands")
export class AdminUtils {
  private _database: DatabaseManager;
  private _i18n: I18NResolver;
  private _config: Config;
  constructor(database: DatabaseManager, i18n: I18NResolver, config: Config) {
    this._database = database;
    this._i18n = i18n;
    this._config = config;
  }

  @Slash()
  @Guard(CommandEnabled, PlayerRegistered, Admin, CountryCode)
  @Description("Amount of messages to delete")
  async purge(
    @SlashOption("amount")
    amount: number,
    interaction: CommandInteraction,
    guardData: { countryCode: string }
  ): Promise<void> {
    if (amount > this._config.MAX_PURGE_AMOUNT) {
      interaction.reply(this._i18n.getTranslation(guardData.countryCode, MessageCodes.PURGE_MAX_EXCEEDED) + this._config.MAX_PURGE_AMOUNT);
      return;
    }
    if (interaction.channel?.type !== ChannelType.GuildText) {
      interaction.reply(this._i18n.getTranslation(guardData.countryCode, MessageCodes.PURGE_WRONG_CHANNEL_TYPE));
      return;
    }
    const messages = await interaction.channel?.messages.fetch({
      limit: amount,
    });

    if (!interaction.deferred) {
      await interaction.deferReply({ ephemeral: false });
    }
    await interaction.editReply(this._i18n.getTranslations(guardData.countryCode, MessageCodes.PURGE_STARTED, MessageCodes.MESSAGE_SELF_DELETE_3_SEC));
    if (messages && messages.size > 1) {
      await interaction.channel?.bulkDelete(messages, true);
      interaction.editReply(this._i18n.getTranslations(guardData.countryCode, MessageCodes.PURGE_FINISHED, MessageCodes.MESSAGE_SELF_DELETE_3_SEC));
      setTimeout(() => interaction.deleteReply(), 3000);
    } else {
      interaction.editReply(this._i18n.getTranslations(guardData.countryCode, MessageCodes.PURGE_NOTHING, MessageCodes.MESSAGE_SELF_DELETE_3_SEC));
      setTimeout(() => interaction.deleteReply(), 3000);
    }
  }
}
