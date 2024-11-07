<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
const store = useDataStore();

function onTaxonomyFileChange(e) {
  console.log(e.target.files[0]);
}

function onPromptFileChange(e) {
  console.log(e.target.files[0]);
}

function onDatasetFileChange(e) {
  console.log(e.target.files[0]);
}
</script>


<template>
  <div class="oper-bar">

    <div class="oper-item">
      <label for="">
        <i class="fa-regular fa-clipboard"></i>
        Taxonomy
      </label>
      <input type="file" ref="file" @change="onTaxonomyFileChange" />
    </div>

    <Divider layout="vertical" />

    <div class="oper-item">

      <label for="">
        <i class="fa-regular fa-file-code"></i>
        Prompt
      </label>
      <input type="file" ref="file" @change="onPromptFileChange" />
    </div>

    <Divider layout="vertical" />

    <div class="oper-item">

      <label for="">
        <i class="fa-regular fa-file-lines"></i>
        Dataset
      </label>
      <input type="file" ref="file" @change="onDatasetFileChange" />
    </div>

    <Divider layout="vertical" />
    <Button label="Load the files" icon="pi pi-upload" severity="secondary" />
    <Divider layout="vertical" />
    <Button label="Save" icon="pi pi-save" severity="secondary" />
  </div>
</template>

<style scoped>
.oper-bar {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 0.5rem;
}
.oper-item {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 0.5rem;
  width: 15rem;
}
</style>