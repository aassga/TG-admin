<template>
  <div>
    <Form ref="formKey" :label-width="100" class="mt10" :model="formKey" :rules="rules">
      <FormItem label="代理类型">
        <Select v-model="formKey.agencyType" class="w340x">
          <Option value="agency">代理</Option>
          <Option value="shareholder">大股东</Option>
        </Select>
      </FormItem>
      <FormItem label="上级代理" v-show="showFlag" required>
        <AutoSearch
          ref="autoSearch"
          :width="340"
          :clearable="false"
          :placeholder="'上级代理账号，默认查询'"
          @sendSuperior="getSuperior"
          :siteId='$root.nowSite.id'
        ></AutoSearch>
      </FormItem>
      <FormItem :label="showFlag?'代理账号':'大股东账号'" prop="userName">
        <Input v-model="formKey.userName" placeholder="6-20位数字或字母" class="w340x"/>
      </FormItem>
      <FormItem label="默认密码">
        <Input v-model="formKey.passwd" class="w340x" disabled/>
      </FormItem>
      <FormItem label="会员等级">
        <LevelSelect
          ref="levelSelect"
          class="ib"
          width="340"
          :levelType="'agency'"
          @on-level-change="onLevelChange"
        ></LevelSelect>
         <Poptip
            class="ml10"
            trigger="hover"
            content="此代理下新注册会员会归属到指定会员等级"
            placement="right-start"
          >
        <Icons :type="'bangzhutishi'" :size="20" :color="'#b6afaf'"></Icons>
         </Poptip>
      </FormItem>
      <FormItem label="状态">
        <Select v-model="formKey.status" class="w340x">
          <Option value="yes">开启</Option>
          <Option value="no">关闭</Option>
        </Select>
      </FormItem>
      <FormItem label="备注信息">
        <Input
          v-model="formKey.remark"
          type="textarea"
          :rows="4"
          class="w340x h80"
          placeholder="此栏位仅供管理者记录其他资讯，会员无法检视"
        />
      </FormItem>
      <div v-show="rebateShow">
        <rebate-select ref="rebateSelect" :data="rebate" @on-rebate-change="onRebateChange"></rebate-select>
        <refund-select ref="refundSelect" :data="refund" @on-refund-change="onRefundChange"></refund-select>
      </div>
      <FormItem>
        <Button class="ivu-btn bg mt15 w340 ft20" @click="submit" :loading="$root.editBtnLoading">确认新增</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import RefundSelect from "@/components/refund-select";
import RebateSelect from "@/components/rebate-select";
import LevelSelect from "@/components/level-select";
import { agencyAdd, agencyRebatePlatform } from "@/api/agency";
import AutoSearch from "@/components/auto-search";
export default {
  name: "agencyAdd",
  components: { Icons, LevelSelect, RefundSelect, RebateSelect, AutoSearch },
  data() {
    return {
      showFlag: true, //true为代理显示,false为大股东显示
      rebateShow: false, //返点，返水显示
      rebate: [],
      refund: {},
      formKey: {
        agencyType: "agency",
        passwd: "123456"
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入正确的账号",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9_]{6,20}$/,
            message: "6-20位数字或字母",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    "formKey.agencyType"(newVal, oldVal) {
      this.resetForm();
      if (newVal == "agency") {
        this.showFlag = true;
        this.formKey = {
          agencyType: newVal,
          passwd: '123456'
        }
        this.rebateShow = false
        if(this.formKey.superiorUserName){
          this.rebateShow = true
        }
      } else {
        this.showFlag = false;
        this.formKey = {
          agencyType: newVal,
          passwd: 'abc1233123'
        }
        this.rebateShow = false;
        let postData = {
          uname: "",
          siteId: this.$root.nowSite.id
        };
        this.getRebateSetting(postData);
      }
    },
    '$root.nowSite': {
      handler(val,oldVal) {
        this.$nextTick(() => {
          const { name } = this.$route
          name === 'agencyAdd' && this.$refs.levelSelect.init(val.id)
        })
      },
      deep: true,
      immediate: true
    }
  },
  // 动态添加路由参数，可编辑
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.push({
        name: "agencyAdd",
        params: { page: "create" }
      });
    });
  },
  methods: {
    resetForm() {
      for (let key in this.formKey) {
        this.formKey[key] = "";
      }
    },
    // 获取用户层级
    onLevelChange(res) {
      this.formKey.levelId = res.levelLabel;
    },
    // 获取上级代理账号
    getSuperior(value) {
      if (value == false) {
        this.rebateShow = false;
      } else {
        this.formKey.superiorUserName = value;
        // this.rebateShow = true;
        let postData = {
          uname: value,
          siteId: this.$root.nowSite.id
        };
        this.getRebateSetting(postData);
      }
    },
    onRebateChange(res) {
      this.formKey.rebate = res;
    },
    onRefundChange(res) {
      this.formKey.platform = res;
    },
    // 获取返水、返点数据
    getRebateSetting(data) {
      agencyRebatePlatform(data).then(res => {
        let { rebate, platform } = res.data;
        // 给rebate添加父级返点属性
        rebate.forEach(item => {
          item.parent_rebate = item.rebate;
        });
        this.rebate = rebate;
        // 给refund添加父级返水属性
        for (let i in platform) {
          platform[i].list.forEach(item => {
            // item.parent_refund = Number(item.value)+0.005;
            item.name_cn = item.name;
            item.name_en = item.key;
            item.refund = item.value;
          });
        }
        this.refund = platform;
        this.rebateShow = true
      });
    },
    submit() {
      this.$refs.formKey.validate(valid => {
        if (valid) {
          if (!this.formKey.rebate) this.formKey.rebate = this.$refs.rebateSelect.createData();
          // if (!this.formKey.rebate && !this.editable) this.formKey.rebate = this.$refs.rebateSelect.createParentData()
          if (!this.formKey.platform) this.formKey.platform = this.$refs.refundSelect.createData();
          let postData = { ...this.formKey, siteId: this.$root.nowSite.id };
          agencyAdd(postData).then(res => {
            let content = this.formKey.agencyType == "agency" ? "新增代理成功" : "新增大股东成功";
            this.$Tip.success({
              content,
              onOk: () => {
                this.goAgencySearch();
              }
            });
          });
        }
      });
    },
    goAgencySearch() {
      this.$router.push({ name: "agencySearch" });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
/deep/.ivu-form-item-error-tip {
  left: 340px;
  top: 5px;
}
.w340 {
  width: 340px !important;
}
</style>


