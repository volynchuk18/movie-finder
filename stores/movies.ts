import { defineStore } from "pinia";
import type { MovieModel } from "~/models/movies";

interface RootState {
  movies: MovieModel[];
  totalResults: number;
  isLoading: boolean;
  movieDetails: MovieModel;
}

const omdbapiKey = "6daee4cc";
const mbdbapi = "https://www.omdbapi.com/";

const guidGenerator = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
};

const emptyMovie: MovieModel = {
  Poster: "",
  Title: "",
  Type: "",
  Year: "",
  imdbID: "",
  localId: guidGenerator(),
};

export const useMoviesStore = defineStore("movies", {
  state: () =>
    ({
      movies: [emptyMovie],
      isLoading: false,
      movieDetails: emptyMovie,
    }) as RootState,
  actions: {
    fetchMovies(query: string, page = 1) {
      this.isLoading = true;
      return $fetch<{
        Search: Omit<MovieModel, "localId">[] | undefined;
        totalResults: string;
      }>(`${mbdbapi}?s=${query}&page=${page}&apikey=${omdbapiKey}`)
        .then((res) => {
          if (page === 1) {
            this.movies = [emptyMovie];
          }
          if (res.Search) {
            this.movies.pop();
            this.movies.push(
              ...res.Search.map((item) => ({
                ...item,
                localId: guidGenerator(),
              })),
            );

            if (this.movies.length < Number(res.totalResults)) {
              this.movies?.push({
                ...emptyMovie,
                localId: guidGenerator(),
              });
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

    fetchMovieInfo(title: string) {
      this.isLoading = true;
      return $fetch<MovieModel>(`${mbdbapi}?t=${title}&apikey=${omdbapiKey}`)
        .then((res) => {
          this.movieDetails = res;
        })
        .catch(console.error)
        .finally(() => (this.isLoading = false));
    },
  },
});
