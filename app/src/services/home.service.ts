import Http from "../http";
import Config from "../config";

export default class HomeService {
    private static url: string = Config.api + '/home';

    static get index() {
        return Http.get<{
            switches: {
                status: boolean;
                link: string;
                id: string;
            }[];
        }>(this.url + '/');
    }

    static new(value: { [p: string]: any }) {
        return Http.post<{ success: boolean; error: string; input_error: { name: string; message: string; } }>(this.url + '/new', value);
    }

    static toggle_status(value: { id: string, checked: boolean }) {
        return Http.post(this.url + '/toggle-status', value);
    }

    static delete(id: string) {
        return Http.post<{ success: boolean }>(this.url + '/delete', {id});
    }
}