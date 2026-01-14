// ~/lib/constants.ts

export const JENIS_DOKUMEN = [
  { id: 1, nama: "Memorandum of Understanding (MoU)" },
  { id: 2, nama: "Memorandum of Agreement (MoA)" },
  { id: 3, nama: "Implementation Arrangement (IA)" },
] as const;

export type JenisDokumenType = (typeof JENIS_DOKUMEN)[number];
