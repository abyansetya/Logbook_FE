// src/routes/dashboard/index.tsx
import { useAuth } from "~/provider/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Users,
  FileText,
  BookOpen,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { recentActivities } from "../../dummy/dashboard-data";
import { useDashboardStats } from "~/hooks/use-dashboard";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: apiResponse, isLoading: statsLoading } = useDashboardStats();

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#1E3A8A] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = apiResponse?.data;
  const statusNames = stats?.all_status_names || [];
  const docDistribution = stats?.document_status || [];

  // Definisi Palet Warna: Biru Tua, Biru Muda, Kuning (Solid & Kontras)
  const dashboardColors = [
    "#1E3A8A", // Biru Tua (Primary)
    "#3B82F6", // Biru Muda (Secondary)
    "#EAB308", // Kuning/Gold (Accent)
    "#1D4ED8", // Biru Medium
    "#60A5FA", // Biru Langit
    "#CA8A04", // Kuning Gelap
  ];

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <header className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-widest">
            Dashboard Overview
          </p>
          <h1 className="text-4xl font-semibold text-primary tracking-tight text-">
            Selamat datang, {user.nama}
          </h1>
          <p className="text-slate-500">
            Ringkasan aktivitas dan statistik sistem Anda
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Total Mitra",
              val: stats?.totals.mitra,
              growth: stats?.stats_periodic.mitra_bulan_ini,
              icon: Users,
              desc: "Bulan ini",
              color: "text-[#1E3A8A]",
            },
            {
              label: "Total Dokumen",
              val: stats?.totals.dokumen,
              growth: stats?.stats_periodic.dokumen_minggu_ini,
              icon: FileText,
              desc: "Minggu ini",
              color: "text-[#1E3A8A]",
            },
            {
              label: "Log Aktivitas",
              val: stats?.totals.logs,
              growth: stats?.stats_periodic.log_hari_ini,
              icon: BookOpen,
              desc: "Hari ini",
              color: "text-[#1E3A8A]",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p
                      className={`text-4xl font-bold tracking-tight ${stat.color}`}
                    >
                      {stat.val}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      <span className="text-green-600 font-medium">
                        +{stat.growth}
                      </span>
                      <span className="text-xs text-green-600">
                        {stat.desc}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 bg-[#1E3A8A]">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-slate-50 rounded-full opacity-50" />
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Chart Section */}
          <Card className="lg:col-span-3 bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Status Logbook
              </CardTitle>
              <CardDescription className="text-slate-400">
                Data 6 bulan terakhir
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={stats?.chart_data || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: "#64748B" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tick={{ fill: "#64748B" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
                  />

                  {statusNames.map((name, index) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      name={name}
                      stackId="a"
                      fill={dashboardColors[index % dashboardColors.length]}
                      radius={
                        index === statusNames.length - 1
                          ? [4, 4, 0, 0]
                          : [0, 0, 0, 0]
                      }
                      barSize={30}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Document Status */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Status Dokumen
              </CardTitle>
              <CardDescription className="text-slate-400">
                Distribusi status saat ini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {docDistribution.map((doc, index) => (
                <div key={doc.status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      {doc.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">
                        {doc.count}
                      </span>
                      <span className="text-[10px] font-bold text-blue-500 px-2 py-0.5 rounded-full uppercase">
                        {doc.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                      style={{
                        width: `${doc.percentage}%`,
                        backgroundColor:
                          dashboardColors[index % dashboardColors.length],
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Summary Circle */}
              <div className="pt-4 mt-4 border-t border-slate-50">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#1E3A8A"
                        strokeWidth="10"
                        strokeDasharray={`${(docDistribution[0]?.percentage || 0) * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">
                        {stats?.totals.dokumen || 0}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Log aktivitas terkini
                </CardDescription>
              </div>
              <Activity className="w-5 h-5 text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-5 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                >
                  <div
                    className={`mt-0.5 p-2.5 rounded-xl text-white ${
                      activity.type === "logbook"
                        ? "bg-[#1E3A8A]"
                        : activity.type === "dokumen"
                          ? "bg-[#3B82F6]"
                          : "bg-[#EAB308]"
                    }`}
                  >
                    {activity.type === "logbook" ? (
                      <BookOpen className="h-4 w-4" />
                    ) : activity.type === "dokumen" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1E3A8A]">
                      {activity.title}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {activity.timestamp}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-[#1E3A8A] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-xs font-medium text-slate-400">
            © 2026 Dashboard System • Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString()}
          </p>
        </footer>
      </div>
    </div>
  );
}
