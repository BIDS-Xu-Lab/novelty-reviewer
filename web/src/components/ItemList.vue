<script setup>
import { ref } from "vue";
import { pubmed } from "../utils/pubmed";
import { useDataStore } from "../DataStore";

const store = useDataStore();

const keyword = ref('');


// make 100 records of this item
for (let i = 0; i < 100; i++) {
    // copy item 0
    let item = JSON.parse(JSON.stringify(store.items[0]));
    item.pmid = item.pmid + i*10;

    if (i%5==0) {item.decision = '';}

    store.items.push(item);
}


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
                    <InputText placeholder="Search" size="small" style="width: 160px;" />
                </IconField>
            </template>

            <template #end> 
                <SplitButton label="Sort" severity='info' size="small" :model="items"></SplitButton>
            </template>
        </Toolbar>
    </div>
    <div class="item-main-list">
        <div v-for="item, item_idx in store.items" :key="item.id"
            :class="{'current-item': store.working_item_idx == item_idx}"
            @click="onClickItem(item)"
            class="item">
            <div class="left">
                <span class="item-idx">
                    {{ item_idx }}
                </span>
                <span v-if="isDecided(item)"
                    class="item-icon item-checked">
                    <i class="fa-solid fa-circle-check"></i>
                </span>
                <span v-else
                    class="item-icon item-unchecked">
                    <i class="fa-regular fa-circle-question"></i>
                </span>
                <div class="item-brief">
                    <span class="item-id">
                        {{ item.pmid }}
                    </span>
                    <span class="item-info">
                        {{ item.decision }} / 
                        {{ item.decision_by }}
                    </span>
                </div>
            </div>
            <div class="right">
                
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
    padding: 10px;
    border-bottom: 1px solid #d4d4d4;
}

.item-main-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid #d4d4d4;
    overflow-y: auto;
}

.item-list-bottom {
    position: relative;
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
    background-color: #d4d4d4;
}
.item:hover .right {
    display: inline-block;
}
.item .left {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.item .right {
    display: none;
    margin-left: auto;
    margin-right: 10px;
}

.item-idx {
    width: 30px;
    color: #d4d4d4;
    display: inline-block;
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
.item-info {
    font-size: smaller;
}
.current-item {
    background-color: #7abdf3;
}
.current-item .item-id {
    font-weight: bold;
}
</style>