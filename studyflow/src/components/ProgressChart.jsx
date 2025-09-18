import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./ProgressChart.css";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { subDays, isSameDay, format, startOfDay } from "date-fns";

const minutesToHM = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// Choose a padded Y domain so tiny values aren't huge bars
const getYDomain = (view, data) => {
  const max = data.reduce((mx, d) => Math.max(mx, d.minutes || 0), 0);
  if (view === "day") return [0, Math.max(60, max + 5)]; // at least 60 mins
  if (view === "week") return [0, Math.max(180, max + 10)]; // at least 3 hours
  return [0, Math.max(600, max + 30)]; // at least 10 hours
};

const ProgressChart = () => {
  const [view, setView] = useState("day");
  const logs = useSelector((state) => state.chart.logs);
  // Expected shape per entry:
  // { minutes: number, date: string } where date is ISO (preferred) or "yyyy-MM-dd"

  const now = new Date();

  // ----- Build chart data -----
  const chartData = useMemo(() => {
    // Helper to parse date safely
    const parse = (d) => (typeof d === "string" ? new Date(d) : d);

    if (view === "day") {
      // 24 hourly buckets 00..23 for today
      const buckets = Array.from({ length: 24 }, () => 0);
      logs.forEach((log) => {
        const dt = parse(log.date);
        if (isSameDay(dt, now)) {
          const hr = Number.isFinite(dt.getHours()) ? dt.getHours() : 0;
          buckets[hr] += log.minutes || 0;
        }
      });

      // Show hour labels; to reduce clutter, we’ll show ticks every 3 hours via XAxis ticks prop.
      return buckets.map((mins, hr) => ({
        name: hr.toString().padStart(2, "0"),
        minutes: mins,
        hour: hr,
      }));
    }

    if (view === "week") {
      // last 7 days (oldest -> newest)
      const days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
      return days.map((day) => {
        const total = logs
          .filter((l) => isSameDay(parse(l.date), day))
          .reduce((s, l) => s + (l.minutes || 0), 0);
        return { name: format(day, "EEE"), minutes: total, day };
      });
    }

    if (view === "year") {
      // months Jan..Dec of current year
      const year = now.getFullYear();
      return Array.from({ length: 12 }, (_, i) => {
        const total = logs
          .filter(
            (l) =>
              parse(l.date).getFullYear() === year &&
              parse(l.date).getMonth() === i
          )
          .reduce((s, l) => s + (l.minutes || 0), 0);
        return {
          name: format(new Date(year, i, 1), "MMM"),
          minutes: total,
          month: i,
        };
      });
    }

    return [];
  }, [logs, view, now]);

  // ----- Summary values -----
  const todayTotal = useMemo(() => {
    return logs
      .filter((l) => isSameDay(new Date(l.date), now))
      .reduce((s, l) => s + (l.minutes || 0), 0);
  }, [logs, now]);

  const weekTotal = useMemo(() => {
    const weekStart = subDays(startOfDay(now), 6);
    return logs
      .filter((l) => new Date(l.date) >= weekStart)
      .reduce((s, l) => s + (l.minutes || 0), 0);
  }, [logs, now]);

  const yearTotal = useMemo(() => {
    const y = now.getFullYear();
    return logs
      .filter((l) => new Date(l.date).getFullYear() === y)
      .reduce((s, l) => s + (l.minutes || 0), 0);
  }, [logs, now]);

  const yDomain = getYDomain(view, chartData);

  // For day view, show ticks every 3 hours to avoid clutter
  const dayTicks = Array.from({ length: 9 }, (_, i) =>
    String(i * 3).padStart(2, "0")
  );

  return (
    <div className="dashboard">
      {/* View Selector */}
      <div className="view-selector">
        {["day", "week", "year"].map((v) => (
          <button
            key={v}
            className={`selector-btn ${view === v ? "active" : ""}`}
            onClick={() => setView(v)}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              ticks={view === "day" ? dayTicks : undefined}
              interval={view === "day" ? 0 : "preserveEnd"}
            />
            <YAxis
              domain={yDomain}
              allowDecimals={false}
              tickFormatter={(v) =>
                v >= 60 ? `${Math.floor(v / 60)}h` : `${v}m`
              }
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value) => minutesToHM(value)}
              labelFormatter={(label) =>
                view === "day" ? `Hour ${label}:00` : label
              }
            />
            <Bar
              dataKey="minutes"
              fill="#82ca9d"
              activeBar={<Rectangle fill="lightblue" stroke="white" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">Today: {minutesToHM(todayTotal)}</div>
        <div className="summary-card">This Week: {minutesToHM(weekTotal)}</div>
        <div className="summary-card">This Year: {minutesToHM(yearTotal)}</div>
      </div>
    </div>
  );
};

export default ProgressChart;
