<template>
  <div class="v2-search">
    <Form
      ref="agencyLevelAdd"
      :model="agencyInfo"
      :rules="agencyInfoRulesValidate"
      :lable-width="80"
      class="clearfix"
    >
      <FormItem label="代理等级" prop="level" class="w30 fl pb15">
        <Select v-model="agencyInfo.level" class="s-260">
          <Option v-for="(item,index) in levelList" :key="index" :value="item">{{item}}</Option>
        </Select>
      </FormItem>
      <FormItem label="等级别称" prop="name" class="w30 fl pb15">
        <Select v-model="agencyInfo.name" class="s-260">
          <Option v-for="(item,index) in name" :key="index" :value="item.key">{{item.value}}</Option>
        </Select>
      </FormItem>
      <FormItem label="固定日工资" class="w100 fl bt pt15">
        <Poptip  text-overflow-ellipsis trigger="hover" width="550" content="
        发放对象：大股东下直属代理 
        发放周期：每天后台自动发放 
        计算方式：按照当前代理以及代理下级下下级所有会员总的投注额来  
        例如  
        设置 最低投注=5000  日工资=10
        代理每日总投注额1000 日工资为0
        代理每日总投注额5000 日工资为10
        代理每日总投注额为5001 日工资为10
        " placement="right">
          <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
        </Poptip>
      </FormItem>
      <FormItem label="最低投注额" prop="lowestBetting" class="w30 fl pb15">
        <Input placeholder="请输入最低投注" v-model="agencyInfo.lowestBetting" class="s-260"/>
      </FormItem>
      <FormItem label="固定日工资" prop="fixedWage" class="w30 fl pb15">
        <Input placeholder="请输入固定日工资" v-model="agencyInfo.fixedWage" class="s-260"/>
      </FormItem>
      <FormItem label="分红设置" class="w100 fl bt pt15">
        <Poptip text-overflow-ellipsis trigger="hover" width="550"  content=" 
        分红设置伦
        发放对象：大股东下直属代理
        发放周期：半月后台手动发放
        分红＝发放基数发放比列的绝对值
        最低负盈利
        计算方式：按照当前代理以及代理下级下下级所有会员的负盈利来满足最低负盈利要求即可发放
        例如
        设置最低负盈利＝－500000分红比例＝1％
        分红比例（1）代理上半月负盈利4999分年为0下半月负盈利为1，发放基数＝499995000
        －500000．01的色对值，分红为5000
        （2）代理上半月盈利2000分红为0：下半月负盈利为－505000，发放基数＝2000－505000
        503000 50300020．01的绝对值，分红为5030
        晋级条件
        （3）代理上半月负盈利－50000发放基数，－5000010色对值，分红为5000，下半月负盈利
        为－50000＝发放基数，－5000010．01的绝对值，分红为5001
        注：发放基数会累积历史未达最低负盈利的金额和扣除之前未计算的正盈利金额
        最低投注（1）上一次末达到发放条件未发放分红
        友放基数＝上次盈利＋本次盈利
        2）上ー次达到发放条件有发放分红最低存款 发放基数＝本次盈利 活跃人数" placement="right">
          <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
        </Poptip>
      </FormItem>
      <FormItem label="最低负盈利" prop="lowestProfit" class="w30 fl pb15">
        <Input v-model="agencyInfo.lowestProfit" class="s-260" placeholder="请输入最低负盈利"/>
      </FormItem>
      <FormItem label="分红比例" prop="dividendScale" class="w30 fl pb15">
        <Input v-model="agencyInfo.dividendScale" class="s-260" placeholder="请输入分红比例"/>
      </FormItem>
      <FormItem label="佣金设置" class="w100 fl bt pt15">
        <Poptip text-overflow-ellipsis  trigger="hover" content="
        发放对象：大股东下直属代理
        发放周期：每天后台自动发放
        计算方式：按照当前代理以及代理下级下下级所有会员总的投主额来
        佣金上限例如
        设置佣金上限＝100佣金下限＝10佣金比例＝1％
        代理每日总投注额999＝9990．01＝9．99（不发放）
        最低
        ・佣金下限代理每日总投主额1001000110
        代理每日总投主额5000＝50000．01＝50
        代理每日总投注额20000＝20000．01＝200（实际发放100）
        “佣金比注：当超过佣金上限时，按设置的佣金上限来计算。当小于佣金下限
        时，不计算不发放佣金" placement="right" width="550">
          <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
        </Poptip>
      </FormItem>
      <FormItem label="佣金上限" prop="upCommission" class="w30 fl pb15">
        <Input v-model="agencyInfo.upCommission" class="s-260" placeholder="请输入佣金上限"/>
      </FormItem>
      <FormItem label="佣金下限" prop="lowerCommission" class="w30 fl pb15">
        <Input v-model="agencyInfo.lowerCommission" class="s-260" placeholder="请输入佣金下限"/>
      </FormItem>
      <FormItem label="佣金比例" prop="commissionScale" class="w30 fl pb15">
        <Input v-model="agencyInfo.commissionScale" class="s-260" placeholder="请输入佣金比例"/>%
      </FormItem>
      <FormItem label="晋级条件：" class="w100 fl bt pt15"></FormItem>
      <FormItem label="最低投注" prop="lowestBettingAmount" class="w30 fl pb15">
        <Input v-model="agencyInfo.lowestBettingAmount" class="s-260" placeholder="请输入最低投注额度"/>
      </FormItem>
      <FormItem label="最低存款" prop="lowestDeposit" class="w30 fl pb15">
        <Input v-model="agencyInfo.lowestDeposit" class="s-260" placeholder="请输入最低存款额"/>
      </FormItem>
      <FormItem label="活跃人数" prop="activeMember" class="w30 fl pb15">
        <Input v-model="agencyInfo.activeMember" class="s-260" placeholder="请输入活跃会员数"/>
      </FormItem>
      <FormItem label="其他设置：" class="w100 fl bt pt15"></FormItem>
      <FormItem label="等级状态" class="w30 fl pb15">
        <Select class="s-260" v-model="agencyInfo.levelStatus">
          <Option value="ok">正常</Option>
          <Option value="no">停用</Option>
        </Select>
      </FormItem>
      <FormItem label="备注信息">
        <Input
          v-model="agencyInfo.remark"
          style="width:660px;"
          placeholder="此栏位仅供管理者记录其他资讯，会员无法检视"
        />
      </FormItem>
      <!-- <FormItem>
        <Radio v-model="single" @on-change='() => {this.single = !this.single}'>设为默认</Radio>
      </FormItem>-->
      <FormItem class="pb15 ml80">
        <Button type="primary" class="w260x ml65" @click="add">确认添加</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Icons from "@/components/icons";
export default {
  name: "agencyLevelAdd",
  components: { Icons },
  data() {
    return {
      single: false,
      agencyInfo1: {
        level: "VIP1",
        name: "vip0",
        lowestBetting: 0,
        lowestProfit: 1355,
        fixedWage: 0,
        dividendScale: 0,
        upCommission: 100,
        lowerCommission: 10,
        commissionScale: 1,
        lowestBettingAmount: 1,
        lowestDeposit: 1,
        activeMember: 1,
        levelStatus: "ok",
        remark: "默认等级"
      },
      agencyInfo: {},
      levelList: ["VIP1", "VIP2", "VIP3", "VIP4", "VIP5"],
      name: [
        { key: "vip0", value: "默认等级" },
        { key: "vip1", value: "等级一" },
        { key: "vip2", value: "等级二" },
        { key: "vip3", value: "等级三" },
        { key: "vip4", value: "等级四" },
        { key: "vip5", value: "等级五" }
      ],
      agencyInfoRulesValidate: {
        level: [
          {
            required: true,
            message: "请选择代理等级",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入正确的代理等级别称",
            trigger: "change"
          }
        ],
        lowestBetting: [
          {
            required: true,
            message: "请输入最低投注",
            trigger: "blur"
          }
        ],
        fixedWage: [
          {
            required: true,
            message: "请输入固定日工资",
            trigger: "blur"
          }
        ],
        lowestProfit: [
          {
            required: true,
            message: "请输入最低负盈利",
            trigger: "blur"
          }
        ],
        dividendScale: [
          {
            required: true,
            message: "请输入分红比例",
            trigger: "blur"
          }
        ],
        upCommission: [
          {
            required: true,
            message: "请输入佣金上限",
            trigger: "blur"
          }
        ],
        lowerCommission: [
          {
            required: true,
            message: "请输入佣金下限",
            trigger: "blur"
          }
        ],
        commissionScale: [
          {
            required: true,
            message: "请输入佣金比例",
            trigger: "blur"
          }
        ],
        lowestBettingAmount: [
          {
            required: true,
            message: "请输入最低投注额",
            trigger: "blur"
          }
        ],
        lowestDeposit: [
          {
            required: true,
            message: "请输入最低存款额",
            trigger: "blur"
          }
        ],
        activeMember: [
          {
            required: true,
            message: "请输入活跃会员数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    add() {
      this.$Tip.success({
        content: "添加代理等级成功",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    },
    init() {
      this.agencyInfo = this.agencyInfo1;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$route.query.ver){
        this.init();
      }
    }) 
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/class.less";
@import "../../styles/button.less";
.ivu-form-item-content{
  position: relative;
  .ivu-form-item-error-tip{
  position: 0; 
  top: 32px;
  left: 0;
}
}

</style>


