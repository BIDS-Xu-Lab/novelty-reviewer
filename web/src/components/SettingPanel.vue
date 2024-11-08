<script setup>
import { ref } from "vue";
import { useDataStore } from "../DataStore";
const store = useDataStore();

function onClickClose() {
    store.flag.show_setting_panel = false;
}

const keywords = ref('');

function onClickRefreshKeywords() {
    keywords.value = store.keywords.join('\n');
}

function onClickSaveKeywords() {
    let _v = keywords.value.trim();
    store.keywords = _v.split('\n');

    // save into the local storage
    localStorage.setItem('keywords', JSON.stringify(store.keywords));

    store.msg('Updated keywords');
}

</script>

<template>
<div v-if="store.flag.show_setting_panel"
    class="setting-panel">
    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
        <div class="title">
            <i class="fa fa-cog"></i>
            Settings
        </div>
        <div class="opers">
            <Button icon="pi pi-times" 
                @click="onClickClose"
                severity="secondary" />
        </div>
    </div>

    <div>
        <Tabs value="0">
            <TabList>
                <Tab value="0">General</Tab>
                <Tab value="1">Backend</Tab>
                <Tab value="2">Other</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <p class="m-0">
                        Hightlight Keywords
                    </p>
                    <Textarea v-model="keywords" 
                        style="width: 100%;"
                        rows="5" />

                    <p class="m-0">
                        <Button @click="onClickRefreshKeywords"
                            severity="secondary"
                            label="Get current keywords"></Button>
                        &nbsp;
                        <Button @click="onClickSaveKeywords"
                            label="Update keywords"></Button>
                    </p>

                </TabPanel>


                <TabPanel value="1">
                    <p class="m-0">
                        API Server URL
                    </p>
                    <InputText v-model="store.config.api_server_url" 
                        style="width: 100%;"/>

                    <p class="">
                        API Server Token
                    </p>
                    <InputText v-model="store.config.api_server_token" 
                        style="width: 100%;"/>
                </TabPanel>


                <TabPanel value="2">
                    <p class="m-0">
                        Auto Save
                    </p>
                    <Checkbox v-model="store.flag.enable_auto_save" 
                        inputId="ingredient1" 
                        binary />
                    <label for="ingredient1"> Save dataset file when made any changes </label>
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
    background-color: white;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 0 10px #ccc;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    z-index: 100;
}

.title {
    font-weight: bold;
    padding: 0 1rem;
}
</style>