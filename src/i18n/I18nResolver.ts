import enJson from "./languages/en.json" assert { type: "json" };
import nlJson from "./languages/nl.json" assert { type: "json" };
import { singleton } from "tsyringe";

export enum availableTranslations {
  NL = "nl",
  EN = "en",
}

@singleton()
export class I18NResolver {
  private en: { [messageCode: number]: string } = {};
  private static readonly enKey = "en";
  private nl: { [messagecode: number]: string } = {};
  private static readonly nlKey = "nl";

  constructor() {
    enJson.forEach((translation) => {
      this.en[translation.messageCode] = translation.value;
    });
    nlJson.forEach((translation) => {
      this.nl[translation.messageCode] = translation.value;
    });
  }

  getTranslations(countryCode: string, ...messageCode: number[]) {
    let returnString = "";
    for (let index = 0; index < messageCode.length; index++) {
      returnString += this.getTranslation(countryCode, messageCode[index]) + " ";
    }
    return returnString;
  }

  getTranslation(countryCode: string, messageCode: number): string {
    switch (countryCode) {
      case I18NResolver.nlKey:
        return this.nl[messageCode] ?? this.getTranslation("en", messageCode);
      case I18NResolver.enKey:
        return this.en[messageCode];
      default:
        return this.en[messageCode];
    }
  }
}
