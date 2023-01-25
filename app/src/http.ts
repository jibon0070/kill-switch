import UserService from "./services/users.service";
import Config from "./config";
export type http_response_type<T> = { result: Promise<T>, controller: AbortController };
export default class Http {
    static get<T>(url: string): http_response_type<T> {
        return this.request<T>(url, 'GET')
    }

    private static request<T>(url: string, method: string, body: { [key: string]: any } | FormData | null = null):{result: Promise<T>, controller: AbortController} {
        const headers = this.get_headers;
        const controller = new AbortController();
        if (!(body instanceof FormData)) {
            headers.append('Content-Type', 'application/json')
        }
        const options: any = {
            method,
            headers,
            signal: controller.signal
        };
        if (body) {
            options.body = body instanceof FormData ? body : JSON.stringify(body);
        }
        return {result: this.process_result(fetch(url, options)), controller};
    }

    private static get get_headers(): Headers {
        const headers = new Headers({})
        if (UserService.is_logged_in) {
            headers.append('Authorization', `Barer ${UserService.token}`);
        }
        return headers;
    }

    static post<T>(url: string, body: { [key: string]: any } | FormData): http_response_type<T> {
        return this.request(url, 'POST', body);
    }

    private static process_result<T>(result: Promise<Response>): Promise<T> {
        return result.then(res => {
            if (res.status === 200) {
                try {
                    return res.json();
                } catch (e: any) {
                    throw new DOMException(e);
                }
            } else if (res.status === 401) {
                if (process.env.NODE_ENV === 'production') {
                    if (UserService.is_logged_in) {
                        UserService.logout();
                    }
                    window.location.href = Config.base;
                }
            } else {
                throw new DOMException('Unknown Error', 'Unknown');
            }
        });
    }

    static delete<T>(url: string): http_response_type<T> {
        return this.request(url, 'DELETE');
    }
}