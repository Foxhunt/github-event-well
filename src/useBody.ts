import { useContext, useState, useEffect, useRef } from "react"
import { World, Events, Bodies, Body } from "matter-js"

import { EngineContext } from "./engineContext"
import { BackgroundContext } from "./backgroundContext"

export default function UseBody(remove): [Body, World]{
    const engine = useContext(EngineContext)
    const background: HTMLDivElement = useContext(BackgroundContext)

    const body = useRef(spawnBody(background))
    useEffect(() => {
        const currentBody = body.current
        World.add(engine.world, currentBody)
        return () => {
            World.remove(engine.world, currentBody)
        }
    }, [body, engine.world])

    const [, setChanged] = useState(false)
    useEffect(() => {
        function updatePosition() {
            if (
                body.current.position.y > background.clientHeight ||
                body.current.position.x > background.clientWidth + 40 ||
                body.current.position.x < - 40
            ) {
                remove()
            } else {
                setChanged(changed => !changed)
            }
        }

        Events.on(engine, "afterUpdate", updatePosition)

        return () => {
            Events.off(engine, "afterUpdate", updatePosition)
        }
    }, [engine, body, remove, background])

    return [body.current, engine.world]
}

function spawnBody(background: HTMLDivElement) {
    const fan = 10
    const speed = Math.sqrt(2 * 0.00008 * background.clientHeight) * 15

    const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
    const x = Math.sin(angle) * speed
    const y = Math.cos(angle) * speed

    const spread = 15
    const xPos = background.clientWidth / spread + (background.clientWidth / spread) * (spread - 2) * Math.random()

    const icon = Bodies.circle(
        xPos,
        background.clientHeight,
        15,
        {
            torque: Math.random() * 500 - 250,
            frictionAir: 0,
            force: { x, y },
            density: 1,
            label: "icon",
            collisionFilter: {
                group: 0,
                category: 2,
                mask: 2
            }
        })

    return icon
}
