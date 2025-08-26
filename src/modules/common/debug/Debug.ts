import { store } from "modules/common/containers/AppContainer";

type LogLevel = 'info' | 'error' | 'none' | 'debug' | 'success';

export type Log = {
    ts: number;
    level: LogLevel;
    message: string;
    tags?: string[];
    source?: string;
    data?: string;
}

/**
 * 
 * Custom debug/logging service avaiable in DEV account
 * 
 */
class Debug {
    private logs: Log[] = [];
    private subscriber: ((logs: Log[]) => void) | null = null;

    private getActive(): boolean {
        const appState = store.getState();
        return Boolean(appState.app) && Boolean(appState.app.debug);
    }

    private createLog(level: LogLevel, message: string, tags?: string[], source?: string, data?: string): Log {
        const ts = Date.now();
        return {
            ts,
            message,
            source,
            tags,
            level,
            data
        }
    }

    public addSubscriber(subscriber: (logs: Log[]) => void) {
        this.subscriber = subscriber;
    }

    private subscribe(): void {
        if (this.subscriber) {
            this.subscriber(this.logs);
        }
    }

    public addLog(level: LogLevel, message: string, tags?: string[], source?: string, data?: any): void {
        if (this.getActive()) {
            const stringifiedData = JSON.stringify(data || {}).substring(0, 100);
            const log = this.createLog(level, message, tags, source, stringifiedData);
            this.logs.push(log);
            this.subscribe();
        } else {
            // ignore
        }
    }

    public info(message: string, tags?: string[], source?: string, data?: any): void {
        this.addLog('info', message, tags, source, data);
    }

    public error(message: string, tags?: string[], source?: string, data?: any): void {
        this.addLog('error', message, tags, source, data);
    }


    public success(message: string, tags?: string[], source?: string, data?: any): void {
        this.addLog('success', message, tags, source, data);
    }

    public reset() {
        this.logs = [];
    }
}

const elpDebug = new Debug();
export default elpDebug;