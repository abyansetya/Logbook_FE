import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, FileText } from "lucide-react";
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
import type { Document } from "../../../types/logbook";
import { useStatuses } from "~/hooks/use-helper";
import { JENIS_DOKUMEN } from "~/lib/constanst";

interface UpdateDokumenProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TambahDokumenData) => void;
  isLoading: boolean;
  initialData?: Document | null; // Data awal untuk edit mode
}

const UpdateDokumen: React.FC<UpdateDokumenProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData = null,
}) => {
  const [selectedMitraNama, setSelectedMitraNama] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const { data: statusResponse, isLoading: isLoadingStatus } = useStatuses();
  const statuses = statusResponse?.data || [];

  const form = useForm<TambahDokumenData>({
    resolver: zodResolver(tambahDokumenSchema),
    defaultValues: {
      mitra_id: undefined,
      jenis_dokumen_id: 0,
      nomor_dokumen_mitra: "",
      nomor_dokumen_undip: "",
      judul_dokumen: "",
      tanggal_dokumen: "",
      contact_person: "",
      status_id: 0,
      tanggal_masuk: new Date().toISOString().split("T")[0],
      tanggal_terbit: "",
    },
  });

  // Ref untuk memastikan form reset hanya sekali per initialData
  const lastResetId = React.useRef<number | null | undefined>(undefined);

  // Reset form dengan data awal saat initialData berubah
  useEffect(() => {
    // Only reset if modal is open, statuses are loaded,
    // AND this initialData hasn't been reset for already
    if (
      isOpen &&
      statuses.length > 0 &&
      lastResetId.current !== initialData?.id
    ) {
      // Mapping jenis dokumen
      const jenisMap: Record<string, number> = {
        "Memorandum of Understanding (MoU)": 1,
        "Memorandum of Agreement (MoA)": 2,
        "Implementation Arrangement (IA)": 3,
      };

      const currentStatus = statuses.find(
        (s) => s.nama === initialData?.status,
      );

      form.reset({
        mitra_id: initialData?.mitra?.id,
        jenis_dokumen_id: initialData
          ? jenisMap[initialData.jenis_dokumen || ""] || 0
          : 0,
        nomor_dokumen_mitra: initialData?.nomor_dokumen_mitra || "",
        nomor_dokumen_undip: initialData?.nomor_dokumen_undip || "",
        judul_dokumen: initialData?.judul_dokumen || "",
        tanggal_dokumen: initialData?.tanggal_dokumen || "",
        contact_person: initialData?.contact_person || "",
        status_id: currentStatus ? currentStatus.id : 0,
        tanggal_masuk:
          initialData?.tanggal_masuk || new Date().toISOString().split("T")[0],
        tanggal_terbit: initialData?.tanggal_terbit || "",
        draft_dokumen: initialData?.draft_dokumen || "",
        final_dokumen: initialData?.final_dokumen || "",
      });

      setSelectedMitraNama(initialData?.mitra?.nama || "");
      lastResetId.current = initialData?.id;
    }

    // Reset ref saat modal ditutup agar bisa dipicu lagi saat dibuka nanti
    if (!isOpen) {
      lastResetId.current = undefined;
    }
  }, [initialData, isOpen, form, statuses]);

  const onHandleSubmit = (data: TambahDokumenData) => {
    console.log("Submitting data:", { ...data, mitra_nama: selectedMitraNama });
    onSubmit(data);
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
            {initialData ? "Edit Dokumen" : "Tambah Dokumen Baru"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onHandleSubmit)}
            className="space-y-4"
          >
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

            {/* Draft Dokumen */}
            <FormField
              control={form.control}
              name="draft_dokumen"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Draft Dokumen (PDF, Maks 2MB)
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {initialData?.draft_dokumen &&
                      typeof value === "string" &&
                      value !== "" ? (
                        <div className="flex items-center justify-between p-2 border-2 border-black bg-yellow-50 rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-yellow-700" />
                            <span className="text-sm font-medium text-yellow-800 truncate max-w-[200px]">
                              {initialData.draft_dokumen.split("/").pop()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 border-black font-bold"
                              onClick={() =>
                                window.open(
                                  initialData.draft_dokumen!,
                                  "_blank",
                                )
                              }
                            >
                              Lihat
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="h-8 font-bold"
                              onClick={() => onChange("")} // Clear value to signify deletion/replacement
                            >
                              Hapus
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Input
                          type="file"
                          accept=".pdf"
                          className="border-2 border-black file:mr-4 file:py-0.5 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-bold file:bg-gray-500 file:text-white hover:file:bg-gray-400 file:cursor-pointer cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          {...fieldProps}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Final Dokumen - Muncul hanya jika status adalah "Terbit" */}
            {statuses.find((s) => s.id === form.watch("status_id"))?.nama ===
              "Terbit" && (
              <FormField
                control={form.control}
                name="final_dokumen"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Dokumen Final (PDF, Maks 2MB)
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {initialData?.final_dokumen &&
                        typeof value === "string" &&
                        value !== "" ? (
                          <div className="flex items-center justify-between p-2 border-2 border-black bg-green-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-green-700" />
                              <span className="text-sm font-medium text-green-800 truncate max-w-[200px]">
                                {initialData.final_dokumen.split("/").pop()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 border-black font-bold"
                                onClick={() =>
                                  window.open(
                                    initialData.final_dokumen!,
                                    "_blank",
                                  )
                                }
                              >
                                Lihat
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="h-8 font-bold"
                                onClick={() => onChange("")}
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Input
                            type="file"
                            accept=".pdf"
                            className="border-2 border-black file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...fieldProps}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Tanggal Dokumen */}
            <FormField
              control={form.control}
              name="tanggal_dokumen"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-bold">Tanggal Dokumen</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal border-2 border-black",
                            !field.value && "text-muted-foreground",
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
                            date ? format(date, "yyyy-MM-dd") : null,
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

            {/* Contact Person */}
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Contact Person</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan contact person (pilihan)"
                      className="border-2 border-black"
                      {...field}
                      value={field.value || ""}
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
                      initialDisplayValue={selectedMitraNama}
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
                    value={
                      field.value !== 0 ? field.value?.toString() : undefined
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-full border-2 border-black">
                        <SelectValue placeholder="Pilih jenis dokumen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JENIS_DOKUMEN.map((jenis) => (
                        <SelectItem key={jenis.id} value={jenis.id.toString()}>
                          {jenis.nama}
                        </SelectItem>
                      ))}
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
                    value={field.value?.toString()}
                    disabled={isLoadingStatus} // Disable jika sedang loading data API
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-full border-2 border-black">
                        <SelectValue
                          placeholder={
                            isLoadingStatus
                              ? "Memuat status..."
                              : "Pilih status dokumen"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id.toString()}
                        >
                          {status.nama}
                        </SelectItem>
                      ))}
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
                              !field.value && "text-muted-foreground",
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
                              date ? format(date, "yyyy-MM-dd") : "",
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal border-2 border-black",
                              !field.value && "text-muted-foreground",
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
                              date ? format(date, "yyyy-MM-dd") : null,
                            );
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
                ) : initialData ? (
                  "Update Dokumen"
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

export default UpdateDokumen;
