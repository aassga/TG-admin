<template>
  <div>
    <div class="mb20 hh36 v3-button">
      <Button  class="ft16 w80x mr20 parentBtn" @click="goBack">
        返回
      </Button>
    </div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :page="false"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import { getUserType } from '@/libs/util';
import { fastLottery } from '@/api/lottery';
export default {
  name: "siteLottery",
  components: {
    Tables, Icons
  },
  data() {
    return {
      table: {
        loading: true,
        total: 0,
        title: "快速彩票",
        data: [],
        columns: [
          {
            title: '彩票名称',
            key: "lotteryName",
            align: "center",
            minWidth:75
          },
          {
            title: "有效投注",
            key: "betAmount",
            align: "center",
            minWidth:85
          },
          {
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            minWidth:85
          },
          {
            title: "设置杀数",
            key: "configRate",
            align: "center",
            minWidth:55
          },
          {
            title: '实际杀数',
            key: 'rate',
            align: 'center',
            minWidth:55
          },
          {
            title: '总杀数',
            key: 'totalRate',
            align: 'center',
            minWidth: 55
          },
          {
            title: '奖池',
            key: 'prizePool',
            align: 'center',
            render: (h, params) => <span>{this.$root.keepTwo(params.row.prizePool)}</span>
          },
          {
            title: '当期投注金额',
            key: 'nowbetAmount',
            align: 'center',
            minWidth: 80,
            render: (h, params) => <span>{this.$root.keepTwo(params.row.nowbetAmount)}</span>
          },
          {
            title: '当期投注人数',
            key: 'betUserCount',
            align: 'center',
            minWidth: 80,
            render: (h, params) => <span>{params.row.betUserCount}</span>
          }
        ]
      }
    };
  },
  mounted() {
    if (!this.$route.query.rateType) {
      this.getData({ siteId: this.$route.query.siteId})
    } else {
      const {siteId,rateType}=this.$route.query;
      this.getData({ siteId, rateType})
    }
  },
  methods: {
    getData(data) {
      this.$root.startTableLoading(this);
      fastLottery(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { list, total } = res.data
          list.length && list.push(this.createTotalData(total));
          this.table.data = list
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    createTotalData(total) {
      const {betAmount,betUserCount,netAmount,nowbetAmount,prizePool,rate,totalRate} = total
      let item = {
        lotteryName: '总计',betAmount,netAmount,configRate: '-',rate,totalRate,prizePool,nowbetAmount,betUserCount
      }
      return item
    },
    goBack() {
      this.$router.push({
        name: 'fastLotteryAll',
        query: {
          lotteryName: this.$route.query.lotteryName,
          lotteryId: this.$route.query.lotteryId
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.w260x {
  width: 260px;
  height: 30px;
}
.gd {
  height: 50px;
}
/deep/.ivu-form-item-error-tip {
  top: 0;
  left: 270px;
}
.hh36 {
  height: 36px;
  line-height: 36px;
}
.parentBtn{
  position: relative;
}
.childIcon{
  position: absolute;
  left: 10px;
}

</style>

