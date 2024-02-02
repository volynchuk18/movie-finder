<script setup lang="ts">
import { useMoviesStore } from "~/stores/movies";
import type { MovieModel } from "~/models/movies";
const route = useRoute();

const moviesStore = useMoviesStore();

const carousel = ref(null);

let slideLastIndex = 0;

const onSlideChange = async (newIndex: number, oldIndex: number) => {
  if (Math.abs(Math.abs(newIndex) - Math.abs(oldIndex)) === 1) {
    slideLastIndex = newIndex;
  }

  if (
    newIndex === moviesStore.movies.length - 3 &&
    moviesStore.movies.filter((mov) => mov.Title).length <
      moviesStore.totalResults
  ) {
    await moviesStore.fetchMovies(
      route.query.q?.toString(),
      Math.ceil(newIndex / 10) + 1,
    );
    carousel.value.setActiveItem(slideLastIndex);
  }
};

const carouselItemDetailsClickHandler = async (movie: MovieModel) => {
  await navigateTo({
    path: "details",
    query: {
      q: movie.Title,
    },
  });
};
</script>

<template>
  <el-carousel
    class="search-carousel"
    height="600px"
    type="card"
    arrow="always"
    trigger="click"
    indicator-position="none"
    :loop="false"
    :autoplay="false"
    @change="onSlideChange"
    ref="carousel"
  >
    <el-carousel-item
      v-if="moviesStore.movies.length"
      v-for="(movie, index) in moviesStore.movies"
      :key="index"
    >
      <movie-card :movie="movie" :error="moviesStore.error" />
    </el-carousel-item>
  </el-carousel>
</template>
{

<style scoped>
.search-carousel {
  width: min(600px, 90vw);
}
</style>
