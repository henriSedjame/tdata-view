import {Component, For, Show} from "solid-js";
import {sessionsToCompare, setComparisonNum, setIsComparing, setSessionsToCompare} from "../models/state";
import styles from "../App.module.css";
import {TableRowData} from "../models/view";
import {partDiffsOf} from "../logics/utils";
import {DiffsView} from "./DiffsView";
import {TROW_ID_PREFIX} from "../models/constants";

export const SessionCompareView: Component = () => {

    let first = sessionsToCompare().first!;
    let second = sessionsToCompare().second!;

    let session1 = first.datas.length > second.datas.length ? first : second;
    let session2 = first.datas.length > second.datas.length ? second : first;

    let dataTable = () => {
        let tdatas: TableRowData[] = [];

        let largest = session1.datas;
        let smallest = session2.datas;

        largest.forEach((data, index) => {
            let trow: TableRowData = {
                num: index,
                datas: [],
                diffs: []
            }

            trow.datas.push(data)

            let sdata = smallest.find((d) => d.id === data.id);

            if (sdata) {
                trow.datas.push(sdata)
                smallest = smallest.filter((d) => d.id !== sdata?.id && d.timpstamp !== sdata?.timpstamp)
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

    const stopComparison = () => {
        setIsComparing(false)
        setSessionsToCompare({
            first: null,
            second: null
        })
        setComparisonNum(null)
    }

    return (
        <div class={styles.SessionCompare}>
            <div class={styles.Title}>
                <h2> SESSIONS COMPARISON </h2>
            </div>

            <button
                data-tooltip="Clear comparison"
                classList={{
                    [styles.IconBtn]: true,
                    [styles.Clickable]: true,
                    [styles.ClearComparisonButton]: true,
                }} onClick={stopComparison}>
                     <span classList={{
                         "material-icons": true,
                         [styles.BigBtn]: true,
                         [styles.LightGrey]: true,
                     }}>cancel</span>
            </button>

            <table class={styles.SpaceTop}>
                <thead>
                    <tr>
                        <td><b>{session1.name}</b></td>
                        <td><b>{session2.name}</b></td>
                    </tr>
                </thead>
                <tbody>
                <For each={dataTable()}>
                    {
                        (rowData) =>
                            (
                                <>
                                    <tr id={TROW_ID_PREFIX + rowData.num}>
                                        <For each={rowData.datas}>
                                            {
                                                (data) =>
                                                    (
                                                        <Show when={data}
                                                              fallback={(<td class={styles.EmptyText}> ... </td>)}>
                                                            <td class={styles.LightGrey}>{data?.id}</td>
                                                        </Show>
                                                    )
                                            }
                                        </For>
                                    </tr>

                                    <tr>
                                        <td colSpan={rowData.datas.length}>
                                            <DiffsView diffs={rowData.diffs} num={rowData.num}/>
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