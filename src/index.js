import { Engine, Events, Render, World, Bodies, Bounds } from "matter-js"

export default container => {
    // create an engine
    const engine = Engine.create({})
    
    // create a renderer
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: 800,
            height: 600
        }
    })

    engine.world.gravity = { x: 0, y: 0 }

    const ground = Bodies.rectangle(400, 0, 800, 30, {
        isStatic: true,
        label: "ground"
    })

    // World.add(engine.world, ground)

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

        const xPos = 200 + 400 * Math.random() 

        const box = Bodies.rectangle(xPos, 600, 20, 20, {
            force: { x, y },
            density: 0.1,
            label: "box"
        })

        World.add(engine.world, box)

        const translate = {x : 0, y : -100}
        Bounds.translate(render.bounds, translate)
    }, 30)

    /*
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
    */
}
