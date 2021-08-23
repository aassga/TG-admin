<template>
  <collapse simple value="1">
    <panel name="1" :hide-arrow="true">
      <div class="title" @click="open=!open">
        <span>{{title == 'create' ? '返佣设置' : '返佣信息'}}</span>
        <Icon v-show="!open" type="ios-arrow-down" size="18" color="#999"/>
        <Icon v-show="open" type="ios-arrow-forward" size="18" color="#999"/>
      </div>
      <div class="section p15 clearfix" slot="content">
        <div class="btns">
          <Button
            v-for="(tab,key,index) in _data_"
            :key="'commission'+index"
            class="lottery mr20"
            :class="showKey == key ? 'bd-bg' : 'bg-or'"
            @click="onselectMenu(key)"
          >{{tab.class_name}}</Button>
        </div>
        <div class="clearfix info pt10" v-if="_data_[showKey]">
          <div v-for="sub in _data_[showKey].child_platform" :key="sub.id" class="clearfix w20 h40 fl mb20">
            <div class="label fl">{{sub.name}}：</div>
            <div class="fl" v-if="$route.query.page">
              <InputNumber v-model="sub.value" :step="step" :min="0" :max='100' :precision='2' class="w60xh36 mr5" @on-change="onChange"/>%
            </div>
            <div v-if="!$route.query.page">{{sub.value}}%</div>
          </div>
        </div>
      </div>
    </panel>
  </collapse>
</template>
<script>
import Icons from "_c/icons";
import { rmRepeatItem } from "@/libs/util";
export default {
  components: { Icons },
  props: {
    data: {
      type: [Object, Array],
      required: true,
      default: () => {}
    },
    title: {
      type: String,
      default: 'create'
    }
  },
  data() {
    return {
      step: 0.1,
      open: false,
      showKey: "sport"
    };
  },
  computed: {
    _data_() {
      let temp = { ...this.data };
      for (let key in temp) {
        temp[key].child_platform.forEach(item => {
          if (item.value) item.value = +item.value
          else item.value = 0
        });
      }
      return temp;
    }
  },
  methods: {
    onselectMenu(showKey) {
      this.showKey = showKey;
    },
    onChange(value) {
      this.createData();
    },
    initData() {
      let data = {}
       for (let key in this._data_) {
        data[this._data_[key].class_id] = {}
      }
      for (let k in data) {
        for (let y in this._data_) {
          if (k == this._data_[y].class_id) {
            this._data_[y].child_platform.forEach(item => {
              data[k][item.id] = '0.0'
            })
          }
        }
      }
      return JSON.stringify(data);
    },
    createData() {
      let data = {}
      for (let key in this._data_) {
        data[this._data_[key].class_id] = {}
      }
      for (let k in data) {
        for (let y in this._data_) {
          if (k == this._data_[y].class_id) {
            this._data_[y].child_platform.forEach(item => {
              data[k][item.id] = item.value
            })
          }
        }
      }
      this.$emit("on-commission-change", JSON.stringify(data));
      return JSON.stringify(data);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
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
  font-size: .875rem;
  margin-right: 5px;
}
.tip {
  font-size: .875rem;
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
    font-size: .875rem;
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
</style>


