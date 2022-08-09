/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgsOf, GuardFunction } from "discordx";
import { container } from "tsyringe";
import { Config } from "../utils/config.js";
import { CommandSecurityList } from "../commands/metaData/commandSecurityList.js";
import { DatabaseManager } from "../database/databaseManager.js";
import { ButtonInteraction, CommandInteraction, Message, MessageReaction, SelectMenuInteraction, VoiceState } from "discord.js";

export const Admin: GuardFunction<CommandInteraction> = async (interaction, client, next, guardData) => {
  if (interaction.user!.id === new Config().BOT_ADMIN_ID) {
    //BOT_ADMIN_OVERRIDE
    await next();
    return;
  }
  //TODO add Admin role check based on guild config.
  await interaction.reply("```You are not authorized to use this command```");
};

export const BotOwner: GuardFunction<CommandInteraction> = async (interaction, client, next, guardData) => {
  if (interaction.user!.id === new Config().BOT_ADMIN_ID) {
    //BOT_ADMIN_OVERRIDE
    await next();
    return;
  }
  await interaction.reply("```You are not authorized to use this command```");
};

export const PlayerRegistered: GuardFunction<CommandInteraction> = async (interaction, client, next, guardData) => {
  const db: DatabaseManager = container.resolve(DatabaseManager);
  const player = await db.players.getById(interaction.member!.user!.id);
  if (player) {
    guardData.player = player;
    await next();
    return;
  }
  interaction.reply("```You are not registered with this bot, please use the register command```");
};

export const CommandEnabled: GuardFunction<CommandInteraction> = async (interaction, client, next, guardData) => {
  if (interaction instanceof ButtonInteraction) {
    await next();
    return;
  }
  const command = CommandSecurityList().get(interaction.command!.name);
  if (command && (command.enabled || (command.ownerOverride && interaction.member!.user!.id === new Config().BOT_ADMIN_ID))) {
    await next();
    return;
  }
  await interaction.reply("```This command is not enabled.```");
};

export const NotBot: GuardFunction<ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate"> | CommandInteraction | SelectMenuInteraction | ButtonInteraction> = async (
  arg,
  client,
  next,
  guardData
) => {
  const argObj = arg instanceof Array ? arg[0] : arg;
  const user =
    argObj instanceof CommandInteraction
      ? argObj.user
      : argObj instanceof MessageReaction
        ? argObj.message.author
        : argObj instanceof VoiceState
          ? argObj.member?.user
          : argObj instanceof Message
            ? argObj.author
            : argObj instanceof CommandInteraction || argObj instanceof SelectMenuInteraction || argObj instanceof ButtonInteraction
              ? argObj.member?.user
              : argObj.message.author;
  if (!user?.bot) {
    guardData.message = "the NotBot guard passed";
    await next();
  }
};

export const CountryCode: GuardFunction<CommandInteraction> = async (interaction, client, next, guardData) => {
  guardData.countryCode = "en"; //TODO actual DB implementation.
  await next();
};
