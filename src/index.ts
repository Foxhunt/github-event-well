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

import getTexture from "./getTexture"
import { MyBody } from "../defs";

const GITHUB_EVENTS_URL = "https://api.github.com/events"
const EVENT_FETCH_INTERVALL_TIME = 60 * 1000
const events = []

let repo = ""

export default (container: HTMLCanvasElement) => {
    // create an engine
    const engine = Engine.create()
    engine.world.gravity = { x: 0, y: 0.01, scale: 1 }

    // create a runner
    const runner = Runner.create({})

    //run the engine
    Runner.run(runner, engine)
    
    // create a renderer
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            hasBounds: true,
            wireframes: false,
        }
    })

    // run the renderer
    Render.run(render)

    const width = render.canvas.width
    const height = render.canvas.height

    const ground = Bodies.rectangle(width / 2, height + 60, width * 2, 1, {
        isStatic: true,
        label: "ground",
        collisionFilter: {
            group: 0,
            category: 1,
            mask: 2
        }
    })

    const wallLeft = Bodies.rectangle(0 - 30, height, 1, height * 2, {
        isStatic: true,
        label: "ground",
        collisionFilter: {
            group: 0,
            category: 1,
            mask: 2
        }
    })

    const wallRight = Bodies.rectangle(width + 30, height, 1, height * 2, {
        isStatic: true,
        label: "ground",
        collisionFilter: {
            group: 0,
            category: 1,
            mask: 2
        }
    })

    World.add(engine.world, [ground, wallLeft, wallRight])
    
    const mouseConstraint = MouseConstraint.create(engine, {
        // element: container,
        collisionFilter: {
            group: 0,
            category: 3,
            mask: 0
        }
    })

    World.add(engine.world, mouseConstraint)

    Events.on(engine, "collisionStart", onEventGroundCollision)

    Events.on(mouseConstraint, "mousedown", onEventClicked)

    fetchEvents()
    setInterval(fetchEvents, EVENT_FETCH_INTERVALL_TIME)
    setInterval(spawnBody, EVENT_FETCH_INTERVALL_TIME / 30)

    async function fetchEvents() {
        const respone = await fetch(repo ? repo : GITHUB_EVENTS_URL)

        const data = await respone.json()

        events.push(...data)
    }

    function spawnBody() {
        const fan = 10
        const speed = 2 + Math.random()

        const angle = (180 + fan / 2 - Math.random() * fan) * Math.PI / 180
        const x = Math.sin(angle) * speed
        const y = Math.cos(angle) * speed

        const spread = 20
        const xPos = width / spread + (width / spread) * (spread - 2) * Math.random() 

        const event = events.shift()

        const box: MyBody = Bodies.circle(xPos, ground.position.y - 30, 11, {
            torque: Math.random() * 6 - 3,
            frictionAir: 0,
            force: { x, y },
            density: 1,
            label: "icon",
            collisionFilter: {
                group: 0,
                category: 2,
                mask: 1
            },
            render: {
                sprite: {
                    texture: getTexture(event),
                    xScale: 1,
                    yScale: 1
                }
            }
        })

        box.event = event

        World.add(engine.world, box)
    }

    function onEventGroundCollision({ pairs }) {
        for(const { bodyA, bodyB } of pairs){
            if (bodyA.label === "ground" || bodyB.label === "ground") {
                if (bodyA.label === "icon") {
                    World.remove(engine.world, bodyA, true)
                    console.log("removed!")
                } else {
                    World.remove(engine.world, bodyB, true)
                    console.log("removed!")
                }
            }
        }
    }

    function onEventClicked({ mouse }) {
        const body: MyBody = Query.point(engine.world.bodies, mouse.mousedownPosition)[0];
        const index = engine.world.bodies.indexOf(body);
        const remove = engine.world.bodies.concat();
        remove.splice(index, 1);
        if (body) {
            World.remove(engine.world, remove[0])
            Body.setStatic(body, !body.isStatic)
            if(body.isStatic){
                repo = body.event.repo.url + "/events"
            } else {
                repo = ""
            }
        }
    }
}
 