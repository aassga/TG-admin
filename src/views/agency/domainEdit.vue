<template>
  <div>
    <Form ref="formKey" :model="formKey" :rules="rules" :label-width="100">
      <FormItem label="代理账号">
        <Input v-model="formKey.userName" disabled class="w260x"/>
      </FormItem>
      <FormItem label="代理类型">
        <Input v-model="formKey.agent_type" disabled class="w260x"/>
      </FormItem>
      <FormItem label="代理网址" prop="domain">
        <Input v-model="formKey.domain" type="textarea" class="w260x" :rows="4"/>
      </FormItem>
      <div>
        <div style="marginTop:80px;">
          <rebate-select :data="rebate" @on-rebate-change="onRebateChange" ref="rebateSelect"></rebate-select>
          <refund-select :data="refund" @on-refund-change="onRefundChange" ref="refundSelect"></refund-select>
        </div>
      </div>
      <FormItem>
        <Button class="mt15 ivu-btn save" @click="submit" :loading="$root.editBtnLoading">确认保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import {
  agencyRebatePlatform,
  agencyDomainList,
  agencyDomainUpdate,
  agencyDomainDetails
} from "@/api/agency";
import RefundSelect from "@/components/refund-select";
import RebateSelect from "@/components/rebate-select";
export default {
  name: "domainEdit",
  components: {
    Icons,
    RefundSelect,
    RebateSelect
  },
  data() {
    return {
      rebate: [],
      refund: {},
      formKey: {},
      rules: {
        domain: [
          {
            required: true,
            message: "请输入网址",
            trigger: "blur"
          }
        ]
      }
      // editable: this.$root.checkCommission()
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let data = {
        siteId: vm.$root.nowSite.id,
        id: vm.$route.query.id
      };
      vm.getData(data);
    });
  },
  methods: {
    submit() {
      this.$refs.formKey.validate(valid => {
        if (valid) {
          delete this.formKey.agent_type;
          delete this.formKey.userName;
          if (!this.formKey.rebate) this.formKey.rebate = this.$refs.rebateSelect.createData()
          // if (!this.formKey.rebate && !this.editable) this.formKey.rebate = this.$refs.rebateSelect.createParentData()
          if (!this.formKey.platform) {
            this.formKey.platform = this.$refs.refundSelect.createData();
          }
          let { id, is_agency, status, admin_status, domain, rebate, platform } = this.formKey
          let data = {
            siteId: this.$root.nowSite.id,
            id, is_agency, status, admin_status, domain, rebate, platform
          }
          agencyDomainUpdate(data).then(res => {
            if ( res != undefined && res.code == 200) this.goDomainList();
          });
        }
      });
    },
    onRebateChange(res) {
      this.formKey.rebate = res;
    },
    onRefundChange(res) {
      this.formKey.platform = res;
    },
    //格式化数据
    getRebateData(rebate, platform) {
      this.rebate = rebate;
      // 给refund添加父级返水属性
      for (let i in platform) {
        platform[i].list.forEach(item => {
          item.name_cn = item.name;
          item.name_en = item.key;
        });
      }
      this.refund = platform;
    },
    // 修改后跳回域名列表
    goDomainList() {
      this.$router.push({
        name: "agencyDomain"
      });
    },
    getData(data) {
      agencyDomainDetails(data).then(res => {
        let { userName, domain, rebate, platform, agent_type, id, is_agency, status, admin_status } = res.data;
        let level = agent_type - 1;
        this.formKey = { userName, domain, agent_type, id, is_agency, status, admin_status };
        this.formKey.agent_type = level > 0 ? `${level}级代理` : "大股东"
        this.getRebateData(rebate, platform);
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.w260x {
  width: 260px;
  height: 36px;
}
/deep/.ivu-form-item-error-tip {
  left: 260px;
}
</style>


