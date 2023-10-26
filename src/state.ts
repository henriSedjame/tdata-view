import {createResource, createSignal} from "solid-js";
import {Session, SessionsToCompare} from "./data";
import {SESSION_PREFIX, SLASH, SPACE_REPLACER} from "./constants";
import {getLastSessionId, initCurrentSessionId} from "./services";

export const [currentSessionId, setCurrentSessionId] = createSignal(initCurrentSessionId())

export const [sessionName, setSessionName] = createSignal<string | null>(null)

export const [lastSessionId, setLastSessionId] = createSignal(getLastSessionId())

export const [comparisonNum, setComparisonNum] = createSignal<number| null>(null)

export const [isComparing, setIsComparing] = createSignal(false)

export const [sessionToShow, setSessionToShow] = createSignal<number | null>(null)

export const [schemaToShow, setSchemaToShow] = createSignal<string | null>(null)

export const [sessionsToCompare, setSessionsToCompare] = createSignal<SessionsToCompare>({
    first: null,
    second: null
})

export const [collapsed, setCollapsed] = createSignal<string[]>([])

export const canCompare = () => {
    const sc = sessionsToCompare();
    return sc.first && sc.second;
}

export const sessionToCompareIds = () => {
    return [sessionsToCompare().first?.id, sessionsToCompare().second?.id]
}

export const [sessions, {mutate, refetch}] = createResource(() => {
    let datas: Session[] = [];
    for (let localStorageKey in localStorage) {
        if (localStorageKey.startsWith(SESSION_PREFIX)) {
            let items = JSON.parse(localStorage.getItem(localStorageKey) || '{}');
            let parts = localStorageKey.split(SESSION_PREFIX);
            let id_name = parts[1].split(SLASH);
            let id = Number.parseInt(id_name[0]);
            let name = id_name.length > 1 ? id_name[1].replaceAll(SPACE_REPLACER, " ") : '';
            datas.push({
                id: id,
                name: name,
                datas: items
            })
        }
    }
    return datas.sort((a, b) => a.id - b.id);
});