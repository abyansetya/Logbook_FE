import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import type { Unit } from "~/service/unit-service";

const unitSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama unit wajib diisi")
    .max(255, "Nama unit maksimal 255 karakter"),
});

type UnitFormData = z.infer<typeof unitSchema>;

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UnitFormData) => void;
  isLoading: boolean;
  initialData?: Unit | null;
}

const UnitModal: React.FC<UnitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData = null,
}) => {
  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      nama: initialData?.nama || "",
    },
  });

  React.useEffect(() => {
    if (initialData && isOpen) {
      form.reset({
        nama: initialData.nama,
      });
    } else if (!isOpen) {
      form.reset({ nama: "" });
    }
  }, [initialData, isOpen, form]);

  const handleSubmit = (data: UnitFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? "Edit Unit" : "Tambah Unit Baru"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nama Unit</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama unit"
                      className="border-2 border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-2 border-black font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white hover:bg-gray-800 font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : initialData ? (
                  "Update Unit"
                ) : (
                  "Simpan Unit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UnitModal;
