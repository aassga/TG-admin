<template>
  <Checkbox v-model="data.checked" @on-change="onChange"></Checkbox>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    checkFun: {
      type: Function,
      required: true
    }
  },
  methods: {
    onChange() {
      const { parentIndex, initRowIndex } = this.data;
      this.checkFun(parentIndex, initRowIndex);
    }
  }
};
</script>

