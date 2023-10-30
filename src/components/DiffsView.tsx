import {DataPartDiff, DiffType} from "../data";
import {Component, createSignal, For, Show} from "solid-js";
import styles from "../App.module.css";
import {collapsedDiffs, comparisonNum, setCollapsedDiffs, setComparisonNum} from "../state";
import {DiffView} from "./DiffView";
import {TROW_ID_PREFIX} from "../constants";

export interface DiffLineViewProps {
    diffs: DataPartDiff[],
    num: number
}

export const DiffsView: Component<DiffLineViewProps> = (props) => {

    let unchangedDiffs = props.diffs.filter(d => d.diffType !== DiffType.UNCHANGED);

    const hasDiffs = unchangedDiffs.length > 0

    const expandedDiffs: DataPartDiff[] = []

    unchangedDiffs.forEach((diff) => {
        let fname = ""

        diff.name.split(".").forEach((namePart, index, ps) => {

            fname = index === 0 ? namePart : `${fname}.${namePart}`

            const pref = "___".repeat(index)

            if (index === (ps.length - 1)) {
                expandedDiffs.push({...diff, name: namePart, fullName: fname, prefix: pref})
            } else {
                if (expandedDiffs.find((d) => d.fullName === fname)) {
                    return;
                }
                expandedDiffs.push({
                    name: namePart, fullName: fname, prefix: pref, diffType: undefined, next: undefined, prev: undefined
                })
            }
        })
    });

    const expandAll = () => {
        setCollapsedDiffs([])
    }

    const collapseAll = () => {
        setCollapsedDiffs(expandedDiffs.filter(d => d.fullName!.split(".").length > 1 || (d.prev === undefined && d.next === undefined)).map(d => d.fullName!))
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
                    <span class={styles.TextInfo}> {unchangedDiffs.length} differences found </span>
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
                    <For each={expandedDiffs}>
                        {
                            (partDiff) =>
                                (
                                    <DiffView diff={partDiff}
                                              numberOfChilds={expandedDiffs.filter(d => d.fullName!.startsWith(partDiff.fullName!) && (d.next || d.prev)).length}
                                              onExpand={
                                                  (name) => {
                                                      let dataPartDiffs = expandedDiffs.filter(d => d.fullName!.startsWith(name)).map(d => d.fullName!);
                                                      if (collapsedDiffs().includes(name)) {
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