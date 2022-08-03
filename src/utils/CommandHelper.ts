import { ButtonInteraction, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { RegisterError } from "../exceptions/registerError.js";
import { DatabaseManager } from '../database/databaseManager';
import { container } from 'tsyringe';
import { I18NResolver } from '../i18n/I18nResolver';

export type interactionType = CommandInteraction | ButtonInteraction;
type botFunction = (interaction: interactionType, ...args: any) => Promise<number[]>;
type botFunctionWithDb = (interaction: interactionType, database: DatabaseManager, ...args: any) => Promise<number[]>;
export async function executeCommand(func: botFunction | botFunctionWithDb, interaction: interactionType, dbRequired: boolean, ...args: any) {
    try {
        if (!interaction.deferred) {
            await interaction.deferReply({ ephemeral: true, fetchReply: true });
        }
        let result;
        const db = container.resolve(DatabaseManager);
        if (dbRequired) {
            result = await func.call(undefined, interaction, db, ...args);
        } else {
            result = await func.call(undefined, interaction, ...args);
        }
        const player = await db.players.getByDiscordId(interaction.member?.user.id!);
        const localePef = player?.localePref!;

        botResponse(interaction, localePef, result); //to be extended if modals or anything will be sent
    } catch (exception) {
        await interaction.editReply("Error: ```" + exception + "```");//TODO: logging + proper safeguarding for admin 
        if (exception instanceof RegisterError) {
            //Specific command error
        }
    }
}

export async function botResponse(interaction: interactionType, localePref: string, message: number[]): Promise<void> {
    const i18n = container.resolve(I18NResolver);
    await interaction.editReply(i18n.getTranslations(localePref, ...message));
}
/** 
type interactionType = CommandInteraction | ButtonInteraction | UserContextMenuInteraction | MessageContextMenuInteraction | ModalSubmitInteraction;
type botFunction = (interaction: interactionType, ...args: any) => Promise<string | { content: string, components?: MessageActionRow[] } | Modal>;
export async function executeBotCommand(func: botFunction, interaction: interactionType, ...args: any) {
    */