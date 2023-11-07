import {Component, Show} from "solid-js";
import {ShowDiffType} from "../../../models/view";
import g_styles from "../../../App.module.css";
import styles from "./DiffItem.module.css";
import {collapsedDiffs, showDiffType} from "../../../models/state";
import {hasValue, last, short, tooltip} from "../../../logics/utils";
import {DataPartDiff, DiffType} from "../../../models/diff";
import {compare} from "../../../logics/utils/str-diff-utils";
import {StrPartDiffView} from "../str/StrPartDiffView";
import {TooltipPosition, WithTooltip} from "../../with-tooltip/WithTooltip";

export interface DiffItemViewProps {
    diff: DataPartDiff;
    numberOfChilds: number;
    onExpand: () => void;
}

export const DiffItemView: Component<DiffItemViewProps> = (props) => {

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

    const isUnchangedDiff = () => {
        return props.diff.diffType === DiffType.UNCHANGED || (props.diff.next === undefined || props.diff.prev === undefined)
    }

    let compareResult = compare(props.diff.prev?.toString(), props.diff.next?.toString())

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


                    <WithTooltip tooltip={ tooltip(props.diff.prev?.toString()) } position={TooltipPosition.BOTTOM}>
                        <div>
                            <Show when={isUnchangedDiff()}
                                  fallback={<StrPartDiffView diffs={compareResult.prev}/>}
                            >
                                <p class={styles.DiffValue}>{short(props.diff.prev?.toString())}</p>
                            </Show>
                        </div>
                    </WithTooltip>


                </div>

                <div>
                    <div>
                        <span class={g_styles.EmptyText}>{props.diff.prefix}</span>
                        <Show when={isExpandable()}>
                            <span classList={{
                                [g_styles.Clickable]: true
                            }} onclick={doClick}>{sign()}</span> <span class={g_styles.EmptyText}>-</span>
                        </Show>
                        <WithTooltip tooltip={ props.diff.name} position={TooltipPosition.TOP}>
                            <span data-tooltip = {props.diff.name} >{ last(props.diff.name) }</span>
                        </WithTooltip>
                        <Show when={!expanded() && props.numberOfChilds > 0}>
                            <span class={g_styles.EmptyText}>--</span>
                            <span class={g_styles.Grey}>{nbDiff}</span>
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

                    <WithTooltip tooltip={ tooltip(props.diff.next?.toString()) } position={TooltipPosition.BOTTOM}>
                        <div>
                            <Show when={isUnchangedDiff()}
                                  fallback={<StrPartDiffView diffs={compareResult.next}/>}
                            >
                                <p class={styles.DiffValue}>{short(props.diff.next?.toString())}</p>
                            </Show>
                        </div>
                    </WithTooltip>

                </div>

            </div>
        </Show>
    )
}