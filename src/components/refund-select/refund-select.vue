<template>
  <collapse simple value="1">
    <panel name="1" :hide-arrow="true">
      <div class="title" @click="open=!open">
        <span class="fontColor"  >{{title == 'create' ? '返水设置' : '返水信息'}}</span>
          <Icons type="jiesuo" style="cursor:default" v-if="isLock == '0' && showLock" color="#FFAA31" size='18' class="icon" @click.stop.native="() => { lockData = '1' }"/>
          <Icons type="suoding" style="cursor:default" v-if="isLock == '1' && showLock" color="red" size='18' class="icon" @click.stop.native="() => { lockData = '0'}"/>
        </span>
        <Icon v-show="!open" type="ios-arrow-down" size="18" color="#999"/>
        <Icon v-show="open" type="ios-arrow-forward" size="18" color="#999"/>   
        <span class="ml60" v-if="showLock" style="color:red;">*锁定后,只能按照当前设置比例进行返水,不参与返水等级设置门槛，前台代理中心→下级开户只能按照当前比例设置分润</span>
      </div>
      <div class="section p15" slot="content">
        <div class="btns">
          <Button
            v-for="(tab,key) in _data_"
            :key="tab.name"
            class="lottery mr20 fontColor"
            :class="showKey == key ? 'bd-bg' : 'bg-or'"
            @click="onselectMenu(key)"
          >{{tab.name}}</Button>
        </div>
        <div class="clearfix info pt10 " v-if="_data_[showKey]" >
          <div v-for="sub in _data_[showKey].list" :key="sub.name_en" class="clearfix w20 h40 fl mb20">
            <div class="label fl">{{sub.name_cn}}：</div>
            <div class="fl" v-if="$route.params.page && editable && exitParent">
              <InputNumberN
                :disabled="isLock=='1'&&showLock"
                v-model="sub.refund"
                :step="step"
                :max="sub.parent_refund"
                :min="changeMin(sub.parent_refund)"
                class="w60xh36"
                @on-change="onChange(arguments,sub)"
              ></InputNumberN>
            </div>
             <div class="fl" v-if="$route.params.page && editable && !exitParent" >
              <InputNumberN
                v-model="sub.refund"
                :step="step"
                :min="0"
                class="w60xh36"
                @on-change="onChange(arguments, sub)"
              ></InputNumberN>
            </div>
            <div v-if="!$route.params.page">{{sub.refund}}</div>
          </div>
        </div>
      </div>
    </panel>
  </collapse>
</template>
<script>
import Icons from "../icons";
import InputNumberN from '_c/input-number-n';
import { rmRepeatItem } from "@/libs/util";
export default {
  components: { Icons, InputNumberN },
  props: {
    data: {
      type: [Object, Array],
      required: true,
      default: () => {}
    },
    showParent: {
      //是否显示上限
      type: Boolean,
      required: false,
      default: false
    },
    exitParent: {
      // 是否有上限
      type: Boolean,
      required: false,
      default: true
    },
    editable: {
      type: Boolean,
      required: false,
      default: true
    },
    title: {
      type: String,
      default: 'create'
    },
    isShareholder: {
      type: Boolean,
      default: false
    },
    showLock: { //父组件参数  是否显示锁定
      type: Boolean,
      default: false
    },
    isLock: {
      type: [Number, String],
      default: '0'
    }
  },
  data() {
    return {
      step: 0.01,
      open: false,
      showKey: "live",
      lockData: this.isLock
    };
  },
  watch: {
    lockData: {
      handler(val) {
        this.$emit('lockChange', val)
      },
      immediate: true
    }
  },
  computed: {
    _data_() {
      let temp = { ...this.data };
      for (let key in temp) {
        temp[key].list.forEach(item => {
          item.refund = +item.refund
          item.parent_refund = +item.parent_refund
          if (this.exitParent && this.$root.modeName() == 'mode_a' && !this.isShareholder) {
            // 自身值与父返水值的比较赋值
            if(+item.refund > +item.parent_refund) item.refund = Number(Number(item.parent_refund).toFixed(2))
            if(+item.refund < (Number(+item.parent_refund - 0.3).toFixed(2))) item.refund = Number(Number(+item.parent_refund - 0.3).toFixed(2))
          }
        });
      }
      return temp;
    }
  },
  methods: {
    changeMin(parent) {
      if ((this.$root.modeName() == 'mode_f') || (this.$root.modeName() == 'no')||(this.$root.modeName() == 'mode_c') || (this.$root.modeName() == 'mode_a' && this.isShareholder)) return Number('0')
      else {
        if (Number(Number(+parent - 0.3).toFixed(2)) < 0) return Number('0')
        else return Number(Number(+parent - 0.3).toFixed(2))
      }
    },
    onselectMenu(showKey) {
      this.showKey = showKey;
    },
    onChange(value, parent) {
      this.createData();
    },
    createData() {
      let data = {};
      for (let key in this._data_) {
        this._data_[key].list.forEach(item => {
          // item.refund = Number(item.refund).toFixed(2)
          // item.parent_refund = Number(item.parent_refund).toFixed(2)
          data[item.name_en] = Number(item.refund).toFixed(2);
        });
      }
      this.$emit("on-refund-change", JSON.stringify(data));
      return JSON.stringify(data);
    },

  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";

/deep/.ivu-collapse-content{
  color: #444 !important;
}

.btns {
  height: 50px;
  line-height: 50px;
}
.w60xh36 {
  width: 60px;
  height: 36px;
  line-height: 36px;
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
  font-size: 14px;
  margin-right: 5px;
}
.tip {
  font-size: 14px;
  color: #ed3f14;
  margin-left: 10px;
}
.bd-bg {
  background-color: #2d8cf0;
  border-color: #2D8CF0;
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
/deep/.input{
      display: inline-block;
    font-size: 14px;
    color: #666666;
    background-color: #fff;
    background-image: none;
    position: relative;
    margin: 0;
    padding: 0;
    vertical-align: middle;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    overflow: hidden;
    cursor: default;
}
.title{
  position: relative;
}
.icon{
  position: absolute;
  top: -2px;
  left: 90px;
}
</style>


