<template>
  <div class="v2-edit">
    <div class="items bb">
      <div class="title">基础设置</div>
      <div class="section backWater">
        <Form ref="form" :model="formKey" :rules="rules" :label-width="100">
          <FormItem label="等级名称" prop="levelName">
            <Select class="w320x" v-model="formKey.levelName" v-if="$route.params.page != 'edit'" placeholder="请选择等级名称">
              <Option v-for="(t,i) in refundList" :key="i" :value="t.levelName">{{t.levelName}}</Option>
            </Select>
            <Input class="w320x" disabled v-model="formKey.levelName" v-if="$route.params.page == 'edit'"/>
          </FormItem>
          <FormItem  label="等级别称" prop="levelAlias">
            <Input class="w320x" placeholder="请输入返水等级别称" v-model="formKey.levelAlias"/>
          </FormItem>
          <FormItem label="最低下注" prop="lessBetAmount">
            <Input class="w320x" placeholder="最低下注金额" v-model="formKey.lessBetAmount"/>
          </FormItem>
          <FormItem label="最大返水" prop="maxBonusAmonut">
            <Input class="w320x" placeholder="最大返水金额限制" v-model="formKey.maxBonusAmonut"/>
          </FormItem>
          <FormItem>
            <div style="padding-left:100px">
              <Icon
                v-if="formKey.default==='no'"
                type="md-checkmark-circle"
                size="16"
                color="#E4E4E4"
                class="pr5"
                @click="setDefault('yes')"
              />
              <Icon
                v-else
                type="md-checkmark-circle"
                size="16"
                color="#57a3f3"
                class="pr5"
                @click="setDefault('no')"
              />
              <span class="ml5 cs" @click="setDefault('span')">设为默认？</span>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="items mt15 bb">
      <div class="section">
        <RefundSelect ref="RefundSelect" :showParent="false" :data="refund" :exitParent="false" @on-refund-change="onRefundChange"
        ></RefundSelect>
      </div>
    </div>
    <div class="items mt15">
      <div class="flex-row p10">
        <div class="w40 flex-row">
          <Button
            type="primary"
            class="more-btn"
            @click.prevent="submit"
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
import { mapState } from 'vuex';
import {
  systemMemberRefundLevelAdd,
  systemMemberRefundLevelUp,
  systemMemberRefundLevelList,
  systemMemberRefundLevelDetail
} from "@/api/system";
import { refundLevelModifyStatus } from '@/api/member';
import { agencyPlatform } from "@/api/common";
export default {
  name: "sysPreRefundEdit",
  components: { Icons, RefundSelect },
  computed: {
    ...mapState({
      refundList: state => state.info.refundList
    })
  },
  data() {
    return {
      formKey: {
        levelName: "",
        levelAlias: "",
        lessBetAmount: null,
        maxBonusAmonut: "",
        default: "no",
        json: "",
        levelLabel: null,
      },
      rules: {
        levelName: [
          {
            required: true,
            message: "请输入等级名称",
            trigger: "blur"
          }
        ],
        levelAlias: [
          {
            required: true,
            message: "请输入等级别称",
            trigger: "blur"
          }
        ],
        lessBetAmount: [
          {
            required: true,
            message: "请输入最低下注金额",
            trigger: "blur",
            pattern: /.+/
          },
          {
            message: "最低下注金额必须为整数",
            trigger: "blur",
            pattern: /^[+]{0,1}(\d+)$/,
          }
        ],
        maxBonusAmonut: [
          {
            required: true,
            message: "请输入最大返水金额限制",
            trigger: "blur",
            pattern: /.+/
          },
          {
            message: "最大返水金额限制必须为整数",
            trigger: "blur",
            pattern: /^[+]{0,1}(\d+)$/,
          }
        ]
      },
      refund: {}
    };
  },
  mounted() {
    if (!this.$route.query.id) {
      this.getDefaultRefund();
    } else {
      this.getData();
    }
  },
  watch: {
    'formKey.levelName': {
      handler(val,oldVal) {
        val = val.toUpperCase(val)
        this.$nextTick(() => {
           this.formKey.levelLabel = this.refundList.filter(item => item.levelName == val)[0].levelLabel
        })
      },
      deep: true
    }
  },
  methods: {
    //获取空返水数据  预设没有上限值
    getDefaultRefund() {
      let data = { siteId: this.$root.nowSite.id }; 
      agencyPlatform(data).then(res => {
        this.refund = res.data.zore;
      });
    },
    //获取跳转默认的详情数据
    getData() {
      let { id } = this.$route.query;
      systemMemberRefundLevelDetail({id}).then(res => {
        let { levelName, levelAlias, lessBetAmount, maxBonusAmonut, levelLabel } = res.data.basic
        this.formKey = { levelName, levelAlias, lessBetAmount: Number(lessBetAmount), maxBonusAmonut: Number(maxBonusAmonut), default: res.data.basic.default, levelLabel }
        this.refund = res.data.refund
      })
      // let data = { params: { limit }, query: { page: 1 } };
      // systemMemberRefundLevelList(data).then(res => {
      //   let defaultList = res.data.data.filter(item => item.id == id)[0];
      //   let { levelName, levelAlias, lessBetAmount, maxBonusAmonut, list } = defaultList;
      //   this.formKey = { levelName, levelAlias, lessBetAmount, maxBonusAmonut, default: defaultList.default };
      //   this.formKey.lessBetAmount = Number(lessBetAmount);
      //   this.formKey.maxBonusAmonut = Number(maxBonusAmonut);
      //   for(let key in defaultList.list){
      //     defaultList.list[key].list.forEach(t => {
      //       delete t.parent_refund
      //     })
      //   }
      //   this.refund = defaultList.list
      // });
    },
    onRefundChange(res) {
      this.formKey.json = res;
    },
    // create为创建  edit为编辑
    submit() {
      this.$Message.config({
        top: 50,
        duration: 1
      })
      const { page } = this.$route.params;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$root.startEditLoading()
          if (page == "create") {
            if (!this.formKey.json) {
              this.formKey.json = this.$refs.RefundSelect.createData();
            }
            systemMemberRefundLevelAdd(this.formKey, true).then(res => {
              if(res != undefined && res.code == 200) {
                this.$Message.success('添加返水等级成功')
                this.goSysPreList()
              }
            });
          } else {
            if (!this.formKey.json) {
              this.formKey.json = this.$refs.RefundSelect.createData();
            }
            this.formKey.id = this.$route.query.id
            systemMemberRefundLevelUp(this.formKey, true).then(res => {
              if(res != undefined && res.code == 200) {
                this.$Message.success('编辑返水等级成功')
                this.goSysPreList()
              }
            })
          }
        }
      });
    },
    //设为默认
    setDefault(stage) {
      if (stage == "span") {
        this.formKey.default = this.formKey.default == "yes" ? "no" : "yes";
      } else {
        this.formKey.default = stage;
      }
    },
    //添加返回预设的列表
    goSysPreList() {
      this.$router.push({
        name: "sysPreset",
        params: { stage: 'edit' }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
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
  left: 330px;
  top: 5px;
  width: 200px;
}
/deep/.ivu-form-item-content {
  line-height: 0;
  top: 0;
}
</style>
