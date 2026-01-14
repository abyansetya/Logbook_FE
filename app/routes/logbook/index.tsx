import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  FileText,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import TambahLog from "~/components/modal/TambahLog";
import {
  useLogbooks,
  useLogbookDetail,
  useAddDokumen,
  useEditDokumen,
  useSearchDocument,
} from "~/hooks/use-logbook";
import type { Document, LogEntry } from "../../../types/logbook";
import TambahDokumen from "~/components/modal/TambahDokumen";
import { useDebounce } from "~/hooks/use-debounce";
import UpdateDokumen from "~/components/modal/UpdateDokumen";
import type { TambahDokumenData } from "~/lib/schema";

// --- Sub-Component: DocumentLogDetails ---
const DocumentLogDetails = ({
  documentId,
  onAddLog,
}: {
  documentId: number;
  onAddLog: (docId: number) => void;
}) => {
  const { data: detailData, isLoading, isError } = useLogbookDetail(documentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm text-gray-600">Memuat detail log...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-600">Gagal memuat detail log</p>
      </div>
    );
  }

  const logs = detailData?.data?.logs || [];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="pl-12">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Log Aktivitas Dokumen
        </h3>
        <Button
          onClick={() => onAddLog(documentId)}
          className="bg-black text-white hover:bg-gray-800 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Log
        </Button>
      </div>

      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((logEntry: LogEntry) => (
            <div
              key={logEntry.id}
              className="relative pl-8 pb-6 border-l-2 border-black last:border-l-0 last:pb-0"
            >
              <div className="absolute -left-2.25 top-0 w-4 h-4 bg-black rounded-full border-4 border-gray-50"></div>
              <div className="bg-white border-2 border-black rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {formatDate(logEntry.tanggal_log)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">{logEntry.admin.nama}</span>
                  </div>
                </div>
                <p className="font-semibold mb-3">{logEntry.keterangan}</p>
                <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg border-2 border-black">
                  <span className="font-bold">Contact Person:</span>
                  <span>{logEntry.contact_person}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            Belum ada log aktivitas
          </p>
        )}
      </div>
    </div>
  );
};

// --- Main Component: Logbook ---
const Logbook = () => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showUpdateDocModal, setShowUpdateDocModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [showAddLogModal, setShowAddLogModal] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");

  const debouncedSearch = useDebounce(searchTerm, 500);

  // 1. Fetch data pencarian (Hanya jalan jika search >= 3 char)
  const { data: searchResponse, isLoading: isSearchLoading } =
    useSearchDocument(debouncedSearch);

  // 2. Fetch data logbook reguler
  const {
    data: response,
    isLoading: isMainLoading,
    isError,
    error,
  } = useLogbooks(currentPage);

  const addDocMutation = useAddDokumen();
  const editDocMutation = useEditDokumen();

  // --- Logic Pemilihan Data ---
  const filteredData = useMemo(() => {
    // Tentukan sumber data dasar
    let baseData: Document[] = [];

    if (debouncedSearch.length >= 3 && searchResponse?.success) {
      // Gunakan data dari hasil search server
      baseData = searchResponse.data;
    } else {
      // Gunakan data dari list reguler
      baseData = response?.data?.data || [];
    }

    // Terapkan filter tambahan (Status & Jenis) secara client-side
    return baseData.filter((doc: Document) => {
      const matchesStatus =
        selectedStatus === "all" || doc.status === selectedStatus;
      const matchesDocType =
        selectedDocType === "all" || doc.jenis_dokumen === selectedDocType;
      return matchesStatus && matchesDocType;
    });
  }, [
    searchResponse,
    response,
    debouncedSearch,
    selectedStatus,
    selectedDocType,
  ]);

  // Handlers
  const handleAddDocumentSubmit = (formData: any) => {
    addDocMutation.mutate(formData, {
      onSuccess: () => setShowAddDocModal(false),
    });
  };

  const handleEditDocumentSubmit = (formData: TambahDokumenData) => {
    if (editingDocument?.id) {
      editDocMutation.mutate(
        {
          id: editingDocument.id,
          data: formData,
        },
        {
          onSuccess: () => {
            setShowUpdateDocModal(false);
            setEditingDocument(null);
          },
        }
      );
    }
  };

  const handleEditClick = (doc: Document) => {
    setEditingDocument(doc);
    setShowUpdateDocModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateDocModal(false);
    setEditingDocument(null);
  };

  const toggleRow = (docId: number) => {
    const newExpanded = new Set(expandedRows);
    newExpanded.has(docId) ? newExpanded.delete(docId) : newExpanded.add(docId);
    setExpandedRows(newExpanded);
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedDocType("all");
    setSearchTerm("");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Helper UI
  const isLoading =
    isMainLoading || (debouncedSearch.length >= 3 && isSearchLoading);
  const hasActiveFilters =
    selectedStatus !== "all" || selectedDocType !== "all" || searchTerm !== "";
  const meta = response?.data?.meta;
  const links = response?.data?.links;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">
          Error: {(error as any)?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-8xl mx-auto px-6 py-6 space-y-8">
        <div className="flex items-center justify-between">
          <header>
            <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest">
              Logbook
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-black">
              Dokumen Kerja Sama
            </h1>
          </header>
          <Button onClick={() => setShowAddDocModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Tambah Dokumen
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-lg border-2 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder="Cari dokumen (min. 3 karakter)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus-visible:ring-black"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>

            <DropdownMenu
              open={showFilterDropdown}
              onOpenChange={setShowFilterDropdown}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 font-semibold">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter{" "}
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-black">!</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4 border-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Filter Dokumen</h3>
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => setShowFilterDropdown(false)}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="mt-2 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Terbit">Terbit</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={clearFilters} className="w-full bg-black">
                    Reset Filter
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border-2 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-6 py-4 w-12"></th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Nomor Dokumen
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Judul Dokumen
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Jenis
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {isLoading ? "Memuat data..." : "Data tidak ditemukan"}
                  </td>
                </tr>
              ) : (
                filteredData.map((doc) => (
                  <React.Fragment key={doc.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRow(doc.id)}
                    >
                      <td className="px-6 py-4">
                        {expandedRows.has(doc.id) ? (
                          <ChevronDown />
                        ) : (
                          <ChevronRight />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm ">
                        <div className="">{doc.nomor_dokumen_undip}</div>
                        <div>{doc.nomor_dokumen_mitra}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold max-w-xs truncate">
                        {doc.judul_dokumen}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-black">
                          {doc.jenis_dokumen}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-black">
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-neutral-500 text-xs">
                          Tanggal Masuk:
                        </div>
                        <div>{formatDate(doc.tanggal_masuk)}</div>
                        <div className="text-neutral-500 text-xs">
                          Tanggal Terbit:
                        </div>
                        <div>{formatDate(doc.tanggal_terbit)}</div>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-black"
                            onClick={() => handleEditClick(doc)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-black"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(doc.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-6">
                          <DocumentLogDetails
                            documentId={doc.id}
                            onAddLog={setShowAddLogModal}
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

        {/* Pagination - Sembunyikan saat search aktif */}
        {!debouncedSearch && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-semibold">
              Menampilkan {meta?.from || 0} - {meta?.to || 0} dari{" "}
              {meta?.total || 0}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-2 border-black"
                disabled={!links?.prev}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                className="border-2 border-black"
                disabled={!links?.next}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
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
        onClose={() => setShowAddLogModal(null)}
        onSubmit={() => {}}
        documentId={showAddLogModal}
      />
    </div>
  );
};

export default Logbook;
