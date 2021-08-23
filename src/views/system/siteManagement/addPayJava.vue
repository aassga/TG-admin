<template>
	<div>
		<!-- 新增支付平台 -->
		<div>
			<Form ref="formKey" :label-width="85" :model="formKey" :rules="rules">
				<FormItem label="支付平台" prop="platform_name">
          <Select v-model="formKey.siteId"  class="w260x" placeholder="请输入平台名称">
            <Option class="w260x"  :value="t.id" :key="i"   v-for="(t,i) in siteList" >
            {{t.siteName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="最大金额">
          <Input class="w260x" placeholder="请输入最大金额" v-model="formKey.maxMoney"/>
        </FormItem>
        <FormItem label="状态">
          <Select  class="w260x" v-model="formKey.state">
            <Option value='0'>正常</Option>
             <Option value='1'>停用</Option>
          </Select>
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
	import { payChatJavaSite,paymentJigsawManagementUpd,paymentJigsawManagementInfo} from "@/api/system";
	export default {
		name: "addPlatform",
		components: {
			Icons
		},
		data() {
			return {
        isEdit:false,
        siteList:[],
        formKey:{
          id:'',
          siteId:'',
          maxMoney:'',
          state:'0',
        },
				rules: {
					siteId: [
						{ required: true, message: "请输入平台名称", trigger: "blur" }
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
      this.siteList=JSON.parse(localStorage.accessSite);
      if(this.$route.params.page=='edit'){
        this.isEdit = true;
        const {id,maxMoney,state,siteId}=this.$route.query;
        this.formKey.siteId=siteId;
        this.formKey.maxMoney=maxMoney;
        this.formKey.state=state;
      }
    },
		methods: {
			submit() {
        console.log(this.formKey)
        for(let key in this.formKey){
          if(!this.formKey[key]){
            delete this.formKey[key]
          }
        };
        let data={...this.formKey};
        this.$refs.formKey.validate(valid => {
        if (valid) {
          if(!this.isEdit){
              payChatJavaSite(data,true).then(res=>{
              if(res&&res.code == 200) this.$Message.success('添加支付平台成功');
              this.$router.push({ name: 'payPlatformManager' });
            })
          }else{
            data.id = this.$route.query.id;
            payChatJavaSite(data,true).then(res=>{
              if(res&&res.code == 200) {
                this.$Message.success('编辑支付平台成功');
                this.$router.push({ name: 'payPlatformManager' });
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


