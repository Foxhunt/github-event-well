import { useState, useEffect, useRef } from "react"
import { Engine, Runner } from "matter-js"

import { EngineContext } from "../src/engineContext"
import { BackgroundContext } from "../src/backgroundContext"

import Icon from "../components/Icon"
import getTexture from "../src/getTexture"

const GITHUB_EVENTS_URL = "https://api.github.com/events"
const EVENT_FETCH_INTERVALL_TIME = 60 * 1000

export default function Index() {
    const [engine] = useState(Engine.create({
        positionIterations: 1
    }))

    const [runner] = useState(Runner.create({}))
    useEffect(() => {
        engine.world.gravity = { x: 0, y: 0.00002, scale: 0.5 }

        Runner.run(runner, engine)

        return () => {
            Runner.stop(runner)
        }
    }, [runner, engine])

    
    const [fetchedEvents, setFetchedEvents] = useState([])
    useEffect(() => {
        async function fetchEvents() {
            const respone = await fetch(GITHUB_EVENTS_URL)

            const data = await respone.json()

            setFetchedEvents(fetchedEvents => [...fetchedEvents, ...data])
        }

        if(fetchedEvents.length === 0) {
            fetchEvents()
        }
        const fetchIntervall = setInterval(fetchEvents, EVENT_FETCH_INTERVALL_TIME)

        return () => {
            clearInterval(fetchIntervall)
        }
    })

    const [events, setEvents] = useState([])
    useEffect(() => {
        const fetchIntervall = setInterval(() => {
            const event = fetchedEvents.shift()
            setFetchedEvents(fetchedEvents => [...fetchedEvents])

            setEvents(events => [...events, event])
            
        }, EVENT_FETCH_INTERVALL_TIME / 30)

        return () => {
            clearInterval(fetchIntervall)
        }
    })

    const backgroundRef = useRef()

    return (
        <EngineContext.Provider value={engine}>
            <BackgroundContext.Provider value={backgroundRef.current}>
            <div ref={backgroundRef} className={"background"}>
                {
                    events.map(event =>
                        <Icon
                            key={event.id}
                            event={event}
                            icon={getTexture(event)}
                            remove={() => {
                                setEvents(events => {
                                    events.splice(events.indexOf(event), 1)
                                    return [ ...events ]
                                })
                            }} />
                    )
                }
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
