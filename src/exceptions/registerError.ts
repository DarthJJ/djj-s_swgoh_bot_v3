export class RegisterError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, RegisterError.prototype);
        this.name = "Register Error";
    }
}