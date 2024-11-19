<script setup>
import { onMounted, ref } from "vue";
import ItemList from "./components/ItemList.vue";
import ItemDetail from "./components/ItemDetail.vue";
import AIHelper from "./components/AIHelper.vue";
import HeaderMenu from "./components/HeaderMenu.vue";
import HumanReviewer from "./components/HumanReviewer.vue";
import SettingPanel from "./components/SettingPanel.vue";

import { useDataStore } from "./DataStore";
import DecisionPanel from "./components/DecisionPanel.vue";

const store = useDataStore();

onMounted(() => {
  store.loadSettingsFromLocalStorage();
});
</script>

<template>

<div class="header">
  <HeaderMenu />
</div>

<div class="main">
  <div class="left">
    <ItemList />
  </div>

  <div class="right">
    <div class="main-info">
      <ItemDetail />
    </div>

    <div class="review-panel">
      <DecisionPanel />
      <HumanReviewer />
      <AIHelper />
    </div>
  </div>
</div>

<div class="footer">
  <div>
    <i class="fa-regular fa-clipboard"></i>
    {{ store.taxonomy_file?.name }}:
    <b>{{ store.taxonomy.length }}</b> taxonomies
    |
    <i class="fa fa-database"></i>
    {{ store.dataset_file?.name }}:
    <b>{{ store.items.length }}</b> rows
    |
    <b>{{ store.n_results_by_human }}</b> by Human
    + 
    <b>{{ store.n_results_by_ai }}</b> by AI
  </div>
  <div>
    <a href="https://github.com/BIDS-Xu-Lab/novelty-reviewer"
      target="_blank">
      <i class="fa-brands fa-pagelines"></i>
      Novelty Reviewer
      v{{ store.version }}
      |
      <i class="fa-brands fa-github"></i>
    </a>
  </div>
</div>

<SettingPanel></SettingPanel>


<Toast />
</template>

<style scoped>
.header {
  height: 4rem;
  display: flex;
  flex-direction: column;
  background-color: #dfdfdf;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #dfdfdf;
  justify-content: space-between;
}
.oper-bar {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.oper-item {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}
.main {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 7rem);
  background-color: #d4d4d4;
}
.left {
  width: 25rem;
  height: calc(100vh - 7rem);
  overflow-y: hidden;
  background-color: #eaeaea;
}
.right {
  flex: 1;
  width: calc(100% - 25rem);
  padding: 10px;
  height: calc(100vh - 7rem);
  background-color: #f9f9f9;
  display: flex;
  flex-direction: row;
}
.main-info {
  width: 50%;
  /* max-width: 600px; */
  overflow-y: hidden;
}
.review-panel {
  width: 50%;
  max-width: 700px;
  overflow-y: hidden;
}
</style>
