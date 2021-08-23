<template>
  <div>
    <div class="v2-button mb10">
      <Button
        type="primary"
        @click="addLevel"
        v-if="(adminType == 'super') || ((currentBtn == 'level') && (authInPage.indexOf('systemMemberLevelAdd') != -1) || ((currentBtn != 'level') && (authInPage.indexOf('systemMemberRefundLevelAdd') != -1)))"
      >{{currentBtn == 'level' ? '添加会员等级' : '添加返水等级'}}</Button>
    </div>
    <div class="v2-search bb mb20">
      <ButtonGroup class="repay-button" style="margin-bottom:.3px !important">
        <Button
          class="fontColor"
          @click="() => {currentBtn = 'level'}"
          :class="currentBtn == 'level' ? 'active' : ''"
        >会员等级配置</Button>
        <Button
        class="fontColor"
          @click="() => {currentBtn = 'refund'}"
          :class="currentBtn == 'refund' ? 'active' : ''"
        >返水等级配置</Button>
      </ButtonGroup>
    </div>
    <div class="v2-table">
      <Tables
        v-show="currentBtn == 'level'"
        :loading="$root.tableLoading"
        :total="table.total"
        :value="table.data"
        :page='false'
        :columns="table.columns"
        @on-edit="onEdit"
        @on-change-status="onStatusChange"
        @on-page-size-change="onPageSizeChange"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
      <Tables
        v-show="currentBtn != 'level'"
        :loading="$root.tableLoading"
        :total="refundTable.total"
        :value="refundTable.data"
        :page='false'
        :columns="refundTable.columns"
        @on-edit="onEdit"
        @on-change-status="onStatusChange"
        @on-page-size-change="onPageSizeChange"
        @on-page-change="onPageChange"
        :pageSizeOpts="refundTable.pageSizeOpts"
      ></Tables>
    </div>
    <!-- 添加/修改会员等级 -->
    <Modals
      ref="siteLevelModal"
      :title="siteLevelModalTitle==='create'?'添加会员等级':'编辑会员等级'"
      :width="760"
    >
      <div slot="content" class="modal-overflow v2-form-wrapper pt10">
        <Form
          ref="memberLevelForm"
          :model="memberLevelForm"
          :rules="memberLevelRule"
          :label-width="260"
          style="width:700px;"
        >
          <FormItem label="会员等级" :prop="siteLevelModalTitle == 'create' ? 'levelLabel' : 'levelName'">
            <Select v-model="memberLevelForm.levelLabel" class="w260x" @on-change="getLevelName" v-if="siteLevelModalTitle==='create'">
              <Option v-for="(item,index) in memberLevelList" :key="index" :value="item.levelLabel">{{item.levelName}}</Option>
            </Select>
            <Input v-model="memberLevelForm.levelName" class="w260x" disabled v-if="siteLevelModalTitle !=='create'"/>
          </FormItem>
          <FormItem label="等级别称" prop="levelAlias">
            <Input v-model="memberLevelForm.levelAlias" placeholder="请输入等级别称" class="w260x"/>
          </FormItem>
          <FormItem label="最小存款" prop="minPay">
            <Input v-model="memberLevelForm.minPay" placeholder="请输入最小存款" class="w260x"/>
          </FormItem>
          <FormItem label="打码倍数" prop="betAmount">
            <Input v-model="memberLevelForm.betAmount" placeholder="请输入打码倍数" class="w260x"/>
          </FormItem>
          <!-- <FormItem label="最大单笔" prop="maxDeposit">
            <Input v-model="memberLevelForm.maxDeposit" placeholder="请输最大单笔" class="w260x"/>
          </FormItem> -->
          <!-- <FormItem label="取款打码倍数" prop="multiple">
            <Input v-model="memberLevelForm.multiple" placeholder="整数" class="w260x"/>
          </FormItem> -->
          <FormItem label="彩金奖励">
            <Input v-model="memberLevelForm.giftBonus" placeholder="请输入彩金奖励" class="w260x"/>
          </FormItem>
          <!-- <FormItem label="等级状态" prop="status" class="ivu-form-item no-before">
            <Select v-model="memberLevelForm.status" placeholder="请选择" class="w260x">
              <Option value="yes">启用</Option>
              <Option value="no">停用</Option>
            </Select>
          </FormItem> -->
          <FormItem class="clearfix h20">
            <div class="fl">
              <Icon
                type="md-checkmark-circle"
                size="16"
                v-if="memberLevelForm.default === 'no'"
                color="#E4E4E4"
                @click="setDefault('yes')"
                class="pr5"
              />
              <Icon
                type="md-checkmark-circle"
                size="16"
                v-else
                color="#57a3f3"
                @click="setDefault('no')"
                style="margin-top:2px"
                class="pr5"
              />
            </div>
            <span class="fl ib cs" @click="setDefault('span')">设为默认？</span>
          </FormItem>
          <FormItem>
            <Button
              class="submit h50"
              type="primary"
              @click.prevent="submit"
            >{{siteLevelModalTitle==='create'?'确认添加':'确认修改'}}</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
    <!-- 等级分配 -->
    <Modals ref="levelDispatchModal" :title="dispatchTitle" :width="1060">
      <div slot="content" class="pt10">
        <Form
          ref="levelDispatchForm"
          :model="levelDispatchForm"
          style="width:1060px;"
          :rules="levelDispatchRules"
          :label-width="360"
        >
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
            <!-- <paymentRadio
              :methodsList="methodsList"
              :defaultChecked="defaultChecked"
              style="width:370px;"
            ></paymentRadio>-->
          </FormItem>
          <FormItem>
            <Button class="w260x bg white-font ml20 white-font" @click="dispatchLevelSubmit">提交保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import {
  systemMemberLevelList,
  systemMemberRefundLevelList,
  systemMemberLevelAdd,
  systemMemberLevelUp
} from "@/api/system";
import { mapState } from 'vuex';
import Modals from "_c/modals";
import Icons from "_c/icons";
import Tables from "_c/tables";
import LevelSelect from "_c/level-select";
import paymentRadio from "@/views/finance/components/payment-radio-group";
// import Sortable from "sortablejs";
import { getUserType } from '@/libs/util';
import { changMemberStatus, refundLevelModifyStatus } from "@/api/member";
export default {
  name: "sysPreset",
  components: {
    Tables,
    Icons,
    Modals,
    LevelSelect
  },
  computed: {
    ...mapState({
      memberLevelList: state => state.info.memberLevelList
    })
  },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      // limit: 10,
      // refundLimit: 10,
      dispatchTitle: "", //等级分配的标题
      levelDispatchForm: {}, //等级分配的数据
      memberLevelForm: {
        levelName: "",
        minPay: "0",
        status: "yes",
        default: "no",
        levelLabel: "",
        levelAlias: "",
        betAmount: '',
        minPay: "",
        maxDeposit: "0",
        multiple: '0',
        giftBonus: "",
        depositNumber: "0" //存款次数
      },
      currentBtn: "level",
      levelDispatchRules: {
        minPay: [
          {
            required: true,
            message: "请输入最小存款",
            trigger: "blur"
          },
          {
            message: '最小存款必须是个整数',
            trigger: 'blur',
            pattern: /^[+]{0,1}(\d+)$/
          }
        ],
        damabeishu: [
          {
            required: true,
            message: "请输入打码倍数",
            trigger: "blur"
          }
        ],
        maxSingle: [
          {
            required: true,
            message: "请输入最大单笔",
            trigger: "blur"
          }
        ],
        paymentMethods: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "blur"
          }
        ]
      },
      memberLevelRule: {
        levelAlias: [
          {
            required: true,
            message: "请输入会员别称",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        levelLabel: [
          { required: true, message: '请选择会员等级', trigger: 'change', pattern: /.+/}
        ],
        levelName: [{ required: true, memberLevelList: '请输入会员等级',trigger: 'blur'}],
        minPay: [
          {
            required: true,
            message: "请输入正确的最小存款",
            trigger: "blur",
            pattern: /.+/
          },
          {
            message: '最小存款必须是个整数',
            trigger: 'blur',
            pattern: /^[0-9]\d*$/
          }
        ],
        // multiple: [
        //   {
        //     required: true,
        //     message: "请输入正确的取款打码倍数",
        //     trigger: "blur",
        //     pattern: /.+/
        //   },
        //    {
        //     message: '取款打码倍数必须是个整数',
        //     trigger: 'blur',
        //     pattern: /^[0-9]\d*$/
        //     //整数和0
        //     // pattern: /^[+]{0,1}(\d+)$/,
        //   }
        // ],
        betAmount: [
          {
            required: true,
            message: "请输入正确的打码倍数",
            trigger: "blur",
            pattern: /.+/
          },
          {
            message: "打码倍数必须为整数",
            trigger: "blur",
            // pattern: /^[0-9]*[1-9][0-9]*$/
            pattern: /^[+]{0,1}(\d+)$/,
          }
        ],
        // giftBonus: [
        //   { required: true, message: "请输入彩金奖励", trigger: "blur", pattern: /.+/ },
        //   { pattern: /^[+]{0,1}(\d+)$/, message: '彩金奖励必须为整数', trigger: 'blur'}
        // ],
        status: [
          {
            required: true,
            message: "请选择等级状态",
            trigger: "change"
          }
        ]
      },
      // 编辑会员等级的标题
      siteLevelModalTitle: "",
      // 会员等级数据
      table: {
        loading: true,
        // total: 0,
        // pageSizeOpts: [10,20,30],
        data: [],
        columns: [
          // {
          //   title: "排序",
          //   align: "center",
          //   width: 60,
          //   render: (h, params) => {
          //     return h(Icons, {
          //       props: {
          //         type: "paixukongjian",
          //         color: "#dadada",
          //         size: 20
          //       }
          //     });
          //   }
          // },
          {
            title: "等级",
            key: "levelName",
            align: "center",
            minWidth:55,
          },
          {
            title: "等级别称",
            key: "levelAlias",
            align: "center",
            minWidth:60,
          },
          {
            title: "最小存款",
            key: "minPay",
            align: "center",
            minWidth:60,
          },
          {
           key:'betAmount',
           align:"center",
           minWidth: 90,
           renderHeader:(h,params)=>{
             return(
               <div>
                <span>打码倍数</span>
                <Poptip  trigger="hover" placement="right-start" transfer>
                  <div slot="content">最小存款X打码倍数=打码量</div>
                  <Icons type="bangzhutishi" color="#b3b3b3" class="ml5"/>
                </Poptip>
                </div>
             )
           }
          },
          // {
          //   title: "最大单笔",
          //   key: "maxDeposit",
          //   align: "center",
          //   minWidth:75,
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
            minWidth:65,
          },
          {
            title: "创建时间",
            key: "created_at",
            align: "center",
           minWidth:130,
            render: (h, params) => (
              <span>{this.$root.newUnixTime(params.row.created_at)}</span>
            )
          },
          {
            title: "默认等级",
            key: "default",
            align: "center",
            minWidth:55,
            render: (h, params) => {
              let color = params.row.default == "yes" ? "#444" : "#ff2626";
              return (
                <span style={{ color }}>
                  {params.row.default == "yes" ? "是" : "否"}
                </span>
              );
            }
          },
          // {
          //   title: "状态",
          //   key: "status",
          //   align: "center",
          //   render: (h, params) => {
          //     let color = params.row.status == "yes" ? "" : "#F84040";
          //     return (
          //       <span style={{color}}>
          //         {params.row.status == "yes" ? "正常" : "停用"}
          //       </span>
          //     );
          //   }
          // },
          {
            title: "操作",
            align: "center",
            minWidth:55,
            render: (h,params) => {
              return (
                <div>
                  <a class="ib"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('systemMemberLevelUp') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {this.onEdit(params)}}
                  >编辑</a>
                </div>
              )
            }
          }
        ]
      },
      //返水配置数据
      refundTable: {
        // total: 0,
        loading: true,
        // pageSizeOpts: [10, 20, 30],
        data: [],
        columns: [
          {
            title: "返水等级",
            key: "levelName",
            align: "center",
            minWidth:60,
          },
          {
            title: "返水等级别称",
            key: "levelAlias",
            align: "center",
            minWidth:80,
          },
          {
            title: "最低下注",
            key: "lessBetAmount",
            align: "center",
            minWidth:60,
          },
          {
            title: "最大返水",
            key: "maxBonusAmonut",
            align: "center",
            minWidth:60,
          },
          {
            title: "创建日期",
            key: "created_at",
            align: "center",
            minWidth:130,
            render: (h, params) => (
              <span class="pr10 pl10">{this.$root.newUnixTime(params.row.created_at)}</span>
            )
          },
          {
            title: "默认返水等级",
            key: "default",
            align: "center",
            minWidth:80,
            render: (h, params) => {
              let color = params.row.default == "yes" ? "" : "#ff2626";
              return (
              <span style={{color:color}}>{params.row.default == "yes" ? "是" : "否"}</span>
              )
            }
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth:35,
            render: (h, params) => {
              let color = params.row.status == "yes" ? "" : "#FF2626";
              return (
                <span style={{ color }}>
                  {params.row.status == "yes" ? "正常" : "停用"}
                </span>
              );
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth:70,
            render: (h,params) => {
              let color = params.row.default == 'yes' ? '#918b8b' : ""
              return (
                <div>
                  <a class="ib mr10"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('refundLevelModifyStatus') != -1) ? 'inline-block' : 'none',
                      color
                    }}
                    onClick={() => {
                      if (params.row.default == 'no') this.onStatusChange(params)}
                    }
                  >{params.row.status == 'yes' ? '停用' : '启用'}</a>
                  <a class="ib mr10"
                    onClick={() => {this.onEdit(params)}}
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('systemMemberRefundLevelUp') != -1) ? 'inline-block' : "none"
                    }}
                  >编辑</a>
                </div>
              )
            }
          }
        ]
      }
    };
  },
  mounted() {
    // let data = { limit: this.limit };
    this.getLevelData();
    // this.rowDrop();
    //从返水编辑回来默认显示返水
    if(this.$route.params.stage){
      this.currentBtn = 'refund'
    }
  },
  watch: {
    currentBtn(val, oldVal) {
      if (val == "level") {
        // let data = { limit: this.limit, siteId: this.$root.nowSite.id };
        // this.getLevelData({ params: data });
        this.getLevelData()
      } else {
        // let data = { limit: this.refundLimit };
        // this.getRefundData({ params: data });
        this.getRefundData()
      }
    }
  },
  methods: {
    getLevelName(val) {
      if (val != undefined) this.memberLevelForm.levelName = this.memberLevelList.filter(item => item.levelLabel == val)[0].levelName
    },
    //会员等级数据
    getLevelData() {
      this.$root.startTableLoading(this);
      systemMemberLevelList().then(res => {
        // const { data, total } = res.data;
        if (res != undefined && res.code == 200) {
          this.table.data = res.data;
        }
        this.$root.endTableLoading()
        // this.table.total = total;
      }).catch(error=>this.$root.endTableLoading());
    },
    // 返水等级数据
    getRefundData() {
      this.$root.startTableLoading(this);
      systemMemberRefundLevelList().then(res => {
        // const { data, total } = res.data;
        if (res != undefined && res.code == 200) {
          this.refundTable.data = res.data;
        }
        this.$root.endTableLoading()
        // this.refundTable.total = total;
      }).catch(error=>this.$root.endTableLoading());
    },
    // rowDrop() {
    //   const tbody = document.querySelector(".ivu-table-tbody");
    //   Sortable.create(tbody, {});
    // },
    levelChange(res) {
      this.memberLevelForm.levelLabel = res.levelLabel;
      this.memberLevelForm.levelName = res.levelName;
    },
    //添加等级
    addLevel() {
      //添加会员等级
      if (this.currentBtn == "level") {
        this.siteLevelModalTitle = "create";
        this.$refs.memberLevelForm.status = 'yes'
        this.memberLevelForm.levelLabel = null
        this.memberLevelForm.giftBonus = ''
        this.$refs.memberLevelForm.resetFields();
        this.$refs.siteLevelModal.show();
      } else {
        //添加会员返水等级
        this.$router.push({
          name: "sysPreRefundEdit",
          params: { page: "create" }
        });
      }
    },
    // 弹窗的提交
    submit() {
      this.$refs.memberLevelForm.validate(valid => {
        this.$Message.config({
          top: 50,
          duration: 1
        })
        if (valid) {
          // 添加等级
          this.$refs.siteLevelModal.spinShow();
          if (this.siteLevelModalTitle == "create") {
            this.memberLevelForm.remark = '暂无备注信息'
            if (!this.$root.trimAll(this.memberLevelForm.giftBonus)) this.memberLevelForm.giftBonus = '10'
            let {levelName,minPay,remark,levelLabel,levelAlias,betAmount,depositNumber,giftBonus,multiple} = this.memberLevelForm
            let data = {levelName,minPay,remark,levelLabel,levelAlias,betAmount,depositNumber,giftBonus,multiple,status: 'yes', default:this.memberLevelForm.default}
            systemMemberLevelAdd(data, true)
              .then(res => {
                this.$refs.siteLevelModal.spinHide();
                if(res != undefined && res.code == 200){
                  this.$Message.success('添加会员等级成功')
                  this.$refs.siteLevelModal.hide()
                  // let data = { params: { limit: this.limit, siteId: this.$root.nowSite.id }}
                  this.getLevelData()
                }
              })
              .catch(error => {
                this.$refs.siteLevelModal.spinHide();
              });
          } else {
            if (this.memberLevelForm.status != undefined && this.memberLevelForm.status) delete this.memberLevelForm.status
            if (!this.$root.trimAll(String(this.memberLevelForm.giftBonus))) this.memberLevelForm.giftBonus = '10'
            let { id, levelName, minPay, levelLabel, levelAlias, betAmount, depositNumber, giftBonus, multiple } = this.memberLevelForm
            let data = { id,levelName,minPay,levelLabel,levelAlias,betAmount,depositNumber,giftBonus,multiple,default: this.memberLevelForm.default, status: 'yes'}
            systemMemberLevelUp(data, true).then(res => {
                  this.$refs.siteLevelModal.spinHide();
                  if(res != undefined && res.code == 200){
                    this.$Message.success('修改会员等级成功')
                    this.$refs.siteLevelModal.hide()
                    // let data = { params: { limit: this.limit, siteId: this.$root.nowSite.id }}
                    this.getLevelData()
                  }
              })
              .catch(error => {
                this.$refs.siteLevelModal.spinHide();
              });
          }
        }
      });
    },
    onEdit(params) {
      this.$refs.memberLevelForm.resetFields();
      if (this.currentBtn == "level") {
        this.siteLevelModalTitle = "edit";
        const { levelLabel, levelName, id, levelAlias, multiple } = params.row
        this.memberLevelForm = { ...params.row };
        this.memberLevelForm.levelLabel = String(levelLabel);
        let { minPay, giftBonus } = this.memberLevelForm;
        this.memberLevelForm.minPay = Number(minPay);
        this.memberLevelForm.giftBonus = Number(giftBonus);
        this.memberLevelForm.multiple = parseInt(multiple)
        this.$refs.siteLevelModal.show();
        this.$refs.siteLevelModal.spinShow();
        setTimeout(() => {
          this.$refs.siteLevelModal.spinHide();
        }, 500);
      } else {
        const { id, status } = params.row
        this.$router.push({
          name: "sysPreRefundEdit",
          params: { page: "edit" },
          query: { id, status }
          // query: { id: params.row.id, limit: this.refundTable.total }
        });
      }
    },
    // 改变状态
    onStatusChange(params) {
      this.$Message.config({
        top: 50,
        duration: 1
      });
      let { id, status, levelAlias, levelName } = params.row;
      let data = {
        siteId: 0,
        id,
        statusKey: "status",
        statusVal: status == "yes" ? 0 : 1
      };
      let content =
        status == "yes"
          ? `您确定要停用${levelName}吗？`
          : `您确定要启用${levelName}吗？`;
      let msg = status == "yes" ? `停用${levelName}成功` : `启用${levelName}成功`;
      this.$Tip.confirm({
        content,
        onOk: () => {
          if (this.currentBtn == "level") {
            changMemberStatus(data, true).then(res => {
              if(res != undefined && res.code == 200) params.row.status  = status == 'yes' ? 'no' : 'yes'
            });
          } else {
            refundLevelModifyStatus(data, true).then(res => {
              if(res != undefined && res.code == 200) {
                this.$Message.success(msg)
                params.row.status = status == 'yes' ? 'no' : 'yes'
              }
            });
          }
        }
      });
    },
    onPageSizeChange(pageSize) {
      if (this.currentBtn == "level") {
        // this.limit = pageSize;
        // let data = { params: { limit: pageSize, siteId: this.$root.nowSite.id } };
        this.getLevelData();
      } else {
        // this.refundLimit = pageSize;
        // let data = { params: { limit: pageSize } };
        this.getRefundData();
      }
    },
    onPageChange(page) {
      // let data = { params: { limit: this.limit, siteId: this.$root.nowSite.id }, query: { page } };
      if (this.currentBtn == "level") {
        this.getLevelData();
      } else {
        // data.params.limit = this.refundLimit;
        this.getRefundData();
      }
    },
    dispatchLevelSubmit() {},
    //设为默认
    setDefault(stage) {
      if (stage == "span") {
        this.memberLevelForm.default =
          this.memberLevelForm.default == "yes" ? "no" : "yes";
      } else {
        this.memberLevelForm.default = stage;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";
/deep/.no-before {
  .ivu-form-item-label::before {
    content: ''
  }
}

</style>

