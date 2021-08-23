<template>
  <div>
    <div class="v2-button">
      <Button
        @click="createMemberlevel"
        v-if="(adminType == 'super') || (authInPage.indexOf('memberLevelCreate') != -1)"
      >添加会员等级</Button>
      <Button
        @click="modifyMemberModal"
        v-if="(adminType == 'super') || (authInPage.indexOf('soonModifyMemberList') != -1)"
      >修改会员等级</Button>
      <Button
        @click="paymentListModal"
        v-if="(adminType == 'super') || (authInPage.indexOf('getBoundPaymentChannel') != -1)"
      >支付通道详情</Button>
    </div>
    <div class="v2-table">
      <Tables
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        @on-edit="onEdit"
        @on-details="onDetail"
        :page="table.page"
        @on-change-status="changeStatus"
      ></Tables>
    </div>
    <!-- 修改会员等级 -->
    <ModifyMember ref="ModifyMember" @updateData='updateData'/>
    <!-- 支付通道详情 -->
    <PaymentList ref="paymentList"/>
    <!-- 支付设置 -->
    <PaymentModify ref="paymentModify"/>
    <!-- 详情
    <MemberLevelDetail ref="memberLevelDetail" :data="datailData"/>-->
    <!-- 添加/修改会员等级 -->
    <Modals
      ref="siteLevelModal"
      :title="siteLevelModalTitle==='create'?'添加会员等级':'编辑会员等级'"
      :width="750"
    >
      <div slot="content" class="modal-overflow v2-form-wrapper pt10">
        <Form
          ref="memberLevelForm"
          :model="memberLevelForm"
          :rules="memberLevelRule"
          :label-width="260"
          style="width:700px;"
          :key="siteLevelModalTitle"
        >
          <FormItem label="会员等级" prop="levelLabel">
            <LevelSelect v-if="siteLevelModalTitle === 'create'" ref="LevelSelect" class="w260x" :levelType="'member'" @on-level-change="levelChange" :choiceShow="true" />
            <Input v-else class="w260x" v-model="memberLevelForm.levelName" disabled/>
          </FormItem>
          <FormItem label="等级别称" prop="levelAlias">
            <Input v-model="memberLevelForm.levelAlias" placeholder="请输入等级别称" class="w260x"/>
          </FormItem>
          <FormItem label="最小存款" prop="minPay">
            <Input v-model="memberLevelForm.minPay" placeholder="请输入最小存款" class="w260x" :maxlength="10"/>
          </FormItem>
          <FormItem label="打码倍数" prop="betAmount">
            <Input v-model="memberLevelForm.betAmount" placeholder="最小存款打码倍数，整数，建议0-30" class="w260x" />
          </FormItem>
          <!-- <FormItem label="最大单笔" prop="maxDeposit">
            <Input v-model="memberLevelForm.maxDeposit" placeholder="请输最大单笔" class="w260x"/>
          </FormItem> -->
          <!-- <FormItem label="取款打码倍数" prop="multiple">
            <Input v-model="memberLevelForm.multiple" placeholder="整数" class="w260x"/>
          </!-->
          <FormItem label="彩金奖励">
            <Input v-model="memberLevelForm.giftBonus" placeholder="请输入彩金奖励" class="w260x"/>
          </FormItem>
          <FormItem class="clearfix h20">
            <div class="fl">
              <Icon type="md-checkmark-circle" size="16" v-if="memberLevelForm.default === 'no'" color="#E4E4E4" @click="setDefault('yes')" class="pr5" />
              <Icon type="md-checkmark-circle" size="16" v-else color="#57a3f3" @click="setDefault('no')" style="margin-top:2px" class="pr5" />
            </div>
            <span class="fl ib cs" @click="setDefault('span')">设为默认？</span>
          </FormItem>
          <FormItem>
            <Button class="submit h50" type="primary" @click="submit" >{{siteLevelModalTitle==='create'?'确认添加':'确认修改'}}</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
    <Modals ref="levelDispatchModal" :title="dispatchTitle" :width="1060">
      <div slot="content" class="pt10">
        <Form ref="levelDispatchForm" :model="levelDispatchForm" style="width:1060px;" :rules="levelDispatchRules" :label-width="360" >
          <FormItem label="最小存款" prop="minPay">
            <Input v-model="levelDispatchForm.minPay" class="w370x"/>
          </FormItem>
          <FormItem label="打码倍数" prop="damabeishu">
            <Input v-model="levelDispatchForm.damabeishu" class="w370x"/>
          </FormItem>
          <FormItem label="最大单笔" prop="maxSingle">
            <Input v-model="levelDispatchForm.maxSingle" class="w370x"/>
          </FormItem>
          <FormItem label="支付方式" prop="paymentMethods">
            <paymentRadio :methodsList="methodsList" :defaultChecked="defaultChecked" style="width:370px;" ></paymentRadio>
          </FormItem>
          <FormItem>
            <Button style="width:370px" class="bg white-font white-font h50" @click="dispatchLevelSubmit" >提交保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import paymentRadio from "@/views/finance/components/payment-radio-group";
import Modals from "@/components/modals";
import Tables from "@/components/tables";
import PaymentList from "./components/payment-list";
import PaymentModify from "./components/payment-modify-java";
import MemberLevelDetail from "./components/member-level-detail";
import ModifyMember from "./components/modify-member";
import LevelSelect from "@/components/level-select";
import { getUserType } from '@/libs/util';
import {
  getMemberLevelData,
  changMemberStatus,
  memberLevelUpdate,
  memberLevelCreate
} from "@/api/member";
export default {
  name: "memLevel",
  components: { Tables, PaymentList, PaymentModify, MemberLevelDetail, Modals, Icons, paymentRadio, ModifyMember, LevelSelect },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择会员等级'));
      } else {
        callback();
      }
    }
    return {
      newLevel:"",//d等级带过去的参数

      statusDisabled: false, //会员等级编辑时状态的更改

      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      dispatchTitle: "",
      levelDispatchForm: {},
      searchKey: { purpose: "list" },
      datailData: {},
      defaultChecked: [],
      methodsList: [
        { name: "网银在线", value: "wangyinzaixian" },
        { name: "支付宝线上", value: "zhifubaoxianshang" },
        { name: "微信线上", value: "weixinxianshang" },
        { name: "银联支付", value: "yinlianzhifu" }
      ],
      levelDispatchRules: {
        minPay: [
          { required: true, message: "请输入最小存款", trigger: "blur" }
        ],
        damabeishu: [
          { required: true, message: "请输入打码倍数", trigger: "blur" }
        ],
        maxSingle: [
          { required: true, message: "请输入最大单笔", trigger: "blur" }
        ],
        paymentMethods: [
          { required: true, message: "请选择支付方式", trigger: "blur" }
        ]
      },
      table: {
        page: false,
        loading: true,
        columns: [
          {
            title: "会员等级",
            key: "levelName",
            align: "center",
            minWidth:60,
          },
          {
            title: "等级别称",
            key: "levelAlias",
            align: "center",
            minWidth:60,
          },
          {
            title: "会员人数",
            key: "member_count",
            align: "center",
            minWidth:60,
            render: (h, params) => <span class='blue-font'
            onClick={()=>{
              const {levelLabel,levelAlias}=params.row;
              this.$router.push({name:"memberSearch",query:{levelLabel,levelAlias}}
              )
            }}
            >{params.row.member_count}</span>
          },
          {
            title: '有效人数',
            key: "member_valid_count",
            align: 'center',
            minWidth: 60,
            render: (h, params) => <span
            onClick={()=>{
              const {levelLabel,levelAlias,maxDeposit}=params.row;
              this.$router.push({name:"memberSearch",query:{levelLabel,levelAlias,maxDeposit}})
            }}
             class='blue-font'>{params.row.member_valid_count}</span>
          },
          {
            title: "最小存款",
            key: "minPay",
            align: "center",
            minWidth:60,
          },
          {
            title: "打码倍数",
            key: "betAmount",
            align: "center",
            minWidth:60,
          },
          // {
          //   title: "最大单笔",
          //   key: "maxDeposit",
          //   align: "center",
          //   minWidth:70,
          // },
          // {
          //   title: "取款打码倍数",
          //   key: "multiple",
          //   align: "center",
          //   minWidth:80,
          // },
          {
            title: "彩金奖励",
            key: "giftBonus",
            align: "center",
            minWidth:60,
          },
          {
            title: "创建时间",
            key: "created_at",
            align: "center",
            minWidth:110,
            render: (h, params) => {
              return <span>{this.$root.newUnixTime(params.row.updated_at)}</span>;
            }
          },
          {
            title: "默认等级",
            key: "default",
            align: "center",
            minWidth:60,
            render: (h, params) => <span style={{ color: params.row.default !== 'no' ? '' : '#FF2626'}}>{params.row.default == 'no' ? '否' : '是'}</span>
          },
          {
            title: "操作",
            align: "center",
            minWidth:130,
            render: (h,params) => {
              let  color=params.row.bonusStatus=="yes"?'':'#FF2626'
              return (
                <div>
                  <a class="ib mr10"
                   style={{color}}
                   onClick={()=>{this.changeStatus(params)}}
                  >{params.row.bonusStatus== 'yes' ? '优惠正常' : '优惠停用'}</a>
                  <a class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('memberLevelUpdate') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {this.onEdit(params)}}
                  >编辑</a>
                  <a class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('bindingPaymentChannel') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() =>
                    this.$refs.paymentModify.init(params.row.levelLabel)
                    }
                  >支付设置</a>

                </div>
              )
            }
          }
        ],
        data: []
      },
      // 编辑等级模块
      rowIndex: "",
      siteLevelModalTitle: "",
      memberLevelForm: {
        siteId: "",
        siteName: "",
        id: "",
        levelLabel: "",
        levelName: "",
        levelAlias: "",
        minPay: "",
        betAmount: "",
        maxDeposit: "0",
        multiple: "0",
        giftBonus: "",
        status: "yes",
        default: '',
        remarks: ""
      },
      memberLevelRule: {
        levelLabel: [
          { required: true, validator: validatePass, trigger: "change" }
        ],
        levelAlias: [
          { required: true, message: "请输入等级别称", trigger: "blur" }
        ],
        // maxDeposit: [
        //   { required: true, message: "请输入正确的最大单笔" },
        //   { pattern: /^[+]{0,1}(\d+)$/, message: '最大单笔必须为整数' }
        // ],
        minPay: [
          { required: true, message: "请输入正确的最小存款", trigger: "blur" },
          { pattern: /^[+]{0,1}(\d+)$/, message: "最小存款必须是个整数", trigger: "blur" }
        ],
        // multiple: [
        //   { required: true,  message: "请输入正确的取款打码倍数", trigger: "blur" },
        //   { message: "取款打码倍数必须为整数", trigger: "blur", pattern: /^[+]{0,1}(\d+)$/ }
        // ],
        betAmount: [
          { required: true, message: "请输入正确的打码倍数", trigger: "blur" },
          { message: "打码倍数必须为整数", trigger: "blur", pattern: /^[+]{0,1}(\d+)$/, }
        ]
        // giftBonus: [
        //   { required: true, message: "请输入彩金奖励", trigger: "blur" },
        //   { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入正确的彩金奖励', trigger: 'blur' }
        // ]
      }
    };
  },
  watch: {
    "$root.nowSite": {
      handler(val, oldVal) {
        if (this.$route.name == "memLevel") this.getData({ siteId: val.id, purpose: "list" })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setDefault(stage) {
      if (stage == "span") this.memberLevelForm.default = this.memberLevelForm.default == "yes" ? "no" : "yes";
      else this.memberLevelForm.default = stage
    },
    updateData() {
      this.getData({ siteId: this.$root.nowSite.id, purpose: 'list'})
    },
    modifyMemberModal() {
      this.$refs.ModifyMember.show();
      this.$refs.ModifyMember.LevelSelectInit();
    },
    getData(data) {

      this.$root.startTableLoading();
      getMemberLevelData(data).then(res => {
        if (res != undefined && res.code === 200 ) {
          this.table.data = res.data
        }
        this.$root.endTableLoading()
      });
    },
    resetMemberLevelForm() {
      for (let key in this.memberLevelForm) {
        this.memberLevelForm[key] = "";
      }
    },
    // 添加会员等级
    createMemberlevel() {
      this.$refs.memberLevelForm.resetFields()
      this.siteLevelModalTitle = "create";
      this.statusDisabled = false
      this.resetMemberLevelForm();
      this.memberLevelForm.status = 'yes'
      this.memberLevelForm.default = 'no'
      this.$nextTick( () => {
        this.$refs.LevelSelect.changeSubType('addLevel')
        this.$refs.LevelSelect.init(0)
        this.$refs.LevelSelect.reset('single')
      })
      this.$refs.siteLevelModal.show();
    },
    // 支付通道详情
    paymentListModal() {
      this.$refs.paymentList.init();
    },
    onEdit(params) {
      this.rowIndex = params.index;
      this.siteLevelModalTitle = "edit";
      this.resetMemberLevelForm();
      const { levelLabel, levelName, member_count } = params.row;
      let list = ["minPay", "betAmount", "maxDeposit", "multiple", "giftBonus"];
      for (let key in this.memberLevelForm) {
        this.memberLevelForm[key] = params.row[key];
        for (let i = 0; i <= list.length; i++) {
          if (key !== list[i]) continue;
          this.memberLevelForm[key] = this.memberLevelForm[key] + "";
        }
      }
      this.statusDisabled = member_count == 0 ? false : true
      this.memberLevelForm.minPay = params.row.minPay.split('.')[0];
      this.memberLevelForm.maxDeposit = parseInt(params.row.maxDeposit)
      this.memberLevelForm.multiple = parseInt(params.row.multiple)
      this.$refs.siteLevelModal.show();
    },
    // 等级分配
    dispatchLevel(params) {
      this.dispatchTitle = `等级分配(${params.row.levelAlias}中会员等级分配)`;
      this.$refs.levelDispatchModal.show();
    },
    dispatchLevelSubmit() {
      this.$refs.levelDispatchModal.hide();
      this.$Tip.success({
        content: "会员等级分配成功",
        onOk: () => {}
      });
    },
    onDetail(params) {
      this.$refs.memberLevelDetail.show();
      this.$refs.memberLevelDetail.spinShow();
      this.datailData = {
        levelName: "",
        levelAlias: "",
        agency_count: "",
        minPay: "",
        betAmount: "",
        multiple: "",
        maxDeposit: "",
        giftBonus: "",
        status: "",
        remark: "",
        default: "",
        created_at: "",
        updated_at: ""
      };
      setTimeout(() => {
        for (let key in this.datailData) {
          this.datailData[key] = params.row[key];
        }
        this.$refs.memberLevelDetail.spinHide();
      }, 500);
    },
    changeStatus(params){
      let text, msg;
      const { bonusStatus, id,levelName } = params.row;
         if (bonusStatus === "yes") {
        text = `您确定停用${levelName}优惠吗？`;
        msg = `停用优惠成功`;
       }
         if (bonusStatus === "no") {
        text = `您确定启用${levelName}优惠吗？`;
        msg = `启用优惠成功`;
      }
       const  data={
         siteId: this.$root.nowSite.id,
         id: id,
         statusKey: "bonusStatus",
         statusVal:bonusStatus === "yes" ? 0: 1,
       }
       this.$Tip.confirm({
         content: text,
         onOk:()=>{
           changMemberStatus(data,true).then(res=>{
              if (res != undefined && res.code == 200) {
                params.row.bonusStatus = bonusStatus === "yes" ? "no" : "yes";
                this.$Message.success(msg)
              }
           })
         }
       })
    },
    // changeStatus(params) {
    //   let text, msg;
    //   const { status, levelAlias, id, levelName } = params.row;
    //   if (status === "yes") {
    //     text = `您确定停用${levelName}吗？`;
    //     msg = `停用成功${levelName}`;
    //   }
    //   if (status === "no") {
    //     text = `您确定启用${levelName}吗？`;
    //     msg = `启用成功${levelName}`;
    //   }
    //   const data = {
    //     siteId: this.$root.nowSite.id,
    //     id: id,
    //     statusKey: "status",
    //     statusVal: status === "yes" ? 0 : 1
    //   };
    //   this.$Tip.confirm({
    //     content: text,
    //     onOk: () => {
    //       changMemberStatus(data).then(res => {
    //         if (res != undefined && res.code == 200) {
    //           params.row.status = status === "yes" ? "no" : "yes";
    //           this.$Message.success(msg)
    //         }
    //       });
    //     }
    //   });
    // },
    levelChange(res) {
      this.memberLevelForm.levelLabel = res.levelLabel;
      this.memberLevelForm.levelName = res.levelName;
    },
    submit() {
      let params = { ...this.memberLevelForm };
      params.siteId = this.$root.nowSite.id;
      params.siteName = this.$root.nowSite.siteName;
      this.searchKey.siteId = this.$root.nowSite.id;
      [ "minPay", "betAmount", "maxDeposit", "multiple", "giftBonus", "status", "default" ].forEach(key => {
        if (key === "status") {
          params[key] = params[key] === "yes" ? 1 : 0;
        } else if (key === "default") {
          params[key] = params[key] === "yes" ? 1 : 0;
          if (params[key] === 1) {
            params.continue = 0;
          }
        } else {
          params[key] = +params[key];
        }
      });
      if (!params.remarks) params.remarks = '暂无备注'
      if (!params.status) params.status = 1
      this.$refs.memberLevelForm.validate(valid => {
        if (valid) {
          if (this.siteLevelModalTitle === "edit") {
            this.$refs.siteLevelModal.spinShow();
            memberLevelUpdate(params, true)
              .then(res => {
                this.$refs.siteLevelModal.spinHide();
                if (res != undefined && res.code == 200) {
                  this.$Message.success(res.data)
                  this.$refs.siteLevelModal.hide();
                  this.getData(this.searchKey);
                }
              })
              .catch(err => {
                this.$refs.siteLevelModal.spinHide();
                const { message } = err.response.data;
                this.$Tip.info({
                  content: message,
                  onOk: () => {
                    params.continue = 1;
                    memberLevelUpdate(params, true).then(res => {
                      if (res != undefined && res.code == 200) {
                        this.$Message.success(res.data)
                        this.resetMemberLevelForm();
                        this.$refs.siteLevelModal.hide();
                        // 第二次点编辑的时候会出现一个验证的bug，需要加上这个补丁，重置status和default为yes/no
                        params.status = params.status == 1 ? "yes" : "no";
                        params.default = params.default == 1 ? "yes" : "no";
                        for (let key in params) {
                          this.table.data[this.rowIndex][key] = params[key];
                        }
                      }
                    });
                  }
                });
              });
          }
          if (this.siteLevelModalTitle === "create") {
            delete params.id;
            this.$refs.siteLevelModal.spinShow();
            memberLevelCreate(params, true)
              .then(res => {
                this.$refs.siteLevelModal.spinHide();
                if (res != undefined && res.code == 200) {
                  this.$Message.success(res.data)
                  this.resetMemberLevelForm();
                  this.$refs.siteLevelModal.hide();
                  this.getData(this.searchKey);
                }
              })
              .catch(res => {
                this.$refs.siteLevelModal.spinHide();
              });
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.bg {
  background: #62b1fd;
}
.icon-chenggongtishi {
  vertical-align: middle;
  margin-right: 10px;
}
.modal-overflow {
  max-height: 680px;
}
/deep/.ivu-btn > span{vertical-align: 0;}
/deep/.ivu-select {width:260px !important}
</style>

