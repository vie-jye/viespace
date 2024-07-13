<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "@/components/header/AppHeader.vue";
import AppFooter from "@/components/footer/AppFooter.vue";
</script>

<template>
<AppHeader />
<RouterView />
<AppFooter />
</template>

<style scoped>
</style>
