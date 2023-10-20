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
import {updateSessionToCompare} from "../services";
import {SessionDataView} from "./SessionDataView";

export interface SessionViewProps {
    session: Session
}

const SessionView: Component<SessionViewProps> = (props) => {

    const removeSession = (id: number) => {
        localStorage.removeItem(`${SESSION_PREFIX}${id}`);
        refetch()
        let ss = sessions();
        if (ss && ss.length === 0) {
            setLastSessionId(undefined)
        }
    }

    const disableBtns = () : boolean => {
        return isComparing() ||  currentSessionId() !== undefined
    }

    return (
        <>
            <div class={styles.Session}>
                <input type="checkbox"
                       checked={sessionToCompareIds().includes(props.session.id)}
                       disabled={disableBtns()}
                       onChange={(e) => {
                           updateSessionToCompare(props.session, e.currentTarget.checked)
                       }}/>
                <b>SESSION #{props.session.id} ( {props.session.datas.length} events )</b>
                <div class={styles.BtnsBloc}>
                    <Show
                        when={props.session.id !== sessionToShow()}
                        fallback={
                            <button
                                class={styles.HideBtn}
                                disabled={disableBtns()}
                                onClick={() => {
                                    setCollapsed([])
                                    setSessionToShow(null)
                                }}
                                >HIDE EVENTS LIST
                            </button>
                        }
                    >
                        <button
                            class={styles.ShowBtn}
                            disabled={disableBtns()}
                            onClick={() => {
                                setCollapsed([])
                                setSessionToShow(props.session.id)
                            }}>SHOW EVENTS LIST
                        </button>
                    </Show>


                    <Show when={props.session.id !== currentSessionId()}
                          fallback={(<div class={styles.EmptyText}>________</div>)}>
                        <button
                            class={styles.DelBtn}
                            disabled={disableBtns()}
                            onClick={() => removeSession(props.session.id)}>DELETE
                        </button>
                    </Show>
                </div>


            </div>

            <Show when={props.session.id === sessionToShow()}>
                <SessionDataView session={props.session} />
            </Show>

        </>

    )
}

export default SessionView;