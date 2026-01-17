import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  label: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title?: string;
  description?: string;
}

const ConfirmDeleteModal = ({
  label,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = `Hapus ${label}?`,
  description = `Tindakan ini tidak dapat dibatalkan. ${label === "log" ? "Data log terkait akan terhapus" : "Seluruh data log terkait dokumen ini juga akan ikut terhapus."}`,
  // `Tindakan ini tidak dapat dibatalkan. Seluruh data log terkait ${label} ini juga akan ikut terhapus.`,
}: ConfirmDeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600">{description}</p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="border-2 border-black font-bold mr-2 cursor-pointer hover:bg-black hover:text-white"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            className=" cursor-pointer font-bold  bg-red-600  text-white hover:bg-red-800 "
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              `Ya, Hapus ${label}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
