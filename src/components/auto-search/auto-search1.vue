<template>
  <AutoComplete
    :disabled="disabled"
    :clearable="clearable"
    :style="_width"
    :placeholder="placeholder"
    :transfer="transfer"
    v-model="value"
    @on-focus="onFocus"
    @on-select="onSelect"
    @on-search="onSearch"
    @on-clear="onClear"
    @on-blur="onBlur"
    @on-change="onChange"
    @keydown.backspace.native="del"
  >
    <div class="tip" v-if="tip===0">请输入查询内容</div>
    <div class="tip" v-else-if="tip===1">搜索中...</div>
    <div class="tip" v-else-if="tip===2">搜索完成</div>
    <div class="tip error" v-else-if="tip===3">搜索结果不存在!</div>
    <Option v-for="(item,index) in data" :value="item.userName" :key="index">{{ item.userName }}</Option>
  </AutoComplete>
</template>

<script>
import { agencyGetName } from "@/api/agency";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: "请输入，可自动搜索"
    },
    width: {
      type: [String, Number],
      default: 260
    },
    transfer: {
      type: Boolean,
      default: false
    },
    // data: {
    //   type: [Array, Object],
    //   default: () => []
    // },
    stage: {
      type: String,
      default: "agency" //  agency || member
    },
    siteId: {
      type: [String, Number]
    },
    // key: {
    //   type: String
    // },
    // http: {
    //   type: Function,
    //   default: () => {}
    // },
    doSomeThing: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      value: "",
      tip: 0,
      data: []
    };
  },
  computed: {
    _width() {
      return "width:" + this.width + "px";
    }
  },
  watch: {
    value(val, oldVal) {
      if (!val) {
        this.$emit("changeShow", false);
      }
    }
  },
  methods: {
     del(e){
      if(e.which==8&&e.code!=='Backspace'&&e.key!=='Backspace'&&e.defaultPrevented){   //解决百度浏览器无法退格
        const val=e.target.value.substr(0,e.target.value.length-1)
        e.target.value=val
      }
    },
    onSearch() {
      this.tip = 1;
      if (this.stage == "agency") {
        let postData = {
          type: "agency",
          content: this.value,
          siteId: this.siteId
        };
        agencyGetName(postData).then(res => {
          if (res.data.length > 0) {
            this.data = res.data;
            this.tip = 2;
          } else {
            this.tip = 3;
            this.data = [];
          }
        });
      } else if (this.stage == "member") {
        let postData = {
          type: "member",
          content: this.value,
          siteId: this.siteId
        };
        agencyGetName(postData).then(res => {
          if (res.data.length > 0) {
            this.data = res.data;
            this.tip = 2;
          } else {
            this.tip = 3;
            this.data = [];
          }
        });
      } else {
        let postData = {
          type: "all",
          content: this.value,
          siteId: this.siteId
        };
        agencyGetName(postData).then(res => {
          if (res.data.length > 0) {
            this.data = res.data;
            this.tip = 2;
          } else {
            this.tip = 3;
            this.data = [];
          }
        });
      }
    },
    onBlur(e) {
      this.data &&
        this.data.forEach(item => {
          if (item.userName === e.target.value) {
            this.onSelect(item.userName)
          }
        });
    },
    onSelect(value) {
      this.$emit("sendSuperior", value);
      this.data.forEach(item => {
        if (item.userName == value) {
          this.$emit('sendId', item.id)
          this.$emit('sendBalance', item.balance)
        }
      })
    },
    // 返回false  不显示返点、返水设置
    onClear() {
      this.$emit("sendSuperior", false);
    },
    onFocus(e) {
      this.tip = 0;
      // this.$emit("sendOtherResult", e.target.value)
    },
    onChange(val) {
      this.data && this.data.forEach(item => {
        if (item.userName == val) this.onSelect(val)
      })
      this.$emit('sendResult',val)
      // this.$emit("sendOtherResult", val)
    },
    // 再次调用，清除上次的数据
    removeDefault() {
      this.value = "";
    },
    //设置绑定的默认值
    setDefault(val) {
      this.value = val;
    }
  }
};
</script>
<style lang="less" scoped>
.tip {
  text-align: center;
  &.error {
    color: #ed3f14;
  }
}
// /deep/.ivu-modal-content{
//   overflow: inherit!important;
// }
/deep/.ivu-select-dropdown-list {
  height: 100px;
}
</style>
