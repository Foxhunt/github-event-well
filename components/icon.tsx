import { useContext, useEffect, useState, useReducer } from "react"
import { World, Bodies, Events, Body } from "matter-js"

import { EngineContext } from "../src/engineContext"
import { BackgroundContext } from "../src/backgroundContext"

type Props = {
    event?: any
    remove: () => void
    icon: string
}

const initialPosition = {
    x: -50,
    y: -50,
    angle: 0
}

function positionReducer(state, body: Body) {
    return {
        x: body.position.x,
        y: body.position.y,
        angle: body.angle
    }
}

export default function Icon({ event, remove, icon }: Props) {
    const engine = useContext(EngineContext)
    const background: HTMLDivElement = useContext(BackgroundContext)

    const [body] = useState(spawnBody(background))
    useEffect(() => {
        World.add(engine.world, body)
        return () => {
            World.remove(engine.world, body)
        }
    }, [body, engine.world])

    const [{ x, y, angle }, dispatchBody] = useReducer(positionReducer, initialPosition)

    useEffect(() => {
        function updatePosition() {
            if (
                body.position.y > background.clientHeight + 100 ||
                body.position.x > background.clientWidth + 100 ||
                body.position.x < -100
            ) {
                remove()
            } else {
                dispatchBody(body)
            }
        }

        Events.on(engine, "afterUpdate", updatePosition)

        return () => {
            Events.off(engine, "afterUpdate", updatePosition)
        }
    }, [engine, body, remove, background])

    return <>
        <img
            onMouseOver={() => {
                console.log(event)
            }}
            src={icon}
            style={{
                position: "absolute",
                transform: `
                        translateX(${x}px)
                        translateY(${y}px)
                        rotate(${angle}deg)
                    `
            }} />
    </>
}

function spawnBody(background: HTMLDivElement) {
    const fan = 90
    const speed = 2 + Math.random()

    const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
    const x = Math.sin(angle) * speed
    const y = Math.cos(angle) * speed

    const spread = 20
    const xPos = background.clientWidth / spread + (background.clientWidth / spread) * (spread - 2) * Math.random()

    const icon = Bodies.circle(
        xPos,
        background.clientHeight,
        11,
        {
            torque: Math.random() * 10 - 3,
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
