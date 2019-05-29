import { useEffect, useRef } from "react"

const Index = () => {
    const matterContainer = useRef()

    useEffect(() => {
        import("../src").then(module => {
            module.default(matterContainer.current)
        })
    }, [matterContainer.current])

    return <div ref={ matterContainer }/>
}

export default Index
