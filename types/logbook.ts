// types/logbook.ts

export interface Admin {
  id: number;
  nama: string;
}

export interface LogEntry {
  id: number;
  tanggal_log: string;
  keterangan: string;
  contact_person: string;
  admin: Admin;
}

export interface Document {
  id: number;
  judul_dokumen: string;
  jenis_dokumen: string;
  status: string;
  tanggal_masuk: string | null;
}

export interface LogbookDetailData {
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
  from: number;
  to: number;
  total: number;
  links: PaginationLink[];
}

export interface PaginationLinks {
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
