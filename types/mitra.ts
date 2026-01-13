// types/mitra.ts (atau logbook.ts)
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
