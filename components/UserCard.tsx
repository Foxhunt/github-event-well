import { AnimatePresence, motion } from "framer-motion"

export default function UserCard({ event, position }) {
    return <>
        <AnimatePresence>
            {
                event &&
                <motion.div
                    style={{
                        position: "absolute"
                    }}
                    initial={{
                        top: `${100 * Math.random()}%`,
                        left: `${100 * Math.random()}%`,
                        width: "0vw",
                        opacity: 0
                    }}
                    animate={{
                        left: position.x,
                        top: position.y,
                        width: "10vw",
                        opacity: 1
                    }}
                    exit={{
                        top: `${100 * Math.random()}%`,
                        left: `${100 * Math.random()}%`,
                        width: "0vw",
                        opacity: 0
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}>
                    <p>
                        {event.actor.display_login}
                    </p>
                    <img
                        className={"userAvatar"}
                        src={event.actor.avatar_url} />
                </motion.div>
            }
        </AnimatePresence>
        <style jsx>{`
            .userAvatar {
                width: 100%;
                border-radius: 100%;
            }
        `}</style>
    </>
}