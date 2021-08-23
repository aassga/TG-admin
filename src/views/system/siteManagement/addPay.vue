<template>
	<div>
		<!-- 新增支付平台 -->
		<div>
			<Form ref="formKey" :label-width="85" :model="formKey" :rules="rules">
				<FormItem label="支付平台" prop="platform_name">
          <Input :maxlength="10" v-model="formKey.platform_name" class="w260x" placeholder="请输入平台名称"/>
				</FormItem>
				<FormItem label="文件名称" prop="pay_file">
          <Input :maxlength="80" v-model="formKey.pay_file" class="w260x" placeholder="请输入英文名称"/>
				</FormItem>
				<FormItem label="加密类型" prop="need_use_key_type">
          <Input :maxlength="100" v-model="formKey.need_use_key_type" class="w260x" placeholder="请输入密钥类型"/>
				</FormItem>
				<FormItem label="网银代码">
					<Input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 20 }"
						v-model="formKey.bankCode"
						class="w260x"
						placeholder="请输入网银代码,可为空"
					/>
				</FormItem>
				<FormItem>
					<Button type="primary" class="w260x ivu-btn" @click.prevent="submit()">{{isEdit?'确认编辑':'确认添加'}}</Button>
				</FormItem>
			</Form>
		</div>
	</div>
</template>
<script>
	import Icons from "_c/icons";
	import { paymentJigsawManagementAdd,paymentJigsawManagementUpd,paymentJigsawManagementInfo,paymentJigsawManagementDel} from "@/api/system";
	export default {
		name: "addPlatform",
		components: {
			Icons
		},
		data() {
			return {
        isEdit:false,
        formKey:{
          platform_name:'',//平台名称
          pay_file:'',//英文名称
          need_use_key_type:'',//密钥
          bankCode:'',//网银代码
        },
				rules: {
					platform_name: [
            { required: true, message: "请输入平台名称", trigger: "blur" },
          ],
          pay_file:[
						{ required: true, message: "请输入文件名称", trigger: "blur" }
          ],
          need_use_key_type:[
						{ required: true, message: "请输入加密类型", trigger: "blur" }
          ],
				},
			};
    },
		mounted() {
      if(this.$route.params.page=='edit'){
        this.isEdit = true;
        let data = {id:this.$route.query.id};
        paymentJigsawManagementInfo(data).then(res=>{
          if(res&&res.code==200){
            this.formKey.platform_name = res.data.platform_name;
            this.formKey.pay_file = res.data.pay_file;
            this.formKey.bankCode = res.data.bankCode;
            this.formKey.need_use_key_type = res.data.need_use_key_type||'';
          }
        })
      }
    },
		methods: {
			submit() {
        for(let key in this.formKey){
          if(!this.formKey[key]){
            delete this.formKey[key]
          }
        };
        let data={...this.formKey};
        this.$refs.formKey.validate(valid => {
        if (valid) {
          if(!this.isEdit){
              paymentJigsawManagementAdd(data,true).then(res=>{
              if(res&&res.code == 200) this.$Message.success('添加支付平台成功');
              this.$router.push({ name: 'paymentJigsawManagementList' });
            })
          }else{
            data.id = this.$route.query.id;
            paymentJigsawManagementUpd(data,true).then(res=>{
              if(res&&res.code == 200) {
                this.$Message.success('编辑支付平台成功');
                this.$router.push({ name: 'paymentJigsawManagementList' });
              }
            })
          }
        }})
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../../styles/button.less";
	/deep/.ivu-form-item-error-tip {
		top: 5px;
		left: 260px;
		width: 400px;
  }
  .ivu-btn{
    height: 36px;
    line-height: 23px;
  }
</style>


