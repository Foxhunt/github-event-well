import { useRef, useState } from "react"

import { EngineContext } from "../src/engineContext"
import { BackgroundContext } from "../src/backgroundContext"

import Icon from "../components/Icon"
import UserCard from "../components/UserCard"

import useEngine from "../src/useEngine"
import useGithubEvents from "../src/useGithubEvents"

export default function Index() {
    const engine = useEngine()
    const [events, setEvents] = useGithubEvents()

    const backgroundRef = useRef()

    const [hoveredEvent, setHoveredEvent] = useState(null)

    return (
        <EngineContext.Provider value={engine}>
            <BackgroundContext.Provider value={backgroundRef.current}>
                <div
                    ref={backgroundRef}
                    className={"background"}>
                    {
                        events.map(event =>
                            <Icon
                                key={event.id}
                                event={event}
                                onPointerOver={() => {
                                    setHoveredEvent(event)
                                }}
                                onPointerOut={() => {
                                    setHoveredEvent(null)
                                }}
                                onPointerDown={() => {
                                    console.log(event)
                                }}
                                remove={() => {
                                    setEvents(events => {
                                        events.splice(events.indexOf(event), 1)
                                        return [...events]
                                    })
                                }} />
                        )
                    }
                    <UserCard
                        event={hoveredEvent} />
                </div>
                <style jsx global>{`
                    .background {
                        position: relative;
                        overflow: hidden;
                        width: calc(100vw - 16px);
                        height: calc(100vh - 16px);
                        background-color: grey;
                    }
                `}</style>
            </BackgroundContext.Provider>
        </EngineContext.Provider>
    )
}
