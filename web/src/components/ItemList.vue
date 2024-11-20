<script setup>
import { ref } from "vue";
import { pubmed } from "../utils/pubmed";
import { useDataStore } from "../DataStore";

const store = useDataStore();

const keyword = ref('');


// // make 100 records of this item
// for (let i = 0; i < 100; i++) {
//     // copy item 0
//     let item = JSON.parse(JSON.stringify(store.items[0]));
//     item.pmid = item.pmid + i*10;

//     if (i%5==0) {item.decision = '';}

//     store.items.push(item);
// }


function isDecided(item) {
    if (item.decision == '' || item.decision == null || item.decision == undefined) {
        return false;
    } else {
        return true;
    }
}

async function onClickItem(item) {
    // set the working item
    store.working_item_idx = store.items.indexOf(item);
    console.log(store.working_item_idx, store.working_item);

    // get data using pubmed
    // let rst = await pubmed.efetch(item.pmid);
    // console.log(rst);
}

const items = ref([
    {
        label: 'By Reviewed Status',
        icon: 'pi pi-sort-alt'
    },
    {
        label: 'By PMID (asc)',
        icon: 'pi pi-sort-numeric-down'
    },
    {
        label: 'By PMID (desc)',
        icon: 'pi pi-sort-numeric-down-alt'
    }
])
</script>


<template>

<div class="item-list">
    <div class="item-list-top">
        <Toolbar style="width: 100%; border: 0; background: transparent;">
            <template #start>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="store.filter_keyword"
                        placeholder="Filter by keyword" size="small" style="width: 160px;" />
                </IconField>
            </template>

            <template #end> 
                <!-- <SplitButton 
                    label="Sort" 
                    severity='secondary' 
                    size="small" :model="items">
                </SplitButton> -->
            </template>
        </Toolbar>
    </div>
    <div class="item-main-list">
        <div v-for="item, item_idx in store.filterred_items" :key="item.id"
            :class="{'current-item': store.working_item_idx == item_idx}"
            @click="onClickItem(item)"
            class="item">
            <div class="left">
                <span class="item-idx">
                    <template v-if="store.hasMetadata(item)">
                        <i class="fa-regular fa-file-lines"></i>
                    </template>
                </span>
                <span v-if="isDecided(item)"
                    class="item-icon item-checked">
                    <i class="fa-solid fa-circle-check"></i>
                </span>
                <span v-else
                    class="item-icon item-unchecked">
                    <i class="fa-regular fa-circle-question"></i>
                </span>
            </div>
            <div class="right">
                <div class="item-brief">
                    <div class="item-main">
                        <div class="item-id mr-1">
                            {{ item.pmid }}
                        </div>
                        <div class="item-info">
                            {{ item.decision_by }}
                        </div>
                    </div>
                    <div class="item-info">
                        {{ item.decision }}
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <div class="item-list-bottom">
        Pager
    </div>
</div>

</template>


<style scoped>

.item-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.item-list-top {
    position: relative;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    border-bottom: 1px solid #d4d4d4;
}

.item-main-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    /* border-bottom: 1px solid #d4d4d4; */
    overflow-y: auto;
}

.item-list-bottom {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #d4d4d4;
}

.item {
    width: 100%;
    border-bottom: 1px solid #d4d4d4;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.item:hover {
    background-color: #eaeaea;
}
.item:hover .right {
    display: inline-block;
}
.item .left {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.item-idx {
    width: 30px;
    color: #d4d4d4;
    display: inline-block;
    text-align: center;
}
.item-icon {
    width: 20px;
    margin: 0 5px;
    display: inline-block;
}
.item-checked {
    color: green;
}
.item-unchecked {
    color: #494949;
}
.item-brief {
    display: flex;
    flex-direction: column;
}
.item-main {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.item-info {
    font-size: smaller;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    line-height: 0.9rem;
}
.current-item {
    background-color: #7abdf3;
}
.current-item .item-id {
    font-weight: bold;
}
@media (prefers-color-scheme: dark) {
    .item:hover {
        background-color: #494949;
    }
    .current-item {
        background-color: #295070;
    }
}
</style>