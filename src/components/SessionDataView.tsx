import {Component, For, Show} from "solid-js";
import {Session} from "../models/session";
import styles from "../App.module.css";
import {schemaToShow, setCollapsed, setSchemaToShow} from "../models/state";
import {DataView} from "./DataView";
import {TooltipPosition, WithTooltip} from "./WithTooltip";

export interface SessionDataViewProps {
    session: Session
}

export const SessionDataView: Component<SessionDataViewProps> = (props) => {
    return (
        <div class={styles.SpaceBottom}>
            <div class={styles.Title}>
                <h3> LIST OF EVENTS</h3>
            </div>

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
                                            <WithTooltip tooltip="Hide the data structure"
                                                         position={TooltipPosition.BOTTOM}>
                                                <button
                                                    classList={{
                                                        [styles.IconBtn]: true,
                                                        [styles.Clickable]: true,
                                                    }}
                                                    onClick={() => {
                                                        setCollapsed([])
                                                        setSchemaToShow(null)
                                                    }}
                                                >
                                                <span classList={{
                                                    "material-icons": true,
                                                    [styles.Black]: true,
                                                }}>keyboard_arrow_up</span>
                                                </button>
                                            </WithTooltip>
                                        }
                                    >
                                        <WithTooltip tooltip="Show the data structure"
                                                     position={TooltipPosition.TOP}>
                                            <button
                                                classList={{
                                                    [styles.IconBtn]: true,
                                                    [styles.Clickable]: true,
                                                }}
                                                onclick={() => {
                                                    setCollapsed([])
                                                    setSchemaToShow(`${data.id}_${data.timpstamp}`)
                                                }}
                                            >  <span classList={{
                                                "material-icons": true,
                                                [styles.Black]: true,
                                            }}>keyboard_arrow_down</span>
                                            </button>
                                        </WithTooltip>
                                    </Show>
                                </div>
                                <Show when={schemaToShow() === `${data.id}_${data.timpstamp}`}>
                                    <DataView data={data.data}/>
                                </Show>
                            </>
                        )
                }
            </For>
        </div>
    )
}