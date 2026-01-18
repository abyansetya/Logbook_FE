import React, { useState, useEffect, useRef } from "react";
import {
  Check as CheckIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Loader2 as LoaderIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useSearchMitra, useAddMitraQuick } from "~/hooks/use-mitra";
import { useDebounce } from "~/hooks/use-debounce";

interface Mitra {
  id: number;
  nama: string;
}

interface MitraCreateResponse {
  success: boolean;
  data: Mitra;
}

interface MitraAutocompleteProps {
  value?: number;
  onChange: (mitraId: number, mitraNama: string) => void;
  placeholder?: string;
  initialDisplayValue?: string;
}

const MitraAutocomplete: React.FC<MitraAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Cari atau tambah mitra...",
  initialDisplayValue = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useSearchMitra(debouncedSearch);
  const addMitraWMutation = useAddMitraQuick();

  const filteredMitra = data?.data || [];

  // SINKRONISASI: Set nilai input jika ada initialDisplayValue (Mode Edit)
  useEffect(() => {
    if (initialDisplayValue) {
      setSearchQuery(initialDisplayValue);
      if (value) {
        setSelectedMitra({ id: value, nama: initialDisplayValue });
      }
    } else if (!value) {
      // Reset hanya jika tidak ada value
      setSearchQuery("");
      setSelectedMitra(null);
    }
  }, [initialDisplayValue, value]);

  // Handle klik di luar untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMitra = (mitra: Mitra) => {
    // Set semua state yang diperlukan
    setSelectedMitra(mitra);
    setSearchQuery(mitra.nama);
    setIsOpen(false);

    // Call parent onChange - PENTING untuk update form
    onChange(mitra.id, mitra.nama);
  };

  const handleAddNewMitra = () => {
    addMitraWMutation.mutate(
      { nama: searchQuery, klasifikasi_mitra_id: 1 },
      {
        onSuccess: (response: MitraCreateResponse) => {
          if (response.success) {
            const newMitra = response.data;

            // Set semua state yang diperlukan
            setSelectedMitra(newMitra);
            setSearchQuery(newMitra.nama);
            setIsOpen(false);

            // Call parent onChange - PENTING untuk update form
            onChange(newMitra.id, newMitra.nama);
          }
        },
        onError: (error) => {
          console.error("Error adding mitra:", error);
          // TODO: Tambahkan toast notification untuk user feedback
        },
      },
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchQuery(newValue);
            setIsOpen(true);

            // Jika user mengetik manual, hapus status "terpilih" agar bisa mencari ulang
            if (selectedMitra && newValue !== selectedMitra.nama) {
              setSelectedMitra(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={addMitraWMutation.isPending}
          className={cn(
            "pl-10 pr-10 border-2 border-black focus-visible:ring-0",
            selectedMitra && "bg-green-50/30",
            addMitraWMutation.isPending && "opacity-60 cursor-not-allowed",
          )}
        />

        {/* Indikator Loading atau Berhasil */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {(isFetching || addMitraWMutation.isPending) && (
            <LoaderIcon className="w-4 h-4 animate-spin text-gray-400" />
          )}
          {selectedMitra && !isFetching && !addMitraWMutation.isPending && (
            <CheckIcon className="text-green-600 w-4 h-4" />
          )}
        </div>
      </div>

      {/* Dropdown Hasil Pencarian */}
      {isOpen && searchQuery.length >= 3 && !addMitraWMutation.isPending && (
        <div className="absolute border-black z-[100] w-full mt-1 bg-white border-2 rounded-md shadow-xl max-h-60 overflow-y-auto">
          {filteredMitra.length > 0 ? (
            <div className="p-1">
              {filteredMitra.map((mitra: Mitra) => (
                <button
                  key={mitra.id}
                  type="button"
                  onClick={() => handleSelectMitra(mitra)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-sm flex items-center justify-between text-sm transition-colors"
                >
                  <span className="truncate">{mitra.nama}</span>
                  {selectedMitra?.id === mitra.id && (
                    <CheckIcon className="w-3 h-3 text-green-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            !isFetching && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Mitra tidak ditemukan
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddNewMitra}
                  disabled={addMitraWMutation.isPending}
                  className="bg-black text-white hover:bg-gray-800 w-full transition-colors"
                >
                  {addMitraWMutation.isPending ? (
                    <>
                      <LoaderIcon className="w-3 h-3 animate-spin mr-2" />
                      Menambahkan...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-3 h-3 mr-2" />
                      Tambah "{searchQuery}"
                    </>
                  )}
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MitraAutocomplete;
