<script setup lang="ts">
import { useMoviesStore } from "~/stores/movies";

const route = useRoute();

const moviesStore = useMoviesStore();

const searchValue = route.query.q?.toString() || "";

onBeforeMount(() => {
  if (searchValue) {
    moviesStore.fetchMovieInfo(searchValue);
  }
});
</script>

<template>
  <el-container class="flex items-center !flex-col pt-32">
    <el-card v-if="moviesStore.movieDetails" :body-style="{ padding: '0px' }" class="w-64">
      <el-image :src="moviesStore.movieDetails.Poster" fit="fill" class="w-full">
        <template #error>
          <el-skeleton class="!h-full">
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
      <div class="px-2 py-1">
        <h2 class="font-bold">{{ moviesStore.movieDetails.Title }}</h2>
        <div>Year: {{ moviesStore.movieDetails.Year }}</div>
        <div>Director: {{ moviesStore.movieDetails.Director }}</div>
      </div>
    </el-card>
  </el-container>
</template>

<style scoped></style>