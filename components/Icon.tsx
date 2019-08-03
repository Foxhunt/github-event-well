import { useEffect, useState } from "react"
import Octicon from "@primer/octicons-react"

import { Body } from "matter-js"

import useBody from "../src/useBody"
import getIcon from "../src/getIcon"

export default function Icon({
    event,
    remove,
    selectEvent,
    selected
}) {
    const body = useBody(remove)

    useEffect(() => {
        if (selected) {
            Body.setStatic(body, selected)
        } else {
            if (body.isStatic){
                const fan = 90
                const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
                const x = Math.sin(angle) * 3
                const y = Math.cos(angle) * 3
                Body.setVelocity(body, {x, y})
                Body.setAngularVelocity(body, 4 + 1 * (Math.random() * 2 - 1))
            }
            Body.setStatic(body, selected)
        }
    }, [selected, body])

    useEffect(() => {
        fetch(event.actor.avatar_url)
    }, [event.actor.avatar_url])

    return <div
        onClick={() => {
            selectEvent(body.position)
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
