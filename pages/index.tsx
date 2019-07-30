import { useRef, useState } from "react"
import Head from "next/head"

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

    const [selectedEvent, setSelectedEvent] = useState(null)
    const [userCardPosition, setUserCardPosition] = useState(null)

    return <>
        <Head>
            <title>GitHub Events</title>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"/>
        </Head>
        <EngineContext.Provider value={engine}>
            <BackgroundContext.Provider value={backgroundRef.current}>
                <div
                    ref={backgroundRef}
                    className={"background"}
                    onPointerDownCapture={() => {
                        setSelectedEvent(null)
                    }}
                    onTouchStartCapture={() => {
                        setSelectedEvent(null)
                    }}>
                    {
                        events.map(event =>
                            <Icon
                                key={event.id}
                                event={event}
                                selected={ event === selectedEvent}
                                selectEvent={ position => {
                                    setSelectedEvent(event)
                                    setUserCardPosition(position)
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
                            position={userCardPosition}
                            event={selectedEvent} />
                </div>
                <style jsx>{`
                    .background {
                        position: relative;
                        overflow: hidden;
                        width: calc(100vw - 16px);
                        height: calc(100vh - 16px);
                        background-color: grey;
                    }
                `}</style>
                <style jsx global>{`
                    html {
                        user-select: none;
                    }
                `}</style>
            </BackgroundContext.Provider>
        </EngineContext.Provider>
    </>
}
