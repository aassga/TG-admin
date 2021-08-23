  <template>
	<div>
		<div class="v2-search" style="line-height:38px">
			<Form ref="searchKey" inline>
				<FormItem label="刷新">
					<Select :value="autoFresh" @on-change="changeAuto" :class="[screen<1600?'s-66':'s-86']">
						<Option value="15">15秒</Option>
						<Option value="30">30秒</Option>
						<Option value="60">60秒</Option>
						<Option value="0">暂停</Option>
					</Select>
				</FormItem>
				<FormItem label="等级">
					<LevelSelect
						:clearable="clearable"
						financyMore
						placeholder="全部"
						ref="LevelSelect"
						width="86"
						mode="多选"
						:levelType="'finance'"
						@on-level-change="levelChange"
					/>
				</FormItem>
				<FormItem label="存入账户">
					<div class="accountColor">
						<Select
							:class="[screen<1600?'s-120':'s-220']"
							v-model="searchKey.depositId"
							clearable
							placeholder="全部"
							multiple
							:max-tag-count="1"
						>
					
							<Option
								class="accountWidth"
								v-for="(item,i) in depositAccount"
								:key="i"
								:value="item.depositId"
							>
						
								<span>{{item.bankName}}/{{item.cardName}}</span>
						
							</Option>
				
						</Select>
					</div>
				</FormItem>
				<FormItem label="状态">
					<Select
						:class="[screen<1600?'s-86':'s-86']"
						placeholder="全部"
						@on-change="changeStatus"
						clearable
						v-model="searchKey.status"
					>
						<Option value="success">成功</Option>
						<Option value="fail">失败</Option>
						<Option value="wait">待审核</Option>
					</Select>
				</FormItem>
				<FormItem label="开始日期">
					<DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
				</FormItem>
				<FormItem label="结束日期">
					<DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
				</FormItem>
				<FormItem>
					<Select v-model="searchKey.typeTag" :class="[screen<1400?'s-90':'s-100']" @on-change="audit">
						<Option value="userName">会员账号</Option>
						<Option value="agencyName">上级代理</Option>
						<Option value="updateUserName">审核者</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Input
						:placeholder="searchKey.typeTag=='userName'?'请输入账号':'多个请以,逗号隔开' "
						v-model="searchKey.content"
						:disabled="!searchKey.typeTag"
						@keyup.enter.native="searchSubmit"
						:class="screen<1600&&screen>1400?'s-100':screen<1400?'s-90':'s-120'"
					/>
				</FormItem>
				<FormItem>
					<Button type="primary" class="search" :loading="table.loading" @click.prevent="searchSubmit">查询</Button>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						class="ivu-btn export"
						@click.prevent="exportExcel"
						:loading="$root.editBtnLoading"
					>导出Excel</Button>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				ref="tables"
				:columns="table.columns"
				:loading="table.loading"
				:value="table.data"
				:total="table.total"
				:pageSizeOpts="table.pageSizeOpts"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
			></Tables>
		</div>
		<Modals
			ref="detailModal"
			title="入款详情"
			:width="760"
			@modalVisible="modalChange(arguments, lockData)"
		>
			<div slot="content">
				<div class="box">
					<div class="detail" ref="formKey" :model="formKey">
						<p>
							<label>会员账号：</label>
							<span>{{dataDetail.username}}</span>
						</p>
						<p>
							<label>存款姓名：</label>
							<span>{{dataDetail.realName}}</span>
						</p>
						<p>
							<label>存入账户：</label>
							<span>{{dataDetail.bankName}}/{{dataDetail.bankAccountName}}</span>
						</p>
						<p>
							<label>账户号码：</label>
							<span>{{dataDetail.bankId}}</span>
						</p>
						<p>
							<label>存款金额：</label>
							<span class="red-font font-bold">{{dataDetail.amount}}</span>
						</p>
						<p>
							<label>到账金额：</label>
							<span>{{DepositMoney=='NaN'?'-':DepositMoney}}</span>
						</p>
						<p>
						   <label>存款优惠： </label>
						<Select v-model="formKey.paymentBonus"
							style="width:175px;"
							@on-change="changeBonus">
								<Option v-for="(item,i) in paymentBonusList" :key="i" :value="item.preferential">赠送{{item.preferential}}%(有效投注{{item.codeMultiples}}倍)</Option>
						</Select>
						</p>
						<p>
							<label>备注信息：</label>
							<span>{{dataDetail.member_remark}}</span>
						</p>
						<p v-if="dataDetail.systemRemark">
							<label>系统备注：</label>
							<span>{{$root.text(dataDetail.systemRemark)}}</span>
						</p>
						<p>
							<label>提交时间：</label>
							<span>{{dataDetail.commitTime}}</span>
						</p>
						<p>
							<label>操作类型：</label>
							<span>通过</span>
						</p>
						<p class="txt-a">
							<Button
								class="submit mb60"
								:loading="$root.editBtnLoading"
								type="primary"
								@click="success"
							>确定</Button>
						</p>
					</div>
				</div>
			</div>
		</Modals>
		<!-- 提示 -->
		<Modals ref="tip" title="温馨提示" :width="600" :height="180">
			<div slot="content" class="ft22">
				<div style="width:400px;margin:auto;text-align:center">
					<p>{{this.message1||rejectMessage1}}</p>
					<p>{{this.message2||rejectMessage2}}</p>
				</div>
				<div class="txt-a mt30">
					<Button class="moneySubmit" @click="ok">确定</Button>
				</div>
			</div>
		</Modals>
		<!-- 导出 -->
		<Modals :width="560" ref="exportPageModal" title="温馨提示" class="modalBox">
			<div
				slot="content"
				class="modal-overflow clearfix ft14 mt5 mt20f mb20"
				:style="exportPage.length>5?'height:370px':''"
			>
				<div class="f6Color">
					<Icons class="ml23 iconColor" type="danchuangtishi" size="18" />
					<span class="pb10 pt10 ft14 ib ml10 f-color">当前查询结果共{{table.total}}条，需要分批导出！</span>
				</div>
				<div
					class="blue-font fl w50"
					v-for="(t,i) in exportPage"
					:style="{color: t.status == 'yes' ? '#918b8b' : ''}"
					:key="'export' + i"
					@click="batchExport((t.index)+1)"
				>
					<span
						class="ft14 mt20 ib bd b w210x pt10 pb10 txt-a ml35"
						v-if="exportPage && i < (exportPage.length - 1)"
					>导出第{{(10000*(t.index) + 1)}} ~ {{10000 * ((t.index)+1)}}条数据</span>
					<span
						class="ft14 ib mt20 bd b w210x pt10 pb10 txt-a ml35"
						v-if="exportPage && i == (exportPage.length - 1)"
					>导出第{{(10000*(t.index) + 1)}}~ {{table.total}}条数据</span>
				</div>
			</div>
		</Modals>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	import Icons from "@/components/icons";
	import LevelSelect from "@/components/level-select";
	import Modals from "@/components/modals";
	import {
		depositOfflineList,
		depositAuditData,
		auditLock,
		auditUnlock
	} from "@/api/finance";
	import { getUserType, getAccessFromLocal } from "@/libs/util";
	import { storeBankNQRCode } from "@/api/common";
	import { mapState, mapActions, mapMutations } from "vuex";
	export default {
		name: "payCompany",
		components: {
			Icons,
			Tables,
			Modals,
			LevelSelect
		},
		computed: {
			...mapState({
				autoFresh: state => state.info.payCompanyFresh,
				autoFreshTimer: state => state.info.payCompanyTimer,
				lockData: state => state.info.lockData_online,
				preferentialConfig: state => state.app.preferentialConfig
			})
		},
		data() {
			return {
				now_index: null,
				newPage: "",
				exportPage: [], //导出数据过大时的页数
				color: "red",
				screen: screen.width,
				newData: "",
				rejectMessage1: "",
				rejectMessage2: "",
				message1: "",
				message2: "",
				tipMessage: "",
				tipMessage2: "",
				screen: screen.width,
				newAccessSite: "", //存款优惠比率
				DepositMoney: "", //到账金额
				count: 0, //区分弹框的主动消失和被动消失
				clearable: true,
				accessSite: getAccessFromLocal(),
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				index: 0,
				depositAccount: [], //存入账户
				formKey: {}, //详情绑定的
                moreData: [],
				commitTime: "",
				dataDetail: {}, //详情
				searchKey: {
					status: "wait",
					typeTag: "userName",
					siteId: this.$root.nowSite.id,
					depositId: "",
					bankId: ""
				},
				Time: [],
				paymentBonusList: [], //存款优惠比率
				table: {
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					loading: false,
					columns: [
						{
							title: "订单号",
							key: "code",
							align: "center",
							minWidth: 95,
							tooltip: true
						},
						{
							title: "会员分组",
							key: "group_name",
							align: "center",
							minWidth: 45

						},
						{
							title: "等级",
							key: "levelAlias",
							align: "center",
							minWidth: 45
						},
						{
							title: "会员账号",
							key: "username",
							align: "center",
							minWidth: 95,
							tooltip: true
						},
						{
							title: "真实姓名",
							key: "cardName",
							align: "center",
							minWidth: 60,
							tooltip: true
						},
						{
							title: "上级代理",
							key: "agencyName",
							align: "center",
							minWidth: 95,
							tooltip: true,
							render: (h, params) => (
								<span> {this.$root.text(params.row.agencyName)} </span>
							)
						},
						{
							title: "存款方式/姓名",
							key: "",
							align: "center",
							tooltip: true,
							minWidth: 95,
							render: (h, params) => (
								<div>
									<p class="bb pb2 fh">{params.row.subType}</p>
									<p class="pt1 fh">{params.row.realName}</p>
								</div>
							)
						},
						{
							title: "存款金额",
							key: "amount",
							align: "center",
							minWidth: 65,
							render: (h, params) => {
								let { amount, status } = params.row;
								let color = status == "wait" ? "#FF2626" : "#FF2626";
								return <span style={{ color }}>{amount}</span>;
							}
						},
						{
							title: "存入账户/姓名",
							key: "bankName",
							align: "center",
							minWidth: 200,
							tooltip: true,
							render: (h, params) => (
								<div>
									<p class="bb pb2 fh">{params.row.bankName}</p>
									<p class="pt1 fh">{params.row.bankAccountName}</p>
								</div>
							)
						},
						{
							title: "状态",
							key: "status",
							align: "center",
							minWidth: 45,
							render: (h, params) => {
								const { status } = params.row;
								return (
									<span
										class={{
											"red-font": status === "fail",
											"green-font": status === "success",
											blue: status === "wait"
										}}
									>
										{status === "wait"
											? "待审核"
											: status === "success"
											? "成功"
											: "失败"}
									</span>
								);
							}
						},
						{
							title: "操作",
							key: "",
							align: "center",
							minWidth: 130,
							render: (h, params) => {
								let 	props = {size: "small",disabled: this.table.data[params.index].isLoading};
								return h(
									"div",
									{
										style: {
											display:
												this.adminType == "super" ||
												this.authInPage.indexOf("depositAudit") != -1
													? "block"
													: "none"
										}
									},
									[
										h(
											"Button",
											{
												props: props,
												style: {
													color: "#fff",
													backgroundColor: "#2D8CF0",
													paddingRight: "12px",
													paddingLeft: "12px",
													paddingTop: "0px",
													borderRadius: "6px",
													border: "none",
													cursor: "pointer",
													size: "small",
													marginRight: "15px",
													display:
														params.row.status === "wait" ? "inline-block" : "none"
												},
												on: {
													click: () => {
														this.now_index = params.index              
														this.table.data[params.index].isLoading = true
														this.count = 0;
														setTimeout(() => {
															this.dataDetail = params.row;
															if(this.preferentialConfig){
                                                            let  arr=this.preferentialConfig[0].config;
															let arrStatus=this.preferentialConfig[0].status;
                                                            if(arr.length!=0){
															this.paymentBonusList=arr;
															  if(arrStatus=='on'){  
																  	if(String(parseInt(Number(this.dataDetail.depositBonusRate)*100))==0){
                                                                      this.formKey.paymentBonus="1";
																	}else{
																		this.formKey.paymentBonus=String(Number(this.dataDetail.depositBonusRate))
																	}
																}
															
															  if(arrStatus=='off'){ 
																if( JSON.stringify(arr).includes('setSelection')){
                                                                         let newRate=arr.find(t=>t.setSelection==true).preferential;
																         this.formKey.paymentBonus=String(newRate);}
																  else{
																	 this.formKey.paymentBonus=String(arr[0].preferential)
																}
																}
															
															    //针对数据异步；
																let newArr=[{codeMultiples:Math.floor(this.dataDetail.multiple),preferential:this.formKey.paymentBonus}];
																let m=this.paymentBonusList.concat(newArr);
																let newobj = {}; 
																m= m .reduce((preVal, curVal) => {
																	newobj[curVal.preferential] ? '' : newobj[curVal.preferential] = preVal.push(curVal); 
																	return preVal 
																}, [])
																this.paymentBonusList=m;
															}else{//客户端无数据
															this.paymentBonusList=[{codeMultiples:"1",preferential:"1",}];
															this.formKey.paymentBonus="1";
															}
															}else{
														    this.formKey.paymentBonus="1";
															this.paymentBonusList=[{codeMultiples:"1",preferential:"1",}]
															}
															this.DepositMoney =(Number((this.dataDetail.amount *(1 + this.formKey.paymentBonus / 100)))).toFixed(2);
															//锁定
															const { id, time } = this.dataDetail;
															const data = {
																id,
																siteId: this.$root.nowSite.id,
																timestamp: time,
																depositType: "0",
																type: "Deposit"
															};
															auditLock(data).then(res => {
																if (res.data && res.data == true) {
																	this.setLockData_online(params.row)
																	this.$refs.detailModal.spinShow();
																	this.commitTime = this.$root.unixTime(
																		params.row.time
																	);
																	//默认显示存款优惠的
																	this.$set(
																		params.row,
																		"commitTime",
																		this.commitTime
																	);
																	this.index = params.index;
																	this.$refs.detailModal.spinHide();
																	this.$refs.detailModal.show();
																} else {
																	this.tipMessage = res.data.message;
																	this.message1 = this.tipMessage.split("，")[0];
																	this.message2 = this.tipMessage.split("，")[1];
																}
																//弹框提示
																if (res.data.code == 400) {
																	this.table.data[params.index].isLoading = false
																	this.now_index = null
																	this.$refs.tip.show();
																}
															});
														}, 500);
													}
												}
											},
											"通过"
										),
										h(
											"Button",
											{
												props: props,
												style: {
													color: "#fff",
													backgroundColor: "#2D8CF0",
													paddingRight: "12px",
													paddingLeft: "12px",
													paddingTop: "0px",
													borderRadius: "6px",
													border: "none",
													cursor: "pointer",
													display:
														params.row.status === "wait" ? "inline-block" : "none"
												},
												on: {
													click: () => {
														this.now_index = params.index
														this.table.data[params.index].isLoading = true
														const { id, time } = params.row;
														const data = {
															id,
															siteId: this.$root.nowSite.id,
															timestamp: time,
															depositType: "0",
															type: "Deposit"
														};
														auditLock(data).then(res => {
															if (res.data && res.data == true) {
																this.setLockData_online(params.row)
																this.index = params.index;
																this.$Tip.confirm({
																	content: "您确定拒绝此入款吗",
																	onOk: () => {
																		this.count = 1;
																		this.dataDetail = params.row;
																		this.reject();
																		this.now_index = null
																		this.table.data[params.index].isLoading = false
																	},
																	onCancel: () => {
																		const { id, time } = params.row;
																		const data = {
																			id,
																			siteId: this.$root.nowSite.id,
																			timestamp: time,
																			depositType: "0",
																			type: "Deposit"
																		};
																		auditUnlock(data).then(res => {
																			this.now_index = null
																			this.table.data[params.index].isLoading = false
																		});
																	}
																});
															} else {
																this.tipMessage2 = res.data.message;
																this.rejectMessage1 = this.tipMessage2.split(
																	"，"
																)[0];
																this.rejectMessage2 = this.tipMessage2.split(
																	"，"
																)[1];
																if (res.data.code == 400) {
																	this.table.data[params.index].isLoading = false
																	this.now_index = null
																	this.$refs.tip.show();
																}
															}
														});
													}
												}
											},
											"拒绝"
										),
										h(
											"span",
											{
												style: {
													display:
														params.row.status !== "wait" ? "inline-block" : "none"
												}
											},
											"-"
										)
									]
								);
							}
						},
						{
							title: "提交时间/审核时间",
							key: "time",
							align: "center",
							minWidth: 140,
							render: (h, params) => {
								const { status, item, updateTime } = params.row;
								if (status == "wait")
									return (
										<div>
											<p class="bb pb10 pl10 pr10">
												{this.$root.unixTime(params.row.time)}
											</p>
											<p class="pt1">-</p>
										</div>
									);
								if (status == "success" || status == "fail")
									return (
										<div>
											<p class="bb pb10 pl10 pr10">
												{this.$root.unixTime(params.row.time)}
											</p>
											<p class="pt1">
												{this.$root.unixTime(params.row.updateTime)}
											</p>
										</div>
									);
							}
						},
						{
							title: "审核者",
							key: "updateUserName",
							align: "center",
							minWidth: 85,
							tooltip: true,
							render: (h, params) => {
								if (params.row.status == "wait") {
									return <span>-</span>;
								}
								if (
									params.row.status == "success" ||
									params.row.status == "fail"
								) {
									return <span>{params.row.updateUserName}</span>;
								}
							}
						}
					],
					data: []
				}
			};
		},
		beforeDestroy() {
			this.changeFresh({ stage: "payCompany", val: this.autoFresh });
			this.clearTime("payCompany");
		},
		watch: {
			nowSite: {
				handler(val, oldVal) {
					this.$nextTick(() => {
						const { name } = this.$route;
						name === "payCompany" && this.$refs.LevelSelect.init(this.$root.nowSite.id);
					});
				},
				deep: true,
				immediate: true
			}
		},
		//为了同步存款优惠比率的值
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.newAccessSite = localStorage.accessSite;
				vm.newData = vm.$route.params.newSearchKey;
				if (vm.$route.params.from == 'complex') {
          		const { startTime, endTime, status } = vm.$route.query
					vm.searchKey.status = status
					vm.Time = [startTime, endTime]
					let params = {
						status, startTime, endTime, siteId: vm.$root.nowSite.id, typeTag: 'userName'
					}
					vm.getData({ params })
				} else if(vm.$route.params.from == 'depositReport'){
					const {startTime, endTime,depositId,bankId} = vm.$route.query;
					vm.Time = [startTime, endTime];
					vm.searchKey.status = 'success';
					
					let params = {
						status:'success',startTime, endTime,depositId,bankId,siteId: vm.$root.nowSite.id, typeTag: 'userName'
						};
					vm.getData({ params: params });
					
				} else if (vm.$route.params.newSearchKey == undefined) {
					vm.searchKey.typeTag = "userName";
					vm.searchSubmit();
				}else {
					vm.searchKey.typeTag = "updateUserName";
					(vm.searchKey.content = vm.newData.userName),
						(vm.searchKey.status = "");
					let { time } = vm.newData;
					vm.Time = typeof time == "string" ? [time, time] : [time[0], time[1]];
					let data = {
						...vm.searchKey,
						startTime: typeof time == "string" ? time : time[0],
						endTime: typeof time == "string" ? time : time[1],
						content: vm.newData.userName
					};
					vm.getData({ params: data });
				}
			});
		},
		created() {
			this.autoFreshFun(this.autoFresh);
			const { type } = window.performance.navigation;
			if (type == 1) {
				if (Object.keys(this.lockData).length > 0) {
					const { id, time } = this.lockData
					const data = {
						id,
						siteId: this.$root.nowSite.id,
						type: 'Deposit',
						depositType: '0',
						timestamp: time
					}
					auditUnlock(data)
					this.setLockData_online({})
				}
			}
		},
		mounted() {
			this.getStoreBankNQRCode();
		},
		methods: {
			...mapMutations(['setLockData_online','setDepositPreferentialType']),
			...mapActions(["changeFresh", "clearTime", "setTimer"]),
			//导出
			exportExcel() {
				this.exportPage = [];

				if (this.searchKey.depositId) {
					let arr = [];
					this.depositAccount.filter(item => {
						this.searchKey.depositId.forEach(el => {
							if (el == item.depositId) {
								arr.push(item.bankId);
							}
						});
					});
					this.searchKey.bankId = String(arr);
				}

				let data = {
					...this.searchKey,
					startTime: this.$root.formatTimeS(this.Time[0]),
					endTime: this.$root.formatnightTimeS(this.Time[1])
				};

				if (data.content) data.content = this.$root.trimAll(data.content);
				if (data.depositId) {
					data.depositId = String(this.searchKey.depositId);
				}

				//时间为空的校验
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					data.startTime = startTime && this.$root.formatTime(startTime);
					data.endTime = endTime && this.$root.formatTime(endTime);
				} else {
					return false;
				}
				this.searchKey.startTime = data.startTime;
				this.searchKey.endTime = data.endTime;
				for (let key in data) {
					if (!data[key]) delete data[key];
				}

				data.isExport = 1;

				//判断数量是否大于1万条
				if (this.table.total > 150000) {
					let num =
						this.table.total % 10000 == 0
							? this.table.total / 10000
							: Math.floor(this.table.total / 10000) + 1;
					for (let i = 0; i < num; i++) {
						this.exportPage.push({ index: i, status: "no" });
					}

					this.$refs.exportPageModal.show();
				} else {
					//导出数据少于10000条
					this.$root.startEditLoading();
					let openr = window.open();

					depositOfflineList({ params: data },true)
						.then(res => {
							if (res != undefined && res.code == 200) {
								let region = res.data.downloadUrl;
								let nowHost = region.split(".com")[1];
								let openr1 = openr ? openr : window;
								openr1.location.href = nowHost;
							} else {
								openr.close();
							}
							this.$root.endEditLoading();
						})
						.catch(error => this.$root.endEditLoading());
				}
			},
			//批量导出
			batchExport(index) {
				if (this.searchKey.depositId) {
					let arr = [];
					this.depositAccount.filter(item => {
						this.searchKey.depositId.forEach(el => {
							if (el == item.depositId) {
								arr.push(item.bankId);
							}
						});
					});
					this.searchKey.bankId = String(arr);
				}

				let data = {
					...this.searchKey,
					startTime: this.$root.formatTimeS(this.Time[0]),
					endTime: this.$root.formatnightTimeS(this.Time[1])
				};
				if (data.content) data.content = this.$root.trimAll(data.content);
				if (data.depositId) {
					data.depositId = String(this.searchKey.depositId);
				}
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				const { startTime, endTime } = data;
				if (startTime == "Invalid date" || endTime == "Invalid date") {
					this.$Tip.info({ content: "请输入开始和结束时间" });
					return false;
				}
				if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
					this.$Tip.info({ content: "结束时间必须大于开始时间" });
					return false;
				}

				this.searchKey.startTime = data.startTime;
				this.searchKey.endTime = data.endTime;
				data.isExport = 1;
				data.export_page = index;
				data.export_limit = "10000";
				this.$root.startEditLoading();
				let openr = window.open();
				depositOfflineList({ params: data })
					.then(res => {
						if (res.code == 200) {
							this.exportPage[index - 1].status = "yes";
							let region = res.data.downloadUrl;
							let nowHost = region.split(".com")[1];
							let openr1 = openr ? openr : window;
							openr1.location.href = nowHost;
						} else {
							openr.close();
						}
						this.$root.endEditLoading();
					})
					.catch(error => this.$root.endEditLoading());
			},
			//弹框
			ok() {
				this.$refs.tip.hide();
			},
			
			changeStatus(val) {
				if (val == "wait") {
					this.searchKey.typeTag = "userName";
				}
			},
			//点击审核者切换显示
			audit(val) {
				if (val == "updateUserName") {
					this.searchKey.status = "";
				}
				if (val == "userName") {
					this.searchKey.status = "wait";
				}
				if (val == "agencyName") {
					this.searchKey.status = "wait";
				}
			},
			//监听存取款比率的变化
			changeBonus(val) {
				// console.log(val)
				this.formKey.paymentBonus = val;
				this.DepositMoney = (
					this.dataDetail.amount *
					(1 + this.formKey.paymentBonus / 100)
				).toFixed(2);
			},
			//时间刷新
			changeAuto(val) {
				this.changeFresh({ stage: "payCompany", val }); //改变时间
				this.autoFreshFun(val);
			},
			autoFreshFun(val) {
				let data = { ...this.searchKey,limit: this.pageSize};
				if (this.searchKey.depositId) {
				data.depositId = String(this.searchKey.depositId);
				}
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				// this.getData({ params: data });
				if (val == "0") {
					this.clearTime("payCompany");
				} else {
					this.clearTime("payCompany");
					this.setTimer({
						stage: "payCompany",
						time: setInterval(() => {
						// this.getData({ params: data });
						this.searchSubmit();
						}, val * 1000)
					});
				}
			},
			catchError() {
				this.clearTime("payCompany");
				this.changeFresh({ stage: "payCompany", val: "0" });
			},
			modalChange(value, lockData) {
				let flag = value[0];
				if (!flag && this.count == 0) {
					//点击左上角关闭
					const { id, time } = lockData;
					const data = {
						id,
						siteId: this.$root.nowSite.id,
						timestamp: time,
						depositType: "0",
						type: "Deposit"
					};
					auditUnlock(data)
					this.setLockData_online({})
					this.table.data[this.now_index].isLoading = false
					this.now_index = null
				}
			},
			//存入账户
			getStoreBankNQRCode() {
				const data = {
					siteId: this.$root.nowSite.id
				};
				storeBankNQRCode(data).then(res => {
					this.depositAccount = res.data;
				});
			},
			//列表数据
			getData(data) {
				this.table.loading = true
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}

				if (!data.params.typeTag) {
					delete data.params.content;
				}
				//切换页面，输入空的空格报错，删除content的值
				if (
					dataParams.content === undefined ||
					dataParams.content.trim() === ""
				) {
					delete dataParams.content;
				}
				//找多个查询的银行的id
				if (this.searchKey.depositId) {
					let arr = [];
					this.depositAccount.filter(item => {
						this.searchKey.depositId.forEach(el => {
							if (el == item.depositId) {
								arr.push(item.bankId);
							}
						});
					});
					this.searchKey.bankId = String(arr);
				}

				depositOfflineList(data)
					.then(res => {
						if (res.data.data && res.data.data.list) {
							this.table.total = res.data.total;
							const { total, list } = res.data.data;
							this.table.data = list;
							this.table.data.forEach(t => this.$set(t, 'isLoading', false))
							this.moreData = total;
							this.table.loading = false
						} else {
							//数据的值为空
							this.table.data = [];
							this.table.total = 0;
							this.table.loading = false
						}
					})
					.catch(error => {
						this.catchError();
						this.table.loading = false
					});
			},
			searchSubmit() {
				this.$refs.tables.setPage();
				let params = { ...this.searchKey, siteId: this.$root.nowSite.id };

				if (this.searchKey.depositId) {
					params.depositId = String(this.searchKey.depositId);
				}
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTime(startTime);
					params.endTime = endTime && this.$root.formatTime(endTime);
				} else {
					return false;
				}
				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;

				for (let key in params) {
					if (!params[key]) delete params[key];
				}

        //查询大于7天事件判断
          if(new Date(this.Time[1]).getTime()-new Date(this.Time[0]).getTime()>604800000&&!this.searchKey.content){
          this.$Tip.info({content:"查询大于7天的记录，会员帐号必填"})
          return false;
        }

				if (params.content) params.content = this.$root.trimAll(params.content);
				if (this.typeTag == "userName") {
					if (!this.$root.validateName(params.content)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				}

				if (!this.$root.validateName(params.content)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
					return false;
				}

				if (this.typeTag == "updateUserName") {
					if (!this.$root.validateName(params.content)) {
						this.$Tip.info({ content: "您所查询的审核者账号不正确，请重新输入" });
						return false;
					}
				}

				if (this.typeTag == "agencyName") {
					if (!this.$root.validateName(params.content)) {
						this.$Tip.info({ content: "您所查询的审核者账号不正确，请重新输入" });
						return false;
					}
				}

				if (this.searchKey.depositId) {
					let arr = [];
					this.depositAccount.filter(item => {
						this.searchKey.depositId.forEach(el => {
							if (el == item.depositId) {
								arr.push(item.bankId);
							}
						});
					});
					params.bankId = String(arr);
				}

				this.getData({ params });
			},

			//通过
			success() {
				this.count = 1;
				let params = { ...this.formKey };
				const { id, time } = this.dataDetail;
				params.id = id;
				params.status = "success";
				params.siteId = this.$root.nowSite.id;
				params.timestamp = time;
				params.depositType = 1;
			
				// params.paymentBonus=(this.formKey.paymentBonus/100).toFixed(2);
				
				this.$root.startEditLoading();
				if (this.searchKey.depositId) {
					params.depositId = String(this.searchKey.depositId);
				}

				if (this.searchKey.depositId) {
					let arr = [];
					this.depositAccount.filter(item => {
						this.searchKey.depositId.forEach(el => {
							if (el == item.depositId) {
								arr.push(item.bankId);
							}
						});
					});
					params.bankId = String(arr);
				}
				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				depositAuditData(params, true).then(res => {
					this.$refs.detailModal.hide();
					if (res != undefined && res.code == 200) {
						if (!this.searchKey.bankId) delete this.searchKey.depositId;
						// 因为请求getdata，如果用户操作了params的值值会被带入过去
						if (
							this.searchKey.content === undefined ||
							this.searchKey.content.trim() === ""
						) {
							delete this.searchKey.content;
						}

						if (this.newPage && this.newPage != undefined) {
							if (this.table.data.length == 1) {
								this.searchSubmit();
							} else {
								let postData = { ...this.searchKey };
								if (postData.depositId) {
									postData.depositId = String(postData.depositId);
								}

								for (let key in postData) {
									if (!postData[key]) delete postData[key];
								}
								let page = this.newPage;
								this.getData({ params: postData, query: { page } });
							}
						} else {
							this.searchSubmit();
						}
					}
					this.$Message.success("入款成功");
				});
			},
			//拒绝
			reject() {
				const { id, time } = this.dataDetail;
				const params = {
					id: id,
					status: "fail",
					siteId: this.$root.nowSite.id,
					timestamp: time,
					paymentBonus: 0,
					depositType: 1
				};

				if (this.searchKey.depositId) {
					params.depositId = String(this.searchKey.depositId);
					this.searchKey.depositId = String(this.searchKey.depositId);
				}

				depositAuditData(params, true).then(res => {
					if (res != undefined && res.code == 200)
						this.table.data[this.index].status = "fail";

					if (this.newPage && this.newPage != undefined) {
						let postData = { ...this.searchKey };
						for (let key in postData) {
							if (!postData[key]) delete postData[key];
						}
						let page = this.newPage;
						this.getData({ params: postData, query: { page } });
						if (this.table.data.length == 1) {
							this.searchSubmit();
						}
					} else {
						this.searchSubmit();
					}
					this.$Message.success("拒绝入款成功");
				});
			},
			levelChange(res) {
				this.searchKey.levelId =String(res.id)
			},
			onPageChange(page) {
				this.newPage = page;
				let params = {
					...this.searchKey,
					limit: this.pageSize,
					siteId: this.$root.nowSite.id,
					startTime:this.searchKey.startTime ||this.$route.query.startTime,
					endTime: this.searchKey.endTime ||this.$route.query.endTime
				};
				for (let key in params){
				if(!params[key]) delete params[key]
				}
				if (this.searchKey.depositId) {
					params.depositId = String(this.searchKey.depositId);
				}
				if (this.searchKey.depositId) {
					let arr = [];
					this.depositAccount.filter(item => {
						this.searchKey.depositId.forEach(el => {
							if (el == item.depositId) {
								arr.push(item.bankId);
							}
						});
					});
					params.bankId = String(arr);
				}
				//去除会员账号空格
				if (params.content) params.content = this.$root.trimAll(params.content);

				this.getData({ params: params, query: { page } });
			},
			onPageSizeChange(pageSize) {
				let params = {
					...this.searchKey,
					limit: pageSize,
					siteId: this.$root.nowSite.id,
					startTime:this.$route.query.startTime,
					endTime:this.$route.query.endTime
				};
				for (let key in params){
				if(!params[key]) delete params[key]
				}
				if (this.searchKey.depositId) {
					params.depositId = String(this.searchKey.depositId);
				}
				if (this.searchKey.depositId) {
					let arr = [];
					this.depositAccount.filter(item => {
						this.searchKey.depositId.forEach(el => {
							if (el == item.depositId) {
								arr.push(item.bankId);
							}
						});
					});
					params.bankId = String(arr);
				}

				if (params.content) params.content = this.$root.trimAll(params.content);
				this.getData({ params: params });
				this.pageSize = pageSize;
			}
		},
		activated() {
			this.autoFreshFun(this.autoFresh);
		},
		deactivated() {
			this.clearTime("payCompany");
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	/deep/.s-180 input {
		border-radius: 4px !important;
	}
	/deep/.fh {
		line-height: 32px;
	}
	.ivu-table-cell {
		padding: 0 10px;
	}
	.box {
		display: flex;
		justify-content: center;
		.detail {
			font-size: 1rem;
			p {
				line-height: 3.3;
				label {
					display: inline-block;
					width: 110px;
					text-align: right;
					color: #444;
				}
			}
		}
	}
	.ivu-form-item {
		&:nth-child(6) {
			margin-right: -5px;
		}
	}
	/deep/.ivu-table-header {
		/deep/.ivu-table-column-center {
			height: 40px;
		}
	}

	/deep/.ivu-table-row {
		/deep/.ivu-table-column-center {
			height: 80px;
		}
	}

	/deep/.ivu-select {
		color: #444;
		.ivu-select-selected-value {
			color: #444;
		}
	}

	/deep/.ivu-form-item-content {
		height: 0 !important;
		line-height: 0 !important;
	}

	/deep/.ivu-tag-text,.ivu-select-max-tag{
		margin-left:-10px;

	}
	//存入账户的选中的颜色变为蓝色
	/deep/.ivu-select-multiple .ivu-select-item-selected {
		color: rgba(45, 140, 240, 0.9) !important;
	}

	//更改存入账户下拉框选中超出省略
	.accountColor {
		/deep/.ivu-select-dropdown {
			width: 210px;
			/deep/.ivu-select-dropdown-list {
				// width: 210px;
				/deep/.ivu-select-item {
					width: 210px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	  /deep/.ivu-select-multiple .ivu-tag{
    margin: 4.5px 4px 3px 0;
  }
  /deep/.ivu-tag-text .ivu-select-max-tag{
	  margin-left:-8px;
  }

</style>


