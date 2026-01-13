import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "~/lib/utils";
import { tambahDokumenSchema, type TambahDokumenData } from "~/lib/schema";
import MitraAutocomplete from "./MitraAutoComplete";

interface TambahDokumenProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TambahDokumenData) => void;
  isLoading: boolean;
}

const TambahDokumen: React.FC<TambahDokumenProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [selectedMitraNama, setSelectedMitraNama] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const form = useForm<TambahDokumenData>({
    resolver: zodResolver(tambahDokumenSchema),
    defaultValues: {
      mitra_id: undefined,
      jenis_dokumen_id: 0,
      nomor_dokumen_mitra: "",
      nomor_dokumen_undip: "",
      judul_dokumen: "",
      status_id: 0,
      tanggal_masuk: new Date().toISOString().split("T")[0],
      tanggal_terbit: "",
    },
  });

  const onHandleSubmit = (data: TambahDokumenData) => {
    console.log("Submitting data:", { ...data, mitra_nama: selectedMitraNama });
    onSubmit(data);
    form.reset();
    setSelectedMitraNama("");
  };

  const handleCloseModal = () => {
    form.reset();
    setSelectedMitraNama("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tambah Dokumen Baru
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onHandleSubmit)}
            className="space-y-4"
          >
            {/* Judul Dokumen */}
            <FormField
              control={form.control}
              name="judul_dokumen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Judul Dokumen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul dokumen"
                      className="border-2 border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mitra dengan Autocomplete */}
            <FormField
              control={form.control}
              name="mitra_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Mitra</FormLabel>
                  <FormControl>
                    <MitraAutocomplete
                      value={field.value}
                      onChange={(id, nama) => {
                        field.onChange(id);
                        setSelectedMitraNama(nama);
                      }}
                      placeholder="Cari atau tambah mitra (min. 3 karakter)..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Jenis Dokumen */}
            <FormField
              control={form.control}
              name="jenis_dokumen_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Jenis Dokumen</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-full border-2 border-black">
                        <SelectValue placeholder="Pilih jenis dokumen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">
                        Memorandum of Understanding (MoU)
                      </SelectItem>
                      <SelectItem value="2">
                        Memorandum of Agreement (MoA)
                      </SelectItem>
                      <SelectItem value="3">
                        Implementation Arrangement (IA)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Status</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-full border-2 border-black">
                        <SelectValue placeholder="Pilih status dokumen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Draft</SelectItem>
                      <SelectItem value="2">Terbit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Nomor Dokumen Mitra */}
              <FormField
                control={form.control}
                name="nomor_dokumen_mitra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Nomor Dokumen Mitra
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nomor dokumen mitra"
                        className="border-2 border-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nomor Dokumen Undip */}
              <FormField
                control={form.control}
                name="nomor_dokumen_undip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Nomor Dokumen Undip
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nomor dokumen undip"
                        className="border-2 border-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tanggal Masuk */}
              <FormField
                control={form.control}
                name="tanggal_masuk"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">Tanggal Masuk</FormLabel>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal border-2 border-black",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd MMMM yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tanggal Terbit */}
              <FormField
                control={form.control}
                name="tanggal_terbit"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">Tanggal Terbit</FormLabel>

                    {/* 2. Hubungkan state ke Popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button" // Pastikan type button agar tidak trigger submit form
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal border-2 border-black",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd MMMM yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            // 3. Set value ke form
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : null
                            );

                            // 4. Paksa tutup popover setelah pilih
                            setIsCalendarOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Dokumen"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahDokumen;
