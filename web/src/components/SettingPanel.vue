<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
import dayjs from "dayjs";
import { fsOpenFile } from "../utils/fs_helper";

const store = useDataStore();

function onClickClose() {
    store.flag.show_setting_panel = false;
}

const keywords = ref('');

function onClickRefreshKeywords() {
    keywords.value = store.keywords.join('\n');
}

function onClickAddKeywords () {
    // ask for a new keyword
    let token = prompt('Please enter a new keyword');
    if (token == null) {
        return;
    }

    // search if this token is already in the list
    if (store.hasKeywordInSettings(token)) {
        store.msg('This keyword is already in the list');
        return;
    }
    
    // add this token to store
    store.config.keywords.push(token);

    // save to localstorage
    store.saveSettingsToLocalStorage();

    store.msg('Added a new keyword to the list');
}

function onClickDeleteKeyword(idx) {
    store.removeKeywordFromSettings(idx);

    // save to localstorage
    store.saveSettingsToLocalStorage();

    store.msg('Deleted a keyword from the list');
}

function onClickSave() {
    // just save everything to localstorage
    localStorage.setItem(
        "config",
        JSON.stringify(store.config)
    )
    store.msg('Saved all settings to your local environment');
}

async function onClickImportSetting() {
    let { fh, file } = await fsOpenFile({
        types: [{
            description: 'Config JSON file',
            accept: { 'application/json': ['.json'] }
        }],
        multiple: false,
    });

    let text = await file.text();

    // parse the content
    let cfg = null;
    try {
        cfg = JSON.parse(text);
    } catch (e) {
        store.msg(`Failed to parse the content of the file: ${e}`, 'error');
        return;
    }

    store.updateSettingsByJSON(cfg);

    store.msg('Imported settings from the file and updated local settings');

    // save to localstorage
    store.saveSettingsToLocalStorage();
}

function onClickExportSetting() {
    let blob = new Blob(
        [JSON.stringify(store.config, null, 2)],
        { type: 'application/json' }
    );
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    let d = dayjs().format('YYYYMMDD-HHmmss');
    a.download = `config-${d}.json`;
    a.click();
}

function onClickReset() {
    // let user to confirm
    let confirm = window.confirm('Are you sure to reset all settings to default?');
    if (!confirm) {
        return;
    }
    store.clearSettingsFromLocalStorage();
    store.msg('Reset all settings to default');
}

function onClickResetSystemPrompt(model_id) {
    store.config.ai_models[model_id].system_prompt = "You are a helpful assistant.";
}

function onClickResetTranslationEndpoint() {
    store.config.translation.endpoint = "http://127.0.0.1:5000/translate";
}

const menu = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Import',
                icon: 'pi pi-upload',
                command: onClickImportSetting
            },
            {
                label: 'Export',
                icon: 'pi pi-download',
                command: onClickExportSetting
            }
        ]
    },
    {
        label: 'Others',
        items: [
            {
                label: 'Reset to default',
                icon: 'pi pi-refresh',
                command: onClickReset
            },
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

</script>

<template>
<div v-if="store.flag.show_setting_panel"
    class="setting-panel">
    <div class="flex flex-row justify-between py-2">
        <div class="title">
            <i class="fa fa-cog"></i>
            Settings
        </div>
        <div class="opers flex flex-row">
            <Button icon="pi pi-save"
                label="Save settings"
                @click="onClickSave"
                size="small"
                class="mr-2"
                severity="secondary" />

            <Button type="button" 
                class="mr-2"
                size="small"
                severity="secondary"
                icon="pi pi-ellipsis-v" 
                @click="toggle" aria-haspopup="true" 
                aria-controls="overlay_menu" />

            <Menu ref="menu" id="overlay_menu" 
                :model="items" 
                :popup="true" />

            <Button type="button" 
                class="mr-2"
                size="small"
                severity="secondary"
                icon="pi pi-times" 
                @click="onClickClose" />
        </div>
    </div>

    <div>
        <Tabs value="0">
            <TabList>
                <Tab value="0">General</Tab>
                <Tab value="chatbot">Chatbot</Tab>
                <Tab value="taxonomy">Taxonomy</Tab>
                <Tab value="prompt">Prompt</Tab>
                <Tab value="2">Other</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="taxonomy">
                    <template v-if="store.taxonomy_file == null">
                        <p>
                            Taxonomy file is not loaded yet.
                        </p>
                    </template>
                    <template v-else>
                    <div style="height: 100%; max-height: calc(100vh - 18rem); overflow-y: auto;">
                        <p v-for="option in store.taxonomy"
                            v-html="option.html"
                            class="m-0">
                        </p>
                    </div>
                    </template>

                </TabPanel>


                <TabPanel value="prompt">
                    <template v-if="store.prompt_file == null">
                        <p>
                            Prompt file is not loaded yet.
                        </p>
                    </template>
                    <template v-else>
                        <p class="mb-1 pb-1 border-b">
                            ATTENTION: This is a template for the prompt. Any change here will affect the chatbot directly.
                        </p>
                        <textarea class="w-full p-1"
                            style="height: calc(100vh - 22rem);"
                            v-model="store.llm_prompt_template"></textarea>
                    </template>

                </TabPanel>


                <TabPanel value="chatbot">
                    <template v-for="model in store.config.ai_models">
                    <div class="mb-4">
                        <p class="m-0 section">
                            <i class="fa fa-cube"></i>
                            {{ model.name }}
                        </p>

                        <div class="label">
                            Endpoint
                        </div>
                        <div class="mb-2">
                            <InputText v-model="model.endpoint" 
                                class="w-full"/>
                        </div>

                        <div class="label">
                            Model Name
                        </div>
                        <div class="mb-2">
                            <InputText v-model="model.model_name" 
                                class="w-full"/>
                        </div>

                        <div class="label w-full">
                            API Key
                        </div>
                        <div class="mb-3">
                            <InputText v-model="model.api_key" 
                                class="w-full"/>
                        </div>

                        <div class="label">
                            Temperature (0-2)
                        </div>
                        <div class="mb-2">
                            <InputNumber v-model.number="model.temperature" 
                                :min="0" :max="2"
                                :minFractionDigits="2"
                                class="w-full"/>
                        </div>

                        <div class="label">
                            System Prompt 
                            (
                            <span class="cursor-pointer"
                                @click="onClickResetSystemPrompt(model.id)">
                                reset to default
                            </span>
                            )
                        </div>
                        <div class="mb-2">
                            <InputText v-model="model.system_prompt" 
                                class="w-full"/>
                        </div>
                    </div>
                    </template>

                </TabPanel>

                <TabPanel value="0">
                    <p class="m-0 section">
                        Hightlight Keywords
                    </p>

                    <div class="my-2">
                        <Button @click="onClickAddKeywords"
                            icon="pi pi-plus"
                            size="small"
                            severity="secondary"
                            label="Add keyword">
                        </Button>
                    </div>
                    
                    <ul>
                        <li v-for="keyword, keyword_index in store.config.keywords"
                            class="keyword">
                            <div v-if="typeof(keyword) == 'object'">
                                <span class="px-1 mr-1"
                                    :style="'background:' + keyword.bgcolor">
                                    <i class="fa fa-tag"></i>
                                </span>
                                <span>
                                    {{ keyword.token }}
                                </span>
                            </div>
                            <div v-else>
                                <span class="px-1 mr-1"
                                    :style="'background: yellow'">
                                    <i class="fa fa-tag"></i>
                                </span>
                                <span>
                                    {{ keyword }}
                                </span>
                            </div>

                            <div>
                                <span @click="onClickDeleteKeyword(keyword_index)"
                                    title="Delete this keyword"
                                    class="text-red-100 cursor-pointer delete-link">
                                    <i class="fa fa-trash"></i>
                                </span>
                            </div>
                        </li>
                    </ul>

                </TabPanel>




                <TabPanel value="2">
                    <div class="mb-3">
                        <p class="m-0 section">
                            <i class="fa fa-save"></i>
                            Auto highlight keywords
                        </p>
                        
                        <div>
                            <Checkbox v-model="store.config.features.auto_highlight.enabled" 
                                inputId="auto_highlight" 
                                binary />
                            <label for="auto_highlight"> Highlight keywords in title, conclusion, and abstract. </label>
                        </div>
                    </div>

                    <div class="mb-3">
                        <p class="m-0 section">
                            <i class="fa fa-save"></i>
                            Auto Save
                        </p>
                        
                        <div>
                            TBD
                        </div>
                    </div>

                    <div class="mb-3">
                        <p class="m-0 section">
                            <i class="fa fa-server"></i>
                            Translation Server
                        </p>

                        <div class="mb-3">
                            <p>
                                Endpoint
                                (
                                    <span class="cursor-pointer" 
                                        @click="onClickResetTranslationEndpoint">
                                        Reset to default
                                    </span>
                                )
                            </p>
                            <InputText v-model="store.config.translation.endpoint" 
                                class="w-full"/>
                        </div>
                    </div>
                    <!-- <Checkbox v-model="store.flag.enable_auto_save" 
                        inputId="ingredient1" 
                        binary />
                    <label for="ingredient1"> Save dataset file when made any changes </label> -->
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</div>
</template>

<style scoped>
.setting-panel {
    position: absolute;
    width: 500px;
    height: calc(100% - 8rem);
    right: 0;
    top: 4rem;
    background-color: var(--general-bg-color);
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    z-index: 100;
}

.title {
    font-weight: bold;
    padding: 0 1rem;
}
.section {
    font-weight: bold;
}
.label {
    font-size: small;
}
.keyword {
    padding: 0.2rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.keyword:hover {
    background-color: var(--general-bg-color);
    font-weight: bold;
}
.delete-link {
    font-size: small;
}
.delete-link:hover {
    color: red;
}
</style>