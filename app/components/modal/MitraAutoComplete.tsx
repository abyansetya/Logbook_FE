import React, { useState, useEffect, useRef } from "react";
import { Check, Plus, Search, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
// Impor dari fetch-util Anda
import { fetchData, postData } from "~/lib/fetch-util";
import { useSearchMitra, useAddMitraQuick } from "~/hooks/use-mitra";
import { add } from "date-fns";
import { useDebounce } from "~/hooks/use-debounce";

interface Mitra {
  id: number;
  nama: string;
}

// Interface sesuai response API Laravel Anda
interface MitraSearchResponse {
  success: boolean;
  data: Mitra[];
}

interface MitraCreateResponse {
  success: boolean;
  data: Mitra;
}

interface MitraAutocompleteProps {
  value?: number;
  onChange: (mitraId: number, mitraNama: string) => void;
  placeholder?: string;
}

const MitraAutocomplete: React.FC<MitraAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Cari atau tambah mitra...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMitra, setSelectedMitra] = useState<Mitra | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useSearchMitra(debouncedSearch);
  const addMitraWMutation = useAddMitraQuick();

  // Menggunakan fetchData dari utilitas Anda
  const filteredMitra = data?.data || [];

  // Handle klik di luar
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
    setSelectedMitra(mitra);
    setSearchQuery(mitra.nama);
    onChange(mitra.id, mitra.nama);
    setIsOpen(false);
  };

  // Menggunakan postData dari utilitas Anda
  const handleAddNewMitra = () => {
    addMitraWMutation.mutate(
      { nama: searchQuery, klasifikasi_mitra_id: 1 },
      {
        onSuccess: (response: MitraCreateResponse) => {
          if (response.success) {
            const newMitra = response.data;
            handleSelectMitra(newMitra);
          }
        },
      }
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            if (selectedMitra && e.target.value !== selectedMitra.nama) {
              setSelectedMitra(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 border-2 border-black focus-visible:ring-0",
            selectedMitra && " bg-green-50/30"
          )}
        />
        {isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        ) : selectedMitra ? (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4" />
        ) : null}
      </div>

      {isOpen && searchQuery.length >= 3 && (
        <div className="absolute z-[100] w-full mt-2 bg-white border-2 border-black rounded-md shadow-xl max-h-60 overflow-y-auto">
          {filteredMitra.length > 0 ? (
            <div className="p-1">
              {filteredMitra.map((mitra) => (
                <button
                  key={mitra.id}
                  type="button"
                  onClick={() => handleSelectMitra(mitra)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-sm flex items-center justify-between text-sm"
                >
                  {mitra.nama}
                  {selectedMitra?.id === mitra.id && (
                    <Check className="w-3 h-3 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            !isSearching && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Mitra tidak ditemukan
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddNewMitra}
                  className="bg-black text-white hover:bg-gray-800 w-full"
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Tambah "{searchQuery}"
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
