<template>
  <Form ref="platform" :label-width="90" :model="platform" :rules="rules">
    <FormItem label="支付平台">
      <Button class="pingtai">{{platform.payName}}</Button>
    </FormItem>
    <FormItem label="商户编号" prop="businessNo">
      <Input v-model="platform.businessNo" class="w360"/>
    </FormItem>
    <FormItem
      :label="item.secret_label"
       v-for="(item,key,index) in platform.businessKey"
      :key="index"
    >
      <textarea style="height:34px;border-radius:5px;border-color:#dcdcdc;max-height:100px"  class="w360" v-model="item.secret_val" ></textarea>
    </FormItem>
<!--prop="paymentClass"  -->
    <FormItem label="支付方式"  >
      <paymentRadio
        class="w360"
        :methodsdetail="platform.paymentClass"
        v-model="platform.paymentClass"
        :defaultChecked="methodsid"
        ref="payment"
        @sendArray="getChecked"
      ></paymentRadio>
    </FormItem>
    <FormItem label="支付域名" prop="redirect_domain">
      <Input v-model="platform.redirect_domain" class="w360"/>
    </FormItem>
    <FormItem label="支付状态" class="fontColor" prop="status">
      <Select v-model="platform.status" class="w360">
        <Option value="yes" class="fontColor" >正常</Option>
        <Option value="no" class="fontColor">停用</Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button class="ivu-btn h50 w360x blueBg ft20 white-font" @click.prevent="submit"  :loading="$root.editBtnLoading">确认保存</Button>
    </FormItem>
  </Form>
</template>
<script>
import paymentRadio from "./components/payment-radio-group";
import { getpaymentDetail, updatepayment,getpaymentName,depositOnlineLimit} from "@/api/finance";
import { mapState } from "vuex";
import { getUserName } from "@/libs/util";
export default {
  name: "editPayment",
  components: {
    paymentRadio
  },
  data() {
    return {
      regMoney:'',
      showID: false,
      bankCode:"",
      platform: {
        paymentClass:[]
      },
      methodsid: [],
      platformList:[],
      rules: {
        // queryName: [
        //   {
        //     required: true,
        //     message: "请选择支付平台",
        //     trigger: "blur"
        //   }
        // ],
        businessNo: [
          {
            required: true,
            message: "请输入平台编号",
            trigger: "blur"
          },
          // {
          //   required: true,
          //   message: "请输入正确平台编号",
          //   trigger: "blur",
          //   pattern: /^([0-9a-zA-Z-]+$)/
          // },
        ],
        gongyao: [
          {
            required: true,
            message: "请输入支付公钥",
            trigger: "blur"
          }
        ],
        paymentClass: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
            pattern: /.+/
          }
        ],
        bankID: [
          {
            required: true,
            message: "请输入银行编码",
            trigger: "blur"
          }
        ],
        redirect_domain: [
          {
            required: true,
            message: "请输入域名",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择支付状态",
            trigger: "blur"
          }
        ],

        // remarks: [
        //    {
        //     required: true,
        //     message: "请输入备注信息",
        //     trigger: "blur"
        //   }
        // ]
      }
    };
  },
  mounted() {
     
        depositOnlineLimit({siteId:this.$root.nowSite.id}).then(res=>{
            if(res!=undefined&&res.code==200){
                  this.regMoney=res.data;
                  
            }
        })
    const { id } = this.$route.query;
    const data = { id, siteId: this.$root.nowSite.id };
    this.paymentdetail(data);
    this.$Message.config({
      top: 50,
      duration: 1
    })
    // this.getselectlist();
  },
  methods: {
    submit() {
      this.$root.startEditLoading();
      let params = { ...this.platform, ...this.newplatdata };
      let newArray=[];
      for (let  key  in params.formatAmount){
        newArray=params.formatAmount[key]


        //没有选择支付方式的提示
        if(JSON.stringify(params.formatAmount)=="{}" && JSON.stringify(params.limitAmount)=="{}"){
            this.$Tip.info({ content: "请选择支付方式" });
            this.$root.endEditLoading()
            return false
        }


        //没有选择固定金额的提示或者输入空格的提示
        if(newArray.formatAmount !== null && newArray.formatAmount !== undefined && newArray.formatAmount.trim() === "" ){
          this.$Tip.info({content:"请输入固定金额"})
            this.$root.endEditLoading()
          return false
        }

      //当固定金额为字母的时候的提示
        if(newArray.formatAmount){
          var Regx = /^(((([1-9]\d*|(\.\d{1,2}))((,)(?!0))?){1,}\d)|[1-9])$/;
          if (Regx.test(newArray.formatAmount)) {
          } else {
            this.$Tip.info({ content: '请输入正确的固定金额' })
            this.$root.endEditLoading()
            newArray.formatAmount = " ";
            return false
          }
        }
      }
      params.siteId = this.$root.nowSite.id;
      //删除后台出入字段
      // params.siteName = this.$root.nowSite.siteName;
      let classIds = [];
      //校验添加支付方式为空
     if(params.newarray==undefined || params.newarray.length==0 ){
        this.$Tip.info({content:"请选择支付方式"})
      }

      if (params.newarray && params.newarray.length > 0) {
        params.newarray.map(item => {
          classIds.push(item.id);
        });
      }

      if (classIds.length > 1) params.classId = classIds.join(",");
      else params.classId = classIds[0];
      delete params.newarray;
      params.formatAmount = JSON.stringify(params.formatAmount);
      params.limitAmount = JSON.stringify(params.limitAmount);
      let mess=false;
      let limitmess=false;
      if (params.formatAmount == "{}") {
        delete params.formatAmount;
      }else{
         let format;
         format=Object.values(JSON.parse(params.formatAmount))
         format.forEach(item=>{
            if(item.formatAmount==null){
              this.$Tip.info({ content: "请输入固定金额" });
              mess=true
              return false
            }

            if(item.quick_amount==null||item.quick_amount==''){
              this.$Tip.info({ content: "请输入常用金额" });
              limitmess = true;
							return false;
            }
                         if(!item.handle_fee){
                this.$Tip.info({ content: "请输入手续费比例" });
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
         })

        // handele_fee 為空時刪除
        params.formatAmount = this.listKeyDelete(params.formatAmount, 'handle_fee')
      }
      if (params.limitAmount == "{}") {
        delete params.limitAmount;
      }else{
   
         let limitdata;
         limitdata=Object.values(JSON.parse(params.limitAmount))
         limitdata.forEach(item=>{
           
            if((item.maxAmount==null||item.minAmount==null)&&item.name!='VIP充值'){
                  this.$Tip.info({ content: "请输入单笔金额" });
                  limitmess=true
                  return false
            }
            if((Number(item.maxAmount)<=Number(item.minAmount))&&item.name!='VIP充值'){
                  this.$Tip.info({ content: "单笔上限必须大于单笔下限" });
                  limitmess=true
                  return false
            }
            if((item.quick_amount==null||item.quick_amount=='')&&item.name!='VIP充值'){
                  this.$Tip.info({ content: "请输入常用金额" });
                  limitmess = true;
                  return false;
            }
            if(item.name=='微信支付'||item.name=='支付宝支付'){

                  if(item.maxAmount>this.regMoney){
                        limitmess=true
                        this.$Tip.info({ content: "单日上限必须小于"+this.regMoney });
                        return false
                  }
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
         })

        // handele_fee 為空時刪除
        params.limitAmount = this.listKeyDelete(params.limitAmount, 'handle_fee')
      }

      if(mess||limitmess){

            return false
      }
      let newbusinessKey = {};
      if (params.businessKey && params.businessKey.length > 0) {
        params.businessKey.map((item, key, index) => {
          let newkey = item.secret_key;
          let newval = item.secret_val;
          newbusinessKey[newkey] = newval;
        });
      }
      delete params.businessKey;
      params["businessKey"] = newbusinessKey;
      params.businessKey = JSON.stringify(params.businessKey);
      delete params.paymentClass;
      this.$refs.platform.validate(valid => {
        if (valid) {
          params.remarks = "暂无备注";
          updatepayment(params, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success('修改支付平台成功')
              this.$router.push({path:"paymentManager",query: {status: params.status}})
            }
          });
        }
      });
    },
    paymentdetail(params) {
      getpaymentDetail(params).then(res => {
        this.platform = res.data;
        this.methodsid =this.platform.paymentClass.map(i=>{
           return i.id
         })
        this.showID=this.platform.paymentClass.some(item=>item.name=="网银在线")
      });
    },
    onUploadSuccess(res, item) {
      const { path, src } = res.data;
      let key = item;
      let value = path;
      this.paymentInfo[key] = value;
    },
    getChecked(data) {
      this.newplatdata = data;
      //发送后台字段payMethod删除
      if(this.newplatdata.newarray.length==0){
          this.showID=false
      }
      this.showID=this.newplatdata.newarray.some(item=>item.className=="网银在线")
      if(this.platformList.length>1){
          this.platform.bankCode=this.platformList.filter(
           item => item.payName == this.platform.payName
        )
      }
    },
     getselectlist() {
      getpaymentName({siteId:this.$root.nowSite.id,purpose:"payment_channel"}).then(res => {
        this.platformList = res.data;
      });
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
  computed: {
    username() {
      return getUserName();
    },
    ...mapState({
      token: state => state.user.token
    })
  },
  watch: {
    "$root.nowSite": {
      handler(val) {
        this.uploadForm.data.siteId = val.id;
      },
      deep: true
    },
    "platform.businessKey": {
      handler(val) {
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
@import "../../styles/class.less";
/deep/.ivu-select{
  color:#444;
}
.w360 {
  width: 360px;
}
.pingtai {
  width: 360px;
  text-align: left;
  padding-left: 7px;
  height: 30px;
  line-height: 16px;
  background: #f5f5f5;
  border-radius: 5px;
}


</style>


