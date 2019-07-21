import { useState, useEffect } from "react"
import { EngineContext } from "../src/engineContext"
import { Engine, Runner, Events, IEventTimestamped } from "matter-js"

import Icon from "../components/icon"

export default function Index() {
    const [engine, setEngine] = useState(Engine.create())
    const [runner, setRunner] = useState(Runner.create({}))
    const [time, setTime] = useState(0)

    useEffect(() => {
        engine.world.gravity = { x: 0, y: 0.01, scale: 1 }

        function tick(event: IEventTimestamped<Runner>) {
            setTime(event.timestamp)
        }

        Runner.run(runner, engine)
        Events.on(engine, "tick", tick)

        return () => {
            Runner.stop(runner)
            Events.off(engine, "tick", tick)
        }
    }, [time])

    return (
        <EngineContext.Provider value={engine}>
            <div style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                overflow: "hidden"
            }}>
                <Icon />
                <Icon />
                <Icon />
                <Icon />
                <Icon />
            </div>
        </EngineContext.Provider>
    )
}
