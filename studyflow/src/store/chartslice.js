// src/store/chartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { subDays, isSameDay, format } from "date-fns";

/**
 * Logs now store individual sessions with full ISO timestamp:
 *  { minutes: 25, date: "2025-09-05T12:34:56.789Z" }
 *
 * addLog will:
 *  - accept { minutes, date } (date optional -> uses now)
 *  - avoid immediate duplicates (same minutes within 5s)
 *  - push the session entry (we aggregate later when preparing chart data)
 */

const initialState = {
  logs: [], // array of { minutes: number, date: ISO-string }
  view: "week", // "day" | "week" | "year"
};

const FIVE_SECONDS = 5000;

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    addLog: (state, action) => {
      const { minutes, date } = action.payload || {};
      const ts = date ? new Date(date).toISOString() : new Date().toISOString();

      // dedupe: if last log is same minutes and within 5 seconds, ignore
      const last = state.logs.length ? state.logs[state.logs.length - 1] : null;
      if (
        last &&
        last.minutes === minutes &&
        Math.abs(new Date(last.date) - new Date(ts)) < FIVE_SECONDS
      ) {
        return; // skip duplicate
      }

      state.logs.push({ minutes: Number(minutes) || 0, date: ts });
    },

    setView: (state, action) => {
      state.view = action.payload;
    },

    // optional: clear logs (handy while testing)
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addLog, setView, clearLogs } = chartSlice.actions;
export default chartSlice.reducer;

/**
 * Helper: prepare chart data from raw session logs
 * - view === "day"  => 24 hourly buckets (00..23) for today
 * - view === "week" => last 7 days (Mon..Sun or last 7 days, oldest->newest)
 * - view === "year" => months Jan..Dec for current year
 *
 * Each returned item has { name, minutes } ready for Recharts.
 */
export const aggregateLogs = (logs = [], view = "week") => {
  const now = new Date();

  // safe parser
  const parse = (d) => (typeof d === "string" ? new Date(d) : d);

  if (view === "day") {
    const buckets = Array.from({ length: 24 }, () => 0);
    logs.forEach((l) => {
      const dt = parse(l.date);
      if (isSameDay(dt, now)) {
        const hr = Number.isFinite(dt.getHours()) ? dt.getHours() : 0;
        buckets[hr] += Number(l.minutes) || 0;
      }
    });
    return buckets.map((minutes, hr) => ({
      name: hr.toString().padStart(2, "0"),
      minutes,
    }));
  }

  if (view === "week") {
    const days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
    return days.map((day) => {
      const total = logs
        .filter((l) => isSameDay(parse(l.date), day))
        .reduce((s, l) => s + (Number(l.minutes) || 0), 0);
      return { name: format(day, "EEE"), minutes: total };
    });
  }

  if (view === "year") {
    const year = now.getFullYear();
    return Array.from({ length: 12 }, (_, i) => {
      const total = logs
        .filter((l) => {
          const d = parse(l.date);
          return d.getFullYear() === year && d.getMonth() === i;
        })
        .reduce((s, l) => s + (Number(l.minutes) || 0), 0);
      return { name: format(new Date(year, i, 1), "MMM"), minutes: total };
    });
  }

  return [];
};
