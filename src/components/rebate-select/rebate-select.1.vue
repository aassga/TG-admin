<template>
  <collapse simple value="1">
    <panel name="1" :hide-arrow="true">
      <div class="title" @click="open=!open">
        <span :class="wordClass == 'white' ? '' : 'blue-font'">返点设置</span>
        <Icon v-show="!open" type="ios-arrow-down" size="18" color="#999"/>
        <Icon v-show="open" type="ios-arrow-forward" size="18" color="#999"/>
      </div>
      <div class="section p15" slot="content">
        <div class="btns">
          <Button
            class="lottery mr20"
            v-for="(menu,i) in lottMenu"
            :key="i"
            :class="showKey == menu ? 'bd-bg' : 'bg-or'"
            @click="onselectLott(menu,i)"
          >{{menu}}</Button>
        </div>
        <div class="clearfix">
          <div class="clearfix" v-if="$route.params.page && editable">
            <div class="fl clearfix h60">
              <div class="label fl">统一设置：</div>
              <Select
                style="width:100px"
                @on-change="batchSetRebate"
                class="fl"
                v-model="batchRebate"
                placeholder="请选择"
              >
                <Option v-for="(opt,index) in defaultOptions" :key="index" :value="opt">{{opt}}%</Option>
              </Select>
            </div>
            <div class="fl ml20 clearfix h60">
              <div class="label fl">批量设置：</div>
              <div class="fl">
                <Button icon="ios-remove" @click="reduceRebate" size="small"></Button>
                <Button icon="ios-add" class="ml20" @click="addRebate" size="small"></Button>
              </div>
            </div>
          </div>
          <div v-for="lott in lottSub[showKey]" :key="lott.id" class="clearfix h40 fl w20">
            <div class="label fl">{{lott.name}}：</div>
            <div class="fl" v-if="$route.params.page && editable">
              <Select
                v-model="lott.rebate"
                placeholder="请选择"
                style="width:120px;"
                @on-change="selectSingleRabate"
              >
                <Option v-for="(opt,i) in lott.options" :key="i" :value="opt">{{opt}}%</Option>
              </Select>
              <span class="tip">上限：{{(+lott.parent_rebate).toFixed(2)||"-"}}%</span>
              <!-- <span class="tip" v-if="showParent">上限：{{(+lott.parent_rebate).toFixed(2)||"-"}}%</span>  -->
            </div>
            <div v-else>{{lott.rebate}}%</div>
          </div>
        </div>
      </div>
    </panel>
  </collapse>
</template>
<script>
import Icons from "../icons";
import { rmRepeatItem } from "@/libs/util";
export default {
  components: { Icons },
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    showParent: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true,
      required: false
    },
    wordClass: {
      type: String,
      default: "white",
      required: false
    }
  },
  data() {
    return {
      open: false,
      lottIndex: 0,
      showKey: "六合彩",
      batchRebate: ""
      // editable: this.$root.checkCommission()
    };
  },
  computed: {
    defaultOptions() {
      let array = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j <= 10; j++) {
          let step = j * 0.1;
          array[array.length] = (i + step).toFixed(2);
        }
      }
      return rmRepeatItem(array);
    },
    lottMenu() {
      let lottMenu = [];
      for (let i = 0; i < this.data.length; i++) {
        lottMenu[lottMenu.length] = this.data[i].className;
      }
      return rmRepeatItem(lottMenu);
    },
    lottSub() {
      let lottSub = {};
      for (let i = 0; i < this.lottMenu.length; i++) {
        let key = this.lottMenu[i];
        lottSub[key] = [];
        for (let j = 0; j < this.data.length; j++) {
          if (this.data[j].className === this.lottMenu[i]) {
            let lastIndex = lottSub[key].length;
            if (this.$root.modeName() != "mode_a")
              this.data[j].options = this.createOptions(
                'a',
                +this.data[j].parent_rebate || 3
              );
            // this.data[j].options = this.createOptions( +this.data[j].parent_rebate || 3 )
            else
              this.data[j].options = this.createOptions(
                +this.data[j].parent_rebate + 0.005 - 0.3,
                +this.data[j].parent_rebate || 3
              );
            this.data[j].options = rmRepeatItem(this.data[j].options);
            lottSub[key][lastIndex] = this.data[j];
          }
        }
      }
      for (let key in lottSub) {
        lottSub[key].forEach(item => {
          item.rebate = Number(item.rebate).toFixed(2);
        });
      }
      return lottSub;
    }
  },
  methods: {
    batchSetRebate(val) {
      if (!val) return;
      this.lottSub[this.showKey].forEach(lott => {
        lott.rebate = val;
      });
      this.createData();
    },
    selectSingleRabate() {
      this.createData();
    },
    onselectLott(lott, i) {
      this.lottIndex = i;
      this.showKey = lott;
      this.batchRebate = "";
    },
    reduceRebate(index) {
      this.lottSub[this.showKey].forEach(lott => {
        let re = +lott.rebate - 0.1;
        re = re <= 0 ? 0 : re;
        lott.rebate = re.toFixed(2);
      });
      this.createData();
    },
    // addRebate(index) {
    //    // 超出上级返点显示自己的返点
    //   this.contents[index].list.forEach(child => {
    //     let re = +child.rebate + 0.1;
    //     re = re >= +child.maxRebate ? +child.maxRebate : re;
    //     this.$set(child, "rebate", re.toFixed(1));
    //   })
    //   this.createData();
    // },
    addRebate() {
      // 超出上级返点显示自己的返点
      this.lottSub[this.showKey].forEach(lott => {
        let re = +lott.rebate + 0.1;
        re = re >= +lott.parent_rebate ? +lott.parent_rebate : re;
        lott.rebate = re.toFixed(2);
      });
      this.createData();
    },
    createOptions(min, max) {
      let arr = [];
      if (min == 'a') {
        for (let i = 0; i < max; i++) {
          for (let j = 0; j <= 10; j++) {
            let step = j * 0.1;
            if (i + step <= max) {
              arr.push((i + step).toFixed(2))
            }
          }
        }
      } else {
        max = max + 0.005
        for (let i = min; i < max; i++) {
          for (let j = 0; j <= 10; j++) {
            let step = j * 0.1;
            if (i + step <= max) {
              arr.push((i + step).toFixed(2));
            }
          }
        }
      }
      return arr;
    },
    createData() {
      let data = {};
      this.data.forEach(lott => {
        let key = `CT_${lott.id}_LOTTERY`;
        data[key] = lott.rebate;
      });
      this.$emit("on-rebate-change", JSON.stringify(data));
      return JSON.stringify(data);
    },
    createParentData() {
      let data = {};
      this.data.forEach(lott => {
        let key = `CT_${lott.id}_LOTTERY`;
        data[key] = lott.parent_rebate;
      });
      return JSON.stringify(data);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.w25 {
  width: 16%;
}
.btns {
  height: 50px;
  line-height: 50px;
}
.h60 {
  height: 60px;
  line-height: 60px;
  display: flex;
  align-items: center;
}
.h40 {
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
}
.label {
  width: 120px;
  padding-right: 10px;
  text-align: right;
  font-size: 0.875rem;
}
.tip {
  font-size: 0.875rem;
  color: #ed3f14;
  margin-left: 10px;
}
.section.gray-bg {
  background: #f6f6f8;
}
/deep/.ivu-icon-ios-add {
  font-weight: bolder;
  color: #2d8cf0;
}
/deep/.ivu-icon-ios-remove {
  font-weight: bolder;
  color: #2d8cf0;
}
.bd-bg {
  background-color: #2d8cf0;
  border-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.bg-or {
  border: 1px solid #eaeaea;
  &:focus {
    box-shadow: 0 0 0 0;
  }
  &:hover {
    background: #f4f9ff;
    border: 1px solid #2d8cf0;
    color: #2d8cf0;
  }
}
.ivu-collapse {
  border-bottom: none;
}

</style>


