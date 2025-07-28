export class AppError extends Error {
    status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, AppError.prototype); // fix TS inheritance
    }
}
