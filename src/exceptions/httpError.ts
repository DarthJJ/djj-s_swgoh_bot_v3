import { BaseError } from "./baseError.js";
export class HttpError extends BaseError {
    constructor(message: string, originalError: unknown) {
        super(message, originalError);
    }
    initError(): void {
        Object.setPrototypeOf(this, HttpError.prototype);
        this.name = "HttpError"
    }
}