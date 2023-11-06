import {Component, createSignal, ParentProps, Show} from "solid-js";
import g_styles from "../../App.module.css";
import styles from "./WithTooltip.module.css";

export enum TooltipPosition {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT

}
export interface WithTooltipProps extends ParentProps {
    tooltip: string;
    position?: TooltipPosition;
    disabled?: boolean;
}

export const WithTooltip : Component<WithTooltipProps> = (props) => {
    const [showTooltip, setShowTooltip] = createSignal(false);
    return (
        <div class = {styles.WithTooltip}>
            <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                {props.children}
            </div>
            <Show when={showTooltip()}>
            <div classList={{
                [styles.Tooltip]: true,
                [styles.Top]: props.position == TooltipPosition.TOP,
                [styles.Bottom]: props.position == TooltipPosition.BOTTOM,
                [styles.Left]: props.position == TooltipPosition.LEFT,
                [styles.Right]: props.position == TooltipPosition.RIGHT,
                [g_styles.Disabled] : props.disabled === true
            }}>
                {props.tooltip}
            </div>
            </Show>
        </div>
    );
}