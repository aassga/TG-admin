<template>
  <div class>
    <Form ref="paymentInfo" :model="paymentInfo" :rules="rules">
      <FormItem label="支付平台" prop="queryName">
        <Select
          class="w360 fontColor"
          v-model="paymentInfo.queryName"
          placeholder="请选择,可查询"
          filterable
          @on-change="changquery"
          clearable
        >
          <Option
            class="fontColor"
            v-for="(item, index) in platformList"
            :key="index"
            :value="item.queryName"
            >{{ item.payName }}</Option
          >
        </Select>
      </FormItem>

      <FormItem label="商户编号" prop="businessNo">
        <Input
          class="w360"
          v-model="paymentInfo.businessNo"
          placeholder="请输入商户编号"
        />
      </FormItem>
      <template v-if="paymentInfo.queryName">
        <FormItem
		
          :label="item.label"
          v-for="(item, key, index) in paymentInfo.paylist"
          :key="index"
        >
		  <Input type="textarea"    :autosize="{ minRows: 2, maxRows: 6 }" class="w360" v-model="item[Object.keys(item)[2]]" />
        </FormItem>
      </template>
      <FormItem label="支付方式" prop="payMethod">
        <paymentRadio
          v-model="paymentInfo.classId"
          class="w360"
          @sendArray="getChecked"
          ref="payment"
          :methodsdetail="paymentAdd"
        ></paymentRadio>
      </FormItem>
      <FormItem label="支付域名" prop="redirect_domain">
        <Input
          class="w360"
          placeholder="例：pay.123456.com"
          v-model="paymentInfo.redirect_domain"
        />
      </FormItem>
      <FormItem label="支付状态" prop="status">
        <Select
          class="w360 fontColor"
          v-model="paymentInfo.status"
          placeholder="请选择"
        >
          <Option value="yes" class="fontColor">正常</Option>
          <Option value="no" class="fontColor">停用</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          class="w360x ivu-btn commonSubmit"
          style="margin-left: 90px; width: 360px"
          :loading="$root.editBtnLoading"
          @click.prevent="submit"
          >确认添加</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import paymentRadio from "./components/payment-radio-group";
import { getpaymentName,createpayment,paymentAdd,depositOnlineLimit} from "@/api/finance";
import { mapState } from "vuex";
import { getUserName } from "@/libs/util";
import { setTimeout } from "timers";
export default {
  name: "addPayment",
  components: {
    paymentRadio,
  },
  data() {
    return {
      regMoney:'',
	  VIPPay:'',
      showID: false,
      paymentAdd: [],
      paylist: "",
      platformList: [],
      newplatData: "",
      paymentInfo: {
        siteId: this.$root.nowSite.id,
        siteName:this.$root.nowSite.siteName,
        classId: "",
        payName: "",
        status: "yes",
        businessNo: "",
        redirect_domain: "",
        // remarks: "",
        queryName: "",
        businessKey: {},
        payMethod: "",
        bankCode: "",
      },
      rules: {
        queryName: [
          {
            required: true,
            message: "请选择支付平台",
            trigger: "blur",
          },
        ],
        businessNo: [
          {
            required: true,
            message: "请输入商户编号",
            trigger: "blur",
          },
          // {
          // 	required: true,
          // 	message: "请输入正确平台编号",
          // 	trigger: "blur",
          // 	pattern: /^([0-9a-zA-Z-]+$)/
          // }
        ],
        gongyao: [
          {
            required: true,
            message: "请输入支付公钥",
            trigger: "blur",
          },
        ],
        payMethod: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
          },
        ],
        redirect_domain: [
          {
            required: true,
            message: "请输入域名",
            trigger: "blur",
            // pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
          },
        ],
        status: [
          {
            required: true,
            message: "请选择支付状态",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getselectlist();
    setTimeout(() => {
      this.$refs.payment.getpayselectlist();
    });
    let data={siteId:this.$root.nowSite.id}
        depositOnlineLimit(data).then(res=>{
            if(res!=undefined&&res.code==200){
                  this.regMoney=res.data;
                  // console.log(this.regMoney)
            }
        })
  },
  
  computed: {
    username() {
      return getUserName();
    },
    ...mapState({
      token: (state) => state.user.token,
    }),
  },
  watch: {
    "$root.nowSite": {
      handler(val) {
        this.uploadForm.data.siteId = val.id;
      },
      deep: true,
    },
  },
  methods: {
    submit() {
      
      this.$root.startEditLoading();
      let params = { ...this.paymentInfo, ...this.newplatData };
      let classIds = [];
      //
      
      if (params.newarray == undefined || params.newarray.length == 0) {
        this.$Tip.info({ content: "请选择支付方式" });
        this.$root.endEditLoading();
        return false;
      }
      if (params.newarray && params.newarray.length > 0) {
        params.newarray.map((item) => {
          classIds.push(item.id);
        });
      }

      if (classIds.length > 1) params.classId = classIds.join(",");
      else params.classId = classIds[0];
      delete params.newarray;

      let newArray = [];
      for (let key in params.formatAmount) {
        newArray = params.formatAmount[key];

        if (
          newArray.formatAmount !== null &&
          newArray.formatAmount !== undefined &&
          newArray.formatAmount.trim() === ""
        ) {
          this.$Tip.info({ content: "请输入固定金额" });
          return;
        }
        //当输入为字母的时候提示EW
        if (newArray.formatAmount) {
          var Regx = /^(((([1-9]\d*|(\.\d{1,2}))((,)(?!0))?){1,}\d)|[1-9])$/;
          if (Regx.test(newArray.formatAmount)) {
          } else {
            this.$Tip.info({ content: "请输入固定金额" });
            newArray.formatAmount = " ";
            return false;
          }
        }
      }
      params.formatAmount = JSON.stringify(params.formatAmount);
      params.limitAmount = JSON.stringify(params.limitAmount);
      let mess = false;
      let limitmess = false;

      if (params.formatAmount == "{}" || params.formatAmount == null) {
        delete params.formatAmount;
      } else {
        let format;
        if (params.formatAmount == undefined) return;

        format = Object.values(JSON.parse(params.formatAmount));
        format.forEach((item) => {
          
     
          if (
            item.formatAmount == null 
          ) {
            this.$Tip.info({ content: "请输入固定金额" });
            mess = true;
            return false;
          }
          if (item.quick_amount == null) {
            this.$Tip.info({ content: "请输入常用金额" });
            limitmess = true;
            return false;
          }
          if(item.name=='微信支付'||item.name=='支付宝支付'){

            if(item.formatAmount&&item.formatAmount.split(',')[item.formatAmount.split(',').length-1]>this.regMoney){
                this.$Tip.info({ content: "固定金额必须小于"+this.regMoney });
                 return false
            }
                 if(item.quick_amount&&item.quick_amount.split(',')[item.quick_amount.split(',').length-1]>this.regMoney){
                this.$Tip.info({ content: "常用金额必须小于"+this.regMoney });
                 return false
            }
          }
        
          if (
            item.handle_fee &&
            (
              item.handle_fee == 0 ||
              item.handle_fee.substr(-1) === '.' ||
              item.handle_fee.split('.').length > 2 ||
              item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].length > 4 ||
              item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].substr(-1) === '0' ||
              parseFloat(item.handle_fee) > 30
            )
          ) {
            this.$Tip.info({ content: "请输入正确的手续费比例(小数点最多四位)" });
            limitmess = true;
            return false
          }
         
        });

        // handele_fee 為空時刪除
        params.formatAmount = this.listKeyDelete(params.formatAmount, 'handle_fee')
      }
      
      if (params.limitAmount == "{}") {
        delete params.limitAmount;
      } else {
        let limitdata;
        limitdata = Object.values(JSON.parse(params.limitAmount));
        limitdata.forEach((item) => {
          if ((item.maxAmount == null || item.minAmount == null)&&item.name!='VIP充值') {
            this.$Tip.info({ content: "请输入单笔金额" });
            limitmess = true;
            return false;
          }
          if ((
            Number(item.maxAmount) <= Number(item.minAmount) ||
            Number(item.maxAmount) < 0 ||
            Number(item.minAmount) < 0
          )&&item.name!='VIP充值') {
            this.$Tip.info({
              content: "单笔上限必须大于单笔下限,而且不能为负数",
            });
            limitmess = true;
            return false;
          }
          if (item.quick_amount == null&&item.name!='VIP充值') {
            this.$Tip.info({ content: "请输入常用金额" });
            limitmess = true;
            return false;
          }
          if(item.maxAmount>this.regMoney&&(item.name=='微信支付'||item.name=='支付宝支付')){
               this.$Tip.info({ content: "单日上限必须小于"+this.regMoney });
                limitmess = true;
               return false
          }
          item.quick_amount &&
            item.quick_amount.split(",").map((t, index) => {
              if (+item.minAmount <= +t && +t <= +item.maxAmount) {
                if (t.split(",").length == index + 1) {
                }
              } else {
                this.$Tip.info({
                  content: "常用金额需要在单笔下限，单笔上限之间",
                });
                limitmess = true;
                return false;
              }
            });
           
             if(!item.handle_fee){
                this.$Tip.info({ content: "请输入手续费比例" });
            limitmess = true;
            return false;
               
             }
          if (
              item.name!='VIP充值' &&
              (
                item.handle_fee &&
                (
                  item.handle_fee == 0 ||
                  item.handle_fee.substr(-1) === '.' ||
                  item.handle_fee.split('.').length > 2 ||
                  item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].length > 4 ||
                  item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].substr(-1) === '0' ||
                  parseFloat(item.handle_fee) > 30
                )
              )
            ) {
              this.$Tip.info({ content: "请输入正确的手续费比例(小数点最多四位)" });
              limitmess = true;
              return false
            }
        });

        // handele_fee 為空時刪除
        params.limitAmount = this.listKeyDelete(params.limitAmount, 'handle_fee')
      }
      if (mess || limitmess) {
        return false;
      }
      if (params.paylist && params.paylist.length > 0) {
        params.paylist.map((item, key, index) => {
          let newkey = Object.keys(item)[2];
          let newval = item[Object.keys(item)[2]]?item[Object.keys(item)[2]]:null;
		   params.businessKey[newkey] = newval;
        });
      }

	   if(Object.values(params.businessKey)[0]==null&&params.payName=='VIP支付'){
		    	this.$Tip.info({ content: "请输入md5密钥" });
				return false;
	   }

      params.businessKey = JSON.stringify(params.businessKey);
      delete params.paylist;
      this.$refs.paymentInfo.validate((valid) => {
        if (valid) {
          delete params.payMethod;
          createpayment(params, true).then((res) => {
            if (res != undefined && res.code == 200) {
              this.$Message.success({ content: "添加支付平台成功" });
              this.$router.push({
                path: "paymentManager",
                query: {
                  status: params.status,
                  siteId: params.siteId,
                },
              });
            }
          });
        }
      });
    },
    getChecked(data) {
      // console.log(data)
      this.newplatData = data;
      this.paymentInfo.payMethod = "6666";
      this.showID = this.newplatData.newarray.some(
        (item) => item.className == "网银在线"
      );
    },
    getselectlist() {
      getpaymentName({
        siteId: this.$root.nowSite.id,
        purpose: "payment_channel",
      }).then((res) => {
        this.platformList = res.data;
      });
    },
    changquery() {
		this.VIPPay=arguments[0];
      if (arguments[0] !== undefined) {
        this.paylist = "";
        this.paylist = this.platformList.filter(
          (item) => item.queryName == this.paymentInfo.queryName
        )[0].needUseKeyType;
		
        this.paymentInfo.payName = this.platformList.filter(
          (item) => item.queryName == this.paymentInfo.queryName
        )[0].payName;

        this.paymentInfo.bankCode = this.platformList.filter(
          (item) => item.queryName == this.paymentInfo.queryName
        )[0].bankCode;

        this.paylist.map((item) => {
          if (item.input_name) {
            let key = item.input_name;
            let value = "";
            item[key] = value;
          }
        });
        this.paymentInfo.paylist = this.paylist;
      }
    },
    // formatAmount & limitAmount parameter 刪除
    listKeyDelete(listJSONString, key) {
      const list = JSON.parse(listJSONString);

      for (let id in list) {
        const payment = list[id]
        if (payment[key] === '') {
          delete payment[key]
        }
      }

      return JSON.stringify(list)
    }
  },

};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
// 为保证前一列文字对齐
/deep/.ivu-form-item-label {
  width: 90px;
}

.yiyou {
  width: 57px;
  height: 14px;
  font-size: 0.875rem /* 14/16 */;
  font-weight: 400;
  color: #c7c7c7;
  padding-left: 20px;
}
.gongyao {
  width: 80px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #62b1fd;
  border-radius: 5px;
  font-size: 0.875rem /* 14/16 */;
  font-weight: 400;
  color: #62b1fd;
  text-align: center;
}
/deep/.ivu-form-item-error-tip {
  font-size: 0.875rem;
  left: 89px !important;
  top: 36px;
}
.w360 {
  width: 360px;
}
</style>


