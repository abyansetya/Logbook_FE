import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchMitra,
  addMitraQuick,
  searchDocument,
} from "~/service/logbook-service";

export const useSearchMitra = (query: string) => {
  return useQuery({
    queryKey: ["mitra-search", query],
    queryFn: () => searchMitra(query),
    enabled: query.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddMitraQuick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMitraQuick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra-search"] });
    },
  });
};
