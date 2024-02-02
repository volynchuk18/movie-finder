<script setup lang="ts">
import { useMoviesStore, fetchMovieInfo, emptyMovie } from "~/stores/movies";
import type { MovieModel } from "~/models/movies";

const route = useRoute();

const moviesStore = useMoviesStore();

const queryTitle = route.query.q?.toString() || "";

const movieDetails: MovieModel = ref(
  moviesStore.movies.find((movie) => movie.Title === queryTitle) || emptyMovie,
);

let error = "";

onBeforeMount(async () => {
  if (queryTitle && !movieDetails.value.Title) {
    movieDetails.value = await fetchMovieInfo(queryTitle);
    if (movieDetails.value.Error) {
      error = movieDetails.value.Error;
    }
  }
});
</script>

<template>
  <el-container class="flex items-center !flex-col pt-32">
    <movie-card :movie="movieDetails" :error="error" detailed />
  </el-container>
</template>

<style scoped></style>
