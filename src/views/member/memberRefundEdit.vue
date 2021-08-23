<template>
  <div class="v2-edit">
    <div class="items bb">
      <div class="mb20">基础设置</div>
      <div class="section backWater">
        <Form ref="Form" :model="formKey" :rules="rules" :key="$route.params.page">
          <FormItem class="ti10" label="等级名称" prop="levelName">
            <Level-select
              ref="levelSelect"
              class="ib fontColor"
              v-model="formKey.levelName"
              v-if="$route.params.page==='create'"
              placeholder="等级名称"
              width="320"
              :levelType="'refund'"
              @on-level-change="levelChange"
            />
            <Input
              v-else
              class="w320x"
              :value="formKey.levelName"
              :disabled="$route.params.page==='edit'"
              placeholder="等级名称"
            />
          </FormItem>
          <FormItem class="ti10" label="等级别称" prop="levelAlias">
            <Input class="w320x" placeholder="等级别称" v-model="formKey.levelAlias"/>
          </FormItem>
          <FormItem class="ti10" label="最低下注" prop="lessBetAmount">
            <Input-number class="w320x" placeholder="最低下注" v-model="formKey.lessBetAmount"
            :step="1" :max="99999999" :min="0"
            />
          </FormItem>
          <FormItem class="ti10" label="最大返水" prop="maxBonusAmonut">
            <Input-number class="w320x" placeholder="最大返水" v-model="formKey.maxBonusAmonut"
            :step="1" :max="99999999" :min="0"
            />
          </FormItem>
          <!-- <FormItem class="ti10" label="备注信息" prop="remark">
            <Input
              class="w320x"
              type="textarea"
              :rows="4"
              placeholder="此栏位仅供管理者记录其他资讯，会员无法检视"
              v-model="formKey.remark"
            />
          </FormItem>-->
          <FormItem class="w25 ti10">
            <div style="padding-left:100px" @click="formKey.default==='yes'?formKey.default='no':formKey.default==='no'?formKey.default='yes':''">
              <Icon
                v-if="formKey.default==='no'"
                type="md-checkmark-circle"
                size="16"
                color="#E4E4E4"
                class="pr5"
              />
              <Icon
                v-else
                type="md-checkmark-circle"
                size="16"
                color="#57a3f3"
                class="pr5"
              />
              <span class="ml5 cs">设为默认？</span>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="items mt15 bb">
      <div class="section">
        <RefundSelect ref="RefundSelect" :editable='editable' :exitParent='false' :data="refund" @on-refund-change="onRefundChange"></RefundSelect>
      </div>
    </div>
    <div class="items mt15">
      <div class="flex-row p10">
        <div class="w40 flex-row">
          <Button
            type="primary"
            class="more-btn"
            @click="submit"
            :loading="$root.editBtnLoading"
          >确认提交</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import RefundSelect from "@/components/refund-select";
import LevelSelect from "@/components/level-select";
import {
  getrefundLevelDetailData,
  refundLevelUpdateData,
  refundLevelCreateData,
  refundLevelModifyStatus
} from "@/api/member";
import { agencyPlatform } from "@/api/common";
export default {
  components: { Icons, RefundSelect, LevelSelect },
  data() {
    return {
      refund: [],
      formKey: {
        id: "",
        levelName: "",
        levelLabel: "",
        levelAlias: "",
        lessBetAmount: 0,
        maxBonusAmonut: 0,
        remark: "",
        default: "no"
      },
      rules: {
        levelName: [
          {
            required: true,
            message: "请选择等级名称",
            trigger: "change"
          }
        ],
        levelAlias: [
          {
            required: true,
            message: "请输入返水等级别称",
            trigger: "blur"
          }
        ],
        lessBetAmount: [
          {
            //输入框为空提示请输入正确的最低下注金额
            type: 'number',
            required: true,
            message: "请输入正确的最低下注金额",
            trigger: "blur"
          },
          {
             //输入框金额边界值：0<金额<=99999999.99
            // type: 'number',
            pattern: /^(([0-9]\d*))$/,
            message: "最低下注金额必须是个整数",
            trigger: "blur"
          }
        ],
        maxBonusAmonut: [
          {
            type: 'number',
            required: true,
            message: "请输入最大返水金额",
            trigger: "blur"
          },
          {
            //输入框金额边界值：0<金额<=99999999.99,还要验证0非要限制输入使用inputnumber
            pattern: /^(([0-9]\d*))$/,
            message: "最大返水金额限制必须是个整数",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "请输入备注信息",
            trigger: "blur"
          }
        ]
      },
      editable: true
    };
  },
  created() {
    const { siteId, id } = this.$route.query;
    const { page } = this.$route.params;
    const data = { siteId, id };
    if (page === "edit") {
      data.purpose = "update";
      this.getData(data);
    } else {
      this.getDefaultRefund();
    }
    if (page === "create") {
      this.getLevelName();
    }
    this.$Message.config({
      top: 50,
      duration: 1
    })
  },
  methods: {
    getDefaultRefund() {
      let data = { siteId: this.$route.query.siteId };
      agencyPlatform(data).then(res => {
        if (res != undefined && res.code == 200) {
          this.refund = res.data.zore;
        }
      })
    },
    onRefundChange(res) {
      this.formKey.refund = res;
    },
    getData(data) {
      getrefundLevelDetailData(data).then(res => {
        const { basic, refund } = res.data;
        if (this.$route.params.page === "edit") {
          for (let key in this.formKey) {
            this.formKey[key] = basic[key];
          }
          this.formKey.lessBetAmount = +basic.lessBetAmount
          this.formKey.maxBonusAmonut = +basic.maxBonusAmonut
        }

        this.refund = refund;
      });
    },
    getLevelName() {
      this.$nextTick(() => {
        this.$refs.levelSelect.init(this.$root.nowSite.id, {
          levelLabel: "1",
          levelName: "vip1"
        });
      });
    },
    levelChange(res) {
      this.formKey.levelName = res.levelName;
      this.formKey.levelLabel = +res.levelLabel;
    },
    submit() {
      this.$refs.Form.validate(valid => {
        for (let key in this.formKey) {
          if (!this.formKey[key] && this.formKey[key] !== 0) delete this.formKey[key];
        }
        if (!this.formKey.refund) {
          this.formKey.refund = this.$refs.RefundSelect.createData();
        }
        if (valid) {
          if (this.$route.params.page === "create") {
            const { siteName, id } = this.$root.nowSite;
            let params = { ...this.formKey };
            params.siteId = id;
            params.siteName = siteName;
            params.default = params.default === "yes" ? 1 : 0;
            params.lessBetAmount = +params.lessBetAmount;
            params.maxBonusAmonut = +params.maxBonusAmonut;
            this.$root.startEditLoading();
            refundLevelCreateData(params, true).then(res => {
              if (res != undefined && res.code == 200){
                this.$Message.config({
                  top: 50,
                  duration: 1
                })
                this.$Message.success('添加返水等级成功')
                this.$router.push({ name: "memberRefund"})
              }
            });
          }
          if (this.$route.params.page === "edit") {
            const { siteId, id } = this.$route.query;
            let params = { ...this.formKey };
            params.siteId = siteId;
            params.default = params.default === "yes" ? 1 : 0;
            // params.status = params.default == 1 ? 1 : this.$route.query.status == 'yes' ? 1 : 0
            params.lessBetAmount = +params.lessBetAmount;
            params.maxBonusAmonut = +params.maxBonusAmonut;
            this.$root.startEditLoading();
            refundLevelUpdateData(params,true).then(res => {
              if (res != undefined && res.code == 200) {
                if (params.default == 1 && this.$route.query.status == 'no') {
                  let statusData = { siteId: this.$root.nowSite.id, id: this.$route.query.id, statusKey: "status", statusVal: 1}
                  refundLevelModifyStatus(statusData, true).then((val) => {
                    if (val != undefined && val.code == 200) {
                      this.$Message.success('修改返水等级成功')
                      this.$router.push({ name: 'memberRefund' })
                    }
                  })
                } else {
                  this.$Message.success('修改返水等级成功')
                  this.$router.push({ name: 'memberRefund' })
                }
              }
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
.v2-edit {
  .backWater {
    /deep/.ivu-select-placeholder,
    /deep/.ivu-select-selected-value {
      padding: 0;
      width:320px !important;
    }
    /deep/.ivu-input-number {
      margin-left: 10px;
      height: 30px;
      line-height: 28px;
      .ivu-input-number-input {
        padding: 0;
      }
      .ivu-input-number-handler-up-inner,
      .ivu-input-number-handler-down-inner {
        right: 15px;
      }
    }
    /deep/.ivu-form .ivu-form-item-label{padding: 8px 12px 8px 0;}
  }
}
/deep/.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  padding-left: 0;
}
/deep/.ivu-collapse-content {
  padding: 0;
}
.ivu-collapse-content > .ivu-collapse-content-box {
  padding: 0;
}
.ivu-collapse {
  border: none;
}
.info {
  justify-content: flex-start;
}

/deep/.ivu-form-item-error-tip {
  left: 340px !important;
  width: 200px;
}

/deep/.ivu-form-item-content .ivu-form-item-error-tip {
  top: 0;
}
/deep/.ivu-form-item-content {
  line-height: 0;
}
/deep/.ivu-select{
  color: #444;
}
</style>
