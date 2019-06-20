import { useEffect, useRef } from "react"

const Index = () => {
    const matterContainer = useRef()

    useEffect(() => {
        import("../src").then(module => {
            module.default(matterContainer.current)
        })
    }, [matterContainer.current])

    return <div
    style={{
        width: "calc(100vw - 16px)",
        height: "calc(100vh - 16px)"
    }}
    ref={ matterContainer }/>
}

export default Index
