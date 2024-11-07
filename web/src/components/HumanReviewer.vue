<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
const store = useDataStore();

const taxonomy_list = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);
</script>

<template>
<div v-if="store.working_item"
    class="human-reviewer">
<div class="header">
    <i class="fa-solid fa-user-doctor"></i>
    Human Review Panel
</div>

<div class="oper-bar">
    <select v-model="store.working_item.result_human"
        class="review-select">
        <option v-for="option in store.taxonomy"
            value="option.value">
            {{ option.name }}
        </option>
    </select>


    <Button label="Accept" icon="pi pi-check" severity="success" />
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
    width: 20rem;
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
</style>
