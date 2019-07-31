import { useContext, useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Link from "next/link"

import { BackgroundContext } from "../src/backgroundContext"

export default function UserCard({ event, position }) {

    const background = useContext(BackgroundContext)

    const [animate, setAnimate] = useState({
        x: 0,
        y: 0,
        width: 180,
        opacity: 1
    })

    const width = 180
    const height = 40

    useEffect(() => {
        if (position && background) {
            if (position.x + width < background.clientWidth) {
                setAnimate(animate => ({
                    ...animate,
                    x: position.x,
                }))
            } else {
                setAnimate(animate => ({
                    ...animate,
                    x: position.x - 148,
                }))
            }

            if (position.y + 32 + height < background.clientHeight) {
                setAnimate(animate => ({
                    ...animate,
                    y: position.y + 32,
                }))
            } else {
                setAnimate(animate => ({
                    ...animate,
                    y: position.y - 42,
                }))
            }
        }
    }, [position, position.x, position.y, background])

    return <>
        <AnimatePresence>
            {
                event &&
                <motion.div
                    style={{
                        position: "absolute",
                        backgroundColor: "#000000",
                        borderRadius: 20,
                        height: 40,
                        width: 40
                    }}
                    initial={{
                        x: background.clientWidth * Math.random(),
                        y: background.clientHeight * Math.random(),
                        width: 40,
                        opacity: 0
                    }}
                    animate={animate}
                    exit={{
                        x: background.clientWidth * Math.random(),
                        y: background.clientHeight * Math.random(),
                        width: 40,
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
                        onClick={() => {
                            event && window.open(`https://github.com/${event.repo.name}`)
                        }}>{
                            event.repo.name
                    }</div>
                </motion.div>
            }
        </AnimatePresence>
        <style jsx>{`
            @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
            img {
                float: left;
                height: 100%;

                border-radius: 50%;
                
                pointer-events: all;
            }
            div {
                padding-left: 5px;

                height: 100%;
                
                font-family: "Roboto", sans-serif;
                font-style: normal;
                font-weight: normal;
                font-size: 10px;
                line-height: 0px;
                display: flex;
                align-items: center;
                text-align: center;
                text-transform: capitalize;

                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                color: #FFFFFF;
                
                pointer-events: all;
            }
        `}</style>
    </>
}
