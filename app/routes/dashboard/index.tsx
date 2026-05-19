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
  Loader2,
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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { Activity as ActivityType } from "types/activity";
export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [activeDocumentTypes, setActiveDocumentTypes] = useState<
    string[] | null
  >(null);

  const {
    data: apiResponse,
    isLoading: statsLoading,
    isFetching: statsFetching,
  } = useDashboardStats(selectedYear);
  const { data: activitiesResponse, isLoading: activitiesLoading } =
    useRecentActivities();

  const stats = apiResponse?.data;
  const docDistribution = stats?.document_status || [];
  const availableYears = stats?.available_years || [];
  const isDashboardRefreshing = statsFetching && !statsLoading;
  const documentTypes = ["MoU", "MoA", "IA"];
  const selectedDocumentTypes = activeDocumentTypes ?? documentTypes;

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
    <div className="min-h-full bg-[#F8FAFC] lg:h-full lg:overflow-hidden">
      <div className="mx-auto flex h-full min-h-0 flex-col gap-3">
        {/* Welcome Section */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Dashboard Overview
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-primary lg:text-2xl">
              Selamat datang, {user.nama}
            </h1>
            <p className="text-sm text-slate-500">
              Ringkasan aktivitas dan statistik sistem Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="hidden text-xs font-medium text-slate-400 sm:block">
              Terakhir diperbarui: {new Date().toLocaleDateString()}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl border-gray-100 bg-white text-xs font-bold text-slate-600"
                >
                  <Activity className="h-3.5 w-3.5" />
                  Aktivitas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[82vh] max-w-4xl overflow-hidden p-0">
                <DialogHeader className="border-b border-slate-100 p-5 pr-12">
                  <DialogTitle>Aktivitas Terbaru</DialogTitle>
                  <DialogDescription>Log aktivitas terkini</DialogDescription>
                </DialogHeader>
                <div className="max-h-[64vh] divide-y divide-slate-50 overflow-y-auto">
                  {(activitiesResponse?.data || []).map(
                    (activity: ActivityType) => (
                      <div
                        key={activity.id}
                        className="group flex items-start gap-3 p-4 transition-colors hover:bg-slate-50/70"
                      >
                        <div
                          className={`mt-0.5 shrink-0 rounded-lg p-2 text-white ${
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
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1E3A8A]">
                            {activity.action}{" "}
                            <span className="text-xs font-normal text-slate-400">
                              oleh {activity.user?.nama || "System"}
                            </span>
                          </p>
                          <p className="mt-0.5 text-sm text-slate-500">
                            {activity.description}
                          </p>
                        </div>
                        <span className="shrink-0 text-right text-[10px] font-bold uppercase leading-tight text-slate-400">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                    ),
                  )}
                  {(activitiesResponse?.data || []).length === 0 && (
                    <div className="p-10 text-center text-slate-400">
                      <Activity className="mx-auto mb-2 h-10 w-10 opacity-20" />
                      <p className="text-sm">Belum ada aktivitas</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-3 md:grid-cols-3">
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
              className="relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <CardContent className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="rounded-md border border-gray-100 bg-gray-50 p-1.5">
                    <stat.icon className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-600">
                      {stat.label}
                    </p>
                    {stat.growth !== 0 && (
                      <p
                        className={`truncate text-[10px] font-bold ${
                          typeof stat?.growth === "number" && stat.growth > 0
                            ? "text-[#34C759]"
                            : "text-[#FF3B30]"
                        }`}
                      >
                        {typeof stat?.growth === "number" && stat.growth > 0
                          ? "+"
                          : ""}
                        {stat.growth} {stat.desc}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-xl font-bold tracking-tight text-gray-900">
                    {stat.val}
                  </p>
                  <Info className="h-3.5 w-3.5 cursor-help text-gray-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid flex-1 gap-3 overflow-hidden lg:min-h-0 lg:grid-cols-12">
          {/* Chart Section */}
          <Card className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-7 lg:flex lg:min-h-0 lg:flex-col">
            {isDashboardRefreshing && (
              <div className="absolute inset-x-0 top-0 z-20 h-1 overflow-hidden bg-slate-100">
                <div className="h-full w-1/3 animate-pulse rounded-r-full bg-primary" />
              </div>
            )}
            <div className="p-3 pb-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Jenis Dokumen
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Jumlah dokumen berdasarkan jenis
                    </CardDescription>
                  </div>
                </div>

                {/* Action Buttons ala Modern UI */}
                <div className="flex shrink-0 gap-2">
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    disabled={isDashboardRefreshing}
                  >
                    <SelectTrigger className="w-[110px] h-9 text-xs border-gray-100 rounded-xl font-bold bg-white text-gray-600">
                      <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all" className="text-xs font-semibold">
                        Semua Tahun
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDashboardRefreshing}
                        className="h-9 rounded-xl border-gray-100 text-xs font-bold gap-2 text-gray-600"
                      >
                        <Filter className="w-3 h-3" /> Jenis
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-64 p-3 rounded-2xl"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <p className="text-sm font-bold text-slate-800">
                            Filter Jenis
                          </p>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">
                            {selectedDocumentTypes.length} Terpilih
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {documentTypes.map((type, index) => (
                            <div
                              key={type}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer hover:bg-slate-50 ${
                                selectedDocumentTypes.includes(type)
                                  ? "border-primary/20 bg-primary/[0.02]"
                                  : "border-gray-100"
                              }`}
                              onClick={() => {
                                if (selectedDocumentTypes.includes(type)) {
                                  setActiveDocumentTypes(
                                    selectedDocumentTypes.filter(
                                      (selectedType) => selectedType !== type,
                                    ),
                                  );
                                } else {
                                  setActiveDocumentTypes([
                                    ...selectedDocumentTypes,
                                    type,
                                  ]);
                                }
                              }}
                            >
                              <Checkbox
                                id={`document-type-${type}`}
                                checked={selectedDocumentTypes.includes(type)}
                                onCheckedChange={() => {}} // Controlled by div onClick
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`document-type-${type}`}
                                  className="text-xs font-semibold text-slate-700 cursor-pointer block"
                                >
                                  {type}
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
                            onClick={() => setActiveDocumentTypes(null)}
                          >
                            Reset Filter
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <CardContent className="relative flex-1 px-3 pb-3 pt-3 lg:min-h-0">
              {isDashboardRefreshing && (
                <div className="absolute inset-3 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-[1px]">
                  <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    Memuat data
                  </div>
                </div>
              )}
              <div className="h-[220px] w-full lg:h-full lg:min-h-[180px]">
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
                      dataKey="year"
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
                        paddingTop: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#6F767E",
                      }}
                    />

                    {documentTypes
                      .filter((type) => selectedDocumentTypes.includes(type))
                      .map((type, index) => (
                        <Bar
                          key={type}
                          dataKey={type}
                          name={type}
                          fill={modernColors[index % modernColors.length]}
                          barSize={30}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="relative rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-5 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden">
            {isDashboardRefreshing && (
              <div className="absolute inset-x-0 top-0 z-20 h-1 overflow-hidden bg-slate-100">
                <div className="h-full w-1/3 animate-pulse rounded-r-full bg-primary" />
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Status Dokumen
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Distribusi status saat ini
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-slate-50 px-3 py-1.5 text-right">
                  <p className="text-[10px] font-bold uppercase leading-none text-slate-400">
                    Total
                  </p>
                  <p className="mt-1 text-lg font-bold leading-none text-slate-900">
                    {stats?.totals.dokumen || 0}
                  </p>
                </div>
                <Select
                  value={selectedYear}
                  onValueChange={setSelectedYear}
                  disabled={isDashboardRefreshing}
                >
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
              </div>
            </CardHeader>
            <CardContent className="relative flex-1 p-3 pt-2 lg:min-h-0">
              {isDashboardRefreshing && (
                <div className="absolute inset-3 z-10 flex items-center justify-center rounded-lg bg-white/70 backdrop-blur-[1px]">
                  <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    Memuat data
                  </div>
                </div>
              )}
              <div className="grid h-full content-start gap-2 lg:grid-cols-2">
                {docDistribution.map((doc, index) => (
                  <div
                    key={doc.status}
                    className="rounded-lg border border-slate-100 bg-white p-2.5"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2 group/link">
                        <span className="truncate text-sm font-medium text-slate-600">
                          {doc.status}
                        </span>
                        <Link
                          to={`/logbook?status=${doc.status_id}${selectedYear !== "all" ? `&tahun=${selectedYear}` : ""}`}
                          className="shrink-0 rounded-md p-1 text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-primary group-hover/link:opacity-100"
                          title={`Lihat logbook ${doc.status}`}
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base font-bold leading-none text-slate-900">
                          {doc.count}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold uppercase text-secondary">
                          {doc.percentage}%
                        </p>
                      </div>
                    </div>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-primary"
                        style={{
                          width: `${doc.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
