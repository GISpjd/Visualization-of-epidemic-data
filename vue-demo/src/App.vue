<template>
    <div class="container" :style="{ background: `url(${scene})` }">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
    </div>
</template>

<script setup lang="ts">
import LeftPanel from './components/LeftPanel.vue';
import CenterPanel from './components/CenterPanel.vue';
import RightPanel from './components/RightPanel.vue';
import scene from './assets/scene.jpg'

</script>

<style>
* {
    padding: 0;
    margin: 0;
}

html,
body,
#app {
    height: 100%;
    overflow: hidden;
}

#app {
    justify-content: space-around
}

.container {
    display: flex;
    height: 100%;
    /* padding: 10px; */
}
</style>
