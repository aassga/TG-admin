<template>
  <div>
    <div class="mb20 mt20">基础设置</div>
    <div class="clearfix">
      <p class="fl w25 b h40">
        <span class="pr20 pl20">等级名称：</span>
        <span>{{detailData.levelName}}</span>
      </p>
      <p class="fl w25 bt bb br h40">
        <span class="pr20 pl20">等级别称：</span>
        <span>{{detailData.levelAlias}}</span>
      </p>
      <p class="fl w25 bt bb br h40">
        <span class="pl20 pr20">最低下注：</span>
        <span>{{detailData.lessBetAmount}}</span>
      </p>
      <p class="fl w25 bt bb br h40">
        <span class="pl20 pr20">最大返水：</span>
        <span>{{detailData.maxBonusAmonut}}</span>
      </p>
      <p class="fl w25 bl br h40">
        <span class="pr20 pl20">默认等级：</span>
        <span>{{detailData.default == "yes" ? "是" : "否"}}</span>
      </p>
      <p class="fl w75 br h40">
        <span class="pl20 pr20">备注：</span>
        <span>{{detailData.remark ? detailData.remark : '暂无备注'}}</span>
      </p>
    </div>
    <RefundSelect :data="refund"></RefundSelect>
  </div>
</template>

<script>
import { systemMemberRefundLevelList } from '@/api/system';
import RefundSelect from '_c/refund-select';
export default {
  name: 'sysPreRefundDetail',
  components: {
    RefundSelect
  },
  data() {
    return {
      detailData: {}, //需要的详情数据,
      refund: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(){
      let { id, limit } = this.$route.query
      let data = { params: { limit },query:{page: 1 }}
      systemMemberRefundLevelList(data).then(res => {
        let data = res.data.data
        this.detailData = data.filter(item => item.id == id)[0]
        this.refund = this.detailData.list
      })
    }
  }
}
</script>

<style lang="less" scoped>
.h40{
  height: 50px;
  line-height: 50px;
}
</style>

