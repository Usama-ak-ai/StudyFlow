import TimerClock from "./TimerClock";
function Timer() {
  return (
    <>
      <div className="Timer-Container">
        <img className="Timer-img" src="/cat.png" alt="cat img" />
        <TimerClock></TimerClock>
      </div>
    </>
  );
}
export default Timer;
