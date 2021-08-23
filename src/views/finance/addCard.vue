<template>
  <div class="cardLeft">
    <Form
      ref="newCardInfo"
      :model="newCardInfo"
      :rules="newCardInfoRuleValidate"
      :label-width="100"
    >
      <FormItem label="创建人">
        <Input v-model="newCardInfo.creater" class="w280x"/>
      </FormItem>
      <FormItem label="入款卡">
        <Select v-model="newCardInfo.inCard" class="w280x">
          <Option value="card">银行卡</Option>
          <Option value="code">二维码</Option>
        </Select>
      </FormItem>
      <FormItem label="银行名称" prop="bankName" v-show="newCardInfo.inCard == 'card'">
        <Select v-model="newCardInfo.bankName" class="w280x">
          <Option v-for="(t,i) in bankList" :key="i" :value="t.value">{{t.title}}</Option>
        </Select>
      </FormItem>
      <FormItem label="扫码类型" prop="codeType" v-show="newCardInfo.inCard == 'code'">
        <Select v-model="newCardInfo.codeType" class="w280x" clearable>
          <Option value="apily">支付宝扫码</Option>
          <Option value="wechat">微信扫码</Option>
          <Option value="qq">财付通扫码</Option>
        </Select>
      </FormItem>
      <FormItem label="银行卡号" prop="bankCard" v-show="newCardInfo.inCard == 'card'">
        <Input v-model="newCardInfo.bankCard" placeholder="请输入银行卡号" class="w280x"/>
      </FormItem>
      <FormItem label="持卡姓名" prop="holder" v-show="newCardInfo.inCard == 'card'">
        <Input v-model="newCardInfo.holder" placeholder="请输入持卡姓名" class="w280x"/>
      </FormItem>
      <FormItem label="收款姓名" prop="recevier" v-show="newCardInfo.inCard == 'code'">
        <Input v-model="newCardInfo.recevier" placeholder="请输入收款姓名" class="w280x"/>
      </FormItem>
      <FormItem label="支付金额" prop="amount" v-show="newCardInfo.inCard == 'code'">
        <Input placeholder="单笔下限" v-model="newCardInfo.amount.limit" class="w120x"/>
        <span class="pl10 pr10">-</span>
        <Input placeholder="单笔上限" v-model="newCardInfo.amount.up" class="w120x"/>
      </FormItem>
      <FormItem label="银行归属地" prop="bankAdress" v-show="newCardInfo.inCard == 'card'">
        <Input v-model="newCardInfo.bankAdress" placeholder="例：四川省成都市" class="w280x"/>
      </FormItem>
      <FormItem label="开放等级" prop="openLevel">
        <Select v-model="newCardInfo.openLevel" class="w280x" multiple>
          <Option v-for="(t,i) in openLevel" :key="i" :value="t.value">{{t.title}}</Option>
        </Select>
      </FormItem>
      <FormItem label="开放终端" class="clearfix">
        <div class="fl">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
          >全选</Checkbox>
        </div>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" class="fl">
          <Checkbox label="PC"></Checkbox>
          <Checkbox label="H5"></Checkbox>
          <Checkbox label="Android"></Checkbox>
          <Checkbox label="IOS"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="二维码" prop="img" v-show="newCardInfo.inCard == 'code'">
        <Upload action="//jsonplaceholder.typicode.com/posts/">
          <Button class="blue-font">上传图片</Button>
          <p class="ft13 gray-font">图片大小不能超过2MB，仅支持JPG,PNG格式</p>
        </Upload>
      </FormItem>
      <FormItem label="当前状态" v-show="newCardInfo.inCard == 'card'">
        <Select v-model="newCardInfo.status" class="w280x">
          <Option value="yes">正常</Option>
          <Option value="no">停用</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button class="search bg w280x" @click="add">确认添加</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  name: "addCard",
  data() {
    return {
      indeterminate: true,
      checkAll: false,
      checkAllGroup: [],
      newCardInfo: {
        inCard: "card",
        amount: {}
      },
      openLevel: [
        { value: "level0", title: "未分层" },
        { value: "level1", title: "第一层" },
        { value: "level2", title: "第二层" },
        { value: "level3", title: "第三层" }
      ],
      newCardInfoRuleValidate: {
        bankName: [
          {
            required: true,
            message: "请输入银行名称",
            trigger: "blur"
          }
        ],
        bankCard: [
          {
            required: true,
            message: "请输入银行卡号",
            trigger: "blur"
          }
        ],
        holder: [
          {
            required: true,
            message: "请输入持卡姓名",
            trigger: "blur"
          }
        ],
        bankAdress: [
          {
            required: true,
            message: "请输入银行归属地",
            trigger: "blur"
          }
        ],
        openLevel: [
          {
            required: true,
            message: "请选择开放等级", 
            trigger: "change"
          }
        ],
        codeType: [
          {
            required: true,
            message: "请选择扫码类型",
            trigger: "change"
          }
        ],
        recevier: [
          {
            required: true,
            message: "请输入收款姓名",
            trigger: "blur"
          }
        ],
        amount: [
          {
            required: true,
            message: "请输入支付限额",
            trigger: "blur"
          }
        ],
        img: [
          {
            required: true,
            message: "请上传二维码图片",
            trigger: "blur"
          }
        ]
      },
      bankList: [
        { value: "baoshang", title: "包商银行" },
        { value: "beijing", title: "北京银行" },
        { value: "gongshang", title: "工商银行" }
      ]
    };
  },
  methods: {
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = ["PC", "H5", "Android", "IOS"];
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length === 4) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    add() {
      this.$Tip.success({
        content: "添加入款卡成功",
        onOk: () => {
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.w280x {
  width: 280px;
}
/deep/
  .ivu-form-item-error-tip {
    left: 290px!important;
}
.cardLeft{
  margin-top: 10px;
}
</style>


