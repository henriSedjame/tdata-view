import {Component, For, Show} from "solid-js";
import {
    canCompare,
    isComparing,
    sessions, sessionsToCompare,
    setComparisonNum,
    setIsComparing,
    setSessionsToCompare,
    setSessionToShow
} from "../models/state";
import SessionView from "./SessionView";
import styles from "../App.module.css";
import Separator from "./Separator";
import {TooltipPosition, WithTooltip} from "./WithTooltip";

export const SessionList : Component = () => {

    const startComparison = () => {
        setIsComparing(true)
        setSessionToShow(null)
    }

    return (
        <>

            <div class={styles.Title}>
                <h2> LIST OF SESSIONS </h2>
            </div>

            <For each={sessions()}>
                {
                    (session) =>
                        (
                            <SessionView session={session} />
                        )
                }
            </For>

            <Show when={canCompare() && !isComparing()}>
                <WithTooltip tooltip="Compare selected sessions" position={TooltipPosition.BOTTOM}>
                <div
                    classList={{
                        [styles.Clickable]: true,
                        [styles.CompareLabel]: true,
                    }} onClick={startComparison}>

                    <div> {sessionsToCompare().first?.name ?? sessionsToCompare().first?.id}</div>
                     <span classList={{
                         "material-icons": true,
                         [styles.MediumBtn]: true,
                         [styles.White]: true,
                     }}>compare_arrows</span>
                    <div> {sessionsToCompare().second?.name ?? sessionsToCompare().second?.id}</div>
                </div>
                </WithTooltip>
            </Show>
        </>
    )
}