import {Session, SessionData} from "./session";
import {DataPartDiff} from "./diff";

export interface TableRowData {
    num: number;
    id: string;
    datas: (SessionData| undefined)[];
    diffs: DataPartDiff[];
}

export interface SessionsToCompare{
    first: Session | null ,
    second: Session | null
}

export enum ShowDiffType {
    ALL = 'ALL',
    CHANGED = 'CHANGED',
    UNCHANGED = 'UNCHANGED',
    ADDED = 'ADDED',
    REMOVED = 'REMOVED'
}
