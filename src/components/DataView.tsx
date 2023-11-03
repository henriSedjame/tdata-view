import {Component, For} from "solid-js";
import {DataPart} from "../models/data-part";
import {partsOf} from "../logics/utils";
import {DataPartView} from "./DataPartView";
import styles from "../App.module.css";
import {SessionData} from "../models/session";

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