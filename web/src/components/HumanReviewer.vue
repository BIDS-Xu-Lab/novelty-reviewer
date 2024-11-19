<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
const store = useDataStore();

function onClickAccept() {
    store.setWorkingItemDecision(
        'human',
        store.working_item.result_human
    );
}
</script>

<template>
<div v-if="store.working_item"
    class="human-reviewer">
<div class="header">
    <i class="fa-solid fa-user-doctor"></i>
    Human Reviewer
</div>

<div class="hr-main">
    <select v-model="store.working_item.result_human"
        class="review-select">
        <option v-for="option in store.taxonomy"
            :value="option.value"
            v-html="option.html">
        </option>
    </select>
    <Button label="Accept"
        icon="pi pi-check" 
        @click="onClickAccept"
        severity="success">
    </Button>
</div>
</div>
</template>

<style scoped>
.header {
    font-weight: bold;
}
.human-reviewer {
    width: 100%;
    padding: 0 1rem;
    height: 6rem;
    overflow-x: hidden;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #ccc;
    margin-bottom: 1rem;
}
.review-select {
    width: 25rem;
    height: 2.5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background-color: #f8f8f8;
    color: #333;
    margin-right: 0.5em;
}
.hr-main {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding: 0 1rem 0 0;
}
.left {
    width: 30rem;
    border-right: 1px solid #ccc;
    padding: 0 1rem 0 0;
    margin: 0 1rem 0 0;
}
.right {
    width: calc(100% - 30rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
</style>
