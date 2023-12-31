import {fetchEventSource} from "@microsoft/fetch-event-source";
import {
    CURRENT_SESSION_ID,
    FETCH_BRANCHES_URL,
    FETCH_DATA_URL,
    LAST_TIMESTAMP,
    SESSION_PREFIX,
    SET_REFACTO_BRANCH_URL,
    SLASH,
    SPACE_REPLACER
} from "../models/constants";
import {
    collapsed,
    currentSessionId,
    refetch,
    sessionName,
    sessionsToCompare,
    setCollapsed,
    setCollapsedDiffs,
    setCurrentSessionId,
    setIsMasterBranch,
    setSessionName,
    setSessionsToCompare,
    setSessionToShow,
    setShowDiffType
} from "../models/state";
import {Session, SessionData} from "../models/session";
import {ShowDiffType} from "../models/view";


export function resetAll() {
    setCollapsed([])
    setSessionToShow(null)
    setCollapsedDiffs([])
    setShowDiffType(ShowDiffType.CHANGED)
}

export function resetSession(id: number, sessionName: string) {
    resetAll()
    setCurrentSessionId(id)
    setSessionName(sessionName)
    setSessionToShow(id)
    localStorage.setItem(sessionStorageName(id, sessionName), JSON.stringify([]));
    localStorage.setItem(LAST_TIMESTAMP, String(new Date().getTime()));
    refetch()
}

export function addToStorage(id: number, sessionName: string, data: SessionData) {
    if (isStoreable(data)) {

        let key = sessionStorageName(id, sessionName);

        let item = localStorage.getItem(key)

        if (item) {
            let items: SessionData[] = JSON.parse(item)
            if (!items.find((item) => item.id === data.id && item.timestamp === data.timestamp)) {
                localStorage.setItem(key, JSON.stringify([...items, data]));
                localStorage.setItem(LAST_TIMESTAMP, data.timestamp.toString());
            }
        }
    }
}

export function isStoreable(data: SessionData) {
    let timestamp = localStorage.getItem(LAST_TIMESTAMP);
    if (timestamp) {
        return data.timestamp >= Number.parseInt(timestamp);
    }
    initLastTimestamp()
    return true;
}

export const sessionStorageName = (id: number, sessionName: string) => {
    if (sessionName != '') return `${SESSION_PREFIX}${id}${SLASH}${sessionName.replaceAll(" ", SPACE_REPLACER)}`
    else return `${SESSION_PREFIX}${id}`
}

export function addNewSession(id: number, sessionName: string, data: any[] = []) {
    localStorage.setItem(sessionStorageName(id, sessionName), JSON.stringify(data.map((item) => {
        return {...item, timestamp: new Date().getTime() }
    })));
}

export function updateSessionToCompare(session: Session, select: boolean) {
    const sc = sessionsToCompare()
    if (select) {
        if (sc.first) {
            if (sc.second) {
                setSessionsToCompare({
                    first: sc.second,
                    second: session
                })
            } else {
                setSessionsToCompare({
                    ...sc,
                    second: session
                })
            }
        } else {
            setSessionsToCompare({
                ...sc,
                first: session
            })
        }
    } else {
        if (sc.first && sc.first.id === session.id) {
            setSessionsToCompare({
                ...sc,
                second: null,
                first: sc.second
            })
        } else if (sc.second && sc.second.id === session.id) {
            setSessionsToCompare({
                ...sc,
                second: null
            })
        }
    }
}

export function initLastTimestamp() {
    if (!localStorage.getItem(LAST_TIMESTAMP)) {
        localStorage.setItem(LAST_TIMESTAMP, '0');
    }
}

export function initCurrentSessionId() {
    let item = localStorage.getItem(CURRENT_SESSION_ID);
    if (item) {
        return Number.parseInt(item);
    }
    return undefined
}

export function collapse(fullName : string) {
    if (collapsed()?.includes(fullName)) {
        let filter = collapsed()?.filter((name) => name !== fullName);
        setCollapsed(filter)
    } else {
        setCollapsed([...collapsed(), fullName])
    }
}

export function getLastSessionId() {
    let i = undefined
    for (const key in localStorage) {
        if (key.startsWith(SESSION_PREFIX)) {
            let id = Number.parseInt(key.split(SESSION_PREFIX)[1])
            if (!i || i < id) {
                i = id
            }
        }
    }
    return i
}

export  const fetchData = async () => {

    await fetchEventSource(FETCH_DATA_URL, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'x-bff-key': 'ah1MPO-izehIHD-QZZ9y88n-kku876'
        },
        onmessage: (event) => {
            let data = JSON.parse(event.data)

            let sid = currentSessionId();

            let sname = sessionName();

            if (sid && sname) {
                addToStorage(sid, sname, {
                    id: data.id,
                    timestamp: data.timestamp,
                    data: data.data,
                })

                refetch()
            }

        },
        keepalive: true,
    });

};


export  const fetchBranches = async () => {

    await fetchEventSource(FETCH_BRANCHES_URL, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'x-bff-key': 'ah1MPO-izehIHD-QZZ9y88n-kku876'
        },
        onmessage: (event) => {
            let data = JSON.parse(event.data) as { isMaster: boolean }
            setIsMasterBranch(data.isMaster)
        },
        keepalive: true,
    });

};

export const setBranch = async (branch: string): Promise<void> => {
    await fetch(`${SET_REFACTO_BRANCH_URL}${branch}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-bff-key': 'ah1MPO-izehIHD-QZZ9y88n-kku876'
        }
    })
}