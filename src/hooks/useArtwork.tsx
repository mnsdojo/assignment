import { BASE_URL } from "../env";
import { useFetch } from "./useFetch";
import type { ArtApiResponse, Artwork } from "../types/api.types";
import { useMemo } from "react";

export const useArtWork = (page: number = 1) => {
  const url = `${BASE_URL}?page=${page}`;
  const { data, loading, error } = useFetch<ArtApiResponse<Artwork>>(url);

  const artWorks = useMemo(
    () =>
      data?.data.map((item) => ({
        id: item.id,
        title: item.title,
        artist: item.artist_display,
        inscriptions: item.inscriptions,
        origin: item.place_of_origin,
        startDate: item.date_start,
        endDate: item.date_end,
      })) ?? [],
    [data],
  );

  const pagination = data?.pagination ?? null;
  return { artWorks, pagination, loading, error } as const;
};
