import { singleton } from "tsyringe";
import { HttpError } from "../exceptions/httpError.js";
import { Serializable } from "../models/modelHelpers/serializable.js";
import { Ability } from "../models/swgoh/ability.js";
import { Character } from "../models/swgoh/character.js";
import { Ship } from "../models/swgoh/ship.js";

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

  async get<T extends Serializable>(type: new () => T): Promise<T[]> {
    const returnData: T[] = [];
    const data = await this.apiCall(this.determineEndPoint(type.name));
    for (let index in data) {
      returnData.push(new type().createFromJSON(data[index]));
    }
    return returnData;
  }

  private determineEndPoint(type: string): string {
    switch (type) {
      case Ability.name:
        return this.abilitiesEndpoint;
      case Character.name:
        return this.characterEndpoint;
      case Ship.name:
        return this.shipEndpoint;
    }
    throw new HttpError("No endpoint available", null);
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
