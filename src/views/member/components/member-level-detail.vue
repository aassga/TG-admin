<template>
  <Modals ref="memberLevelDetailModal" :title="modalTitle" :width="650">
    <div slot="content" class="box">
      <p>
        <span>等级名称：</span>
        <span>{{data.levelName}}</span>
      </p>
      <p>
        <span>等级别称：</span>
        <span>{{data.levelAlias}}</span>
      </p>
      <p>
        <span>会员人数：</span>
        <span>{{data.agency_count}}</span>
      </p>
      <p>
        <span>最小存款：</span>
        <span>{{data.minPay}}</span>
      </p>
      <p>
        <span>打码倍数：</span>
        <span>{{data.betAmount}}</span>
      </p>
      <p>
        <span>最大单笔：</span>
        <span>{{data.maxDeposit}}</span>
      </p>
      <p>
        <span>取款打码倍数：</span>
        <span>{{data.multiple}}</span>
      </p>
      <p>
        <span>彩金奖励：</span>
        <span>{{data.giftBonus}}</span>
      </p>
      <p>
        <span>等级状态：</span>
        <span :class="data.status==='yes'?'':'red-font'">{{data.status==='yes'?'启用':'停用'}}</span>
      </p>
      <p>
        <span>备注信息：</span>
        <span>{{data.remark||'-'}}</span>
      </p>
      <p>
        <span>是否默认：</span>
        <span :class="data.default==='yes'?'':'red-font'">{{data.default==='yes'?'是':'否'}}</span>
      </p>
      <p>
        <span>创建时间：</span>
        <span>{{$root.unixTime(data.created_at)}}</span>
      </p>
      <p>
        <span>更新时间：</span>
        <span>{{$root.unixTime(data.updated_at)}}</span>
      </p>
    </div>
  </Modals>
</template>
<script>
import Modals from "@/components/modals";
export default {
  components: { Modals },
  props: {
    data: {
      type: Object,
      default: () => {}
    }  
  },
  data() {
    return {
      modalTitle: "等级详情"
    };
  },
  methods: {
    show() {
      this.$refs.memberLevelDetailModal.show();
    },
    spinShow() {
      this.$refs.memberLevelDetailModal.spinShow();
    },
    spinHide() {
      this.$refs.memberLevelDetailModal.spinHide();
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  p {
    width: 60%;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 160px;
    span {
      padding-left: 30px;
    }
  }
}
</style>

