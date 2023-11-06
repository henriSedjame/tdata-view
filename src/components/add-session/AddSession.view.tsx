import {Component, createSignal, Show} from "solid-js";
import g_styles from "../../App.module.css";
import styles from "./AddSession.module.css" ;
import {
    currentSessionId,
    lastSessionId,
    refetch,
    sessionName,
    setCurrentSessionId,
    setLastSessionId,
    setSessionName
} from "../../models/state";
import {CURRENT_SESSION_ID, LAST_TIMESTAMP} from "../../models/constants";
import {addNewSession} from "../../logics/services";
import {TooltipPosition, WithTooltip} from "../with-tooltip/WithTooltip";


export const AddSessionView: Component = () => {

    const [ldm, setLdm] = createSignal(false)

    const [data, setData] = createSignal<string | undefined>(undefined)

    const disableStartBtn = () => {
        if (errorMsg()) return true
        return ((sessionName() == null || sessionName()?.length == 0) || (ldm() ? (data() === undefined || data()?.length === 0) : false)) || !disableStopBtn()
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

        let d = ldm() ? JSON.parse(data()!) : undefined

        addNewSession(id, sessionName()!, d )

        if (ldm()) {
            setLdm(false)
            setData(undefined)
            stopSession()
        }

        refetch()
    }

    const stopSession = () => {
        setCurrentSessionId(undefined)
        localStorage.removeItem(CURRENT_SESSION_ID)
        setSessionName(null)
    }

    const dataPlaceholder = ` Paste your data here ...
    [
        {
         id: 1,
         data: {
            name: "John",
            age: 30
         },
         {
         id: 2,
         data: {
            name: "Julie",
            age: 43
         }
         ...
    ]
    `

    const errorMsg = () => {
        if (data() == undefined || data()?.length == 0) return undefined
        let d;

        try {
           d = JSON.parse(data()!)
        } catch (e) {
            return "Data must be a valid JSON"
        }

        if (!Array.isArray(d)) return "Data must be an array"
        if (d.length == 0) return "Data array must not be empty"
        if (!d.some((e: any) => {
            return Object.hasOwnProperty.call(e, "id") && Object.hasOwnProperty.call(e, "data")
        })) return "Data array must contains only objects with id and data properties"

        return undefined
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
                            required={true}
                            onInput={(e) => {
                                if (e.currentTarget.value.length == 0) setSessionName(null)
                                else setSessionName(e.currentTarget.value)
                            }}/>
                        <div class={styles.LoadDataBloc}>
                            <span class={g_styles.White}> Load data manually</span>
                            <input type="checkbox"
                                   class={g_styles.Clickable}
                                   checked={ldm()}
                                   onchange={(e) => setLdm(e.currentTarget.checked)}
                            />
                        </div>

                        <Show when={ldm()}>
                            <textarea classList={{
                                [styles.DataBloc]: true,
                                [styles.RedBorder]: errorMsg() != undefined
                            }}
                                      placeholder={dataPlaceholder}
                                      value={data() || ""}
                                      required={ldm()}
                                      oninput={(e) => setData(e.currentTarget.value)}
                            ></textarea>
                            <p class={g_styles.Red}> {errorMsg()}</p>
                        </Show>
                    </div>


                </div>
            }>
                <div class={styles.SessionName}>
                    <div> CURRENT SESSION</div>
                    <h2 class={g_styles.Grey}> {sessionName()} </h2>
                </div>

            </Show>

            <div class={styles.AddSessionBtnsBloc}>

                <WithTooltip tooltip="Start a new session" disabled={disableStartBtn()}
                             position={TooltipPosition.BOTTOM}>
                    <button
                        disabled={disableStartBtn()}
                        classList={{
                            "tooltip-left": true,
                            [g_styles.IconBtn]: true,
                            [g_styles.Clickable]: !disableStartBtn(),
                            [g_styles.Disabled]: disableStartBtn(),
                        }}
                        onClick={() => startSession()}>
                        <span classList={{
                            "material-icons": true,
                            [g_styles.Green]: !disableStartBtn(),
                            [g_styles.Grey]: disableStartBtn(),
                            [g_styles.BigBtn]: true,
                        }}>play_circle_outline</span>
                    </button>
                </WithTooltip>

                <WithTooltip tooltip="Stop the session" disabled={disableStopBtn()}
                             position={TooltipPosition.BOTTOM}>
                    <button
                        disabled={disableStopBtn()}
                        classList={{
                            [g_styles.IconBtn]: true,
                            [g_styles.Clickable]: !disableStopBtn(),
                            [g_styles.Disabled]: disableStopBtn(),
                        }}
                        onClick={() => stopSession()}>
                        <span classList={{
                            "material-icons-outlined": true,
                            [g_styles.Red]: !disableStopBtn(),
                            [g_styles.Grey]: disableStopBtn(),
                            [g_styles.BigBtn]: true,
                        }}>stop_circle</span>
                    </button>
                </WithTooltip>

            </div>


        </div>
    )
}