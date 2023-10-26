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
                return styles.White;
        }
    }

    const hasDiffs = props.diffs.length > 0
    return (
        <Show when={hasDiffs}>
            <div class={styles.Diff}>
                <div class={styles.DiffHead}>
                    <span class={styles.TextInfo}> {props.diffs.length} differences found </span>
                    <Show
                        when={props.num == comparisonNum()}
                        fallback={
                            <button
                                data-tooltip="Show differences"
                                classList={{
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: true,
                                }}
                                onClick={() => setComparisonNum(props.num)}
                            >
                            <span classList={{
                                "material-icons": true,
                                [styles.White]: true,
                            }}>keyboard_arrow_down</span>
                            </button>
                        }
                    >
                        <button
                            data-tooltip="Hide differences"
                            classList={{
                                [styles.IconBtn]: true,
                                [styles.Clickable]: true,
                            }}
                            onClick={() => setComparisonNum(null)}
                        >
                        <span classList={{
                            "material-icons": true,
                            [styles.White]: true,
                        }}>keyboard_arrow_up</span>
                        </button>
                    </Show>
                </div>

                <Show when={props.num == comparisonNum()}>
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
        </Show>
    )
}