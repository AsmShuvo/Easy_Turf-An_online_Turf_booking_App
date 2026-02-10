import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { useAuth } from "../../Providers/AuthProvider";
import {
  Activity,
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap,
  Shield,
} from "lucide-react";

const COLORS = ["#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212"];

const Analytics = () => {
  const { user } = useAuth();

  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-bookings", user?.id],
    queryFn: async () => {
      const res = await api.get(`/bookings?ownerId=${user.id}`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  // Calculate Advanced Stats
  const stats = useMemo(() => {
    if (!bookings.length) return null;

    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
    const totalEarnings = confirmedBookings.reduce(
      (sum, b) => sum + (b.price || 0),
      0,
    );

    // Monthly Earnings Data
    const monthlyMap = {};
    confirmedBookings.forEach((b) => {
      const d = new Date(b.createdAt);
      const month = d.toLocaleString("default", { month: "short" });
      monthlyMap[month] = (monthlyMap[month] || 0) + (b.price || 0);
    });
    const earningsData = Object.entries(monthlyMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Peak Hours Data (Pie Chart)
    const slotMap = {};
    bookings.forEach((b) => {
      slotMap[b.slot] = (slotMap[b.slot] || 0) + 1;
    });
    const slotData = Object.entries(slotMap)
      .map(([name, value]) => ({ name: `${name}:00`, value }))
      .sort((a, b) => b.value - a.value);

    // Weekly Distribution (Bar Chart)
    const dayMap = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    bookings.forEach((b) => {
      const dateParts = b.date.split("/"); // Assuming DD/MM/YYYY
      if (dateParts.length === 3) {
        const d = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        const day = d.toLocaleString("default", { weekday: "short" });
        if (dayMap[day] !== undefined) dayMap[day]++;
      }
    });
    const weeklyData = Object.entries(dayMap).map(([name, value]) => ({
      name,
      value,
    }));

    // User Retention Data
    const userMap = {};
    bookings.forEach((b) => {
      userMap[b.userId] = (userMap[b.userId] || 0) + 1;
    });
    const totalUsers = Object.keys(userMap).length;
    const returningUsers = Object.values(userMap).filter(
      (count) => count > 1,
    ).length;
    const retentionRate =
      totalUsers > 0 ? ((returningUsers / totalUsers) * 100).toFixed(1) : 0;

    return {
      totalEarnings,
      earningsData,
      slotData,
      weeklyData,
      retentionRate,
      totalUsers,
      avgBookingValue:
        confirmedBookings.length > 0
          ? (totalEarnings / confirmedBookings.length).toFixed(0)
          : 0,
    };
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col justify-center items-center text-white">
        <Activity className="text-lime-400 animate-spin mb-4" size={48} />
        <span className="text-lime-400 font-black tracking-widest uppercase text-[10px] animate-pulse">
          Decrypting Operational Data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col justify-center items-center text-red-500">
        <Shield className="mb-4" size={48} />
        <span className="font-black uppercase tracking-widest text-[10px]">
          Intelligence Breach: {error.message}
        </span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col justify-center items-center text-gray-500">
        <Target className="mb-4 opacity-20" size={48} />
        <span className="font-black uppercase tracking-widest text-[10px]">
          No Tactical Data Available
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="relative">
        <div className="absolute -left-10 top-0 w-1 h-full bg-lime-400/20" />
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">
          Nexus <span className="text-lime-400">Intelligence</span>
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
          <Zap size={12} className="text-lime-400" />
          Real-Time Operational Analytics Pipeline
        </p>
      </header>

      {/* TACTICAL OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Gross Revenue"
          value={`৳${stats.totalEarnings.toLocaleString()}`}
          icon={<TrendingUp />}
          sub="Confirmed Settlements"
        />
        <StatCard
          label="Retention Rate"
          value={`${stats.retentionRate}%`}
          icon={<Users />}
          sub="Recurring Agents"
        />
        <StatCard
          label="Avg Ops Value"
          value={`৳${stats.avgBookingValue}`}
          icon={<Target />}
          sub="Per Successful Mission"
        />
        <StatCard
          label="Total Deployments"
          value={bookings.length}
          icon={<Shield />}
          sub="Mission Instance Count"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* REVENUE TRAJECTORY (Area Chart) */}
        <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent pointer-events-none" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center space-x-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span>Revenue Trajectory [LOG_V1]</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.earningsData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#222"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#444"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontWeight: "900", textTransform: "uppercase" }}
                />
                <YAxis
                  stroke="#444"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `৳${value}`}
                  tick={{ fontWeight: "900" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#080808",
                    border: "1px solid #333",
                    borderRadius: "12px",
                  }}
                  itemStyle={{
                    color: "#a3e635",
                    fontWeight: "900",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                  cursor={{ stroke: "#a3e635", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#a3e635"
                  fillOpacity={1}
                  fill="url(#colorVal)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WEEKLY ACTIVITY (Bar Chart) */}
        <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center space-x-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span>Weekly Engagement [FREQ]</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#222"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#444"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontWeight: "900", textTransform: "uppercase" }}
                />
                <YAxis
                  stroke="#444"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontWeight: "900" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#080808",
                    border: "1px solid #333",
                    borderRadius: "12px",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontWeight: "900",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                  cursor={{ fill: "rgba(163, 230, 53, 0.05)" }}
                />
                <Bar
                  dataKey="value"
                  fill="#a3e635"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PEAK ENGAGEMENT HOURS (Pie Chart) */}
        <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center space-x-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span>Peak Temporal distribution</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.slotData.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {stats.slotData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(0,0,0,0.5)"
                      strokeWidth={4}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#080808",
                    border: "1px solid #333",
                    borderRadius: "12px",
                  }}
                  itemStyle={{
                    fontWeight: "900",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    paddingLeft: "30px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RETENTION STATUS (Textural Data) */}
        <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center">
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
                Active Agents
              </span>
              <span className="text-2xl font-black text-white">
                {stats.totalUsers}
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
                Returning Forces
              </span>
              <span className="text-2xl font-black text-lime-400">
                {Math.round(stats.totalUsers * (stats.retentionRate / 100))}
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
                Sync Status
              </span>
              <span className="text-[10px] font-black text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full uppercase italic">
                Optimal
              </span>
            </div>
          </div>
          <p className="mt-10 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
            Notice: Data is aggregated across all tactical deployment windows.
            Revenue is calculated based on confirmed transaction signatures
            only.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, sub }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-lime-400/30 transition-all duration-500">
    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 rotate-12 group-hover:rotate-0 scale-150">
      {React.cloneElement(icon, { size: 100 })}
    </div>
    <p className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] mb-1">
      {label}
    </p>
    <p className="text-3xl font-black text-white italic tracking-tighter">
      {value}
    </p>
    <div className="mt-4 flex items-center space-x-2 text-gray-500 group-hover:text-lime-400 transition-colors">
      <div className="w-1 h-1 bg-current rounded-full" />
      <span className="text-[9px] font-bold uppercase tracking-widest">
        {sub}
      </span>
    </div>
  </div>
);

export default Analytics;
