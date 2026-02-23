import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full flex justify-between border-2 border-black min-w-0",
                            (!field.value ||
                              !klasifikasis.find(
                                (k: any) => k.id === field.value,
                              )) &&
                              "text-muted-foreground",
                          )}
                          disabled={isLoadingKlasifikasi}
                        >
                          <span className="truncate">
                            {isLoadingKlasifikasi
                              ? "Memuat..."
                              : field.value
                                ? klasifikasis.find(
                                    (k: any) => k.id === field.value,
                                  )?.nama || "Pilih Klasifikasi"
                                : "Pilih Klasifikasi"}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0 border-2 border-black"
                      align="start"
                    >
                      <div className="p-2 border-b border-gray-100">
                        <div className="flex items-center px-3 bg-gray-50 rounded-xl border border-gray-200">
                          <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                          <Input
                            placeholder="Cari klasifikasi..."
                            className="border-none bg-transparent focus-visible:ring-0 h-9 text-sm focus-visible:ring-offset-0 shadow-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div
                        className="max-h-[200px] overflow-y-auto p-1"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        {klasifikasis.length > 0 &&
                          klasifikasis.filter((k: any) =>
                            k.nama
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                          ).length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              Klasifikasi tidak ditemukan.
                            </div>
                          )}
                        {klasifikasis
                          .filter((k: any) =>
                            k.nama
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                          )
                          .map((k: any) => (
                            <div
                              key={k.id}
                              className={cn(
                                "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none hover:bg-gray-100 transition-colors justify-start text-left",
                                field.value === k.id
                                  ? "bg-gray-100 font-bold"
                                  : "",
                              )}
                              onClick={() => {
                                field.onChange(k.id); // Update form directly
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 shrink-0",
                                  field.value === k.id
                                    ? "opacity-100 text-black"
                                    : "opacity-0",
                                )}
                              />
                              <span className="truncate flex-1">{k.nama}</span>
                            </div>
                          ))}
                      </div>
                    </PopoverContent>
                  </Popover>
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

            <DialogFooter className="pt-4 gap-3">
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
