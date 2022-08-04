import { Discord, Client, Guard, Slash, SlashChoice, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction, Interaction } from 'discord.js';
import { DatabaseManager } from '../../database/databaseManager.js'
import { injectable } from 'tsyringe';
import { Player } from '../../models/player.js';
import { Config } from "../../utils/config.js";
import { availableTranslations } from "../../i18n/I18nResolver.js";
import { MessageCodes } from "../../i18n/languages/MessageCodes.js";
import { executeCommand, interactionType } from "../../utils/commandHelper.js";
import { CommandEnabled, PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { Category } from "@discordx/utilities";
import { CommandList } from "../metaData/commandList.js"



@Discord()
@injectable()
export class UserSetup {

    constructor(private _config: Config) {

    }

    @Slash(CommandList.REGISTER)
    @Category("Profile")
    @Guard(CommandEnabled)
    async register(
        @SlashOption("allycode", {
            description: "Your SWGOH allycode, format <XXXXXXXXX>",
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
        client: Client,
        guardData: any
    ): Promise<void> {
        executeCommand(this.registerImpl, interaction, true, allycode, language ? language : this._config.DEFAULT_LOCALE_PREF);
    }

    @Slash(CommandList.CHANGE_LANGEUAGE_PREF)
    @Category("Profile")
    @Guard(CommandEnabled, PlayerRegistered)
    async changeLanguage(
        @SlashChoice(...(Object.keys(availableTranslations) as Array<keyof typeof availableTranslations>).map(key => ({ name: key, value: availableTranslations[key] })))
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
        executeCommand(this.changeLanguageImpl, interaction, true, guardData.player, language);
    }

    async changeLanguageImpl(interction: interactionType, database: DatabaseManager, player: Player, languagePref: string): Promise<number[]> {
        player.localePref = languagePref;
        await database.players.save(player);
        return [MessageCodes.LANGUAGE_PREF_UPDATED, MessageCodes.ENJOY_USING_BOT];
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