import {Component, Show} from 'solid-js';
import styles from './App.module.css';
import {isComparing, isMasterBranch, setIsMasterBranch} from "./models/state";
import {fetchBranches, fetchData, initLastTimestamp, setBranch} from "./logics/services";
import {SessionListView} from "./components/session/SessionList.view";
import {SessionCompareView} from "./components/compare/SessionCompare.view";
import {AddSessionView} from "./components/add-session/AddSession.view";
import {SwitchBtnView} from "./components/switch-btn/SwitchBtn.view";
import {ParametersView} from "./components/parameters/Parameters.view";


const App: Component = () => {

    initLastTimestamp()

    fetchData().then(() => {});

    fetchBranches().then(() => {});

    return (
        <div class={styles.AppContent}>
            <div>
                <div classList={{
                    [styles.Purple]: true,
                    [styles.AppTitle]: true
                }}>DATA DIFF
                </div>

                <AddSessionView/>

                <ParametersView />

                <SessionListView/>

                <Show when={isComparing()}>
                    <SessionCompareView/>
                </Show>
            </div>

            <div class={styles.Img}>
                <img src="../src/assets/bg.png" alt="logo" class={styles.Logo} width="1237" height="1223"/>
            </div>
        </div>
    );
};

export default App;
