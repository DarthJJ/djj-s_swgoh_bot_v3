import { BaseError } from './baseError.js';
export class DatabaseError extends BaseError {
    constructor(message: string, originalError: unknown) {
        super(message, originalError);
    }

    initError() {
        Object.setPrototypeOf(this, DatabaseError.prototype);
        this.name = "DatabaseError";
    }
}