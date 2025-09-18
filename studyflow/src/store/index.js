import { configureStore } from "@reduxjs/toolkit";
import studyReducer from "./studySlice";
import timeReducer, { tick } from "./timeSlice";   // <-- import tick
import chartReducer from "./chartslice";

// --- Load state from localStorage ---
function loadState() {
  try {
    const serializedState = localStorage.getItem("studyState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
}

// --- Save state to localStorage ---
function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("studyState", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
}

// Preload from localStorage
const preloadedState = loadState();

// Create store
export const store = configureStore({
  reducer: {
    study: studyReducer,
    time: timeReducer,
    chart: chartReducer,
  },
  preloadedState,
});

// Persist study + time slice fields
store.subscribe(() => {
  saveState({
    study: store.getState().study,
    time: {
      completedSubjects: store.getState().time.completedSubjects,
      subject: store.getState().time.subject,
      time: store.getState().time.time,
      limit: store.getState().time.limit,
      isRunning: store.getState().time.isRunning,
      startTime: store.getState().time.startTime,
      progress: store.getState().time.progress,
    },
    chart: {
      logs: store.getState().chart.logs,   // ✅ persist logs
      view: store.getState().chart.view,   // optional: persist current view
    },
  });
});

// 🔔 Global ticker — keeps timer running even if TimerClock.jsx unmounted
setInterval(() => {
  store.dispatch(tick());
}, 1000);
