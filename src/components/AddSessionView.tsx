import {Component, createSignal} from "solid-js";
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

    const btnDisabled = () => {
        return sessionName() == null || sessionName()?.length == 0
    }

    return (
        <>
            <input
                placeholder="Session Name"
                class={styles.SessionNameInput}
                value={sessionName() || ""}
                oninput={(e) => {
                    if (e.currentTarget.value.length == 0) setSessionName(null)
                    else setSessionName(e.currentTarget.value)
                }}/>
            <button
                disabled={btnDisabled()}
                classList={{
                    [styles.Btn]: true,
                    [styles.Clickable] : !btnDisabled(),
                    [styles.Disabled]: btnDisabled(),
                }}
                onClick={() => startSession()}>START A NEW SESSION</button>
        </>
    )
}