<template>
  <div class="v2-details">
    <div class="items mt15">
      <div class="title">基础信息</div>
      <div class="section br flex-row">
        <div class="row ti20 w25 btl w20">
          <div class="col bb">等级名称:{{basic.levelName}}</div>
          <div class="col">默认等级：是</div>
        </div>
        <div class="row ti20 w25 btl w20">
          <div class="col bb">等级别称：{{basic.levelAlias}}</div>
          <div class="col"></div>
        </div>
        <div class="row ti20 w25 btl w20">
          <div class="col bb">最低下注：{{basic.lessBetAmount}}</div>
        </div>
        <div class="row ti20 w25 btl w20">
          <div class="col bb">最大返水：{{basic.maxBonusAmonut}}</div>
        </div>
      </div>
      <div class="remarks ti20 b">备注：{{basic.remark}}</div>
    </div>
    <div class="items mt15">
      <RefundSelect :data="refund"></RefundSelect>
    </div>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import { getrefundLevelDetailData } from "@/api/member";
import RefundSelect from "@/components/refund-select";
export default {
  components: { Icons, RefundSelect },
  data() {
    return {
      basic: [],
      refund: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let data = this.$route.query;
      getrefundLevelDetailData(data).then(res => {
        const { basic, refund } = res.data;
        this.basic = basic;
        this.refund = refund;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.section.flex-row {
  align-items: baseline;
}
/deep/.ivu-collapse-content {
  padding: 0;
}
.ivu-collapse-content > .ivu-collapse-content-box {
  padding: 0;
}
.ivu-collapse {
  border: none;
}
.info {
  justify-content: flex-start;
}
</style>
