<template>
  <div class="view-img" >
    <img :src="imgSrc">
    <div class="view-img-cover">
      <Icon type="ios-eye-outline" @click.native="visible = true"></Icon>
    </div>
    <Modal title="图片预览" v-model="visible" :width="600" class="img" >
      <img :src="imgSrc" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: ["imgSrc"],
  data() {
    return {
      visible: false
    };
  },
  methods: {}
};
</script>
<style lang="less" scoped>

.view-img {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  img {
    width: 100%;
    height: 100%;
  }
  .view-img-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  &:hover .view-img-cover {
    display: block;
  }
  .view-img-cover {
    i {
      color: #fff;
      font-size: 1.25rem /* 20/16 */;
      cursor: pointer;
      margin: 0 2px;
    }
  }
}
</style>