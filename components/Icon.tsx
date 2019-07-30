import { useContext, useEffect, useState, useReducer } from "react"
import Octicon from "@primer/octicons-react"

import useMatter from "../src/useMatter"
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

export default function Icon({
    event,
    remove,
    onPointerOver,
    onPointerOut,
    onPointerDown
}: Props) {
    const { x, y, angle } = useMatter(initialPosition, remove)

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
