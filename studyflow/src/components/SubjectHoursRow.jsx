import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { setActiveSession } from "../store/timeslice";

function SubjectHoursRow({
  subject = "",
  min = 0,
  max = 720,
  step = 1,
  initial = 120,
  onChange,
  onRemove,
}) {
  const dispatch = useDispatch();
  const completedSubjects = useSelector(
    (state) => state.time.completedSubjects
  );

  const [minutes, setMinutes] = useState(initial);
  const percent = useMemo(
    () => ((minutes - min) / (max - min)) * 100,
    [minutes, min, max]
  );

  const handleStart = () => {
    dispatch(setActiveSession({ name: subject, minutes }));
  };

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    setMinutes(val);
    onChange?.(val);
  };

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const isCompleted = completedSubjects.includes(subject);

  return (
    <div className="subject-row">
      <div className="subject-label">
        {isCompleted && (
          <span style={{ color: "green", marginRight: "6px" }}>✔</span>
        )}
        {subject}
      </div>

      <button className="remove-btn" onClick={() => onRemove(subject)}>
        ✕
      </button>

      <div className="slider-wrap">
        <input
          type="range"
          className="hours-slider"
          min={min}
          max={max}
          step={step}
          value={minutes}
          onChange={handleChange}
          aria-label={`${subject} hours`}
          style={{ "--p": `${percent}%` }}
        />

        <div
          className="hours-badge"
          style={{ left: `calc(${percent}% - 24px)` }}
        >
          {formatTime(minutes)}
        </div>
      </div>
      <Link to="/timer">
        <button type="button" className="btn btn-info" onClick={handleStart}>
          Start Now
        </button>
      </Link>
    </div>
  );
}

export default SubjectHoursRow;
