export class MessageCodes {
    //1xxx = Generic
    static PLEASE_WAIT: number = 1001;
    static MESSAGE_SELF_DELETE_3_SEC: number = 1002
    static ENJOY_USING_BOT: number = 1003

    //2xxx = Command specific
    ////Purge command
    static PURGE_STARTED: number = 2001;
    static PURGE_FINISHED: number = 2002;
    static PURGE_NOTHING: number = 2003;
    static PURGE_WRONG_CHANNEL_TYPE: number = 2004;
    static PURGE_MAX_EXCEEDED: number = 2005;
    ////Register command
    static REGISTER_ALREADY_DONE: number = 2011;
    static REGISTER_FINSIED: number = 2012;
    ////Update Language Pref Command
    static LANGUAGE_PREF_UPDATED: number = 2021;
}