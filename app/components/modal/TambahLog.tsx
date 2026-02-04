import React, { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, CalendarDays, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";
import { useAddLog } from "../../hooks/use-logbook"; // Sesuaikan path hook Anda
import { useUnits } from "~/hooks/use-helper";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TambahLogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: number | null;
  userId: number; // Diperlukan untuk payload
  mitraId: number; // Diperlukan untuk payload
}

const TambahLog: React.FC<TambahLogProps> = ({
  isOpen,
  onClose,
  documentId,
  userId,
  mitraId,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [keterangan, setKeterangan] = useState("");
  const [unitId, setUnitId] = useState<string>("");

  const { data: unitResponse } = useUnits();
  const units = unitResponse?.data || [];

  // Integrasi Hook useAddLog
  const { mutate: addLogMutation, isPending } = useAddLog();

  const handleClose = () => {
    setDate(new Date());
    setKeterangan("");
    setUnitId("");
    onClose();
  };

  const handleSubmit = () => {
    if (!date || !keterangan || !unitId) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    if (!documentId) {
      toast.error("ID Dokumen tidak ditemukan");
      return;
    }

    // Eksekusi mutation
    addLogMutation(
      {
        user_id: userId,
        mitra_id: mitraId,
        dokumen_id: documentId,
        unit_id: Number(unitId),
        keterangan: keterangan,
        tanggal_log: format(date, "yyyy-MM-dd"),
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <CalendarDays className="w-6 h-6" />
            Tambah Log Aktivitas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="font-bold text-sm">Tanggal Aktivitas</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isPending}
                  className={cn(
                    "w-full pl-3 text-left font-normal border-2 border-black",
                    !date && "text-muted-foreground",
                  )}
                >
                  {date ? (
                    format(new Date(date), "dd MMMM yyyy", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-2 border-black"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-bold text-sm">Unit Penginput</Label>
            <Select onValueChange={setUnitId} value={unitId}>
              <SelectTrigger className="border-2 border-black focus-visible:ring-0">
                <SelectValue placeholder="Pilih Unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id.toString()}>
                    {unit.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-bold text-sm">Keterangan</Label>
            <Textarea
              placeholder="Apa yang dilakukan pada dokumen ini?"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              disabled={isPending}
              rows={3}
              className="border-2 border-black resize-none focus-visible:ring-0"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-black text-white hover:bg-gray-800 font-bold px-8 min-w-[140px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Log"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TambahLog;
