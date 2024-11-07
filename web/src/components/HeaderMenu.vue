<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
import * as fs_helper from "../utils/fs_helper";

const store = useDataStore();

async function onTaxonomyFileChange(e) {
  console.log(e.target.files[0]);
  let f = await fs_helper.fs_read_file_system_handle(e.target.files[0]);
  console.log(f);

  // update the taxonomy list
  store.taxonomy_file = f;
  store.setTaxonomyByText(f.text)
}

function onPromptFileChange(e) {
  console.log(e.target.files[0]);
}

function onDatasetFileChange(e) {
  console.log(e.target.files[0]);
}

</script>


<template>
<div class="header-menu">
  
  <div class="left">

    <div class="oper-item">
      <label for="">
        <i class="fa-regular fa-clipboard"></i>
        Taxonomy File
        <a href=""
          title="Download example taxonomy">
          <i class="fa-regular fa-question-circle"></i>
        </a>
      </label>
      <input type="file" 
        accept=".txt"
        @change="onTaxonomyFileChange" />
    </div>

    <Divider layout="vertical" />

    <div class="oper-item">

      <label for="">
        <i class="fa-regular fa-file-code"></i>
        Prompt Template File
        <a href=""
          title="Download example prompt">
          <i class="fa-regular fa-question-circle"></i>
        </a>
      </label>
      <input type="file" 
        accept=".txt" 
        @change="onPromptFileChange" />
    </div>

    <Divider layout="vertical" />

    <div class="oper-item">

      <label for="">
        <i class="fa-regular fa-file-lines"></i>
        Dataset File
        <a href=""
          title="Download example dataset">
          <i class="fa-regular fa-question-circle"></i>
        </a>
      </label>
      <input type="file" ref="file" @change="onDatasetFileChange" />
    </div>

    <Divider layout="vertical" />
    <Button label="Load the files" icon="pi pi-upload" severity="secondary" />
    <Divider layout="vertical" />
    <Button label="Save dataset file" icon="pi pi-save" severity="secondary" />
  </div>

  <div class="right">
    <Button label="Help" icon="pi pi-question" severity="secondary" />
  </div>
</div>
</template>

<style scoped>
.header-menu {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 0.5rem;
}
.right {
  padding: 0 1rem 0 0;
}
.oper-item {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 0.5rem;
  width: 15rem;
}
</style>