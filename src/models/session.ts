export interface SessionData{
    id: string;
    timpstamp: number;
    data: any
}

export enum SessionStatus{
    STARTED = 'STARTED',
    PAUSED = 'PAUSED',
    STOPPED = 'STOPPED',
}

export interface Session{
    id: number;
    name: string;
    datas: SessionData[]
}