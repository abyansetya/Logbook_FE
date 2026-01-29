import { useState, useMemo, useEffect } from "react";
import { useAuth } from "~/provider/auth-context";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Loader2,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  X,
} from "lucide-react";
import { useDebounce } from "~/hooks/use-debounce";
import { useKlasifikasis } from "~/hooks/use-helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  useGetMitra,
  useCreateMitra,
  useUpdateMitra,
  useDeleteMitra,
} from "~/hooks/use-mitra";
import type { Mitra, MitraFull, MitraPayload } from "../../../types/mitra";
import TambahMitra from "~/components/modal/TambahMitra";
import type { MitraFormData } from "~/lib/schema";

export default function MitraPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("q") || "";
  const perPage = Number(searchParams.get("per_page")) || 10;
  const currentKlasifikasi = searchParams.get("klasifikasi") || "all";

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const hasActiveFilters = currentKlasifikasi !== "all";

  // Input state for search
  const [searchInput, setSearchInput] = useState(searchTerm);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Sync debounced search with URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearchInput !== currentQ) {
      setSearchParams((prev) => {
        if (debouncedSearchInput) prev.set("q", debouncedSearchInput);
        else prev.delete("q");
        prev.set("page", "1");
        return prev;
      });
    }
  }, [debouncedSearchInput, setSearchParams, searchParams]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMitra, setEditingMitra] = useState<Mitra | null>(null);
  const [deleteConfirmData, setDeleteConfirmData] = useState<{
    id: number;
    nama: string;
  } | null>(null);
  const isAdmin = user?.roles?.includes("Admin");
  // Form States
  const [formData, setFormData] = useState<MitraPayload>({
    nama: "",
    klasifikasi_mitra_id: 16, // Default hardcoded for now
    alamat: "",
    contact_person: "",
  });

  // Queries & Mutations
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetMitra(currentPage, searchTerm, perPage, currentKlasifikasi);

  const { data: klasifikasiResponse } = useKlasifikasis();
  const klasifikasis = klasifikasiResponse?.data || [];
  const createMutation = useCreateMitra();
  const updateMutation = useUpdateMitra();
  const deleteMutation = useDeleteMitra();

  // Computed
  const mitraList = response?.data?.data || [];
  const meta = response?.data;
  const links = response?.data?.links;

  // Handlers
  const handleAddSubmit = (data: MitraFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsAddOpen(false);
      },
    });
  };

  const handleEditClick = (mitra: MitraFull) => {
    setEditingMitra(mitra);
    setFormData({
      nama: mitra.nama,
      klasifikasi_mitra_id: mitra.klasifikasi_mitra_id,
      alamat: mitra.alamat || "",
      contact_person: mitra.contact_person || "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMitra) return;
    updateMutation.mutate(
      { id: editingMitra.id, payload: formData },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditingMitra(null);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmData) {
      deleteMutation.mutate(deleteConfirmData, {
        onSuccess: () => setDeleteConfirmData(null),
      });
    }
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("klasifikasi");
      prev.set("page", "1");
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <header>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Mitra
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Manajemen Mitra
            </h1>
          </header>
          {isAdmin && (
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-6 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Mitra
            </Button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Cari mitra..."
                className="pl-12 py-6 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {(isLoading || isFetching) && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`rounded-xl px-6 py-6 border-gray-100 cursor-pointer text-gray-600 font-semibold gap-2 transition-all ${
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

          {/* Expandable Filter Section */}
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
                      Klasifikasi Mitra
                    </Label>
                    <Select
                      value={currentKlasifikasi}
                      onValueChange={(val) => {
                        setSearchParams((prev) => {
                          if (val === "all") prev.delete("klasifikasi");
                          else prev.set("klasifikasi", val);
                          prev.set("page", "1");
                          return prev;
                        });
                      }}
                    >
                      <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 py-6">
                        <SelectValue placeholder="Pilih Klasifikasi" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="all">Semua Klasifikasi</SelectItem>
                        {klasifikasis.map((k: any) => (
                          <SelectItem key={k.id} value={k.id.toString()}>
                            {k.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="rounded-xl px-6 py-6 text-gray-400 hover:text-gray-900 hover:bg-gray-50 font-semibold gap-2 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Reset Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Nama Mitra
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Klasifikasi Mitra
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Kontak
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                    </td>
                  </tr>
                ) : mitraList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Tidak ada data mitra.
                    </td>
                  </tr>
                ) : (
                  mitraList.map((mitra) => (
                    <tr key={mitra.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {mitra.nama}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {mitra.klasifikasi_mitra?.nama || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                        {mitra.alamat || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {mitra.contact_person || "-"}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            <Button
                              variant="abu"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-slate-900"
                              onClick={() => handleEditClick(mitra)}
                            >
                              <Edit className="h-4 w-4 text-yellow-500" />
                            </Button>
                            <Button
                              variant="abu"
                              size="icon"
                              className=" w-8 h-8 text-gray-400 hover:text-red-500 cursor-pointer"
                              onClick={() =>
                                setDeleteConfirmData({
                                  id: mitra.id,
                                  nama: mitra.nama,
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Style diperbarui mengikuti Logbook */}
          {!isLoading && meta && links && (
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
                {/* Lines per page (Dropdown style) */}
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
                        prev.set("page", "1");
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
                  {/* Tombol Sebelumnya */}
                  <button
                    disabled={!meta.prev_page_url}
                    onClick={() => {
                      setSearchParams((prev) => {
                        prev.set("page", (currentPage - 1).toString());
                        return prev;
                      });
                    }}
                    className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Mapping Angka Halaman */}
                  {links.map((link: any, index: number) => {
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
                          if (link.url) {
                            const url = new URL(
                              link.url,
                              window.location.origin,
                            );
                            const page = url.searchParams.get("page");
                            if (page) {
                              setSearchParams((prev) => {
                                prev.set("page", page);
                                return prev;
                              });
                            }
                          }
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

                  {/* Tombol Selanjutnya */}
                  <button
                    disabled={!meta.next_page_url}
                    onClick={() => {
                      setSearchParams((prev) => {
                        prev.set("page", (currentPage + 1).toString());
                        return prev;
                      });
                    }}
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

      {/* Add Modal */}
      <TambahMitra
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Data Mitra</DialogTitle>
            <DialogDescription>Perbarui informasi mitra.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nama">Nama Mitra</Label>
              <Input
                id="edit-nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-alamat">Alamat</Label>
              <Input
                id="edit-alamat"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Person</Label>
              <Input
                id="edit-contact"
                value={formData.contact_person}
                onChange={(e) =>
                  setFormData({ ...formData, contact_person: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={deleteConfirmData !== null}
        onOpenChange={(open) => !open && setDeleteConfirmData(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Mitra?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data mitra akan dihapus
              permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmData(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
