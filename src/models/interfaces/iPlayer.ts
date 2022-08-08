import { iModel } from "./iModel.js";
export interface iPlayer extends iModel {
  discordId: string;
  name: string;
  localePref: string;
}
