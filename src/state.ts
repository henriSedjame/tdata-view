import {createResource, createSignal} from "solid-js";
import {Session, SessionsToCompare} from "./data";
import {SESSION_PREFIX} from "./constants";
import {getLastSessionId, initCurrentSessionId} from "./services";

export const [currentSessionId, setCurrentSessionId] = createSignal(initCurrentSessionId())

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
            datas.push({
                id: Number.parseInt(localStorageKey.split(SESSION_PREFIX)[1]),
                datas: items
            })
        }
    }
    return datas.sort((a, b) => a.id - b.id);
});