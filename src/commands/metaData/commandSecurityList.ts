import { singleton } from "tsyringe";
import { commandStatus } from './commandStatus.js';

export const CommandSecurityList = (): Map<string, commandStatus> => {
    var list = new Map<string, commandStatus>();
    list.set("purge", new commandStatus("purge", true));
    return list;
}