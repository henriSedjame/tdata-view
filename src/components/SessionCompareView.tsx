import {Component, For, Show} from "solid-js";
import {sessions, sessionsToCompare, setComparisonNum, setIsComparing, setSessionsToCompare} from "../state";
import styles from "../App.module.css";
import {TableRowData} from "../data";
import {partDiffsOf} from "../utils";
import {DiffsView} from "./DiffsView";

export const SessionCompareView: Component = () => {
    let dataTable = () => {
        let tdatas: TableRowData[] = [];

        let first = sessionsToCompare().first!;
        let second = sessionsToCompare().second!;

        let largest = (first.datas.length > second.datas.length ? first : second).datas;
        let smallest = (first.datas.length > second.datas.length ? second : first).datas;

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
        <>
            <h3> Compare two sessions </h3>
            <table>
                <thead>
                    <tr>
                        <td><b>SESSION #{sessionsToCompare().first!.id}</b></td>
                        <td><b>SESSION #{sessionsToCompare().second!.id}</b></td>
                    </tr>
                </thead>
                <tbody>
                <For each={dataTable()}>
                    {
                        (rowData) =>
                            (
                                <>
                                    <tr>
                                        <For each={rowData.datas}>
                                            {
                                                (data) =>
                                                    (
                                                        <Show when={data} fallback={(<td class={styles.EmptyText}> ... </td>)}>
                                                            <td>{data?.id}</td>
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
            <button class={styles.StopCompareBtn} onClick={stopComparison}> STOP COMPARISON</button>
        </>
    )
}