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
  Download,
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
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import TambahLog from "~/components/modal/TambahLog";

const Logbook = () => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");

  const [data, setData] = useState({
    data: [
      {
        mitra: {
          id: 1,
          nama: "Bank Central Asia",
        },
        dokumen: [
          {
            id: 1,
            jenis_dokumen: {
              id: 1,
              nama: "Memorandum of Understanding (MoU)",
            },
            judul_dokumen: "Kesepakatan Bersama Kerja Sama Pendidikan",
            status: {
              id: 3,
              nama: "Terbit",
            },
            tanggal_masuk: "2025-12-10",
            tanggal_terbit: "2025-12-20",
            log: [
              {
                id: 1,
                tanggal_log: "2025-12-10",
                keterangan: "Inisiasi kerja sama oleh mitra",
                contact_person: "Andi - Legal BCA",
                user: {
                  id: 1,
                  nama: "Admin Undip",
                },
              },
              {
                id: 2,
                tanggal_log: "2025-12-15",
                keterangan: "Review naskah oleh unit hukum",
                contact_person: "Budi - Unit Hukum",
                user: {
                  id: 1,
                  nama: "Admin Undip",
                },
              },
              {
                id: 3,
                tanggal_log: "2025-12-20",
                keterangan: "Dokumen diterbitkan",
                contact_person: "Sekretariat Rektor",
                user: {
                  id: 1,
                  nama: "Admin Undip",
                },
              },
            ],
          },
          {
            id: 2,
            jenis_dokumen: {
              id: 2,
              nama: "Memorandum of Agreement (MoA)",
            },
            judul_dokumen: "Perjanjian Kerja Sama Program Magang",
            status: {
              id: 2,
              nama: "Naskah Dikirim",
            },
            tanggal_masuk: "2026-01-05",
            tanggal_terbit: null,
            log: [
              {
                id: 4,
                tanggal_log: "2026-01-05",
                keterangan: "Draft MoA dikirim ke mitra",
                contact_person: "Rina - HR BCA",
                user: {
                  id: 1,
                  nama: "Admin Undip",
                },
              },
            ],
          },
        ],
      },
    ],
  });

  const toggleRow = (docId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedRows(newExpanded);
  };

  const handleDeleteDocument = (mitraIndex: number, docIndex: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      const newData = { ...data };
      newData.data[mitraIndex].dokumen.splice(docIndex, 1);
      setData(newData);
    }
  };

  const handleDeleteLog = (
    mitraIndex: number,
    docIndex: number,
    logIndex: number
  ) => {
    if (confirm("Apakah Anda yakin ingin menghapus log ini?")) {
      const newData = { ...data };
      newData.data[mitraIndex].dokumen[docIndex].log.splice(logIndex, 1);
      setData(newData);
    }
  };

  const handleAddLog = (logData: {
    tanggal_log: string;
    keterangan: string;
    contact_person: string;
  }) => {
    if (showAddLogModal === null) return;

    const newData = { ...data };
    let found = false;
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

  const filteredData = data.data
    .map((mitraData) => ({
      ...mitraData,
      dokumen: mitraData.dokumen.filter((doc) => {
        const matchesSearch =
          doc.judul_dokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mitraData.mitra.nama.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          selectedStatus === "all" || doc.status.nama === selectedStatus;
        const matchesDocType =
          selectedDocType === "all" ||
          doc.jenis_dokumen.nama === selectedDocType;

        return matchesSearch && matchesStatus && matchesDocType;
      }),
    }))
    .filter((mitraData) => mitraData.dokumen.length > 0);

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

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* Header */}

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
                placeholder="Cari dokumen atau mitra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2  focus-visible:ring-black"
              />
            </div>
            <DropdownMenu
              open={showFilterDropdown}
              onOpenChange={setShowFilterDropdown}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2  hover:bg-black hover:text-white font-semibold"
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
              <DropdownMenuContent className="w-80 border-2 ">
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
                        <SelectTrigger className="border-2  mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="Terbit">Terbit</SelectItem>
                          <SelectItem value="Naskah Dikirim">
                            Naskah Dikirim
                          </SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
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
                          <SelectItem value="MoU">MoU</SelectItem>
                          <SelectItem value="MoA">MoA</SelectItem>
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
                    Nama Mitra
                  </th>
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
                  filteredData.map((mitraData, mitraIndex) =>
                    mitraData.dokumen.map((doc, docIndex) => (
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
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-900">
                                {mitraData.mitra.nama}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                  DOC-{doc.id.toString().padStart(4, "0")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-smfont-semibold">
                                  MIT-{doc.id.toString().padStart(4, "0")}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-sm font-semibold line-clamp-2">
                              {doc.judul_dokumen}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Tanggal Masuk: {formatDate(doc.tanggal_masuk)}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="border-2 border-black"
                            >
                              {doc.jenis_dokumen.nama}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="border-2 border-black"
                            >
                              {doc.status.nama}
                            </Badge>
                          </td>
                          <td
                            className="px-6 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="border border-black cursor-pointer "
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                className="border border-black cursor-pointer"
                                onClick={() =>
                                  handleDeleteDocument(mitraIndex, docIndex)
                                }
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
                              <div className="pl-12">
                                <div className="flex items-center justify-between mb-5">
                                  <h3 className="text-lg font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Log Aktivitas Dokumen
                                  </h3>
                                  <Button
                                    onClick={() => setShowAddLogModal(doc.id)}
                                    className="bg-black text-white hover:bg-gray-800 font-semibold"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Log
                                  </Button>
                                </div>

                                <div className="space-y-4">
                                  {doc.log.map((logEntry, logIndex) => (
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
                                                {logEntry.user.nama}
                                              </span>
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              className="h-6 w-6 border border-black cursor-pointer"
                                              onClick={() =>
                                                handleDeleteLog(
                                                  mitraIndex,
                                                  docIndex,
                                                  logIndex
                                                )
                                              }
                                              title="Hapus Log"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>

                                        <p className="font-semibold mb-3">
                                          {logEntry.keterangan}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg border-2 border-black">
                                          <span className="font-bold">
                                            Contact Person:
                                          </span>
                                          <span>{logEntry.contact_person}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold">
            Menampilkan{" "}
            {filteredData.reduce((acc, m) => acc + m.dokumen.length, 0)} dokumen
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white font-semibold"
            >
              Sebelumnya
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 font-semibold">
              1
            </Button>
            <Button
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white font-semibold"
            >
              2
            </Button>
            <Button
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white font-semibold"
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
              <Label className="font-bold">Nama Mitra</Label>
              <Input
                placeholder="Masukkan nama mitra"
                className="border-2 border-black mt-2"
              />
            </div>
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
                    <SelectItem value="review">Review</SelectItem>
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
