<template>
  <i :class="`iconfont icon-${type}`" @click="handleClick" :style="styles" :size='size' ></i>
</template>

<script>
export default {
  name: 'Icons',
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
    },
    size: {
      type: [Number, String],
      default: 16
    }
  },
  computed: {
    styles () {
      return {
        fontSize: `${this.size}px`,
        color: this.color
      }
    }
  },
  methods: {
    handleClick(){
      this.$emit('click');
    }
  }
}
</script>

<style>


</style>
