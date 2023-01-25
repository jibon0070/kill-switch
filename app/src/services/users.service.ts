import Config from "../config";
import jwtDecode from "jwt-decode";
import Http from "../http";
import Observable from "../Observable";

export default class UsersService {
    private static url: string = Config.api + '/users';
    static $is_logged_in = new Observable();

    static get token(): string | null {
        return localStorage.getItem(Config.token);
    }

    static get is_logged_in(): boolean {
        return !!this.token;
    }

    static get role(): string {
        if (!this.is_logged_in) return 'visitor';
        let payload: { id: string; role: string };
        try {
            payload = jwtDecode<{ id: string; role: string }>(this.token!);
        }
        catch (e) {
            return 'visitor';
        }
        return payload.role;
    }

    static logout() {
        localStorage.clear();
    }

    static register(value: { [p: string]: any }) {
        return Http.post<{ success: boolean, token: string, error: string; input_error: { name: string; message: string; }; }>(this.url + '/register', value);
    }

    static login(value: { [p: string]: any }) {
        return Http.post<{
            error: string;
            success: boolean; token: string; input_error: { name: string; message: string; }; }>(this.url + '/login', value);
    }
}