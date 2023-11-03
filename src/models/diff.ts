
export enum DiffType{
    ADDED = 'ADDED',
    REMOVED = 'REMOVED',
    CHANGED = 'CHANGED',
    UNCHANGED = 'UNCHANGED'
}

export interface DataPartDiff{
    name: string;
    prefix?: string;
    diffType: DiffType | undefined;
    prev: any | undefined;
    next: any | undefined;
}
