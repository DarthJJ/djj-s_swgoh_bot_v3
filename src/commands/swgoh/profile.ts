import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType, Client, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { container, injectable } from "tsyringe";
import { DatabaseManager } from "../../database/databaseManager.js";
import { NotBot, PlayerRegistered } from "../../guard/genericCommandGuard.js";
import { MessageCodes as mc } from "../../i18n/languages/MessageCodes.js";
import { User } from "../../models/user.js";
import { botResponse, executeCommand, interactionType } from "../../utils/CommandHelper.js";
import { CommandList } from "../metaData/commandList.js";
@Discord()
@injectable()
export class Profile {
  @Slash({ name: CommandList.OVERVIEW })
  @Category("Profile")
  @Guard(NotBot, PlayerRegistered)
  async profileOverview(
    @SlashOption({ name: "update", description: 'Update from "swgoh.gg", takes longer', type: ApplicationCommandOptionType.Boolean })
    update: boolean,
    interaction: CommandInteraction,
    client: Client,
    guardData: { player: User }
  ): Promise<void> {
    executeCommand(this.profile, interaction, true, guardData.player, update);
  }

  async profile(interaction: interactionType, database: DatabaseManager, player: User, update: boolean): Promise<number[]> {
    if (update) {
      // const httpFetcher = container.resolve(HttpFetcher);
      botResponse(interaction, player.localePref, [mc.START_UPDATE_PLAYER_DATA]);
      // const json = await httpFetcher.getJsonData(Player.name, player.allycodes[0].allycode.toString());
      // const data = json;
    }
    return [0];
  }
}
