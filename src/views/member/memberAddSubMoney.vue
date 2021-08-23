<template>
  <div class="v2-serch">
    <Modals ref="oneTabFundsModal" :title="fundsModalTitle" :width="804">
      <div slot="content" v-if="flag">
        <Tabs type="card" value="single">
          <TabPane label="加款/减款" name="single">
            <FundsForms
              ref="oneTabFundsForms"
              mode="single"
              :oprateTypes="oprateTypes"
              @on-submit="submitFundsForm"
            ></FundsForms>
          </TabPane>
        </Tabs>
      </div>
    </Modals>
    <Modals ref="twoTabFundsModal" :title="fundsModalTitle" @modalVisible="modalVisible">
      <div slot="content" v-if="flag">
        <Tabs value="single" @on-click="tabChange">
          <TabPane label="加款/减款" name="single">
            <FundsForms
              ref="twoTabFundsForms"
              mode="single"
              :height="'oprateTypes'"
              :oprateTypes="oprateTypes1"
              :addShow="addShow"
              :reduceShow="reduceShow"
              :show-multiple="showMultiple"
              @on-submit="submitFundsForm"
            ></FundsForms>
          </TabPane>
          <TabPane label="批量加款/减款" name="batch">
            <FundsForms
              ref="twoTabFundsFormsBatch"
              :oprateTypes="oprateTypes"
              mode="batch"
              :addShow="addShow"
              :reduceShow="reduceShow"
              :show-multiple="showMultiple"
              @on-submit="submitFundsForm"
            ></FundsForms>
          </TabPane>
        </Tabs>
      </div>
    </Modals>
  </div>
</template>

<script>
import Modals from "@/components/modals";
import { memberBalanceHandle } from "@/api/member";
import FundsForms from "./components/funds-forms";
import { getUserType } from "@/libs/util";
import { siteManagementDetail } from "@/api/system";

export default {
  name: "memberAddSubMoney",
  components: {
    Modals,
    FundsForms
  },
  data() {
    return {
      showMultiple: true,
      addShow: true,
      reduceShow: true,
      authInPage: JSON.parse(localStorage.authInPage),
      adminType: getUserType(),
      flag: true,
      fundsModalTitle: "加款/减款",
      oprateTypes: {
        add: {
          manual: {
            id: 0,
            type: "deposit",
            key: "memberIncomeArtificialRemittance",
            subType: "manual",
            class: "存款",
            subClass: "人工存款"
          },
          giftBonusAdmin: {
            id: 1,
            type: "bonus",
            subType: "giftBonusAdmin",
            key: "memberIncomeActivitiesSend",
            class: "优惠",
            subClass: "活动优惠"
          },
          RebateBonus: {
            type: "bonus",
            subType: "manualRebateBonus",
            key: "memberIncomeRefundSend",
            class: "优惠",
            subClass: "人工返水"
          },
          bonus: {
            id: 3,
            type: "bonus",
            subType: "manualBonus",
            class: "优惠",
            key: "memberIncomeDepositFavorable",
            subClass: "存款优惠"
          },
          transfer: {
            id: 4,
            type: "other",
            subType: "transfer",
            class: "其它",
            key: "memberIncomeLineConversionError",
            subClass: "额度转换失败"
          },
            dfmanual: {
            id: 9,
            type: "deposit",
            subType: "dfmanual",
            class: "存款",
            key: "memberIncomeDfmanual",
            subClass: "人工代充"
          },
          other: {
            id: 5,
            type: "deposit",
            subType: "other",
            class: "存款",
            key: "memberIncomeOther",
            subClass: "其它"
          },

        },
        reduce: {
          manual: {
            id: 6,
            type: "withdrawals",
            subType: "manual",
            class: "取款",
            key: "memberOutArtificialTake",
            subClass: "人工取款"
          },
          errorKeepWithdrawals: {
            id: 8,
            type: "other",
            subType: "errorKeepWithdrawals",
            class: "其它",
            key: "memberOutErrorKeepWithdrawals",
            subClass: "误存取款"
          },
          other: {
            id: 7,
            type: "withdrawals",
            subType: "other",
            class: "取款",
            key: "memberOutOther",
            subClass: "其它"
          }
        }
      },
      oprateTypes1: {//单个添加
        add: {
          manual: {
            id: 0,
            type: "deposit",
            key: "memberIncomeArtificialRemittance",
            subType: "manual",
            class: "存款",
            subClass: "人工存款"
          },
          giftBonusAdmin: {
            id: 1,
            type: "bonus",
            subType: "giftBonusAdmin",
            key: "memberIncomeActivitiesSend",
            class: "优惠",
            subClass: "活动优惠"
          },
          RebateBonus: {
            type: "bonus",
            subType: "manualRebateBonus",
            key: "memberIncomeRefundSend",
            class: "优惠",
            subClass: "人工返水"
          },
          bonus: {
            id: 3,
            type: "bonus",
            subType: "manualBonus",
            class: "优惠",
            key: "memberIncomeDepositFavorable",
            subClass: "存款优惠"
          },
          transfer: {
            id: 4,
            type: "other",
            subType: "transfer",
            class: "其它",
            key: "memberIncomeLineConversionError",
            subClass: "额度转换失败"
          },
            dfmanual: {
            id: 9,
            type: "deposit",
            subType: "dfmanual",
            class: "存款",
            key: "memberIncomeDfmanual",
            subClass: "人工代充"
          },
          autoWithdraw:{
            id: 10,
            type: "deposit",
            subType: "autoWithdraw",
            class: "存款",
            key:'memberIncomeAutoWithdraw',
            subClass: "自动出款失败"
          },
          other: {
            id: 5,
            type: "deposit",
            subType: "other",
            class: "存款",
            key: "memberIncomeOther",
            subClass: "其它"
          },

        },
        reduce: {
          manual: {
            id: 6,
            type: "withdrawals",
            subType: "manual",
            class: "取款",
            key: "memberOutArtificialTake",
            subClass: "人工取款"
          },
          errorKeepWithdrawals: {
            id: 8,
            type: "other",
            subType: "errorKeepWithdrawals",
            class: "其它",
            key: "memberOutErrorKeepWithdrawals",
            subClass: "误存取款"
          },
          other: {
            id: 7,
            type: "withdrawals",
            subType: "other",
            class: "取款",
            key: "memberOutOther",
            subClass: "其它"
          }
        }
      }
    
    };
    
  },
  computed: {
    showAddSubMoney() {
      return this.$store.state.app.addSubMoney;
    }
  },
  watch: {
    showAddSubMoney() {
      //解决直接渲染了子组件
      this.flag = true;
      this.$nextTick(() => {
        siteManagementDetail({ id: this.$root.nowSite.id }).then(res => {
          if (res.code === 200) {
            let {
              data: {
                siteConfig: {
                  limit: { withdrawalsMultiple }
                }
              }
            } = res;
            if (withdrawalsMultiple === "1") {
              this.showMultiple = true;
            } else if (withdrawalsMultiple === "0") {
              this.showMultiple = false;
            }
          }
        });
        this.$refs.twoTabFundsForms.setOrigin();
        this.$refs.twoTabFundsModal.show();
      });
    },
    fundsModalTitle: {
      handler(val, oldVal) {
        for (let key in this.oprateTypes.add) {
          if (!this.authInPage.includes(this.oprateTypes.add[key].key))
            delete this.oprateTypes.add[key];
        }
        if (Object.keys(this.oprateTypes.add).length == 0) this.addShow = false;
        else this.addShow = true;

        for (let key in this.oprateTypes1.add) {
          if (!this.authInPage.includes(this.oprateTypes1.add[key].key))
            delete this.oprateTypes1.add[key];
        }
        if (Object.keys(this.oprateTypes1.add).length == 0) this.addShow = false;
        else this.addShow = true;
        // 减款权限
        for (let key in this.oprateTypes.reduce) {
          if (!this.authInPage.includes(this.oprateTypes.reduce[key].key))
            delete this.oprateTypes.reduce[key];
        }
        if (Object.keys(this.oprateTypes.reduce).length == 0)
          this.reduceShow = false;
        else this.reduceShow = true;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 会员加减款
    tabChange(tabName) {
      this.fundsModalTitle =
        tabName === "single" ? "加款/减款" : "批量加款/减款";
      if (tabName === "single") {
        this.$refs["twoTabFundsFormsBatch"].resetForm();
        this.$refs["twoTabFundsForms"].resetForm();
      } else {
        this.$refs["twoTabFundsForms"].resetForm();
        this.$refs["twoTabFundsFormsBatch"].resetForm();
      }
    },
    submitFundsForm(params) {
      // params.remarks = "暂无备注";

      if (params.handle == "加款") {
        params.handle = "+";
      }
      if (params.handle == "减款") {
        params.handle = "-";
      }
      this.$root.startEditLoading(this);
      memberBalanceHandle(params, true)
        .then(res => {
          if (res != undefined && res.code == 200) {
            let msg = params.handle === "+" ? "会员加款成功" : "会员减款成功";
            this.$refs["twoTabFundsModal"].hide();
            if (typeof res.data === "object" && res.data !== null) {
              const { not_enough, not_exists,bonusBlackList } = res.data;
              let mount, account,blacklist, aDetail, mDetail,bDetail;
              if (Array.isArray(not_enough)) {
                mount = not_enough.length;
                mDetail = not_enough.toString();
              }
              if (Array.isArray(not_exists)) {
                account = not_exists.length;
                aDetail = not_exists.toString();
              }
              if(Array.isArray(bonusBlackList)){
                blacklist=bonusBlackList.length;
                bDetail=bonusBlackList.toString();

              }
              if (account === 0 && mount === 0&&blacklist===0) {
                // this.$Tip.success({ content: "操作成功" });
                this.$Message.success(msg);
                this.$store.commit("refreshMoneyDone", {
                  count: new Date().getTime(),
                  name: this.$route.name
                });
              } else {
                this.$Tip.showAddSub({
                  show: true,
                  mount,
                  account,
                  aDetail,
                  mDetail,
                  blacklist,
                  bDetail
                });
              }
            } else {
            }
            // this.$refs['twoTabFundsForms'].resresetForm()
          } else {
          }
          if (this.fundsModalTitle === "加款/减款") {
            this.$refs["twoTabFundsForms"].disabledBtn = false;
          } else {
            this.$refs["twoTabFundsFormsBatch"].disabledBtn = false;
          }
        })
        .catch(() => {
          if (this.fundsModalTitle === "加款/减款") {
            this.$refs["twoTabFundsForms"].disabledBtn = false;
          } else {
            this.$refs["twoTabFundsFormsBatch"].disabledBtn = false;
          }
        });
    },
    modalVisible(flag) {
      if (!flag) {
        this.$refs["twoTabFundsForms"].resetForm();
        this.$refs["twoTabFundsFormsBatch"].resetForm();
        this.$store.commit("refreshMenuItem");
        setTimeout(() => {
          this.flag = flag;
        }, 300);
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.ivu-form-item-content {
  .ivu-input-wrapper {
    .ivu-input:last-child::placeholder {
      color: #aaaaaa;
    }
  }
}

/deep/.ivu-tabs-bar {
  margin-left: 20px;
  .ivu-tabs-tab {
    margin-bottom: 10px;
  }
}
/deep/.ivu-tabs-tab {
  font-size: 1rem /* 16/16 */;
  color: #444;
}
/deep/textarea.ivu-input {
  max-height: 120px;
}
</style>
