<template>
  <Modals title="会员打码详情" ref="code" width="900">
    <div slot="content" class="mb20">
      <Tables
        class="ml20 mr20"
        :height="table.data.length > 9 ? '568' : ''"
        :page="false"
        :more="table.more"
        :value="table.data"
        :columns="table.columns"
      >
        <!-- <div slot="footer" class="clearfix">
          <span class="txt-a ib w15h br">统计</span>
          <span class="pl25 pr25">
            最后所需打码量
            <span>{{codeNext.needBetAmount}}</span>
          </span>
          <span class="pl25 pr25 ib">
            现有打码量
            <span>{{codeNext.amount}}</span>
          </span>
          <span class="pl25 pr25">
            是否满足提款要求
            <span :class="color">{{codeNext.betAmount}}</span>
          </span>
        </div> -->
      </Tables>
    </div>
  </Modals>
</template>
<script>
import Modals from "_c/modals";
import Tables from "_c/tables";
import { checkBetAmount } from "@/api/finance";
export default {
  props: ["uid"],
  components: {
    Modals,
    Tables
  },
  data() {
    return {
      codeNext: {},
      color: "",
      table: {
        data: [],
        columns: [
          {
            title: "类型",
            key: "type",
            align: "center",
            tooltip: true
          },
          {
            title: "金额",
            key: "amount",
            align: "center"
          },
          {
            title: "打码倍数",
            key: "multiple",
            align: "center"
            // width: 75,
            // tooltip: true
          },
          {
            title: "已打码",
            key: "betAmount",
            align: "center",
          },
          {
            title: "累计所需打码量",
            key: "needBetAmount",
            align: "center",
            minWidth: 70
          },
          // {
          //   title: '账号余额',
          //   key: 'walletMoney',
          //   align: 'center',
          //   render: (h, params) => <span>{Number(params.row.walletMoney).toFixed(2)}</span>
          // },
          {
            title: "时间",
            key: "time",
            align: "center",
            minWidth:40,
            render: (h, params) => (
              <span>{this.$root.newUnixTime(params.row.time)}</span>
            )
          }
        ]
      }
    };
  },
  mounted() {
    this.table.data = [];
    this.codeNext = {};
  },
  methods: {
    getCodeDetail() {
      this.$refs.code.show();
      this.$refs.code.spinShow()
      let data = { uid: this.uid, siteId: this.$root.nowSite.id };
      if (data.uid) {
        checkBetAmount(data).then(res => {
          this.$refs.code.spinHide()
          if (res != undefined && res.code == 200) {
            this.table.data = res.data;
            if (this.table.data.length > 0) {
              this.codeNext = { needBetAmount: this.table.data[this.table.data.length - 1] .needBetAmount,
                amount: this.table.data[this.table.data.length - 1].betAmount,
                betAmount:
                  this.table.data[this.table.data.length - 1].betAmount == 0
                    ? "否"
                    : "是"
              };
              this.color = this.codeNext.betAmount == "否" ? "red-font" : "";
            } else {
              this.codeNext = {}
            }
          } else {
            this.table.data = [];
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.w15h {
  width: 15.4%;
}
/deep/.ivu-table-border th:nth-child(6){
  border-right: none;
}
/deep/.ivu-table-row .ivu-table-column-center:nth-child(6){
  border-right: 0;
}

/deep/.ivu-form-item-content{width:270px;}
/deep/.ivu-table-header{
  font-size: 1rem;
  font-weight:normal;
  .ivu-table-cell{
    font-weight: 549;
  }
}
/deep/.ivu-table {

  color:#444;
}
</style>