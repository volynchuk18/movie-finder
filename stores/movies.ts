import { defineStore } from "pinia";
import type { MovieModel } from "~/models/movies";

interface RootState {
  movies: MovieModel[];
  totalResults: number;
  isLoading: boolean;
  error: string;
}

const omdbapiKey = "e900c2cc";
const mbdbapi = "https://www.omdbapi.com/";

export const fetchMovieInfo = async (title: string) => {
  return $fetch<MovieModel | { Error: string }>(
    `${mbdbapi}?t=${title}&apikey=${omdbapiKey}`,
  )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      return emptyMovie;
    });
};

export const emptyMovie: MovieModel = {
  Poster: "",
  Title: "",
  Type: "",
  Year: "",
  imdbID: "",
};

export const useMoviesStore = defineStore("movies", {
  state: () =>
    ({
      movies: [emptyMovie],
      isLoading: false,
      error: "",
    }) as RootState,
  actions: {
    fetchMovies(query: string, page = 1) {
      this.isLoading = true;
      this.error = "";
      return $fetch<{
        Search: MovieModel[] | undefined;
        totalResults: string;
      }>(`${mbdbapi}?apikey=${omdbapiKey}&s=${query}&page=${page}`)
        .then(async (res) => {
          if (page === 1) {
            this.movies = [emptyMovie];
          }

          if (res.Search) {
            const detailedMoviesInfo = await Promise.all(
              res.Search.map((item) => fetchMovieInfo(item.Title)).filter(
                (item) => item,
              ),
            );

            this.movies.pop();
            this.movies.push(...detailedMoviesInfo as MovieModel[]);

            if (this.movies.length < Number(res.totalResults)) {
              this.movies?.push(emptyMovie);
            }
          }

          this.totalResults = Number(res.totalResults) || 0;
        })
        .catch((err) => {
          this.totalResults = 0;
          this.movies = [];
          console.error(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
});
