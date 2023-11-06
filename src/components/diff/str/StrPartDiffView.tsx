import {Component, For} from "solid-js";
import {StrPartDiff} from "../../../models/str-diff";
import styles from "./StrPartDiff.module.css";
export interface StrPartDiffViewProps {
    diffs: StrPartDiff[]
}

export const StrPartDiffView: Component<StrPartDiffViewProps> = (props) => {

    return (
        <>
            <For each={props.diffs}>
                {diff => <span class={diff.changed ? styles.Changed : ''}>{diff.value}</span>}
            </For>
        </>
    )
}