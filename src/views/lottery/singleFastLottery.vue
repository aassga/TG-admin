<template>
  <div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :page="false"
      ></Tables>
      <!-- 编辑配置 -->
      <Modals ref="editSetting" title="编辑配置" width="560">
        <div slot="content" class="v2-form-wrapper">
          <Form ref="editSet" :label-width="150" style="width:560px;">
            <FormItem label="设置杀数">
              <InputNumber :step="0.01" class="w260x" v-model="editSet.configRate"/><span>%</span>
            </FormItem>
            <FormItem>
              <Button class="ivu-btn submit w260x gd ft20 " @click.prevent="submit" type="primary">确认保存</Button>
            </FormItem>
          </Form>
        </div>
      </Modals>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Modals from "@/components/modals";
import Icons from "@/components/icons";
import { getUserType } from '@/libs/util';
import { fastLotteryBySite, fastLotteryInitBySite, fastLotteryUpdateBySite } from '@/api/lottery';
export default {
  name: "singleFastLottery",
  components: {
    Tables, Modals
  },
  data() {
    return {
      headerLotteryName: [],
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      table: {
        loading: true,
        total: 0,
        title: "快速彩票",
        data: [],
        columns: [
          {
            key: "lotteryName",
            align: "center",
            minWidth:75,
            tooltip:true,
            renderHeader: (h, params) => {
              return <Poptip trigger='hover' placement='right-start' transfer style={{verticalAlign: 'middle'}}>
                <div slot='content' style={{width: '320px'}}>
                  <div style={{width: '300px'}} class='ml10 mr10 b'>
                    <p class='txt-a pt5 pb5'>24h可开奖，达到间隔时间可开奖</p>
                    <div class='clearfix'>
                      <div class='fl w50 txt-a pt5 pb5 br bt'>彩票名称</div>
                      <div class='fl w50 txt-a pt5 pb5 bt'>统计时间</div>
                    </div>
                    {this.headerLotteryName.length > 0 && this.headerLotteryName.map(t => {
                      return (
                        <div class='clearfix'>
                          <div class='fl w50 txt-a pb5 pt5 br bt'>{t.lotteryName}</div>
                          <div class='fl w50 txt-a pt5 pb5 bt'>{this.$moment.unix(t.lastCountTime).format('YYYY/MM/DD HH:mm')}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                  <span>彩票名称</span>
                  <Icons type='bangzhutishi' color='#E4E4E4' style={{paddingLeft: '8px'}}/>
              </Poptip>
            },
          },
          {
            title: "有效投注",
            key: "betAmount",
            align: "center",
            minWidth:100
          },
          {
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            minWidth:100
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
            minWidth: 65,
            render: (h, params) => <span>{this.$root.keepTwo(params.row.prizePool)}</span>
          },
          {
            title: '投注金额',
            key: 'nowbetAmount',
            align: 'center',
            minWidth: 76,
            render: (h, params) => <span>{this.$root.keepTwo(params.row.nowbetAmount)}</span>
          },
          {
            title: '投注人数',
            key: 'betUserCount',
            align: 'center',
            minWidth: 76,
            render: (h, params) => <span>{params.row.betUserCount}</span>
          },
          {
            title: "开奖间隔",
            key: "openTimeSet",
            align: "center",
            minWidth:55,
            render: (h, params) => {
              const { openTimeSet } = params.row;
              let min = Math.floor(openTimeSet / 60)
              let second = openTimeSet % 60
              if (params.row.lotteryName == '总计') return <span>-</span>
              else return <span>{second == 0 ? `${min}分/期` : `${openTimeSet}秒/期`}</span>
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth:160,
            render: (h,params) => {
              if (params.row.lotteryName == '总计') return <span>-</span>
              else return(
                <div>
                  <a class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryDetailBySite') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {this.onDetails(params)}}
                  >预设开奖</a>
                  <a class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryInitBySite') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {this.onInitialize(params)}}
                  >初始化</a>
                  <a class="ib"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryUpdateBySite') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {this.onEdit(params)}}
                  >设置杀数</a>
                </div>
              )
            }
          }
        ]
      },
      editSet: {
        input: 0,
        // level: "",
        // lock: true
      }
    };
  },
  mounted() {
    this.getData(this.$root.nowSite.id)
  },
  methods: {
    // 详情
    onDetails(params) {
      const { lotteryId, lotteryName } = params.row;
      this.$router.push({
        name: "fastLotteryDetails",
        query: { lotteryId, lotteryName, siteId: this.$root.nowSite.id, stage: 'single' }
      });
    },
    //编辑配置
    onEdit(params) {
      const { configRate, lotteryId } = params.row
      this.editSet = { id: params.row.id };
      this.editSet.configRate = configRate ? Number(configRate): 0
      this.$refs.editSetting.show();
    },
    // 初始化
    onInitialize(params) {
      this.$Message.config({
        top: 50, duration: 1
      })
      this.$Tip.confirm({
        content: '您确定要初始化吗?',
        onOk: () => {
          let data = {
            id: params.row.id,
            siteId: this.$root.nowSite.id
          }
          fastLotteryInitBySite(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(res.data)
              this.getData(data.siteId)
            }
          })
        }
      })
    },
    getData(siteId) {
      this.$root.startTableLoading(this);
      fastLotteryBySite({siteId}).then(res => {
        if (res != undefined && res.code == 200) {
          const { list, total } = res.data
          list.length > 0 && list.forEach(t => {
            this.headerLotteryName.push({ lotteryName: t.lotteryName, lastCountTime: t.lastCountTime,netAmount: t.netAmount})
          })
          this.headerLotteryName.sort((a,b) => {
            return Number(b.netAmount) - Number(a.netAmount)
          })
          list.length && list.push(this.createTotalData(total));
          this.table.data = list;
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    createTotalData(total) {
      const {
        betAmount, betUserCount, netAmount, nowbetAmount, prizePool, rate, totalRate
      } = total
      let item = {
        lotteryName: '总计',  betAmount, netAmount, rate,configRate: '-',
        totalRate, prizePool, nowbetAmount, betUserCount
      }
      return item
    },
    //  编辑配置确认
    submit() {
      this.$Message.config({
        top: 50, duration: 1
      })
      this.$refs.editSetting.spinShow();
      let data = { ...this.editSet }
      let { lock, configRate } = this.editSet
      // data.lock = lock == false ? 1 : 0
      data.configRate = configRate
      data.siteId = this.$root.nowSite.id
      fastLotteryUpdateBySite(data, true).then(res => {
        this.$refs.editSetting.spinHide();
        if(res != undefined && res.code == 200){
          this.$Message.success('编辑配置成功')
          this.getData(data.siteId)
          this.$refs.editSetting.hide();
        }
      }).catch(error => {
        this.$refs.editSetting.spinHide();
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
</style>

