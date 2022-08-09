import { singleton } from "tsyringe";
import { createLogger, transports, format, Logger } from "winston";
import { Config } from "./config.js";
import { appendFile } from "fs";

@singleton()
export class Log {
  private readonly _config: Config;
  private readonly _logger: Logger;
  private readonly _logPath: string;
  private readonly debugFile: string = "debug.json";
  private readonly errorFile: string = "error.json";
  private readonly infoFile: string = "info.json";
  private readonly interactionFile: string = "interaction.json";

  public get Logger(): Logger {
    return this._logger;
  }
  constructor(config: Config) {
    this._config = config;
    this._logPath = this._config.LOG_PATH;
    this._logger = createLogger({
      format: format.json(),
      defaultMeta: { service: "bot-service" },
      transports: [
        new transports.File({ filename: "./" + this._logPath + "/" + this.errorFile, level: "error" }),
        new transports.File({ filename: "./" + this._logPath + "/" + this.debugFile, level: "debug" }),
        new transports.File({ filename: "./" + this._logPath + "/" + this.infoFile, level: "info" }),
        new transports.File({ filename: "./" + this._logPath + "/" + this.interactionFile, level: "silly" }),
      ],
    });
    if (config.DEV_MODE) {
      this._logger.add(
        new transports.Console({
          format: format.simple(),
        })
      );
    }
  }
}
