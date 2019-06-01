import {
    Bodies,
    Body,
    Engine,
    Events,
    MouseConstraint,
    Render,
    Runner,
    World,
    Query
} from "matter-js"

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
            height: 800,
            hasBounds: true
        }
    })

    // run the renderer
    Render.run(render)

    const width = render.canvas.width
    const height = render.canvas.height

    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 1, {
        isStatic: true,
        label: "ground",
        collisionFilter: {
            category: 1,
            mask: 2
        }
    })

    const wallLeft = Bodies.rectangle(0, height, 1, height * 2, {
        isStatic: true,
        label: "ground",
        collisionFilter: {
            category: 1,
            mask: 2
        }
    })

    const wallRight = Bodies.rectangle(width, height, 1, height * 2, {
        isStatic: true,
        label: "ground",
        collisionFilter: {
            category: 1,
            mask: 2
        }
    })

    World.add(engine.world, [ground, wallLeft, wallRight])

    function spawnBody() {
        const fan = 4
        const speed = 0.5

        const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
        const x = Math.sin(angle) * speed
        const y = Math.cos(angle) * speed

        const spread = 20
        const xPos = width / spread + (width / spread) * (spread - 2) * Math.random() 

        const box = Bodies.circle(xPos, ground.position.y - 30, 11, {
            frictionAir: 0.004,
            force: { x, y },
            density: 0.03 * Math.random() + 0.07,
            label: "box",
            collisionFilter: {
                category: 2,
                mask: 1
            }
        })

        World.add(engine.world, box)
    }

    setInterval(spawnBody, 100)
    
    const mouseConstraint = MouseConstraint.create(engine, {
        element: container,
        collisionFilter: {
            category: 3,
            mask: 0
        }
    })

    World.add(engine.world, mouseConstraint)

    Events.on(mouseConstraint, "mousedown", ({mouse}) => {
        const body = Query.point(engine.world.bodies, mouse.mousedownPosition)[0]
        
        const index = engine.world.bodies.indexOf(body)

        const remove = engine.world.bodies.concat()
        remove.splice(index, 1)

        if(body){
            World.remove(engine.world, remove)
            Body.setStatic(body, !body.isStatic)
        }
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
