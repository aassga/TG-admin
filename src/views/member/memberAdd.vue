<template>
  <div>
    <Form ref="formKey" :label-width="105" :model="formKey" :rules="rules" :key="formKey.agencyType" >
      <FormItem :label="formKey.agencyType == 'member' ? '会员类型' : '代理类型'">
        <Select v-model="formKey.agencyType" class="w340x">
          <Option value="member" v-if="$root.modeName() != 'mode_c'">会员</Option>
          <Option value="agency">代理</Option>
          <Option value="shareholder">大股东</Option>
        </Select>
      </FormItem>
      <FormItem label="上级代理" prop="superiorUserName"   v-if="formKey.agencyType != 'shareholder'">
        <AutoSearch
          ref="autoSearch"
          :clearable="false"
          style="width:340px"
          :siteId='$root.nowSite.id'
          v-model="formKey.superiorUserName"
          :placeholder="'上级代理账号，默认查询'"
          @sendSuperior="getSuperior(arguments, true)"
          @changeShow="changeShow"
        ></AutoSearch>
      </FormItem>
      <FormItem
        :label="formKey.agencyType == 'member' ? '会员账号' : formKey.agencyType == 'agency' ? '代理账号' : '大股东账号'"
        prop="userName"
      >
        <Input v-model="formKey.userName"  :maxlength="10" placeholder="6-10位数字或字母" class="w340x"/>
      </FormItem>
      <FormItem label='推广来源'>
        <Input v-model="formKey.realName" class="w340x" :maxlength="11" placeholder="请输入推广来源"/>
        <span class="ivu-form-item-error-tip" v-show="formKey.realName && formKey.realName.length > 10">输入内容过多</span>
      </FormItem>
      <FormItem label="默认密码">
        <Input v-model="formKey.passwd" class="w340x" disabled/>
      </FormItem>
      <FormItem label="返佣状态" v-if="formKey.agencyType!='member'">
        <Select v-model="formKey.status" class="w340x">
          <Option value="yes">开启</Option>
          <Option value="no">关闭</Option>
        </Select>
      </FormItem>
      <div v-show="rebateShow && ($root.modeName() == 'mode_a' || $root.modeName() == 'no')">
        <rebate-select ref="rebateSelect" :editable='editable' :data="rebate" :isShareholder='isShareholder' @on-rebate-change="onRebateChange"></rebate-select>
        <refund-select ref="refundSelect" :editable='editable' :data="refund" :isShareholder='isShareholder' @on-refund-change="onRefundChange"></refund-select>
      </div>
      <FormItem>
        <Button class="ivu-btn bg mt15 w340 ft20 h50" @click.prevent="submit" :loading="$root.editBtnLoading" >确认新增</Button>
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
  components: { Icons, LevelSelect, RefundSelect, RebateSelect, AutoSearch },
  data() {
    const validatePassTwo = (rule, value, callback) => {
      if (
        this.$refs.autoSearch.value === "" ||
        this.$refs.autoSearch.value === undefined
      ) {
        callback(new Error("请输入或选择上级代理账号"));
      } else {
        callback();
      }
    };
    return {
      stageValue: "", //用来提交做校验使用，防止用户选择后又加新数据
      showFlag: true, //true为代理显示,false为大股东显示
      rebateShow: false, //返点，返水显示
      levelAlias: "",
      isShareholder: false,
      rebate: [],
      refund: {},
      formKey: {
        status: "no",
        agencyType: '',
        passwd: "",
        levelId: "",
        superiorUserName: ""
      },
      rules: {
        superiorUserName: {
          required: true,
          validator: validatePassTwo,
          trigger: "blur"
        },
        userName: [
          {
            required: true,
            message: "请输入正确的账号",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9_]{6,10}$/,
            message: "6-10位数字或字母",
            trigger: "blur"
          }
        ]
      },
      editable: true
    };
  },
  watch: {
    "formKey.agencyType": {
      handler(newVal, oldVal) {
        this.resetForm();
        //清空选择等级以及校验值，清空会员账号值，算了难得封装了
        // this.$refs.levelSelect.reset("single");
           let chars = 'ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789';//这里没有加其他字符，需要可自行添加
            let tempLen = chars.length;
            let tempStr='';
            for(let i=0; i<8; ++i){
                tempStr += chars.charAt(Math.floor(Math.random() * tempLen ));
            }
            this.formKey.passwd=tempStr;
        this.formKey.levelLabel = "";
        if (newVal == "agency" || newVal == "member") {
          this.showFlag = true;
          this.formKey = {
            agencyType: newVal,
            passwd: this.formKey.passwd,
            status: "no"
          };
          if(!this.$root.checkCommission()) this.editable = false //随模式变化 b不可编辑
          else this.editable = true
          this.rebateShow = false;
          if (this.formKey.superiorUserName) {
            this.rebateShow = true;
          }
          this.isShareholder = false
        } else if (newVal === "shareholder") {
          this.showFlag = false;
          this.formKey = {
            agencyType: newVal,
            passwd:this.formKey.passwd,
            status: "no",
            levelId: "1",
            levelLabel: "1"
          };
          this.isShareholder = true
          this.editable = true // 可编辑
          //默认大股东选择VIP1
          // this.$nextTick(() => {
          // this.$refs.levelSelect.setDefaultLevel("1", "vip1");
          // });
          let postData = {
            uname: "",
            siteId: this.$root.nowSite.id
          };
          this.getRebateSetting(postData);
        }
      }
    }
  },
  mounted() {
    this.$Message.config({
      top: 50,
      duration: 1
    })
    this.editable = this.$root.checkCommission()
    this.formKey.agencyType = this.$root.modeName() == 'mode_c' ? 'agency' : 'member'; //首先手动触发一次，避免第一次取不上默认值
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.push({
        name: "memberAdd",
        params: { page: "create" }
      })
    });
  },
  methods: {
    changeShow(flag) {
      this.rebateShow = flag;
    },
    resetForm() {
      for (let key in this.formKey) {
        this.formKey[key] = "";
      }
    },
    // 获取用户层级
    // onLevelChange(res) {
    //   this.formKey.levelId = res.levelLabel;
    //   this.formKey.levelLabel = res.levelLabel;
    // this.$nextTick(() => {
    //   this.$refs.levelSelect.setDefaultLevel(
    //     String(res.levelLabel),
    //     res.levelName
    //   );
    // });
    // },
    // 获取上级代理账号
    getSuperior(value, flag) {
      value = value[0];
      let reg = /^(([0-9]\d*))$/
      if (value == false && !reg.test(value)) {
        this.rebateShow = false;
      } else {
        this.formKey.superiorUserName = value;
        this.stageValue = value;
        let postData = {
          uname: value,
          siteId: this.$root.nowSite.id
        };
        this.getRebateSetting(postData);
        let data = {
          siteId: this.$root.nowSite.id,
          typeTag: "userName",
          content: value
        };
        // if (flag) this.getDefaultId({ params: data });
      }
    },
    // //获取默认的id
    // async getDefaultId(data) {
    //   let params = { siteId: data.params.siteId, purpose: 'list'}
    //   await getMemberLevelData(params).then(res => {
    //     this.formKey.levelId = res.data.filter(item => item.default == 'yes')[0].levelLabel
    //   })
    // },
    gteOtherName(val) {
      this.formKey.superiorUserName = val;
      let postData = {
        uname: val,
        siteId: this.$root.nowSite.id
      };
      this.getRebateSetting(postData);
    },
    onRebateChange(res) {
      this.formKey.rebate = res;
    },
    onRefundChange(res) {
      this.formKey.refund = res;
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
            item.parent_refund = +item.value
            item.name_cn = item.name;
            item.name_en = item.key;
            item.refund = item.value;
          });
        }
        this.refund = platform;
        this.rebateShow = true;
      });
    },
    submit() {
      //过滤大股东，当用户不触发onselect事件，在提交处触发
      if (this.formKey.agencyType !== "shareholder") {
        // if (!this.formKey.rebate) {
        this.getSuperior([this.$refs.autoSearch.value], false);
        // }
        if (!this.formKey.superiorUserName) {
          this.$Message.error('请输入上级代理账号');
          return false;
        }
        let reg = /^[0-9a-zA-Z-_]{6,10}/
        if (!reg.test(this.formKey.superiorUserName)) {
          this.$Tip.info({ content: '上级代理账号格式错误，请重新输入'})
          return false
        }
      }
      this.$refs.formKey.validate(valid => {
        // if (!this.formKey.levelLabel) {
        //   this.$Tip.info({ content: "请选择会员等级" });
        //   return false;
        // }
        if (valid) {
          this.$root.startEditLoading()
          if (!this.formKey.platform) {
            this.formKey.platform = this.$refs.refundSelect.createData();
          }
          if (!this.formKey.rebate) {
            this.formKey.rebate = this.$refs.rebateSelect.createData();
          }
          // if (!this.formKey.rebate && !this.editable) this.formKey.rebate = this.$refs.rebateSelect.createParentData()
          let { agencyType } = this.formKey;
          let postData = { ...this.formKey, siteId: this.$root.nowSite.id };
          if (postData.refund) delete postData.refund;
          postData.levelId = 1;
          if (Object.keys(postData).includes('realName')) postData.realName = this.$root.trimAll(postData.realName)
          if (!postData.realName) delete postData.realName
          agencyAdd(postData, true).then(res => {
            if (res != undefined && res.code == 200) {
              let content = agencyType == "member" ? "新增会员成功" : agencyType == "agency" ? "新增代理成功" : "新增大股东成功";
              // this.$Tip.success({
              //   content,
              //   onOk: () => {
                  if (agencyType !== "shareholder") {
                    this.$refs.autoSearch.value = ""; //清空上级代理搜索值
                  }
                  // this.$refs.levelSelect.reset("single"); // 清空等级选项
                  this.formKey.superiorUserName = ""; //清空会员名称
                  this.$root.endEditLoading()
                  this.resetForm();
                  this.memberSearch();
                // }
              // });
              this.$Message.success(content);
            }
          });
        }
      });
    },
    memberSearch() {
      this.$router.push({ name: "memberSearch" });
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
.center {
  text-align: center;
}
.w340 {
  width: 340px !important;
}
.w340x {
  /deep/textarea.ivu-input {
    max-height: 200px;
  }
}
/deep/.ivu-select-dropdown-list{
  .ivu-select-item{
    color: #444;
  }
}
/deep/.ivu-select{
  color: #444;
}
</style>
