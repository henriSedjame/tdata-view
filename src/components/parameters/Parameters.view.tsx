import {Component} from "solid-js";
import {isMasterBranch, isSessionRunning} from "../../models/state";
import {setBranch} from "../../logics/services";
import {SwitchBtnView} from "../switch-btn/SwitchBtn.view";
import styles from "./Parameters.module.css";
import g_styles from "../../App.module.css";
import {FETCH_DATA_URL} from "../../models/constants";
import {TooltipPosition, WithTooltip} from "../with-tooltip/WithTooltip";

export const ParametersView: Component = () => {

    

    return (
        <div class={styles.ParametersBloc}>

            <div class={styles.Title}> PARAMETERS </div>

            <div class={styles.Separator}></div>

            <div class={styles.SubTitle}>
                BRANCH
            </div>

            <div class={styles.Branches}>
                <div classList={{
                    [styles.Branch]: true,
                    [g_styles.Grey]: isMasterBranch(),
                    [g_styles.White]: !isMasterBranch()
                }}> REFACTO </div>

                <WithTooltip tooltip="Switch branch" position={TooltipPosition.BOTTOM}>
                    <SwitchBtnView checked={isMasterBranch()}  disabled={isSessionRunning()} onChange={(b) => {
                        setBranch(b ? "master" : "refacto").then((r) => {})
                    }}/>
                </WithTooltip>

                <div classList={{
                    [styles.Branch]: true,
                    [g_styles.Grey]: !isMasterBranch(),
                    [g_styles.White]: isMasterBranch()
                }} >
                   MASTER
                </div>
            </div>

            <div class={styles.Separator}></div>

            <div class={styles.Sse}>
                <span> SSE URL  : </span>
                <span>{FETCH_DATA_URL}</span>
            </div>

        </div>
    )
}