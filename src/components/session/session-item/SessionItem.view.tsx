import {Component, Show} from "solid-js";
import g_styles from "../../../App.module.css";
import styles from "./SessionItem.module.css";
import {
    currentSessionId,
    isComparing,
    refetch,
    sessions,
    sessionToCompareIds, sessionToShow, setCollapsed,
    setLastSessionId,
    setSessionToShow
} from "../../../models/state";
import {Session} from "../../../models/session";
import {resetSession, sessionStorageName, updateSessionToCompare} from "../../../logics/services";
import {SessionDataView} from "./SessionData.view";
import {TooltipPosition, WithTooltip} from "../../with-tooltip/WithTooltip";

export interface SessionViewProps {
    session: Session
}

const SessionItemView: Component<SessionViewProps> = (props) => {

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
                [g_styles.Shadow]: isSelected(),
            }}>
                <div class={styles.SessionTitle}>
                    <WithTooltip tooltip="Check to compare this session with an other one" disabled={disableBtns()}
                                 position={TooltipPosition.RIGHT}>
                        <input
                            classList={{
                                [g_styles.Disabled]: disableBtns(),
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
                                        [g_styles.IconBtn]: true,
                                        [g_styles.Clickable]: !disableBtns(),
                                        [g_styles.Disabled]: disableBtns(),
                                    }}
                                    disabled={disableBtns()}
                                    onClick={() => {
                                        setCollapsed([])
                                        setSessionToShow(null)
                                    }}
                                >
                                <span classList={{
                                    "material-icons": true,
                                    [g_styles.Green]: true,
                                }}>keyboard_arrow_up</span>
                                </button>
                            </WithTooltip>
                        }
                    >
                        <WithTooltip tooltip="Show the events list"
                                     disabled={disableBtns()} position={TooltipPosition.TOP}>
                            <button
                                classList={{
                                    [g_styles.IconBtn]: true,
                                    [g_styles.Clickable]: !disableBtns(),
                                    [g_styles.Disabled]: disableBtns(),
                                }}
                                disabled={disableBtns()}
                                onClick={() => {
                                    setCollapsed([])
                                    setSessionToShow(props.session.id)
                                }}><span classList={{
                                "material-icons": true,
                                [g_styles.Green]: true,
                            }}>keyboard_arrow_down</span>
                            </button>
                        </WithTooltip>
                    </Show>

                    <div class={g_styles.BtnSeparator}></div>

                    <WithTooltip tooltip="Reset the session"
                                 disabled={disableBtns()} position={TooltipPosition.TOP}>
                        <button
                            classList={{
                                [g_styles.IconBtn]: true,
                                [g_styles.Clickable]: !disableBtns(),
                                [g_styles.Disabled]: disableBtns(),
                            }}
                            disabled={disableBtns()}
                            onClick={() => resetSession(props.session.id, props.session.name)}>
                        <span classList={{
                            "material-icons": true,
                            [g_styles.Orange]: true,
                        }}>replay</span>
                        </button>
                    </WithTooltip>

                    <div class={g_styles.BtnSeparator}></div>

                    <Show when={props.session.id !== currentSessionId()}
                          fallback={(<div class={g_styles.EmptyText}>____</div>)}>
                        <WithTooltip tooltip="Delete the session"
                                     disabled={disableBtns()} position={TooltipPosition.TOP}>
                        <button
                            classList={{
                                [g_styles.IconBtn]: true,
                                [g_styles.Clickable]: !disableBtns() && props.session.id !== sessionToShow(),
                                [g_styles.Disabled]: disableBtns() || props.session.id === sessionToShow(),
                            }}
                            disabled={disableBtns() || props.session.id === sessionToShow()}
                            onClick={() => removeSession()}>
                            <span classList={{
                                "material-icons": true,
                                [g_styles.Red]: true,
                            }}>delete_outline</span>
                        </button>
                        </WithTooltip>
                    </Show>
                </div>


            </div>

            <Show when={isSelected()}>
                <SessionDataView session={props.session}/>
            </Show>

        </>

    )
}

export default SessionItemView;