// types/logbook.ts

import type { StringValidation } from "zod/v3";

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
  nomor_dokumen_mitra: string | null;
  nomor_dokumen_undip: string | null;
  tanggal_masuk: string; // ISO 8601 format
  tanggal_terbit: string | null;
  jenis_dokumen: string | null;
  status: string | null;
  jenis_dokumen_id: number;
  status_id: number;
  mitra_id: number;
  mitra: MitraBrief;
  created_at: string;
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
  tanggal_masuk: string; // ISO 8601 format
  tanggal_terbit: string | null;
  jenis_dokumen: string | null;
  status: string | null;
  jenis_dokumen_id: number;
  status_id: number;
  mitra_id: number;
  mitra: MitraBrief;
  created_at: string;
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
