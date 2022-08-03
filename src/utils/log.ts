import { singleton } from "tsyringe";
import { ILogObject, Logger } from "tslog";
import { Config } from './config.js';
import { appendFileSync, existsSync, appendFile } from "fs";

@singleton()
export class Log {
    private readonly _config: Config;
    private readonly _logger: Logger;
    private readonly _logPath: string;
    private readonly debugFile: string = "debug.json";
    private readonly errorFile: string = "error.json";
    private readonly infoFile: string = "info.json";

    constructor(config: Config) {
        this._config = config;
        this._logPath = this._config.LOG_PATH;
        this._logger = new Logger({
            name: "botLogger",
            instanceName: "botLogger",
            exposeErrorCodeFrame: config.DEV_MODE ? true : false,
            suppressStdOutput: false,
            dateTimeTimezone: 'Europe/Amsterdam',
            printLogMessageInNewLine: true,
            displayLoggerName: false,
            displayTypes: true,
            displayFilePath: "hidden"
        });
        this._logger.attachTransport({
            silly: this.logToVoid,
            debug: this.logToDebug,
            trace: this.logToDebug,
            info: this.logToInfo,
            warn: this.logToDebug,
            error: this.logToError,
            fatal: this.logToError
        })
    }

    public get Logger() {
        return this._logger;
    }

    private getDate = (): string => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    private writeToFile = (message: string, filename: string) => {
        const filepath: string = './' + this._logPath + '/' + this.getDate() + '_' + filename;
        appendFile(filepath, message + "\n", (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    private logToDebug = (LogObject: ILogObject) => {
        this.writeToFile(JSON.stringify(LogObject), this.debugFile);
    }

    private logToError = (LogObject: ILogObject) => {
        this.writeToFile(JSON.stringify(LogObject), this.errorFile);
    }

    private logToInfo = (LogObject: ILogObject) => {
        this.writeToFile(JSON.stringify(LogObject), this.infoFile);
    }

    private logToVoid = (LogObject: ILogObject) => {
        //Do Nothing let it go to the enternal void;
    }
}