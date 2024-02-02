<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { useMoviesStore } from "~/stores/movies";

const route = useRoute();

const searchValue = ref(route.query.q?.toString() || "");

const moviesStore = useMoviesStore();

const searchHandler = async () => {
  if (!searchValue.value) {
    return;
  }

  await navigateTo({
    path: "search",
    query: {
      q: searchValue.value,
    },
  });

  await moviesStore.fetchMovies(searchValue.value);
};

onBeforeMount(() => {
  if (searchValue.value) {
    searchHandler();
  }
});
</script>

<template>
  <el-container class="justify-center p-10 flex !flex-col items-center">
    <div class="flex gap-2">
      <el-form @submit.prevent="searchHandler">
        <el-form-item>
          <el-input
              v-model="searchValue"
              placeholder="Movie search"
              class="min-w-64"
              :value="searchValue"
          >
            <template #prefix>
              <el-button
                  native-type="submit"
                  :icon="Search"
                  text
                  class="!-ml-2.5 !mr-0"
              />
            </template>
            <template #suffix>
              <el-icon class="is-loading" v-if="moviesStore.isLoading">
                <el-icon-loading />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <nuxt-link
          :to="{ path: 'add-movie' }"
      >
        <el-button type="primary">
          Add movie
        </el-button>
      </nuxt-link>
    </div>

    <NuxtPage />
  </el-container>
</template>
