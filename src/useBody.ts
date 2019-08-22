import { useContext, useState, useEffect, useRef } from "react"
import { World, Events, Bodies, Body, Engine } from "matter-js"

import { EngineContext } from "./engineContext"
import { BackgroundContext } from "./backgroundContext"

let maxY = 0

export default function UseBody(remove): [Body, World]{
    const engine = useContext(EngineContext)
    const background: HTMLDivElement = useContext(BackgroundContext)

    const body = useRef(spawnBody(background, engine))
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

            if(body.current.position.y <= 0 && body.current.position.y <= maxY){
                maxY = body.current.position.y
                console.log("top!", maxY)
            }
        }

        Events.on(engine, "afterUpdate", updatePosition)

        return () => {
            Events.off(engine, "afterUpdate", updatePosition)
        }
    }, [engine, body, remove, background])

    return [body.current, engine.world]
}

function spawnBody(background: HTMLDivElement, engine: Engine) {
    const fan = 10

    const angle = -(90 + fan / 2 - Math.random() * fan) * Math.PI / 180

    //const y = 
    //const x = y / Math.tan(angle)

    const vx = 0
    const vy = -Math.sqrt(2 * engine.world.gravity.y * background.clientHeight)

    const spread = 15
    const xPos = background.clientWidth / spread + (background.clientWidth / spread) * (spread - 2) * Math.random()

    const icon = Bodies.circle(
        background.clientWidth / 2,
        background.clientHeight,
        15,
        {
            torque: Math.random() * 500 - 250,
            frictionAir: 0,
            density: 1,
            label: "icon",
            collisionFilter: {
                group: 0,
                category: 2,
                mask: 2
            }
        })

    Body.setVelocity(icon, { x: vx, y: vy })

    //console.log("spawn!", vy)

    return icon
}
