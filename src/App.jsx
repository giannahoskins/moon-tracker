import { useState, useEffect } from 'react'
import { getMoonIllumination, getMoonTimes } from 'suncalc'
import Moon from './Moon'

function App() {
  // getting date
  const now = new Date()
  const moon = getMoonIllumination(now)

  // getting shadow angle
  const angle = moon.phase * Math.PI * 2
  const lightX = Math.sin(angle) * 5
  const lightZ = Math.cos(angle) * 5

  // getting user location and time
  const [location, setLocation] = useState(null)

  // getting next rise/set times
  const [nextRise, setNextRise] = useState(null)
  const [nextSet, setNextSet] = useState(null)
  const [isMoonUp, setIsMoonUp] = useState(null)

  useEffect(() => {

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const lat = data.latitude
        const lng = data.longitude

        setLocation({ lat, lng })

          // getting next rise/set times
          const times = getMoonTimes(now, lat, lng)
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          const tomorrowTimes = getMoonTimes(tomorrow, lat, lng)

          // show NEXT rise/set time
          setNextRise(times.rise < now ? tomorrowTimes.rise : times.rise)
          setNextSet(times.set < now ? tomorrowTimes.set : times.set)

          // checking last moon rise/set
          setIsMoonUp(times.rise < now && (times.set < times.rise || times.set > now))
      })
  }, [])
  
  return (
    <div>
      <h1 className="visually-hidden">The Lunar Oracle</h1>
      <img className="page-header" src="assets/page-header.png" alt="The Lunar Oracle"></img>
      <p className="moon-phase">Phase: {getMoonPhaseName(moon.phase)}</p>
      <p className="moon-times">
        {isMoonUp === null 
          ? 'Consulting the stars...'
          : isMoonUp 
            ? `The moon graces us with her presence. She rose at ${nextRise?.toLocaleTimeString()} and will rest at ${nextSet?.toLocaleTimeString()}.`
            : `She is slumbering as of ${nextSet?.toLocaleTimeString()}. Please do not disturb her. She will wake again at ${nextRise?.toLocaleTimeString()}.`
        }
      </p>
      <Moon lightX={lightX} lightZ={lightZ} />
    </div>
  )
}

function getMoonPhaseName(phase) {
  if (phase < 0.0625) return 'New Moon'
  if (phase < 0.1875) return 'Waxing Crescent'
  if (phase < 0.3125) return 'First Quarter'
  if (phase < 0.4375) return 'Waxing Gibbous'
  if (phase < 0.5625) return 'Full Moon'
  if (phase < 0.6875) return 'Waning Gibbous'
  if (phase < 0.8125) return 'Last Quarter'
  if (phase < 0.9375) return 'Waning Crescent'
  return 'New Moon'
}

export default App