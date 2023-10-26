import {Component, For, Show} from "solid-js";
import {
    canCompare,
    isComparing,
    sessions,
    setComparisonNum,
    setIsComparing,
    setSessionsToCompare,
    setSessionToShow
} from "../state";
import SessionView from "./SessionView";
import styles from "../App.module.css";
import Separator from "./Separator";

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
                <button
                    data-tooltip="Compare selected sessions"
                    classList={{
                    [styles.IconBtn]: true,
                    [styles.Clickable]: true,
                    [styles.CompareBtn]: true,
                }} onclick={startComparison}>
                     <span classList={{
                         "material-icons": true,
                         [styles.MediumBtn]: true,
                         [styles.White]: true,
                     }}>compare_arrows</span>
                </button>
            </Show>

        </>
    )
}