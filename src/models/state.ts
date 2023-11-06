import {createResource, createSignal} from "solid-js";
import {SessionsToCompare, ShowDiffType} from "./view";
import {SESSION_PREFIX, SLASH, SPACE_REPLACER} from "./constants";
import {getLastSessionId, initCurrentSessionId} from "../logics/services";
import {Session} from "./session";
import {createStore} from "solid-js/store";

export interface AppState {
    currentSessionId: number | undefined,
    sessionName: string | null,
    lastSessionId: number | undefined,
    comparisonNum: number | null,
    isComparing: boolean,
    sessionToShow: number | null,
    schemaToShow: string | null,
    sessionsToCompare: SessionsToCompare,
    collapsed: string[],
    collapsedDiffs: string[],
    showDiffType: ShowDiffType
}

const initialState: AppState = {
    currentSessionId: initCurrentSessionId(),
    sessionName: null,
    lastSessionId: getLastSessionId(),
    comparisonNum: null,
    isComparing: false,
    sessionToShow: null,
    schemaToShow: null,
    sessionsToCompare: {
        first: null,
        second: null
    },
    collapsed: [],
    collapsedDiffs: [],
    showDiffType: ShowDiffType.ALL
}

export const [store, setStore] = createStore(initialState)

export const [currentSessionId, setCurrentSessionId] = [
    () => store.currentSessionId,
    (id: number | undefined) => {
        setStore('currentSessionId', id)
    }
];

export const [sessionName, setSessionName] = [
    () => store.sessionName,
    (name: string | null) => {
        setStore('sessionName', name)
    }
];

export const [lastSessionId, setLastSessionId] = [
    () => store.lastSessionId,
    (id: number | undefined) => {
        setStore('lastSessionId', id)
    }
];

export const [comparisonNum, setComparisonNum] = [
    () => store.comparisonNum,
    (num: number | null) => {
        setStore('comparisonNum', num)
    }
];


export const [isComparing, setIsComparing] = [
    () => store.isComparing,
    (is: boolean) => {
        setStore('isComparing', is)
    }
];

export const [sessionToShow, setSessionToShow] = [
    () => store.sessionToShow,
    (id: number | null) => {
        setStore('sessionToShow', id)
    }
];

export const [schemaToShow, setSchemaToShow] = [
    () => store.schemaToShow,
    (schema: string | null) => {
        setStore('schemaToShow', schema)
    }
];


export const [sessionsToCompare, setSessionsToCompare] = [
    () => store.sessionsToCompare,
    (sessions: SessionsToCompare) => {
        setStore('sessionsToCompare', sessions)
    }
];

export const [collapsed, setCollapsed] = [
    () => store.collapsed,
    (collapsed: string[]) => {
        setStore('collapsed', collapsed)
    }
];

export const [collapsedDiffs, setCollapsedDiffs] = [
    () => store.collapsedDiffs,
    (collapsed: string[]) => {
        setStore('collapsedDiffs', collapsed)
    }
];

export const [showDiffType, setShowDiffType] = [
    () => store.showDiffType,
    (type: ShowDiffType) => {
        setStore('showDiffType', type)
    }
];


export const canCompare = () => {
    const sc = sessionsToCompare();
    return sc.first && sc.second;
}

export const sessionToCompareIds = () => {
    return [sessionsToCompare().first?.id, sessionsToCompare().second?.id]
}

// export const [currentSessionId, setCurrentSessionId] = createSignal(initCurrentSessionId())

//export const [sessionName, setSessionName] = createSignal<string | null>(null)

// export const [lastSessionId, setLastSessionId] = createSignal(getLastSessionId())

//export const [comparisonNum, setComparisonNum] = createSignal<number| null>(null)

// export const [isComparing, setIsComparing] = createSignal(false)

//export const [sessionToShow, setSessionToShow] = createSignal<number | null>(null)

//export const [schemaToShow, setSchemaToShow] = createSignal<string | null>(null)

//export const [sessionsToCompare, setSessionsToCompare] = createSignal<SessionsToCompare>({
//    first: null,
//    second: null
//})

//export const [collapsed, setCollapsed] = createSignal<string[]>([])

//export const [collapsedDiffs, setCollapsedDiffs] = createSignal<string[]>([])

//export const [showDiffType, setShowDiffType] = createSignal<ShowDiffType>(ShowDiffType.ALL)


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