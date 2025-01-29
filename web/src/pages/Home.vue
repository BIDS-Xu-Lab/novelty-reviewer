<script setup>
import { onMounted, ref } from "vue";
import PaperList from "../components/PaperList.vue";
import PaperDetail from "../components/PaperDetail.vue";
import HomeMenu from "../components/menus/HomeMenu.vue";
import Footer from "../components/Footer.vue";

import { useDataStore } from "../DataStore";
import DecisionPanel from "../components/DecisionPanel.vue";
import NaviMenu from "../components/menus/NaviMenu.vue";

const store = useDataStore();

onMounted(() => {
    console.log("* mounted Home.vue");
});
</script>

<template>

<NaviMenu />
<HomeMenu />

<div class="main">
<PaperList />

<PaperDetail />

<DecisionPanel />
</div>

</template>

<style scoped>
</style>
