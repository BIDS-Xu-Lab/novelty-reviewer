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
                        <label for="">Hightlight Keywords</label>
                    </p>
                    <Textarea v-model="keywords" 
                        style="width: 100%;"
                        rows="5" />

                    <p class="m-0">
                        <Button @click="onClickRefreshKeywords"
                            label="Refresh"></Button>
                        &nbsp;
                        <Button @click="onClickSaveKeywords"
                            label="Save"></Button>
                    </p>
                </TabPanel>
                <TabPanel value="1">
                    <p class="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                        ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
                <TabPanel value="2">
                    <p class="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                        qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
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