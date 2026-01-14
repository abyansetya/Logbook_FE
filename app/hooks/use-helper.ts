import { useQuery } from "@tanstack/react-query";
import { getStatus } from "~/service/helper-service";

export const useStatuses = () => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatus,
  });
};
