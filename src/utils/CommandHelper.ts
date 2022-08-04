import { ButtonInteraction, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { DatabaseManager } from '../database/databaseManager.js';
import { container } from 'tsyringe';
import { I18NResolver } from "../i18n/I18nResolver.js";
import { Config } from "./config.js";

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
        if (interaction.member?.user.id === container.resolve(Config).BOT_ADMIN_ID) {
            interaction.editReply("```" + exception + "```");
            return;
        }
        await interaction.editReply('An error occurred, please try again or contact the bot dev.');

    }
}

export async function botResponse(interaction: interactionType, localePref: string, message: number[]): Promise<void> {
    const i18n = container.resolve(I18NResolver);
    await interaction.editReply(i18n.getTranslations(localePref, ...message));
}
/**
 * 
 * type interactionType = CommandInteraction | ButtonInteraction | SelectMenuInteraction | UserContextMenuInteraction | MessageContextMenuInteraction | ModalSubmitInteraction;
type textReply = (interaction: interactionType, ...args: any) => Promise<string | { content: string, components?: MessageActionRow[] }>;
export async function handleInteraction(func: textReply, interaction: interactionType, ...args: any) {
  try {
    if (!interaction?.deferred) {
      await interaction.deferReply({ ephemeral: true, fetchReply: true });
    }

    let reply: string | { content, components?};
    reply = await func.call(this, interaction, ...args);

    if (typeof reply === 'string') {
      return interaction.editReply({
        content: reply as string,
        components: []
      });
    } else {
      if (reply?.components) {
        return interaction.editReply(reply);
      } else {
        return interaction.editReply({
          content: reply.content,
          components: []
        });
      }
    }
  } catch (e) {
    return handleException(e, interaction);
  }
}

/**
 * Modals cannot be sent to an interaction with a defered reply. So dupe methods
 
type modalReply = (interaction: interactionType, ...args: any) => Promise<Modal>;
export async function handleModalInteraction(func: modalReply, interaction: interactionType, ...args: any) {
  try {
    if (interaction instanceof ModalSubmitInteraction) {
      throw new Error(`Tried opening a modal from a modal interaction ${interaction.customId}`);
    } else {
      let reply = await func.call(this, interaction, ...args);

      return interaction.showModal(reply);
    }
  } catch (e) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });
    return handleException(e, interaction);
  }
}

﻿
 * 
 */