import {ShowDiffType} from "../models/view";
import {Component, For, Show} from "solid-js";
import styles from "../App.module.css";
import {
    collapsedDiffs,
    comparisonNum,
    setCollapsedDiffs,
    setComparisonNum,
    setShowDiffType,
    showDiffType
} from "../models/state";
import {DiffView} from "./DiffView";
import {TROW_ID_PREFIX} from "../models/constants";
import {hasValue, isCollapsable, isParentOf, isUnchanged} from "../logics/utils";
import {TooltipPosition, WithTooltip} from "./WithTooltip";
import {DataPartDiff} from "../models/diff";

export interface DiffsViewProps {
    diffs: DataPartDiff[],
    num: number
}

export const DiffsView: Component<DiffsViewProps> = (props) => {

    let diffsLength = props.diffs.filter(d => !isUnchanged(d)).length;

    const hasDiffs = diffsLength > 0

    const expandedDiffs: DataPartDiff[] = []

    props.diffs.forEach((diff) => {
        let fname = ""

        diff.name.split(".").forEach((namePart, index, ps) => {

            fname = index === 0 ? namePart : `${fname}.${namePart}`

            const pref = "___".repeat(index)

            if (index === (ps.length - 1)) {
                expandedDiffs.push({...diff, name: fname, prefix: pref})
            } else {
                if (expandedDiffs.find((d) => d.name === fname)) {
                    return;
                }
                expandedDiffs.push({
                    name: fname, prefix: pref, diffType: undefined, next: undefined, prev: undefined
                })
            }
        })
    });

    const expandAll = () => {
        setCollapsedDiffs([])
    }

    const collapseAll = () => {
        setCollapsedDiffs(expandedDiffs.filter(isCollapsable).map(d => d.name))
    }


    const showAdded = () => show(ShowDiffType.ADDED)
    const showRemoved = () => show(ShowDiffType.REMOVED)
    const showChanged = () => show(ShowDiffType.CHANGED)



    const show = (ty: ShowDiffType) => {
        if (showDiffType() === ty) {
            setShowDiffType(ShowDiffType.ALL)
        } else {
            setShowDiffType(ty)
        }
    }
    return (
        <Show when={hasDiffs}
              fallback={
                  <div class={styles.DiffHead}>
                      <b classList={{
                          [styles.Green]: true,
                      }}> Events are identical </b>
                  </div>
              }
        >
            <div class={styles.Diff}>
                <div class={styles.DiffHead}>
                    <span class={styles.TextInfo}> {diffsLength} differences found </span>
                    <Show
                        when={props.num == comparisonNum()}
                        fallback={
                            <WithTooltip tooltip="Show differences" position={TooltipPosition.TOP}>
                            <button
                                classList={{
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: true,
                                }}
                                onClick={() => {
                                    location.hash = `#${TROW_ID_PREFIX}${props.num}`
                                    setCollapsedDiffs([])
                                    setComparisonNum(props.num)
                                }}
                            >
                            <span classList={{
                                "material-icons": true,
                                [styles.White]: true,
                            }}>keyboard_arrow_down</span>
                            </button>
                            </WithTooltip>
                        }
                    >
                        <WithTooltip tooltip="Hide differences" position={TooltipPosition.BOTTOM}>
                        <button

                            classList={{
                                [styles.IconBtn]: true,
                                [styles.Clickable]: true,
                            }}
                            onClick={() => {
                                setCollapsedDiffs([])
                                setComparisonNum(null)
                            }}
                        >
                        <span classList={{
                            "material-icons": true,
                            [styles.White]: true,
                        }}>keyboard_arrow_up</span>
                        </button>
                        </WithTooltip>
                    </Show>
                </div>

                <Show when={props.num == comparisonNum()}>
                    <div class={styles.ExpandBtnsBloc}>
                        <div>
                            <WithTooltip tooltip="Show ADDED only" position={TooltipPosition.LEFT}>
                            <button
                                classList={{
                                    "tooltip-left": true,
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: true,
                                }}
                                onClick={showAdded}>
                        <span classList={{
                            "material-icons": true,
                            [styles.Green]: true,
                        }}>arrow_right_alt</span>
                            </button>
                            </WithTooltip>

                            <div classList={{
                                [styles.BtnSeparator]: true,
                                [styles.BlackSep]: true,
                            }}></div>

                            <WithTooltip tooltip="Show CHANGED only" position={TooltipPosition.TOP}>
                            <button
                                classList={{
                                    "tooltip-left": true,
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: true,
                                }}
                                onClick={showChanged}>
                        <span classList={{
                            "material-icons": true,
                            [styles.LightGrey]: true,
                        }}>compare_arrows</span>
                            </button>
                            </WithTooltip>
                            <div classList={{
                                [styles.BtnSeparator]: true,
                                [styles.BlackSep]: true,
                            }}></div>

                            <WithTooltip tooltip="Show REMOVED only" position={TooltipPosition.RIGHT}>
                            <button
                                classList={{
                                    "tooltip-left": true,
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: true,
                                }}
                                onClick={showRemoved}>
                        <span classList={{
                            "material-icons": true,
                            [styles.Red]: true,
                            [styles.Revert]: true,
                        }}>arrow_right_alt</span>
                            </button>
                            </WithTooltip>
                        </div>
                        <div>
                            <WithTooltip tooltip="Expand All" position={TooltipPosition.LEFT}>
                            <button
                                classList={{
                                    "tooltip-left": true,
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: true,
                                }}
                                onClick={expandAll}>
                        <span classList={{
                            "material-icons": true,
                            [styles.Black]: true,
                        }}>unfold_more</span>
                            </button>
                            </WithTooltip>
                            <div classList={{
                                [styles.BtnSeparator]: true,
                                [styles.BlackSep]: true,
                            }}></div>

                            <WithTooltip tooltip="Collapse All" position={TooltipPosition.RIGHT}>
                            <button
                                classList={{
                                    "tooltip-left": true,
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: true,
                                }}
                                onClick={collapseAll}>
                        <span classList={{
                            "material-icons": true,
                            [styles.Black]: true,

                        }}>unfold_less</span>
                            </button>
                            </WithTooltip>
                        </div>
                    </div>
                    <For each={expandedDiffs}>
                        {
                            (partDiff) =>
                                (
                                    <DiffView diff={partDiff}
                                              numberOfChilds={expandedDiffs.filter(d => isParentOf(partDiff, d) && hasValue(d) && !isUnchanged(d)).length}
                                              onExpand={
                                                  () => {
                                                      let dataPartDiffs = expandedDiffs.filter(d => isParentOf(partDiff, d)).map(d => d.name);

                                                      if (collapsedDiffs().includes(partDiff.name)) {
                                                          setCollapsedDiffs(
                                                              collapsedDiffs().filter(d => !dataPartDiffs.includes(d))
                                                          )
                                                      } else {
                                                          setCollapsedDiffs(
                                                              [...collapsedDiffs(), ...dataPartDiffs]
                                                          )
                                                      }
                                                  }
                                              }
                                    />
                                )
                        }
                    </For>
                </Show>

            </div>
        </Show>
    )
}