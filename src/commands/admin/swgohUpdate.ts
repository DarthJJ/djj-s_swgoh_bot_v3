/* eslint-disable @typescript-eslint/no-unused-vars */
import { Category, Description } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { Client, Discord, Guard, Slash } from "discordx";
import { container, injectable } from "tsyringe";
import { Retriever } from "swgoh_api_ts";
import { DatabaseManager } from "../../database/databaseManager.js";
import { Admin, CommandEnabled, CountryCode, PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { MessageCodes as mc } from "../../i18n/languages/MessageCodes.js";
import { User } from "../../models/user.js";
import { botResponse, executeCommand, interactionType } from "../../utils/CommandHelper.js";
import { CommandList } from "../metaData/commandList.js";

@Discord()
@injectable()
@Category("SWGOH Update commands")
export class SwgohUpdate {
  @Slash({ name: CommandList.UPDATE })
  @Guard(CommandEnabled, PlayerRegistered, Admin, CountryCode)
  @Description("Update static data from swgoh.gg")
  async update(interaction: CommandInteraction, client: Client, guardData: { player: User }): Promise<void> {
    executeCommand(this.updateImpl, interaction, true, guardData.player);
  }

  private async updateImpl(interaction: interactionType, database: DatabaseManager, player: User): Promise<number[]> {
    botResponse(interaction, player.localePref, [mc.START_UPDATE_CHARACTERS, mc.PLEASE_WAIT]);
    const retriever = new Retriever();
    const characterData = await retriever.getCharacters();
    const shipData = await retriever.getShips();
    const abilityData = await retriever.getAbilities();
    // await database.characters.saveAll(await httpFetcher.getSerializeableData<Character>(Character));
    // botResponse(interaction, player.localePref, [mc.START_UPDATE_SHIPS, mc.PLEASE_WAIT]);
    // await database.ships.saveAll(await httpFetcher.getSerializeableData<Ship>(Ship));
    // botResponse(interaction, player.localePref, [mc.START_UPDATE_ABILITIES, mc.PLEASE_WAIT]);
    // await database.abilities.saveAll(await httpFetcher.getSerializeableData<Ability>(Ability));
    return [mc.UPDATE_FINISHED];
  }
}
