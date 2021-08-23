<template>
  <div>
    <div class="clearfix">
      <p class="pt10 pb10 f6f8-bg pl20 bl bt br">站点详情</p>
      <div class="w20 fl h40 bt bb bl br">
        <span class="pl20">站点名称：</span>
        <span>{{siteInfo.siteName}}</span>
      </div>
      <div class="w20 fl bt bb br h40">
        <span class="pl20">站点代号：</span>
        <span>{{siteInfo.siteCode}}</span>
      </div>
      <div class="w20 fl bt bb br h40">
        <span class="pl20">网站维护：</span>
        <span>{{siteInfo.siteConfig.close.status == 'on' ? '维护中' : '正常' }}</span>
      </div>
      <div class="w20 fl bt bb br h40">
        <span class="pl20">创建人：</span>
        <span>{{siteInfo.createUserName}}</span>
      </div>
      <div class="w20 fl bt bb br h40">
        <span class="pl20">创建时间：</span>
        <span>{{siteInfo.created_at ? this.$root.newUnixTime(siteInfo.created_at) : '-'}}</span>
      </div>
    </div>
    <div v-if="$root.checkCommission()" class='bl br bb'>
      <RebateSelect :data="siteInfo.rebate" title='detail'></RebateSelect>
    </div>
    <div class="clearfix" v-if="exitId">
      <p class="pt10 f6f8-bg pb10 b btnone pl20">佣金信息</p>
      <p class="pl20 pt20 pb20 bl br bbd">佣金规则设置</p>
      <div class="bbd bl br">
        <p class="h40 pl20 pt10 pb10">代理佣金体验阶段<span class="c3Color pl20">（满足则可继续进行转账，超过则不可再次转账）</span></p>
        <p class="h40 pl20">收入转账至余额>=<span class="pl20">{{commissionInfo.limit_amount}}</span><span class="pl20">或转账次数>=</span><span class="pl10">{{commissionInfo.draw_money_num}}</span></p>
      </div>
      <div class="bl br bbd">
        <p class="pl20 h40 pt10 pb10">代理佣金转账激活<span class="c3Color">（满足则可再次转账，永久有效）</span></p>
        <p class="pl20 h40">单个会员存款>=<span class="pl10">{{commissionInfo.deposit_amount}}</span><span class='pl20'>且会员个数>=</span><span class="pl10">{{commissionInfo.valid_member}}</span><span class="pl10 pr10">|</span><span class="pl20">且总存款>=</span><span class="pl10">{{commissionInfo.total_amount}}</span><span class="pl20">且总投注>=</span><span class="pl10">{{commissionInfo.total_bet}}</span></p>
      </div>
    </div>
    <div v-if="exitId" class="bl br pt15">
      <CommissionSelect :data='commissionData' title="detail"></CommissionSelect>
    </div>
    <div class="clearfix mt30 bt">
      <p class="pt10 pb10 f6f8-bg pl20 bl br">站点配置</p>
      <div class="w40 b h40 fl ft12">
        <span class="pl20">公司入款最低存款：</span>
        <span>{{siteInfo.siteConfig.limit.paymentLimit}}</span>
      </div>
      <div class="w30 fl h40 bt bb br ft12">
        <span class="pl20">存款优惠：</span>
        <div v-if="siteInfo.siteConfig.limit.depositPreferentialType == '1'" class="ib">
          <span>实时发放</span>
          <span class="pl5 pr5">-</span>
          <span>{{String(siteInfo.siteConfig.limit.paymentBonus).includes('%') ? siteInfo.siteConfig.limit.paymentBonus : `${siteInfo.siteConfig.limit.paymentBonus}%`}}</span>
        </div>
        <div v-else class="ib">
          <span>按天发放</span>
          <span class="pl5 lr5">-</span>
          <span class="blue-font cs" @click="showDetail">优惠详情</span>
        </div>
      </div>
      <div class="w30 fl h40 bt bb br ft12">
        <span class="pl20">最低取款：</span>
        <span>{{siteInfo.siteConfig.limit.withdrawalsLimit}}</span>
      </div>
      <!-------------------->
      <div class="w40 fl h40 bb br bl ft12">
        <span class="pl20">是否需要打码：</span>
        <span>{{siteInfo.siteConfig.limit.withdrawalsMultiple == 0 ? '否' : '是'}}</span>
      </div>
      <div class="w30 fl h40 br bb ft12">
        <span class="pl20">彩票最低下注金额：</span>
        <span>{{siteInfo.siteConfig.limit.lotteryBetMin}}</span>
      </div>
      <div class="w30 fl h40 bb br ft12">
        <span class="pl20">彩票最高下注金额：</span>
        <span>{{siteInfo.siteConfig.limit.lotteryBetMax}}</span>
      </div>
      <!------------------>
      <div class="w40 fl h40 bb br bl ft12">
        <span class="pl20">取款金额 <= </span>
        <span>{{this.$root.text(siteInfo.siteConfig.limit.checkBetAmount)}}</span>
        <span class="pl20 ">且</span>
        <span class="pl20">现金占比 <= </span>
        <span>{{this.$root.text(siteInfo.siteConfig.limit.moneyProportion)}}%</span>
      </div>
      <!-- <div class="w30 fl h40 bb br ft12">
        <span class="pl20">自动出款上限：</span>
        <span>{{this.$root.text(siteInfo.siteConfig.limit.onlineForceAudit)}}</span>
      </div> -->
      <div class="w30 fl h40 bb br ft12">
        <span class="pl20">佣金最低转账：</span>
        <span>{{this.$root.text(siteInfo.siteConfig.limit.transAmount)}}</span>
      </div>
      <div class="w30 fl h40 bb br ft12">
        <span class="pl20">运营模式：</span>
        <span>{{siteInfo.siteConfig.site_model == 'invite_link' ? '邀请链接' : '邀请码'}}</span>
      </div>
      <div class="w40 fl h40 text bb br bl ft12">
        <span class="ib" v-if="this.$root.text(siteInfo.siteConfig.app_domain)=='-'">
         <span class="pl20">APP域名：</span> {{this.$root.text(siteInfo.siteConfig.app_domain)}}
        </span>
        <Tooltip placement="bottom" max-width="1500" v-if="this.$root.text(siteInfo.siteConfig.app_domain)!='-'">
              <span class="ib w100 text-overflow-ellipsis"><span class="pl20">APP域名：</span>{{siteInfo.siteConfig.app_domain}}</span>
              <div slot="content">{{siteInfo.siteConfig.app_domain}}</div>
        </Tooltip>
      </div>
      <div class="w30 fl h40 br bb text ft12">
        <span class="pl20">静态资源路径：</span>
        <span>{{this.$root.text(siteInfo.siteConfig.statics)}}</span>
      </div>
      <div class="w30 fl h40 br bb ft12">
        <span class="pl20">PC注册填写项：</span>
        <span>{{this.$root.text(reg.pc)}}</span>
      </div>
      <div class="w40 fl br h40 bb bl ft12">
        <span class="pl20">H5注册填写项：</span>
        <span>{{this.$root.text(reg.h5)}}</span> 
      </div>
      <div class="w30 fl br h40 bb ft12">
        <span class="pl20">APP注册填写项：</span>
        <span>{{this.$root.text(reg.app)}}</span>
      </div>
    </div>
    <Modals ref="detail" title="优惠详情" width='560'>
      <div slot="content">
        <div class="top pl10">
          <span style="fontWeight: bold;">支付方式：</span>
          <span v-for="(t,i) in detailInfo.methods" :key="'method' + i" class="pr5 pSpan">{{t}}<span class="pl5 span">-</span></span>
        </div>
        <div class="bottom ml20 mr20 mt20 mb20">
          <Tables :page='false' :value='detailInfo.table.data' :columns='detailInfo.table.columns'></Tables>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import RebateSelect from "_c/rebate-select";
import CommissionSelect from '_c/commission-select';
import { siteManagementDetail, preferentialPaymentClass } from "@/api/system";
import Modals from '_c/modals'
import Tables from '_c/tables'
export default {
  name: "siteDetail",
  components: {
    RebateSelect,CommissionSelect,Modals,Tables
  },
  data() {
    return {
      appShow:false,
      exitId: false,
      commissionData: {},
      siteInfo: {
        siteConfig: {
          limit: {},
          activity_pic_size: {},
          banner_pic_size: {},
          close: {},
          register: {
            pc: [],
            app: [],
            h5: []
          },
          Android: {},
          IOS: {},
          service:{}
        }
      },
      reg: {
        pc: [], app: [], h5: []
      },
      commissionInfo: {
        limit_amount: '',
        draw_money_num: '',
        deposit_amount: '',
        valid_member: '',
        total_amount: '',
        total_bet: ''
      },
      checkList: [
        { name: "手机", value: "phone" },
        {name:"短信验证",value:"msm"},
        { name: "邮箱", value: "email" },
        { name: "微信", value: "wechat" },
        { name: "真实姓名", value: "realName" },
        { name: "支付密码", value: "payPassword" },
        { name: "注册开关", value: "registerOnOff" },
        { name: '短信', value: 'sms'}
      ],
      methodsList: [],
      detailInfo: {
        methods: [],
        table: {
          data: [],
          columns: [
            {
              title: '存款打码倍数',
              key: 'codeMultiples',
              align:'center'
            },
            {
              title: '优惠比例',
              key: 'preferential',
              align: 'center',
              render: (h,params) => <span>{`${params.row.preferential}%`}</span>
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      let id = this.$route.query.siteListId;
      this.getData({ id });
    });
  },
  methods: {
    getData(data) {
      siteManagementDetail(data).then(res => {
        if (res != undefined && res.code == 200) {
          if (res.data.siteConfig.limit.depositPreferentialType == '2') this.getMethods()
          if (res.data.personal_commission_mode !== 'no') {
            let newData = { platForm: res.data.platform, info: res.data.commission_info}
            this.getCommissionData(newData)
          }
          this.siteInfo = res.data;
          console.log(this.siteInfo)
          console.log(this.siteInfo.siteConfig.app_domain)
          console.log(this.siteInfo.siteConfig.app_domain.split(','))
          // 处理异常数据
          if(!this.siteInfo.siteConfig.activity_pic_size){
            this.siteInfo.siteConfig.activity_pic_size = { pc: '', app: ''}
          }
          if(!this.siteInfo.siteConfig.banner_pic_size) {
            this.siteInfo.siteConfig.banner_pic_size = { pc: '',app: ''}
          }
          let { paymentBonus } = this.siteInfo.siteConfig.limit
          if(String(paymentBonus).includes('.') && (String(String(paymentBonus).split('.')[1].length > 1))) {
            this.siteInfo.siteConfig.limit.paymentBonus = paymentBonus.toFixed(1)
          }
          // 转换注册配置项里的配置
          for (let key in this.siteInfo.siteConfig.register) {
            if (this.siteInfo.siteConfig.register[key].length > 0) {
              this.siteInfo.siteConfig.register[key].forEach(item => {
                let temp = this.checkList.find(t => t.value == item).name
                this.reg[key].push(temp)
              })
            }
          }
          for (let key in this.reg) {
            this.reg[key] = this.reg[key].length > 0 ? this.reg[key].join(',') : ''
          }
        }
      });
    },
    getCommissionData(data) {
      let { info, platForm } = data
      if (info.platform_config != null) {
        this.exitId = true
        let { limit_amount, draw_money_num, deposit_amount, valid_member, total_amount, total_bet } = info
        this.commissionInfo.limit_amount = limit_amount
        this.commissionInfo.draw_money_num = draw_money_num
        this.commissionInfo.deposit_amount = deposit_amount
        this.commissionInfo.valid_member = valid_member
        this.commissionInfo.total_amount = total_amount
        this.commissionInfo.total_bet = total_bet
        if (info.platform_config == null) {
          for(let key in platForm) {
            platForm[key].child_platform.forEach(item => item.value = 0)
          }
        } else {
          let obj = info.platform_config
          for (let key in obj) {
            for (let y in platForm) {
              if (platForm[y].class_id == key) {
                platForm[y].child_platform.forEach(item => {
                  for (let x in obj[key]) {
                    if (x == item.id) item.value = obj[key][x]
                  }
                })
              }
            }
          }
        }
        this.commissionData = platForm
      }
    },
    getMethods() {
      preferentialPaymentClass().then(res => {
        if (res != undefined && res.code == 200) this.methodsList = res.data
      })
    },
    showDetail() {
      let { payments, preferential_config } = this.siteInfo.siteConfig
      let ids = String(payments).includes(',') ? payments.split(',').map(t => Number(t)) : [Number(payments)]
      this.methodsList.forEach(t => {
        if (ids.includes(t.id)) this.detailInfo.methods.push(t.className)
      })
      this.detailInfo.table.data = preferential_config
      this.$refs.detail.show()
    }
  }
};
</script>
<style lang="less" scoped>
.btnone{border-top: none;}
.h40 {
  height: 40px;
  line-height: 40px;
}
.lh40 {
  line-height: 40px;
}
.text{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  height: 40px;
  -webkit-line-clamp: 1; //要显示几行,需要高度和宽度。
  -webkit-box-orient: vertical;
}
.ivu-collapse { border-top: none;}
.pSpan:nth-last-child(1) {
  .span:nth-last-child(1){ display: none; }
}
/deep/.ivu-tooltip-rel{
  height:40px;
}
/* /deep/.ivu-tooltip-popper,.ivu-tooltip-dark{
  position: absolute;
    will-change: top, left;
    top: 703px!important;
    left: 75px;


} */
</style>

