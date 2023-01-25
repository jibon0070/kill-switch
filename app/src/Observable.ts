export default class Observable {
    private subscriptions: Function[] = [];

    emit(...args: any) {
        for (let subscription of this.subscriptions) {
            subscription(...args);
        }
    }

    subscribe(callback: (...args: any) => void) {
        this.subscriptions.push(callback);
    }
}