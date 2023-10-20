import {Component, For, Show} from "solid-js";
import {canCompare, isComparing, sessions, setIsComparing, setSessionToShow} from "../state";
import SessionView from "./SessionView";
import styles from "../App.module.css";

export const SessionList : Component = () => {

    const startComparison = () => {
        setIsComparing(true)
        setSessionToShow(null)
    }

    return (
        <>
            <h3> List of sessions </h3>
            <For each={sessions()}>
                {
                    (session) =>
                        (
                            <SessionView session={session} />
                        )
                }
            </For>

            <Show when={canCompare() && !isComparing()}>
                <button class={styles.CompareBtn} onclick={() => startComparison()}> START COMPARISON </button>
            </Show>
        </>
    )
}