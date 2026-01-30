export type ArtApiResponse<T> = {
  pagination: Pagination;
  data: T[];
  info: Record<string, unknown>;
  config: {
    iiif_url: string;
    website_url: string;
  };
};

export type Pagination = {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
  next_url: string | null;
};

export type Artwork = {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
};

