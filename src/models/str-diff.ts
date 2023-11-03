
export interface StrPart{
    start: number,
    end: number,
    part: string
}

export interface StrCompareParts {
    prev: StrPart,
    next: StrPart
}

export interface StrPartDiff{
    index: number,
    value: string,
    changed: boolean
}

export interface StrCompareResult {
    prev: StrPartDiff[],
    next: StrPartDiff[]
}