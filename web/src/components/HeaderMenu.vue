<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
import * as fs_helper from "../utils/fs_helper";
import Papa from "papaparse";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const store = useDataStore();

async function onTaxonomyFileChange(e) {
  let { fh, file } = await fs_helper.fsOpenFile({
    types: [{
          description: 'Text File',
          accept: { 'text/plain': ['.txt'] }
    }],
    multiple: false,
  });

  let text = await file.text();

  // update the taxonomy list
  store.taxonomy_file = fh;
  store.setTaxonomyByText(text)
}

function onPromptFileChange(e) {
  console.log(e.target.files[0]);
}

async function onDatasetFileChange(e) {
  let { fh, file } = await fs_helper.fsOpenFile({
    types: [{
          description: 'TSV Files',
          accept: { 'text/plain': ['.tsv'] }
    }],
    multiple: false,
  });
  // console.log(e.target.files[0]);
  // let fh = e.target.files[0];
  // let f = await fs_helper.fs_read_file_system_handle(e.target.files[0]);
  store.dataset_file = fh;

  Papa.parse(
      file,
      {
        delimiter: '\t',
        skipEmptyLines: true,
        header: true,
        worker: true,
        step: (row) => {
            // console.log("Row data:", row.data);
            let formatted_row = store.formatTsvRow(row.data);
            store.items.push(formatted_row);
        },
      }
  );

}

async function onClickSaveDataset() {
  console.log('saving dataset');
  let content = Papa.unparse(
    store.items, { 
      delimiter: '\t' 
    }
  );
  
  // write back to the tsv file
  await fs_helper.fsWriteFile(
    store.dataset_file, 
    content
  );

  store.flag.has_decision_unsaved = false;
  console.log('* saved!');
}

</script>


<template>
<div class="header-menu">
  
  <div class="left">

    <div class="oper-item">
      <label class="file-label">
        <i class="fa-regular fa-clipboard"></i>
        Taxonomy File
        <a href=""
          title="Download example taxonomy">
          <i class="fa-regular fa-question-circle"></i>
        </a>
      </label>
      <div class="file-zone"
        @click="onTaxonomyFileChange">
        <template v-if="store.taxonomy_file">
          {{ store.taxonomy_file.name }}
        </template>
        <template v-else>
          Load the taxonomy file
        </template>
      </div>
    </div>

    <Divider layout="vertical" />

    <div class="oper-item">

      <label class="file-label">
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

      <label class="file-label">
        <i class="fa-regular fa-file-lines"></i>
        Dataset File
        <a href=""
          title="Download example dataset">
          <i class="fa-regular fa-question-circle"></i>
        </a>
      </label>
      <div class="file-zone"
        @click="onDatasetFileChange">
        <template v-if="store.dataset_file">
          {{ store.dataset_file.name }}
        </template>
        <template v-else>
          Load the dataset file
        </template>
      </div>
    </div>

    <Divider layout="vertical" />
    <Button label="Load the files" 
      icon="pi pi-upload" 
      severity="secondary" />
    <Divider layout="vertical" />
    <Button label="Save dataset file" 
      icon="pi pi-save" 
      @click="onClickSaveDataset"
      severity="secondary" />

    <div class="save-status">
      <template v-if="store.flag.has_decision_unsaved">
        <span style="color: red;">
          Unsaved changes!
        </span>
      </template>
      <template v-else>
        <i class="fa-regular fa-circle-check"></i>
      </template>
    </div>
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
.file-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 1px solid #7f7f7f;
  border-radius: 0.5rem;
}
.file-label {
  font-size: 0.8rem;
}
.save-status {
  font-size: 0.8rem;
  margin: 0 0.5rem;
}
</style>