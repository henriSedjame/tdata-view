import {Component, createSignal, For} from "solid-js";
import {DataPart, SessionData} from "../data";
import {partsOf} from "../utils";
import {DataPartView} from "./DataPartView";
import styles from "../App.module.css";

export interface DataViewProps {
    data: SessionData
}
export const DataView: Component<DataViewProps> = (props) => {


    const parts = partsOf(props.data)
    return (
            <div class={styles.DataView}>
                <For each={parts}>
                    {
                        (part: DataPart) =>
                            (
                                <DataPartView part={part}/>
                            )
                    }
                </For>
            </div>
        )

}