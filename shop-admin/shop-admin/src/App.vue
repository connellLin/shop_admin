<template>
  <div id="app" v-title data-title="后台管理系统">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  height: 100%;
}
</style>
