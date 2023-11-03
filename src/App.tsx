import {Component, Show} from 'solid-js';
import styles from './App.module.css';
import {isComparing} from "./models/state";
import {initLastTimestamp} from "./logics/services";
import {SessionList} from "./components/SessionList";
import {SessionCompareView} from "./components/SessionCompareView";
import {AddSessionView} from "./components/AddSessionView";
import {buildCompareParts, compare, fromStrCompareParts, toStrParts} from "./logics/utils/str-diff-utils";
import {StrPartDiffView} from "./components/StrPartDiffView";


const App: Component = () => {

    initLastTimestamp()

    //fetchData().then(() => {});

    return (
        <div>
            <h1 class={styles.White}>DATA COMPARE VIEW</h1>


            <AddSessionView />

            <SessionList />

            <Show when={isComparing()}>
                <SessionCompareView />
            </Show>

        </div>
    );
};

export default App;
