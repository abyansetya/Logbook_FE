import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "../../components/ui/badge";
import DocumentLogDetails from "./logbook-details";
import type { Document } from "../../../types/logbook";

interface LogbookTableProps {
  isLoading: boolean;
  filteredData: Document[];
  expandedRows: Set<number>;
  toggleRow: (id: number) => void;
  formatDate: (date: string | null) => string;
  getJenisStyle: (jenis: string) => string;
  getStatusStyle: (status: string) => string;
  currentOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  canManage: boolean;
  isAdmin: boolean;
  handleEditClick: (doc: Document) => void;
  setDeleteConfirmData: (
    data: { id: number; judul_dokumen: string } | null,
  ) => void;
  handleOpenAddLog: (docId: number) => void;

  meta: any;
  links: any;
  perPage: number;
  setPerPage: (val: number) => void;
  setCurrentPage: (page: number) => void;
}

export function LogbookTable({
  isLoading,
  filteredData,
  expandedRows,
  toggleRow,
  formatDate,
  getJenisStyle,
  getStatusStyle,
  currentOrder,
  toggleSortOrder,
  canManage,
  isAdmin,
  handleEditClick,
  setDeleteConfirmData,
  handleOpenAddLog,
  meta,
  links,
  perPage,
  setPerPage,
  setCurrentPage,
}: LogbookTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 w-12"></th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider min-w-[150px]">
                Nomor Dokumen
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider min-w-[150px]">
                Tanggal Dokumen
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider min-w-[200px]">
                Judul Dokumen
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider min-w-[120px]">
                Jenis
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider min-w-[120px]">
                Status
              </th>
              <th
                className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer group/sort hover:text-gray-900 transition-colors"
                onClick={toggleSortOrder}
              >
                <div className="flex items-center gap-1">
                  Tanggal Masuk
                  <div className="flex flex-col">
                    <ArrowUp
                      className={`w-3 h-3 -mb-1 ${
                        currentOrder === "asc" ? "text-black" : "text-gray-200"
                      }`}
                    />
                    <ArrowDown
                      className={`w-3 h-3 ${
                        currentOrder === "desc" ? "text-black" : "text-gray-200"
                      }`}
                    />
                  </div>
                </div>
              </th>
              {canManage && (
                <th className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-20 text-center text-gray-400 font-medium"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-20 text-center text-gray-400 font-medium"
                >
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              filteredData.map((doc) => (
                <React.Fragment key={doc.id}>
                  <tr
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    onClick={() => toggleRow(doc.id)}
                  >
                    <td className="px-6 py-4">
                      {expandedRows.has(doc.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-semibold text-gray-700">
                        {doc.nomor_dokumen_undip}
                      </div>
                      <div className="text-xs text-gray-400">
                        {doc.nomor_dokumen_mitra}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-700 font-medium">
                        {formatDate(doc.tanggal_dokumen)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-700 whitespace-normal break-words leading-relaxed">
                        {doc.judul_dokumen}
                      </div>
                      <div className="flex gap-2 mt-1">
                        {doc.draft_dokumen && (
                          <a
                            href={doc.draft_dokumen}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold hover:bg-yellow-200"
                          >
                            DRAFT
                          </a>
                        )}
                        {doc.final_dokumen && (
                          <a
                            href={doc.final_dokumen}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold hover:bg-green-200"
                          >
                            FINAL
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-lg w-full font-semibold px-2 py-1 lg:px-3 lg:py-1.5 whitespace-normal wrap-break-word text-center text-[10px] lg:text-sm ${getJenisStyle(
                          doc.jenis_dokumen || "-",
                        )}`}
                      >
                        {doc.jenis_dokumen}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`rounded-lg w-full px-2 py-1 lg:px-3 lg:py-1.5 font-semibold whitespace-normal wrap-break-word text-center text-[10px] lg:text-sm ${getStatusStyle(
                          doc.status ?? "-",
                        )}`}
                      >
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 font-medium text-[10px] lg:text-sm">
                        {formatDate(doc.tanggal_masuk)}
                      </div>
                      <div className="text-[9px] lg:text-[11px] text-gray-400">
                        Tanggal terbit: {formatDate(doc.tanggal_terbit)}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1">
                        {canManage && (
                          <>
                            <Button
                              variant="abu"
                              size="icon"
                              className={`w-8 h-8 ${
                                !isAdmin && doc.status === "Terbit"
                                  ? "opacity-50 cursor-not-allowed text-gray-300"
                                  : "text-gray-400 hover:text-gray-900 cursor-pointer"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isAdmin && doc.status === "Terbit") return;
                                handleEditClick(doc);
                              }}
                              disabled={!isAdmin && doc.status === "Terbit"}
                              title={
                                !isAdmin && doc.status === "Terbit"
                                  ? "Hanya Admin yang dapat mengedit dokumen yang sudah Terbit"
                                  : "Edit Dokumen"
                              }
                            >
                              <Edit className="w-4 h-4 text-yellow-500" />
                            </Button>
                            <Button
                              variant="abu"
                              size="icon"
                              className="w-8 h-8 text-gray-400 hover:text-red-500 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmData({
                                  id: doc.id,
                                  judul_dokumen: doc.judul_dokumen,
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(doc.id) && (
                    <tr className="bg-gray-50/50">
                      <td
                        colSpan={8}
                        className="px-8 py-8 border-l-2 border-black ml-4"
                      >
                        <DocumentLogDetails
                          documentId={doc.id}
                          onAddLog={() => handleOpenAddLog(doc.id)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && links && (
        <div className="px-4 py-4 sm:px-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]">
          <div className="text-gray-500 font-medium">
            Menampilkan{" "}
            <span className="font-bold text-gray-900 mx-1">
              {meta.from || 0} - {meta.to || 0}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-gray-900 ml-1">{meta.total}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-gray-500 font-medium">Lines per page</span>
              <select
                className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5 gap-2 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={!links.prev}
                onClick={() => setCurrentPage(meta.current_page - 1)}
                className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {meta.links.map((link: any, index: number) => {
                const isPrevNext =
                  link.label.toLowerCase().includes("previous") ||
                  link.label.toLowerCase().includes("next");
                if (isPrevNext) return null;

                const isEllipsis = link.label === "...";
                const isActive = link.active;

                if (isEllipsis) {
                  return (
                    <span
                      key={index}
                      className="w-8 h-8 flex items-center justify-center text-gray-400"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={index}
                    disabled={isActive}
                    onClick={() => {
                      if (link.page) setCurrentPage(Number(link.page));
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-[12px] font-bold ${
                      isActive
                        ? "bg-[#0F172A] text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <button
                disabled={!links.next}
                onClick={() => setCurrentPage(meta.current_page + 1)}
                className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
