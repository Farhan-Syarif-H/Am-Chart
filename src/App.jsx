import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chart from './Chart'
import LineChart from './LineChart'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Chart paddingRight={20} />

      {/* <LineChart /> */}
    </>
  )
}

export default App
