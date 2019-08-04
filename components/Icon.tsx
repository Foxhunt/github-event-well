import { useEffect, useState, useRef } from "react"
import Octicon from "@primer/octicons-react"

import { Body, Constraint, World } from "matter-js"

import useBody from "../src/useBody"
import getIcon from "../src/getIcon"

export default function Icon({
    event,
    remove,
    selectEvent,
    selected
}) {
    const [body, world] = useBody(remove)
    const constraint = useRef<Constraint>(null)

    useEffect(() => {
        if (selected && !constraint.current) {
            constraint.current = Constraint.create({
                pointA: { x: body.position.x, y:  body.position.y },
                bodyB: body,
                stiffness: 0.006,
                damping: 0.018
            })
            World.add(world, constraint.current)
        } else if (!selected && constraint.current) {
            World.remove(world, constraint.current, true)
            constraint.current = null
            const fan = 90
            const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
            const x = Math.sin(angle) * 3
            const y = Math.cos(angle) * 3
            Body.setVelocity(body, {x, y})
            Body.setAngularVelocity(body, 4 + 1 * (Math.random() * 2 - 1))
        }
    }, [selected, body, constraint, world])

    useEffect(() => {
        fetch(event.actor.avatar_url)
    }, [event.actor.avatar_url])

    return <div
        onClick={() => {
            selectEvent({ ...body.position })
        }}
        style={{
            transform: `
                    translateX(${body.position.x}px)
                    translateY(${body.position.y}px)
                    rotate(${body.angle}deg)
            `
        }} >
        <Octicon
            icon={getIcon(event)}
            size={ "medium" }/>
        <style jsx>{`
            div {
                position: absolute;
                padding: 4px;
                color: ${selected ? "white" : "#696969"};
            }
        `}</style>
    </div>
}
