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
import ConfirmDeleteModal from "~/components/modal/KonfirmasiDelete";
import DocumentLogDetails from "./logbook-details";

// --- Main Component: Logbook ---
const Logbook = () => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showUpdateDocModal, setShowUpdateDocModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedMitraId, setSelectedMitraId] = useState<number | null>(null);
  const [showAddLogModal, setShowAddLogModal] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  //Fetch data pencarian (Hanya jalan jika search >= 3 char)
  const { data: searchResponse, isLoading: isSearchLoading } =
    useSearchDocument(debouncedSearch);

  // Fetch data logbook reguler
  const {
    data: response,
    isLoading: isMainLoading,
    isError,
    error,
  } = useLogbooks(currentPage);

  const addDocMutation = useAddDokumen();
  const editDocMutation = useEditDokumen();
  // Inisialisasi hook delete
  const deleteDocMutation = useDeleteDokumen();

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteDocMutation.mutate(deleteConfirmId, {
        onSuccess: () => {
          setDeleteConfirmId(null);
        },
      });
    }
  };

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

  // Handler untuk membuka modal log dan menangkap mitra_id
  const handleOpenAddLog = (docId: number) => {
    const doc = filteredData.find((d) => d.id === docId);
    if (doc) {
      setSelectedMitraId(doc.mitra_id);
      setShowAddLogModal(docId);
    }
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
                            className="border-black hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(doc.id);
                            }}
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
                            // Ubah bagian ini:
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
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteDocMutation.isPending}
      />
    </div>
  );
};

export default Logbook;
