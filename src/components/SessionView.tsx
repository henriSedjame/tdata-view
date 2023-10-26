import {Component, Show} from "solid-js";
import styles from "../App.module.css";
import {SESSION_PREFIX} from "../constants";
import {
    currentSessionId,
    isComparing,
    refetch,
    sessions,
    sessionToCompareIds, sessionToShow, setCollapsed,
    setLastSessionId,
    setSessionToShow
} from "../state";
import {Session} from "../data";
import {sessionStorageName, updateSessionToCompare} from "../services";
import {SessionDataView} from "./SessionDataView";

export interface SessionViewProps {
    session: Session
}

const SessionView: Component<SessionViewProps> = (props) => {

    const removeSession = () => {
        localStorage.removeItem(sessionStorageName(props.session.id, props.session.name));
        refetch()
        let ss = sessions();
        if (ss && ss.length === 0) {
            setLastSessionId(undefined)
        }
    }

    const disableBtns = () : boolean => {
        return isComparing() ||  currentSessionId() !== undefined
    }

    const sessinLabel = props.session.name != '' ? props.session.name : `SESSION #${props.session.id}`


    const isSelected = () => props.session.id === sessionToShow()

    return (
        <>
            <div classList={{
                [styles.Session]: true,
                [styles.Shadow]: isSelected(),
            }}>
                <input type="checkbox"
                       checked={sessionToCompareIds().includes(props.session.id)}
                       disabled={disableBtns()}
                       onChange={(e) => {
                           updateSessionToCompare(props.session, e.currentTarget.checked)
                       }}/>
                <b>{sessinLabel} ( {props.session.datas.length} events )</b>
                <div class={styles.BtnsBloc}>
                    <Show
                        when={props.session.id !== sessionToShow()}
                        fallback={
                            <button
                                data-tooltip="Hide the events list"
                                classList={{
                                    [styles.IconBtn]: true,
                                    [styles.Clickable]: !disableBtns(),
                                    [styles.Disabled]: disableBtns(),
                                }}
                                disabled={disableBtns()}
                                onClick={() => {
                                    setCollapsed([])
                                    setSessionToShow(null)
                                }}
                            >
                                <span classList={{
                                    "material-icons": true,
                                    [styles.Green]: true,
                                }}>keyboard_arrow_up</span>
                            </button>
                        }
                    >
                        <button
                            data-tooltip="Show the events list"
                            classList={{
                                [styles.IconBtn]: true,
                                [styles.Clickable]: !disableBtns(),
                                [styles.Disabled]: disableBtns(),
                            }}
                            disabled={disableBtns()}
                            onClick={() => {
                                setCollapsed([])
                                setSessionToShow(props.session.id)
                            }}><span classList={{
                                "material-icons": true,
                                [styles.Green]: true,
                        }} >keyboard_arrow_down</span>
                        </button>
                    </Show>

                    <div class={styles.BtnSeparator}></div>

                    <Show when={props.session.id !== currentSessionId()}
                          fallback={(<div class={styles.EmptyText}>________</div>)}>
                        <button
                            data-tooltip="Delete the session"
                            classList={{
                                [styles.IconBtn]: true,
                                [styles.Clickable]: !disableBtns() && props.session.id !== sessionToShow(),
                                [styles.Disabled]: disableBtns() || props.session.id === sessionToShow(),
                            }}
                            disabled={disableBtns() || props.session.id === sessionToShow()}
                            onClick={() => removeSession()}>
                            <span classList={{
                                "material-icons": true,
                                [styles.Red]: true,
                            }}>delete</span>
                        </button>
                    </Show>
                </div>


            </div>

            <Show when={isSelected()}>
                <SessionDataView session={props.session} />
            </Show>

        </>

    )
}

export default SessionView;