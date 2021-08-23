
<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<FormItem label="刷新">
					<Select :value="autoFresh" @on-change="changeAuto" class="s-86">
						<Option value="15">15秒</Option>
						<Option value="30">30秒</Option>
						<Option value="60">60秒</Option>
						<Option value="0">暂停</Option>
					</Select>
				</FormItem>
				<FormItem label="等级">
					<LevelSelect
					    clearable
						financyMore
						placeholder="全部"
						ref="LevelSelect"
						width="86"
						mode="多选"
						:levelType="'finance'"
						@on-level-change="levelChange"
					/>
				</FormItem>
				<FormItem label="状态">
					<Select
						class="s-100"
						placeholder="全部"
						v-model="searchKey.status"
						@on-change="changeStatus"
						clearable
					>
						<Option value="success">成功</Option>
						<Option value="fail">失败</Option>
						<Option value="wait">待审核</Option>
						<Option value="withdraw_free">注单审核通过</Option>
					</Select>
				</FormItem>
				<FormItem label="开始日期">
					<DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
				</FormItem>
				<FormItem label="结束日期">
					<DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
				</FormItem>
				<FormItem>
					<Select v-model="searchKey.typeTag" class="s-100" @on-change="audit">
						<Option value="userName">会员账号</Option>
						<Option value="update_user">审核者</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Input
						placeholder="多个请以,逗号隔开"
						@keyup.enter.native="searchSubmit"
						class="s-140"
						v-model="searchKey.content"
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
		<!-- 复用的组件 -->
		<Modals
			ref="auditModal"
			title="取款详情"
			:width="870"
			@modalVisible="modalChange(arguments,lockData_moneyWithdrawal, operateType)"
			@closeModal="closeWithdrawal()"
		>
			<div slot="content">
				<div class="v2-search bb clearfix">
					<ButtonGroup class="repay-button1">
						<Button
							class="fontColor"
							:class="tabName==item.name?'active':''"
							v-for="(item,index) in  List"
							:key="index"
							@click="changeType(item.name)"
						>{{item.name}}</Button>
					</ButtonGroup>
				</div>
				<!-- 取款详情 -->
				<div
					style="height:690px;"
					v-if="status && ((adminType == 'super') || (authInPage.indexOf('virtualWithdrawalsDetail') != -1))"
				>
					<div class="modal-overflow box" style="position: relative;">
						<div class="detail">
							<p>
								<label>订单号</label>
								<span>{{dataDetail.code}}</span>
							</p>
							<p>
								<label>账号余额</label>
								<span>{{dataDetail.balance!==undefined ? Number(dataDetail.balance).toFixed(2):""}}</span>
							</p>
							<p>
								<label>会员账号</label>
								<span>{{dataDetail.username}}</span>
							</p>
							<p>
								<label>取款金额</label>
								<span>{{dataDetail.actualAmount}}</span>
							</p>
							<p>
								<label>取款类型</label>
								<span> USDT取款</span>
							</p>
							<p>
								<label>协议类型</label>
								<span>{{this.$root.text(dataDetail.usdt_type)}}</span>
							</p>
							<p>
								<label>收款地址</label>
								<span>
									<Tooltip placement="bottom" max-width="800">
									<span>.....{{String(dataDetail.bankAccount).substring(String(dataDetail.bankAccount).length-6)}}</span>
									<div slot="content">{{dataDetail.bankAccount}}</div>
									</Tooltip>
								</span>
								<Button
									v-if="copyButton"
									class="ml50 ivu-btn copy lh14"
									type="info"
									size="small"
									v-clipboard:copy="dataDetail.bankAccount"
									v-clipboard:success="onCopy"
									v-clipboard:error="onError"
								>复制</Button>
							</p>
							<p>
								<label>取款货币</label>
								<span class="font-bold ft18" style="color:red !important">{{dataDetail.usdt_count}}</span>
								<Button
								v-if="copyButton"
								type="info"
								size="small"
								class="ml50 ivu-btn copy lh14"
								v-clipboard:copy="dataDetail.usdt_count"
								v-clipboard:success="onCopy"
								v-clipboard:error="onError"
								@click="noPayment()"
							>复制</Button>
							</p>
							<p>
								<label>备注信息</label>
								<span>{{dataDetail.member_remark}}</span>
							</p>
							<!-- 审核详情页面展示操作类型 -->
							<p v-if="waitModal">
								<label>操作类型</label>
								<RadioGroup
								v-if="detailModal == 'fail'"
									v-model="auditType"
									@on-change="changeReason"
									class="select"
								>
									<Radio label="pass" class="mr30">
										<span>通过</span>
									</Radio>
									<Radio label="reject">
										<span>拒绝</span>
									</Radio>
								</RadioGroup>
								<span
								v-else
								:class="dataDetail.status ? '' : 'redText'"
							>{{dataDetail.status == 'success' ? '通过' : '拒绝'}}</span>
							</p>
							<!-- 成功状态也会显示加入状态判断 -->
							<P v-if="showRemark&&dataDetail.status=='fail'">
								<label>拒绝原因</label>
								<span>{{remark}}</span>
							</P>
							<!-- 审核页面展示拒原因 -->
							<p v-if="auditType=='pass'" style="height:50px"></p>
							<!-- 如果未清空会显示拒绝原因修正 -->
							<p v-if="detailModal == 'fail'&&auditType=='reject'" style="height:50px">
								<label>拒绝原因</label>
								<Select transfer style="width:200px;" class="select fontColor" v-model="rejectmark">
									<Option v-for="(t,i) in rejectReason" class="fontColor" :key="i" :value="t">{{t}}</Option>
								</Select>
							</p>
							<!-- 审核详情页面展示确认提交和自动出款 -->
							<div class="txt-a clearfix" v-if="detailModal == 'fail'&&waitModal">
								<Button class="moneySubmit ml20" type="primary" @click="submit" >确认提交</Button>
							</div>
						</div>
          </div>
					<Tables
						ref="tables"
						class="pt10 ml30"
						:width="810"
						:columns="tableData.columns"
						:loading="tableData.loading"
						:value="tableData.data"
						:page="tableData.page"
						:total="tableData.total"
						:more="tableData.more"
					></Tables>
				</div>
				<!-- 打码详情 -->
				<div
					style="height:685px"
					v-if="nextStatus && ((adminType == 'super') || (authInPage.indexOf('virtualWithdrawalsDetail') != -1))"
				>
					<Tables
						class="ml20 mr20 mt20 "
						:height="codeDetail.data.length > 9 ? '665' : ''"
						:page="false"
						:columns="codeDetail.columns"
						:value="codeDetail.data"
					></Tables>
				</div>
			</div>
		</Modals>
		<!--锁定提示优化 -->
		<Modals ref="tip" title="温馨提示" :width="600" :height="180">
			<div slot="content" class="ft22">
				<div class="w400x ma txt-a">
					<p>{{this.tipMessage&&this.tipMessage.split("，")[0]}}</p>
					<p>{{this.tipMessage&&this.tipMessage.split("，")[1]}}</p>
				</div>
				<div class="txt-a mt30">
					<Button class="moneySubmit" @click="()=>{this.$refs.tip.hide()}">确定</Button>
				</div>
			</div>
		</Modals>
		<SendLoanModal ref="SendLoanModal" :newPage="newPage" :newActualAmount="newActualAmount" :datatail="datatail" :loanUid="loanUid"></SendLoanModal>
	</div>
</template>

<script>
	import Tables from "@/components/tables";
	import Icons from "@/components/icons";
	import LevelSelect from "@/components/level-select";
	import Modals from "@/components/modals";
	import SendLoanModal from "./components/sendLoan";
	import payTable from "./components/payTable";
	import { mapState, mapActions, mapMutations } from "vuex";
	import { getUserType } from "@/libs/util";
	import {
		virtualWithdrawalsList,
		checkBetAmount,
		virtualWithdrawalsAudit,
		auditLock,
		auditUnlock,
		virtualWithdrawalsDetail,
	} from "@/api/finance";
	import { Button } from "view-design";
	export default {
		name: "moneyWithdrawal",
		components: {
			Icons,
			Modals,
			payTable,
			SendLoanModal,
			Tables,
			LevelSelect
		},
		computed: {
			...mapState({
				autoFresh: state => state.info.moneyWithdrawalFresh,
				autoFreshTimer: state => state.info.moneyWithdrawalTimer,
				lockData_moneyWithdrawal: state => state.info.lockData_moneyWithdrawal
			})
		},
		data() {
			return {
                datatail:{},
                loanUid:'',
                automaticWithdrawalId:'',
		        checkedArr:[],
		        newActualAmount:'',//实际取款
				check: false,
				loanList: [],
				times: 0,
				totalTime: 5,
				canClick: true,
				moneyStatus: "",
				// background: true,
				now_index: null,
				newPage: 1,
				showIcon: false,
				blance: "",
				disabled: false,
				showBtn: true, //按钮显示
				// moneyAutomatically: false, //自动出款的显示隐藏
				withdrawalAmount: "", //取款金额（做比较）
				exportPage: [], //导出数据过大时的页数
				twoStarTime: "",
				twoEndTime: "",
				tabName: "取款详情",
				status: true, //默认取款详情
				nextStatus: false, //控制显示打码详情
				screen: screen.width,
				newData: "",
				newUsername: "", //跳转页面带的姓名的参数
				tipMessage: "", //
				id: "",
				time: "",
				copyButton: true, //复制的button
				operateType: "", // 是否调用锁定接口
				waitModal: true, //点击待审核的弹框
				row: "",
				count: 0, //切换表名只请求一次数据
				timer: null,
				uid: "", //uid  传给投注记录
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				color: true,
				showRemark: true, //拒绝原因显示
				remark: "",
				codeNext: [],
				codeBeg: [],
				Time: [],
				rejectmark: "",
				dataDetail: [], //取款详情展示,
				qrCodeData: {}, //打码详情需要的参数
				detailModal: "fail", //审核详情页面多加的元素
				searchKey: {
					status: "wait",
					typeTag: "userName",
					siteId: this.$root.nowSite.id,
					startTime: "",
					endTime: ""
				},
				auditType: "pass", //默认通过
				//列表->表格
				moreData: [],
				List: [
					{ name: "取款详情", value: "1" },
					{ name: "打码详情", value: "2" }
				], //详情按钮
				rejectReason: [
					"打码量不足",
					"注单审核中",
					"银行信息有误",
					"跨行维护中",
					"当日提款金额已超限",
					"额度异常",
					"请联系在线客服",
					"其他情况"
				],

				//取款详情->表格
				tableData: {
					page: false,
					loading: false,
					columns: [
						{
							title: "日期",
							key: "date",
							align: "center"
						},
						{
							title: "公司入款",
							key: "deposit_offline_amount",
							align: "center"
						},
						{
							title: "在线支付",
							key: "deposit_online_amount",
							align: "center"
						},
						{
							title: "线上取款",
							key: "withdrawals_amount",
							align: "center"
						},
						{
							title: "现金利润",
							key: "cash_profit",
							align: "center"
						},
						{
							title: "有效投注",
							key: "validBetAmount",
							align: "center"
						},
						{
							title: "会员输赢",
							key: "net_amount",
							align: "center",
							width: 120
						},
						{
							title: "代理佣金",
							key: "agency_amount",
							align: "center"
						},
						{
							title: "优惠金额",
							key: "bonus_amount",
							align: "center"
						}
					],
					data: []
				},
				//打码详情->表格
				codeDetail: {
					data: [],
					columns: [
						{
							title: "类型",
							key: "type",
							align: "center"
						},
						{
							title: "金额",
							key: "amount",
							align: "center"
						},
						{
							title: "打码倍数",
							key: "multiple",
							align: "center"
						},
						{
							title: "已打码",
							key: "betAmount",
							align: "center"
						},
						{
							title: "累计打码",
							key: "needBetAmount",
							align: "center"
						},
						{
							title: "时间",
							key: "time",
							width: 160,
							align: "center",
							render: (h, params) => {
								return (
									<span class="mr5 ml5">
										{this.$root.unixTime(params.row.time)}
									</span>
								);
							}
						}
					]
				},
				
				table: {
					loading: false,
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					columns: [
						{
							title: "等级",
							key: "levelAlias",
							align: "center",
							minWidth: 45,
							render: (h, params) => {
								return (
									<div>
										<span>{params.row.levelAlias}</span>
									</div>
								);
							}
						},
						{
							title: "会员账号",
							key: "username",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								return (
									<span
										class="blue-font"
										onClick={() => {
											let newStarTime = this.searchKey.startTime;
											let newEndTime = this.searchKey.endTime;
											if (
												this.$route.params.timeSearchKey &&
												this.$route.params.timeSearchKey != undefined
											) {
												this.twoStarTime = this.$route.params.timeSearchKey.time;
												this.twoEndTime = this.$route.params.timeSearchKey.time;
											}

											let newSearchKey = {
												...this.searchKey,
												startTime: this.twoStarTime || this.searchKey.startTime,
												endTime: this.twoEndTime || this.searchKey.endTime
											};
											for (let key in newSearchKey) {
												if (!newSearchKey[key]) delete newSearchKey[key];
											}
											let userName = params.row.username;
											this.$router.push({
												name: "financeSummary",
												params: { userName, newSearchKey }
											});
										}}
									>
										{params.row.username}
									</span>
								);
							}
						},
						{
							title: "姓名",
							key: "bankAccountName",
							align: "center",
							minWidth: 55
						},
						{
							title: "出款状况",
							key: "withdraw_count",
							align: "center",
							minWidth: 60
						},
						{
							title: "取款金额",
							key: "amount",
							align: "center",
							minWidth: 70
						},
						{
							title: "汇率",
							key: "usdt_rate",
							align: "center",
							minWidth: 45
						},
						{
							title: "货币数量",
							key: "usdt_count",
							align: "center",
							minWidth: 70,
							render: (h, params) => {
								return <span class="red-font">{params.row.usdt_count}</span>;
							}
						},
						{
							title: "状态",
							key: "status",
							align: "center",
							minWidth: 45,
							render: (h, params) => {
								const { status } = params.row;
								if (status == "wait")
									return (
										<div>
											<span
												class="blue cs"
												onClick={() => {
													this.waitModal = false;
													this.copyButton = false;
													//弹框的详情的页面--暂时注释
													// this.toggleModal(params.row, "success", "look");
													let gameSearchkey = { ...this.searchKey };
													let gameUsername = params.row.username;
													this.status = true;
													this.$router.push({
														name: "auditOne",
														params: { gameUsername, gameSearchkey }
													});
												}}
											>
												待审核
											</span>
										</div>
									);
								if (status == "success")
									return (
										<div>
											<span class="green-font">成功</span>
										</div>
									);
								if (status == "fail")
									return (
										<div>
											<span class="red-font">失败</span>
										</div>
									);
								if (status == "system_processing")
									return (
										<div>
											<span>系统审核中</span>
										</div>
									);
								if (status == "withdraw_free")
									return (
										<div>
											<span
												class="yellow-font"
												onClick={() => {
													let gameSearchkey = { ...this.searchKey };
													let gameUsername = params.row.username;
													this.$router.push({
														name: "auditOne",
														params: { gameUsername, gameSearchkey }
													});
												}}
											>
												注单审核通过
											</span>
										</div>
									);
							}
						},
						{
							title: "操作",
							key: "",
							align: "center",
							minWidth: 45,
							render: (h, params) => {
								const { status } = params.row;
								return (
									<div>
										<Button
											class="white-font"
											size="small"
											disabled={params.row.isLoading}
											style={{
												backgroundColor: "#2d8cf0",
												borderRadius: "6px",
												cursor: "pointer",
												lineHeight: "16px",
												display:
													(status === "wait" || status === "withdraw_free") &&
													(this.adminType == "super" ||
														this.authInPage.indexOf("virtualWithdrawalsAudit") != -1)
														? "inline-block"
														: "none"
											}}
											onClick={() => {
												this.now_index = params.index;
												this.table.data[params.index].isLoading = true;
												this.blance = "";
												this.showIcon = false;
												//取款金额
												this.disabled = false;
												this.withdrawalAmount = params.row.amount;
												if (this.moneyStatus == true) {
													//显示自动出款
													// this.moneyAutomatically = true;
													this.showBtn = false;
												} else {
													// this.moneyAutomatically = false;
													this.showBtn = true;
												}
												//弹框进来默认初始化
												this.tabName = "取款详情";
												this.status = true;
												this.nextStatus = false;

												this.id = params.row.id;
												this.time = params.row.time;

												(this.copyButton = true),
													(this.waitModal = true),
													(this.count = 0);
												const { id, time } = params.row;
												const data = {
													id,
													siteId: this.$root.nowSite.id,
													timestamp: time,
													depositType: "0",
													type: "Withdrawals"
												};
												auditLock(data, true).then(res => {
													if (res.data && res.data == true) {
														this.setLockData_moneyWithdrawal(params.row);
														if (
															status == "wait" ||
															status == "system_processing"
														) {
															this.showRemark = false;
														}
														//审核页面
														this.toggleModal(params.row, "fail", "operate");
													} else {
														this.tipMessage = res.data.message;
													}

													//弹框提示
													if (res.data.code == 400) {
														this.table.data[params.index].isLoading = false;
														this.now_index = null;
														this.$refs.tip.show();
                          }
                          this.loanUid=params.row.uid;
                        });

											}}
										>
											待出款
										</Button>
										<span
											class="blue-font"
											style={{
												display:
													status != "withdraw_free" && status != "wait"
														? "inline-block"
														: "none"
											}}
											onClick={() => {
												if (status !== "fail") {
													this.showRemark = false;
												}
												this.now_index = params.index;
												this.table.data[params.index].isLoading = true;
												this.qrCodeData = {
													siteId: this.$root.nowSite.id,
													uid: params.row.id
												};
												//详情页面
												this.toggleModal(params.row, true, "look");
											}}
										>
											详情
										</span>
									</div>
								);
							}
						},
						{
							title: "提交时间",
							key: "time",
							align: "center",
							minWidth: 140,
							render: (h, params) => {
								return (
									<span class="pr10 pl10">
										{this.$root.unixTime(params.row.time)}
									</span>
								);
							}
						},
						{
							title: "审核时间",
							key: "update_time",
							align: "center",
							minWidth: 140,
							render: (h, params) => {
								const {status}=params.row;
								if (status == "wait" ||status == "withdraw_free") {
									return <span>-</span>;
								}
								if (status == "success" ||status == "fail") {
									return (
										<span class="pr10 pl10">
											{this.$root.unixTime(params.row.update_time)}
										</span>
									);
								}
							}
						},
						{
							title: "审核者",
							key: "update_user",
							align: "center",
							minWidth: 90,
							render: (h, params) => {
								const {status,update_user}=params.row;
								if (status == "wait" ||status == "withdraw_free") {
									return <span>-</span>;
								}
								if (status == "success" ||status == "fail") {
									return <span>{update_user}</span>;
								}
							}
						},
						{
							title: "审核说明",
							key: "remark",
							align: "center",
							tooltip: true,
							minWidth: 130,
							render: (h, params) => {
								const {remark,outBankName}=params.row;
                                if(params.row.remark==''){params.row.remark='-'}
                                let a=`${params.row.remark} `+`${params.row.outBankName}`;
                                return <span>{a ? a: "-"}</span>;
							}
						}
					],
					data: []
				}
			};
		},
		watch: {
			nowSite: {
				handler(val, oldVal) {
					this.$nextTick(() => {
						const { name } = this.$route;
						name === "moneyWithdrawal" &&
							this.$refs.LevelSelect.init(this.$root.nowSite.id);
					});
				},
				deep: true,
				immediate: true
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.newData = vm.$route.params.timeSearchKey;
				if (vm.$route.params.from == "complex") {
					const { startTime, endTime, status } = vm.$route.query;
					vm.searchKey.status = status;
					vm.Time = [startTime, endTime];
					let params = {
						status,
						startTime,
						endTime,
						siteId: vm.$root.nowSite.id,
						typeTag: "userName"
					};
					vm.getData({ params });
				} else if (vm.newData != undefined && vm.newData) {
					let { time } = vm.newData;
					vm.searchKey.content = vm.newData.userName;
					vm.searchKey.typeTag = "update_user";
					vm.searchKey.status = "";
					if (from.name == "payTimeDetail")
						vm.Time = typeof time == "string" ? [time, time] : [time[0], time[1]];
					else vm.Time = [vm.newData.time, vm.newData.time];
					let data = {
						...vm.searchKey,
						startTime: typeof time == "string" ? time : time[0],
						endTime: typeof time == "string" ? time : time[1],
						content: vm.newData.userName,
						siteId: vm.$root.nowSite.id
					};
					vm.getData({ params: data });
				} else {
					vm.searchKey.typeTag = "userName";
					let data = { ...vm.searchKey, siteId: vm.$root.nowSite.id };
					vm.getData({ params: data });
					return false;
				}
			});
		},
		created() {
			this.autoFreshFun(this.autoFresh);
			const { type } = window.performance.navigation;
			if (type == 1) {
				if (Object.keys(this.lockData_moneyWithdrawal).length > 0) {
					const { id, time } = this.lockData_moneyWithdrawal;
					const data = {
						id,
						siteId: this.$root.nowSite.id,
						depositType: "0",
						type: "Withdrawals",
						timestamp: time
					};
					auditUnlock(data);
					this.setLockData_moneyWithdrawal({});
				}
			}
		},
		methods: {
			...mapActions([
				"clearTime",
				"changeFresh",
				"setTimer",
				"OnlineForceAudit"
			]),
      ...mapMutations(["setLockData_moneyWithdrawal"]),
			//自动出款拒接原因不可点击
			changeReason(val) {
				this.rejectmark = "";
				if (val == "reject") this.disabled = true;
				if (val == "pass") this.disabled = false;
			},
			exportExcel() {//导出
				this.exportPage = [];
				let data = {
					...this.searchKey,
					startTime: this.$root.formatTimeX(this.Time[0]),
					endTime: this.$root.formatnightTimeS(this.Time[1])
				};
				data.limit = this.pageSize;
				if (data.content) data.content = this.$root.trimAll(data.content);
				//时间为空的转化
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					this.searchKey.startTime=data.startTime = startTime && this.$root.formatTime(startTime);
					this.searchKey.endTime=data.endTime = endTime && this.$root.formatTime(endTime);
				} else {
					return false;
				}
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				data.isExport = 1;
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
					this.$root.startEditLoading();
					let openr = window.open();

					virtualWithdrawalsList({ params: data },true)
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
			batchExport(index) {
				let data = {
					...this.searchKey,
					startTime: this.$root.formatTimeS(this.Time[0]),
					endTime: this.$root.formatnightTimeS(this.Time[1])
				};
				if (data.content) data.content = this.$root.trimAll(data.content);
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
				virtualWithdrawalsList({ params: data })
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
			},
			changeType(item) {
				this.tabName = item;
				if (item == "取款详情") {
					this.status = true;
					this.nextStatus = false;
				}

				if (item == "打码详情") {
					this.status = false;
					this.nextStatus = true;
					this.getCodeDetial(this.row);
				}
			},
			//选择审核者默认为全部
			onPageChange(page) {
				let params = {
					...this.searchKey,
					limit: this.pageSize,
					siteId: this.$root.nowSite.id
				};
				this.newPage = page;
				this.getData({ params: params, query: { page } });
			},
			//切换数量
			onPageSizeChange(pageSize) {
				let params = {
					...this.searchKey,
					limit: pageSize,
					siteId: this.$root.nowSite.id
				};
				this.getData({ params: params });
				this.pageSize = pageSize;
			},
			//点击状态切换typetag
			changeStatus(val) {
				if (val == "wait") {
					this.searchKey.typeTag = "userName";
				}
			},
			//点击typetag切换状态
			audit(val) {
				if (val == "update_user") {
					this.searchKey.status = "";
				}
				if (val == "userName") {
					this.searchKey.status = "wait";
				}
			},
			//时间刷新
			changeAuto(val) {
				this.changeFresh({ stage: "moneyWithdrawal", val }); //改变时间
				this.autoFreshFun(val);
			},
			//打码详情
			getCodeDetial(row) {
				if (this.count == 0) {
					//count位0需要请求接口
					const { uid } = row;
					const data = {
						siteId: this.$root.nowSite.id,
						uid
					};
					this.$refs.auditModal.spinShow();
					checkBetAmount(data)
						.then(res => {
							if (res != undefined && res.code == 200) {
								this.count = 1; //取值后
								this.codeDetail.data = res.data;
								let code = this.codeDetail.data;
								this.codeNext = code[code.length - 1];
								this.codeBeg = code[code.length - 1];
								this.$refs.auditModal.spinHide();
							} else this.$refs.auditModal.spinHide();
						})
						.then(() => {
							setTimeout(this.scrollToBottom, 0);
							this.count = 0;
						});
				}
			},
			//审核的弹框  详情的弹框
			toggleModal(row, status, stage) {
				this.operateType = stage;
				//flag 为true  就是 成功/失败--详情页面  flase 为待审核--审核详情页面
				this.detailModal = status;
				this.auditType = "pass";
				this.getDetailData(row);
				this.row = row;
			},
			//获取等级id
			levelChange(res) {
			this.searchKey.levelId =String(res.id)	
			},
			//列表
			getData(data) {
				this.table.loading = true;
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}

				if (data.params.content) {
					data.params.content = this.$root.trimAll(data.params.content);
				}

				virtualWithdrawalsList(data)
					.then(res => {
						if (res.data.data) {
							this.table.total = res.data.total;
							let { total, list } = res.data.data;
							this.moneyStatus = res.data.whetherToDisplayAutomaticWithdrawal;
							this.table.data = list;
							this.table.data.forEach(t => this.$set(t, "isLoading", false));
							this.moreData = total;
							this.table.loading = false;
						} else {
							this.table.total = 0;
							this.table.data = [];
							this.table.loading = false;
						}
					})
					.catch(error => {
						this.catchError();
						this.table.loading = false;
					});
			},
			//详情的列表
			getDetailData(row) {
				const { id, time, remark } = row;
				//  拒绝原因
				this.time = time;
				this.showRemark = true;
				this.remark = remark;
				const data = {
					id,
					timestamp: time,
					siteId: this.$root.nowSite.id
				};
				this.dataDetail = "";
				this.changeType("取款详情");
				this.$refs.auditModal.show(remark);
				this.$refs.auditModal.spinShow();

				virtualWithdrawalsDetail(data)
					.then(res => {
						this.dataDetail = res.data;
						this.newActualAmount=this.dataDetail.actualAmount;
						//表格数据
						const { one_day, thirty_day } = res.data.finance_report;
						let arr = [];
						arr.push(one_day, thirty_day);
						this.tableData.data = arr;
						this.$refs.auditModal.spinHide();
					})
					.catch(err => {
						this.$refs.auditModal.spinHide();
					});
			},
			//将最后一栏固定在底部
			scrollToBottom() {
				this.$nextTick(() => {
					var div = document.getElementsByClassName("ivu-table-body")[1];
					div.scrollTop = div.scrollHeight - div.clientHeight;
				});
			},
			modalChange(value, lockData_moneyWithdrawal, stage) {
				let flag = value[0];
				if (!flag && this.count == 0) {
					const { id, time } = lockData_moneyWithdrawal;
					const data = {
						id,
						siteId: this.$root.nowSite.id,
						timestamp: time,
						depositType: "0",
						type: "Withdrawals"
					};
					if (stage == "operate") {
						auditUnlock(data);
						this.setLockData_moneyWithdrawal({});
					}
					this.codeDetail.data = [];
					this.count = 0;
					this.table.data[this.now_index].isLoading = false;
					this.now_index = null;
				}
			},
			//查询
			searchSubmit() {
				let params = { ...this.searchKey };
				params.limit = this.pageSize;
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTime(startTime);
					params.endTime = endTime && this.$root.formatTime(endTime);
				} else {
					return false;
				}

				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				if (params.content) params.content = this.$root.trimAll(params.content);

				if (!this.$root.validateName(params.content)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
					return false;
				}

				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;

				//7天查询时间验证
				if (
					new Date(this.Time[1]).getTime() - new Date(this.Time[0]).getTime() >
						604800000 &&
					!this.searchKey.content
				) {
					this.$Tip.info({ content: "查询大于7天的记录，会员帐号必填" });
					return false;
				}
				// this.$refs.tables.setPage();
				this.getData({ params });
      },
			// 审核-确认提交按钮
			submit() {
				this.count = 1;
				const datatail = {
					id: this.dataDetail.id,
					siteId: this.$root.nowSite.id,
					timestamp: this.time,
					status: this.auditType == "reject" ? "fail" : "success",
					remark: this.auditType == "reject" ? this.rejectmark : "审核通过"
				};

				if (datatail.remark == "") {
					clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						this.$Message.destroy();
						this.$Message.error("请选择拒绝原因");
					}, 200);
					return false;
				}

				virtualWithdrawalsAudit(datatail, true).then(res => {
					if (res != undefined && res.code == 200) {
						this.$refs.auditModal.hide();
						if (this.auditType == "reject") {
							this.$Message.success("取款审核拒绝");
						}
						if (this.auditType == "pass") {
							this.$Message.success("取款审核通过");
						}
					}
					let params = { ...this.searchKey, limit: this.pageSize };
					// params.siteId = this.$root.nowSite.id;
					// if (
					// 	this.searchKey.content === undefined ||
					// 	this.searchKey.content.trim() === ""
					// ) {
					// 	delete this.searchKey.content;
					// }
					if(!this.searchKey.content){
						delete this.searchKey.content;
					}
					let page = this.newPage;
					if (this.table.data.length <= 1) {
						this.searchSubmit();
					} else {
						this.getData({ params, query: { page } });
					}
				});
			},
			// 复制功能--成功
			onCopy: function(e) {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.$Message.destroy();
					this.$Message.success("复制成功");
				}, 200);
			},
			//复制功能--失败
			onError: function(e) {
				this.$Message.destroy();
				this.$Message.error("复制失败");
			},
			//时间刷新功能
			autoFreshFun(val) {
				const data = { ...this.searchKey, siteId: this.$root.nowSite.id };
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				if (val == "0") {
					this.clearTime("moneyWithdrawal");
				} else {
					this.clearTime("moneyWithdrawal");
					this.setTimer({
						stage: "moneyWithdrawal",
						time: setInterval(() => {
							this.searchSubmit();
						}, val * 1000)
					});
				}
			},
			catchError() {
				this.clearTime("moneyWithdrawal");
				this.changeFresh({ stage: "moneyWithdrawal", val: "0" });
			},
			noPayment() {
				this.times++;
				this.disabled = true;
			},
			closeWithdrawal() {
				this.times = 0;
				let params = { ...this.searchKey, limit: this.pageSize };
				if(!this.searchKey.content){
					delete this.searchKey.content;
				}
					let page = this.newPage;
					if (this.table.data.length <= 1) {
					if (this.table.data.length <= 1) {
						this.searchSubmit();
					} else {
						this.getData({ params, query: { page } });
					}
			}
		},
		beforeDestroy() {
			this.changeFresh({ stage: "moneyWithdrawal", val: this.autoFresh });
			this.clearTime("moneyWithdrawal");
		},
		activated() {
			this.autoFreshFun(this.autoFresh);
		},
		deactivated() {
			this.clearTime("moneyWithdrawal");
		}
	}}
</script>


<style lang="less" scoped>
	@import "../../styles/tabs.less";
	@import "../../styles/button.less";
	/deep/.ivu-table-header {
		tr {
			th {
				.ivu-table-cell {
					span {
						font-weight: 549;
						font-size: 1rem;
					}
				}
			}
		}
	}

	/deep/.font {
		background: #000;
	}

	.ivu-table-row:nth-last-child(1) {
		border-top: none;
		background-color: red;
	}

	.box {
		display: flex;
		justify-content: center;

		.detail {
			margin: 0px 0 auto -40px;
			font-size: 1rem;

			p {
				line-height: 2;
				margin-bottom: 10px;
				position: relative;

				> label {
					position: absolute;
					display: inline-block;
					width: 110px;
					text-align: center;
				}

				> span {
					margin-left: 110px;
					display: inline-block;
					width: 260px;
					color: #444;
				}

				> .ivu-btn-small {
					width:60px;
					height:30px;
					background-color: #2d8cf0;
					color: #fff;
					border-color: #2d8cf0;
					padding: 3px 7px;
				}

				/deep/.select {
					margin-left: 110px;
				}

				&:last-child {
					> button {
						// position: relative;
						// margin-left: 65px;
					}
				}
			}
		}
	}

	.lh14 {
		line-height: 14px !important;
	}
	/deep/.ivu-table-overflowX {
		overflow-x: hidden;
	}
	/deep/.flew-row {
		/deep/.font {
			width: 347px;
		}
	}
	/deep/.ivu-modal-content .content .txt .font {
		font-size: 1.25rem;
		width: 347px;
		margin-left: 10px;
		color: #666666;
		word-break: break-all;
	}

	@media (min-width: 1360px) and (max-width: 1600px) {
		/deep/.ivu-tabs-content {
			height: 500px;
			overflow-y: auto;
			overflow-x: hidden;
		}
	}

	/deep/.ivu-btn-small {
		padding: 0px 7px 2px;
	}
	/deep/.ivu-btn.gray {
		background-color: #f6f6f8;
		color: #c5c8ce;
		border-color: #c5c8ce;
	}
		  /deep/.ivu-select-multiple .ivu-tag{
    margin: 4.5px 4px 3px 0;
  }
  /deep/.ivu-tag-text .ivu-select-max-tag{
	  margin-left:-8px;
  }

</style>