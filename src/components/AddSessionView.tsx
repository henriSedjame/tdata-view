import {Component, createSignal, Show} from "solid-js";
import styles from "../App.module.css";
import {currentSessionId, lastSessionId, refetch, setCurrentSessionId, setLastSessionId} from "../state";
import {CURRENT_SESSION_ID} from "../constants";
import {addNewSession} from "../services";


export const AddSessionView: Component = () => {

    const [sessionName, setSessionName] = createSignal<string | null>(null)
    const startSession = () => {
        let id = (lastSessionId() || 0) + 1;
        setCurrentSessionId(id)
        setLastSessionId(currentSessionId())
        localStorage.setItem(CURRENT_SESSION_ID, id.toString())
        addNewSession(id, sessionName()!)
        refetch()
    }

    const stopSession = () => {
        setCurrentSessionId(undefined)
        localStorage.removeItem(CURRENT_SESSION_ID)
        setSessionName(null)
    }

    const btnDisabled = () => {
        return sessionName() == null || sessionName()?.length == 0
    }

    return (
        <>
            <Show when={currentSessionId()} fallback= {
                <>
                    <input
                        placeholder="Session Name"
                        class={styles.SessionNameInput}
                        value={sessionName() || ""}
                        onInput={(e) => {
                            if (e.currentTarget.value.length == 0) setSessionName(null)
                            else setSessionName(e.currentTarget.value)
                        }}/>
                    <button
                        disabled={btnDisabled()}
                        classList={{
                            [styles.Btn]: true,
                            [styles.Clickable]: !btnDisabled(),
                            [styles.Disabled]: btnDisabled(),
                        }}
                        onClick={() => startSession()}>START A NEW SESSION
                    </button>
                </>
            }>
                <h3> Current Session : {sessionName()}</h3>

                <button class={styles.StopBtn} onClick={() => stopSession()}>STOP SESSION</button>
            </Show>

        </>
    )
}