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
    if (store.config.features.auto_highlight.enabled) {
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

    // update the endpoint
    translator.endpoint = store.config.translation.endpoint;

    try {
        let dc = await translator.translate(
            "" + store.working_item.conclusion
        );

        console.log('* translation:', dc.translatedText);

        store.translation[store.working_item.pmid]['conclusion'] = dc.translatedText;
    } catch (e) {
        store.msg('Translation service is not available. Please setup the translation service first.', 'error');
    }

    try {
        let d = await translator.translate(
            store.working_item.abstract
        );

        console.log('* translation:', d.translatedText);

        store.translation[store.working_item.pmid]['abstract'] = d.translatedText;

    } catch (e) {
        store.msg('Translation service is not available. Please setup the translation service first.', 'error');
    }
    // set the flag
    store.flag.is_translating = false;
}
</script>

<template>
<Panel class="flex flex-col w-2/5 mr-2">

<template #header>
    <div class="w-full flex justify-between">
        <div class="flex items-center gap-2">
            <div class="flex-col items-center">
                <div class="text-lg font-bold">
                    <font-awesome-icon :icon="['far', 'file']" />
                    Paper Detail
                </div>
                <div class="panel-subtitle text-sm">
                    <template v-if="store.working_item">
                        <i class="fa-regular fa-file-lines"></i>
                        {{ store.working_item?.pmid }}
                    </template>
                    <template v-else>
                        No paper selected
                    </template>
                </div>
            </div>

            <div class="flex items-center">
                <Button size="normal"
                    severity="secondary"
                    label="Fetch Metadata"
                    icon="pi pi-download"
                    v-tooltip.bottom="'Fetch metadata from PubMed'"
                    class="mr-2"
                    @click="onClickFetch">
                </Button>
                
                <template v-if="store.flag.is_translating">
                    Translating... Please wait. 
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </template>
                <template v-else>
                    <Button label="Translate" 
                        size="normal"
                        v-tooltip.bottom="'Translate the conclusion and abstract'"
                        @click="onClickTranslate"
                        severity="secondary">
                        <template #icon>
                            <i class="fa-solid fa-language"></i>
                        </template>
                    </Button>
                </template>
            </div>
        </div>
        <div>

        </div>
    </div>
</template>

<div class="flex"
    style="height: calc(100svh - 18.5rem); overflow-y: auto;">
    
    <div v-if="store.working_item_idx != -1 && store.working_item">
        <div v-if="store.flag.is_fetching_metadata">
            Fetching metadata... Please wait. 
            <i class="fa-solid fa-spinner spin"></i>
        </div>
        <div v-if="store.has_working_item_title"
            class="mb-2">
            <p class="title">
                {{ store.working_item?.title }}
            </p>
            <p class="info">
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
            </p>
        </div>
        <div v-else
            class="mb-2">
            No metadata available. You can fetch the metadata by clicking the "Fetch Metadata" button.
        </div>

        <Fieldset class="w-full p-2">
            <template #legend>
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-align-left"></i>
                    Conclusion
                </div>
            </template>
            <div v-if="store.has_working_item_conclusion"
                v-html="highlightText(store.working_item?.conclusion)">
            </div>
            <div v-else>
                No conclusion available.
            </div>
            <template v-if="store.hasWorkingItemTranslation('conclusion')">
                <div v-html="store.getWorkingItemTranslation('conclusion')" class="translation-text"></div>
            </template>
        </Fieldset>

        <Fieldset class="p-2">
            <template #legend>
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-align-left"></i>
                    Abstract
                </div>
            </template>

            <div v-if="store.has_working_item_abstract"
                v-html="highlightText(store.working_item?.abstract)">
            </div>
            <div v-else>
                No abstract available.
            </div>
            <template v-if="store.hasWorkingItemTranslation('abstract')">
                <div v-html="store.getWorkingItemTranslation('abstract')" class="translation-text"></div>
            </template>
        </Fieldset>
    </div>
</div>
</Panel>
</template>

<style scoped>
.oper-bar {
    height: 3rem;
    padding: 0 0 1rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.title {
    font-size: 1.5rem;
    line-height: 1.6rem;
    font-weight: bold;
}
.info {
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
    font-size: 1.2rem;
}
</style>