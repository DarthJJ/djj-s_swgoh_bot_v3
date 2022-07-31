import "reflect-metadata";
import { Config } from './utils/config.js';
import { dirname, importx } from "@discordx/importer";
import { container, injectable } from "tsyringe";
import { ActivityType, IntentsBitField } from "discord.js";
import { Client, Discord, DIService, tsyringeDependencyRegistryEngine } from "discordx";
import { DatabaseManager } from './database/databaseManager.js';
//Fix for discord bug
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

@Discord()
@injectable()
export class Main {
  private _client: Client;
  private _config: Config;
  private _database: DatabaseManager; //For some reason DI doesn't reflecth DatabaseManager as a class type.

  constructor() {
    this._database = container.resolve(DatabaseManager);
    this._config = container.resolve(Config)!;
    this.start();
  }
  async start(): Promise<void> {
    this._client = new Client({
      botId: this._config.BOT_NAME,
      botGuilds: this._config.DEV_MODE ? [this._config.DEV_GUILD_ID!] : undefined, //undefined == global command
      // Discord intents
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildPresences,
      ],
      silent: this._config.SILENT_LOGGING,
      simpleCommand: {
        prefix: this._config.BOT_PREFIX,
      },
    });
    this._client.once("ready", async () => {
      await this._client.guilds.fetch();
      await this._client.initApplicationCommands({
        global: { log: true },
        guild: { log: true },
      });
      //Only to be executed on release
      if (!this._config.DEV_MODE) {
        this._client.clearApplicationCommands(this._config.DEV_GUILD_ID!);
      }
      this._client.user?.setPresence({
        activities: [{
          name: "my code",
          type: ActivityType.Watching
        }]
      })
      console.log(">> Bot Started")
    });

    this._client.on("interactionCreate", (interaction) => {
      console.log('interation received: ' + interaction);
      this._client.executeInteraction(interaction);
    });

    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");
    if (this._config.BOT_TOKEN === '-1') {
      throw Error(">> Could not find the bot token, stopping bot");
    }
    await this._client.login(this._config.BOT_TOKEN);
  }
}
new Main();
