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
  Info,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { Link } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
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
import { useDashboardStats } from "~/hooks/use-dashboard";
import { useRecentActivities } from "~/hooks/use-helper";
import { Button } from "~/components/ui/button";
import DashboardSkeleton from "~/components/skeleton/dashboard-skeleton";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { Activity as ActivityType } from "types/activity";
export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const { data: apiResponse, isLoading: statsLoading } =
    useDashboardStats(selectedYear);
  const { data: activitiesResponse, isLoading: activitiesLoading } =
    useRecentActivities();
  // State untuk menyimpan status yang aktif di chart
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);

  const stats = apiResponse?.data;
  const statusNames = stats?.all_status_names || [];
  const docDistribution = stats?.document_status || [];
  const availableYears = stats?.available_years || [];

  // Sinkronisasi status aktif saat data pertama kali dimuat
  useEffect(() => {
    if (statusNames.length > 0) {
      setActiveStatuses(statusNames);
    }
  }, [statusNames]);

  const modernColors = [
    "#1E3A8A", // Biru Tua (Navy)
    "#06B6D4", // Cyan (Turquoise/Teal-ish)
    "#7DD3FC", // Biru Muda (Sky Light)
    "#3B82F6", // Biru Biasa (Standard/Brand Blue)
    "#2563EB", // Biru Royal (Deep Blue)
  ];

  // Tampilkan skeleton saat loading
  if (isLoading || statsLoading || activitiesLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-[#F8FAFC]">
      <div className=" mx-auto space-y-8">
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
              className="relative overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md group"
            >
              <CardContent className="py-2 px-6">
                {/* Baris Atas: Ikon + Label dan Ikon Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                      <stat.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                  </div>

                  <Info className="w-5 h-5 text-gray-300 cursor-help" />
                </div>

                {/* Baris Bawah: Nilai Utama + Badge Pertumbuhan */}
                <div className="flex items-center gap-3 px-2">
                  <p className="text-3xl font-bold tracking-tight text-gray-900">
                    {stat.val}
                  </p>
                  {stat.growth !== 0 && (
                    <div
                      className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold ${
                        typeof stat?.growth === "number" && stat.growth > 0
                          ? "bg-[#E8F8F0] text-[#34C759]"
                          : "bg-[#FEEBF0] text-[#FF3B30]"
                      }`}
                    >
                      {typeof stat?.growth === "number" && stat.growth > 0
                        ? "+"
                        : ""}
                      {stat.growth} {stat.desc}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Chart Section */}
          <Card className="lg:col-span-3 bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-6 pb-0">
              <div className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-col">
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Status Logbook
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Data 6 bulan terakhir
                    </CardDescription>
                  </div>
                </div>

                {/* Action Buttons ala Modern UI */}
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-xl border-gray-100 text-xs font-bold gap-2 text-gray-600"
                      >
                        <Filter className="w-3 h-3" /> Filter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-64 p-3 rounded-2xl"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <p className="text-sm font-bold text-slate-800">
                            Filter Status
                          </p>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">
                            {activeStatuses.length} Terpilih
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {statusNames.map((status, index) => (
                            <div
                              key={status}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer hover:bg-slate-50 ${
                                activeStatuses.includes(status)
                                  ? "border-primary/20 bg-primary/[0.02]"
                                  : "border-gray-100"
                              }`}
                              onClick={() => {
                                if (activeStatuses.includes(status)) {
                                  setActiveStatuses(
                                    activeStatuses.filter((s) => s !== status),
                                  );
                                } else {
                                  setActiveStatuses([
                                    ...activeStatuses,
                                    status,
                                  ]);
                                }
                              }}
                            >
                              <Checkbox
                                id={`status-${status}`}
                                checked={activeStatuses.includes(status)}
                                onCheckedChange={() => {}} // Controlled by div onClick
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`status-${status}`}
                                  className="text-xs font-semibold text-slate-700 cursor-pointer block"
                                >
                                  {status}
                                </Label>
                              </div>
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    modernColors[index % modernColors.length],
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg"
                            onClick={() => setActiveStatuses(statusNames)}
                          >
                            Reset Filter
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-gray-100 text-gray-400"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="px-6 pb-8 pt-10">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <BarChart
                    data={stats?.chart_data || []}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke="#F4F4F4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tick={{ fill: "#9A9FA5", fontWeight: 500 }}
                      dy={15}
                    />
                    <YAxis
                      hide // Menyembunyikan YAxis untuk tampilan lebih clean
                    />
                    <Tooltip
                      cursor={{ fill: "#F9FAFB" }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow:
                          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                        padding: "12px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        paddingTop: "40px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#6F767E",
                      }}
                    />

                    {statusNames.map((name, index) => {
                      if (!activeStatuses.includes(name)) return null;
                      return (
                        <Bar
                          key={name}
                          dataKey={name}
                          name={name}
                          stackId="a"
                          fill={modernColors[index % modernColors.length]}
                          barSize={40}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Status Dokumen
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Distribusi status saat ini
                </CardDescription>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[110px] h-8 text-xs border-slate-100 rounded-xl font-bold bg-slate-50/50">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-xs font-semibold">
                    Tahun
                  </SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="text-xs font-semibold"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-6">
              {docDistribution.map((doc, index) => (
                <div key={doc.status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 group/link">
                      <span className="text-sm font-medium text-slate-600">
                        {doc.status}
                      </span>
                      <Link
                        to={`/logbook?status=${doc.status_id}${selectedYear !== "all" ? `&tahun=${selectedYear}` : ""}`}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100 group-hover/link:opacity-100"
                        title={`Lihat logbook ${doc.status}`}
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-slate-900">
                        {doc.count}
                      </span>
                      <span className="text-[10px] font-bold text-secondary px-2 py-0.5 rounded-full uppercase">
                        {doc.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-primary"
                      style={{
                        width: `${doc.percentage}%`,
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
              {(activitiesResponse?.data || []).map(
                (activity: ActivityType) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-5 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`mt-0.5 p-2.5 rounded-xl text-white ${
                        activity.type.toLowerCase() === "logbook"
                          ? "bg-[#1E3A8A]"
                          : activity.type.toLowerCase() === "dokumen"
                            ? "bg-[#3B82F6]"
                            : "bg-[#EAB308]"
                      }`}
                    >
                      {activity.type.toLowerCase() === "logbook" ? (
                        <BookOpen className="h-4 w-4" />
                      ) : activity.type.toLowerCase() === "dokumen" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1E3A8A]">
                        {activity.action} •{" "}
                        <span className="text-xs text-slate-400">
                          ditambahkan oleh: {activity.user?.nama || "System"}
                        </span>
                      </p>
                      <p className="text-sm text-slate-500 mt-0.5 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-[#1E3A8A] transition-colors" />
                    </div>
                  </div>
                ),
              )}
              {(activitiesResponse?.data || []).length === 0 && (
                <div className="p-10 text-center text-slate-400">
                  <Activity className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Belum ada aktivitas</p>
                </div>
              )}
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
