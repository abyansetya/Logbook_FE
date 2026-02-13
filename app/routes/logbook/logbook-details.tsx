import React, { useState } from "react";
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
  ClipboardList,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useDeleteLog, useLogbookDetail } from "../../hooks/use-logbook";
import type { LogEntry } from "../../../types/logbook";
import UpdateLog from "../../components/modal/UpdateLog";
import { deleteLog } from "~/service/logbook-service";
import ConfirmDeleteModal from "~/components/modal/KonfirmasiDelete";
import { useAuth } from "~/provider/auth-context";

interface DocumentLogDetailsProps {
  documentId: number;
  onAddLog: (docId: number) => void;
  onDeleteLog?: (logId: number) => void;
}

const DocumentLogDetails: React.FC<DocumentLogDetailsProps> = ({
  documentId,
  onAddLog,
  onDeleteLog,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("Admin");
  const isOperator = user?.roles?.includes("Operator");
  const canManage = isAdmin || isOperator;
  const { data: detailData, isLoading, isError } = useLogbookDetail(documentId);

  // State untuk mengontrol Modal UpdateLog
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const deleteLogMutation = useDeleteLog(documentId);

  // Custom date formatter to avoid hydration mismatches
  const getSafeDateParts = (dateString: string) => {
    try {
      if (!dateString) return { day: "-", year: "" };
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { day: dateString, year: "" };

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];

      const day = date.getDate().toString().padStart(2, "0");
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return {
        day: `${day} ${month}`,
        year: year.toString(),
      };
    } catch {
      return { day: "-", year: "" };
    }
  };

  const formatUpdateTime = (dateString: string) => {
    try {
      if (!dateString) return "-";
      const { day } = getSafeDateParts(dateString);
      return day;
    } catch {
      return "-";
    }
  };

  // Fungsi yang dijalankan saat tombol hapus di klik
  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  // Fungsi yang dijalankan saat konfirmasi di modal delete di klik
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteLogMutation.mutate(deleteConfirmId, {
        onSuccess: () => {
          setDeleteConfirmId(null);
        },
      });
    }
  };
  const handleEditClick = (log: LogEntry) => {
    setSelectedLog(log);
    setIsEditModalOpen(true);
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
  const isTerbit = detailData?.data?.status === "Terbit";

  return (
    <div className="mx-auto py-4">
      <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Riwayat Aktivitas
          </h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            Urutan kronologis pemrosesan dokumen
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {detailData?.data?.draft_dokumen ? (
              <a
                href={detailData.data.draft_dokumen}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-200 font-bold hover:bg-yellow-100 transition-colors flex items-center gap-2"
              >
                <ClipboardList className="w-3 h-3" />
                DRAFT DOKUMEN
              </a>
            ) : (
              <div className="text-xs bg-gray-50 text-gray-400 px-3 py-1.5 rounded-lg border border-gray-200 border-dashed font-bold flex items-center gap-2">
                <Clock className="w-3 h-3" />
                DRAFT BELUM DIUNGGAH
              </div>
            )}

            {detailData?.data?.final_dokumen ? (
              <a
                href={detailData.data.final_dokumen}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 font-bold hover:bg-green-100 transition-colors flex items-center gap-2"
              >
                <FileText className="w-3 h-3" />
                DOKUMEN FINAL
              </a>
            ) : detailData?.data?.status === "Terbit" ? (
              <div className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 border-dashed font-bold flex items-center gap-2 animate-pulse">
                <FileText className="w-3 h-3" />
                DOKUMEN FINAL WAJIB DIUNGGAH
              </div>
            ) : (
              <div className="text-xs bg-gray-50 text-gray-400 px-3 py-1.5 rounded-lg border border-gray-200 border-dashed font-bold flex items-center gap-2">
                <FileText className="w-3 h-3" />
                DOKUMEN FINAL: -
              </div>
            )}
          </div>
          {detailData?.data?.contact_person && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border-2 border-black w-fit mt-3">
              <MessageSquare className="w-4 h-4 text-black" />
              <span className="text-sm font-bold text-gray-900">
                CP:{" "}
                <span className="text-black">
                  {detailData.data.contact_person}
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {canManage && (
            <Button
              onClick={() => onAddLog(documentId)}
              disabled={isTerbit}
              className={`bg-black text-white hover:bg-gray-800 shadow-lg ${
                isTerbit ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title={
                isTerbit ? "Dokumen sudah terbit, tidak dapat menambah log" : ""
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Log
            </Button>
          )}
          {isTerbit && (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
              Dokumen Terbit (Log Terkunci)
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        {logs.length > 0 ? (
          <div className="space-y-0">
            {logs.map((logEntry: LogEntry, index: number) => {
              const dateObj = getSafeDateParts(logEntry.tanggal_log);
              const isUpdated =
                logEntry.updated_at &&
                logEntry.updated_at !== logEntry.tanggal_log;

              return (
                <div key={logEntry.id} className="group flex gap-6">
                  <div className="w-20 pt-1 flex flex-col items-end">
                    <span className="text-sm font-bold text-black uppercase">
                      {dateObj.day}
                    </span>
                    <span className="text-xs text-gray-400">
                      {dateObj.year}
                    </span>
                  </div>

                  <div className="relative flex flex-col items-center">
                    <div className="z-10 w-4 h-4 rounded-full border-2 border-black bg-white group-hover:bg-black transition-colors" />
                    {index !== logs.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 group-hover:bg-black transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="bg-white border-2 border-gray-100 group-hover:border-black transition-all rounded-xl p-4 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              <User className="w-3 h-3" />
                              Admin: {logEntry.admin.nama}
                            </div>

                            {isUpdated && (
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium italic">
                                <span className="w-1 h-1 rounded-full bg-gray-300" />{" "}
                                <span>
                                  Diperbarui{" "}
                                  {formatUpdateTime(logEntry.updated_at)}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {logEntry.keterangan}
                            {logEntry.unit_name && (
                              <span className="text-gray-500 font-medium ml-1">
                                — {logEntry.unit_name}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canManage && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-gray-100"
                                onClick={() => handleEditClick(logEntry)}
                              >
                                <Edit className="w-4 h-4 text-yellow-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDeleteClick(logEntry.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
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
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <ClipboardList className="w-8 h-8 text-gray-300" />
                </div>
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

            {canManage && (
              <Button
                variant="outline"
                onClick={() => onAddLog(documentId)}
                disabled={isTerbit}
                className={`mt-6 border-black transition-all font-bold ${
                  isTerbit
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Log Pertama
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal Update Log */}
      {selectedLog && (
        <UpdateLog
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLog(null);
          }}
          logData={selectedLog}
          documentId={documentId}
        />
      )}

      <ConfirmDeleteModal
        label="log"
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLogMutation.isPending}
      />
    </div>
  );
};

export default DocumentLogDetails;
