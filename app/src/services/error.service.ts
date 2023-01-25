import Observable from "../Observable";
export default class ErrorService {
    static error = new Observable();

    static show(message: string) {
        this.error.emit(message);
    }
}