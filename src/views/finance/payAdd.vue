<template>
	<div class>
		<Form ref="paymentInfo" :model="paymentInfo" :rules="rules">
			<FormItem label="支付平台" prop="id" >
				<Select
				v-if="this.$route.params.page=='add'"
					class="w360x fontColor"
					v-model="paymentInfo.id"
					placeholder="请选择,可查询"
					filterable
					clearable
				>
					<Option
						@click.native="getName(t)"
						v-for="(t,i) in platformList"
						:key="i"
						:value="t.id"
					>{{t.platformname}}</Option>
				</Select>
				<Input class="w360x fontColor" 	v-if="this.$route.params.page=='edit'"  disabled v-model="paymentInfo.platformnickname"/>
			</FormItem>
			<FormItem label="商户编号" prop="agentcode">
				<Input class="w360x" v-model="paymentInfo.agentcode" placeholder="请输入商户编号" />
			</FormItem>
			<FormItem label="商户签名" prop="agentSignKey">
				<Input class="w360x" v-model="paymentInfo.agentSignKey" placeholder="请输入商户签名密钥" />
			</FormItem>
			<FormItem label="商户加密钥" prop="agentDecryptKey">
				<Input class="w360x" v-model="paymentInfo.agentDecryptKey" placeholder="请输入商户加密钥" />
			</FormItem>
			<FormItem label="支付状态" prop="status">
				<Select class="w360x fontColor" v-model="paymentInfo.status" placeholder="请选择">
					<Option value=0 class="fontColor">正常</Option>
					<Option value=1 class="fontColor">停用</Option>
				</Select>
			</FormItem>
			<FormItem label="开放终端" class="clearfix">
				<span class="fl xColor" style="margin-left:-80px;">*</span>
				<div class="fl">
					<Checkbox
						:indeterminate="indeterminate"
						:value="checkAll"
						@click.prevent.native="handleCheckAll"
					>全选</Checkbox>
				</div>
				<CheckboxGroup
					v-model="paymentInfo.sitedevices"
					prop="sitedevices"
					@on-change="checkAllGroupChange"
					class="fl"
				>
					<Checkbox label="pc">PC</Checkbox>
					<Checkbox label="h5">H5</Checkbox>
					<Checkbox label="android">Android</Checkbox>
					<Checkbox label="ios">IOS</Checkbox>
				</CheckboxGroup>
			</FormItem>
			<FormItem>
				<Button
					type="primary"
					class="w360x ivu-btn commonSubmit"
					style="margin-left:90px;"
					:loading="$root.editBtnLoading"
					@click="submit"
				>确认添加</Button>
			</FormItem>
		</Form>
	</div>
</template>
<script>
	import { createpayment, sitePlatformAdd,sitePlatformUp} from "@/api/finance";
	import { getPlatformList } from "@/api/system";
	import { mapState } from "vuex";
	import { getUserName } from "@/libs/util";
	import { getToken } from "@/libs/util";
	import { log } from "util";
	export default {
		name: "addPayment",
		data() {
			return {
				indeterminate: true,
				checkAll: false,
				paymentAdd: [],
				paylist: "",
				platformList: [],
				newplatdata: "",
				paymentInfo: {
					id: "",
					siteId: this.$root.nowSite.id,
					siteName: this.$root.nowSite.siteName,
					platformnickname: "",
					agentcode: "",
					agentSignKey: "",
					agentDecryptKey: "",
					status:0,
					sitedevices: []
				},
				rules: {
					id: [
						{
							required: true,
							message: "请选择支付平台",
							trigger: "blur"
						}
					],
					agentcode: [
						{
							required: true,
							message: "请输入商户编号",
							trigger: "blur"
						}
					],
					agentSignKey: [
						{
							required: true,
							message: "请输入商户签名密钥",
							trigger: "blur"
						}
					],
					status: [
						{
							required: true,
							message: "请选择支付状态",
							trigger: "blur"
						}
					]
				}
			};
		},
		created() {

      if(this.$route.params.page=='edit'){
				this.$route.query.status=String(this.$route.query.status);
				this.$route.query.sitedevices=this.$route.query.sitedevices&&this.$route.query.sitedevices.split(",")
				this.paymentInfo=this.$route.query;
      }

			getPlatformList().then(res => {
				this.platformList = res.data;
      });
      const params={
        id:this.$route.query.id,
        siteId:this.$root.nowSite.id
      }
		},
		watch: {
			"$root.nowSite": {
				handler(val) {
					this.uploadForm.data.siteId = val.id;
				},
				deep: true
			}
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
					this.paymentInfo.sitedevices = ["pc", "h5", "android", "ios"];
				} else {
					this.paymentInfo.sitedevices = [];
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
			getName(t) {
        const { id, platformname } = t;
				this.paymentInfo.id = id;
				this.paymentInfo.platformnickname = platformname;
			},
			submit() {
        if(this.$route.params.page=='add'){
          		let data = {
					...this.paymentInfo,
					siteId:this.$root.nowSite.id,
					siteName:this.$root.nowSite.siteName,
					sitedevices: String(this.paymentInfo.sitedevices),
				};
				sitePlatformAdd(data,true).then(res => {
					if (res != undefined && res.code == 200) {
						this.$Message.success({ content: "添加支付平台成功" });
						this.$router.push({
							name: "payManagerList"
						});

					}
				});
				}
				if(this.$route.params.page=='edit'){
					let data={
						...this.paymentInfo,
						siteId:this.$root.nowSite.id,
					siteName:this.$root.nowSite.siteName,
					sitedevices: String(this.paymentInfo.sitedevices),
					}
					sitePlatformUp(data,true).then(res=>{
						if(res!=undefined&&res.code==200){
							 this.$Message.success({ content: "修改支付平台成功" });
							 	this.$router.push({
						  	name:"payManagerList"
						  });
						}
					})
				}
		
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	// 为保证前一列文字对齐
	/deep/.ivu-form-item-label {
		width: 90px;
	}
	/deep/.ivu-form-item-error-tip {
		font-size: 0.875rem;
		left: 89px !important;
		top: 36px;
	}
</style>


