<script setup>
import { ref } from "vue";
import { useDataStore } from "../../DataStore";
import * as fs_helper from "../../utils/fs_helper";
import Papa from "papaparse";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const store = useDataStore();

const files = ref([]);

const parseFile = rawFile => {
    return new Promise(resolve => {
        Papa.parse(
            rawFile,
            {
                delimiter: '\t',
                skipEmptyLines: true,
                header: true,
                worker: true,
                complete: (rs, f) => {
                    resolve(rs.data);
                },
            }
        );
    });
};

async function onVisFilesChange(e) {
    console.log('onChangeDataFiles', e);
    files.value = e.target.files;

    if (files.value.length === 0) {
        store.msg('Please select files to be added to the system.', 'Alert', 'error');
        return;
    }

    // process using SheetJS
    for (let i = 0; i < files.value.length; i++) {
        const file = files.value[i];
        let data = await parseFile(file);
        store.vis_files.push({
            name: file.name,
            data: data
        });
    }

    store.msg(files.value.length + ' files have been added to the system.');

}

function onClickClearVisFiles() {
    files.value = [];
}

function onClickLoadSample() {
}

async function onClickUpdateCharts() {
}

</script>


<template>

<div class="menu">

    <div class="menu-group">

        <div class="menu-group-box ml-3">
            <div class="flex flex-col justify-start max-w-64" style="overflow: hidden;">
                <span class="text-sm">
                    <font-awesome-icon :icon="['far', 'file-excel']" class="mr-1" />
                    Select Files
                </span>
                <input type="file" 
                    ref="fileupload" 
                    accept=".tsv" 
                    @change="onVisFilesChange"
                    v-tooltip.bottom="'Select local files to be loaded for visualization.'" multiple="true" />
            </div>

            <Button text class="menu-button" v-tooltip.bottom="'Clear all the current dataset'"
                @click="onClickClearVisFiles()">
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

            <Button text class="menu-button" 
                v-tooltip.bottom="'Update visualization charts with the current data.'"
                @click="onClickUpdateCharts()">
                <font-awesome-icon :icon="['fas', 'chart-pie']" class="menu-icon" />
                <span>
                    Update Charts
                </span>
            </Button>
        </div>
        <div class="menu-group-title">
            Visualization
        </div>
    </div>


    <div class="menu-group">
        <div class="menu-group-box">

            <Button text class="menu-button" v-tooltip.bottom="'Load samples for demo.'"
                @click="onClickLoadSample()">
                <i class="fa-regular fa-clone menu-icon"></i>
                <span>
                    Sample Data
                </span>
            </Button>

            <Button text class="menu-button" v-tooltip.bottom="'Show the detailed user manual in a new window.'"
                @click="onClickHelp()">
                <font-awesome-icon icon="fa-solid fa-book" class="menu-icon" />
                <span>
                    How-to
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
.file-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border: 1px solid #7f7f7f;
    border-radius: 0.5rem;
    padding: 0.2rem 2rem;
    width: 12rem;

    /* hide the long text as dots */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-zone-loaded {
    border-color: green;
    color: var(--text-color);
}

.file-label {
    font-size: 0.8rem;
}
</style>