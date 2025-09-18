import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { start, stop, markSessionLogged } from "../store/timeslice";
import { addLog } from "../store/chartslice";
import "./TimerClock.css";

function TimerClock() {
  const dispatch = useDispatch();
  const { time, isRunning, subject, limit, progress, sessionLogged } =
    useSelector((state) => state.time);

  // ✅ Log exactly once for completed session
  useEffect(() => {
    if (time >= limit && !isRunning && !sessionLogged) {
      const minutes = Math.round(limit / 60000);
      dispatch(addLog({ minutes, date: new Date().toISOString() }));
      dispatch(markSessionLogged());
    }
  }, [time, limit, isRunning, sessionLogged, dispatch]);

  // Start/Stop handler
  const startStop = () => {
    if (isRunning) {
      dispatch(stop());
    } else {
      dispatch(start());
    }
  };

  // Utility: format milliseconds -> HH:MM:SS
  function formatTime(ms) {
    if (!ms || isNaN(ms)) return "00:00:00"; // ✅ handles 0, null, NaN

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return (
    <div className="timer-card">
      <div className="timer-display">
        <div
          className="circular-progress"
          style={{
            background: `conic-gradient(#4e54c8 ${progress}%, #f0f0f0 ${progress}%)`,
          }}
        >
          <div className="progress-inner">
            <div className="time">{formatTime(time)}</div>
            <div className="timer-status">
              {isRunning ? "Running" : "Paused"}
            </div>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <button
          className={`control-btn ${isRunning ? "giveup" : "start"}`}
          onClick={startStop}
        >
          {isRunning ? "✕ Give Up" : "▶ Start"}
        </button>
      </div>

      <div className="timer-info">
        <div className="info-item">
          <span className="label">Subject:</span>
          <span className="value">{subject}</span>
        </div>
        <div className="info-item">
          <span className="label">Time Limit:</span>
          <span className="value">{formatTime(limit)}</span>
        </div>
      </div>
    </div>
  );
}

export default TimerClock;
