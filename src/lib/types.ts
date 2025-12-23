export interface Movie {
  id: number;
  title: string;
  watched: boolean;
  createdAt: number;
  watchedAt: number | null;
}
