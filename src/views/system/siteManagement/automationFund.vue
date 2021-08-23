<template>
	<div>
		<div class="v2-button mb10">
			<Button @click="addAutomationFund('add')" class="ft16 w160x">
				<!-- <Icons type="xinzeng" class="mr5"></Icons> -->
				添加自动出款
			</Button>
			<Button @click="AlladdAutomationFund" class="ft16 w160x">
				全自动出款配置
			</Button>
			<Button @click="bankModalShow" class="ft16 w160x">
				全自动出款银行
			</Button>
		</div>
		<Button 
		type="primary" 
		:class="{disabled:!this.click}"
		 :loading="loadingD"
		 class="loanClick "
		 @click="changeFresh('all')">
		    {{content}}
			<!-- <Icons v-if="!loadingD" type="huiyuanchaxunshuaxin" color="white"></Icons> -->
			<Icons  type="huiyuanchaxunshuaxin" color="white"></Icons>
			<!-- <span v-else>加载中...</span> -->
		</Button>
		<div class="v2-table">
			<Tables
				ref="tables"
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				:showSizer="false"
				:page="false"
				:draggable="true"
				@on-drag-drop="onDragDrop"
				@on-change-status="changeStatus"
				@on-delete="onDelete"
				:pageSizeOpts="table.pageSizeOpts"
			></Tables>
		</div>
		<!-- 添加/编辑自动出款 -->
		<Modals ref="addModals" :title="title" :width="760">
			<div slot="content" class="modal-overflow" style="height:620px;overflow-y:auto;">
				<Form :label-width="280" ref="formKey" :model="formKey" :rules="rules">
					<FormItem label="出款平台" prop="api_name">
						<Select class="w290x" v-model="formKey.api_name" v-if="title=='添加自动出款平台'">
							<Option v-for="(t,index) in  automationList" :value="t.api_name" :key="index">{{t.api_name}}</Option>
						</Select>
						<Input v-else v-model="formKey.api_name" class="w290x" :disabled="title=='编辑自动出款平台'" />
					</FormItem>
					<FormItem label="商户编号" prop="merchant">
						<Input class="w290x" v-model="formKey.merchant" placeholder="请输入商户编号" />
					</FormItem>
					<FormItem label="商户密钥" prop="secret">
						<Input
							type="textarea"
							class="w290x"
							:autosize="{minRows:3,maxRows: 10}"
							v-model="formKey.secret"
							placeholder="请输入商户密钥"
						/>
					</FormItem>
					<FormItem label="授权额度" >
					   <Input maxlength="10"
					   @on-keyup="formKey.auth_money = formKey.auth_money.replace(/[^\d]/g, '')"
					   placeholder="0,‘空’表示无限制" class="w290x" v-model="formKey.auth_money"/>
					</FormItem>
					<FormItem label="单笔下限">
						<Input
							v-model="formKey.min_money"
							type="text"
							
							@on-keyup="formKey.min_money=formKey.min_money&&formKey.min_money.replace(/[^\d]/g,'')"
							class="w290x"
							placeholder="单笔最低代付金额"
						/>
					</FormItem>
					<FormItem label="单笔上限">
						<Input
							v-model="formKey.max_money"
							type="text"
							@on-keyup="formKey.max_money=formKey.max_money&&formKey.max_money.replace(/[^\d]/g,'')"
							class="w290x"
							placeholder="单笔最高代付金额"
						/>
					</FormItem>
					<FormItem label="开放等级" prop="newlevelLabel">
						<LevelSelect
							v-model="formKey.newlevelLabel"
							clearable
							placeholder="全部"
							ref="LevelSelect"
							width="290"
							:mode="'多选'"
							all-modal
							:levelType="'member'"
							@on-level-change="levelChange"
						/>
					</FormItem>
					<FormItem label="状态">
						<Select class="w290x" v-model="formKey.status">
							<Option value="yes">正常</Option>
							<Option value="no">停用</Option>
						</Select>
					</FormItem>
					<div style="display: flex">
						<FormItem label="全自动出款">
							<Switch size="large" v-model="default_setting">
								<span slot="open">开启</span>
								<span slot="close"></span>
							</Switch>
							<Poptip trigger='hover' class="ml20" transfer placement='right-start'>
								<div slot="content">
									<p class="mb10">全自动出款：</p>
									<p class="pl20 mb10">可通过全自动出款平台系统自动“通过”出款给会员,不需要进行人工审核操作，</p>
									<P class="pl20 mb10">当有多个全自动出款平台时，则进行随机分配</P>
									<p class="mb10">全自动出款会员需满足条件：</p>
									<p class="mb10">（1）不能是首次出款</p>
									<p class="mb10">（2）2天内不能有人工加款</p>
									<p>（3）单笔出款金额需小于等于自身单笔上限，且会员的现金占比需小于等于全自动出款配置中</p>
									<p class="pl38">设定的现金占比</p>
								</div>
								<Icons style="vertical-align:middle" type='bangzhutishi' color='#E4E4E4' :size='26'/>
							</Poptip>
						</FormItem>
						<FormItem label="拆分出款" :label-width="132">
							<Switch size="large" v-model="split">
								<span slot="open">开启</span>
								<span slot="close"></span>
							</Switch>
						</FormItem>
					</div>
					<div v-if="split">
						<FormItem label="单笔订单金额 ≥" prop="split_single_max">
							<Input
								v-model="formKey.split_single_max"
								type="text"
								class="w290x"
								placeholder="请输入每笔订单超过多少金额需拆分出款"
							/>
						</FormItem>
						<FormItem label="拆分单笔金额" prop="split_amount">
							<Input
								v-model="formKey.split_amount"
								type="text"
								class="w290x"
								placeholder="请输入拆分的单笔金额"
							/>
						</FormItem>
					</div>
					<!-- <FormItem>
						<Checkbox v-model="default_setting"></Checkbox> 
						<span class="ml5">
							
							设为默认？</span>
						<Poptip 
						trigger="hover"
						content="通过出款平台自动出款给会员，不需要进行人工审核操作"
						placement="bottom-start">
						<Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
					</Poptip>
						
					
					</FormItem> -->
					<FormItem>
						<Button class="ft20 ivu-btn submit" type="primary" @click.prevent="save()">提交保存</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
		<!-- 全自动出款设置 -->
		<Modals ref="addAllModals" title="全自动出款设置" :width="760">
			<div slot="content" class="modal-overflow" style="height:280px;overflow-y:auto;">
				<Form :label-width="280" ref="formKeys" :model="AllautomationList" :rules="rules1">
					<FormItem label="单笔上限" prop="maxMoney">
						<InputNumber  
							:value="AllautomationList.maxMoney" 
							
							@on-change="
                                        value => {
                                            AllautomationList.maxMoney = value;
                                        }
                                    "
							placeholder="请输入单笔取款上线" class="w260x"  />
					</FormItem>
					<FormItem label="现金占比" prop="cashRatio">
						<InputNumber 
							class="w260x" 
							:formatter="value => `${value}`"
							:parser="value => value.replace(/[^\d]/g, '')"
							:value="AllautomationList.cashRatio" 
							:max='100'
							:min='0'
							@on-change="
                                        value => {
                                            AllautomationList.cashRatio = value;
                                        }
                                    "
							placeholder="请输入单笔现金占比" /> %
					</FormItem>
					<FormItem label="状态">
						<Switch size="large" v-model="AllautomationList.status">
							<span slot="open">开启</span>
							<span slot="close"></span>
						</Switch>
						<Poptip trigger='hover' class="ml20"  transfer placement='right-start'>
							<div slot="content">
								<p class="mb10">全自动出款,会员需同时满足单笔上限和现金占比条件</p>
								<p class="pl20 mb10">现金占比=（账户余额+历史取款+审核中取款）/总存款 *100%</p>
								<P class="pl20 mb10">如：A出款平台设置单笔上限为9000，现金占比为80%</P>
								<p class="mb10">（1）当会员的余额为2000，历史取款10000，审核中取款为8000，总存款为40000
        						<p class="pl38 mb10">则会员的现金占比=（2000+10000+8000）/40000*100%=50% ≤ 设定现金占比80%</p>
        						<p class="pl38 mb10">同时当会员的单笔取款 ≤ 单笔上限9000时，可通过全自动出款平台出款成功</p>
								<p class="mb10">（2）当会员的余额为2000，历史取款10000，审核中取款为8000，总存款为10000
								<p class="pl38 mb10">则会员的现金占比=（2000+10000+8000）/10000*100%=200% ≥ 设定现金占比80%</p>
								<p class="pl38 mb10">此时当会员的单笔取款 ≤ 单笔上限为9000时，也不可通过全自动出款平台出款成功</p>
							</div>
							<Icons style="vertical-align:middle" type='bangzhutishi' color='#E4E4E4' :size='26'/>
						</Poptip>
					</FormItem>
					<FormItem>
						<Button class="ft20 ivu-btn submit" type="primary" @click.prevent="saveAll()">提交保存</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
		<Modals ref="bankModals" title="全自动出款银行" :width="760">
			<div slot="content" class="modal-overflow ml20 mr20" style="height:280px;overflow-y:auto;">				
				<P class="lh40 txt-a ft16 mb20" style="background:rgba(137, 180, 226, 0.1)">以下银行支持全自动出款</P>
				<Row style="line-height:60px">
					<Button class="gameButtom w125x h36x mr20"  v-for='(t) in bankList' :key='t'>{{t}}</Button>
				</Row>
			</div>
		</Modals>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	import LevelSelect from "@/components/level-select";
	import {
		automaticWithdrawalDel,
		automaticWithdrawalList,
		automaticWithdrawalUpdateStatus,
		automaticWithdrawalMerchantFileName,
		automaticWithdrawalAdd,
		automaticMerchantStatusExists,
		automaticWithdrawalInfo,
		automaticWithdrawalUpd,
		automaticWithdrawalPlatformSort,
		automaticWithdrawalScheduleGet,
		automaticWithdrawalSchedule,
		automaticWithdrawalEnableBankList
	} from "@/api/system";
	import { automaticWithdrawalMerchantBalance } from "@/api/finance";
	import { mapMutations, mapActions, mapState } from "vuex";
	import Modals from "@/components/modals";
	import Icons from "@/components/icons";
	export default {
		name: "automationFund",
		components: {
			Icons,
			Tables,
			Modals,
			LevelSelect
		},
		data() {
			let a = (rule, val, cb) => {
				this.$nextTick(() => {
					if (
						this.formKey.newlevelLabel &&
						this.formKey.newlevelLabel.length > 0
					) {
						cb();
					} else {
						cb(new Error("请输入正确的开放等级"));
					}
				});
			};
			let c = (rule, val, cb) => {
				
				this.$nextTick(() => {
					console.log(this.AllautomationList.cashRatio)
					if (
						this.AllautomationList.cashRatio ||
						this.AllautomationList.cashRatio == 0
					) {
						cb();
					} else {
						cb(new Error("请输入单笔现金占比"));
					}
				});
			};
			let b = (rule, val, cb) => {
				this.$nextTick(() => {
					console.log(this.AllautomationList.maxMoney)
					if (
						this.AllautomationList.maxMoney ||
						this.AllautomationList.maxMoney == 0
					) {
						cb();
					} else {
						cb(new Error("请输入单笔取款上线"));
					}
				});
			};
			let d=(rule, val, cb)=>{
					if(val<this.tradeBalance){
						cb();
					}else if(val==undefined){
						cb(new Error('请输入授权额度'))
					}else{
            // cb(new Error("授权额度不可大于平台商户余额"));
					}
			}
			return {
				content:'',
				totalTime: 5,
        click: true,
				tradeBalance:'',
				bankList:[],
				default_setting:false,
				split: false,
				clearable: true,
				title: "",
				msg: "",
				automationList: [],
				AllautomationList:{},
				loadingD: false,
				pageSizeOpts: [10],
				formKey: {
					newlevelLabel: "",
					siteId: this.$root.nowSite.id,
					siteName: "",
					api_file_name: "",
					merchant: "",
					auth_money:'',
					secret: "",
					max_money: "",
					min_money: "",
					status: "yes",
					single:true,
					default_setting:'',
					split: '',
					split_single_max: '',
					split_amount: '',
				},
				table: {	
					loading: true,
					columns: [
						{
							title: "排序",
							align: "center",
							width: 60,
							render: (h, params) => {
								return h(Icons, {
									props: {
										type: "paixukongjian",
										color: "#dadada",
										size: 20
									}
								});
							}
						},
						{
							title: "自动出款平台",
							key: "api_name",
							align: "center"
						},
						{
							title: "商户编号",
							key: "merchant",
							align: "center",
							tooltip: true
						},
						{
							title: "商户余额",
							key: "balance",
							align: "center",
							tooltip: true,
							render: (h, params) => {
								console.log(params.row.balance)
								this.tradeBalance=params.row.balance;
								return (
									<div>
										<span>{params.row.balance}</span>
									
									</div>
									// <span
									// 		onClick={() => {
									// 			this.changeFresh("one", params);
									// 		}}
									// 	></span>
									// {" "}
									// 	<Icons
									// 		class="ml5 blue-font"
									// 		size="15"
									// 		type="huiyuanchaxunshuaxin"
									// 	></Icons>
									//  <span style={{display:params.row.check==true?"none":'inline-block'}} onClick={()=>{this.changeFresh(params)}}> <Icons class="ml5 blue-font" size="15"  type="huiyuanchaxunshuaxin" ></Icons></span>
								);
							}
						},
						{
							title: "授权额度",
							key: "auth_money",
							align: "center",
							render:(h,params)=>{
								return(	
									<span>{params.row.auth_money=='0.00'?'无限制':params.row.auth_money}</span>
								)
							}
						},
						{
							title: "单笔下限",
							key: "min_money",
							align: "center"
						},
						{
							title: "单笔上限",
							key: "max_money",
							align: "center",
							render: (h, params) => {
								return (
									<span>
										{params.row.max_money == "0.00"
											? "无上限"
											: params.row.max_money}
									</span>
								);
							}
						},

						{
							title: "开放等级",
							key: "levelAlias",
							align: "center",
							tooltip: true
						},
						{
							title: "全自动出款",
							key: "default_setting",
							align: "center",
							render:(h,params) => {
								return (
									<span 
										style={{
												color: params.row.default_setting === "no" ? " #444 " : "#FF2626 "
											}}
									>{params.row.default_setting=='no'?'否':'是'}</span>
							
								)
							}
						},
						{
							title: "拆分出款",
							key: "split",
							align: "center",
							render:(h,params) => {
								return (
									<span 
										style={{
												color: params.row.split === "no" ? " #444 " : "#FF2626 "
											}}
									>{params.row.split=='no'?'否':'是'}</span>
							
								)
							}
						},
						{
							title: "状态",
							key: "status",
							align: "center",
							render: (h, params) => {
								return (
									<span
										style={{
											color: params.row.status === "yes" ? " #444 " : "#FF2626 "
										}}
									>
										{" "}
										{params.row.status === "yes" ? "正常" : "停用"}
									</span>
								);
							}
						},
						{
							title: "操作",
							align: "center",
							key: "",
							render: (h, params) => {
								return (
									<div>
										<a
											class="ib mr10"
											onClick={() => {
												this.changeStatus(params);
											}}
										>
											{params.row.status == "yes" ? "停用" : "启用"}
										</a>
										<a
											class="ib mr10"
											onClick={() => {
												this.addAutomationFund("edit", params);
											}}
										>
											编辑
										</a>
										<a
											class="ib mr10"
											onClick={() => {
												this.onDelete(params);
											}}
										>
											删除
										</a>
									</div>
								);
							}
						}
					],
					data: []
				},
				rules: {
					newlevelLabel: [
						{
							required: true,
							validator: a,
							trigger: "change",
							pattern: /.+/
						}
					],
					api_name: [
						{
							required: true,
							message: "请选择出款平台",
							trigger: "change",
							pattern: /.+/
						}
					],
					secret: [
						{
							required: true,
							message: "请输入商户密钥",
							trigger: "blur",
							pattern: /.+/
						}
					],
					merchant: [
						{
							required: true,
							message: "请输入商户编号",
							trigger: "blur",
							pattern: /.+/
						}
					],
					auth_money:[
					{
							required: true,
							validator: d,
							trigger: "blur",
							pattern: /.+/
						}
					],
					split_single_max: [
						{
							required: true,
							message: '请输入单笔订单金额',
							trigger: "blur",
							pattern: /^(0$|[1-9][0-9]*)+(.[0-9]{1,2})?$/
						}
					],
					split_amount: [
						{
							required: true,
							message: '请输入单笔订单金额',
							trigger: "blur",
							pattern: /^(0$|[1-9][0-9]*)+(.[0-9]{1,2})?$/
						}
					],
				},
				rules1: {
					cashRatio: [
						{
							required: true,
							trigger: "blur",
							// message:'请输入单笔现金占比',
							validator: c,
							pattern: /.+/
						}
					],
					maxMoney: [
						{
							required: true,
							// message: "请输入单笔取款上线",
							validator: b,
							trigger: "blur",
							pattern: /.+/
						}
					]
				}
			};
		},
		mounted() {
			this.getData();
			this.getAutomationFundList();
			automaticWithdrawalEnableBankList({siteId:this.$root.nowSite.id}).then(res=>{
				if(res&&res.code==200){
					this.bankList = res.data;
				}
			})
		},
		watch: {
			nowSite: {
				handler(val, oldVal) {
					this.$nextTick(() => {
						this.$refs.LevelSelect.init(this.$root.nowSite.id);
					});
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			...mapMutations(["setMoneyStatus"]),
			changeFresh(type, params) {
				// if (type == "one") {
				// 	const data = {
				// 		siteId: this.$root.nowSite.id,
				// 		id: params.row.id
				// 	};
				// 	automaticWithdrawalMerchantBalance(data, true).then(res => {
				// 		if (res && res.code == 200) {
				// 			this.table.data.forEach(t => {
				// 				if (t.id == params.row.id) {
				// 					t.balance =
				// 						res.data.message == undefined ? res.data : res.data.message;
				// 					t.check = true;
				// 				}
				// 			});
				// 		}
				// 	});
				// }

				if (type == "all") {
					if(!this.click) return;
					this.click = false;
					this.content = this.totalTime + `s后可刷新`;
					let clock = window.setInterval(() => {
					this.totalTime--;
					this.content = this.totalTime + "s后可刷新";
					if (this.totalTime < 0) {
					window.clearInterval(clock);
					this.content = "";
					this.totalTime = 5;
					this.click = true; //这里重新开启
					}
				}, 1000);
					this.table.data.forEach(t => {
						const data = {
							siteId: this.$root.nowSite.id,
							id: t.id
						};
						this.loadingD = true;
						this.$root.startTableLoading();
						automaticWithdrawalMerchantBalance(data, true).then(res => {
							if (res && res.code == 200) {
								this.msg = res.data.message;
								if (t.id) {
									t.balance =
										res.data.message == undefined ? res.data : res.data.message;
									this.loadingD = false;
									this.$root.endTableLoading();
								}
							}
						});
					});
				}
			},
			levelChange(res) {
				this.formKey.newlevelLabel = res.levelLabel;
			},
			onDragDrop(oldIndex, newIndex) {
				if (oldIndex == newIndex || oldIndex == "") return;
				const data = {
					siteId: this.$root.nowSite.id,
					id: this.$refs.tables.insideTableData[oldIndex].id,
					sortId: this.$refs.tables.insideTableData[newIndex].sortId
				};
				automaticWithdrawalPlatformSort(data, true).then(res => {
					if (res != undefined && res.code == 200) {
						this.$Message.success({ content: "排序更新成功" });
						this.$refs.tables.insideTableData.splice(
							newIndex,
							0,
							...this.$refs.tables.insideTableData.splice(oldIndex, 1)
						);
					}
				});
			},
			save() {
			
				// if(this.title!='添加自动出款平台'){
				// 	if(this.formKey.auth_money>=this.tradeBalance){
				// 		this.$Tip.success({content:'授权额度不可大于平台商户余额'})
				// 		return false
				// 	}
				// }
				this.$refs.formKey.validate(valid => {
					if (valid) {
						// this.$refs.addModals.spinShow();
						this.formKey.default_setting=this.default_setting ? 'yes' : 'no';
						this.formKey.split=this.split ? 'yes' : 'no';
						const {
							id,
							siteId,
							api_name,
							merchant,
							secret,
							max_money,
							min_money,
							status,
							auth_money,
							default_setting,
							split,
							split_single_max,
							split_amount
						} = this.formKey;
						let fileName = [];
						let c = this.automationList.filter(t => {
							if (t.api_name == api_name) {
								fileName.push(t.api_file_name);
							}
						});
						if (min_money-max_money>0) {
							this.$Tip.info({ content: "单笔下限额须小于单笔上限" });
							this.$refs.addModals.spinHide();
							return false;
						}
						if (this.title == "添加自动出款平台") {
							const data = {
								siteId: this.$root.nowSite.id,
								merchant,
								auth_money,
								siteName: this.$root.nowSite.siteName,
								max_money,
								min_money,
								status,
								secret,
								default_setting,
								api_name: api_name,
								levelId: String(this.formKey.newlevelLabel),
								api_file_name: String(fileName),
								split,
								split_single_max: Math.floor(split_single_max) ? Math.floor(split_single_max) : 0,
								split_amount: Math.floor(split_amount) ? Math.floor(split_amount) : 0,
							};
							if (!this.split) {
								delete data.split_single_max
								delete data.split_amount
							}
							automaticWithdrawalAdd(data, true).then(res => {
								if (res.code != undefined && res.code == 200) {
									this.$Message.success({ content: "添加自动出款成功" });
									this.$refs.addModals.hide();
									this.$refs.addModals.spinHide();
									this.getData();
								}
							});
						} else {
							//编辑自动出款平台
							let data = {
								id,
								merchant,
								auth_money:parseInt(auth_money),
								secret,
								max_money: Math.floor(max_money),
								status,
								min_money: Math.floor(min_money),
								default_setting,
								split,
								split_single_max: Math.floor(split_single_max) ? Math.floor(split_single_max) : 0,
								split_amount: Math.floor(split_amount) ? Math.floor(split_amount) : 0,
							};
							data.levelId = String(this.formKey.newlevelLabel)
							automaticWithdrawalUpd(data, true).then(res => {
								if (res.code != undefined && res.code == 200) {
									this.$Message.success({ content: "编辑自动出款成功" });
									this.$refs.addModals.hide();
									this.$refs.addModals.spinHide();
									this.getData();
								}
							});
						}
					}
				});
			},
			saveAll(){
			
				this.$refs.formKeys.validate(valid => {
					if (valid) {
						let data = {...this.AllautomationList};
						data.siteId = this.$root.nowSite.id;
						data.status = this.AllautomationList.status==true?'yes':'no';
						this.$refs.addAllModals.spinShow();
						automaticWithdrawalSchedule(data,true).then(res=>{
							if(res&&res.code==200){
								this.$Message.success('修改成功')
								this.$refs.addAllModals.spinHide();
								this.$refs.addAllModals.hide();
							}else{
								this.$refs.addAllModals.spinHide();
							}
						}).catch(error=>this.$refs.addAllModals.spinHide())
					}
				});
			},
			AlladdAutomationFund(){
				this.$nextTick(()=>{
					this.$refs.addAllModals.show();
					this.$refs.addAllModals.spinShow();
					this.getAllAutomationFundList();
					this.$refs.formKeys.resetFields();
				})
			},
			bankModalShow(){
				this.$refs.bankModals.show();
			},
			addAutomationFund(type, params) {
				this.getAutomationFundList();
				this.$refs.formKey.resetFields();
				this.formKey = {};
				this.formKey.status = "yes";
				this.title = type == "add" ? "添加自动出款平台" : "编辑自动出款平台";
				this.default_setting = false
				this.split = false
				this.$refs.addModals.show();
				this.$nextTick(() => {
					let levelLabel = [];
					this.$refs.LevelSelect.init(this.$root.nowSite.id, { levelLabel });
				});
				if (type == "edit") {
					this.$refs.addModals.spinShow();
					const data = { id: params.row.id };
					automaticWithdrawalInfo(data)
						.then(res => {
							if (res.code != undefined && res.code == 200) {
								let levelLabel = res.data.levelId;
								this.$refs.LevelSelect.init(this.$root.nowSite.id, {
									levelLabel
								});
								this.formKey = res.data;
								this.default_setting=res.data.default_setting=='no'?false:true;
								this.split = res.data.split === 'no' ? false : true
								this.formKey.api_name = res.data.api_name;
								this.$refs.addModals.spinHide();
							}
						})
						.catch(error => this.$refs.addModals.spinHide());
				} else {
					this.$refs.formKey.resetFields();
				}
			},
			getAutomationFundList() {
				const data = { siteId: this.$root.nowSite.id };
				automaticWithdrawalMerchantFileName(data).then(res => {
					if (res.code != undefined && res.code == 200) {
						this.automationList = res.data;
					}
				});
			},
			getAllAutomationFundList() {
				const data = { siteId: this.$root.nowSite.id };
				automaticWithdrawalScheduleGet(data).then(res => {
					if (res.code != undefined && res.code == 200) {
						this.AllautomationList = res.data;
						this.AllautomationList.status = res.data.status=='yes'?true:false;
						
						if(!res.data.maxMoney&&!res.data.siteId){
							this.AllautomationList.maxMoney=50000;
						}
						if(!res.data.cashRatio&&!res.data.siteId){
							this.AllautomationList.cashRatio=80;
						}
						this.$refs.addAllModals.spinHide();
					}
				});
			},
			onDelete(params) {
				const { id, api_name } = params.row;
				let text = `您确定删除${api_name}吗？`;
				let msg = `删除${api_name}成功`;
				const data = { id };
				this.$Tip.confirm({
					content: text,
					onOk: () => {
						automaticWithdrawalDel(data, true).then(res => {
							if (res.code != undefined && res.code == 200) {
								this.$Message.success({ content: msg });
								this.table.data.splice(params.row.index, 1);
								this.getData();
							}
						});
					}
				});
			},
			changeStatus(params) {
				let text, msg;
				const { id, api_name, status } = params.row;
				automaticMerchantStatusExists({ siteId: this.$root.nowSite.id }).then(
					res => {
						const data = {
							siteId: this.$root.nowSite.id,
							id: id,
							status
						};
						if (status == "yes") {
							text = `您确定停用${api_name}吗？`;
							msg = `停用${api_name}成功`;
						}
						if (status == "no") {
							text = `您确定启用${api_name}吗？`;
							msg = `启用${api_name}成功`;
						}
						if (res.code != undefined && res.code == 200) {
							if (res.data == true && status == "no") {
								this.$Tip.confirm({
									content: text,
									onOk: () => {
										automaticWithdrawalUpdateStatus(data, true).then(res => {
											if (res != undefined && res.code == 200) {
												this.$Message.success(msg);
												this.getData();
											}
										});
									}
								});
							}
							if (status == "yes" || (res.data == false && status == "no")) {
								this.$Tip.confirm({
									content: text,
									onOk: () => {
										automaticWithdrawalUpdateStatus(data, true).then(res => {
											if (res.code != undefined && res.code == 200) {
												this.$Message.success(msg);
												this.getData();
											}
										});
									}
								});
							}
						}
					}
				);
			},
			getData() {
				this.$root.startTableLoading();
				// this.loadingD = true;
				automaticWithdrawalList({ siteId: this.$root.nowSite.id })
					.then(res => {
						if (res.code == 200 && res.code != undefined) {
							// this.loadingD = false;
							const { data } = res;
							this.table.data = data;
							this.$root.endTableLoading();
						}
					})
					.catch(error => this.$root.endTableLoading());
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../../../src/styles/button";
	.loanClick {
  .disabled {
    background-color: #ddd;
    border-color: #ddd;
	color: #57a3f3;
    cursor: not-allowed; // 鼠标变化
  }
}
/deep/.ivu-btn{
	height: 36px;
	font-size:16px;
}
	/deep/.ivu-select-dropdown {
		max-height: 167px;
	}
	.ivu-btn > span {
		span {
			font-size: 0.875rem !important;
		}
	}
	.gameButtom{
		&:nth-child(5n) {
				margin-right:0 ;
			}
	}
</style>
