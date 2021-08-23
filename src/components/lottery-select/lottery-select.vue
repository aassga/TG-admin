<template>
  <div>
    <Select
      v-model="lotteryName"
      @on-change="onLotteryChange"
      v-if="mode == '大彩种' && stage== 'normal'"
      :clearable="clearable"
      @on-clear="selectClear"
      placeholder="全部"
    >
      <Option
        v-for="item in lotteryList"
        :key="item.id"
        :value="item.id+':'+item.code"
      >{{item.name}}</Option>
    </Select>
    <Select
      v-if="mode !='大彩种' && stage=='normal'"
      v-model="lid"
      placeholder="全部"
      @on-change="onLotteryChange"
      :clearable="clearable"
      @on-clear="selectClear"
    >
      <Option v-for="item in lotteryList" :key="item.id" :value="item.id">{{item.name}}</Option>
    </Select>
    <Select
      v-if="mode=='大彩种' && stage=='odd'"
      v-model="classId"
      placeholder="全部"
      @on-change="onLotteryChange"
      :clearable="clearable"
      @on-clear="selectClear"
    >
      <Option
        v-for="item in lotteryList"
        :key="item.classId"
        :value="item.classId"
      >{{item.className}}</Option>
    </Select>
  </div>
</template>

<script>
import { getlotteryClassData } from "@/api/common";
import { lotteryNameList } from "@/api/lottery";
export default {
  props: {
    mode: {
      type: String,
      default: "大彩种"
    },
    stage: {
      type: String,
      default: "normal"
    },
    clearable: {
      type: Boolean,
      default: true
    },
    xg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lotteryList: [],
      lotteryName: '0:ALL',
      lid: 1,
      classId: ''
    };
  },
  methods: {
    async init() {
      if (this.mode == "大彩种" && this.stage == "normal") {
        await getlotteryClassData().then(res => {
          this.lotteryList = res.data;
        });
        // this.addAll()
      } else if (this.mode == "官方彩" && this.stage == "normal") {
        // this.lid = 1;
        await lotteryNameList().then(res => {
          if (this.xg) {
            this.lid = 2
            this.lotteryList = res.data.sort1.official
            this.lotteryList.forEach((item,index) => {
              if (item.id == 1) this.lotteryList.splice(index, 1)
            })
            this.$emit('on-name-change', this.lotteryList)
          } else {
            this.lid = 1
            this.lotteryList = res.data.sort1.official;
            this.$emit("on-name-change", this.lotteryList);
          }
        });
      } else if (this.mode == "快速彩" && this.stage == "normal") {
        this.lid = 12;
        await lotteryNameList().then(res => {
          this.lotteryList = res.data.sort1.fast;
          this.$emit("on-name-change", this.lotteryList);
        });
      } else {
        await lotteryNameList().then(res => {
          this.lotteryList = res.data.sort2;
          this.$emit('send-all-data', res.data)
        });
      }
      this.$emit('send-officialList', this.lotteryList)
    },
    addAll () {
      this.lotteryList.unshift({id: 0, code: 'ALL', name: '全部'})
    },
    onLotteryChange(lott) {
      if (lott != undefined) {
        if (this.mode == "大彩种" && this.stage == "normal") {
        const [id, code] = lott.split(":");
        this.$emit("on-lottery-change", { id, code });
      } else {
        this.$emit("on-lottery-change", lott);
      }
      }
    },
    // 彩票页面下拉框清空后显示所有数据
    selectClear() {
      this.$emit('clearSelect')
    }
  }
};
</script>
<style lang="less" scoped>
</style>


