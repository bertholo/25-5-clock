import { useEffect, useState } from 'react';
import './App.scss';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState({ minutes: 25, seconds: 0 });
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (isRunning) {
      setTimer(setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime.minutes === 0 && prevTime.seconds === 0) {
            const newSession = !isSession;
            setIsSession(newSession);
            return {
              minutes: newSession ? sessionLength : breakLength,
              seconds: 0
            };
          }
          if (prevTime.seconds === 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 };
          }
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        });
      }, 1000));
    } else if (!isRunning && timer !== null) {
      clearInterval(timer);
      setTimer(null);
    }
    return () => clearInterval(timer); // Cleanup interval on unmount or reset
  }, [isRunning, isSession, breakLength, sessionLength]);

  const startStopHandler = () => {
    setIsRunning(!isRunning);
  };

  const resetHandler = () => {
    clearInterval(timer);
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft({ minutes: 25, seconds: 0 });
  };

  const incrementBreak = () => {
    if (breakLength < 60) setBreakLength(breakLength + 1);
  };

  const decrementBreak = () => {
    if (breakLength > 1) setBreakLength(breakLength - 1);
  };

  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft({ minutes: sessionLength + 1, seconds: 0 });
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft({ minutes: sessionLength - 1, seconds: 0 });
    }
  };

  return (
    <div id="app">
      <h1>25 + 5 Clock</h1>
      <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
      <div id="time-left">
        {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}:
        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
      </div>
      <div id="controls">
        <button id="start_stop" onClick={startStopHandler}>Start/Stop</button>
        <button id="reset" onClick={resetHandler}>Reset</button>
      </div>
      <div id="settings">
        <div>
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={decrementBreak}>-</button>
          <div id="break-length">{breakLength}</div>
          <button id="break-increment" onClick={incrementBreak}>+</button>
        </div>
        <div>
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={decrementSession}>-</button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-increment" onClick={incrementSession}>+</button>
        </div>
      </div>
    </div>
  );
}

export default App;
