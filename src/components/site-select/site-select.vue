<template>
  <div>
    <Select
      v-if="mode=='单选'"
      v-model="singleData.id"
      :clearable="clearable"
      :filterable="filterable"
      :disabled="disabled"
      :placeholder="placeholder"
      :style="_width"
      @on-change="userClick"
    >
      <Option v-for="(item,i) in siteList" :value="item.id" :key="i">{{ item.siteName }}</Option>
    </Select>
    <Select
      v-else
      multiple
      v-model="multipleData.id"
      :disabled="disabled"
      :clearable="clearable"
      :filterable="filterable"
      :placeholder="placeholder"
      :style="_width"
    >
      <Option v-for="item in siteList" :value="item.id" :key="item.id">{{ item.siteName }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
  props: {
    siteList: {
      type: Array,
      default: []
    },
    mode: {
      type: String,
      default: "单选"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    width: {
      type: [String, Number],
      default: 260
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _width() {
      return "width:" + this.width + "px";
    }
  },
  data() {
    return {
      flag: false,
      singleData: {
        id: ""
      },
      multipleData: {
        id: []
      },
      timer: null
    };
  },
  watch: {
    singleData: {
      handler(val, oldVal) {
        this.singleChange(val);
      },
      deep: true
    },
    multipleData: {
      handler(val, oldVal) {
        if (this.isEdit) {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {this.multipleChange(val)}, 600)
        } else {
          this.multipleChange(val)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async setDefaultSite(id) {
      // 如果跳转页面需要同步站点可以异步调用这个方法
      if (this.mode === "单选") {
        this.singleData.id = +id;
      } else {
        let _id = id && id.map(Number);
        this.multipleData.id = _id;
      }
    },
    async init() {
      //初始化默认站点,多选不需要(创建管理员)
      //编辑时不需要默认第一个站点,只需调用setDefaultSite方法即可，以减少因为站点变化发起的请求
      if (this.mode === "单选" && localStorage.accessSite) {
        if (this.getSite('site')) {
          this.singleData.id = +this.getSite('site')
        } else {
          this.singleData.id = this.siteList[0].id;
        }
      }
    },
    async sendSiteList() {
      // 如其他页面需要站点数据，可直接调用该方法，减少请求数据，如站点列表页面
      return this.siteList;
    },
    singleChange(val) {
      this.siteList.forEach(s => {
        if (s.id == val.id) {
          this.singleData.siteName = s.siteName;
          // this.singleData.paymentBonus = s.paymentBonus
          this.singleData.siteCode = s.siteCode;
          this.saveSite(s.id)
        }
      });
      this.$emit("on-site-change", { ...this.singleData}, this.flag);
    },
    multipleChange(val) {
      this.multipleData.siteName = [];
      this.multipleData.siteCode = [];
      val.id && val.id.forEach(item => {
        this.siteList.forEach(s => {
          if (s.id == item) {
            this.multipleData.siteCode.push(s.siteCode);
            this.multipleData.siteName.push(s.siteName);
            // this.multipleData.paymentBonus.push(s.paymentBonus);
            this.saveSite(s.id)
          }
        });
      });
      this.$emit("on-site-change", { ...this.multipleData });
    },
    saveSite (val) {
      sessionStorage.setItem('site', `${val}`)
    },
    getSite (val) {
      console.log(val)
      return sessionStorage.getItem(val)
    },
    userClick () {
      this.flag = true
    }
  }
};
</script>
