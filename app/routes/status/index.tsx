import React, { useState } from "react";
import {
  Loader2,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/hooks/use-debounce";
import {
  useStatuses,
  useAddStatus,
  useUpdateStatus,
  useDeleteStatus,
} from "~/hooks/use-status";
import type { Status } from "~/service/status-service";
import StatusModal from "~/components/modal/StatusModal";
import ConfirmDeleteModal from "~/components/modal/KonfirmasiDelete";
import { useAuth } from "~/provider/auth-context";

const StatusPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("q") || "";
  const perPage = Number(searchParams.get("per_page")) || 10;

  const { user, isAuthenticated } = useAuth();
  const [searchInput, setSearchInput] = useState(searchTerm);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [deleteConfirmData, setDeleteConfirmData] = useState<{
    id: number;
    nama: string;
  } | null>(null);

  // Sync debounced input with URL
  React.useEffect(() => {
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

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
  } = useStatuses(currentPage, searchTerm, perPage);

  const addMutation = useAddStatus();
  const updateMutation = useUpdateStatus();
  const deleteMutation = useDeleteStatus();

  const statuses = response?.data?.data || [];
  const meta: any = response?.data?.meta || response?.data;

  const isAdmin = user?.roles?.includes("Admin");

  const handleAddSubmit = (data: { nama: string }) => {
    addMutation.mutate(data, {
      onSuccess: () => setShowAddModal(false),
    });
  };

  const handleEditClick = (status: Status) => {
    setEditingStatus(status);
    setShowEditModal(true);
  };

  const handleEditSubmit = (data: { nama: string }) => {
    if (!editingStatus?.id) return;
    updateMutation.mutate(
      { id: editingStatus.id, data },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setEditingStatus(null);
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmData) return;
    deleteMutation.mutate(deleteConfirmData, {
      onSuccess: () => setDeleteConfirmData(null),
    });
  };

  const setCurrentPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  if (!isAuthenticated || !user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">
          Akses ditolak. Halaman ini hanya untuk Admin.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold">
          Error: {(error as any)?.message || "Terjadi kesalahan sistem"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <header>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Manajemen
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Status
            </h1>
          </header>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 py-6 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Status
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari status..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 py-6 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Nama Status
                  </th>
                  <th className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-20 text-center text-gray-400 font-medium"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : statuses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-20 text-center text-gray-400 font-medium"
                    >
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  statuses.map((status, index) => (
                    <tr
                      key={status.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {meta ? (meta.from || 0) + index : index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {status.nama}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="abu"
                            size="icon"
                            className="w-8 h-8 text-gray-400 hover:text-gray-900 cursor-pointer"
                            onClick={() => handleEditClick(status)}
                          >
                            <Edit className="w-4 h-4 text-yellow-500" />
                          </Button>
                          <Button
                            variant="abu"
                            size="icon"
                            className="w-8 h-8 text-gray-400 hover:text-red-500 cursor-pointer"
                            onClick={() =>
                              setDeleteConfirmData({
                                id: status.id,
                                nama: status.nama,
                              })
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.total > 0 && (
            <div className="px-4 py-4 sm:px-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]">
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

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  disabled={meta.current_page === 1}
                  onClick={() => setCurrentPage(meta.current_page - 1)}
                  className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {(() => {
                  const pages = [];
                  const totalPages = meta.last_page;
                  const currentPage = meta.current_page;

                  // Show first page
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                        currentPage === 1
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      1
                    </button>,
                  );

                  // Show ellipsis if current page is far from start
                  if (currentPage > 3 && totalPages > 5) {
                    pages.push(
                      <span key="ellipsis-start" className="px-2 text-gray-400">
                        ...
                      </span>,
                    );
                  }

                  // Show pages around current page
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                          currentPage === i
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {i}
                      </button>,
                    );
                  }

                  // Show ellipsis if current page is far from end
                  if (currentPage < totalPages - 2 && totalPages > 5) {
                    pages.push(
                      <span key="ellipsis-end" className="px-2 text-gray-400">
                        ...
                      </span>,
                    );
                  }

                  // Show last page if there's more than 1 page
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-[12px] font-bold ${
                          currentPage === totalPages
                            ? "bg-[#0F172A] text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {totalPages}
                      </button>,
                    );
                  }

                  return pages;
                })()}

                {/* Next Button */}
                <button
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => setCurrentPage(meta.current_page + 1)}
                  className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StatusModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        isLoading={addMutation.isPending}
      />

      <StatusModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingStatus(null);
        }}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
        initialData={editingStatus}
      />

      <ConfirmDeleteModal
        label="status"
        isOpen={deleteConfirmData !== null}
        onClose={() => setDeleteConfirmData(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StatusPage;
