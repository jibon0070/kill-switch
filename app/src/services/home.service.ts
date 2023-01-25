import Http from "../http";
import Config from "../config";

export default class HomeService {
    private static url: string = Config.api + '/home';

    static new(value: { [p: string]: any }) {
        return Http.post<{ success: boolean; error: string;input_error:{ name: string; message: string;}}>(this.url + '/new', value);
    }
}