import {Component, For, Show} from "solid-js";
import {canCompare, isComparing, sessions, setIsComparing, setSessionToShow} from "../state";
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
                <button class={styles.CompareBtn} onclick={() => startComparison()}> START COMPARISON </button>
            </Show>
        </>
    )
}