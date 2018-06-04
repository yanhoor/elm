<template>
  <div id="app" v-cloak>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style type="text/css" scoped>
  [v-cloak]{
    display: none;
  }
  #app{
    width: 100%;
    height: 100%;
  }
</style>
