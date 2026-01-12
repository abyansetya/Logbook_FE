import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import TambahLog from "~/components/modal/TambahLog";
import { useLogbooks, useLogbookDetail } from "~/hooks/use-logbook";
import type { Document, LogEntry } from "../../../types/logbook";

// Component untuk menampilkan detail log saat dokumen di-expand
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
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black rounded-full border-4 border-gray-50"></div>

              <div className="bg-white border-2 border-black rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {formatDate(logEntry.tanggal_log)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="font-semibold">
                        {logEntry.admin.nama}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 border border-black cursor-pointer"
                      onClick={() => {
                        if (
                          confirm("Apakah Anda yakin ingin menghapus log ini?")
                        ) {
                          console.log("Delete log", logEntry.id);
                        }
                      }}
                      title="Hapus Log"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
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

const Logbook = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");

  // Fetch data using TanStack Query
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useLogbooks(currentPage);

  // Tambahkan ini untuk debug
  console.log("Raw Response dari API:", response);

  const toggleRow = (docId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedRows(newExpanded);
  };

  const handleDeleteDocument = (documentId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      console.log("Delete document", documentId);
    }
  };

  const handleAddLog = (logData: {
    tanggal_log: string;
    keterangan: string;
    contact_person: string;
  }) => {
    if (showAddLogModal === null) return;
    console.log("Add log to document", showAddLogModal, logData);
    setShowAddLogModal(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Filter data client-side
  const filteredData = React.useMemo(() => {
    if (!response?.data?.data) return [];

    return response.data.data.filter((doc: Document) => {
      const matchesSearch = doc.judul_dokumen
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || doc.status === selectedStatus;
      const matchesDocType =
        selectedDocType === "all" || doc.jenis_dokumen === selectedDocType;

      return matchesSearch && matchesStatus && matchesDocType;
    });
  }, [response, searchTerm, selectedStatus, selectedDocType]);

  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedDocType("all");
    setSearchTerm("");
  };

  const hasActiveFilters =
    selectedStatus !== "all" || selectedDocType !== "all" || searchTerm !== "";

  const activeFilterCount = [
    selectedStatus !== "all" ? 1 : 0,
    selectedDocType !== "all" ? 1 : 0,
    searchTerm !== "" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const hasNext = response?.data?.links?.next !== null;
    if (hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 lg:p-10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen p-6 lg:p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Terjadi kesalahan saat memuat data
          </p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const meta = response?.data?.meta;
  const links = response?.data?.links;

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
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

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border-2 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus-visible:ring-black"
              />
            </div>
            <DropdownMenu
              open={showFilterDropdown}
              onOpenChange={setShowFilterDropdown}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2 hover:bg-black hover:text-white font-semibold"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-black text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 border-2">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Filter Dokumen</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="font-semibold">Status Dokumen</Label>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="border-2 mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="Terbit">Terbit</SelectItem>
                          <SelectItem value="Naskah Dikirim">
                            Naskah Dikirim
                          </SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Acc Rektor">Acc Rektor</SelectItem>
                          <SelectItem value="Inisiasi & Proses">
                            Inisiasi & Proses
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="font-semibold">Jenis Dokumen</Label>
                      <Select
                        value={selectedDocType}
                        onValueChange={setSelectedDocType}
                      >
                        <SelectTrigger className="border-2 mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Jenis</SelectItem>
                          <SelectItem value="Memorandum of Understanding (MoU)">
                            MoU
                          </SelectItem>
                          <SelectItem value="Memorandum of Agreement (MoA)">
                            MoA
                          </SelectItem>
                          <SelectItem value="Implementation Arrangement (IA)">
                            IA
                          </SelectItem>
                          <SelectItem value="PKS">PKS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        onClick={clearFilters}
                        className="w-full bg-black text-white hover:bg-gray-800 font-semibold"
                      >
                        Reset Filter
                      </Button>
                    )}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-12"></th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Nomor Dokumen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Judul Dokumen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Jenis Dokumen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Tanggal Masuk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
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
                      Tidak ada dokumen yang sesuai dengan filter
                    </td>
                  </tr>
                ) : (
                  filteredData.map((doc: Document) => (
                    <React.Fragment key={doc.id}>
                      <tr
                        className="hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => toggleRow(doc.id)}
                      >
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 hover:text-black"
                          >
                            {expandedRows.has(doc.id) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </Button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold">
                            DOC-{doc.id.toString().padStart(4, "0")}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm font-semibold line-clamp-2">
                            {doc.judul_dokumen}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className="border-2 border-black"
                          >
                            {doc.jenis_dokumen}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className="border-2 border-black"
                          >
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {formatDate(doc.tanggal_masuk)}
                          </span>
                        </td>
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="border border-black cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="border border-black cursor-pointer"
                              onClick={() => handleDeleteDocument(doc.id)}
                              title="Hapus"
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
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold">
            Menampilkan {meta?.from || 0} - {meta?.to || 0} dari total{" "}
            {meta?.total || 0} dokumen
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white font-semibold"
              onClick={handlePreviousPage}
              disabled={!links?.prev || isLoading}
            >
              Sebelumnya
            </Button>
            {meta?.links
              ?.filter((link) => link.page !== null)
              .map((link) => (
                <Button
                  key={link.page}
                  className={
                    link.active
                      ? "bg-black text-white hover:bg-gray-800 font-semibold"
                      : "bg-white text-black border-2 border-black hover:bg-black hover:text-white font-semibold"
                  }
                  onClick={() => link.page && setCurrentPage(link.page)}
                >
                  {link.label}
                </Button>
              ))}
            <Button
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white font-semibold"
              onClick={handleNextPage}
              disabled={!links?.next || isLoading}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Dokumen */}
      <Dialog open={showAddDocModal} onOpenChange={setShowAddDocModal}>
        <DialogContent className="max-w-2xl border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tambah Dokumen Baru
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-bold">Judul Dokumen</Label>
              <Input
                placeholder="Masukkan judul dokumen"
                className="border-2 border-black mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-bold">Jenis Dokumen</Label>
                <Select>
                  <SelectTrigger className="border-2 border-black mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mou">MoU</SelectItem>
                    <SelectItem value="moa">MoA</SelectItem>
                    <SelectItem value="ia">IA</SelectItem>
                    <SelectItem value="pks">PKS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-bold">Status</Label>
                <Select>
                  <SelectTrigger className="border-2 border-black mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="naskah">Naskah Dikirim</SelectItem>
                    <SelectItem value="acc">Acc Rektor</SelectItem>
                    <SelectItem value="inisiasi">Inisiasi & Proses</SelectItem>
                    <SelectItem value="terbit">Terbit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="font-bold">Tanggal Masuk</Label>
              <Input type="date" className="border-2 border-black mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDocModal(false)}
              className="border-2 border-black font-bold"
            >
              Batal
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 font-bold">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Tambah Log */}
      <TambahLog
        isOpen={showAddLogModal !== null}
        onClose={() => setShowAddLogModal(null)}
        onSubmit={handleAddLog}
        documentId={showAddLogModal}
      />
    </div>
  );
};

export default Logbook;
