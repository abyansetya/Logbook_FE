import { useQuery } from "@tanstack/react-query";
import {
  getStatuses,
  getKlasifikasis,
  addActivity,
  getRecentActivities,
  getUnits,
} from "~/service/helper-service";
import { useAuth } from "~/provider/auth-context";
import type { addActivityPayload } from "types/activity";

export const useStatuses = () => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUnits = () => {
  return useQuery({
    queryKey: ["units"],
    queryFn: getUnits,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useKlasifikasis = () => {
  return useQuery({
    queryKey: ["klasifikasis"],
    queryFn: getKlasifikasis,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAddActivity = () => {
  const { user } = useAuth();

  const logActivity = (payload: Omit<addActivityPayload, "user_id">) => {
    if (user) {
      addActivity({
        ...payload,
        user_id: user.id,
      });
    }
  };

  return { logActivity };
};

export const useRecentActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getRecentActivities,
    staleTime: 60 * 1000, // 1 minute
  });
};
