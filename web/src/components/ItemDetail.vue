<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
import { pubmed } from "../utils/pubmed";
import { translator } from "../utils/translator";

const store = useDataStore();

const status = ref({
    is_translating: false,
});

function highlightText(text) {
    if (store.flag.enable_highlight) {
        return store.highlight(
            text,
            store.config.keywords,
        )
    }
    return text;
}

async function onClickFetch() {
    console.log('fetching metadata');

    // set the flag
    store.flag.is_fetching_metadata = true;

    let d = await pubmed.esummary(store.working_item.pmid);

    // get title
    let p = d.result[store.working_item.pmid];
    console.log('* summary:', p);

    // set title, journal, year
    let title = p.title;
    let journal = p.source;
    if (p.hasOwnProperty('fulljournalname')) {
        journal = p.fulljournalname;
    }
    let year = p.pubdate;
    // let authors = [];
    // if (p.hasOwnProperty('authors')) {
    //     for (let a of p.authors) {
    //         authors.push(a.name);
    //     }
    // }
    // // join the name with ;
    // store.working_item.authors = authors.join('; ');

    // set information to the working item
    store.working_item.title = title;
    store.working_item.journal = journal;
    store.working_item.year = year;

    // get abstract
    let abstract = await pubmed.efetch(store.working_item.pmid, 'abstract', 'text');

    // need to convert the \n to <br>
    abstract = abstract.replace(/\n/g, '<br>');
    store.working_item.abstract = abstract;
    console.log('* abstract:', abstract);

    // finish
    store.flag.is_fetching_metadata = false;

    // update status
    store.flag.has_data_unsaved = true;
}

async function onClickTranslate() {
    console.log('translating');

    // set the flag
    store.flag.is_translating = true;

    // update the storage
    store.translation[store.working_item.pmid] = {}

    let d = await translator.translate(
        store.working_item.abstract
    );

    console.log('* translation:', d.translatedText);

    store.translation[store.working_item.pmid]['abstract'] = d.translatedText;

    // set the flag
    store.flag.is_translating = false;
}
</script>

<template>
<div v-if="store.working_item_idx != -1"
    class="item-detail">
    <div class="oper-bar">
        <Button 
            severity="secondary"
            label="Fetch Metadata"
            icon="pi pi-download"
            @click="onClickFetch">
        </Button>
        &nbsp;
        <template v-if="store.flag.is_translating">
            Translating... Please wait. 
            <i class="fa-solid fa-spinner fa-spin"></i>
        </template>
        <template v-else>
            <Button label="Translate" 
                @click="onClickTranslate"
                severity="secondary">
                <template #icon>
                    <i class="fa-solid fa-language"></i>
                </template>
            </Button>
        </template>

    </div>

    <div v-if="store.working_item">
        <div v-if="store.flag.is_fetching_metadata">
            Fetching metadata... Please wait. 
            <i class="fa-solid fa-spinner spin"></i>
        </div>
        <div v-if="store.has_working_item_title"
            class="title">
            {{ store.working_item?.title }}
        </div>
        <div v-if="store.has_working_item_title"
            class="info">
            <span class="journal">
                {{ store.working_item?.journal }}
            </span>
            &nbsp;
            <span class="year">
                {{ store.working_item?.year }}
            </span>
            <br>
            <span>
                PMID: {{ store.working_item?.pmid }}
            </span>
        </div>
        <fieldset class="border border-solid border-gray-400 p-2 m-2">
            <legend>Conclusion</legend>
            <div v-if="store.has_working_item_conclusion"
                v-html="highlightText(store.working_item?.conclusion)">
            </div>
            <div v-else>
                No conclusion available.
            </div>
        </fieldset>
        <fieldset class="border border-solid border-gray-400 p-2 m-2">
            <legend>Abstract</legend>
            <div v-if="store.has_working_item_abstract"
                v-html="highlightText(store.working_item?.abstract)">
            </div>
            <div v-else>
                No abstract available.
            </div>
            <template v-if="store.hasWorkingItemTranslation('abstract')">
                <div v-html="store.getWorkingItemTranslation('abstract')" class="translation-text"></div>
            </template>
        </fieldset>
    </div>
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
    height: 3rem;
    padding: 0 0 1rem 0;
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
    padding: 0 1rem;
    margin: 0 0 1rem 0;
    font-style: italic;
}
.journal {
    color: green;
}
.year {
    color: blue;
}
.translation-text {
    border-top: 1px solid #ccc;
    padding: 1rem 0 0 0;
    margin: 1rem 0 0 0;
    font-size: 1rem;
    color: #222222;
}
</style>