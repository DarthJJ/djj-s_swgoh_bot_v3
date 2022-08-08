import { singleton } from "tsyringe";
import { HttpError } from "../exceptions/httpError.js";
import { Ability } from "../models/ability.js";

@singleton()
export class HttpFetcher {
  private readonly baseApiUrl: string = "https://swgoh.gg/api/";
  private readonly playerEndpoint: string = this.baseApiUrl + "player/";
  private readonly shipEndpoint: string = this.baseApiUrl + "ships/";
  private readonly characterEndpoint: string = this.baseApiUrl + "characters/";
  private readonly guildEndpoint: string = this.baseApiUrl + "guild/";
  private readonly abilitiesEndpoint: string = this.baseApiUrl + "abilities/";
  private readonly glChecklistEndpoint: string = this.baseApiUrl + "gl-checklist/";
  private readonly playerModEndpoint: string = this.baseApiUrl + "player/{0}/mods/"; //<-- override {0} with allycode

  async getAbilities(): Promise<Ability[]> {
    // return await this.apiCall<Ability[]>(this.abilitiesEndpoint);
    const data = await this.apiCall(this.abilitiesEndpoint);
    const returnData: Ability[] = [];
    for (let index in data) {
      returnData.push(new Ability().fillFromJSON(data[index]));
    }
    return returnData;
  }

  private async apiCall(url: string): Promise<object[]> {
    return await fetch(url).then((response) => {
      if (!response.ok) {
        throw new HttpError(response.statusText, null);
      }
      return response.json();
    });
  }
}
