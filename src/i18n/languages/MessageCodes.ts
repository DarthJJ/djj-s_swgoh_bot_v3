export class MessageCodes {
  //1xxx = Generic
  static PLEASE_WAIT = 1001;
  static MESSAGE_SELF_DELETE_3_SEC = 1002;
  static ENJOY_USING_BOT = 1003;
  static REQUEST_CANCELLED = 1004;
  static REQUEST_CONFIRM = 1005;
  static REQUEST_CANCEL = 1006;
  static REQUEST_ARE_YOU_SURE = 1007;
  static GENERIC_ERROR = 1008;
  //11xx = GuardData
  static NOT_REGISTERED = 1101;
  //2xxx = Command specific
  ////Purge command
  static PURGE_STARTED = 2001;
  static PURGE_FINISHED = 2002;
  static PURGE_NOTHING = 2003;
  static PURGE_WRONG_CHANNEL_TYPE = 2004;
  static PURGE_MAX_EXCEEDED = 2005;
  ////Register command
  static REGISTER_ALREADY_DONE = 2011;
  static REGISTER_FINSIED = 2012;
  ////Update Language Pref Command
  static LANGUAGE_PREF_UPDATED = 2021;
  ////Delete Command
  static DELETE_ACCOUNT_FINISHED = 2031;
  ////Update Command
  static ABILITY_UPDATE_FINISHED = 2041;
  static CHARACTER_UPDATE_FINISHED = 2042;
  static SHIP_UPDATE_FINISHED = 2043;
}
