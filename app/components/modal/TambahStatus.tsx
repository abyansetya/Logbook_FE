import React from "react";
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

const statusSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama status wajib diisi")
    .max(255, "Nama status maksimal 255 karakter"),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface TambahStatusProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StatusFormData) => void;
  isLoading: boolean;
}

const TambahStatus: React.FC<TambahStatusProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: { nama: "" },
  });

  React.useEffect(() => {
    if (!isOpen) {
      form.reset({ nama: "" });
    }
  }, [isOpen, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tambah Status Baru
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nama Status</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama status"
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
                ) : (
                  "Simpan Status"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahStatus;
