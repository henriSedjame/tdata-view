
export interface SessionData{
    id: string;
    timpstamp: number;
    data: any
}
export interface Session{
    id: number;
    name: string;
    datas: SessionData[]
}

export interface TableRowData {
    num: number;
    datas: (SessionData| undefined)[];
    diffs: DataPartDiff[];
}

export interface DataPart{
    name: string;
    data: any;
}

export enum DiffType{
    ADDED = 'ADDED',
    REMOVED = 'REMOVED',
    CHANGED = 'CHANGED',
}

export interface DataPartDiff{
    name: string;
    diffType: DiffType;
    prev: any | undefined;
    next: any | undefined;
}

export interface PartValue{
    name: string;
    value: any;
}

export interface SessionsToCompare{
    first: Session | null ,
    second: Session | null
}
