import { useRef, useState } from "react"
import Head from "next/head"
import { motion, AnimatePresence } from "framer-motion"

import useLocalStorage from "../src/useLocalStorage"

import { EngineContext } from "../src/engineContext"
import { BackgroundContext } from "../src/backgroundContext"

import Icon from "../components/Icon"
import UserCard from "../components/UserCard"

import useEngine from "../src/useEngine"
import useGithubEvents from "../src/useGithubEvents"

export default function Index() {
  const engine = useEngine()
  const [events, setEvents] = useGithubEvents()

  const backgroundRef = useRef()

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [userCardPosition, setUserCardPosition] = useState({ x: 0, y: 0 })
  const [tutorial, setTutorial] = useLocalStorage("tutorial", true)

  return (
    <>
      <Head>
        <title>GitHub Events</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1,
                      maximum-scale=1, user-scalable=no, minimal-ui" />
        <link rel="manifest" href="/static/manifest.json" />
      </Head>
      <EngineContext.Provider value={ engine }>
        <BackgroundContext.Provider value={ backgroundRef.current }>
          <div
            ref={ backgroundRef }
            className={ "background" }
            onClickCapture={ event => {
              if (event.target === backgroundRef.current) {
                setSelectedEvent(null)
              }
            } }>
            {
              events.map(event =>
                <Icon
                  key={ event.id }
                  event={ event }
                  selected={ event === selectedEvent }
                  selectEvent={ position => {
                    setUserCardPosition(position)
                    setSelectedEvent(event)
                    setTutorial(false)
                  } }
                  remove={ () => {
                    setEvents(events => events.filter(e => e !== event))
                  } } />
              )
            }
          </div>
          <div
            className={ "uiLayer" }>
            <AnimatePresence>
              <UserCard
                key={ "userCard" }
                position={ userCardPosition }
                event={ selectedEvent } />
              {
                tutorial &&
                <motion.div
                  key={ "tutorial" }
                  initial={ {
                    position: "absolute",
                    bottom: "0px",
                    width: "100vw",
                    height: "20vh",
                    textAlign: "center",
                    opacity: 0,
                  } }
                  animate={ {
                    opacity: 1
                  } }
                  exit={ {
                    opacity: 0
                  } }>{
                    "tap an icon"
                  }
                </motion.div> }
            </AnimatePresence>
          </div>
          <style jsx>{ `
                      .background {
                          position: absolute;
                          overflow: hidden;
                          width: 100vw;
                          height: 100vh;
                          background-color: #272727;
                      }
                      .uiLayer {
                          pointer-events: none;
                          position: absolute;
                          overflow: hidden;
                          width: 100vw;
                          height: 100vh;
                      }
                  ` }
          </style>
          <style jsx global>{ `
                      @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
                      html {
                          user-select: none;
                  
                          font-family: "Roboto", sans-serif;
                          font-style: normal;
                          font-weight: normal;

                          white-space: nowrap;

                          color: #FFFFFF;
                      }
                      body {
                          margin: 0px;
                      }
                  ` }
          </style>
        </BackgroundContext.Provider>
      </EngineContext.Provider>
    </>
  )
}
