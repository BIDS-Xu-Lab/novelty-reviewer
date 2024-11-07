<script setup>
import { useDataStore } from "../DataStore";
const store = useDataStore();

function onClickAccept(model, result) {
    store.working_item.decision = result;
    store.working_item.decision_by = model;
    store.working_item.decision_datetime = new Date().toLocaleString();
}
</script>

<template>
<div v-if="store.working_item_idx != -1"
    class="ai-helper">
    <div class="header">
        <i class="fa-solid fa-robot"></i>
        AI Helper
    </div>
    <div class="oper-bar">
        <Button label="Review by All LLMs" severity="secondary" class="">
            <template #icon>
                <i class="fa-solid fa-bolt"></i>
            </template>
        </Button>

    </div>
    <div class="model-list">
        <fieldset v-for="model in store.ai_models"
            class="model">
            <legend class="model-title">
                <i class="fa-solid fa-cube"></i>
                {{ model.name }} Output
            </legend>

            <div class="model-output">
                <div>
                    {{ store.working_item['result_' + model.id] }}
                    <br>
                    <span class="raw">
                        RAW: {{ store.working_item['result_raw_' + model.id] }}
                    </span>
                </div>

                <div>
                    <Button label="Review" severity="secondary">
                        <template #icon>
                            <i class="fa-solid fa-bolt"></i>
                        </template>
                    </Button>
                    &nbsp;
                    <Button label="Accept" 
                        icon="pi pi-check"
                        @click="onClickAccept('openai', store.working_item['result_' + model.id])"
                        severity="success" />
                </div>
            </div>
            
        </fieldset>

    </div>
</div>
</template>

<style scoped>
.header {
    font-weight: bold;
    height: 3rem;
}
.ai-helper {
    width: 100%;
    height: 100%;
    padding: 0 1rem;
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
.model-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
.model {
    width: 100%;
    margin: 1rem 0;
}
.model-title {
    font-weight: bold;
}
.model-output {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.raw {
    font-size: 0.7em;
    color: #888;
}
</style>