import {
    useRef,
    useLayoutEffect
} from "react"

const useAnimationFrame = callback => {
    const callbackRef = useRef(callback)
    useLayoutEffect(
        () => {
            callbackRef.current = callback
        },
        [callback]
    )

    const loop = time => {
        frameRef.current = requestAnimationFrame(loop)
        const cb = callbackRef.current
        cb(time)
    }

    const frameRef = useRef<number>()
    useLayoutEffect(() => {
        frameRef.current = requestAnimationFrame(loop)
        return () =>
            cancelAnimationFrame(frameRef.current)
    }, [])
}

export default useAnimationFrame