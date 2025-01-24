<script setup>
import { onMounted, ref } from "vue";
import { provide } from "vue";
import VisMenu from "../components/menus/VisMenu.vue";
import Footer from "../components/Footer.vue";

import { useDataStore } from "../DataStore";
import NaviMenu from "../components/menus/NaviMenu.vue";

import 'echarts';
import VChart, { THEME_KEY } from 'vue-echarts';
provide(THEME_KEY, 'light');

const store = useDataStore();

onMounted(() => {
    store.loadSettingsFromLocalStorage();
});

function onClickVisFile(vis_file) {
    store.setCurrentVisFile(vis_file);
}

function onClickRemoveVisFile(vis_file) {
    store.removeVisFile(vis_file);
}

const data = {
    name: 'Novelty',
    children: [
        {
            name: 'data',
            value: 10000,
            children: [
                {
                    name: 'converters',
                    value: 3322
                },
                {
                    name: 'DataUtil',
                    value: 3322
                }
            ]
        },
        {
            name: 'display',
            children: [
                { name: 'DirtySprite', value: 8833 },
                { name: 'LineSprite', value: 1732 },
                { name: 'RectSprite', value: 3623 }
            ]
        },
        {
            name: 'flex',
            children: [{ name: 'FlareVis', value: 4116 }]
        },
        {
            name: 'query',
            children: [
                { name: 'AggregateExpression', value: 1616 },
                { name: 'And', value: 1027 },
                { name: 'Arithmetic', value: 3891 },
                { name: 'Average', value: 891 },
                { name: 'BinaryExpression', value: 2893 },
                { name: 'Comparison', value: 5103 },
                { name: 'IsA', value: 2039 },
                { name: 'Literal', value: 1214 },
                { name: 'Match', value: 3748 },
                { name: 'Maximum', value: 843 },
                { name: 'Minimum', value: 843 },
                { name: 'Not', value: 1554 },
                { name: 'Or', value: 970 },
                { name: 'Query', value: 13896 },
                { name: 'Range', value: 1594 },
                { name: 'StringUtil', value: 4130 },
                { name: 'Sum', value: 791 },
                { name: 'Variable', value: 1124 },
                { name: 'Variance', value: 1876 },
                { name: 'Xor', value: 1101 }
            ]
        },
        {
            name: 'scale',
            children: [
                { name: 'IScaleMap', value: 2105 },
                { name: 'LinearScale', value: 1316 },
                { name: 'LogScale', value: 3151 },
                { name: 'OrdinalScale', value: 3770 },
                { name: 'QuantileScale', value: 2435 },
                { name: 'QuantitativeScale', value: 4839 },
                { name: 'RootScale', value: 1756 },
                { name: 'Scale', value: 4268 },
                { name: 'ScaleType', value: 1821 },
                { name: 'TimeScale', value: 5833 }
            ]
        }
    ]
};

const option = ref({
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
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
                backgroundColor: '#fff',
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                formatter: (params) => {
                    let label = params.data.name;
                    if (params.data.value) {
                        label += ' (' + params.data.value + ')';
                    }
                    return label;
                }
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },
            emphasis: {
                focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
        }
    ]
});
</script>

<template>

<NaviMenu />
<VisMenu />

<div class="main">
<Panel class="h-full mr-2"
    style="width: 30rem;">
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

<Panel class="mr-2" style="width: 40rem;">

<template #header>
<div class="w-full flex justify-between">
    <div class="flex">
        <div class="flex-col">
            <div class="text-lg font-bold">
                <font-awesome-icon :icon="['far', 'folder-open']" />
                Taxonomy
            </div>
            <div class="panel-subtitle text-sm">
                <b>
                    {{ store.vis_files.length }}
                </b>
                Terms
            </div>
        </div>
    </div>

    <div>

    </div>
</div>
</template>

    <div style="width: 100%; height: calc(100svh - 18rem);">
        <v-chart class="chart" 
            :option="option" 
            autoresize />
    </div>
</Panel>

</div>

<Footer />

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
