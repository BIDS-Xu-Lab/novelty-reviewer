<script setup>
import { RouterView } from 'vue-router';
import SettingPanel from "./components/SettingPanel.vue";
</script>

<template>
<RouterView />
<SettingPanel />
<Toast />
</template>