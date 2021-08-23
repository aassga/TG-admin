<template>
  <div>
    <div v-if="mode === '单选'">
      <Select
        class="fontColor"
        :clearable="clearable"
        :disabled="disabled"
        transfer
        :style="_width"
        :placeholder="placeholder"
        :class="className"
        v-model="singleData.group_id"
      >
        <Option
          class="fontColor"
          v-for="item in groupList"
          :key="item.id"
          :value="item.group_id"
          >{{
            (item.group_name
              ? choiceShow
                ? false
                : item.group_name
              : false) || item.group_name
          }}</Option
        >
      </Select>
    </div>
  </div>
</template>
<script>
import { getMemberGroupList } from "@/api/member";
export default {
  props: {
    choiceShow: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "单选",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    width: {
      type: [String, Number],
      default: 260,
    },
    levelType: {
      type: String, // member || agency || commom
    },
    className: {
      type: String,
    },
    initFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      flag: false,
      singleData: {
        group_id: "",
      },
      groupList: [],
      subType: "",
    };
  },
  computed: {
    _width() {
      return "width:" + this.width + "px";
    },
    // allModalList () {
    //   (this.levelList)
    //   return this.levelList
    // }
  },
  watch: {
    singleData: {
      handler(val, oldVal) {
        this.singleChange(val);
      },
      deep: true,
    },
    allModal() {
      this.checkAll();
    },
  },
  mounted() {
    this.checkAll();
    this.getMemberGroupList(this.$root.nowSite.id);
  },
  methods: {
    checkAll() {},
    async setDefaultLevel(group_id, group_name) {
      // 如果跳转页面需要同步等级可以异步调用这个方法

      if (this.mode === "单选") {
        this.singleData.group_id = +group_id;
        this.singleData.group_name = group_name;
        this.$set(this.singleData, "group_id", +group_id);
      }
    },
    async init(siteId, defaultLevel) {
      if (this.levelType == "group") {
        this.groupList = await this.getMemberGroupList(siteId, "select");
      }
      if (defaultLevel) {
        const { group_id, group_name } = defaultLevel;
        this.setDefaultLevel(group_id, group_name);
      }

      return this.groupList;
    },
    singleChange(val) {
      let data = { ...this.singleData };
      this.groupList &&
        this.groupList.forEach((le) => {
          if (val.group_id == le.group_id) {
            data.group_name = le.group_name;
          }
        });
      this.$emit("on-level-change", data);
    },
    getMemberGroupList(siteId) {
      return getMemberGroupList({ siteId }).then((res) => {
        if (res != undefined && res.code == 200) {
          localStorage.groupListLength = res.data.length;
          return res.data;
        }
      });
    },
    // 清空多选默认值
    reset(val) {
      if (typeof val === "undefined") {
        this.multipleData.levelLabel = [];
      } else if (val === "single") {
        this.singleData.group_id = "";
      }
    },
    changeSubType(val) {
      this.subType = val;
    },
  },
};
</script>
