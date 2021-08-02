import { useEffect, useRef, useState } from 'react'
import './App.css';
import { Statistic } from './lib/Statistic';

function App() {
  const [values, setValues] = useState([])
  const ws = useRef(null)
  const stat = useRef(null)
  stat.current = new Statistic()

  const handleStart = () => {
    ws.current = new WebSocket("wss://trade.trademux.net:8800/?password=1234")
    ws.current.onopen = () => console.log("ws opened")
    ws.current.onclose = () => console.log("ws closed")
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      stat.current.set(data.value)
    }
  }

  const handleCalcStatistic = () => {
    const start = Date.now()
    const size = stat.current.size
    const ar = [...stat.current.data.entries()]
    let sum = 0
    let mode = 0
    let maxFreq = 0
    let amount = 0
    let medianPosition = Math.ceil(size / 2)
    let median = 0
    let d = 0
    ar.sort((a,b) => a[0] - b[0])
    for (let i = 0; i < ar.length; i++) {
      sum += ar[i][0]*ar[i][1]
      amount += ar[i][1]
      if (medianPosition < amount && !median) {
        median = ar[i][0]
      } else if (medianPosition === amount && !median) {
        if (size % 2 === 0) {
          median = (ar[i][0] + ar[i+1][0]) / 2
        } else median = ar[i][0]
      }
      if (ar[i][1] > maxFreq) {
        maxFreq = ar[i][1]
        mode = ar[i][0]
      }
    }
    let average = (sum / size).toFixed(2)
    for (let i = 0; i < ar.length; i++) {
      d += Math.pow(ar[i][0] - average, 2)*ar[i][1]
    }
    let deviation = Math.sqrt(d/(size - 1)).toFixed(2)
    let time = Date.now() - start

    setValues([...values, { average, median, mode, deviation, time }])
  }

  const handleClose = () => {
    if (ws.current) {
      ws.current.close()
    }
  }

  useEffect(() => {
    const websocket = ws.current
      return () => {
        if (websocket)
        websocket.close()
      }
  }, [])

  return (
    <div className="App">
      <button onClick={handleStart}>start</button>
      <button onClick={handleClose}>close</button>
      <button onClick={handleCalcStatistic}>statistic</button>
      <table>
        <thead>
          <tr>
            <td>Среднее</td>
            <td>Медиана</td>
            <td>Мода</td>
            <td>Отклонение</td>
            <td>Время, мс</td>
          </tr>
        </thead>
        <tbody>
          {
            values.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.average}</td>
                  <td>{item.median}</td>
                  <td>{item.mode}</td>
                  <td>{item.deviation}</td>
                  <td>{item.time}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
