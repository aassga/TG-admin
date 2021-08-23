<template>
  <div>
    <div
      class="titbox mb20 mt20"
      v-if="showType == 'tip1'"
      @drop="menuItemDrop($event, 0, dropType, list)"
      @dragover.prevent
    >
      {{ isEdit ? "可拖动下方游戏进行添加并排序" : "编辑添加游戏" }}
    </div>
    <div
      v-if="showType == 'game'"
      class="mb20 gamebox gameListBox mt20"
      @drop=" searchBox ? '' : menuItemDrop($event, list.length - 1, dropType, list)"
      @scroll.passive="getScroll($event, num)"
      @dragover.prevent
    >
      <div
        class="w220x txt-a ib po-re h60"
        v-if="i >= minNum && i <= maxNum"
        v-for="(item, i) in list"
        @drop.stop="menuItemDrop($event, i, dropType, list, typeId)"
        :key="item.id"
      >
        <Button
          class="w187x ft14"
          :class="{
            move: isEdit && !(adminType != 'super' && item.slock == 1),
            super:
              (isEdit && adminType != 'super' && item.slock == 1) || item.color,
          }"
          :draggable="
            !isEdit || item.color
              ? false
              : adminType != 'super' && item.slock == 1
              ? false
              : true
          "
          @dragstart.native="menuItemDrag(moveType, item, i)"
          @dragover.native="menuItemOver"
          @dragend.native="menuItemDragEnd"
        >
          <span class="ib gamename w110x">{{ item.name }}</span>
          <span class="line" v-if="typeId == 10001 && item.line"
            >({{ item.line }})</span
          >
        </Button>
        <Icon
          class="close cs"
          v-if="isEdit && (adminType == 'super' || !item.slock) && showClose"
          @click.stop="remove(item.id)"
          type="md-close"
        />
        <Icons
          :type="item.lock == !0 ? 'suodingpaixu1' : 'jiesuopaixu'"
          v-if="
            (isEdit || item.lock == 1) &&
            (adminType == 'super' || !item.slock) &&
            showLock
          "
          @click.native="lockGame(item.lock, list, i)"
          :color="
            item.lock == !0 && item.slock != 1
              ? '#CECECE'
              : item.lock == !0 && item.slock == 1
              ? 'rgb(255, 38, 38)'
              : 'orange'
          "
          class="gameLock"
          size="20"
        ></Icons>
        <span class="line gamePlatform" v-if="showClass">
          <span class="ib sanjiaoxing"></span>
          {{ item.className }}
        </span>
      </div>
      <div v-else class="w220x txt-a fl po-re ib h60"></div>
    </div>
    <div v-if="showType == 'tip2'" class="txt-a mb20 mt20 tipBox">
      <span>匹配不到搜索关键词！请重新输入关键字</span>
    </div>
    <div
      v-if="showType == 'tip3'"
      @drop="menuItemDrop($event, 0, dropType, list, typeId)"
      @dragover.prevent
      class="txt-a mb20 tipBox"
    >
      <span>暂无数据!</span>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/icons";
import { getUserType } from "@/libs/util";
export default {
  name: "searchGame",
  components: { Icons },
  data(){
    return {
       adminType: getUserType()
    }
  },
  props: {
    activeKey: {},
    searchBox: {
      default: false,
    },
    showType: {
      default: "game",
    },
    num: {},
    minNum: {
      default: 0,
    },
    maxNum: {
      default: 2000,
    },
    showClass: {
      type: Boolean,
      required: true,
    },
    showClose: {
      type: Boolean,
      required: true,
    },
    showLock: {
      default: true,
    },
    moveType: {
      type: String,
      required: true,
    },
    dropType: {
      type: String,
    },
    list: {
      type: Array,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
    typeId: {},
  },
  methods: {
    remove(val) {
      this.$emit("remove", val);
    },
    lockGame(lock, list, i) {
      this.$emit("lockGame", lock, list, i);
    },
    getScroll($event, num) {
      this.$emit("getScroll", $event, num);
    },
    menuItemDrag(val, item, i) {
      this.$emit("menuItemDrag", val, item, i);
    },
    menuItemOver(e) {
      this.$emit("menuItemOver", e);
    },
    menuItemDragEnd() {
      this.$emit("menuItemDragEnd");
    },
    menuItemDrop($event, i, text, list, typeId) {
      this.$emit("menuItemDrop", $event, i, this.dropType, list, typeId);
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ivu-upload {
  margin: 0 auto;
}
.titbox {
  text-align: center;
  line-height: 60px;
  border: 1px solid #dcdcdc;
  background: #f6f6f8;
  color: #666666;
  display: block;
  height: 60px;
  width: 100%;
}
.ivu-btn {
  height: 36px !important;
}
.gamebox {
  background: #f6f6f8;
  min-height: 60px;
  line-height: 60px;
  border: 1px solid #dcdcdc;
}
.po-re {
  position: relative;
}
.gamename {
  padding-right: 3px;
  overflow: hidden;
  height: 35px;
  line-height: 35px;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-size: 0.875rem /* 14/16 */;
}
.close {
  position: absolute;
  top: 4px;
  right: 7px;
  color: #ccc;
  text-align: center;
  line-height: 20px;
  width: 20px;
  height: 20px;
  // background: #f0ebeb;
  background: white;
  box-sizing: border-box;
  border: 1px solid #dcdcdc;
  border-radius: 50%;
  z-index: 100;
}
.close:hover {
  color: red;
  border: 1px solid red;
}
.tipBox {
  line-height: 60px;
  height: 62px;
  background: #f6f6f8;
  border: 1px solid #dcdcdc;
}
.gamePlatform {
  position: absolute;
  bottom: 2px;
  right: 16px;
  width: 62px;
  height: 16px;
  background: #c2dffd;
  z-index: 100;
  color: #5188be;
  line-height: 16px;
  text-align: center;
  font-size: 0.75rem;
}
.gameLock {
  position: absolute;
  top: -14px;
  left: 6px;
  height: 20px;
  z-index: 100;
}
.line {
  display: inline-block;
  vertical-align: top !important;
  font-size: 0.75rem;
  // line-height: 35px;
}
.sanjiaoxing {
  display: block;
  width: 0;
  height: 0;
  border-width: 8px 0 8px 5px;
  border-style: solid;
  border-color: transparent transparent transparent white; /*透明 透明 透明 黄*/
  position: absolute;
  top: 0px;
  left: 0px;
}
.gameListBox {
  background: #f6f6f8;
  max-height: 450px;
  // padding-top: 20px;
  // padding-bottom: 20px;
  box-sizing: border-box;
  line-height: 60px;
  border: 1px solid #dcdcdc;
  overflow-y: auto;
  overflow-x: hidden;
  button {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
/deep/.super {
  background: white;
  color: #dfd3d3;
}
</style>


