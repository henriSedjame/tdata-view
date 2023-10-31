import {DataPart, DataPartDiff, DiffType, PartValue} from "./data";

export function partsOf(o: any): DataPart[] {

    if (!o) return []

    return Object.keys(o).map(key => {

        let oElement = o[key];

        return {
            name: key,
            data: isObject(oElement) ? partsOf(oElement) : oElement
        }
    })
}

export function fromPart(part: DataPart): any {
    let s = "{";
    part.data
    s = s + `"${part.name}" :`
    if (isArray(part.data)) {
        s = `${s} { ${fromParts(part.data)} }`
    } else {
        s = `${s} "${part.data}"`
    }
    return JSON.parse(`${s} }`.replaceAll(",  }", " }"));
}

export function fromParts(parts: DataPart[]): string {
    let s = "";
    parts.forEach(part => {
        s = s + `"${part.name}" :`
        if (isArray(part.data)) {
            s = `${s} { ${fromParts(part.data)} } , `
        } else {
            s = `${s} "${part.data}" , `
        }
    })

    return s
}

export function partDiffsOf(o1: any, o2: any): DataPartDiff[] {

    const diffs: DataPartDiff[] = [];

    const parts1 = partsOf(o1).flatMap(part => flatParts(part));
    const parts2 = partsOf(o2).flatMap(part => flatParts(part));

    const keys = new Set<string>();

    parts1.forEach(part => keys.add(part.name));
    parts2.forEach(part => keys.add(part.name));

    keys.forEach(key => {

        let name = key;

        const part1 = parts1.find(part => part.name === key);
        const part2 = parts2.find(part => part.name === key);

        if (part1 && part2) {
            if (part1.value !== part2.value) {
                diffs.push({
                    name: name,
                    diffType: DiffType.CHANGED,
                    prev: part1.value,
                    next: part2.value
                })
            } else {
                diffs.push({
                    name: name,
                    diffType: DiffType.UNCHANGED,
                    prev: part1.value,
                    next: part2.value
                })
            }
        } else if (!part1) {
            diffs.push({
                name: name,
                diffType: DiffType.REMOVED,
                prev: undefined,
                next: part2?.value
            })
        } else {
            diffs.push({
                name: name,
                diffType: DiffType.ADDED,
                prev: part1?.value,
                next: undefined
            })
        }

    })
    return diffs.sort((a, b) => a.name.localeCompare(b.name));

}

export function flatParts(part: DataPart, parent?: string): PartValue[] {

    let key = parent ? `${parent}.${part.name}` : part.name;

    if (isArray(part.data)) {
        return part.data.flatMap((pt: DataPart) => flatParts(pt, key))
    } else {
        return [
            {
                name: key,
                value: part.data
            }
        ]
    }
}


export function hasValue(part: DataPartDiff): boolean {
    return part.next !== undefined || part.prev !== undefined;
}

export function isParentOf(part: DataPartDiff, other: DataPartDiff): boolean {
    return other.name.startsWith(part.name);
}

export function isCollapsable(diff: DataPartDiff) : boolean {
    return diff.name.split(".").length > 1 || !hasValue(diff);
}

export function isUnchanged(diff: DataPartDiff) : boolean {
    return diff.diffType === DiffType.UNCHANGED;
}
export function last(name: string) {
    return name.split(".").pop();
}

export function isObject(o: any) {
    return typeof o === 'object' && o !== null;
}

export function isArray(o: any) {
    return Array.isArray(o);
}