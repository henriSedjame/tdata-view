import {Component, For, Show} from "solid-js";
import {Session} from "../../../models/session";
import g_styles from "../../../App.module.css";
import styles from "./SessionItem.module.css";
import {schemaToShow, setCollapsed, setSchemaToShow} from "../../../models/state";
import {DataView} from "../../data/Data.view";
import {TooltipPosition, WithTooltip} from "../../with-tooltip/WithTooltip";

export interface SessionDataViewProps {
    session: Session
}

export const SessionDataView: Component<SessionDataViewProps> = (props) => {
    return (
        <div class={g_styles.SpaceBottom}>
            <div class={g_styles.Title}>
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
                                        when={schemaToShow() !== `${data.id}_${data.timestamp}`}
                                        fallback={
                                            <WithTooltip tooltip="Hide the data structure"
                                                         position={TooltipPosition.BOTTOM}>
                                                <button
                                                    classList={{
                                                        [g_styles.IconBtn]: true,
                                                        [g_styles.Clickable]: true,
                                                    }}
                                                    onClick={() => {
                                                        setCollapsed([])
                                                        setSchemaToShow(null)
                                                    }}
                                                >
                                                <span classList={{
                                                    "material-icons": true,
                                                    [g_styles.Black]: true,
                                                }}>keyboard_arrow_up</span>
                                                </button>
                                            </WithTooltip>
                                        }
                                    >
                                        <WithTooltip tooltip="Show the data structure"
                                                     position={TooltipPosition.TOP}>
                                            <button
                                                classList={{
                                                    [g_styles.IconBtn]: true,
                                                    [g_styles.Clickable]: true,
                                                }}
                                                onclick={() => {
                                                    setCollapsed([])
                                                    setSchemaToShow(`${data.id}_${data.timestamp}`)
                                                }}
                                            >  <span classList={{
                                                "material-icons": true,
                                                [g_styles.Black]: true,
                                            }}>keyboard_arrow_down</span>
                                            </button>
                                        </WithTooltip>
                                    </Show>
                                </div>
                                <Show when={schemaToShow() === `${data.id}_${data.timestamp}`}>
                                    <DataView data={data.data}/>
                                </Show>
                            </>
                        )
                }
            </For>
        </div>
    )
}