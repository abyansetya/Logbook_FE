import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { mitraSchema, type MitraFormData } from "~/lib/schema";
import { useKlasifikasis } from "~/hooks/use-helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TambahMitraProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MitraFormData) => void;
  isLoading: boolean;
}

const TambahMitra: React.FC<TambahMitraProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<MitraFormData>({
    resolver: zodResolver(mitraSchema),
    defaultValues: {
      nama: "",
      klasifikasi_mitra_id: 16, // Default as per original code
      alamat: "",
      contact_person: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  // Fetch classifications
  const { data: klasifikasiResponse, isLoading: isLoadingKlasifikasi } =
    useKlasifikasis();
  const klasifikasis = klasifikasiResponse?.data || [];

  const onHandleSubmit = (data: MitraFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tambah Mitra Baru
          </DialogTitle>
          <DialogDescription>
            Isi data mitra baru di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onHandleSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nama Mitra</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama mitra"
                      className="border-2 border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="klasifikasi_mitra_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Klasifikasi Mitra</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                    disabled={isLoadingKlasifikasi}
                  >
                    <FormControl>
                      <SelectTrigger className="border-2 border-black">
                        <SelectValue
                          placeholder={
                            isLoadingKlasifikasi
                              ? "Memuat..."
                              : "Pilih klasifikasi"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {klasifikasis.map((k: any) => (
                        <SelectItem key={k.id} value={k.id.toString()}>
                          {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Alamat</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan alamat mitra"
                      className="border-2 border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Contact Person</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan contact person"
                      className="border-2 border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-2 border-black"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Mitra
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahMitra;
