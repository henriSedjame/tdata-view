import {DataPartDiff, DiffType} from "../data";
import {Component, For, Show} from "solid-js";
import styles from "../App.module.css";
import {comparisonNum, setComparisonNum} from "../state";

export interface DiffLineViewProps {
    diffs: DataPartDiff[],
    num: number

}

export const DiffsView: Component<DiffLineViewProps> = (props) => {

    const className = (diff: DataPartDiff) => {
        switch (diff.diffType) {
            case DiffType.ADDED:
                return styles.Green;
            case DiffType.REMOVED:
                return styles.Red;
            case DiffType.CHANGED:
                return styles.Grey;
        }
    }

    return (
        <>
            <div class={styles.Diff}>
                <p class={styles.TextInfo}> {props.diffs.length} differences found </p>
                <Show
                    when={props.num == comparisonNum()}
                    fallback={
                        <button
                            class={styles.Btn}
                            onClick={() => setComparisonNum(props.num)}
                        > SHOW COMPARISON RESULTS </button>
                    }
                >

                    <button
                        class={styles.StopBtn}
                        onClick={() => setComparisonNum(null)}
                    > HIDE COMPARISON RESULTS
                    </button>

                    <For each={props.diffs}>
                        {
                            (partDiff) =>
                                (
                                    <>
                                        <div class={styles.DiffName}>
                                            {partDiff.name}
                                        </div>
                                        <div class={styles.DiffRow}>
                                            <div class={className(partDiff)}> {partDiff.prev}</div>
                                            <div class={className(partDiff)}> {partDiff.next}</div>
                                        </div>
                                    </>

                                )
                        }
                    </For>
                </Show>

            </div>


        </>
    )
}