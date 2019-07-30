import { useContext, useState, useEffect } from "react"
import { World, Events, Bodies } from "matter-js"

import { EngineContext } from "./engineContext"
import { BackgroundContext } from "./backgroundContext"

export default function useMatter(initialPosition, remove) {
    const engine = useContext(EngineContext)
    const background: HTMLDivElement = useContext(BackgroundContext)

    const [body] = useState(spawnBody(background))
    useEffect(() => {
        World.add(engine.world, body)
        return () => {
            World.remove(engine.world, body)
        }
    }, [body, engine.world])

    const [transform, setTransform] = useState(initialPosition)
    useEffect(() => {
        function updatePosition() {
            if (
                body.position.y > background.clientHeight + 100 ||
                body.position.x > background.clientWidth + 100 ||
                body.position.x < -100
            ) {
                remove()
            } else {
                setTransform(() => ({
                    x: body.position.x,
                    y: body.position.y,
                    angle: body.angle
                }))
            }
        }

        Events.on(engine, "afterUpdate", updatePosition)

        return () => {
            Events.off(engine, "afterUpdate", updatePosition)
        }
    }, [engine, body, remove, background])

    return transform
}

function spawnBody(background: HTMLDivElement) {
    const fan = 10
    const speed = 2.2 + Math.random()

    const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
    const x = Math.sin(angle) * speed
    const y = Math.cos(angle) * speed

    const spread = 15
    const xPos = background.clientWidth / spread + (background.clientWidth / spread) * (spread - 2) * Math.random()

    const icon = Bodies.circle(
        xPos,
        background.clientHeight,
        11,
        {
            torque: Math.random() * 10 - 5,
            frictionAir: 0,
            force: { x, y },
            density: 1,
            label: "icon",
            collisionFilter: {
                group: 0,
                category: 2,
                mask: 1
            }
        })

    return icon
}