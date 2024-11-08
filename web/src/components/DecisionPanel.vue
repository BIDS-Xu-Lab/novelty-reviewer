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
    class="decision-panel">
<div class="header">
    <i class="fa-solid fa-gavel"></i> 
    <b>Decision</b>
</div>

<div class="dp-info">
    <div class="final">
        {{ store.working_item.decision }}
    </div>
    <div class="final-info">
        by {{ store.working_item.decision_by }} 
        @ {{ store.working_item.decision_datetime }}
    </div>
</div>
</div>
</template>

<style scoped>
.decision-panel {
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.dp-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.final {
    font-weight: bold;
    font-size: 1.5rem;
    height: 2rem;
    color: green;
}
.final-info {
    font-style: italic;
    font-size: 0.8rem;
    color: #666;
}
</style>
