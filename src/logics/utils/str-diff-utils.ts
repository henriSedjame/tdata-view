import {StrCompareParts, StrCompareResult, StrPart, StrPartDiff} from "../../models/str-diff";

export function toStrParts(s: string) : StrPart[] {
    let parts: StrPart[] = [];

    for (let i = 0; i < s.length; i++) {
        for ( let j = i; j < s.length; j++) {
            parts.push({
                start: i,
                end: j,
                part: s.substring(i, j + 1)
            })
        }
    }

    return parts.sort((a, b) => {
        if (a.part.length === b.part.length) return b.start - a.start;
        return a.part.length - b.part.length;
    }).reverse();
}

export function buildCompareParts(s1: string, s2: string): StrCompareParts[] {

    interface Bound{
        x: number,
        y: number
    }

    let parts: StrCompareParts[] = []

    let used: StrPart[] = [];

    let prev_used: Bound[] = [];

    const s1_part_not_already_used = (p: StrPart) =>
        !used.includes(p);

    const is_in = (i:number, {x, y} : Bound) =>
        x <= i && i <= y;

    const s2_indexes_not_already_used = (a: number, b: number) =>
        prev_used.find(({x, y}) => is_in(a, {x, y}) || is_in(b, {x, y})) === undefined;

    const parts_bound = (p: StrPart) : Bound => {
        return {
            x: p.start,
            y: p.end
        }
    }
    const parts_crossed = (a: StrPart, b: StrPart) =>
        (is_in(a.start, parts_bound(b)) || is_in(a.end, parts_bound(b)));

    const are_not_coherent = ({x: x1, y: y1}: Bound, {x: x2, y: y2}: Bound) =>
        (x1 < x2 && y1 > y2 ) || (x1 > x2 && y1 < y2);


    const are_coherent_with_already_collected = (p: StrPart, start: number) =>
        parts.find((cp) =>
            parts_crossed(p, cp.prev) ||
            are_not_coherent( {x: cp.prev.start, y: cp.next.start},  {x: p.start, y: start})
        ) === undefined;

    const can_be_collected = (p: StrPart, start: number, end: number) =>
        s1_part_not_already_used(p)
        && s2_indexes_not_already_used(start, end)
        && are_coherent_with_already_collected(p, start);

    let found = false;
    let next_index = 0;

    do {

        found = false;
        next_index = 0;

        toStrParts(s1).forEach((s1_part) => {

            if (s1_part.part.trim().length > 0 )  {

                let y = s2.substring(next_index).indexOf(s1_part.part);

                if (y !== -1) {

                        let start = next_index + y;
                        let end = start + s1_part.part.length - 1 ;

                        if (can_be_collected(s1_part, start, end)) {

                            let s2_part = {
                                start: start,
                                end: end,
                                part: s1_part.part
                            }

                            parts.push({
                                prev: s1_part,
                                next: s2_part
                            })

                            used.push(s1_part);
                            prev_used.push(parts_bound(s2_part));

                            next_index = end;
                            found = true;
                        }
                }
            }

        });

    } while (found);

    return parts.sort((a, b) => a.prev.start - b.prev.start);
}

export function fromStrCompareParts(s: string, parts: StrPart[]): StrPartDiff[] {

    console.log("parts =>  ", parts);

    let diffs: StrPartDiff[] = [];

    let i = 0;

    let retry = false;

    parts.forEach((part) => {

        do {
            retry = false;

            console.log(i)
            if (part.start > i) {

                diffs.push({
                    index: i,
                    value: s.substring(i, part.start),
                    changed: true
                });

                i = part.start;
                retry = true;
            } else {
                diffs.push({
                    index: part.start,
                    value: part.part,
                    changed: false
                });

                i = part.end + 1;
            }

        } while (retry);

    });

    if (i < s.length) {
        diffs.push({
            index: i,
            value: s.substring(i),
            changed: true
        });
    }

    return diffs;
}

export function compare(s1: string = "", s2: string = ""): StrCompareResult {

    if (s1 === s2)  {
      return {
            prev: [{
                index: 0,
                value: s1,
                changed: false
            }],
            next: [
                {
                    index: 0,
                    value: s2,
                    changed: false
                }
            ]
      }
    } else if(s1.length === 0 || s2.length === 0) {
        return {
            prev: [{
                index: 0,
                value: s1,
                changed: true
            }],
            next: [
                {
                    index: 0,
                    value: s2,
                    changed: true
                }
            ]
        }
    }

    let parts = buildCompareParts(s1, s2);

    return {
        prev: fromStrCompareParts(s1, parts.map((p) => p.prev)),
        next: fromStrCompareParts(s2, parts.map((p) => p.next))
    }
}