<script setup lang="ts">
interface CreateNewMovieModel {
  name: string;
  type?: Date | String;
  required?: boolean;
  data: string;
}

const newMovieData = ref([
  {
    name: "Title",
    required: true,
    data: "",
  },
  {
    name: "Poster",
    data: "",
  },
  {
    name: "Director",
    data: "",
  },
  {
    name: "Year",
    data: "",
  },
]);

const createNewMovie = () => {
  const parsedMovieData: Record<string, unknown> = {};
  newMovieData.value.forEach((info) => {
    parsedMovieData[info.name] = info.data;
  });
  console.log(parsedMovieData);
};
</script>

<template>
  <el-container class="items-center !flex-col pt-32">
    <h2 class="font-bold text-2xl">Add a new movie</h2>
    <el-form @submit.prevent="createNewMovie" class="flex flex-col mt-8">
      <el-form-item v-for="field in newMovieData">
        <el-row>
          <el-input
            class="!w-64"
            :placeholder="field.name"
            :required="Boolean(field.required)"
            v-model="field.data"
          />
        </el-row>
      </el-form-item>
      <el-button native-type="submit" class="mx-auto w-full" type="primary"
        >Create</el-button
      >
    </el-form>
  </el-container>
</template>

<style scoped></style>
