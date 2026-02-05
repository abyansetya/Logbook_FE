// types/logbook.ts

export interface Admin {
  id: number;
  nama: string;
}

export interface LogEntry {
  id: number;
  tanggal_log: string;
  keterangan: string;
  unit_id: number | null;
  unit_name: string | null;
  updated_at: string;
  admin: Admin;
}

export interface Document {
  id: number;
  judul_dokumen: string;
  nomor_dokumen_mitra: string | null;
  nomor_dokumen_undip: string | null;
  tanggal_dokumen: string | null;
  tanggal_masuk: string; // ISO 8601 format
  tanggal_terbit: string | null;
  contact_person: string | null;
  jenis_dokumen: string | null;
  status: string | null;
  jenis_dokumen_id: number;
  status_id: number;
  mitra_id: number;
  mitra: MitraBrief;
  created_at: string;
}

export interface LogbookDetailData extends Document {
  logs: LogEntry[];
}

export interface LogbookDetailResponse {
  data: LogbookDetailData;
}

export interface PaginationLink {
  page: number | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface LogbooksData {
  data: Document[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface LogbooksResponse {
  data: LogbooksData;
}

export interface MitraBrief {
  id: number;
  nama: string;
}

export interface addDokumenRequest {
  mitra_id: number;
  jenis_dokumen_id: number;
  status_id: number;
  judul_dokumen: string;
  nomor_dokumen_mitra?: string;
  nomor_dokumen_undip?: string;
  tanggal_masuk: string;
  tanggal_terbit?: string;
}

export interface DokumenData {
  id: number;
  judul_dokumen: string;
  nomor_dokumen_mitra: string | null;
  nomor_dokumen_undip: string | null;
  tanggal_dokumen: string | null;
  tanggal_masuk: string; // ISO 8601 format
  tanggal_terbit: string | null;
  contact_person: string | null;
  jenis_dokumen: string | null;
  status: string | null;
  jenis_dokumen_id: number;
  status_id: number;
  mitra_id: number;
  mitra: MitraBrief;
  created_at: string;
}

export interface LogData {
  id: number;
  user_id: number;
  mitra_id: number;
  dokumen_id: number;
  keterangan: string;
  tanggal_log: string;
}

export interface updateLogData {
  user_id: number;
  unit_id?: number | null;
  keterangan: string;
  tanggal_log: string;
}

export interface updateLogResponse {
  success: boolean;
  message: string;
  data: updateLogData;
}

export interface addLogResponse {
  success: boolean;
  message: string;
  data: LogData;
}

export interface AddDokumenResponse {
  success: boolean;
  message: string;
  data: DokumenData;
}

export interface DocumentSearchResponse {
  success: boolean;
  data: DokumenData[];
}

export interface DeleteDokumenResponse {
  success: boolean;
  message: string;
}

export interface DeleteLogResponse {
  success: boolean;
  message: string;
}
