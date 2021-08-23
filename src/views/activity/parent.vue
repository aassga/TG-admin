<template>
  <!-- <keep-alive :include="cacheList" :exclude="notCacheList"> -->
    <router-view/>
  <!-- </keep-alive> -->
</template>
<script>
export default {
  computed: {
    notCacheList() {
      return [
        this.$route.meta && this.$route.meta.notCache ? this.$route.name : ""
      ];
    },
    cacheList() {
      const list = [
        ...(this.tagNavList.length ? this.tagNavList .filter(item => !(item.meta && item.meta.notCache)) .map(item => item.name) : [])
      ];
      return list;
    }
  }
}
</script>
