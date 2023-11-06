import {Component, For, Show} from "solid-js";
import {
    canCompare,
    isComparing,
    sessions, sessionsToCompare,
    setIsComparing,
    setSessionToShow
} from "../../models/state";
import SessionItemView from "./session-item/SessionItem.view";
import g_styles from "../../App.module.css";
import styles from "./Session.module.css";
import {TooltipPosition, WithTooltip} from "../with-tooltip/WithTooltip";

export const SessionListView : Component = () => {

    const startComparison = () => {
        setIsComparing(true)
        setSessionToShow(null)
    }

    return (
        <>

            <div class={g_styles.Title}>
                <h2> LIST OF SESSIONS </h2>
            </div>

            <For each={sessions()}>
                {
                    (session) =>
                        (
                            <SessionItemView session={session} />
                        )
                }
            </For>

            <Show when={canCompare() && !isComparing()}>
                <WithTooltip tooltip="Compare selected sessions" position={TooltipPosition.BOTTOM}>
                <div
                    classList={{
                        [g_styles.Clickable]: true,
                        [styles.CompareLabel]: true,
                    }} onClick={startComparison}>

                    <div> {sessionsToCompare().first?.name ?? sessionsToCompare().first?.id}</div>
                     <span classList={{
                         "material-icons": true,
                         [g_styles.MediumBtn]: true,
                         [g_styles.White]: true,
                     }}>compare_arrows</span>
                    <div> {sessionsToCompare().second?.name ?? sessionsToCompare().second?.id}</div>
                </div>
                </WithTooltip>
            </Show>
        </>
    )
}