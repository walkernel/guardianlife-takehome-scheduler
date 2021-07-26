import './App.css';
import {useState} from 'react'
import TimeWidget from './components/TimeWidget.js'
function App() {
  let [maxLength, setMaxLength] = useState(3000);
  return (<>
    <label htmlFor="schedule-length">Schedule Length(ticks) </label>
    <input type="number" id="schedule-length" value={maxLength} onChange={e=>setMaxLength(Number(e.target.value))}/>
    <div className="guardian-body">
      <TimeWidget maxTime={maxLength} />
    </div>
    </>
  );
}

export default App;
