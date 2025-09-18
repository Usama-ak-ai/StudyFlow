import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  time: 0,
  isRunning: false,
  progress: 0,
  subject: null,
  limit: 0,
  intervalId: null,
  completedSubjects: [],
  sessionLogged: false,
  startTime: null,   // <-- NEW
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setActiveSession: (state, action) => {
      const { name, minutes } = action.payload;
      state.subject = name;
      state.limit = (minutes || 0) * 60000;
      state.time = 0;
      state.progress = 0;
      state.isRunning = false;
      state.sessionLogged = false;
      state.startTime = null;
    },
    start: (state) => {
      state.isRunning = true;
      state.startTime = Date.now() - state.time; // resume from existing elapsed
      state.sessionLogged = false;
    },
    tick: (state) => {
      if (!state.isRunning) return;
      state.time = Date.now() - state.startTime; // <-- elapsed from absolute
      if (state.time < state.limit) {
        state.progress = Math.min(100, (state.time / state.limit) * 100);
      } else {
        state.isRunning = false;
        state.progress = 100;
        if (
          state.subject &&
          !state.completedSubjects.includes(state.subject)
        ) {
          state.completedSubjects.push(state.subject);
        }
      }
    },
    stop: (state) => {
      state.isRunning = false;
      state.time = 0;
      state.progress = 0;
      state.startTime = null;
    },
    markSessionLogged: (state) => {
      state.sessionLogged = true;
    },
  },
});


export const {
  setActiveSession,
  tick,
  start,
  stop,
  markSessionLogged,
} = timeSlice.actions;
export default timeSlice.reducer;
