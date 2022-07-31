import { Discord, Guard, Slash, SlashOption } from "discordx";
import { CommandInteraction } from 'discord.js';
import { DatabaseManager as db } from '../../database/databaseManager.js'

@Discord()
export class UserSetup {
    @Slash()
    async register(
        @SlashOption("allycode", { description: "Your SWGOH allycode", required: true })
        allycode: number,
        interaction: CommandInteraction,
        guardData: any
    ): Promise<void> {

    }
}