import { useContext, useEffect, useState, useReducer } from "react"
import Octicon from "@primer/octicons-react"

import { Body } from "matter-js"

import useBody from "../src/useBody"
import getIcon from "../src/getIcon"

import { BackgroundContext } from "../src/backgroundContext"

export default function Icon({
    event,
    remove,
    selectEvent,
    selected
}) {
    const body = useBody(remove)

    const background: HTMLDivElement = useContext(BackgroundContext)

    const [hovered, setHoved] = useState(null)

    const Icon = getIcon(event)

    useEffect(() => {
        if (selected) {
            Body.setStatic(body, selected)
        } else {
            if (body.isStatic){
                const x = Math.sin(Math.PI * 2 * Math.random()) * 3
                const y = Math.cos(Math.PI * 2 * Math.random()) * 3
                Body.setVelocity(body, {x, y})
                Body.setAngularVelocity(body, Math.random() * 4 - 2)
            }
            Body.setStatic(body, selected)
        }
    }, [selected, body])

    useEffect(() => {
        fetch(event.actor.avatar_url)
    }, [event.actor.avatar_url])

    return <div
        onPointerOver={()=> {
            setHoved(true)
        }}
        onPointerOut={()=> {
            setHoved(false)
        }}
        onPointerDown={() => selectEvent(body.position)}
        style={{
            position: "absolute",
            color: (selected || hovered) ? "orange" : "white",
            transform: `
                    translateX(${body.position.x}px)
                    translateY(${body.position.y}px)
                    rotate(${body.angle}deg)
            `
        }} >
        <Octicon
            size={ "medium" } >
            <Icon />
        </Octicon>
    </div>
}
