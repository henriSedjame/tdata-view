import {Component, Show} from "solid-js";
import styles from "../App.module.css";
import {
    currentSessionId,
    lastSessionId,
    refetch,
    sessionName,
    setCurrentSessionId,
    setLastSessionId,
    setSessionName
} from "../models/state";
import {CURRENT_SESSION_ID, LAST_TIMESTAMP} from "../models/constants";
import {addNewSession} from "../logics/services";
import {TooltipPosition, WithTooltip} from "./WithTooltip";


export const AddSessionView: Component = () => {
    const disableStartBtn = () => {
        return sessionName() == null || sessionName()?.length == 0 || !disableStopBtn()
    }

    const disableStopBtn = () => {
        return currentSessionId() == undefined || currentSessionId() == null
    }

    const startSession = () => {
        let id = (lastSessionId() || 0) + 1;
        setCurrentSessionId(id)
        setLastSessionId(currentSessionId())
        localStorage.setItem(CURRENT_SESSION_ID, id.toString())
        localStorage.setItem(LAST_TIMESTAMP, String(new Date().getTime()));
        addNewSession(id, sessionName()!)

        refetch()
    }

    const stopSession = () => {
        setCurrentSessionId(undefined)
        localStorage.removeItem(CURRENT_SESSION_ID)
        setSessionName(null)
    }

    return (
        <div class={styles.AddSession}>
            <Show when={currentSessionId()} fallback={
                <div>
                    <div>
                        <input
                            placeholder="Enter a session name"
                            class={styles.SessionNameInput}
                            value={sessionName() || ""}
                            onInput={(e) => {
                                if (e.currentTarget.value.length == 0) setSessionName(null)
                                else setSessionName(e.currentTarget.value)
                            }}/>
                    </div>


                </div>
            }>
                <div class={styles.SessionName} >
                    <div> CURRENT SESSION</div>
                    <h2 class={styles.Grey}> {sessionName()} </h2>
                </div>

            </Show>

            <div class={styles.AddSessionBtnsBloc}>

            <WithTooltip tooltip="Start a new session" disabled={disableStartBtn()}
                             position={TooltipPosition.BOTTOM}>
                    <button
                        disabled={disableStartBtn()}
                        classList={{
                            "tooltip-left": true,
                            [styles.IconBtn]: true,
                            [styles.Clickable]: !disableStartBtn(),
                            [styles.Disabled]: disableStartBtn(),
                        }}
                        onClick={() => startSession()}>
                        <span classList={{
                            "material-icons": true,
                            [styles.Green]: !disableStartBtn(),
                            [styles.Grey]: disableStartBtn(),
                            [styles.BigBtn]: true,
                        }}>play_circle_outline</span>
                    </button>
                </WithTooltip>

                <WithTooltip tooltip="Stop the session" disabled={disableStopBtn()}
                             position={TooltipPosition.BOTTOM}>
                    <button
                        disabled={disableStopBtn()}
                        classList={{
                            [styles.IconBtn]: true,
                            [styles.Clickable]: !disableStopBtn(),
                            [styles.Disabled]: disableStopBtn(),
                        }}
                        onClick={() => stopSession()}>
                        <span classList={{
                            "material-icons-outlined": true,
                            [styles.Red]: !disableStopBtn(),
                            [styles.Grey]: disableStopBtn(),
                            [styles.BigBtn]: true,
                        }}>stop_circle</span>
                    </button>
                </WithTooltip>

            </div>


        </div>
    )
}