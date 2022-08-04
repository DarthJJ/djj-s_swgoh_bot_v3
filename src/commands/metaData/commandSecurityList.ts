import { commandStatus } from './commandStatus.js';
import { CommandList } from './commandList.js';

export const CommandSecurityList = (): Map<string, commandStatus> => {
    var list = new Map<string, commandStatus>();
    const purge = new commandStatus(CommandList.PURGE, true, true);
    list.set(purge.name, purge);
    const register = new commandStatus(CommandList.REGISTER, true, true);
    list.set(register.name, register);
    const changeLanguagePref = new commandStatus(CommandList.CHANGE_LANGEUAGE_PREF, true, true);
    list.set(changeLanguagePref.name, changeLanguagePref);
    return list;
}