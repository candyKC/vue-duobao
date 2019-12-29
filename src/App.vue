<template>
  <div id="app" class="van-tabbar--safe-area-inset-bottom">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <router-view name="tabbar"/>
  </div>
</template>

<style lang="less">
</style>
