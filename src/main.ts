import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import "reflect-metadata";
import { dirname, importx } from "@discordx/importer";
import { container } from "tsyringe";
import { IntentsBitField } from "discord.js";
import { Client, DIService, tsyringeDependencyRegistryEngine } from "discordx";
//Fix for discord bug
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

export class Main {
  private static _client: Client;
  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      // To only use global commands (use @Guild for specific guild command), comment this line
      //botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
      botId: "DJJ-SWGOH-Bot_V3",
      botGuilds: process.env.DEV ? [process.env.GUILD_ID!] : undefined, //undefined == global command
      // Discord intents
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
      ],
      // Debug logs are disabled in silent mode
      silent: false,

      // Configuration for @SimpleCommand
      simpleCommand: {
        prefix: "!",
      },
    });

    this._client.once("ready", async () => {
      await this._client.guilds.fetch();
      await this._client.initApplicationCommands({
        global: { log: true },
        guild: { log: true },
      });
      //Only to be executed on release
      if (!process.env.DEV) {
        this._client.clearApplicationCommands(process.env.GUILD_ID!);
      }
      console.log(">> Bot Started")
    });

    this._client.on("interactionCreate", (interaction) => {
      console.log(">> Interaction received: " + interaction); //Debug and testing purposes
      this._client.executeInteraction(interaction);
    });

    // this._client.on("messageCreate", (message: Message) => {
    //   console.log(">> Message received: " + message);//Debug and testing purposes
    //   this._client.executeCommand(message);
    // });

    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");
    if (!process.env.BOT_TOKEN) {
      throw Error(">> Could not find the bot token, stopping bot");
    }
    await this._client.login(process.env.BOT_TOKEN);
  }
}

Main.start();
