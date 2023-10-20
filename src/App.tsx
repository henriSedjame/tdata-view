import {Component, Show} from 'solid-js';
import styles from './App.module.css';
import Separator from "./components/Separator";
import {currentSessionId, isComparing, lastSessionId, refetch, setCurrentSessionId, setLastSessionId} from "./state";
import {addNewSession, fetchData, initLastTimestamp} from "./services";
import {SessionList} from "./components/SessionList";
import {SessionCompareView} from "./components/SessionCompareView";
import {CURRENT_SESSION_ID} from "./constants";
import {AddSessionView} from "./components/AddSessionView";

const App: Component = () => {
    initLastTimestamp()

    fetchData().then(() => {});

    const stopSession = () => {
        setCurrentSessionId(undefined)
        localStorage.removeItem(CURRENT_SESSION_ID)
    }

    return (
        <div>
            <h1>Data View</h1>

            <Separator/>

            <Show when={currentSessionId()} fallback= { <AddSessionView />}>
                <h3> Current Session : #{currentSessionId()}</h3>

                <button class={styles.StopBtn} onClick={() => stopSession()}>STOP SESSION</button>
            </Show>

            <Separator/>

            <SessionList />

            <Show when={isComparing()}>
                <Separator/>

                <SessionCompareView />
            </Show>

        </div>
    );
};

export default App;
