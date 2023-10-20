import {Component, Show} from 'solid-js';
import styles from './App.module.css';
import Separator from "./components/Separator";
import {currentSessionId, isComparing, lastSessionId, refetch, setCurrentSessionId} from "./state";
import {addNewSession, fetchData, initLastTimestamp} from "./services";
import {SessionList} from "./components/SessionList";
import {SessionCompareView} from "./components/SessionCompareView";
import {CURRENT_SESSION_ID} from "./constants";
import {AddSessionView} from "./components/AddSessionView";

const App: Component = () => {

    initLastTimestamp()

    fetchData().then(() => {});

    return (
        <div>
            <h1>Data View</h1>

            <Separator/>

            <AddSessionView />

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
