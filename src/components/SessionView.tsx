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
import {resetSession, sessionStorageName, updateSessionToCompare} from "../services";
import {SessionDataView} from "./SessionDataView";
import {TooltipPosition, WithTooltip} from "./WithTooltip";

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

    const disableBtns = (): boolean => {
        return isComparing() || currentSessionId() !== undefined
    }

    const sessinLabel = props.session.name != '' ? props.session.name : `SESSION #${props.session.id}`


    const isSelected = () => props.session.id === sessionToShow()

    return (
        <>
            <div classList={{
                [styles.Session]: true,
                [styles.Shadow]: isSelected(),
            }}>
                <div class={styles.SessionTitle}>
                    <WithTooltip tooltip="Check to compare this session with an other one" disabled={disableBtns()}
                                 position={TooltipPosition.RIGHT}>
                        <input
                            classList={{
                                [styles.Disabled]: disableBtns(),
                            }}

                            type="checkbox"
                            checked={sessionToCompareIds().includes(props.session.id)}
                            disabled={disableBtns()}
                            onChange={(e) => {
                                updateSessionToCompare(props.session, e.currentTarget.checked)
                            }}/>
                    </WithTooltip>

                    <b>{sessinLabel}</b>
                    <div> {props.session.datas.length} events</div>

                </div>
                <div class={styles.BtnsBloc}>
                    <Show
                        when={props.session.id !== sessionToShow()}
                        fallback={
                            <WithTooltip tooltip="Hide the events list"
                                         disabled={disableBtns()} position={TooltipPosition.BOTTOM}>
                                <button
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
                            </WithTooltip>
                        }
                    >
                        <WithTooltip tooltip="Show the events list"
                                     disabled={disableBtns()} position={TooltipPosition.TOP}>
                            <button
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
                            }}>keyboard_arrow_down</span>
                            </button>
                        </WithTooltip>
                    </Show>

                    <div class={styles.BtnSeparator}></div>

                    <WithTooltip tooltip="Reset the session"
                                 disabled={disableBtns()} position={TooltipPosition.TOP}>
                        <button
                            classList={{
                                [styles.IconBtn]: true,
                                [styles.Clickable]: !disableBtns(),
                                [styles.Disabled]: disableBtns(),
                            }}
                            disabled={disableBtns()}
                            onClick={() => resetSession(props.session.id, props.session.name)}>
                        <span classList={{
                            "material-icons": true,
                            [styles.Orange]: true,
                        }}>replay</span>
                        </button>
                    </WithTooltip>

                    <div class={styles.BtnSeparator}></div>

                    <Show when={props.session.id !== currentSessionId()}
                          fallback={(<div class={styles.EmptyText}>____</div>)}>
                        <WithTooltip tooltip="Delete the session"
                                     disabled={disableBtns()} position={TooltipPosition.TOP}>
                        <button
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
                            }}>delete_outline</span>
                        </button>
                        </WithTooltip>.
                    </Show>
                </div>


            </div>

            <Show when={isSelected()}>
                <SessionDataView session={props.session}/>
            </Show>

        </>

    )
}

export default SessionView;