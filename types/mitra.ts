export interface KlasifikasiMitra {
  id: number;
  nama: string;
}

export interface MitraFull {
  id: number;
  nama: string;
  klasifikasi_mitra_id: number;
  alamat?: string;
  contact_person?: string;
  logo_mitra?: string;
  klasifikasi_mitra?: KlasifikasiMitra;
  created_at: string;
  updated_at: string;
}

export interface MitraResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: MitraFull[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface MitraPayload {
  nama: string;
  klasifikasi_mitra_id: number;
  alamat?: string;
  contact_person?: string;
}

export interface Mitra {
  id: number;
  nama: string;
}

export interface MitraSearchResponse {
  success: boolean;
  data: Mitra[];
}

export interface MitraCreateResponse {
  success: boolean;
  data: Mitra;
}
