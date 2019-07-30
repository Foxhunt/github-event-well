import { useContext, useEffect, useState, useReducer } from "react"
import { World, Bodies, Events, Body } from "matter-js"
import Octicon from "@primer/octicons-react"

import { EngineContext } from "../src/engineContext"
import { BackgroundContext } from "../src/backgroundContext"
import getTexture from "../src/getTexture"

type Props = {
    event?: any
    remove: () => void
    onPointerOver: () => void
    onPointerOut: () => void
    onPointerDown: () => void
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

export default function Icon({
    event,
    remove,
    onPointerOver,
    onPointerOut,
    onPointerDown
}: Props) {
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

    useEffect(() => {
        fetch(event.actor.avatar_url)
    }, [event.actor.avatar_url])

    return <div
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        style={{
            width: "40px",
            position: "absolute",
            color: "white",
            transform: `
                    translateX(${x}px)
                    translateY(${y}px)
                    rotate(${angle}deg)
            `
        }} >
        <Octicon
            icon={getTexture(event)}
            size="medium" />
    </div>
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
