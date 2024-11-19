<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
import { ai_helper } from "../utils/ai_helper";

const store = useDataStore();

const status = ref({});

const isReviewing = (model_id) => {
    if (status.value.hasOwnProperty(model_id)) {
        return status.value[model_id] == 'reviewing';
    }

    return false;
}

async function onClickAccept(model_id, result) {
    store.setWorkingItemDecision(
        model_id,
        result
    );
}

async function onClickReview(model_id) {
    // set flag
    status.value[model_id] = 'reviewing';

    console.log(`* AI Helper [${model_id}] is thinking ...`);

    // first generate the prompot
    let question = ai_helper.generateQuestionFromTemplate(
        store.llm_prompt_template,
        store.working_item
    );

    // then try to ask question
    try {
        
        let d = await ai_helper.ask(
            question,
            store.config.ai_models[model_id]
        );

        console.log(`* AI Helper [${model_id}]`, d);

        // update working item
        store.setWorkingItemResult(model_id, d);
    } catch (err) {
        // 
    }

    status.value[model_id] = 'reviewed';
}

async function onClickReviewAll() {
    for (let model_id in store.config.ai_models) {
        let model = store.config.ai_models[model_id];
        onClickReview(model.id);
    }
}

function isAllReviewed() {
    for (let model_id in store.config.ai_models) {
        let model = store.config.ai_models[model_id];
        if (isReviewing(model.id)) {
            return false;
        }
    }

    return true;
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
        <template v-if="isAllReviewed()">
            <Button label="Review All" 
                @click="onClickReviewAll"
                severity="secondary">
                <template #icon>
                    <i class="fa-solid fa-bolt"></i>
                </template>
            </Button>
        </template>
        <template v-else>
            Reviewing ... 
            <i class="fa-solid fa-spinner fa-spin"></i>
        </template>

    </div>
    <div class="model-list">
        <fieldset v-for="model, model_id in store.config.ai_models"
            class="model border border-solid border-gray-400 p-2 m-2">
            <legend class="model-title">
                <i class="fa-solid fa-cube"></i>
                {{ model.name }} Output
            </legend>

            <div class="model-output">
                <div class="model-output-detail">
                    <div class="category">
                        {{ store.working_item['result_' + model.id] }}
                    </div>
                    <div class="raw">
                        Reason: {{ store.working_item['result_reason_' + model.id] }}
                    </div>
                </div>

                <div class="flex items-center">
                    <template v-if="isReviewing(model.id)">
                        <div class="mr-2">
                            Reviewing
                            <i class="fa-solid fa-spinner fa-spin"></i>
                        </div>
                    </template>
                    <template v-else>
                    <Button label="Review" 
                        @click="onClickReview(model.id)"
                        class="mr-2"
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
.model-output-detail {
    max-width: calc(100% - 200px);
}
.category {
    font-weight: bold;
}
.raw {
    font-size: 0.7em;
    color: #3d3d3d;
}
</style>