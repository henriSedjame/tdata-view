import {Component} from "solid-js";

import styles from "./SwitchBtn.module.css";

export interface SwitchBtnViewProps {
    checked: boolean,
    disabled: boolean,
    onChange: (checked: boolean) => void
}

export const SwitchBtnView: Component<SwitchBtnViewProps> = (props) => {
    return (
        <label class={styles.Switch}>
            <input type="checkbox"
                   checked={props.checked}
                   onchange={(e) => props.onChange(e.currentTarget.checked)}
                   disabled={props.disabled}
            />
            <span classList={{
                [styles.slider]: true,
                [styles.round]: true,
                [styles.Disabled]: props.disabled,
            }}></span>
        </label>
    )
}