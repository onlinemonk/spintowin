import { useQuery } from "@tanstack/react-query";
import { get } from "../core/api";
import { IWarrantyData } from "../type/model";

export const useFetchWarrantyData = () => {
  return useQuery({
    queryKey: ["warrantyData"],
    queryFn: async () => {
      const response = await get<IWarrantyData[]>("/api/WarrantyData");
      return response.data;
    },
  });
};
