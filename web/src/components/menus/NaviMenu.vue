<script setup>
import { ref } from "vue";
import { useDataStore } from "../../DataStore";
import * as fs_helper from "../../utils/fs_helper";
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

        <div class="navi-item ml-2" v-tooltip.bottom="'Review the dataset'" @click="store.gotoPage('')"
            :class="{ 'active-page': store.current_page == '' }">
            <font-awesome-icon :icon="['far', 'rectangle-list']" />
            Review
        </div>

        <div class="navi-item ml-2" v-tooltip.bottom="'Visualize the given datasets'" @click="store.gotoPage('vis')"
            :class="{ 'active-page': store.current_page == 'vis' }">
            <font-awesome-icon :icon="['far', 'chart-bar']" />
            Visualization
        </div>
    </div>



    <div class="navi-right">
        <div class="navi-item !mx-0" v-tooltip.bottom="'Change system settings'" @click="onClickSetting">
            <font-awesome-icon :icon="['fas', 'cog']" class="mr-1" />
            <span>
                Settings
            </span>
        </div>
    </div>
</div>

</template>

<style scoped>
</style>