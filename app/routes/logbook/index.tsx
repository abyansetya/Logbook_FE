import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router";
import { useStatuses } from "~/hooks/use-helper";
import { Button } from "~/components/ui/button";
import TambahLog from "~/components/modal/TambahLog";
import {
  useLogbooks,
  useAddDokumen,
  useEditDokumen,
  useDeleteDokumen,
  useExportLogbook,
} from "~/hooks/use-logbook";
import type { Document } from "../../../types/logbook";
import TambahDokumen from "~/components/modal/TambahDokumen";
import { useDebounce } from "~/hooks/use-debounce";
import UpdateDokumen from "~/components/modal/UpdateDokumen";
import type { TambahDokumenData } from "~/lib/schema";
import { JENIS_DOKUMEN } from "~/lib/constanst";
import ConfirmDeleteModal from "~/components/modal/KonfirmasiDelete";
import { useAuth } from "~/provider/auth-context";
import { LogbookFilters } from "./logbook-filters";
import { LogbookTable } from "./logbook-table";

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
  const currentTahun = searchParams.get("tahun") || "all";

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
  const [deleteConfirmData, setDeleteConfirmData] = useState<{
    id: number;
    judul_dokumen: string;
  } | null>(null);

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
    isError,
    error,
  } = useLogbooks(
    currentPage,
    searchTerm,
    perPage,
    currentStatus,
    currentJenis,
    currentOrder,
    currentTahun,
  );

  // --- 3. MUTATIONS (CUD Operations) ---
  const addDocMutation = useAddDokumen();
  const editDocMutation = useEditDokumen();
  const deleteDocMutation = useDeleteDokumen();
  const exportMutation = useExportLogbook();

  const handleExport = () => {
    exportMutation.mutate({
      search: searchTerm,
      status: currentStatus,
      jenisDokumen: currentJenis,
      order: currentOrder,
      tahun: currentTahun,
    });
  };

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
    if (!deleteConfirmData) return;

    deleteDocMutation.mutate(deleteConfirmData, {
      onSuccess: () => setDeleteConfirmData(null),
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
      prev.delete("tahun");
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
  const isLoading = isMainLoading;
  const hasActiveFilters =
    currentStatus !== "all" ||
    currentJenis !== "all" ||
    currentTahun !== "all" ||
    searchTerm !== "";
  const meta = response?.data?.meta;
  const links = response?.data?.links;
  const isAdmin = user?.role === "Admin";
  const isOperator = user?.role === "Operator";
  const canManage = isAdmin || isOperator;

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
    return "bg-gray-100 text-gray-600 border-none";
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
        <div className="flex items-center justify-between ">
          <header>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Logbook
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Dokumen Kerja Sama
            </h1>
          </header>
          {canManage && (
            <Button
              onClick={() => setShowAddDocModal(true)}
              className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-6 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Dokumen
            </Button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <LogbookFilters
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          isLoading={isLoading}
          showFilterDropdown={showFilterDropdown}
          setShowFilterDropdown={setShowFilterDropdown}
          hasActiveFilters={hasActiveFilters}
          onExport={handleExport}
          isExportPending={exportMutation.isPending}
          currentStatus={currentStatus}
          onStatusChange={(val) => {
            setSearchParams((prev) => {
              if (val === "all") prev.delete("status");
              else prev.set("status", val);
              prev.set("page", "1");
              return prev;
            });
          }}
          statuses={statuses}
          currentJenis={currentJenis}
          onJenisChange={(val) => {
            setSearchParams((prev) => {
              if (val === "all") prev.delete("jenis_dokumen");
              else prev.set("jenis_dokumen", val);
              prev.set("page", "1");
              return prev;
            });
          }}
          currentTahun={currentTahun}
          onTahunChange={(val) => {
            setSearchParams((prev) => {
              if (val === "all") prev.delete("tahun");
              else prev.set("tahun", val);
              prev.set("page", "1");
              return prev;
            });
          }}
          clearFilters={clearFilters}
        />

        {/* Table Section */}
        <LogbookTable
          isLoading={isLoading}
          filteredData={filteredData}
          expandedRows={expandedRows}
          toggleRow={toggleRow}
          formatDate={formatDate}
          getJenisStyle={getJenisStyle}
          getStatusStyle={getStatusStyle}
          currentOrder={currentOrder}
          toggleSortOrder={toggleSortOrder}
          canManage={canManage ?? false}
          isAdmin={isAdmin ?? false}
          handleEditClick={handleEditClick}
          setDeleteConfirmData={setDeleteConfirmData}
          handleOpenAddLog={handleOpenAddLog}
          meta={meta}
          links={links}
          perPage={perPage}
          setPerPage={(val) => {
            setSearchParams((prev) => {
              prev.set("per_page", val.toString());
              prev.set("page", "1");
              return prev;
            });
          }}
          setCurrentPage={setCurrentPage}
        />
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
        userId={user?.id}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        label="dokumen"
        isOpen={deleteConfirmData !== null}
        onClose={() => setDeleteConfirmData(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteDocMutation.isPending}
      />
    </div>
  );
};

export default Logbook;
