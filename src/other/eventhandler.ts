export default class EventController<T extends Record<string, (...args: any[]) => any>> 
{
    private events: Partial<Record<keyof T, Function[]>> = {};

    public on<K extends keyof T>(event: K, listener: T[K]): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        (this.events[event] as Function[]).push(listener);
    }

    public off<K extends keyof T>(event: K, listener: T[K]): void {
        if (!this.events[event]) return;
        this.events[event] = (this.events[event] as Function[]).filter(
            (l) => l !== listener
        );
    }

    public emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
        if (!this.events[event]) return;
        (this.events[event] as T[K][]).forEach((listener) => listener(...args));
    }
}