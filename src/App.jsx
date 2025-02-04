import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chart from './Chart'
import LineChart from './LineChart'
import DonutChart from './DonutChart'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Chart paddingRight={20} />
      <DonutChart />
    </div>

      {/* <LineChart /> */}
    </>
  )
}

export default App
