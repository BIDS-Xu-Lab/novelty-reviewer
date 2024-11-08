<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
import { ai_helper } from "../utils/ai_helper";

const store = useDataStore();

const status = ref({});

const isReviewing = (model) => {
    if (status.value.hasOwnProperty(model)) {
        return status.value[model] == 'reviewing';
    }

    return false;
}

async function onClickAccept(model, result) {
    store.setWorkingItemDecision(
        model,
        result
    );
}

async function onClickReview(model) {
    status.value[model] = 'reviewing';

    // set flag
    store.flag.is_asking_ai = true;

    console.log(`* AI Helper [${model}] is thinking ...`);
    let d = await ai_helper.ask(
        `I will provide a list of concepts, please randomly select one of them to echo for now: 

- New tool
- New gene
- New approach
`,
        model
    );

    console.log(`* AI Helper [${model}]`, d);
    console.log(`* AI Helper [${model}]`, d.choices[0].message.content);

    let result_ai = d.choices[0].message.content;
    
    // update working item
    store.setWorkingItemResult(model, result_ai);

    status.value[model] = 'reviewed';
}

async function onClickReviewAll() {
    for (let model of store.config.ai_models) {
        onClickReview(model.id);
    }
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
        <Button label="Review by All AI Models" 
            @click="onClickReviewAll"
            severity="secondary" 
            class="">
            <template #icon>
                <i class="fa-solid fa-bolt"></i>
            </template>
        </Button>

    </div>
    <div class="model-list">
        <fieldset v-for="model in store.config.ai_models"
            class="model border border-solid border-gray-400 p-2 m-2">
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
                    <template v-if="isReviewing(model.id)">
                        Reviewing ...
                    </template>
                    <template v-else>
                    <Button label="Review" 
                        @click="onClickReview(model.id)"
                        severity="secondary">
                        <template #icon>
                            <i class="fa-solid fa-bolt"></i>
                        </template>
                    </Button>
                    </template>
                    
                    <Button label="Accept" 
                        icon="pi pi-check"
                        @click="onClickAccept(model.id, store.working_item['result_' + model.id])"
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