<script setup lang="ts">
import { useMoviesStore, fetchMovieInfo, emptyMovie } from "~/stores/movies";

const route = useRoute();

const moviesStore = useMoviesStore();

const queryTitle = route.query.q?.toString() || "";

const movieDetails = ref(
  moviesStore.movies.find((movie) => movie.Title === queryTitle) || emptyMovie,
);

let error = "";

onBeforeMount(async () => {
  if (queryTitle && !movieDetails.value.Title) {
    const res = await fetchMovieInfo(queryTitle);
    if ('Error' in res) {
      error = res.Error;
    } else {
      movieDetails.value = res;
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
