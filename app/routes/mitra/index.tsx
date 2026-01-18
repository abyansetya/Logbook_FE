import { useState, useMemo } from "react";
import { useAuth } from "~/provider/auth-context";
import { useNavigate } from "react-router";
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
} from "lucide-react";
import { useDebounce } from "~/hooks/use-debounce";
import {
  useGetMitra,
  useCreateMitra,
  useUpdateMitra,
  useDeleteMitra,
} from "~/hooks/use-mitra";
import type { Mitra, MitraFull, MitraPayload } from "../../../types/mitra";

export default function MitraPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMitra, setEditingMitra] = useState<Mitra | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form States
  const [formData, setFormData] = useState<MitraPayload>({
    nama: "",
    klasifikasi_mitra_id: 16, // Default hardcoded for now
    alamat: "",
    contact_person: "",
  });

  // Queries & Mutations
  const { data: response, isLoading } = useGetMitra(
    currentPage,
    debouncedSearch,
  );
  const createMutation = useCreateMitra();
  const updateMutation = useUpdateMitra();
  const deleteMutation = useDeleteMitra();

  // Computed
  const mitraList = response?.data?.data || [];
  const meta = response?.data;
  const links = response?.data?.links;

  // Handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsAddOpen(false);
        setFormData({
          nama: "",
          klasifikasi_mitra_id: 16,
          alamat: "",
          contact_person: "",
        });
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
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Mitra
            </h2>
            <p className="text-slate-500">Kelola daftar mitra kerja sama</p>
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-black hover:bg-gray-800 text-white rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Mitra
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="relative w-full ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari mitra..."
              className="pl-9 bg-gray-50 border-gray-100 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Mitra</th>
                    <th className="px-6 py-4 font-medium">Klasifikasi</th>
                    <th className="px-6 py-4 font-medium">Alamat</th>
                    <th className="px-6 py-4 font-medium">Kontak</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                      </td>
                    </tr>
                  ) : mitraList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500"
                      >
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
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-slate-900"
                              onClick={() => handleEditClick(mitra)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-600"
                              onClick={() => setDeleteConfirmId(mitra.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Logic similar to Logbook */}
            {!isLoading && meta && links && (
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Showing {meta.from} to {meta.to} of {meta.total} results
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.prev_page_url}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {/* Simplified pagination numbers for brevity */}
                  <span className="text-sm font-medium px-2">
                    Page {meta.current_page} of {meta.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!meta.next_page_url}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Mitra Baru</DialogTitle>
            <DialogDescription>
              Isi data mitra baru di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Mitra</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
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
                onClick={() => setIsAddOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
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
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
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
