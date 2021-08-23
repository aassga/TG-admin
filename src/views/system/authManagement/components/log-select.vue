<template>
  <Cascader
    class="fontColor"
    :data="logTypes"
    :render-format="labels => labels[labels.length -1]"
    @on-change="onLogChange"
    change-on-select
  ></Cascader>
</template>
<script>
import { adminLogType } from "@/api/common";
export default {
  data() {
    return {
      logTypes: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      adminLogType().then(res => {
        this.logTypes = res.data;
        this.logTypes.forEach(log => {
          log.label = log.name;
          log.value = log.type;
          log.children = [];
          for (let key in log.subType) {
            let obj = {};
            obj.label = log.subType[key];
            obj.value = key;
            log.children.push(obj);
          }
        });
      });
    },
    onLogChange(res) {
      this.$emit("on-change", res[res.length - 1]);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ivu-cascader-menu{
  background: #ffffff!important;
}

/deep/.ivu-cascader-menu-item {
  color:#444;
}
</style>

