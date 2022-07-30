import { GuardFunction } from "discordx";

export const Admin: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    if (interaction.user!.id === process.env.BOT_ADMIN_ID) { //BOT_ADMIN_OVERRIDE
        await next();
        return;
    }
    //TODO add Admin role check
    await interaction.reply("```You are not authorized to use this command```")
}

export const BotOwner: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    if (interaction.user!.id !== process.env.BOT_ADMIN_ID) { //BOT_ADMIN_OVERRIDE
        await next();
        return;
    }
    await interaction.reply("```You are not authorized to use this command```")
}

export const CountryCode: GuardFunction<any> = async (
    interaction,
    client,
    next,
    guardData
) => {
    guardData.countryCode = "en";
    await next();
}
