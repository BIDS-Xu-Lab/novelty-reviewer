<script setup>
import { RouterView } from 'vue-router';
import SettingPanel from "./components/SettingPanel.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
<RouterView />
<SettingPanel />



<Footer />
<Toast />
</template>