import enJson from './languages/en.json' assert {type: 'json'}
import nlJson from './languages/nl.json' assert {type: 'json'}
import { singleton } from "tsyringe";

@singleton()
export class I18NResolver {
    private en: { [messageCode: number]: string } = {};
    private nl: { [messagecode: number]: string } = {};

    constructor() {
        enJson.forEach((translation) => {
            this.en[translation.messageCode] = translation.value;
        })
        nlJson.forEach((translation) => {
            this.nl[translation.messageCode] = translation.value;
        })
    }

    getTranslations(
        countryCode: string,
        ...messageCode: number[]
    ) {
        var returnString = "";
        for (let index = 0; index < messageCode.length; index++) {
            returnString += this.getTranslation(countryCode, messageCode[index]) + " ";
        }
        return returnString;
    }

    getTranslation(
        countryCode: string,
        messageCode: number,
    ) {
        switch (countryCode) {
            case "nl":
                return this.nl[messageCode];
                break;
            case "en":
            default:
                return this.en[messageCode];
                break;
        }
    }
    //1xxx = Generic
    PLEASE_WAIT: number = 1001;
    MESSAGE_SELF_DELETE_3_SEC: number = 1002

    //2xxx = Command specific
    PURGE_STARTED: number = 2001;
    PURGE_FINISHED: number = 2002;
    PURGE_NOTHING: number = 2003;
    PURGE_WRONG_CHANNEL_TYPE: number = 2004
    PURGE_MAX_EXCEEDED: number = 2005
}