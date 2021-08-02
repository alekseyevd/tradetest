import { useEffect, useRef } from 'react'
import './App.css';
import { connect } from './indexeddb'
import Queue from './lib/Queue'

const NUM_TO_SAVE = 2000

function App() {
  const ws = useRef(null)
  const data = useRef(null)
  const db = useRef(null)
  const queue = useRef(null)

  const handleStart = () => {
    ws.current = new WebSocket("wss://trade.trademux.net:8800/?password=1234")
    data.current = []
    ws.current.onopen = () => console.log("ws opened")
    ws.current.onclose = () => console.log("ws closed")
    ws.current.onmessage = (e) => {
      queue.current.put(JSON.parse(e.data))
    }
  }

  const handleCalcStatistic = () => {
    let start = Date.now()
    let trans = db.current.transaction(['books'], "readonly")
    let store = trans.objectStore('books')
    let index = store.index('value_idx')

    var cursorRequest = index.openCursor()

    var res = []

    cursorRequest.onsuccess = function(e) {

        var cursor = e.target.result
        if (cursor) {
            res.push(cursor.value)
            cursor.continue()
        }
        else {
          console.log(Date.now() - start, 'ms')
          console.log(res)
        }
    };
  }

  const handleClose = () => {
    if (ws.current) {
      ws.current.close()
    }
  }

  useEffect(() => {
      ( async () => {
        db.current = await connect()
      })()
      const websocket = ws.current
      queue.current = new Queue()
      queue.current.on('put', function () {
        const _this = this
        if (this.size === NUM_TO_SAVE) {
          console.log(`накопилось ${NUM_TO_SAVE}, сохранием в базу`)
          let start = Date.now()
          const tx = db.current.transaction(["books"], "readwrite")
      
          for (let i = 0; i < NUM_TO_SAVE; i++) {
            tx.objectStore("books").add(_this.items[i])
          }
      
          tx.oncomplete = function(event) {
            console.log('complete')
            _this.pick(NUM_TO_SAVE)
            console.log('осталось после записи', _this.size)
            console.log(Date.now() - start, 'ms')
          }
        }
      })
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
    </div>
  );
}

export default App;
