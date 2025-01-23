<script setup>
import { onMounted, ref } from "vue";
import ItemList from "../components/ItemList.vue";
import PaperDetail from "../components/PaperDetail.vue";
import HeaderMenu from "../components/HeaderMenu.vue";
import Footer from "../components/Footer.vue";

import { useDataStore } from "../DataStore";
import DecisionPanel from "../components/DecisionPanel.vue";

const store = useDataStore();

onMounted(() => {
  store.loadSettingsFromLocalStorage();
});
</script>

<template>

<HeaderMenu />

<div class="main">
<ItemList />

<PaperDetail />

<DecisionPanel />
</div>

<Footer />



<Toast />
</template>

<style scoped>
</style>
