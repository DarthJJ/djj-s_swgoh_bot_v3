import { singleton } from 'tsyringe'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

@singleton()
export class Config {
    readonly DEV_MODE: boolean;
    readonly RECREATE_DB: boolean;
    readonly BOT_TOKEN: string;
    readonly BOT_ADMIN_ID: string;
    readonly DEV_GUILD_ID: string;
    readonly MAX_PURGE_AMOUNT: number;
    readonly SILENT_LOGGING: boolean;
    readonly BOT_PREFIX: string;
    readonly BOT_NAME: string;

    constructor() {
        this.DEV_MODE = process.env.DEV === 'true' ? true : false;
        this.RECREATE_DB = process.env.RECREATE_DB === 'true' ? true : false;
        this.BOT_TOKEN = process.env.BOT_TOKEN ?? '-1';
        this.BOT_ADMIN_ID = process.env.BOT_ADMIN_ID ?? '-1';
        this.DEV_GUILD_ID = process.env.GUILD_ID ?? '-1';
        this.MAX_PURGE_AMOUNT = Number(process.env.MAX_PURGE_AMOUNT);
        this.SILENT_LOGGING = process.env.SILENT_LOGGING === 'true' ? true : false;
        this.BOT_PREFIX = process.env.BOT_PREFIX ?? '-1';
        this.BOT_NAME = process.env.BOT_NAME ?? '-1';
    }
}