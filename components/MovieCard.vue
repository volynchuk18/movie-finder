<script setup lang="ts">
import type { MovieModel } from "~/models/movies";
import type { PropType } from "vue";

defineProps({
  movie: {
    type: Object as PropType<MovieModel>,
    required: true,
  },
  detailed: {
    type: Boolean,
    required: false,
  },
  error: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <el-card :body-style="{ padding: '0px' }" class="min-w-64">
    <el-image :src="movie.Poster" fit="fill">
      <template #error>
        <el-skeleton :animated="!movie.Poster && !error" class="!h-full">
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
      <div>Director: {{ movie.Director }}</div>
    </div>
    <el-skeleton v-else-if="!error" :rows="2" class="p-2" animated />
    <div v-else class="px-2 py-1">{{ error }}</div>

    <nuxt-link
      v-if="!detailed"
      :to="{ path: 'details', query: { q: movie.Title } }"
    >
      <el-button v-if="movie.Title" type="primary" class="w-full">
        Details
      </el-button>
    </nuxt-link>
  </el-card>
</template>

<style scoped>
.el-image {
  display: block;
  min-height: 300px;
}
</style>
