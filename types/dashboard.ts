export interface TotalDashboard {
  mitra: number;
  dokumen: number;
  logs: number;
}

export interface StatsPeriodic {
  mitra_bulan_ini: number;
  dokumen_minggu_ini: number;
  log_hari_ini: number;
}

export interface DocumentStatus {
  status: string;
  count: number;
  percentage: number;
}

/** * Karena key di dalam chart_data bersifat dinamis (nama status dari DB),
 * kita gunakan Index Signature [key: string]
 */
export interface LogbookChart {
  month: string;
  [statusName: string]: number | string; // Mengizinkan key apapun yang bernilai number (count) atau string (month)
}

export interface DashboardData {
  totals: TotalDashboard;
  stats_periodic: StatsPeriodic;
  document_status: DocumentStatus[];
  chart_data: LogbookChart[];
  all_status_names: string[]; // Tambahkan ini sesuai response backend terbaru
  available_years: number[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
