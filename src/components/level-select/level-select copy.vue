<template>
  <div>
    <div v-if="mode==='单选'">
      <Select
        class="fontColor"
        :clearable="clearable"
        :disabled="disabled"
        transfer
        :style="_width"
        :placeholder="placeholder"
        :class="className"
        v-model="singleData.levelLabel"
      >
        <Option
          class="fontColor"
          v-for="item in levelList"
          :key="item.id"
          :value="item.levelLabel"
        >{{(item.levelAlias ? choiceShow ? false : item.levelAlias : false)|| item.levelName||item.group_name}}</Option>
      </Select>
    </div>
    <div v-else-if="mode==='多选'">

       <Select
        v-if="allModal"
        class="fontColor "
        :clearable="clearable"
        multiple
       
        transfer
        :disabled="disabled"
        :style="_width"
        :placeholder="placeholder"
        :class="className"
        v-model="multipleData.levelLabel"
        ref="selector"
      >
        <Option v-if="allModal" value="all">全部</Option>
        <Option
          class="fontColor"
          v-for="item in levelList"
          :key="item.id"
          :value="item.levelLabel"
        >{{item.levelAlias || item.levelName}}</Option>
      </Select>
            <Select
            v-else
        class="fontColor levelBox"
        :clearable="clearable"
        multiple
         :max-tag-count="0"
        transfer
        :disabled="disabled"
        :style="_width"
        :placeholder="placeholder"
        :class="className"
        v-model="multipleData.levelLabel"
        ref="selector"
      >
      
        <Option
          class="fontColor levelSect"
          v-for="item in levelList"
          :key="item.id"
          :value="item.levelLabel"
        >{{item.levelAlias || item.levelName}}</Option>
      </Select>
    </div>
    <div v-else-if="mode==='单选全部'">
      <Select
       class="fontColor"
        :clearable="clearable"
        :disabled="disabled"
        transfer
        :style="_width"
        :placeholder="placeholder"
        :class="className"
        v-model="singleData.levelLabel"
      >
        <Option v-if="allModal" value="all">全部</Option>
        <Option
          v-for="item in levelList"
          :key="item.id"
          :value="item.levelLabel"
        >{{item.levelAlias || item.levelName}}</Option>
      </Select>
    </div>
  </div>
</template>
<script>
import { getMemberLevelData,getMemberGroupList } from "@/api/member";
import { getAgencyLevelData } from "@/api/agency";
import { getFinanceMemberLevelData} from  "@/api/common";
export default {
  props: {
    choiceShow: {
      type: Boolean,
      default: false
    },
    allModal: {
      type: Boolean,
      default: false
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
    placeholder: {
      type: String,
      default: "请选择"
    },
    width: {
      type: [String, Number],
      default: 260
    },
    levelType: {
      type: String // member || agency || commom
    },
    className: {
      type: String
    },
    initFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      flag: false,
      singleData: {
        levelLabel: ""
      },
      multipleData: {
        levelLabel: []
      },
      levelList: [],
      //增加会员写死等级 addLevel
      subType: ''
    };
  },
  computed: {
    _width() {
      return "width:" + this.width + "px";
    }
    // allModalList () {
    //   (this.levelList)
    //   return this.levelList
    // }
  },
  watch: {
    "multipleData.levelLabel"(now, old) {
      if (!old.includes("all") && now.includes("all")) {
        this.multipleData.levelLabel = ["all"];
      }

      if (old.includes("all") && now.length > 1) {
        this.multipleData.levelLabel.splice(now.indexOf("all"), 1);
      }
    },
    singleData: {
      handler(val, oldVal) {
        this.singleChange(val);
      },
      deep: true
    },
    multipleData: {
      handler(val, oldVal) {
        this.multipleChange(val)
        // if (this.flag === true) {
        //   this.multipleChange(val);
        //   this.flag = false
        // }
        // this.flag = true
      },
      deep: true
    },
    allModal() {
      this.checkAll();
    }
  },
  mounted() {
    this.checkAll();
  },
  methods: {
    checkAll() {
    },
    async setDefaultLevel(levelLabel, levelName) {
      // 如果跳转页面需要同步等级可以异步调用这个方法
      if (this.mode === "单选") {
        this.singleData.levelLabel = +levelLabel;
        this.singleData.levelName = levelName;
        this.$set(this.singleData, "levelLabel", +levelLabel);
      } else {
        if (typeof levelLabel == "string") {
          let arr = levelLabel.split(",");
          let newLevelLabel = []
          arr.forEach(item => {
            newLevelLabel.push(Number(item))
          });
          this.multipleData.levelLabel = newLevelLabel;
        } else {
          this.multipleData.levelLabel = levelLabel;
        }
      }
    },
    async init(siteId, defaultLevel) {
      if (this.levelType === "member") {
        if (this.subType === 'addLevel') {
          this.levelList = this.$store.state.info.memberLevelList
          this.subType = ''
        } else {
          this.levelList = await this.getMemberLevel(siteId, "select");
        }
      } else if (this.levelType === "agency") {
        this.levelList = await this.getAgencyLevel(siteId, "select");
      } else if(this.levelType === "finance"){
         this.levelList = await this.getFinanceMemberLevelData(siteId, "select");
      }else if(this.levelType=='group'){
           this.levelList = await this.getMemberGroupList(siteId, "select");
      }
      else if (this.levelType === 'refund') {
        this.levelList = this.$store.state.info.memberLevelList
      }
      if (defaultLevel) {
        const { levelLabel, levelName } = defaultLevel;
        this.setDefaultLevel(levelLabel, levelName);
      }
      return this.levelList;
    },
    singleChange(val) {
      if (this.multipleData.levelLabel.includes("all")) {
        const data = {
          levelLabel: [],
          levelName: []
        };
        const levelLabel = [];
        this.levelList.forEach(item => {
          data.levelLabel.push(item.levelLabel);
          data.levelName.push(item.levelName);
          levelLabel.push(item.levelLabel);
        });
        this.$emit("on-level-change", data);
      } else {
        let data = { ...this.singleData };
        this.levelList && this.levelList.forEach(le => {
          if (val.levelLabel == le.levelLabel) {
            data.levelName = le.levelName;
            data.id = le.id;
            data.levelAlias=le.levelAlias
          }
        });
        this.$emit("on-level-change", data);
      }
    },
    multipleChange(val) {
      if (this.multipleData.levelLabel.includes("all")) {
      const data = {
          levelLabel: [],
          levelName: []
        };
        const levelLabel = [];
        this.levelList.forEach(item => {
          data.levelLabel.push(item.levelLabel);
          data.levelName.push(item.levelName);
          levelLabel.push(item.levelLabel);
        });
        this.$emit("on-level-change", data);
      } else {
        let data = JSON.parse(JSON.stringify(this.multipleData))
        data.levelName = [];
        this.levelList.forEach(le => {
          data.levelLabel &&
            data.levelLabel.forEach(dle => {
              if (dle == le.levelLabel) {
                data.levelName.push(le.levelName);
              }
            });
        });
        this.$emit("on-level-change", data);
      }
    },
    getMemberLevel(siteId, purpose) {
      return getMemberLevelData({ siteId, purpose }).then(res => {
        if (res != undefined && res.code == 200) {
          this.$emit("sendLevelName", res.data);
          return res.data;
        }
      });
    },
    getAgencyLevel(siteId, purpose) {
      return getAgencyLevelData({ siteId, purpose }).then(res => {
        if (res != undefined && res.code == 200) return res.data;
      });
    },
    getFinanceMemberLevelData(siteId){
      return getFinanceMemberLevelData({ siteId }).then(res => {
        if (res != undefined && res.code == 200) return res.data;
      });

    },
    // 
     getMemberGroupList(siteId){
      return getMemberGroupList({ siteId }).then(res => {
        if (res != undefined && res.code == 200) return res.data;
      });

    },
    // 清空多选默认值
    reset(val) {
      if (typeof val === 'undefined') {
        this.multipleData.levelLabel = [];
      } else if (val === 'single') {
        this.singleData.levelLabel = ''
      }
    },
    changeSubType (val) {
      this.subType = val
    }
  }
};
</script>
<style  lang="less" scoped>

.levelSect.ivu-select-item-selected::after{
  right: 3px!important;
}

</style>
