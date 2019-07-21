import { createContext } from "react"
import { Engine } from "matter-js"

export const EngineContext = createContext(Engine.create())
