import { GuardFunction } from 'discordx';
import { container } from 'tsyringe';
import { Config } from '../utils/config.js';
import { CommandSecurityList } from '../commands/metaData/commandSecurityList.js';
import { DatabaseManager } from '../database/databaseManager.js';

export const Admin: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    if (interaction.user!.id === new Config().BOT_ADMIN_ID) { //BOT_ADMIN_OVERRIDE
        await next();
        return;
        //TODO add Admin role check based on guild config. 
        await interaction.reply("```You are not authorized to use this command```")
    }
}

export const BotOwner: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    if (interaction.user!.id === new Config().BOT_ADMIN_ID) { //BOT_ADMIN_OVERRIDE
        await next();
        return;
    }
    await interaction.reply("```You are not authorized to use this command```")
}

export const PlayerRegistered: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    let db: DatabaseManager = container.resolve(DatabaseManager);
    let player = await db.players.getByDiscordId(interaction.user!.id)
    if (player) {
        await next();
        return;
    }
    interaction.reply("```You are not registered with this bot, please use the register command```");

}

export const CommandEnabled: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    let command = CommandSecurityList().get(interaction.command.name)
    if (command && command.enabled) {
        await next();
        return;
    }
    await interaction.reply("```This command is not enabled.```");
}

export const CountryCode: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    guardData.countryCode = "en";  //TODO actual DB implementation.
    await next();
}

