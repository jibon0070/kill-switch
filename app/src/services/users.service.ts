import Config from "../config";
import jwtDecode from "jwt-decode";

export default class UsersService {
    private static get token(): string | null {
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

}