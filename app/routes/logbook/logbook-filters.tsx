import React from "react";
import { Search, Loader2, Filter, Download, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { JENIS_DOKUMEN } from "~/lib/constanst";

interface LogbookFiltersProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  isLoading: boolean;
  showFilterDropdown: boolean;
  setShowFilterDropdown: (show: boolean) => void;
  hasActiveFilters: boolean;
  onExport: () => void;
  isExportPending: boolean;
  currentStatus: string;
  onStatusChange: (val: string) => void;
  statuses: any[];
  currentJenis: string;
  onJenisChange: (val: string) => void;
  currentTahun: string;
  onTahunChange: (val: string) => void;
  clearFilters: () => void;
}

export function LogbookFilters({
  searchInput,
  setSearchInput,
  isLoading,
  showFilterDropdown,
  setShowFilterDropdown,
  hasActiveFilters,
  onExport,
  isExportPending,
  currentStatus,
  onStatusChange,
  statuses,
  currentJenis,
  onJenisChange,
  currentTahun,
  onTahunChange,
  clearFilters,
}: LogbookFiltersProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-1 gap-4">
          <div className="flex-1 relative min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari dokumen..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 py-6 bg-gray-50 border-gray-100 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-300"
            />
            {isLoading && (
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
        <Button
          variant="outline"
          className="rounded-xl px-6 py-6 border-gray-100 cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-50 font-semibold gap-2"
          onClick={onExport}
          disabled={isExportPending}
        >
          {isExportPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download Excel
        </Button>
      </div>

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
                  Status Dokumen
                </Label>
                <Select value={currentStatus} onValueChange={onStatusChange}>
                  <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 py-6">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                    <SelectItem value="all">Semua Status</SelectItem>
                    {statuses.map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px] space-y-2">
                <Label className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
                  Jenis Dokumen
                </Label>
                <Select value={currentJenis} onValueChange={onJenisChange}>
                  <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 py-6">
                    <SelectValue placeholder="Pilih Jenis" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    {JENIS_DOKUMEN.map((jenis) => (
                      <SelectItem key={jenis.id} value={jenis.id.toString()}>
                        {jenis.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px] space-y-2">
                <Label className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
                  Tahun Dokumen
                </Label>
                <Select value={currentTahun} onValueChange={onTahunChange}>
                  <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50 py-6">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {Array.from(
                      { length: 8 },
                      (_, i) => new Date().getFullYear() - i,
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
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
  );
}
