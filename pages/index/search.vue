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
    newIndex === moviesStore.movies.length - 2 &&
    moviesStore.movies.length - 2 < moviesStore.totalResults
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
      v-for="movie in moviesStore.movies"
      :key="movie.localId"
    >
      <el-card :body-style="{ padding: '0px' }">
        <el-image :src="movie.Poster" fit="fill">
          <template #error>
            <el-skeleton class="!h-full" :animated="!movie.Title">
              <template #template>
                <el-skeleton-item
                  variant="image"
                  class="!h-full"
                  style="height: 300px !important"
                />
              </template>
            </el-skeleton>
          </template>
        </el-image>
        <div v-if="movie.Title" class="px-2 py-1">
          <h2 class="font-bold">{{ movie.Title }}</h2>
          <div>Year: {{ movie.Year }}</div>
        </div>
        <el-skeleton v-else :rows="2" class="p-2" :animated="!movie.Title" />

        <nuxt-link :to="{ path: 'details', query: { q: movie.Title } }">
          <el-button v-if="movie.Title" type="primary" class="w-full">
            Details
          </el-button>
        </nuxt-link>
      </el-card>
    </el-carousel-item>
  </el-carousel>
</template>
{

<style scoped>
.search-carousel {
  width: min(600px, 90vw);
}
.el-image {
  display: block;
  min-height: 300px;
}
</style>
