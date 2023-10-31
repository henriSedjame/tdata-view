import {Component, Show} from "solid-js";
import {DataPartDiff, DiffType, ShowDiffType} from "../data";
import styles from "../App.module.css";
import {collapsedDiffs, showDiffType} from "../state";
import {hasValue, isUnchanged, last} from "../utils";

export interface DiffViewProps {
    diff: DataPartDiff;
    numberOfChilds: number;
    onExpand: () => void;
}

export const DiffView: Component<DiffViewProps> = (props) => {


    const expanded = () => {
        return !collapsedDiffs().includes(props.diff.name)
    }

    const isExpandable = () => {
        return props.diff.prev === undefined && props.diff.next === undefined
    }

    const isVisible = () => expanded() || isExpandable()

    const sign = () => expanded() ? '-' : '+'

    const doClick = () => {
        props.onExpand()
    }

    const nbDiff = props.numberOfChilds > 1 ? `(${props.numberOfChilds} diffs)` :  `(${props.numberOfChilds} diff)`

    const shouldShow = () => {
        let ty = showDiffType()
        if (ty === ShowDiffType.ALL) return true

        switch (props.diff.diffType) {
            case DiffType.ADDED:
                return ty === ShowDiffType.ADDED || ty === ShowDiffType.CHANGED;
            case DiffType.REMOVED:
                return ty === ShowDiffType.REMOVED || ty === ShowDiffType.CHANGED;
            case DiffType.CHANGED:
                return ty === ShowDiffType.CHANGED;
            default:
                return !hasValue(props.diff) && props.numberOfChilds > 0;
        }
    }
    return (
        <Show when={isVisible() && shouldShow()}>

            <div classList={{
                [styles.DiffBloc]: true,

            }}>
                <div>
                    <div classList={{
                        [styles.DiffAdded]: props.diff.diffType === DiffType.ADDED,
                        [styles.DiffRemoved]: props.diff.diffType === DiffType.REMOVED,
                        [styles.DiffChanged]: props.diff.diffType === DiffType.CHANGED,
                        [styles.DiffUnChanged]: props.diff.diffType === DiffType.UNCHANGED,
                        [styles.DiffOther]: props.diff.prev === undefined,

                    }}></div>

                    <div data-tooltip={props.diff.prev?.toString()?.length > 30 ? props.diff.prev : undefined}>
                        <p class={styles.DiffValue}>{props.diff.prev?.toString()?.substring(0, 30)}</p>
                    </div>

                </div>

                <div>
                    <div>
                        <span class={styles.EmptyText}>{props.diff.prefix}</span>
                        <Show when={isExpandable()}>
                            <span classList={{
                                [styles.Clickable]: true
                            }} onclick={doClick}>{sign()}</span> <span class={styles.EmptyText}>-</span>
                        </Show>
                        <span class={styles.DiffSimpleName} data-tooltip = {props.diff.name} >{ last(props.diff.name) }</span>
                        <Show when={!expanded() && props.numberOfChilds > 0}>
                            <span class={styles.EmptyText}>--</span>
                            <span class={styles.Grey}>{nbDiff}</span>
                        </Show>

                    </div>
                    <div classList={{
                        [styles.DiffAdded]: props.diff.diffType === DiffType.ADDED,
                        [styles.DiffRemoved]: props.diff.diffType === DiffType.REMOVED,
                        [styles.DiffChanged]: props.diff.diffType === DiffType.CHANGED,
                        [styles.DiffUnChanged]: props.diff.diffType === DiffType.UNCHANGED,
                        [styles.DiffName]: true,
                    }}></div>

                </div>

                <div>
                    <div
                        classList={{
                            [styles.DiffAdded]: props.diff.diffType === DiffType.ADDED,
                            [styles.DiffRemoved]: props.diff.diffType === DiffType.REMOVED,
                            [styles.DiffChanged]: props.diff.diffType === DiffType.CHANGED,
                            [styles.DiffUnChanged]: props.diff.diffType === DiffType.UNCHANGED,
                            [styles.DiffOther]: props.diff.next === undefined,
                        }}
                    ></div>
                    <div data-tooltip={props.diff.next?.toString()?.length > 30 ? props.diff.prev : undefined}>
                        {props.diff.next?.toString()?.substring(0, 30)} </div>
                </div>

            </div>
        </Show>
    )
}