import {fetchEventSource} from "@microsoft/fetch-event-source";
import {CURRENT_SESSION_ID, LAST_TIMESTAMP, SESSION_PREFIX, SLASH, SPACE_REPLACER, URL} from "../models/constants";
import {
    collapsed,
    currentSessionId,
    refetch, sessionName,
    sessionsToCompare, setCollapsed, setCurrentSessionId, setSessionName,
    setSessionsToCompare, setSessionToShow
} from "../models/state";
import {Session, SessionData} from "../models/session";

export function resetSession(id: number, sessionName: string) {
    setCollapsed([])
    setSessionToShow(null)
    localStorage.setItem(sessionStorageName(id, sessionName), JSON.stringify([]));
    setCurrentSessionId(id)
    setSessionName(sessionName)
    refetch()

}
export function addToStorage(id: number, sessionName: string, data: SessionData) {
    if (isStoreable(data)) {

        let key = sessionStorageName(id, sessionName);

        let item = localStorage.getItem(key)

        if (item) {
            let items: SessionData[] = JSON.parse(item)
            if (!items.find((item) => item.id === data.id && item.timpstamp === data.timpstamp)) {
                localStorage.setItem(key, JSON.stringify([...items, data]));
                localStorage.setItem(LAST_TIMESTAMP, data.timpstamp.toString());
            }
        }
    }
}

export function isStoreable(data: SessionData) {
    let timestamp = localStorage.getItem(LAST_TIMESTAMP);
    if (timestamp) {
        return data.timpstamp > Number.parseInt(timestamp);
    }
    initLastTimestamp()
    return true;
}

export const sessionStorageName = (id: number, sessionName: string) => {
    if (sessionName != '') return `${SESSION_PREFIX}${id}${SLASH}${sessionName.replaceAll(" ", SPACE_REPLACER)}`
    else return `${SESSION_PREFIX}${id}`
}
export function addNewSession(id: number, sessionName: string, data: any[] = []) {
    localStorage.setItem(sessionStorageName(id, sessionName), JSON.stringify(data));
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
    console.log("Run fetch");

    await fetchEventSource(URL, {
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
                    timpstamp: data.timestamp,
                    data: data.data,
                })

                refetch()
            }

        },
        keepalive: true,
    });

};