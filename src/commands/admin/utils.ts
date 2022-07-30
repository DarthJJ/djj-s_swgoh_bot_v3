import { ChannelType, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { Admin, CountryCode } from "../../guard/commandGuard.js";
import { I18NResolver as i18n } from "../../i18n/18nResolver.js"
import { injectable } from "tsyringe";
import { DatabaseManager } from "../../database/databaseManager.js";

@Discord()
@injectable()
export class AdminUtils {
    private _database: DatabaseManager;
    constructor(private database: DatabaseManager) {
        this._database = database;
    }

    @Slash()
    @Guard(Admin, CountryCode)
    async purge(
        @SlashOption("amount", { description: "Amount of messages to delete" })
        amount: number,
        interaction: CommandInteraction,
        guardData: { countryCode: string }
    ): Promise<void> {
        if (interaction.channel?.type === ChannelType.GuildText) {
            let messages = await interaction.channel?.messages.fetch({ limit: amount });
            await interaction.reply(i18n.getTranslations(guardData.countryCode, i18n.DELETION_STARTED, i18n.MESSAGE_SELF_DELETE_3_SEC))
            if (messages && messages.size > 0) {
                await interaction.channel?.bulkDelete(messages, true);
                interaction.editReply(i18n.getTranslations(guardData.countryCode, i18n.DELETION_FINISHED, i18n.MESSAGE_SELF_DELETE_3_SEC))
                    .then(msg => setTimeout(() => msg.delete(), 3000));
            } else {
                interaction.editReply(i18n.getTranslations(guardData.countryCode, i18n.DELETION_NOTHING, i18n.MESSAGE_SELF_DELETE_3_SEC))
                    .then(msg => setTimeout(() => msg.delete(), 3000));
            }
        } else {
            interaction.reply("This command can only be executed in a Guild Text Channel!")
        }
    }
}