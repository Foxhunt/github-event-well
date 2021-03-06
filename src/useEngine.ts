import { useState, useEffect } from "react"

import { Engine, Runner } from "matter-js"

export default function useEngine() {
  const [engine] = useState(Engine.create({
    positionIterations: 1
  }))

  const [runner] = useState(Runner.create({}))
  useEffect(() => {
    engine.world.gravity = { x: 0, y: 0.00002, scale: 0.5 }

    Runner.run(runner, engine)

    return () => {
      Runner.stop(runner)
    }
  }, [runner, engine])

  return engine
}
