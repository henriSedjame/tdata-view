import {Component, For, Show} from "solid-js";
import {Session} from "../data";
import styles from "../App.module.css";
import {schemaToShow, setCollapsed, setSchemaToShow} from "../state";
import {DataView} from "./DataView";

export interface SessionDataViewProps {
    session: Session
}

export const SessionDataView: Component<SessionDataViewProps> = (props) => {
    return (
        <>
            <h3> List of events</h3>

            <For each={props.session.datas}>
                {
                    (data) =>
                        (
                            <>
                                <div class={styles.EventItem}>
                                    <div>{data.id}</div>
                                    <Show
                                        when={schemaToShow() !== `${data.id}_${data.timpstamp}`}
                                        fallback={
                                            <button
                                                class={styles.HideBtn}
                                                onClick={() => {
                                                    setCollapsed([])
                                                    setSchemaToShow(null)
                                                }
                                            }
                                            > Hide schema</button>
                                        }
                                    >
                                        <button
                                            class={styles.ShowBtn}
                                            onclick={() => {
                                                setCollapsed([])
                                                setSchemaToShow(`${data.id}_${data.timpstamp}`)
                                            }
                                        }
                                        > Show schema
                                        </button>
                                    </Show>
                                </div>
                                <Show when={schemaToShow() === `${data.id}_${data.timpstamp}`}>
                                    <DataView data={data.data}/>
                                </Show>
                            </>
                        )
                }
            </For>
        </>
    )
}