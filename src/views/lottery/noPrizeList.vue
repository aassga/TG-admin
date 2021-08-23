<template>
  <div>
    <div class="v2-search">
      <Form inline ref="searchKey">
        <FormItem label="开始时间">
          <DatePicker type="date" placeholder="开始时间" v-model="Time[0]" class="s-160"></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker type="date" placeholder="结束时间" v-model="Time[1]" class="s-160"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" @click.prevent="searchSubmit" :loading="$root.tableLoading" >查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :more="table.more"
        :page="false"
      >
      <div slot="more">
        <p class="f-color">温馨提示：此列表展示的是过期未开奖彩票</p>
      </div>
      </Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import { lotteryNoNumLottery, lotteryRevocation } from "@/api/lottery";
import { getUserType } from '@/libs/util';
export default {
  name: "noPrizeList",
  components: {
    Tables
  },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      searchKey: {
        startTime: this.$root.startTime(),
        endTime: this.$root.formatnightTimeS()
      },
      Time: [this.$root.startTime(), this.$root.formatnightTimeS()],
      table: {
        loading: false,
        title: "当前开奖期",
        data: [],
        more: true,
        columns: [
          {
            title: "日期",
            key: "date",
            align: "center"
          },
          {
            title: "期数",
            key: "issue",
            align: "center"
            // render: (h, params) => <span>{this.$root.removeYear(params.row.issue)}</span>
          },
          {
            title: "彩票名称",
            key: "lotteryName",
            align: "center"
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => {
              return h(
                "a",
                {
                  style: {
                    display: (this.adminType == 'super') || (this.authInPage.indexOf('lotteryRevocation') != -1) ? 'inline-block' : 'block'
                  },
                  on: {
                    click: () => {
                      const { lotteryId, issue, date, lotteryName } = params.row;
                      this.$Tip.confirm({
                        content: `您确定撤销${lotteryName}【${issue}】彩票吗？撤销后将返还所有会员投注!`,
                        onOk: () => {
                          let postData = {
                            lid: lotteryId,
                            issue: String(issue),
                            siteId:  this.$root.nowSite.id
                          };
                          lotteryRevocation(postData, true).then(res => {
                            if(res != undefined && res.code == 200) {
                              this.$Message.config({
                                top: 50,
                                duration: 1
                              })
                              this.$Message.success(res.data)
                            }
                          })
                        }
                      })
                    }
                  }
                },
                "撤单"
              );
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getData(this.searchKey)
  },
  methods: {
    getData(data) {
      this.$root.startTableLoading();
      lotteryNoNumLottery(data).then(res => {
        if (res != undefined && res.code == 200) {
          this.table.data = res.data;
        this.table.total = res.data.length;
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading())
    },
    searchSubmit() {
      let params = {};

      if (this.$root.validateTime(this.Time)) {
        let [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTime(startTime);
        params.endTime = endTime && this.$root.formatTime(endTime);
      } else {
        return false;
      }
      let { startTime, endTime } = params
       if(!params.startTime && !params.endTime){
        this.$Tip.info({ content: '请输入开始和结束时间！'})
        return false
      }
      let standard = ((this.$moment(endTime).valueOf())-(this.$moment(startTime).valueOf()))/1000/60/60/24
      if(standard > 7){
        this.$Tip.info({content: '当前列表仅支持查询7天内的数据'})
      }else{
        for (let item in params) {
          if (!params[item]) delete params[item];
        }
        if (!params.content) {
          delete params.typeTag;
        }
        this.getData(params);
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
