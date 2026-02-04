import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calendar as CalendarIcon, CalendarDays, Loader2 } from "lucide-react";

// Menggunakan jalur import yang disesuaikan untuk memastikan resolusi file berhasil
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
import { useEditLog } from "../../hooks/use-logbook";
import { toast } from "sonner";

interface UpdateLogProps {
  isOpen: boolean;
  onClose: () => void;
  // Data log lama yang akan diedit
  logData: {
    id: number;
    dokumen_id: number;
    user_id: number;
    keterangan: string;
    tanggal_log: string;
  } | null;
}

const UpdateLog: React.FC<UpdateLogProps> = ({ isOpen, onClose, logData }) => {
  // State untuk form
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [keterangan, setKeterangan] = useState("");
  const [userId, setUserId] = useState<number>(0);

  // Integrasi Hook useEditLog
  const { mutate: updateLogMutation, isPending } = useEditLog();

  // Inisialisasi data saat modal dibuka
  useEffect(() => {
    if (isOpen && logData) {
      setKeterangan(logData.keterangan);
      setUserId(logData.user_id);

      const parsedDate = new Date(logData.tanggal_log);
      setDate(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
    }
  }, [isOpen, logData]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!date || !keterangan) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    if (!logData) {
      toast.error("Data log tidak ditemukan");
      return;
    }

    // Eksekusi mutation sesuai kontrak: { id, dokumen_id, data }
    updateLogMutation(
      {
        id: logData.id,
        dokumen_id: logData.dokumen_id,
        data: {
          user_id: userId,
          keterangan: keterangan,
          tanggal_log: format(date, "yyyy-MM-dd"),
        },
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
            Update Log Aktivitas
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
                    format(date, "dd MMMM yyyy", { locale: localeId })
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
                  locale={localeId}
                />
              </PopoverContent>
            </Popover>
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
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="font-bold"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-black text-white hover:bg-gray-800 font-bold px-8 min-w-[140px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memperbarui...
              </>
            ) : (
              "Update Log"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLog;
