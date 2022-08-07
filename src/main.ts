import "reflect-metadata";
import { Config } from "./utils/config.js";
import { dirname, importx } from "@discordx/importer";
import { container, autoInjectable } from "tsyringe";
import { ActivityType, IntentsBitField } from "discord.js";
import {
  Client,
  Discord,
  DIService,
  tsyringeDependencyRegistryEngine,
} from "discordx";
import { DatabaseManager } from "./database/databaseManager.js";
import { Log } from "./utils/log.js";
import { CommandEnabled, NotBot } from "./guard/genericCommandGuard.js";

//Fix for discord bug
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

@Discord()
@autoInjectable()
export class Main {
  private _client: Client;
  private _database: DatabaseManager;
  private _config: Config;
  private _log: Log;

  constructor(database?: DatabaseManager, config?: Config, log?: Log) {
    try {
      this._database = database!;
      this._config = config!;
      this._log = log!;
      this.start();
    } catch (err) {
      this._log.Logger.error(err);
      process.exit(-1);
    }
  }

  async start(): Promise<void> {
    this._log.Logger.info("Starting bot");
    this._log.Logger.info(
      "Bot will be started " + this._config.DEV_MODE
        ? "DEV MODE"
        : "RELEASE MODE"
    );
    this._client = new Client({
      guards: [NotBot, CommandEnabled], //To make sure only enabled commands are usable.
      botId: this._config.BOT_NAME,
      botGuilds: this._config.DEV_MODE
        ? [this._config.DEV_GUILD_ID!]
        : undefined, //undefined == global command
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
      this._log.Logger.info("Bot Client ready");
      await this._client.guilds.fetch();
      await this._client.initApplicationCommands({
        global: { log: this._config.DEV_MODE ? false : true },
        guild: { log: this._config.DEV_MODE ? true : false },
      });
      //Only to be executed on release
      if (!this._config.DEV_MODE) {
        this._client.clearApplicationCommands(this._config.DEV_GUILD_ID!);
      }
      this._client.user?.setPresence({
        activities: [
          {
            name: "my code",
            type: ActivityType.Watching,
          },
        ],
      });
      this._log.Logger.info("Bot Ready and started");
    });

    this._client.on("interactionCreate", (interaction) => {
      this._log.Logger.silly(interaction.toJSON());
      this._client.executeInteraction(interaction);
    });

    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");
    if (this._config.BOT_TOKEN === "-1") {
      throw Error(">> Could not find the bot token, stopping bot");
    }
    await this._client.login(this._config.BOT_TOKEN);
  }
}
new Main();
