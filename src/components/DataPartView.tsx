import {Component,  For, Show} from "solid-js";
import {DataPart} from "../models/data-part";
import {isObject} from "../logics/utils";
import styles from "../App.module.css";
import {collapse} from "../logics/services";
import {collapsed} from "../models/state";

export interface DataPartViewProps {
    part: DataPart,
    parentName?: string
}

export const DataPartView: Component<DataPartViewProps> = (props) => {
    const isObj = isObject(props.part.data)

    let fullName = props.parentName ? `${props.parentName}.${props.part.name}` : props.part.name

    const value =  isObj ? " { ... }" : props.part.data

    const isCollapsed = () => {
        return collapsed().includes(fullName)
    }

    return (
        <div class={styles.DataPartBloc}>
            <Show when={isObj}>
                <b onclick={() => collapse(fullName)} class={styles.Collapse}>
                    <Show when={isCollapsed()} fallback={ <span>+</span> }>
                        <span>-</span>
                    </Show>
                </b>
            </Show>
            <span class={styles.PartName}> {props.part.name} </span> <span class={styles.Grey}> : </span>
                <Show
                    when={isObj && isCollapsed()}
                    fallback={ <span class={styles.PartValue}> {value} </span> }
                >
                    <For each={props.part.data}>
                        {
                            (dpart) => <div class={styles.DataPartBloc}>
                                <DataPartView part={dpart} parentName={props.part.name}/>
                            </div>
                        }
                    </For>
                </Show>

        </div>
    )
}