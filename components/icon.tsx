import { useContext, useEffect, useState } from "react"
import { World, Bodies } from "matter-js"

import { EngineContext } from "../src/engineContext"
import getTexture from "../src/getTexture"

type Props = {
    event?: any
}

export default function Icon({ event }: Props) {
    const engine = useContext(EngineContext)
    const [body, setBody] = useState(spawnBody(engine, ""))

    return (
        <div style={{
            position: "absolute",
            top: `calc(50% - ${-body.position.y}px)`,
            left: `calc(50% - ${body.position.x}px)`,
            transform: `rotate(${body.angle * 180 / Math.PI}rad)`
        }}>icon</div>
    )
}

function spawnBody(engine, event) {
    const fan = 10
    const speed = 2 + Math.random()

    const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
    const x = Math.sin(angle) * speed
    const y = Math.cos(angle) * speed

    const icon = Bodies.circle(0, 0, 11, {
        torque: Math.random() * 6 - 3,
        frictionAir: 0,
        force: { x, y },
        density: 1,
        label: "box",
        collisionFilter: {
            group: 0,
            category: 2,
            mask: 1
        },
        render: {
            sprite: {
                texture: getTexture(event),
                xScale: 1,
                yScale: 1
            }
        }
    })

    World.add(engine.world, icon)
    return icon
}
