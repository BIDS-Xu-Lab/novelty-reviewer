<script setup>
import { onMounted, ref } from "vue";
import { provide } from "vue";
import Footer from "../components/Footer.vue";

import { useDataStore } from "../DataStore";
import NaviMenu from "../components/menus/NaviMenu.vue";
import Papa from "papaparse";

import 'echarts';
import VChart, { THEME_KEY } from 'vue-echarts';
provide(THEME_KEY, 'light');

const store = useDataStore();

function onClickVisFile(vis_file) {
    store.setCurrentVisFile(vis_file);
}

function onClickRemoveVisFile(vis_file) {
    store.removeVisFile(vis_file);
}

// {
//     name: 'Novelty',
//     children: [
//         {
//             name: 'data',
//             value: 10000,
//             children: [
//                 {
//                     name: 'converters',
//                     value: 3322
//                 },
//                 {
//                     name: 'DataUtil',
//                     value: 3322
//                 }
//             ]
//         },
//         {
//             name: 'display',
//             children: [
//                 { name: 'DirtySprite', value: 8833 },
//                 { name: 'LineSprite', value: 1732 },
//                 { name: 'RectSprite', value: 3623 }
//             ]
//         },
//         {
//             name: 'flex',
//             children: [{ name: 'FlareVis', value: 4116 }]
//         },
//         {
//             name: 'query',
//             children: [
//                 { name: 'AggregateExpression', value: 1616 },
//                 { name: 'And', value: 1027 },
//                 { name: 'Arithmetic', value: 3891 },
//                 { name: 'Average', value: 891 },
//             ]
//         },
//         {
//             name: 'scale',
//             children: [
//                 { name: 'IScaleMap', value: 2105 },
//                 { name: 'LinearScale', value: 1316 },
//                 { name: 'LogScale', value: 3151 },
//             ]
//         }
//     ]
// };
const data = { name: 'Novelty', children: [] };

const option = ref({
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
    },
    series: [
    {
        type: 'tree',
        id: 0,
        name: 'tree1',
        data: [data],
        top: '20',
        left: '10%',
        bottom: '20',
        right: '30%',
        symbolSize: 7,
        edgeShape: 'polyline',
        edgeForkPosition: '63%',
        initialTreeDepth: 3,
        lineStyle: {
            width: 2
        },
        label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'left',
            distance: -10,
            // formatter: (params) => {
            //     let label = params.data.name;
            //     if (params.data.value) {
            //         label += ' (' + params.data.value + ')';
            //     }
            //     return label;
            // }
        },
        // leaves: {
        //     label: {
        //         position: 'right',
        //         verticalAlign: 'middle',
        //         align: 'left',
        //         distance: 10,
        //     }
        // },
        emphasis: {
            focus: 'descendant'
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
    }
    ]
});


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

function onClickLoadSampleData() {
    store.loadSampleDataset();
}

const onClickUpdateCharts = () => {
    if (store.taxonomy_tree) {
        option.value.series[0].data = [store.taxonomy_tree];
    }
};

onMounted(() => {
    // load the store.taxonomy_tree if available
    onClickUpdateCharts();
});

</script>

<template>

<NaviMenu />


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
            @click="onClickLoadSampleData()">
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


<div class="main">
<Panel class="h-full mr-2" style="width: 30rem;">
<template #header>
    <div class="w-full flex justify-between">
        <div class="flex">
            <div class="flex-col">
                <div class="text-lg font-bold">
                    <font-awesome-icon :icon="['far', 'folder-open']" />
                    Files
                </div>
                <div class="panel-subtitle text-sm">
                    <b>
                        {{ store.vis_files.length }}
                    </b>
                    Data files
                </div>
            </div>
        </div>

        <div>

        </div>
    </div>
</template>

<div class="flex flex-col"
    :style="{ height: 'calc(100svh - 19rem)', overflowY: 'auto' }">
    <div v-if="store.vis_files.length === 0">
        No files loaded.
    </div>

    <div v-for="vis_file in store.vis_files"
        @click="onClickVisFile(vis_file)"
        :class="{ 'current-vis-file': store.current_vis_file?.name === vis_file.name }"
        class="flex flex-row justify-between items-center border-b cursor-pointer py-2">
        <div class="">
            <div class="flex flex-row items-center">
                <font-awesome-icon :icon="['far', 'file']" class="mr-1" />
                <span class="file-name">
                    {{ vis_file.name }}
                    ({{ vis_file.data.length }})
                </span>
            </div>
        </div>
        <div class="pr-2">
            <Button class="btn-sm"
                severity="secondary"
                size="small"
                v-tooltip.right="'Remove this file from the system.'"
                @click.stop="onClickRemoveVisFile(vis_file)">
                <font-awesome-icon :icon="['fas', 'trash-alt']" />
            </Button>
        </div>
    </div>
</div>
</Panel>


<Tabs value="0" style="width: calc(100% - 30rem);">
<TabList>
    <Tab value="0">
        <font-awesome-icon :icon="['fas', 'chart-diagram']" />
        Taxonomy Structure
    </Tab>
    <Tab value="1">
        <font-awesome-icon :icon="['fas', 'chart-pie']" />
        Distribution
    </Tab>
    <Tab value="2">
        <font-awesome-icon :icon="['fas', 'ranking-star']" />
        Summary
    </Tab>
</TabList>
<TabPanels style="height: calc(100svh - 20rem);">
    <TabPanel value="0">
        <div style="width: 100%; height: calc(100svh - 22rem);">
            <v-chart class="chart" 
                :option="option" 
                autoresize />
        </div>
    </TabPanel>
    <TabPanel value="1">
        <p class="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
            ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
        </p>
    </TabPanel>
    <TabPanel value="2">
        <p class="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
            qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
        </p>
    </TabPanel>
</TabPanels>
</Tabs>


</div>

</template>

<style scoped>
.current-vis-file {
    font-weight: bold;
    background-color: var(--bg-color-selected);
}
.file-name {
    display: inline-block;
    width: 23rem;
    /* hide overflow with dots */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
