import React, { useState } from "react";
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
import { JENIS_DOKUMEN } from "~/lib/constanst";

interface TambahLogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (logData: {
    tanggal_log: string;
    keterangan: string;
    contact_person: string;
  }) => void;
  documentId: number | null;
}

const TambahLog: React.FC<TambahLogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  documentId,
}) => {
  const [tanggalLog, setTanggalLog] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  const handleSubmit = () => {
    if (!tanggalLog || !keterangan || !contactPerson) {
      alert("Mohon lengkapi semua field");
      return;
    }

    onSubmit({
      tanggal_log: tanggalLog,
      keterangan: keterangan,
      contact_person: contactPerson,
    });

    // Reset form
    setTanggalLog("");
    setKeterangan("");
    setContactPerson("");
  };

  const handleClose = () => {
    // Reset form when closing
    setTanggalLog("");
    setKeterangan("");
    setContactPerson("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tambah Log Aktivitas
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-bold">Tanggal Log</Label>
            <Input
              type="date"
              value={tanggalLog}
              onChange={(e) => setTanggalLog(e.target.value)}
              className="border-2 border-black mt-2"
            />
          </div>
          <div>
            <Label className="font-bold">Keterangan</Label>
            <Textarea
              placeholder="Masukkan keterangan aktivitas"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={4}
              className="border-2 border-black mt-2"
            />
          </div>
          <div>
            <Label className="font-bold">Contact Person</Label>
            <Input
              placeholder="Nama - Jabatan"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="border-2 border-black mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-2 border-black font-bold cursor-pointer"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black text-white hover:bg-gray-800 font-bold cursor-pointer"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TambahLog;
