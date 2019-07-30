import { useState, useEffect, Dispatch, SetStateAction } from "react"

const GITHUB_EVENTS_URL = "https://api.github.com/events"
const EVENT_FETCH_INTERVALL_TIME = 60 * 1000

export default function useGithubEvents(): [any, Dispatch<SetStateAction<any[]>>] {

    const [fetchedEvents, setFetchedEvents] = useState([])
    useEffect(() => {
        async function fetchEvents() {
            const respone = await fetch(GITHUB_EVENTS_URL)

            const data = await respone.json()

            setFetchedEvents(fetchedEvents => [...fetchedEvents, ...data])
        }

        if (fetchedEvents.length === 0) {
            fetchEvents()
        }
        const fetchIntervall = setInterval(fetchEvents, EVENT_FETCH_INTERVALL_TIME)

        return () => {
            clearInterval(fetchIntervall)
        }
    })

    const [events, setEvents] = useState([])
    useEffect(() => {
        function shiftEvent() {
            const event = fetchedEvents.shift()
            setFetchedEvents(fetchedEvents => [...fetchedEvents])
            setEvents(events => [...events, event])
        }

        const fetchIntervall = setInterval(shiftEvent, EVENT_FETCH_INTERVALL_TIME / 30)

        return () => {
            clearInterval(fetchIntervall)
        }
    }, [fetchedEvents])

    return [events, setEvents]
}
