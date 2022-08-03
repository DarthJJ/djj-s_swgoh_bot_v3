import "reflect-metadata";
import { Config } from './utils/config.js';
import { dirname, importx } from "@discordx/importer";
import { container, autoInjectable } from "tsyringe";
import { ActivityType, IntentsBitField } from "discord.js";
import { Client, Discord, DIService, tsyringeDependencyRegistryEngine } from "discordx";
import { DatabaseManager } from './database/databaseManager.js';
//Fix for discord bug
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

@Discord()
@autoInjectable()
export class Main {
  private _client: Client;
  private _database: DatabaseManager;
  private _config: Config

  constructor(database?: DatabaseManager, config?: Config) {
    this._database = database!;
    this._config = config!;
  }

  async start(): Promise<void> {
    this._client = new Client({
      botId: this._config!.BOT_NAME,
      botGuilds: this._config!.DEV_MODE ? [this._config!.DEV_GUILD_ID!] : undefined, //undefined == global command
      // Discord intents
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildPresences,
      ],
      silent: this._config!.SILENT_LOGGING,
      simpleCommand: {
        prefix: this._config!.BOT_PREFIX,
      },
    });
    this._client.once("ready", async () => {
      await this._client.guilds.fetch();
      await this._client.initApplicationCommands({
        global: { log: true },
        guild: { log: true },
      });
      //Only to be executed on release
      if (!this._config!.DEV_MODE) {
        this._client.clearApplicationCommands(this._config!.DEV_GUILD_ID!);
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
    if (this._config!.BOT_TOKEN === '-1') {
      throw Error(">> Could not find the bot token, stopping bot");
    }
    await this._client.login(this._config!.BOT_TOKEN);
  }
}
new Main().start();

