<template>
  <div>
    <!-- v2-button -->
    <div class="mb20 hh36 v3-button ">
      <Button   class="ft16 w80x mr20 parentBtn" @click="() => { this.$router.push({name: 'fastLottery'}) }">
        返回
      </Button>
    </div>
    <div class="v2-table">
      <Tables
        :loading='$root.tableLoading'
        :columns="table.columns"
        :value="table.data"
        :page='false'
        :show-sizer='false'
        @on-expand='onExpand'
      ></Tables>
    </div>
    <Modals ref="editSetting" title="设置杀数" width='560'>
      <div slot="content">
        <Form ref="editSet" :label-width='150' style="width: 560px;">
          <FormItem label='设置杀数'>
            <InputNumber :step='0.01' class="w260x" v-model="editSet.configRate"/>%
          </FormItem>
           <FormItem>
              <Button class="ivu-btn submit w260x gd ft20" @click.prevent="submit" type="primary">确认保存</Button>
            </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from '_c/tables';
import Modals from '_c/modals';
import Icons from '_c/icons';
import { fastLottery, fastLotteryUpdate } from '@/api/lottery'
export default {
  // name: 'fastLotteryAll',
  components: {
    Tables, Modals, Icons
  },
  data() {
    return {
      editSet: {
        configRate: null
      },
      expandData: {},
      spinShow: true,
      table: {
        loading: true,
        data: [],
        columns: [
          {
            title: '站点名称',
            key: 'siteName',
            align: 'center',
            render: (h, params) => {
              if (params.row.siteName != '总计') {
                return  <a onClick={() => {
                this.$router.push({
                  name: 'siteLottery',
                  query: {
                    siteId: params.row.siteId,
                    siteName: params.row.siteName,
                    lotteryName: this.$route.query.lotteryName,
                    lotteryId: this.$route.query.lotteryId
                  }
                })
              }}>{this.$root.text(params.row.siteName)}</a>
              } else {
                return <span>总计</span>
              }
            }
          },
          {
            title: '有效投注',
            key: 'betAmount',
            align: 'center'
          },
          {
            title: '会员输赢',
            key: 'netAmount',
            align: 'center'
          },
          {
            title: '设置杀数',
            key: 'configRate',
            align: 'center'
          },
          {
            title: '实际杀数',
            key: 'rate',
            align: 'center'
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
            title: '投注金额',
            key: 'nowbetAmount',
            align: 'center',
            minWidth: 80,
            render: (h, params) => <span>{this.$root.keepTwo(params.row.nowbetAmount)}</span>
          },
          {
            title: '投注人数',
            key: 'betUserCount',
            align: 'center',
            minWidth: 80
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.siteName == '总计') return <span>-</span>
              else return <a onClick={() => { this.onEdit(params, 'site') }}>设置杀数</a>
            }
          },
          {
            type: 'expand',
            align: 'center',
            title: '...',
            width: 50,
            render: (h, params) => {
						 if(params.row.siteName=='总计')return
						 else 
						  return (
                <div>
                <Spin size="large" style={{display: this.spinShow ? 'block' : 'none'}} fix></Spin>
                <table style={{width: '100%', borderTop: "1.5px solid #dcdcdc", borderLeft: "1.5px solid #dcdcdc"}} cellspacing="0" cellpadding="0" border='0'>
                {
                  this.expandData[params.index] && this.expandData[params.index].map(t => {
                    return (
                      <tr>
                        <td style={{textAlign: 'center',}}  class="blue-font"
                        onClick={() => {
                            if (this.$root.text(t.userName)) {
                              this.$router.push({
                                name: 'siteLottery',
                                query: {
                                  lotteryName: this.$route.query.lotteryName,
                                  lotteryId: this.$route.query.lotteryId,
                                  rateType:t.rateType,
                                  siteId:t.siteId
                                }
                              })
                            }
                          }}

                        >{t.rateType=='default'?"正常杀数":"高杀数"}</td>
                        <td style={{textAlign: 'center'}}>{t.betAmount}</td>
                        <td style={{textAlign: 'center'}}>{t.netAmount}</td>
                        <td style={{textAlign: 'center'}}>{t.configRate}</td>
                        <td style={{textAlign: 'center'}}>{t.rate}</td>
                        <td style={{textAlign: 'center'}}>{t.totalRate}</td>
                        <td style={{textAlign: 'center'}}>{this.$root.keepTwo(t.prizePool)}</td>
                        <td style={{textAlign: 'center'}}>{this.$root.keepTwo(t.nowbetAmount)}</td>
                        <td style={{textAlign: 'center'}}>{t.betUserCount}</td>
                        <td style={{textAlign: 'center'}} class='blue-font' onClick={() => { this.onEdit(t, 'table')}}>设置杀数</td>
                      </tr>
                    )
                  })
                }
              </table>
              </div>
              )
            }
          }
        ]
      }
    }
  },
  mounted() {
    const { lotteryId } = this.$route.query
    this.getData({ lotteryId })
  },
  methods: {
    getData(data) {
      this.$root.startTableLoading()
      fastLottery(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { list, total } = res.data
          list.length && list.push(this.createTotalData(total));
          this.table.data = list
          this.table.data.forEach((t,i) => {
            this.expandData[i] = []
          })
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading())
    },
    onExpand(row, status) {
      if (status) {
        this.spinShow = true
        if (this.expandData[row.initRowIndex] && this.expandData[row.initRowIndex].length == 0) {
          let data = { lotteryId: this.$route.query.lotteryId, siteId: row.siteId }
          fastLottery(data).then(res => {
            if (res != undefined && res.code == 200) {
              this.expandData[row.initRowIndex] = res.data.list
            }
            this.spinShow = false
          }).catch(error => this.spinShow = false)
        } else {
          this.spinShow = false
        }
      }
    },
    createTotalData(total) {
      const {betAmount,betUserCount,netAmount,nowbetAmount,prizePool,rate,totalRate} = total
      let item = {
        siteName: '总计',betAmount,netAmount,configRate: '-',rate,totalRate,prizePool,nowbetAmount,betUserCount
      }
      return item
    },
    onEdit(params, type) {
      if (type == 'site') {
        this.editSet.siteId = params.row.siteId
        this.editSet.lotteryId = this.$route.query.lotteryId
        this.editSet.configRate = params.row.configRate ? Number(params.row.configRate) : 0
      for(let key  in this.editSet){
        if(key=='id'){
          delete this.editSet[key]
        }
      }
      } else {
        this.editSet.id = params.id
        this.editSet.siteId = params.siteId
        this.editSet.lotteryId = this.$route.query.lotteryId
        this.editSet.configRate = params.configRate ? Number(params.configRate) : 0
      }
      this.$refs.editSetting.show()
    },
    submit() {
      this.$refs.editSetting.spinShow()
      let data = { ...this.editSet }
      fastLotteryUpdate(data, true)
        .then(res => {
          this.$refs.editSetting.spinHide();
          if (res != undefined && res.code == 200) {
            this.$Message.success('更新成功')
            this.getData({lotteryId: this.$route.query.lotteryId});
            this.$refs.editSetting.hide();
          }
        })
        .catch(error => {
          this.$refs.editSetting.spinHide();
        });
    }
  }
}
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
.parentBtn{
  position: relative;
}
.childIcon{
  position: absolute;
  left: 10px;
}
.hh36 {
  height: 36px;
  line-height: 36px;
}
/deep/.ivu-table-expanded-cell{
  position: relative;
  table{
    background: #ffffff!important;
  }
  div{
    &:nth-child(1) {
      margin-left: -20px;
      margin-right: -20px;
    }
  }
}
</style>

