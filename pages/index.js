import { useState, useEffect, useRef } from "react"

const Index = () => {
    const matterContainer = useRef()

    useEffect(() => {
        if(matterContainer.current){
            import("../src").then(module => {
                module.default(matterContainer.current)
            })
        }
    }, [])

    return <div ref={ matterContainer }/>
}

export default Index
