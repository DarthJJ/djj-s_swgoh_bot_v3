import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction, Interaction } from 'discord.js';
import { DatabaseManager } from '../../database/databaseManager.js'
import { injectable } from 'tsyringe';
import { Player } from '../../models/player.js';
import { Config } from "../../utils/config.js";
import { executeCommand } from "../../utils/CommandHelper.js";
import { interactionType } from "../../utils/CommandHelper.js";
import { availableTranslations } from "../../i18n/I18nResolver.js";
import { MessageCodes } from "../../i18n/languages/MessageCodes.js";


@Discord()
@injectable()
export class UserSetup {

    constructor(private _database: DatabaseManager, private _config: Config) {

    }

    @Slash()
    async register(
        @SlashOption("allycode", {
            description: "Your SWGOH allycode",
            required: true,
            type: ApplicationCommandOptionType.Number,
            minValue: 100000000,
            maxValue: 1000000000,
        })
        allycode: number,

        @SlashChoice(...(Object.keys(availableTranslations) as Array<keyof typeof availableTranslations>).map(key => ({ name: key, value: availableTranslations[key] })))
        @SlashOption("language", {
            description: "If you want a different language than English",
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        language: string,
        interaction: CommandInteraction,
        guardData: any
    ): Promise<void> {
        await executeCommand(this.registerImpl, interaction, true, allycode, language ? language : this._config.DEFAULT_LOCALE_PREF);
    }

    async registerImpl(interaction: interactionType, database: DatabaseManager, allycode: number, languagePref: string): Promise<number[]> {
        let player = await database.players.getByDiscordId(interaction.member?.user.id!);
        if (player) {
            return [MessageCodes.REGISTER_ALREADY_DONE, MessageCodes.ENJOY_USING_BOT];
        }
        player = new Player(allycode, interaction.user.username, languagePref, interaction.user.id);
        await database.players.save(player);
        return [MessageCodes.REGISTER_FINSIED, MessageCodes.ENJOY_USING_BOT];
    }
}