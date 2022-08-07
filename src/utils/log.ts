import { singleton } from "tsyringe";
import { ILogObject, Logger } from "tslog";
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

  constructor(config: Config) {
    this._config = config;
    this._logPath = this._config.LOG_PATH;
    this._logger = new Logger({
      name: "botLogger",
      instanceName: "botLogger",
      exposeErrorCodeFrame: config.DEV_MODE ? true : false,
      suppressStdOutput: false,
      dateTimeTimezone: "Europe/Amsterdam",
      printLogMessageInNewLine: true,
      displayLoggerName: false,
      displayTypes: true,
      displayFilePath: "hidden",
      colorizePrettyLogs: true,
    });
    this._logger.attachTransport({
      silly: this.logToInteraction,
      debug: this.logToDebug,
      trace: this.logToDebug,
      info: this.logToInfo,
      warn: this.logToDebug,
      error: this.logToError,
      fatal: this.logToError,
    });
  }

  public get Logger() {
    return this._logger;
  }

  private getDate = (): string => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  private writeToFile = (message: string, filename: string) => {
    const filepath: string =
      "./" + this._logPath + "/" + this.getDate() + "_" + filename;
    appendFile(filepath, message + "\n", (err) => {
      if (err) {
        console.error(err);
      }
    });
  };
  private logToInteraction = (LogObject: ILogObject) => {
    this.writeToFile(JSON.stringify(LogObject), this.interactionFile);
  };

  private logToDebug = (LogObject: ILogObject) => {
    this.writeToFile(JSON.stringify(LogObject), this.debugFile);
  };

  private logToError = (LogObject: ILogObject) => {
    this.writeToFile(JSON.stringify(LogObject), this.errorFile);
  };

  private logToInfo = (LogObject: ILogObject) => {
    this.writeToFile(JSON.stringify(LogObject), this.infoFile);
  };
}
