import { AnimatePresence, motion } from "framer-motion"

export default function UserCard({ event }) {
    return <AnimatePresence>
        {
            event &&
            <motion.div
                className={"hoveredEvent"}
                initial={{
                    width: "0vw",
                    opacity: 0
                }}
                animate={{
                    width: "10vw",
                    opacity: 1
                }}
                exit={{
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
        <style jsx>{`
            .hoveredEvent {
                position: absolute;
                width: 10vw;
            }
            .userAvatar {
                width: 100%;
                border-radius: 100%;
            }
        `}</style>
    </AnimatePresence>
}