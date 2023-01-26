export default class Config {
    static token: string = "kill-switch-token";
    static api: string = process.env.NODE_ENV === 'production' ? "http://backup.mediaonlinebd.com/api" : `http://localhost:8000/api`;
    static base: string = "/";

}