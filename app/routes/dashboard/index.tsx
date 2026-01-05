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
  AreaChart,
  Area,
} from "recharts";
import {
  dashboardStats,
  documentStatus,
  logbookChartData,
  recentActivities,
  getStatusLabel,
} from "../../dummy/dashboard-data";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-white">
        <p className="text-neutral-500">Unauthorized</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <header className="space-y-1">
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest">
            Dashboard
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-black">
            Selamat datang, {user.nama}
          </h1>
          <p className="text-neutral-500">
            Ringkasan aktivitas dan statistik sistem Anda
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Total Mitra",
              value: dashboardStats.totalMitra,
              growth: dashboardStats.growth.mitra,
              icon: Users,
            },
            {
              title: "Total Dokumen",
              value: dashboardStats.totalDokumen,
              growth: dashboardStats.growth.dokumen,
              icon: FileText,
            },
            {
              title: "Total Log",
              value: dashboardStats.totalLog,
              growth: dashboardStats.growth.log,
              icon: BookOpen,
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
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-black tracking-tight">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-black" />
                      <span className="text-neutral-600">{stat.growth}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-black rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-neutral-100 rounded-full opacity-50" />
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Chart Section */}
          <Card className="lg:col-span-3 bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-black">
                    Status Logbook
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    Perkembangan 6 bulan terakhir
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                    <span className="text-neutral-500">Selesai</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                    <span className="text-neutral-500">Proses</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <span className="text-neutral-500">Terbit</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={logbookChartData} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#a3a3a3"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#a3a3a3"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                    }}
                    cursor={{ fill: "#fafafa" }}
                  />
                  <Bar
                    dataKey="selesai"
                    fill="#171717"
                    radius={[6, 6, 0, 0]}
                    name="Selesai"
                  />
                  <Bar
                    dataKey="dalam_proses"
                    fill="#a3a3a3"
                    radius={[6, 6, 0, 0]}
                    name="Dalam Proses"
                  />
                  <Bar
                    dataKey="terbit"
                    fill="#e5e5e5"
                    radius={[6, 6, 0, 0]}
                    name="Terbit"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Document Status */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-black">
                Status Dokumen
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Distribusi status saat ini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {documentStatus.map((doc, index) => (
                <div key={doc.status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">
                      {getStatusLabel(doc.status)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-black">
                        {doc.count}
                      </span>
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                        {doc.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                        index === 0
                          ? "bg-black"
                          : index === 1
                            ? "bg-neutral-400"
                            : "bg-neutral-300"
                      }`}
                      style={{ width: `${doc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Summary Circle */}
              <div className="pt-4 mt-4 border-t border-neutral-100">
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
                        stroke="#f5f5f5"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#171717"
                        strokeWidth="8"
                        strokeDasharray={`${documentStatus[0]?.percentage * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-black">
                        {documentStatus.reduce((acc, d) => acc + d.count, 0)}
                      </span>
                      <span className="text-xs text-neutral-400">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-black">
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Log aktivitas terkini dari sistem
                </CardDescription>
              </div>
              <Activity className="w-5 h-5 text-neutral-300" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-5 hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <div
                    className={`mt-0.5 p-2.5 rounded-xl transition-colors ${
                      activity.type === "logbook"
                        ? "bg-black text-white"
                        : activity.type === "dokumen"
                          ? "bg-neutral-200 text-neutral-700"
                          : "bg-neutral-100 text-neutral-500"
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
                    <p className="text-sm font-medium text-black group-hover:underline">
                      {activity.title}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-neutral-400 whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-xs text-neutral-400">
            © 2025 Dashboard System. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
