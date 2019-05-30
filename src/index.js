import { Bodies, Body, Bounds, Engine, Events, Render, Runner, World } from "matter-js"

export default container => {
    // create an engine
    const engine = Engine.create()
    engine.world.gravity = { x: 0, y: 0.01 }

    // create a runner
    const runner = Runner.create()

    //run the engine
    Runner.run(runner, engine)
    
    // create a renderer
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: 1000,
            hasBounds: true
        }
    })

    // run the renderer
    Render.run(render)

    const width = render.canvas.width
    const height = render.canvas.height

    const ground = Bodies.rectangle(width / 2, height - 30, width * 2, 1, {
        isStatic: true,
        label: "ground",
        collisionFilter: {
            category: 1,
            mask: 2
        }
    })

    World.add(engine.world, ground)

    setInterval(() => {
        const fan = 3
        const speed = 0.7

        const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
        const x = Math.sin(angle) * speed
        const y = Math.cos(angle) * speed

        const spread = 10
        const xPos = width / spread + (width / spread) * (spread - 2) * Math.random() 

        const box = Bodies.rectangle(xPos, ground.position.y - 30, 20, 20, {
            frictionAir: 0.004,
            force: { x, y },
            density: 0.05,
            label: "box",
            collisionFilter: {
                category: 2,
                mask: 1
            }
        })

        World.add(engine.world, box)
    }, 300)

    Events.on(runner, "afterTick", () => {
        const translate = {x : 0, y : -0.1 * runner.delta}
        Bounds.translate(render.bounds, translate)
        Body.translate(ground, translate)
    })

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
