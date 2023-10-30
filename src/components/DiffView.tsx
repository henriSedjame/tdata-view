import {Component, Show} from "solid-js";
import {DataPartDiff, DiffType} from "../data";
import styles from "../App.module.css";
import {collapsedDiffs} from "../state";

export interface DiffViewProps {
    diff: DataPartDiff;
    numberOfChilds: number;
    onExpand: (name: string) => void;
}

export const DiffView: Component<DiffViewProps> = (props) => {


    const expanded = () => {
        return !collapsedDiffs().includes(props.diff.fullName!)
    }

    const isExpandable = () => {
        return props.diff.prev === undefined && props.diff.next === undefined
    }

    const isVisible = () => expanded() || isExpandable()

    const sign = () => expanded() ? '-' : '+'

    const doClick = () => {
        props.onExpand(props.diff.fullName!)
    }

    const nbDiff = props.numberOfChilds > 1 ? `(${props.numberOfChilds} diffs)` :  `(${props.numberOfChilds} diff)`
    return (
        <Show when={isVisible()}>

            <div classList={{
                [styles.DiffBloc]: true,

            }}>
                <div>
                    <div classList={{
                        [styles.DiffAdded]: props.diff.diffType === DiffType.ADDED,
                        [styles.DiffRemoved]: props.diff.diffType === DiffType.REMOVED,
                        [styles.DiffChanged]: props.diff.diffType === DiffType.CHANGED,
                        [styles.DiffOther]: props.diff.prev === undefined,

                    }}></div>

                    <div data-tooltip={props.diff.prev?.toString()?.length > 50 ? props.diff.prev : undefined}>
                        <p class={styles.DiffValue}>{props.diff.prev?.toString()?.substring(0, 50)}</p>
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
                        <span class={styles.DiffSimpleName}>{props.diff.name }</span>
                        <Show when={!expanded()}>
                            <span class={styles.EmptyText}>--</span>
                            <span class={styles.Grey}>{nbDiff}</span>
                        </Show>

                    </div>
                    <div classList={{
                        [styles.DiffAdded]: props.diff.diffType === DiffType.ADDED,
                        [styles.DiffRemoved]: props.diff.diffType === DiffType.REMOVED,
                        [styles.DiffChanged]: props.diff.diffType === DiffType.CHANGED,
                        [styles.DiffName]: true,
                    }}></div>

                </div>

                <div>
                    <div
                        classList={{
                            [styles.DiffAdded]: props.diff.diffType === DiffType.ADDED,
                            [styles.DiffRemoved]: props.diff.diffType === DiffType.REMOVED,
                            [styles.DiffChanged]: props.diff.diffType === DiffType.CHANGED,
                            [styles.DiffOther]: props.diff.next === undefined,
                        }}
                    ></div>
                    <div data-tooltip={props.diff.next?.toString()?.length > 50 ? props.diff.prev : undefined}>
                        {props.diff.next?.toString()?.substring(0, 50)} </div>
                </div>

            </div>
        </Show>
    )
}