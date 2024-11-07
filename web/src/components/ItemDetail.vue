<script setup>
import { useDataStore } from "../DataStore";
const store = useDataStore();

function highlightText(text) {
    if (store.flag.enable_highlight) {
        return store.highlight(
            text,
            store.keywords,
        )
    }
    return text;
}
</script>

<template>
<div v-if="store.working_item_idx != -1"
    class="item-detail">
    <div class="oper-bar">
        <Button label="Translate" severity="secondary">
            <template #icon>
                <i class="fa-solid fa-language"></i>
            </template>
        </Button>
    </div>

    <div class="title">
        {{ store.working_item?.title }}
    </div>
    <div class="info">
        <span class="journal">
            {{ store.working_item?.journal }}
        </span>
        <span class="year">
            {{ store.working_item?.year }}
        </span>
        <span>
            PMID: {{ store.working_item?.pmid }}
        </span>
    </div>
    <fieldset>
        <legend>Abstract</legend>
        <div v-html="highlightText(store.working_item?.abstract)">
        </div>
    </fieldset>
    <fieldset>
        <legend>Conclusion</legend>
        <div v-html="highlightText(store.working_item?.conclusion)">
        </div>
    </fieldset>
</div>
</template>

<style scoped>
.item-detail {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
.oper-bar {
    height: 2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.title {
    font-size: 1.5rem;
    font-weight: bold;
    padding: 10px;
}
.info {
    padding: 0 10px;
    font-style: italic;
}
.journal {
    color: green;
}
.year {
    color: blue;
}
</style>