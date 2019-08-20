import { useContext, useState, useEffect } from "react"
import { motion } from "framer-motion"
import Octicon, { getIconByName } from "@primer/octicons-react"

import { BackgroundContext } from "../src/backgroundContext"

export default function UserCard({ event, position }) {
    const background = useContext<HTMLDivElement>(BackgroundContext)

    const [open, setOpen] = useState(false)

    const [x, setX] = useState(Math.random() * background.clientWidth)
    const [y, setY] = useState(Math.random() * background.clientHeight)

    const width = 200
    const height = open ? 125 : 40

    useEffect(() => {
        if (position && background) {
            if (
                position.x > 0 &&
                position.x + width < background.clientWidth
            ) {
                setX(position.x)
            } else if (position.x < 0) {
                setX(5)
            } else {
                setX(background.clientWidth - width - 5)
            }

            if (position.y + 32 + height < background.clientHeight) {
                setY(position.y + 32)
            } else {
                setY(position.y - height)
            }
        }
    }, [position, position.x, position.y, background, height])

    return <>
        <motion.div
            style={{
                position: "absolute",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(1px)",
                borderRadius: 20,
                height,
                width: 40,
                display: "grid",
                gridTemplateColumns: "40px auto 25px",
                gridTemplateRows: "40px auto",
                overflow: "hidden",
                pointerEvents: "all"
            }}
            initial={{
                x,
                y,
                width: 40,
                opacity: 0
            }}
            animate={{
                x,
                y,
                width,
                height,
                opacity: 1
            }}
            exit={{
                x,
                y,
                width: 40,
                height: 40,
                opacity: 0
            }}
            transition={{
                type: "spring",
                damping: 20,
                mass: 1,
                stiffness: 200,
                velocity: 2
            }}>
            <img
                onClick={() => {
                    event && window.open(`https://github.com/${event.actor.login}`)
                }}
                src={event.actor.avatar_url} />
            <div
                id="repo"
                onClick={() => {
                    event && window.open(`https://github.com/${event.repo.name}`)
                }}>{
                    event.repo.name
                }</div>
            <div
                id="openCloseDetails"
                onClick={() => {
                    setOpen(open => !open)
                }}>
                <Octicon
                    icon={getIconByName(open ? "chevron-up" : "chevron-down")}
                    size={"small"} />
            </div>
            <div
                id="details">
                actor: {event.actor.display_login} <br />
                time: {new Date(Date.parse(event.created_at)).toLocaleString()} <br />
                type: {event.type} <br />
            </div>
        </motion.div>
        <style jsx>{`
            img {
                height: 100%;
                margin: -2px;
                border-style: solid;
                border-width: 2px;
                border-radius: 50%;
                border-color: #272727;
            }
            #repo {
                padding-left: 5px;

                font-size: 10px;
                line-height: 40px;
                text-transform: capitalize;

                overflow: hidden;
                text-overflow: ellipsis;
            }
            #openCloseDetails {
                color: ${open ? "white" : "#696969"};
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #details {
                grid-column: 1/-1;
                grid-row: 2/-1;

                padding: 8px;

                font-size: 14px;

                overflow: hidden;
                text-overflow: ellipsis;
            }
        `}</style>
    </>
}
