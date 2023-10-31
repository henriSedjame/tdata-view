import {DataPartDiff, ShowDiffType} from "../data";
import {Component, For, Show} from "solid-js";
import styles from "../App.module.css";
import {
    collapsedDiffs,
    comparisonNum,
    setCollapsedDiffs,
    setComparisonNum,
    setShowDiffType,
    showDiffType
} from "../state";
import {DiffView} from "./DiffView";
import {TROW_ID_PREFIX} from "../constants";
import {hasValue, isCollapsable, isParentOf, isUnchanged} from "../utils";

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
                            <button
                                data-tooltip="Show differences"
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
                        }
                    >
                        <button
                            data-tooltip="Hide differences"
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
                    </Show>
                </div>

                <Show when={props.num == comparisonNum()}>
                    <div class={styles.ExpandBtnsBloc}>
                        <div>
                            <button
                                data-tooltip="Show ADDED only"
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

                            <div classList={{
                                [styles.BtnSeparator]: true,
                                [styles.BlackSep]: true,
                            }}></div>

                            <button
                                data-tooltip="Show CHANGED only"
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
                            <div classList={{
                                [styles.BtnSeparator]: true,
                                [styles.BlackSep]: true,
                            }}></div>
                            <button
                                data-tooltip="Show REMOVED only"
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
                        </div>
                        <div>
                            <button
                                data-tooltip="Expand All"
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

                            <div classList={{
                                [styles.BtnSeparator]: true,
                                [styles.BlackSep]: true,
                            }}></div>

                            <button
                                data-tooltip="Collapse All"
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