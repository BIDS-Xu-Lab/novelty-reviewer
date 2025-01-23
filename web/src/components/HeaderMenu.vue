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

async function onPromptFileChange(e) {
  // check if taxonomy are loaded
  if (!store.taxonomy_file) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please load the taxonomy file first',
      life: 3000
    });
    return;
  }

  let { fh, file } = await fs_helper.fsOpenFile({
    types: [{
          description: 'Text File',
          accept: { 'text/plain': ['.txt'] }
    }],
    multiple: false,
  });

  let text = await file.text();

  // update the taxonomy list
  store.prompt_file = fh;
  store.setPromptByText(text)
}

async function onDatasetFileChange(e) {
  // check if prompt and taxonomy are loaded
  if (!store.prompt_file || !store.taxonomy_file) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please load the prompt file and taxonomy file first',
      life: 3000
    });
    return;
  }

  // ok, let's load the dataset file
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
  console.log('* saving dataset file ' + store.dataset_file.name);
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

  store.flag.has_data_unsaved = false;
  console.log('* saved to ' + store.dataset_file.name);
  store.msg('Saved to ' + store.dataset_file.name);
}


async function onClickClearDataset() {
  // if items are not empty, ask for confirmation
  if (store.items.length > 0) {
    let confirm = window.confirm('Are you sure to clear the dataset?');
    if (!confirm) {
      return;
    }
  }
  store.items = [];
  store.dataset_file = null;
  store.flag.has_data_unsaved = false;
  store.working_item_idx = -1;
}

function onClickSetting() {
  store.flag.show_setting_panel = !store.flag.show_setting_panel;
}

function onClickLoadSample() {
  store.loadSampleDataset();
}

function onClickHelp() {
  // open a new tab to wiki page
  window.open('https://github.com/BIDS-Xu-Lab/novelty-reviewer/wiki', '_blank');
}

</script>


<template>
  <div id="navi">
    <div class="navi-left prevent-select">
      <!-- <div class="navi-item home" @click="store.gotoPage('')">
        <font-awesome-icon :icon="['fa', 'home']" />
        Home
      </div> -->

      <div class="navi-item ml-2" 
        v-tooltip.bottom="'Review the dataset'" 
        @click="store.gotoPage('/')"
        :class="{'active-page': store.current_page==''}">
        <font-awesome-icon :icon="['far', 'rectangle-list']" />
        Review
      </div>
    </div>

    <div class="navi-right">


      <div class="navi-item !mx-0"
            v-tooltip.bottom="'Change system settings'"
            @click="onClickSetting">
            <font-awesome-icon :icon="['fas', 'cog']" class="mr-1" />
            <span>
                Settings
            </span>
        </div>

    </div>
  </div>

  <div class="menu">

    <div class="menu-group">

      <div class="menu-group-box">
        <div class="flex flex-col mr-2 px-4">
          <div class="oper-item">
            <label class="file-label">
              <i class="fa-regular fa-clipboard"></i>
              Taxonomy File
              <a target="_blank" 
                href="./sample/taxonomy.txt" 
                title="Download example taxonomy">
                <i class="fa-regular fa-question-circle"></i>
              </a>
            </label>
            <div class="file-zone" 
              v-tooltip.bottom="'Load the taxonomy file for review'" 
              :class="{ 'file-zone-loaded': store.taxonomy_file }" @click="onTaxonomyFileChange">
              <template v-if="store.taxonomy_file">
                {{ store.taxonomy_file.name }}
              </template>
              <template v-else>
                Load the taxonomy file
              </template>
            </div>
          </div>
        </div>


        <div class="flex flex-col mr-2 px-4">
          <div class="oper-item">

            <label class="file-label">
              <i class="fa-regular fa-file-code"></i>
              Prompt Template File
              <a target="_blank" href="./sample/prompt.txt" title="Download example prompt">
                <i class="fa-regular fa-question-circle"></i>
              </a>
            </label>
            <div class="file-zone" 
              v-tooltip.bottom="'Load the prompt file for LLMs'" 
              :class="{ 'file-zone-loaded': store.prompt_file }" 
              @click="onPromptFileChange">
              <template v-if="store.prompt_file">
                {{ store.prompt_file.name }}
              </template>
              <template v-else>
                Load the prompt file
              </template>
            </div>
          </div>
        </div>

        <div class="flex flex-col mr-2 px-4">
          <div class="oper-item">

            <label class="file-label">
              <i class="fa-regular fa-file-lines"></i>
              Dataset File
              <a target="_blank" href="./sample/dataset.tsv" title="Download example dataset">
                <i class="fa-regular fa-question-circle"></i>
              </a>
            </label>
            <div class="file-zone" 
              v-tooltip.bottom="'Load the dataset file containing the literature data'" 
              :class="{ 'file-zone-loaded': store.dataset_file }" 
              @click="onDatasetFileChange">
              <template v-if="store.dataset_file">
                {{ store.dataset_file.name }}
              </template>
              <template v-else>
                Load the dataset file
              </template>
            </div>
          </div>
        </div>



        <Button text
            class="menu-button"
            v-tooltip.bottom="'Clear all the current dataset'"
            @click="onClickClearDataset">
            <font-awesome-icon :icon="['far', 'trash-can']" class="menu-icon" />
            <span>
                Clear
            </span>
        </Button>

      </div>
      <div class="menu-group-title">
        Files
      </div>
    </div>


    <div class="menu-group">
        <div class="menu-group-box">
          <div v-tooltip.bottom="'Current status of the dataset file'"
            class="flex flex-col justify-center mr-2">
              <template v-if="store.flag.has_data_unsaved">
                <div class="text-3xl text-center" style="color: red;">
                  <i class="fa-solid fa-times-circle"></i>
                </div>
                <div>
                  Unsaved
                </div>
              </template>
              <template v-else-if="!store.dataset_file">
                <div class="text-3xl text-center" style="margin-bottom: 2px">
                  <i class="fa-regular fa-file"></i>
                </div>
                <div>
                  No file
                </div>
              </template>
              <template v-else>
                <div class="text-3xl text-center" style="color: green; margin-bottom: 2px">
                  <i class="fa-regular fa-circle-check"></i>
                </div>
                <div>
                  Saved
                </div>
              </template>
          </div>

          <Button text
              class="menu-button"
              v-tooltip.bottom="'Save the current review results'"
              @click="onClickSaveDataset">
              <font-awesome-icon :icon="['far', 'floppy-disk']" class="menu-icon" />
              <span>
                  Save Dataset File
              </span>
          </Button>


            

      <div class="save-status">
        
      </div>


        </div>
        <div class="menu-group-title">
            File Operations
        </div>
    </div>



    <div class="menu-group">
        <div class="menu-group-box">

            <Button text
                class="menu-button"
                v-tooltip.bottom="'Load samples for demo.'"
                @click="onClickLoadSample()">
                <font-awesome-icon :icon="['fas', 'users-between-lines']" class="menu-icon" />
                <span>
                    Sample Data
                </span>
            </Button>

            <Button text
                class="menu-button"
                v-tooltip.bottom="'Show the detailed user manual in a new window.'"
                @click="onClickHelp()">
                <font-awesome-icon icon="fa-solid fa-book" class="menu-icon" />
                <span>
                    How-to Guide
                </span>
            </Button>
        </div>
        <div class="menu-group-title">
            Help
        </div>
    </div>


  </div>

</template>

<style scoped>
.home {
    color: white;
    background: #7f1616;
}
.home:hover {
    background: #7f1616;
}
.file-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 1px solid #7f7f7f;
  border-radius: 0.5rem;
  height: 2rem;
  line-height: 2rem;
  padding: 0 2rem;
}
.file-zone-loaded {
  border-color: green;
  color: var(--text-color);
}
.file-label {
  font-size: 0.8rem;
}
</style>