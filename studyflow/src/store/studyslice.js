// store/studyslice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [], // [{ name: "Math", minutes: 120 }, ...]
};

const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    addSubject: (state, action) => {
      state.subjects.push(action.payload); // { name, minutes }
    },
    removeSubject: (state, action) => {
      state.subjects = state.subjects.filter(
        (s) => s.name !== action.payload
      );
    },
    updateSubjectMinutes: (state, action) => {   // ✅ renamed properly
      const { index, minutes } = action.payload;
      if (state.subjects[index]) {
        state.subjects[index].minutes = minutes;
      }
    },
  },
});

export const { addSubject, removeSubject, updateSubjectMinutes } = studySlice.actions;
export default studySlice.reducer;
