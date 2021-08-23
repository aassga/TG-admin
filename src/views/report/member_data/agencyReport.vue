<template>
  <div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="v2-search clearfix">
      <Form ref="searchKey" class="fl" inline>
        <FormItem label="开始日期">
          <DatePicker
            type="date"
            placeholder="开始日期"
            class="s-120"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            type="date"
            placeholder="结束日期"
            class="s-120"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <Poptip trigger="hover" placement="bottom-end">
          <div slot="content">
            <div>勾选即展示此时间范围内新注册会员的报</div>
            <div class="mt5">表数据，不包含历史注册的会员报表数据</div>
          </div>
          <span class="cs mt5 mr10 mt8 ib">按注册时间</span>
          <!-- <Icons type="bangzhutishi" color="#E4E4E4" :size="16" /> -->
        </Poptip>
        <FormItem>
          <Checkbox
            @on-change="changeBtn"
            v-model="searchKey.fromReg"
          ></Checkbox>
        </FormItem>
        <FormItem label="会员账号">
          <Input
            v-model="searchKey.userName"
            @keyup.enter.native="searchSubmit"
            placeholder="请输入会员账号"
            class="s-140"
          />
        </FormItem>
        <FormItem label="三级代理" v-if="$root.modeName() == 'mode_e'">
          <Checkbox v-model="level" @on-change="changeLevel"></Checkbox>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="search"
            @click.prevent="searchSubmit"
            >查询</Button
          >
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.editBtnLoading"
            class="ivu-btn export"
            @click.prevent="exportExcel"
            >导出Excel</Button
          >
        </FormItem>
        <FormItem v-if="isSetPassword == false"><Button  type="primary"   class="ivu-btn export" @click="setPassword" >设置代理报表密码</Button></FormItem>
        <FormItem></FormItem>
      </Form>
      <div class="fr">
        <span class="pr10">计算公式</span>
        <Poptip trigger="hover" placement="bottom-end">
          <div slot="content">
            <div>团队净盈利=会员输赢+团队佣金+优惠金额</div>
            <div class="mt5">优惠金额=存款优惠+活动优惠+返水优惠</div>
            <div class="red-font mt5">
              温馨提示：所有栏位数据为自身账号与所有下级数据之和
            </div>
          </div>
          <Icons type="bangzhutishi" color="#E4E4E4" :size="26" />
        </Poptip>
      </div>
    </div>
    <div class="v2-table">
      <Breadcrumb separator=">" style="margin: 10px 10px 15px 0px">
        <BreadcrumbItem v-for="(bread, i) in breadList" :key="'bread' + i">
          <span class="blue-font" @click="linkTo(bread, i, 'top')">{{
            bread
          }}</span>
        </BreadcrumbItem>
      </Breadcrumb>
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="showType == 'member' ? table._columns : table.columns"
        :value="table.data"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="onSortChange"
      ></Tables>
    </div>
    <Modals
      title="代理报表密码"
      width="600"
      @modalVisible="modalVisible(arguments,isSetPassword == false ?'reSetPassword':'checkedPassword')"
      ref="agencyPasswordModals"
    >
      <div slot="content">
        <Form :label-width="180" ref="formKey" :rules="rules" :model="formKey">
          <FormItem label="密码"   v-if="isSetPassword==true" prop="password">
            <Input
          
              v-model="formKey.password"
              type="password"
              
              class="w260x"
               @keyup.enter.native="  passWordSave(
                  isSetPassword == false ? 'reSetPassword' : 'checkedPassword'
                )" 
              placeholder="请输入代理报表密码"
            />
          </FormItem>
          <!-- 初始设置密码 -->
           <FormItem
            v-if="isSetPassword == false"
            label="密码"
            prop="new_password"
          >
            <Input
              class="w260x"
                 type="password"
              autocomplete=“off”
              v-model="formKey.new_password"
              placeholder="请设置代理报表查看密码" 
            />
          </FormItem>
          <FormItem
            v-if="isSetPassword == false"
            label="确认密码"
            
            prop="new_password_confirmation"
          >
            <Input
              class="w260x"
                 type="password"
               autocomplete=“off”
              v-model="formKey.new_password_confirmation" 
              placeholder="请确认代理报表查看密码"
            />
          </FormItem>
          <FormItem>
            <Button
              @click="
                passWordSave(
                  isSetPassword == false ? 'reSetPassword' : 'checkedPassword'
                )
              "
              class="w260x ivu-btn commonSubmit"
              type="primary"
              >确认</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import {
  getAgencyReportData,
  adAssertSetPassword,
  adVerifyPassword,
} from "@/api/report";
import { adResetPassword } from "@/api/user";
import { mapState, mapMutations } from "vuex";
import Modals from "@/components/modals";
import Icons from "_c/icons";
import { routeEqual, getTagNavListFromLocalstorage } from "@/libs/util";
export default {
  name: "agencyReport",
  components: {
    Tables,
    Icons,
    Modals,
  },
  data() {
         const validatorNewpassword = (rule, val, cb) => {
      if (!val || val == "" || val == undefined) {
        cb("请设置代理报表查看密码");
      } else {
        let reg = /^[0-9a-zA-Z_-]{8,20}$/;
        if (!reg.test(val)) {
          //未通过
          if (val.length < 8 || val.length > 20) {
            cb("请输入长度为8~20位字符的密码");
            return;
          } else {
            cb("必须为字母，数字，中划线或下划线字符构成");
            return;
          }
        } else {
          cb();
        }
      }
    };
    
        const validatorNewpasswordConfirmation = (rule, val, cb) => {
      if (!val || val == "" || val == undefined) {
        cb("请确认代理报表查看密码");
      } else {
        let reg = /^[0-9a-zA-Z_-]{8,20}$/;
        if (!reg.test(val)) {
          //未通过
          if (val.length < 8 || val.length > 20) {
            cb("请输入长度为8~20位字符的密码");
            return;
          } else {
            cb("必须为字母，数字，中划线或下划线字符构成");
            return;
          }
        } else {
          cb();
        }
      }
    };
    return {
      newCheckStatus:false,
      toList: "",
      formKey: {
        password: "",
        siteId: this.$root.nowSite.id,
        new_password: "",
        new_password_confirmation: "",
      },
      rules: {
        password: [
          {
            required: true,
            message: "请输入代理报表密码",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
         new_password: [
          {
            required: true,
            validator: validatorNewpassword,
            trigger: "blur",
          },
        ],
        new_password_confirmation: [
          {
            required: true,
            validator: validatorNewpasswordConfirmation,
            trigger: "blur",
          },
        ],
      },
      spinShow: true,
      isSetPassword: false,
      level: false,
      showType: "agency",
      breadList: ["列表首页"],
      otherName: "", // 通过列表或者面包屑点击进来的数据
      searchKey: {
        siteId: this.$root.nowSite.id,
        startTime: this.$root.startTime(),
        endTime: this.$root.midnight(),
        level: 0,
        fromReg: false,
      },
      Time: [this.$root.startTime(), this.$root.midnight()],
      page: 1,
      table: {
        total: 0,
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 65,
            tooltip: true,
            render: (h, params) => {
              let { isAgency, userName } = params.row;
              let arr = [];
              let list = [
                "betUserCount",
                "firstDepositAmount",
                "betAmount",
                "netAmount",
                "agencyRebateAmount",
                "bonusAmount",
                "profit",
                "depositAmount",
                "withdrawalsAmount",
                "teamBalance",
              ];
              for (let key in params.row) {
                if (list.includes(key))
                  arr.push(Number(params.row[key]).toFixed(2) == "0.00");
              }
              let flag = arr.includes(false) ? true : false;
              return (
                <span
                  class={{
                    "blue-font":
                      (isAgency == "yes" && !userName.includes("自身")) ||
                      (userName == "直属会员" && flag),
                  }}
                  onClick={() => {
                    this.level = false;
                    this.searchKey.level = 0;
                    if (
                      (isAgency == "yes" && !userName.includes("自身")) ||
                      (userName == "直属会员" && flag)
                    ) {
                      this.updateBread(params);
                      this.showType =
                        userName == "直属会员" ? "member" : "agency";
                    }
                  }}
                >
                  {userName}
                </span>
              );
            },
          },
          {
            title: "账号类型",
            key: "memberType",
            align: "center",
            minWidth: 50,
            render: (h, params) => (
              <span>{this.$root.text(params.row.memberType)}</span>
            ),
          },
          {
            title: "注册人数",
            key: "regUserCount",
            align: "center",
            sortable: "custom",
            minWidth: 55,
            className: "agenc",
          },
          {
            title: "投注人数",
            key: "betUserCount",
            align: "center",
            minWidth: 45,
          },
          {
            title: "首存金额",
            key: "firstDepositAmount",
            align: "center",
            sortable: "custom",
            minWidth: 110,
            tooltip: true,
            render: (h, params) => (
              <span>
                {this.$root.keepTwo(params.row.firstDepositAmount)}/
                {params.row.firstDepositUserCount}人
              </span>
            ),
          },
          {
            title: "有效投注",
            key: "validBetAmount",
            align: "center",
            sortable: "custom",
            minWidth: 80,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
            ),
          },
          {
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            sortable: "custom",
            minWidth: 80,
            tooltip: true,
            render: (h, params) => {
              let color =
                params.row.netAmount > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return (
                <span style={{ color }}>
                  {this.$root.keepTwo(params.row.netAmount)}
                </span>
              );
            },
          },
          {
            title: "直推返佣",
            key: "directCommission",
            align: "center",
            sortable: "custom",
            minWidth: 70,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.directCommission)}</span>
            ),
          },
          {
            title: "级差返佣",
            key: "rankCommission",
            align: "center",
            sortable: "custom",
            minWidth: 70,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.rankCommission)}</span>
            ),
          },
          {
            title: "团队佣金",
            key: "agencyRebateAmount",
            align: "center",
            sortable: "custom",
            minWidth: 55,
            tooltip: true,
            render: (h, params) => {
              return (
                <div>
                  <span
                    style={{
                      display:
                        this.$root.modeName() == "mode_e"
                          ? "none"
                          : "inline-block",
                    }}
                  >
                    {this.$root.keepTwo(params.row.agencyRebateAmount)}
                  </span>
                  <Poptip
                    trigger="hover"
                    placement="right-start"
                    width="208"
                    popper-class="top-wrap"
                    transfer
                  >
                    <span
                      class={{
                        cs:
                          params.row.userName != "总计" &&
                          params.row.agencyRebateAmount != "0.00",
                      }}
                      style={{
                        display:
                          this.$root.modeName() == "mode_e"
                            ? "inline-block"
                            : "none",
                      }}
                    >
                      <span class="blue">
                        {this.$root.keepTwo(params.row.agencyRebateAmount)}
                      </span>
                    </span>
                    <div
                      class="tip-box"
                      slot="content"
                      style={{
                        display:
                          params.row.userName == "总计" ||
                          params.row.agencyRebateAmount == "0.00"
                            ? "none"
                            : "inline-block",
                      }}
                    >
                      <div>
                        <ul>
                          <li>
                            <span>晋级礼金奖励</span>
                            <span>
                              {this.$root.keepTwo(params.row.modeEInviteGift)}
                            </span>
                          </li>
                          <li>
                            <span>周俸禄奖励</span>
                            <span>
                              {this.$root.keepTwo(
                                params.row.modeEInviteWeekGift
                              )}
                            </span>
                          </li>
                          <li>
                            <span>月俸禄奖励</span>
                            <span>
                              {this.$root.keepTwo(
                                params.row.modeEInviteMonthGift
                              )}
                            </span>
                          </li>
                          <li>
                            <span>分红奖励</span>
                            <span>
                              {this.$root.keepTwo(
                                params.row.modeEInviteFenhongGift
                              )}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Poptip>
                </div>
              );
            },
          },
          {
            title: "优惠金额",
            key: "bonusAmount",
            align: "center",
            sortable: "custom",
            minWidth: 65,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.bonusAmount)}</span>
            ),
          },
          {
            title: "团队净盈利",
            key: "profit",
            align: "center",
            minWidth: 75,
            tooltip: true,
            render: (h, params) => {
              let color =
                params.row.profit > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return (
                <span style={{ color }}>
                  {this.$root.keepTwo(params.row.profit)}
                </span>
              );
            },
          },
          {
            title: "总存款",
            key: "depositAmount",
            align: "center",
            sortable: "custom",
            minWidth: 92,

            render: (h, params) => (
              // console.log(params.row.depositPeopleCount)
              <span>
                {this.$root.keepTwo(params.row.depositAmount)}/
                {params.row.depositPeopleCount}人
              </span>
            ),
          },
          {
            title: "总取款",
            key: "withdrawalsAmount",
            align: "center",
            sortable: "custom",
            minWidth: 92,
            tooltip: true,
            render: (h, params) => (
              <span>
                {this.$root.keepTwo(params.row.withdrawalsAmount)}/
                {params.row.withdrawalsPeopleCount}人
              </span>
            ),
          },
          {
            title: "团队余额",
            key: "teamBalance",
            align: "center",
            minWidth: 70,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.teamBalance)}</span>
            ),
          },
        ],
        _columns: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "账号类型",
            key: "memberType",
            align: "center",
            minWidth: 55,
            render: (h, params) => (
              <span>{this.$root.text(params.row.memberType)}</span>
            ),
          },
          {
            title: "首存金额",
            key: "firstDepositAmount",
            align: "center",
            sortable: "custom",
            minWidth: 110,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.firstDepositAmount)}</span>
            ),
          },
          {
            title: "投注金额",
            key: "betAmount",
            align: "center",
            sortable: "custom",
            minWidth: 85,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.betAmount)}</span>
            ),
          },
          {
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            sortable: "custom",
            minWidth: 85,
            tooltip: true,
            render: (h, params) => {
              let color =
                params.row.netAmount > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return (
                <span style={{ color }}>
                  {this.$root.keepTwo(params.row.netAmount)}
                </span>
              );
            },
          },
          {
            title: "直推返佣",
            key: "directCommission",
            align: "center",
            sortable: "custom",
            minWidth: 70,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.directCommission)}</span>
            ),
          },
          {
            title: "级差返佣",
            key: "rankCommission",
            align: "center",
            sortable: "custom",
            minWidth: 70,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.rankCommission)}</span>
            ),
          },
          {
            title: "优惠金额",
            key: "bonusAmount",
            align: "center",
            sortable: "custom",
            minWidth: 75,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.bonusAmount)}</span>
            ),
          },
          {
            title: "会员净盈利",
            key: "profit",
            align: "center",
            minWidth: 90,
            tooltip: true,
            render: (h, params) => {
              let color =
                params.row.netAmount > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return (
                <span style={{ color }}>
                  {this.$root.keepTwo(params.row.profit)}
                </span>
              );
            },
          },
          {
            title: "存款",
            key: "depositAmount",
            align: "center",
            sortable: "custom",
            minWidth: 75,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.depositAmount)}</span>
            ),
          },
          {
            title: "取款",
            key: "withdrawalsAmount",
            align: "center",
            sortable: "custom",
            minWidth: 75,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.withdrawalsAmount)}</span>
            ),
          },
          {
            title: "余额",
            key: "teamBalance",
            align: "center",
            minWidth: 100,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.teamBalance)}</span>
            ),
          },
        ],
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.toList = to;
      let data = {
        siteId: vm.$root.nowSite.id,
        type: "pwd_agency_report",
      };
      adAssertSetPassword(data).then((res) => {
        if (res != undefined && res.code == 200) {
          vm.isSetPassword = res.data;
          vm.formKey.password = "";
          vm.$refs.formKey.resetFields();
          let newCheckStatus = JSON.parse(localStorage.accessSite).find(
            (t) => t.id == vm.$root.nowSite.id
          ).agencyStatus;
          console.log(newCheckStatus)
       if( vm.isSetPassword==false){
            vm.spinShow = false;
            vm.getData({ params: vm.searchKey });
       }else{
           if(newCheckStatus==true){
                vm.spinShow = false;
                vm.getData({ params: vm.searchKey });
           }else{

               vm.spinShow = true;
                vm.$refs.agencyPasswordModals.show();
           }

       }
  
        }
      });
    });
  },
  created() {
    if (this.$root.modeName() != "mode_c") {
      let agencyC = [];
      let memberC = [];
      this.table.columns.forEach((t) => {
        if (t.key != "directCommission" && t.key != "rankCommission")
          agencyC.push(t);
      });
      this.table._columns.forEach((t) => {
        if (t.key != "directCommission" && t.key != "rankCommission")
          memberC.push(t);
      });
      this.table.columns = agencyC;
      this.table._columns = memberC;
    }
  },
  methods: {
    ...mapMutations(["closeTag"]),
    setPassword(){
        this.$refs.agencyPasswordModals.show();
        this.$refs.formKey.resetFields();

    },
    modalVisible(flag,type) {

      if(type=='checkedPassword'){

        let e1 = event.currentTarget;
     let e2 = event.target; 
     let value = flag[0];
     if(e1!=e2){
         
         if (value == false) {
           let newTag = getTagNavListFromLocalstorage()[0];
           if (newTag.name == "memberSearch") {
             this.$router.push({ name: this.$config.homeName });
             this.closeTag(this.toList);
           } else {
             this.closeTag(this.toList);
           }
         }
     }
      }
    },
    passWordSave(type) {
      let passData = { ...this.formKey, type: "pwd_agency_report" };
           for (let key in passData) {
                  if (!passData[key]) delete passData[key];
                }
      this.$refs.formKey.validate((valid) => {
        if (valid) {
           this.$root.startEditLoading();
           if(type=='reSetPassword'){
             passData.password='12345678'
             adResetPassword(passData,true).then(res=>{
                if(res!=undefined&&res.code==200){
                    this.$root.endEditLoading();
                      let newAccessSite = JSON.parse(localStorage.accessSite);
              newAccessSite.forEach((t) => {
                if (t.id == this.$root.nowSite.id) {
                  this.$set(t, "agencyStatus", true);
                  
                }
              });
              console.log(this.isSetPassword)
               localStorage.accessSite=JSON.stringify(newAccessSite);
               this.$refs.agencyPasswordModals.hide();
               
                 let data = { ...this.searchKey };
                    for (let key in data) {
                  if (!data[key]) delete data[key];
                }
                    this.spinShow = false;
                    this.getData({ params: data });
               }
             })

           }
           if(type=='checkedPassword'){

             adVerifyPassword(passData, true).then((res) => {
               if (res != undefined && res.code == 200) {
                 this.$refs.agencyPasswordModals.hide();
               //   localStorage.agencyStatus = true;
                 let newAccessSite = JSON.parse(localStorage.accessSite);
                 newAccessSite.forEach((t) => {
                   if (t.id == this.$root.nowSite.id) {
                     this.$set(t, "agencyStatus", true);
                   }
                 });
                 localStorage.accessSite = JSON.stringify(newAccessSite);
                 this.spinShow = false;
                 this.getData({ params: this.searchKey });
               }
             });
           }
        }
      });
    },
    changeBtn() {
      this.searchSubmit();
    },
    changeLevel(val) {
      if (val == true) {
        this.searchKey.level = 1;
        this.breadList = ["三级代理首页"];
      } else {
        this.searchKey.level = 0;
        this.breadList = ["列表首页"];
      }
      let data = { ...this.searchKey };
      if (data.fromReg) {
        data.fromReg = data.fromReg == true ? 1 : 0;
      }
      this.getData({ params: data });
    },
    getData(data) {
      this.$root.startTableLoading();
      for (let key in data.params) {
        if (!data.params[key]) delete data.params[key];
      }
      getAgencyReportData(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            let { data, total } = res.data;
            data.list.length &&
              data.list.push(this.createTotalData(data.total));
            this.table.data = data.list;
            this.table.total = total;
            let typeList = [];

            data.list &&
              data.list.forEach((t) => {
                if (t.isAgency || t.isAgency != undefined)
                  typeList.push(t.isAgency);
              });

            //数据为空，默认查询代理模式
            // this.showType = typeList && typeList.includes('yes') ? 'agency' : 'member'
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    createTotalData(total) {
      const {
        regUserCount,
        betUserCount,
        firstDepositUserCount,
        directCommission,
        rankCommission,
        firstDepositAmount,
        betAmount,
        netAmount,
        agencyRebateAmount,
        bonusAmount,
        profit,
        depositAmount,
        withdrawalsAmount,
        teamBalance,
        depositPeopleCount,
        withdrawalsPeopleCount,
      } = total;
      let item = {
        userName: "总计",
        memberType: "-",
        directCommission,
        rankCommission,
        regUserCount,
        betUserCount,
        firstDepositAmount,
        firstDepositUserCount,
        betAmount,
        netAmount,
        agencyRebateAmount,
        bonusAmount,
        profit,
        depositAmount,
        withdrawalsAmount,
        teamBalance,
        depositPeopleCount,
        withdrawalsPeopleCount,
      };
      return item;
    },
    searchSubmit(direction) {
      if (this.level == true) {
        this.breadList = ["三级代理首页"];
      } else {
        this.breadList = ["列表首页"];
      }
      if (this.page != 1) this.$refs.table.setPage();
      if (direction != "sort") {
        let { sortKey, sortVal } = this.searchKey;
        if (sortKey) delete this.searchKey.sortKey;
        if (sortVal) delete this.searchKey.sortVal;
        this.table.columns.forEach((t) => {
          if (t.sortable == "custom") this.$set(t, "sortType", "");
        });
      }
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
      };

      if (data.fromReg) {
        data.fromReg = data.fromReg == true ? 1 : 0;
      }

      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      let { startTime, endTime } = data;
      if (startTime == "Invalid date" || endTime == "Invalid date") {
        this.$Tip.info({ content: "请输入开始和结束时间" });
        return false;
      }
      if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        this.$Tip.info({ content: "结束时间必须大于开始时间" });
        return false;
      }
      if (data.userName) data.userName = this.$root.trimAll(data.userName);
      if (data.userName && !this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.searchKey.startTime = data.startTime;
      this.searchKey.endTime = data.endTime;

      if (direction == "newPage") {
        this.page == 1
          ? this.getData({ params: data })
          : this.getData({ params: data, query: { page: this.page } });
      } else {
        this.getData({ params: data, query: { page: 1 } });
      }
    },
    updateBread(params) {
      let { sortKey, sortVal } = this.searchKey;
      if (sortKey) delete this.searchKey.sortKey;
      if (sortVal) delete this.searchKey.sortVal;
      this.table.columns.forEach((t) => {
        if (t.sortable == "custom") this.$set(t, "sortType", "");
      });
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.Time;
        this.searchKey.startTime =
          startTime && this.$root.formatTimeS(startTime);
        this.searchKey.endTime =
          endTime && this.$root.formatnightTimeS(endTime);
      } else return false;
      if (this.Time.length < 2) {
        this.$Tip.info({ content: "请输入开始和结束时间" });
        return false;
      }
      const { userName } = params.row;
      this.breadList.push(userName);
      if (this.searchKey.userName) delete this.searchKey.userName;
      let data = {
        ...this.searchKey,
        listType: userName == "直属会员" ? "1" : "0",
        upUserName:
          userName == "直属会员"
            ? this.breadList[this.breadList.length - 2]
            : userName,
      };
      if (data.fromReg) {
        data.fromReg = data.fromReg == true ? 1 : 0;
      }

      this.getData({ params: data });
    },
    linkTo(params, index, direction) {
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.Time;
        this.searchKey.startTime =
          startTime && this.$root.formatTimeS(startTime);
        this.searchKey.endTime =
          endTime && this.$root.formatnightTimeS(endTime);
      } else return false;
      if (this.Time.length < 2) {
        this.$Tip.info({ content: "请输入开始和结束时间" });
        return false;
      }
      this.breadList = this.breadList.slice(0, index + 1);
      let data = {};
      if (this.searchKey.userName) delete this.searchKey.userName;

      if (params == "列表首页") {
        data = { ...this.searchKey };
      } else if (params == "三级代理首页") {
        data = { ...this.searchKey, level: 1 };
        this.level = true;
      } else {
        data = {
          ...this.searchKey,
          upUserName: params == "直属会员" ? this.breadList[index - 1] : params,
          listType: params == "直属会员" ? "1" : "0",
        };
      }
      if (data.fromReg) {
        data.fromReg = data.fromReg == true ? 1 : 0;
      }

      this.showType = params == "直属会员" ? "member" : "agency";
      if (direction == "top") {
        this.getData({ params: data });
      } else if (direction == "page") {
        this.page == 1
          ? this.getData({ params: data })
          : this.getData({ params: data, query: { page: 1 } });
      } else if (direction == "sort") {
        this.page == 1
          ? this.getData({ params: data })
          : this.getData({ params: data, query: { page: 1 } });
      } else {
        this.page == 1
          ? this.getData({ params: data })
          : this.getData({ params: data, query: { page: this.page } });
      }
    },
    onPageChange(page) {
      this.page = page;
      if (this.breadList.length == 1) {
        this.searchSubmit("newPage");
      } else {
        this.linkTo(
          this.breadList[this.breadList.length - 1],
          this.breadList.length - 1,
          "bottom"
        );
      }
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      if (this.breadList.length == 1) {
        this.searchSubmit();
      } else {
        this.linkTo(
          this.breadList[this.breadList.length - 1],
          this.breadList.length - 1,
          "page"
        );
      }
    },
    onSortChange({ column, key, order }) {
      delete this.searchKey.sortKey;
      delete this.searchKey.sortVal;
      let data = {
        sortKey: key,
        sortVal: order,
        ...this.searchKey,
      };
      if (data.fromReg) {
        data.fromReg = data.fromReg == true ? 1 : 0;
      }
      this.searchKey.sortKey = key;
      if (data.sortVal == "normal") {
        this.table.columns.forEach((t) => {
          if (t.key == column.key) this.$set(t, "sortType", "asc");
        });
        this.searchKey.sortVal = "asc";
        data.sortVal = "asc";
      } else {
        this.table.columns.forEach((t) => {
          delete t.sortType;
        });
        this.searchKey.sortVal = order;
      }
      this.page == 1 ? "" : this.$refs.table.setPage();
      if (this.breadList.length == 1) {
        this.searchSubmit("sort");
      } else {
        this.linkTo(
          this.breadList[this.breadList.length - 1],
          this.breadList.length - 1,
          "sort"
        );
      }
    },
    exportExcel() {
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.Time;
        this.searchKey.startTime =
          startTime && this.$root.formatTimeS(startTime);
        this.searchKey.endTime =
          endTime && this.$root.formatnightTimeS(endTime);
      } else return false;
      if (this.Time.length < 2) {
        this.$Tip.info({ content: "请输入开始和结束时间" });
        return false;
      }
      if (this.searchKey.userName)
        this.searchKey.userName = this.$root.trimAll(this.searchKey.userName);
      if (
        this.searchKey.userName &&
        !this.$root.validateName(this.searchKey.userName)
      ) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      let data = {};
      if (this.breadList.length == 1) {
        data = { ...this.searchKey, isExport: 1, isExportType: "0" };
      } else {
        data = {
          ...this.searchKey,
          upUserName:
            this.breadList[this.breadList.length - 1] == "直属会员"
              ? this.breadList[this.breadList.length - 2]
              : this.breadList[this.breadList.length - 1],
          listType:
            this.breadList[this.breadList.length - 1] == "直属会员" ? "1" : "0",
          isExport: 1,
          isExportType:
            this.breadList[this.breadList.length - 1] == "直属会员" ? "1" : "0",
        };
      }
      if (data.fromReg) {
        data.fromReg = data.fromReg == true ? 1 : 0;
      }
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      let postData = { params: data };
      this.page == 1 ? "" : (postData.query = { page: this.page });
      this.$root.startEditLoading();
      let openr = window.open();
      getAgencyReportData(postData,true)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            let region = res.data.downloadUrl;
            let nowHost = region.split(".com")[1];
            let openr1 = openr ? openr : window;
            openr1.location.href = nowHost;
          } else {
            openr.close();
          }
          this.$root.endEditLoading();
        })
        .catch((error) => this.$root.endEditLoading());
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
.ivu-form-item {
  &:nth-child(3) {
    margin-right: -5px;
  }
}
</style>


