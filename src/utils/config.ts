import { singleton } from 'tsyringe'
import * as dotenv from 'dotenv'
dotenv.config()

@singleton()
export class Config {
    readonly DEV_MODE: boolean;
    readonly RECREATE_DB: boolean;
    readonly FILL_TEST_DATA: boolean;
    readonly BOT_TOKEN: string;
    readonly BOT_ADMIN_ID: string;
    readonly DEV_GUILD_ID: string;
    readonly MAX_PURGE_AMOUNT: number;
    readonly SILENT_LOGGING: boolean;
    readonly BOT_PREFIX: string;
    readonly BOT_NAME: string;
    readonly DEFAULT_LOCALE_PREF: string;
    readonly LOG_PATH: string;
    readonly LOG_TO_FILE: boolean;

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
        this.DEFAULT_LOCALE_PREF = process.env.DEFAULT_LOCALE_PREF ?? 'en';
        this.FILL_TEST_DATA = process.env.FILL_TEST_DAWTA === 'true' ? true : false;
        this.LOG_PATH = process.env.LOG_PATH ?? '-1';
        this.LOG_TO_FILE = process.env.LOG_TO_FILE === 'true' ? true : false;
    }
}