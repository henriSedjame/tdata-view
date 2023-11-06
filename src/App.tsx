import {Component, Show} from 'solid-js';
import styles from './App.module.css';
import {isComparing} from "./models/state";
import {fetchData, initLastTimestamp} from "./logics/services";
import {SessionListView} from "./components/session/SessionList.view";
import {SessionCompareView} from "./components/compare/SessionCompare.view";
import {AddSessionView} from "./components/add-session/AddSession.view";


const App: Component = () => {

    initLastTimestamp()

    fetchData().then(() => {});

    return (
        <div>
            <h1 class={styles.White}>DATA COMPARE VIEW</h1>

            <AddSessionView />

            <SessionListView />

            <Show when={isComparing()}>
                <SessionCompareView />
            </Show>

        </div>
    );
};

export default App;
