<template>
  <Checkbox class="w18" v-model="data.checked" @on-change="onChange">{{data.name}}</Checkbox>
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
    onChange(bool) {
      const { grandIndex, parentIndex, index } = this.data;
      const params = {
        grandIndex,
        parentIndex,
        index,
        bool
      };
      this.checkFun(params);
    }
  }
};
</script>
