import { Category } from "@discordx/utilities";
import { Discord } from "discordx";
import { injectable } from "tsyringe";
import { DatabaseManager } from "../../database/databaseManager.js";

@Discord()
@injectable()
@Category("SWGOH Update commands")
export class SwgohUpdate {
  private _database: DatabaseManager;
}
