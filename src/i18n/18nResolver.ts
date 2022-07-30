import enJson from './languages/en.json' assert {type: 'json'}
import nlJson from './languages/nl.json' assert {type: 'json'}
export class I18NResolver {
    private static en: { [messageCode: number]: string } = {};
    private static nl: { [messagecode: number]: string } = {};
    public static _initialize() {
        enJson.forEach((translation) => {
            this.en[translation.messageCode] = translation.value;
        })
        nlJson.forEach((translation) => {
            this.nl[translation.messageCode] = translation.value;
        })
    }

    static getTranslations(
        countryCode: string,
        ...messageCode: number[]
    ) {
        var returnString = "";
        for (let index = 0; index < messageCode.length; index++) {
            returnString += this.getTranslation(countryCode, messageCode[index]) + " ";
        }
        return returnString;
    }

    static getTranslation(
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
    static PLEASE_WAIT: number = 1001;
    static MESSAGE_SELF_DELETE_3_SEC: number = 1002

    //2xxx = Command specific
    static DELETION_STARTED: number = 2001;
    static DELETION_FINISHED: number = 2002;
    static DELETION_NOTHING: number = 2003;
}
I18NResolver._initialize();