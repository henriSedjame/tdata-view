import {Component, createSignal, For} from "solid-js";
import {sessionsToCompare, setComparisonNum, setIsComparing, setSessionsToCompare} from "../../models/state";
import g_styles from "../../App.module.css";
import styles from "./SessionCompare.module.css";
import {TableRowData} from "../../models/view";
import {partDiffsOf} from "../../logics/utils";
import {DiffListView} from "../diff/DiffList.view";
import {TROW_ID_PREFIX} from "../../models/constants";
import {DiffType} from "../../models/diff";
import {TooltipPosition, WithTooltip} from "../with-tooltip/WithTooltip";

export const SessionCompareView: Component = () => {

    const [revert, setRevert] = createSignal(false);

    let first = sessionsToCompare().first!;
    let second = sessionsToCompare().second!;

    let session1 = first.datas.length >= second.datas.length ? first : second;
    let session2 = first.datas.length >= second.datas.length ? second : first;

    console.log("session1", session1)
    console.log("session2", session2)
    let dataTable = () => {
        let tdatas: TableRowData[] = [];

        let largest = session1.datas;
        let smallest = session2.datas;

        largest.forEach((data, index) => {
            let trow: TableRowData = {
                num: index,
                id: data.id,
                datas: [],
                diffs: []
            }

            trow.datas.push(data)

            let sdata = smallest.find((d) => d.id === data.id);

            if (sdata) {
                trow.datas.push(sdata)
                smallest = smallest.filter((d) => d !== sdata)
            } else {
                trow.datas.push(undefined)
            }


            tdatas.push({
                ...trow,
                diffs: partDiffsOf(
                    trow.datas[0]?.data,
                    trow.datas[1]?.data
                )
            })
        })

        return tdatas;
    }

    let s1 = () => revert() ? session2 : session1
    let s2 = () => revert() ? session1 : session2

    const switchDiffType = (type: DiffType| undefined) => {
        switch (type) {
            case DiffType.ADDED:
                return DiffType.REMOVED
            case DiffType.REMOVED:
                return DiffType.ADDED
            default:
                return type
        }
    }

    let datas = () => revert() ? dataTable().map(d =>  {
        return {
            ...d,
            datas: d.datas.reverse(),
            diffs: d.diffs.map(diff => {
                return {
                    ...diff,
                    diffType: switchDiffType(diff.diffType),
                    prev: diff.next,
                    next: diff.prev
                }
            })
        }
    }) : dataTable()


    const stopComparison = () => {
        setIsComparing(false)
        setSessionsToCompare({
            first: null,
            second: null
        })
        setComparisonNum(null)
        location.hash = ""
    }

    return (
        <div style={{
            "padding-bottom": "20px"
        }}>
            <div class={g_styles.Title}>
                <h2> SESSIONS COMPARISON </h2>
            </div>


            <button
                classList={{
                    [g_styles.Btn]: true,
                    [g_styles.Clickable]: true,
                    [styles.ClearComparisonButton]: true,
                }} onClick={stopComparison}>
                CLEAR COMPARISON
            </button>


            <table class={g_styles.SpaceTop}>
                <thead>
                <tr>
                    <td class={styles.Thead}><b>{s1().name}</b></td>
                    <td style={{
                        "background-color": "transparent",
                    }}>
                        <WithTooltip tooltip="SWITCH" position={TooltipPosition.TOP}>
                            <button classList={{
                                [g_styles.IconBtn]: true,
                                [g_styles.Clickable]: true,
                                [g_styles.MediumBtn]: true,
                            }} onClick={() => setRevert(!revert())}>
                            <span classList={{
                                "material-icons": true,
                                [g_styles.White]: true,
                            }}>sync_alt</span>
                            </button>
                        </WithTooltip>

                    </td>
                    <td class={styles.Thead}><b>{s2().name}</b></td>
                </tr>
                </thead>
                <tbody>
                <For each={datas()}>
                    {
                        (rowData) =>
                            (
                                <>
                                    <tr id={TROW_ID_PREFIX + rowData.num}>
                                        <td colSpan={rowData.datas.length + 1}  class={g_styles.White}>
                                            {rowData.id}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={rowData.datas.length + 1}>
                                            <DiffListView diffs={rowData.diffs} num={rowData.num}/>
                                        </td>
                                    </tr>

                                </>
                            )
                    }
                </For>
                </tbody>

            </table>

        </div>
    )
}