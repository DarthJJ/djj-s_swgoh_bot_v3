import { CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashOption } from "discordx";
import { Admin } from "../guard/genericCommandGuard.js";

@Discord()
export class Example {
  @Slash()
  @Guard(Admin)
  choose(
    @SlashChoice("Human", "Astronaut", "Dev")
    @SlashOption("what", { description: "What are you?" })
    what: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(what);
  }

  @Slash()
  choice(
    @SlashChoice({ name: "are you okay?", value: "okay" })
    @SlashChoice({ name: "are you good?", value: "good" })
    @SlashOption("text")
    what: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply(what);
  }
}
