import { Engine, Events, Render, World, Bodies } from "matter-js"

export default container => {
    // create an engine
    const engine = Engine.create()
    
    // create a renderer
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: 800,
            height: 600
        }
    })

    const ground = Bodies.rectangle(400, 670, 1600, 30, {
        isStatic: true,
        label: "ground"
    })

    World.add(engine.world, ground)

    // run the engine
    Engine.run(engine)

    // run the renderer
    Render.run(render)

    setInterval(() => {
        const fan = 30
        const spin = 5

        const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
        const x = Math.sin(angle)
        const y = Math.cos(angle)

        const torque = Math.random() * spin - spin / 2

        const box = Bodies.rectangle(400, 550, 20, 20, {
            force: { x, y },
            torque: torque,
            density: 0.04,
            label: "box"
        })

        World.add(engine.world, box)
    }, 300)

    Events.on(engine, "collisionStart", ({ pairs }) => {
        pairs.forEach(({ bodyA, bodyB }) => {
            if(bodyA.label === "ground" || bodyB.label === "ground"){
                if(bodyA.label === "box") {
                    World.remove(engine.world, bodyA, true)
                } else {
                    World.remove(engine.world, bodyB, true)
                }
            }
        })
    })
}