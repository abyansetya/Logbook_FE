import { useQuery } from "@tanstack/react-query";
import { getStatuses } from "~/service/helper-service";

export const useStatuses = () => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (statuses rarely change)
  });
};
