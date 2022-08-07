import { commandStatus } from "./commandStatus.js";
import { CommandList } from "./commandList.js";

export const CommandSecurityList = (): Map<string, commandStatus> => {
  const list = new Map<string, commandStatus>();
  const purge = new commandStatus(CommandList.PURGE, true, true);
  list.set(purge.name, purge);
  const register = new commandStatus(CommandList.REGISTER, true, true);
  list.set(register.name, register);
  const changeLanguagePref = new commandStatus(CommandList.CHANGE_LANGEUAGE_PREF, true, true);
  list.set(changeLanguagePref.name, changeLanguagePref);
  const deleteAccount = new commandStatus(CommandList.DELETE_ACCOUNT, true, true);
  list.set(deleteAccount.name, deleteAccount);
  const update = new commandStatus(CommandList.UPDATE, true, true);
  list.set(update.name, update);
  return list;
};
