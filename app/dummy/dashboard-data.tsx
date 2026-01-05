// src/data/dashboard-data.ts

export interface DashboardStats {
  totalMitra: number;
  totalDokumen: number;
  totalLog: number;
  growth: {
    mitra: string;
    dokumen: string;
    log: string;
  };
}

export interface DocumentStatus {
  status: "selesai" | "dalam_proses" | "terbit";
  count: number;
  percentage: number;
}

export interface LogbookChart {
  month: string;
  selesai: number;
  dalam_proses: number;
  terbit: number;
}

export interface RecentActivity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: "logbook" | "dokumen" | "mitra";
}

export const dashboardStats: DashboardStats = {
  totalMitra: 12,
  totalDokumen: 48,
  totalLog: 156,
  growth: {
    mitra: "+2 bulan ini",
    dokumen: "+8 minggu ini",
    log: "+12 hari ini",
  },
};

export const documentStatus: DocumentStatus[] = [
  { status: "selesai", count: 28, percentage: 58 },
  { status: "dalam_proses", count: 14, percentage: 29 },
  { status: "terbit", count: 6, percentage: 13 },
];

export const logbookChartData: LogbookChart[] = [
  { month: "Jan", selesai: 12, dalam_proses: 8, terbit: 3 },
  { month: "Feb", selesai: 15, dalam_proses: 10, terbit: 4 },
  { month: "Mar", selesai: 18, dalam_proses: 12, terbit: 5 },
  { month: "Apr", selesai: 22, dalam_proses: 9, terbit: 6 },
  { month: "Mei", selesai: 25, dalam_proses: 11, terbit: 7 },
  { month: "Jun", selesai: 28, dalam_proses: 14, terbit: 6 },
];

export const recentActivities: RecentActivity[] = [
  {
    id: 1,
    title: "Logbook Baru Ditambahkan",
    description: "Kegiatan rapat koordinasi dengan tim development",
    timestamp: "2 jam lalu",
    type: "logbook",
  },
  {
    id: 2,
    title: "Dokumen Diselesaikan",
    description: "Proposal penelitian telah selesai direview",
    timestamp: "5 jam lalu",
    type: "dokumen",
  },
  {
    id: 3,
    title: "Mitra Baru",
    description: "PT Teknologi Indonesia bergabung sebagai mitra",
    timestamp: "1 hari lalu",
    type: "mitra",
  },
  {
    id: 4,
    title: "Dokumen Diterbitkan",
    description: "Laporan semester genap telah diterbitkan",
    timestamp: "2 hari lalu",
    type: "dokumen",
  },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "selesai":
      return "text-green-600 bg-green-50";
    case "dalam_proses":
      return "text-blue-600 bg-blue-50";
    case "terbit":
      return "text-purple-600 bg-purple-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "selesai":
      return "Selesai";
    case "dalam_proses":
      return "Dalam Proses";
    case "terbit":
      return "Terbit";
    default:
      return status;
  }
};
