<template>
	<div class="v2-form-wrapper">
		<Form
			ref="formKey"
			:model="formKey"
			:rules="mode==='single'?singleRule:batchRule"
			:label-width="110"
			style="width:500px"
		>
			<!-- 加入key切换时候清空会员账号 -->
			<FormItem label="会员账号" class="mt10" v-show="origin == false && mode =='single'" prop="userName">
				<!-- <FormItem
				label="会员账号"
				class="mt10"
				v-show="origin == false && mode =='single'"
				:key="formKey.handle"
				prop="userName"
				>-->
				<AutoSearch
					ref="autoSearh"
					class="w270x"
					placeholder="输入会员账号，带搜索功能"
					@sendSuperior="getSuperior"
					@changeShow="changeShow"
					stage="all"
					:siteId="$root.nowSite.id"
					@sendBalance="getBalance"
				></AutoSearch>
				<span class="ml5 red-font" v-show="showBalance">{{`￥${this.memberBalance}`}}</span>
				<!-- <Input v-model="formKey.userName" :style="style"/> -->
			</FormItem>
			<FormItem label="加减操作" :key="formKey.handle+'operator'">
				<RadioGroup v-model="formKey.handle" @on-change="changeHandleCategory">
					<Radio class="fontColor" label="加款" v-if="addShow"></Radio>
					<Radio class="fontColor" label="减款" v-if="reduceShow"></Radio>
				</RadioGroup>
			</FormItem>
			<FormItem
				:label="formKey.handle==='加款'?'加款类型':'减款类型'"
				prop="typeValues"
				required
				:key="`${formKey.handle}category`"
			>
				<Select
					clearable
					v-model="typeValues"
					:style="style"
					@on-change="checkTypeVal"
					class="fontColor"
				>
					<Option
						class="fontColor"
						v-show="formKey.handle==='加款'"
						v-for="item in oprateTypes.add"
						:key="item.id"
						:value="item.type+':'+item.subType"
						:label="item.subClass"
					>
						<span>{{item.subClass}}</span>
						<span :style="{float: 'right', color: '#ccc'}">{{item.class}}</span>
					</Option>
					<!-- 减款类型 -->
					<Option
						v-show="formKey.handle==='减款'"
						v-for="item in oprateTypes.reduce"
						:key="item.id"
						:value="item.type+':'+item.subType"
						:label="item.subClass"
					>
						<span>{{item.subClass}}</span>
						<span :style="{float: 'right', color: '#ccc'}">{{item.class}}</span>
					</Option>
				</Select>
				<Checkbox class="ml5" v-if="this.authInPage.indexOf('letterSend')!=-1" v-model="formKey.message" >站内信</Checkbox>
			</FormItem>
			<FormItem label="站内信息" v-if="formKey.message" prop="content">
				<Input class="w260x" :row="5" type="textarea" v-model="formKey.content" placeholder="请输入站内信息" />
			</FormItem>
			<FormItem label="打码倍数" prop="multiple" v-if="formKey.handle === '加款' &&  showMultiple">
				<InputNumber :min="0" :step="1" :max="100" v-model="formKey.multiple" :style="style" />
			</FormItem>
			<FormItem v-if="showType=='autoWithdraw'" label="订单号" prop="withdrawOrderNo">
				<Input   :style="style" v-model="formKey.withdrawOrderNo" maxlength="18"  placeholder="请输入订单号"/>
			</FormItem>
			<FormItem
				:label="formKey.handle==='加款'?'加款金额':'减款金额'"
				:prop="mode==='single' ? 'money' : 'amount'"
			>
				<Input v-show="mode==='single'"  @on-focus ="changgeNumber"  v-model="formKey.money" maxlength='11' :style="style" :placeholder="formKey.handle==='加款'?'请输入加款金额':'请输入减款金额'" />
				<Input
					v-show="mode==='batch'"
					
					v-model="formKey.amount"
					@on-change="testUserNum"
					:rows="5"
					type="textarea"
					:style="style"
					placeholder="*格式为*:账号,金额 例如:a123,100 注意逗号为英文格式,一行一个,最多操作10000个用户"
				/>
			</FormItem>
			<FormItem label="备注信息" prop="remarks">
				<Input
					v-model="formKey.remarks"
					:style="style"
					@on-change="remarkChange"
					:rows="5"
					type="textarea"
					placeholder="请输入备注信息"
				/>
			</FormItem>
			<div
				class="mb30 mt30"
				style="margin-left:-280px;height:1px;border-top:1px  solid #e4e4e4;width:225%"
			></div>
			<FormItem>
				<Button
					type="primary"
					class="h50 w160x ft20 ml40"
					@click.prevent="fundsFormSubmit"
					:loading="$root.editBtnLoading"
					:disabled="disabledBtn"
				>{{formKey.handle === '加款'?'确定加款':'确定减款'}}</Button>
			</FormItem>
		</Form>
	</div>
</template>
<script>
	import SiteSelect from "_c/site-select";
	import AutoSearch from "_c/auto-search";
	export default {
		components: { SiteSelect, AutoSearch },
		props: {
			mode: {
				type: String,
				required: true
			},
			oprateTypes: {
				type: Object,
				required: true
			},
			addShow: {
				type: Boolean,
				required: false
			},
			reduceShow: {
				type: Boolean,
				required: false
			},
			showMultiple: {
				type: Boolean,
				required: false,
				default: true
			}
		},
		data() {
			const validatePassTwo = (rule, value, callback) => {
				if (
					this.$refs.autoSearh.value === "" ||
					this.$refs.autoSearh.value === undefined
				) {
					// this.$Message.error("请输入或选择会员账号");
					// return;
					callback(new Error("请输入或选择会员账号"));
				} else {
					callback();
				}
			};
			return {
		authInPage: JSON.parse(localStorage.authInPage),
		showType:'',
				addType: "0",
				type: "",
				style: {
					width: "260px"
				},
				showBalance: false,
				disabledBtn: false,
				memberBalance: "",
				origin: true, //true会员查询进入 false侧边路由进入
				formKey: {
					amount: "",
					money: 0,
					// handle: "+",
					handle: this.addShow ? "加款" : "减款",
					userName: "",
					multiple: 1,
					remarks: "",
		  message: false,
		  withdrawOrderNo:'',
          content:"",
				},
				typeValues: "",
				singleRule: {
					userName: [
						{
							required: true,
							validator: validatePassTwo,
							trigger: "change"
						}
					],
					//校验加减款类型
					typeValues: {
						required: true,
						// validator: (rule, val, cb) => this.typeValues ? cb() : this.$Message.error("请选择加减款类型")
						validator: (rule, val, cb) => {
							this.typeValues ? cb() : cb(new Error("请选择加减款类型"));
						}
					},
					moneyType: [
						{ required: true, message: "请选择加减款类型", trigger: "change" }
					],
					multiple: [
						{
							required: true,
							message: "打码倍数必须填写",
							type: "number",
							trigger: "blur"
						},
						{
							pattern: /^[+]{0,1}(\d+)$/,
							message: "打码倍数必须是个整数",
							trigger: "blur"
						}
					],
					content: [
						{
							required: true,
							message: "请输入站内信息",
							trigger: "blur",
							pattern: /.+/
						}
					],
					withdrawOrderNo:[
					    {
							required: true,
							message: "请输入订单号",
							trigger: "blur",
							pattern: /.+/
						},
						{
                        pattern: /^(([0-9]\d*))$/,
                        message: '请输入正确的订单号(仅为数字)',
                        trigger: 'blur',
                        required: true
                    }
					],
					money: [
						{
							required: true,
							message: "金额必须填写",
							trigger: "blur"
						},
						{
							message: "请输入正确的金额",
							trigger: "blur",
							pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
						}
					],
					remarks: [{ required: true, message: "备注必须填写", trigger: "blur" }]
				},
				batchRule: {
					//  moneyType: [
					//   {
					//     required: true,
					//     message: "请选择加减款类型",
					//     trigger: "change"
					//   }
					// ],
					typeValues: {
						required: true,
						// validator: (rule, val, cb) => this.typeValues ? cb() : this.$Message.error("请选择加减款类型"),
						validator: (rule, val, cb) => {
							this.typeValues ? cb() : cb(new Error("请选择加减款类型"));
						}
					},
					multiple: [
						{
							required: true,
							message: "打码倍数必须填写",
							type: "number",
							trigger: "blur"
						}
          ],
          content: [
						{
							required: true,
							message: "请输入站内信息",
							trigger: "blur",
							pattern: /.+/
						}
					],
					amount: [{ required: true, message: "金额必须填写", trigger: "blur" }],
					remarks: [{ required: true, message: "备注必须填写", trigger: "blur" }]
				}
			};
    },
		watch: {
			"formKey.userName": {
				handler(val, oldVal) {
					if (!val) {
						this.memberBalance = "";
						this.showBalance = false;
					}
				},
				deep: true
			},
			typeValues(val, oldVal) {
				if (val == "other:transfer") this.formKey.multiple = 0;
				else this.formKey.multiple = 1;
			}
		},
		methods: {
			changgeNumber(){
				
				
			this.formKey.money='';

			},
			changeShow(flag) {
				this.showBalance = flag;
			},
			remarkChange() {
				this.formKey.remarks =
					this.$root.trimAll(this.formKey.remarks).length > 0
						? this.formKey.remarks
						: this.$root.trimAll(this.formKey.remarks);
			},
			checkTypeVal(t) {
				this.showType=t&&t.split(':')[1];
				this.$refs["formKey"].validateField("typeValues");
			},
			setUname(name) {
				this.formKey.userName = name;
			},
			setOrigin() {
				this.origin = false;
			},
			getBalance(res) {
				this.memberBalance = Number(res).toFixed(2);
				this.showBalance = true;
			},
			testUserNum(e) {
				let arr = e.target.value.split(",");
				if (arr.length > 10000) {
					this.$Tip.info({
						content: "用户量太大，最多可操作一万个用户，请分批操作！"
					});
				}
			},
			resetForm() {
				this.$refs.formKey.resetFields();
				this.typeValues = "";
				//清空会员查询名字
				this.$refs.autoSearh.value = "";
			},
			//带搜索功能的输入框返回数据
			getSuperior(res) {
				this.formKey.userName = res;
			},
			fundsFormSubmit() {
        this.getSuperior(this.$refs.autoSearh.value);
				this.$refs.formKey.validate(valid => {
					if (valid) {
						if (!this.disabledBtn) {
							let params = { ...this.formKey };
			
							params.siteId = this.$root.nowSite.id;
							const [type, subType] = this.typeValues.split(":");
							params.type = type;
							params.subType = subType;
							if (this.mode === "single") {
								const { userName, money } = params;
								params.amount = `${userName},${money}`;
								params.userName = "";
								params.money = "";
							}
							if (!this.typeValues) {
								this.$Tip.info({ content: "请选择您的操作类型" });
								this.$root.endEditLoading();
								return false;
							}
							if (this.mode == "single" && !this.formKey.userName) {
								this.$Tip.info({ content: "请选择您的操作账号" });
								this.$root.endEditLoading();
								return false;
							}
							// 这个校验要改 多输换行会卡死浏览器
							// if (this.mode === "batch") {
							// let reg = /^(([0-9a-zA-Z!_@#$%^&*\f\r\t\v -]{5,20},((\d(\.\d{1,2})?)|([1-9]{1}\d{1,9}(\.\d{1,2})?))\n)*([0-9a-zA-Z_!@#$%^&*\f\r\t\v -]{5,20},((\d(\.\d{1,2})?)|([1-9]{1}\d{1,9}(\.\d{1,2})?))))$/
							// let reg = /^(([\s\S]*,((\d(\.\d{1,2})?)|([1-9]{1}\d{1,9}(\.\d{1,2})?))\n)*([\s\S]*,((\d(\.\d{1,2})?)|([1-9]{1}\d{1,9}(\.\d{1,2})?))))$/
							// console.log(reg.test(this.formKey.amount))
							// return
							// 校验书写格式金额输入正数，小数点可以带2位，整数部分长度限制到10位分割一个换行符分隔，结尾不输入分割符，用户名字符数字！@等符号不包含，号长度不限制
							// if (
							// 	!reg.test(
							// 	// !/^(([0-9a-zA-Z!_@#$%^&*\f\r\t\v -]{5,20},((\d(\.\d{1,2})?)|([1-9]{1}\d{1,9}(\.\d{1,2})?))\n)*([0-9a-zA-Z_!@#$%^&*\f\r\t\v -]{5,20},((\d(\.\d{1,2})?)|([1-9]{1}\d{1,9}(\.\d{1,2})?))))$/.test(
							// 		this.formKey.amount
							// 	)
							// ) {
							// 	this.$Message.error("请输入正确的金额和书写格式");
							// 	return false;
							// }
							// }
							if (this.mode == "batch" && !this.formKey.amount.includes(",")) {
								this.$Tip.info({
									content: "存入金额，名字与金额请以，英文逗号间隔"
								});
								this.$root.endEditLoading();
								return false;
							}
							for (let key in params) {
								if (!params[key] && params[key] !== 0) delete params[key];
							}
							if (!params.remarks) params.remarks = "暂无备注信息";
							if (params.handle === "减款") params.multiple = 0;
							this.disabledBtn = true;
							this.$root.startEditLoading();
							this.$emit("on-submit", params);
						}
					}
				});
			},
			handleChange(handle) {
				this.formKey.handle = handle;
				this.typeValues = "";
				this.formKey.remarks = "";
				this.memberBalance = "";
				this.showBalance = false;
			},
			changeHandleCategory() {
				if (this.formKey.userName)
					this.$refs.autoSearh.setDefault(this.formKey.userName);
				if (this.formKey.remarks) this.formKey.remarks = "";
				let handelValue = this.formKey.handle;
				this.typeValues = undefined;
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../../styles/button.less";
	/deep/.btns .ivu-btn > .ivu-icon + span {
		margin-left: 0px;
	}
	.btns {
		padding-bottom: 20px;
		width: 450px;
		// text-align: center;
		margin-left: 109px;
		.ivu-btn.add {
			margin-right: 0px;
		}
		.ivu-btn.reduce {
			margin-right: 6px;
			margin-left: 60px;
		}
	}
	// 备注栏最大拉伸高度设置
	/deep/textarea.ivu-input {
		max-height: 300px;
	}

	//ui修改：提交按钮距离底部为80，与支付设置modal统一
	.ivu-form .ivu-form-item:last-child {
		margin-bottom: 36px;
	}
	/deep/.ivu-form .ivu-form-item {
		margin-bottom: 36px;
	}
	/deep/.ivu-input-number-handler-wrap {
		display: none;
	}
</style>


