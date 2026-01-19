import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Search,
  Filter,
  X,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useStatuses } from "~/hooks/use-helper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { Badge } from "../../components/ui/badge";
import TambahLog from "~/components/modal/TambahLog";
import {
  useLogbooks,
  useAddDokumen,
  useEditDokumen,
  useSearchDocument,
  useDeleteDokumen,
} from "~/hooks/use-logbook";
import type { Document } from "../../../types/logbook";
import TambahDokumen from "~/components/modal/TambahDokumen";
import { useDebounce } from "~/hooks/use-debounce";
import UpdateDokumen from "~/components/modal/UpdateDokumen";
import type { TambahDokumenData } from "~/lib/schema";
import { JENIS_DOKUMEN } from "~/lib/constanst";
import ConfirmDeleteModal from "~/components/modal/KonfirmasiDelete";
import DocumentLogDetails from "./logbook-details";
import { useAuth } from "~/provider/auth-context";

// --- Main Component: Logbook ---
const Logbook = () => {
  // --- 1. STATES ---
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("q") || "";
  const perPage = Number(searchParams.get("per_page")) || 10;
  const currentStatus = searchParams.get("status") || "all";
  const currentJenis = searchParams.get("jenis_dokumen") || "all";
  const currentOrder = (searchParams.get("order") as "asc" | "desc") || "desc";

  const { user, isAuthenticated } = useAuth();

  // Input state for immediate UI feedback (before debounced search update)
  const [searchInput, setSearchInput] = useState(searchTerm);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Sync debounced input with URL
  React.useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearchInput !== currentQ) {
      setSearchParams((prev) => {
        if (debouncedSearchInput) prev.set("q", debouncedSearchInput);
        else prev.delete("q");
        prev.set("page", "1"); // Reset ke halaman 1 hanya saat search berubah
        return prev;
      });
    }
  }, [debouncedSearchInput, setSearchParams, searchParams]);

  // UI States (Modals & Dropdowns)
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showUpdateDocModal, setShowUpdateDocModal] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Data-related States
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedMitraId, setSelectedMitraId] = useState<number | null>(null);

  // Fetch Statuses from Backend
  const { data: statusesResponse } = useStatuses();
  const statuses = statusesResponse?.data || [];

  // --- 2. DATA FETCHING (QUERIES) ---
  const {
    data: response,
    isLoading: isMainLoading,
    isFetching,
    isError,
    error,
  } = useLogbooks(
    currentPage,
    searchTerm,
    perPage,
    currentStatus,
    currentJenis,
    currentOrder,
  );

  // --- 3. MUTATIONS (CUD Operations) ---
  const addDocMutation = useAddDokumen();
  const editDocMutation = useEditDokumen();
  const deleteDocMutation = useDeleteDokumen();

  // --- 4. COMPUTED DATA (MEMOIZED) ---
  const filteredData = useMemo(() => {
    return response?.data?.data || [];
  }, [response]);

  // --- 5. ACTION HANDLERS ---

  // Create & Update Handlers
  const handleAddDocumentSubmit = (formData: any) => {
    addDocMutation.mutate(formData, {
      onSuccess: () => setShowAddDocModal(false),
    });
  };

  const handleEditClick = (doc: Document) => {
    setEditingDocument(doc);
    setShowUpdateDocModal(true);
  };

  const handleEditDocumentSubmit = (formData: TambahDokumenData) => {
    if (!editingDocument?.id) return;

    editDocMutation.mutate(
      { id: editingDocument.id, data: formData },
      {
        onSuccess: () => {
          setShowUpdateDocModal(false);
          setEditingDocument(null);
        },
      },
    );
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateDocModal(false);
    setEditingDocument(null);
  };

  // Delete Handlers
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;

    deleteDocMutation.mutate(deleteConfirmId, {
      onSuccess: () => setDeleteConfirmId(null),
    });
  };

  // Logbook & UI Handlers
  const handleOpenAddLog = (docId: number) => {
    const doc = filteredData.find((d) => d.id === docId);
    if (doc) {
      setSelectedMitraId(doc.mitra_id);
      setShowAddLogModal(docId);
    }
  };

  const toggleRow = (docId: number) => {
    const newExpanded = new Set(expandedRows);
    newExpanded.has(docId) ? newExpanded.delete(docId) : newExpanded.add(docId);
    setExpandedRows(newExpanded);
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("status");
      prev.delete("jenis_dokumen");
      prev.delete("q");
      prev.set("page", "1");
      return prev;
    });
    setSearchInput("");
  };

  const toggleSortOrder = () => {
    setSearchParams((prev) => {
      const nextOrder = currentOrder === "desc" ? "asc" : "desc";
      prev.set("order", nextOrder);
      return prev;
    });
  };

  const setCurrentPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  // --- 6. UI HELPERS & DERIVED STATE ---
  const isLoading = isMainLoading || isFetching;
  const hasActiveFilters =
    currentStatus !== "all" || currentJenis !== "all" || searchTerm !== "";
  const meta = response?.data?.meta;
  const links = response?.data?.links;
  const isAdmin = user?.roles?.includes("Admin");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "terbit") return "bg-green-50 text-green-600 border-none";
    if (s === "acc rektor") return "bg-blue-50 text-blue-600 border-none";
    if (s === "naskah dikirim")
      return "bg-yellow-50 text-yellow-600 border-none";
    if (s === "naskah dicetak")
      return "bg-orange-50 text-orange-600 border-none";
    if (s === "pending / batal / proses dilanjut unit lain")
      return "bg-red-50 text-red-600 border-none";
    return "bg-gray-50 text-gray-600 border-none";
  };

  const getJenisStyle = (jenis: string) => {
    const j = jenis.toLowerCase();
    if (j.includes("mou")) return "bg-blue-50 text-blue-600 border-none";
    if (j.includes("moa")) return "bg-orange-50 text-orange-600 border-none";
    if (j.includes("ia")) return "bg-yellow-50 text-yellow-600 border-none";
    return "bg-gray-50 text-gray-500 border-none";
  };

  // --- 7. ERROR RENDERING ---
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">
          Error: {(error as any)?.message || "Terjadi kesalahan sistem"}
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      <div className=" mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <header>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Logbook
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Dokumen Kerja Sama
            </h1>
          </header>
          {isAdmin && (
            <Button
              onClick={() => setShowAddDocModal(true)}
              className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-6 transition-all shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Dokumen
            </Button>
          )}
        </div>

        {/* Search & Filter Bar - Style diperhalus */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Cari dokumen..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 py-6 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`rounded-xl px-6 py-6 border-gray-100 text-gray-600 font-semibold gap-2 transition-all ${
                showFilterDropdown ? "bg-gray-100 border-gray-200" : ""
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-black rounded-full" />
              )}
            </Button>
          </div>

          {/* Expandable Filter Section - Smooth Transition */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showFilterDropdown
                ? "grid-rows-[1fr] opacity-100 mt-6"
                : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-6 items-end">
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <Label className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
                      Status Dokumen
                    </Label>
                    <Select
                      value={currentStatus}
                      onValueChange={(val) => {
                        setSearchParams((prev) => {
                          if (val === "all") prev.delete("status");
                          else prev.set("status", val);
                          prev.set("page", "1");
                          return prev;
                        });
                      }}
                    >
                      <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 py-6">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="all">Semua Status</SelectItem>
                        {statuses.map((s: any) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <Label className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
                      Jenis Dokumen
                    </Label>
                    <Select
                      value={currentJenis}
                      onValueChange={(val) => {
                        setSearchParams((prev) => {
                          if (val === "all") prev.delete("jenis_dokumen");
                          else prev.set("jenis_dokumen", val);
                          prev.set("page", "1");
                          return prev;
                        });
                      }}
                    >
                      <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 py-6">
                        <SelectValue placeholder="Pilih Jenis" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="all">Semua Jenis</SelectItem>
                        {JENIS_DOKUMEN.map((jenis) => (
                          <SelectItem
                            key={jenis.id}
                            value={jenis.id.toString()}
                          >
                            {jenis.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="rounded-xl px-6 py-6 text-gray-400 hover:text-gray-900 hover:bg-gray-50 font-semibold gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section - Desain Modern */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 w-12"></th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Nomor Dokumen
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Judul Dokumen
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer group/sort hover:text-gray-900 transition-colors"
                    onClick={toggleSortOrder}
                  >
                    <div className="flex items-center gap-1">
                      Tanggal
                      <div className="flex flex-col">
                        <ArrowUp
                          className={`w-3 h-3 -mb-1 ${currentOrder === "asc" ? "text-black" : "text-gray-200"}`}
                        />
                        <ArrowDown
                          className={`w-3 h-3 ${currentOrder === "desc" ? "text-black" : "text-gray-200"}`}
                        />
                      </div>
                    </div>
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
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
                      colSpan={7}
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
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-700 max-w-xs truncate">
                            {doc.judul_dokumen}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={`rounded-lg font-semibold px-3 py-1 ${getJenisStyle(doc.jenis_dokumen || "-")}`}
                          >
                            {doc.jenis_dokumen}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`rounded-lg px-3 py-1 font-semibold ${getStatusStyle(doc.status ?? "-")}`}
                          >
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-gray-700 font-medium">
                            {formatDate(doc.tanggal_masuk)}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            Tanggal terbit: {formatDate(doc.tanggal_terbit)}
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-1">
                            {isAdmin && (
                              <>
                                <Button
                                  variant="abu"
                                  size="icon"
                                  className="w-8 h-8 text-gray-400 hover:text-gray-900"
                                  onClick={() => handleEditClick(doc)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="abu"
                                  size="icon"
                                  className=" w-8 h-8 text-gray-400 hover:text-red-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmId(doc.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500 " />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(doc.id) && (
                        <tr className="bg-gray-50/50">
                          <td
                            colSpan={7}
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

          {/* Pagination - Style diperbarui */}
          {meta && links && (
            <div className="px-4 py-4 sm:px-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]">
              {/* Sisi Kiri: Info Total Data */}
              <div className="text-gray-500 font-medium">
                Menampilkan{" "}
                <span className="font-bold text-gray-900 mx-1">
                  {meta.from || 0} - {meta.to || 0}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-gray-900 ml-1">
                  {meta.total}
                </span>
              </div>

              {/* Sisi Kanan: Lines per page & Navigation */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                {/* Lines per page (Dropdown style) - Sesuai meta.per_page */}
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-gray-500 font-medium">
                    Lines per page
                  </span>
                  <select
                    className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5 gap-2 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                    value={perPage}
                    onChange={(e) => {
                      const newPerPage = e.target.value;
                      setSearchParams((prev) => {
                        prev.set("per_page", newPerPage);
                        prev.set("page", "1"); // Reset ke halaman 1 saat limit berubah
                        return prev;
                      });
                    }}
                  >
                    {[10, 25, 50, 100].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kontrol Navigasi Angka */}
                <div className="flex items-center gap-1">
                  {/* Tombol Sebelumnya: Mengambil dari links.prev di luar meta */}
                  <button
                    disabled={!links.prev}
                    onClick={() => setCurrentPage(meta.current_page - 1)}
                    className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Mapping Angka Halaman dari meta.links */}
                  {meta.links.map((link, index) => {
                    // Laravel menyertakan label "Previous" dan "Next" di dalam array ini
                    // Kita lewati (return null) karena sudah pakai icon Chevron di luar loop
                    const isPrevNext =
                      link.label.toLowerCase().includes("previous") ||
                      link.label.toLowerCase().includes("next");
                    if (isPrevNext) return null;

                    const isEllipsis = link.label === "...";
                    const isActive = link.active;

                    // Render Simbol Titik-titik
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

                    // Render Tombol Angka Halaman
                    return (
                      <button
                        key={index}
                        disabled={isActive}
                        onClick={() => {
                          // Gunakan link.page dari JSON untuk keamanan tipe data
                          if (link.page) setCurrentPage(Number(link.page));
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-[12px] font-bold ${
                          isActive
                            ? "bg-[#0F172A] text-white shadow-sm" // Desain lingkaran gelap aktif
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {link.label}
                      </button>
                    );
                  })}

                  {/* Tombol Selanjutnya: Mengambil dari links.next di luar meta */}
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
      </div>

      {/* Modal Update Dokumen */}
      <UpdateDokumen
        isOpen={showUpdateDocModal}
        onClose={handleCloseUpdateModal}
        onSubmit={handleEditDocumentSubmit}
        isLoading={editDocMutation.isPending}
        initialData={editingDocument}
      />

      {/* Modal Tambah Dokumen */}
      <TambahDokumen
        isOpen={showAddDocModal}
        onClose={() => setShowAddDocModal(false)}
        onSubmit={handleAddDocumentSubmit}
        isLoading={addDocMutation.isPending}
      />

      {/* Modal Tambah Log */}
      <TambahLog
        isOpen={showAddLogModal !== null}
        onClose={() => {
          setShowAddLogModal(null);
          setSelectedMitraId(null);
        }}
        documentId={showAddLogModal}
        mitraId={selectedMitraId ?? 0}
        userId={1} // Ganti dengan ID user dari context/session auth Anda
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        label="dokumen"
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteDocMutation.isPending}
      />
    </div>
  );
};

export default Logbook;
