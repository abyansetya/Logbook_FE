import React from "react";
import {
  Calendar,
  User,
  FileText,
  Plus,
  Loader2,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  ClipboardList, // Import icon clock untuk indikasi waktu update
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLogbookDetail } from "~/hooks/use-logbook";
import type { LogEntry } from "../../../types/logbook";

interface DocumentLogDetailsProps {
  documentId: number;
  onAddLog: (docId: number) => void;
  onEditLog?: (log: LogEntry) => void;
  onDeleteLog?: (logId: number) => void;
}

const DocumentLogDetails: React.FC<DocumentLogDetailsProps> = ({
  documentId,
  onAddLog,
  onEditLog,
  onDeleteLog,
}) => {
  const { data: detailData, isLoading, isError } = useLogbookDetail(documentId);

  // Helper untuk memformat tanggal utama
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        day: date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        year: date.getFullYear(),
      };
    } catch {
      return { day: dateString, year: "" };
    }
  };

  // Helper untuk memformat waktu update (Tooltip atau text kecil)
  const formatUpdateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
        <span className="text-sm font-medium text-gray-500">
          Memuat riwayat aktivitas...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-red-200 rounded-xl">
        <p className="text-sm text-red-600 font-medium">
          Gagal memuat detail log
        </p>
      </div>
    );
  }

  const logs = detailData?.data?.logs || [];

  return (
    <div className="mx-auto py-4">
      <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Riwayat Aktivitas
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Urutan kronologis pemrosesan dokumen
          </p>
        </div>
        <Button
          onClick={() => onAddLog(documentId)}
          className="bg-black text-white hover:bg-gray-800 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Log
        </Button>
      </div>

      <div className="relative">
        {logs.length > 0 ? (
          <div className="space-y-0">
            {logs.map((logEntry: LogEntry, index: number) => {
              const dateObj = formatDate(logEntry.tanggal_log);
              // Cek apakah data pernah diupdate (perbandingan string tanggal)
              const isUpdated =
                logEntry.updated_at &&
                logEntry.updated_at !== logEntry.tanggal_log;

              return (
                <div key={logEntry.id} className="group flex gap-6">
                  {/* Left Side: Date */}
                  <div className="w-20 pt-1 flex flex-col items-end">
                    <span className="text-sm font-bold text-black uppercase">
                      {dateObj.day}
                    </span>
                    <span className="text-xs text-gray-400">
                      {dateObj.year}
                    </span>
                  </div>

                  {/* Middle: Timeline Line & Dot */}
                  <div className="relative flex flex-col items-center">
                    <div className="z-10 w-4 h-4 rounded-full border-2 border-black bg-white group-hover:bg-black transition-colors" />
                    {index !== logs.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 group-hover:bg-black transition-colors" />
                    )}
                  </div>

                  {/* Right Side: Content Card */}
                  <div className="flex-1 pb-10">
                    <div className="bg-white border-2 border-gray-100 group-hover:border-black transition-all rounded-xl p-5 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              <User className="w-3 h-3" />
                              Admin: {logEntry.admin.nama}
                            </div>

                            {/* Indikator Update */}
                            {isUpdated && (
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium italic">
                                <span className="w-1 h-1 rounded-full bg-gray-300" />{" "}
                                {/* Dot Separator */}
                                <span>
                                  Diperbarui{" "}
                                  {formatUpdateTime(logEntry.updated_at)}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="text-base font-semibold text-gray-900 leading-relaxed">
                            {logEntry.keterangan}
                          </p>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                            onClick={() => onEditLog?.(logEntry)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            onClick={() => onDeleteLog?.(logEntry.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs font-medium text-gray-600">
                            CP:{" "}
                            <span className="text-black">
                              {logEntry.contact_person}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            {/* Container Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* Lingkaran background icon */}
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <ClipboardList className="w-8 h-8 text-gray-300" />
                </div>
                {/* Badge kecil Plus di pojok icon */}
                <div className="absolute -bottom-1 -right-1 bg-black text-white rounded-full p-1 border-2 border-gray-50">
                  <Plus className="w-3 h-3" />
                </div>
              </div>
            </div>

            <h4 className="text-gray-900 font-bold text-lg">
              Belum Ada Riwayat
            </h4>
            <p className="text-gray-500 font-medium max-w-[250px] mx-auto text-sm mt-1">
              Belum ada aktivitas yang tercatat untuk dokumen ini.
            </p>

            <Button
              variant="outline"
              onClick={() => onAddLog(documentId)}
              className="mt-6 border-black hover:bg-black hover:text-white transition-all font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Log Pertama
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLogDetails;
