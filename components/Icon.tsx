import { useContext, useEffect, useState, useReducer } from "react"
import Octicon from "@primer/octicons-react"

import { Body } from "matter-js"

import useBody from "../src/useBody"
import getIcon from "../src/getIcon"

import { BackgroundContext } from "../src/backgroundContext"

type Props = {
    event?: any
    remove: () => void
    onPointerDown: () => void
    selected: boolean
}

const initialPosition = {
    x: -50,
    y: -50,
    angle: 0
}

export default function Icon({
    event,
    remove,
    onPointerDown,
    selected
}: Props) {
    const body = useBody(remove)

    const background: HTMLDivElement = useContext(BackgroundContext)

    const [hovered, setHoved] = useState(false)

    const Icon = getIcon(event)

    useEffect(() => {
        if (selected) {
            Body.setStatic(body, selected)
        } else {
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
        onPointerDown={onPointerDown}
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
