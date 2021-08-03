import './App.css'
import { Ping } from './components/Ping'
import { Stat } from './components/Stat'

function App() {
  return (
    <div className="container">
      <Stat/>
      <Ping/>
    </div>
  );
}

export default App;
