 <template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<FormItem label="刷新" class="ml0">
					<Select class="s-70" :value="autoFresh" @on-change="changeAuto">
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
						mode="多选"
						ref="LevelSelect"
						width="86"
						:levelType="'finance'"
						@on-level-change="levelChange"
					/>
				</FormItem>
				<FormItem label="开始">
					<DatePicker
						type="date"
						placeholder="开始日期"
						:class="[screen<1400?'s-110':'s-120']"
						v-model="Time[0]"
					></DatePicker>
				</FormItem>
				<FormItem label="结束">
					<DatePicker
						type="date"
						placeholder="结束日期"
						:class="[screen<1400?'s-110':'s-120']"
						v-model="Time[1]"
					></DatePicker>
				</FormItem>
				<FormItem label="订单号">
					<Input
						placeholder="订单号"
						v-model="searchKey.code"
						:class="[screen<1960&&screen>1400?'s-110':screen<1400?'s-90':'s-140']"
					/>
				</FormItem>
				<FormItem label="状态" class="pib">
					<Select clearable v-model="searchKey.status" :value="1" placeholder="全部" class="s-86">
						<Option value="success">成功</Option>
						<Option value="fail">失败</Option>
						<Option value="payment">交易中</Option>
					</Select>
				</FormItem>
				<FormItem label="平台">
					<Select
						clearable
					
						v-model="searchKey.paymentId"
						:class="[screen<1400?'s-80':'s-100']"
						placeholder="全部"
						filterable
					>
						<Option v-for="(item,i) in payList" :key="i" :value="item.id">{{item.payName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="方式">
					<Select
						clearable
						v-model="searchKey.typeId"
						:class="[screen>2000?'s-120':'s-90']"
						placeholder="全部"
					>
						<Option v-for="(item,i) in payWay" :key="i" :value="item.id">{{item.className}}</Option>
					</Select>
				</FormItem>
				<FormItem label="客户端" v-if="screen>1600">
					<Select
						clearable
						v-model="searchKey.terminal"
						placeholder="全部"
						:class="[screen>2000?'s-110':'s-66']"
					>
						<Option v-for="(t,i) in platformList" :key="i" :value="t.value">{{t.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="会员账号">
					<Input placeholder="请输入账号" @keyup.enter.native="searchSubmit" v-model="searchKey.userName" class="s-90" />
				</FormItem>
				<FormItem>
					<Button type="primary" class="search" :loading="table.loading" @click.prevent="searchSubmit">查询</Button>
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
				:more="table.more"
				:pageSizeOpts="table.pageSizeOpts"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
			></Tables>
		</div>

		<!-- 提示 -->
		<Modals ref="tip" title="温馨提示" :width="600" :height="180">
			<div slot="content" class="ft22">
				<div style="width:400px;margin:auto;text-align:center">
					<p>{{this.message1}}</p>
					<p>{{this.message2}}</p>
				</div>
				<div class="txt-a mt30">
					<Button class="moneySubmit" @click="()=>{this.$refs.tip.hide()}">确定</Button>
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
		depositOnlineList,
		getpaymentID,
		depositAuditData,
		auditLock,
		auditUnlock
	} from "@/api/finance";
	import { paymentName } from "@/api/common";
	import tableMixins from "@/mixins/table";
	import { mapState, mapActions, mapMutations } from "vuex";
	import { getUserType } from "@/libs/util";
	export default {
		name: "payOnline",
		mixins: [tableMixins],
		components: {
			Tables,
			Modals,
			Icons,
			LevelSelect
		},
		computed: {
			...mapState({
				autoFresh: state => state.info.payOnlineFresh,
				autoFreshTimer: state => state.info.payOnlineTimer,
				dataDetail: state => state.info.lockData_pay
			})
		},
		data() {
			return {
				now_index: null,
				message1: "",
				message2: "",
				tipMessage: "",
				screen: screen.width,
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				clearable: true,
				platformList: [
					{ value: "pc", name: "PC" },
					{ value: "h5", name: "H5" },
					{ value: "ios", name: "IOS" },
					{ value: "android", name: "Android" }
				],
				moreData: {}, // more数据
				searchKey: {},
				Time: [],
				payWay: [],
				payList: [],
				table: {
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					loading: false,
					columns: [
						{
							title: "订单号",
							key: "code",
							align: "center",
							minWidth: screen.width < 1690 ? 150 : 220,
							tooltip: true
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
							title: "支付平台",
							key: "paymentName",
							align: "center",
							minWidth: 100,
							tooltip: true
						},
						{
							title: "支付方式",
							key: "type",
							align: "center",
							minWidth: 75,
							tooltip: true
						},
						{
							title: "货币数量",
							key: "usdt_count",
							align: "center",
							minWidth: 75,
							render: (h, params) => {
								return <span>{this.$root.text(params.row.usdt_count)}</span>;
							}
						},
						{
							title: "存款金额",
							key: "amount",
							align: "center",
							minWidth: 65
						},
						{
							title: "状态",
							key: "status",
							align: "center",
							minWidth: 40,
							render: (h, params) => {
								let color =
									params.row.status === "success"
										? "#36A80C"
										: params.row.status === "fail"
										? "#FF2626"
										: "#0338e4";
								return (
									<span style={{ color }}>
										{params.row.status === "success"
											? "成功"
											: params.row.status === "fail"
											? "失败"
											: "交易中"}
									</span>
								);
							}
						},
						{
							title: "操作",
							align: "center",
							minWidth: 70,
							render: (h, params) => {
								let props = { size: "small", disabled: this.table.data[params.index].isLoading };
								return h("div", [
									h(
										"Button",
										{
											props: props,
											style: {
												color: params.row.flag ? "#000" : "#fff",
                        backgroundColor: params.row.flag ? "#fff" : "#2D8CF0",
                        marginTop:"-3px",
												borderRadius: "6px",
												cursor: "pointer",
												display:
													params.row.status == "payment" &&
													(this.adminType == "super" ||
														this.authInPage.indexOf("forceIncomeShowControl") !=
															-1)
														? "inline-block"
														: "none"
											},
											on: {
												click: () => {
													this.now_index = params.index
													this.table.data[params.index].isLoading = true
													this.setLockData_Pay(params.row)
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
															this.$Tip.confirm({
																content: "您确定要继续入款吗",
																onOk: () => {
																	const { id, time } = params.row;
																	const data = {
																		id,
																		siteId: this.$root.nowSite.id,
																		timestamp: time,
																		depositType: "0",
																		status: "success",
																		paymentBonus: "0"
																	};
																	depositAuditData(data, true).then(res => {
																		this.now_index = null
																		this.table.data[params.index].isLoading = false
																		if (res != undefined && res.code == 200)
																			this.$Message.success({
																				content: "强制入款成功"
																			});
																		this.searchSubmit();
																	});
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
																	this.now_index = null
																	this.table.data[params.index].isLoading = false
																	auditUnlock(data)
																}
															});
														} else {
															this.tipMessage = res.data.message;
															this.message1 = this.tipMessage.split("，")[0];
															this.message2 = this.tipMessage.split("，")[1];
														}
														//弹框提示
														if (res.data.code == 400) {
															this.now_index = null
															this.table.data[params.index].isLoading = false
															this.$refs.tip.show();
														}
													});
												}
											}
										},
										"强制入款"
									),
									h(
										"span",
										{
											style: {
												display:
													params.row.updateUserName == "-" &&
													params.row.status !== "payment"
														? "inline-block"
														: "none"
											}
										},
										"-"
									),
									h(
										"span",
										{
											style: {
												display:
													params.row.updateUserName !== "-"
														? "inline-block"
														: "none"
											}
										},
										"强制入款"
									)
								]);
							}
						},
						{
							title: "提交时间",
							key: "time",
							align: "center",
							minWidth: 150,
							className: "pr5 pl5",
							render: (h, params) => {
								return <span>{this.$root.unixTime(params.row.time)}</span>;
							}
						},
						{
							title: "审核时间",
							key: "updateTime",
							align: "center",
							minWidth: 140,
							className: "pr5 pl5",
							render: (h, params) => {
								if (
									params.row.status == "payment" ||
									params.row.status == "fail"
								) {
									return <span>-</span>;
								}
								if (params.row.status == "success") {
									return (
										<span>{this.$root.unixTime(params.row.updateTime)}</span>
									);
								}
							}
						},
						{
							title: "审核者",
							key: "updateUserName",
							align: "center",
							minWidth: 80,
							tooltip: true
						},
						{
							title: "客户端",
							key: "terminal",
							align: "center",
							minWidth: 50,
							render: (h, params) => {
								return (
									<span>
										{params.row.terminal == "pc"
											? "PC"
											: params.row.terminal == "h5"
											? "H5"
											: params.row.terminal == "ios"
											? "IOS"
											: "Android"}
									</span>
								);
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
						name === "payOnline" && this.$refs.LevelSelect.init(val.id);
					});
				},
				deep: true,
				immediate: true
			}
		},
		created() {
			this.getPaymentName();
			this.getPayWay();
			this.autoFreshFun(this.autoFresh);
			const { type } = window.performance.navigation
			if (type == 1) {
				if (Object.keys(this.dataDetail).length > 0) {
					const { id, time } = this.dataDetail
					const data = {
						id,
						siteId: this.$root.nowSite.id,
						depositType: '0',
						type: 'Deposit',
						timestamp: time
					}
					auditUnlock(data)
					this.setLockData_Pay({})
				}
			}
		},
		beforeDestroy() {
			this.changeFresh({ stage: "payOnline", val: this.autoFresh });
			this.clearTime("payOnline");
		},
		methods: {
			...mapMutations(['setLockData_Pay']),
			...mapActions(["changeFresh", "clearTime", "setTimer"]),
			//时间刷新功能
			changeAuto(val) {
				//触发时间刷新的方法，把应store的值放进去
				this.changeFresh({ stage: "payOnline", val }); //改变时间
				this.autoFreshFun(val);
			},
			//时间刷新
			autoFreshFun(val) {
				const data = { ...this.searchKey, siteId: this.$root.nowSite.id };
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				// this.getData({ params: data });
				if (val == "0") {
					this.clearTime("payOnline");
				} else {
					this.clearTime("payOnline");
					this.setTimer({
						stage: "payOnline",
						time: setInterval(() => {
							this.searchSubmit();
						}, val * 1000)
					});

				}
			},
			//拦截错误
			catchError() {
				this.clearTime("payOnline");
				this.changeFresh({ stage: "payOnline", val: "0" });
			},
			//获取查询栏的支付平台
			getPaymentName() {
				const data = { siteId: this.$root.nowSite.id };
				paymentName(data).then(res => {
					this.payList = res.data;
				});
			},
			//获取支付方式
			getPayWay() {
				const data = { classType: "payment" };
				getpaymentID(data).then(res => {
					this.payWay = res.data;
				});
			},
			//列表数据
			getData(data) {
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}
				//订单号正则
				const reg = /^[0-9a-zA-Z_-]*$/;
				if (dataParams.code !== undefined) {
					if (dataParams.code)
						dataParams.code = dataParams.code.replace(/\s+/g, "");
					if (dataParams.code && !reg.test(dataParams.code)) {
						return false;
					}
				}
				this.table.loading = true
				depositOnlineList(data)
					.then(res => {
						if (res.data.data) {
              const { list, total } = res.data.data;
							this.table.total = res.data.total;
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
					.catch(err => {
						this.catchError();
						this.table.loading = false
					});
			},
			//查询
			searchSubmit() {
				let params = { ...this.searchKey };

				params.siteId = this.nowSite.id;

				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTime(startTime);
					params.endTime = endTime && this.$root.formatTime(endTime);
				} else {
					return false;
				}

				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;

        if(new Date(this.Time[1]).getTime()-new Date(this.Time[0]).getTime()>604800000&&!this.searchKey.userName){
          this.$Tip.info({content:"查询大于7天的记录，会员帐号必填"})
          return false;
        }

				this.$refs.tables.setPage();

				for (let key in params) {
					if (!params[key]) delete params[key];
				}

				if (params.userName)
					params.userName = this.$root.trimAll(params.userName);

				if (!this.$root.validateName(params.userName)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
					return false;
				}

				//订单输入错误的提示
				if (params.code) params.code = params.code.replace(/\s+/g, "");
				const reg = /^[0-9a-zA-Z_-]*$/;

				if (params.code && !reg.test(params.code)) {
					this.$Tip.info({ content: "您所输入的订单号不正确，请重新输入" });
					return false;
				}
				this.getData({ params });
			},
			//等级更改
			levelChange(res) {
				this.searchKey.levelId =String(res.id)	
			}
		},
		activated() {
			this.autoFreshFun(this.autoFresh);
		},
		deactivated() {
			this.clearTime("payOnline");
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	.ml0 {
		margin-left: 0px;
	}
	.mr20 {
		margin-right: 20px;
	}
	.ml0 {
		margin-left: 0px;
	}
	.ml1 {
		margin-left: 20px;
	}
	.mr20 {
		margin-right: 20px;
	}
	.ib {
		.pib {
			margin-left: 20px;
		}
	}
	.mlnull {
		margin-right: 0 !important;
	}
	/deep/.ivu-table-cell-tooltip-content {
		padding: 0 5px 0 5px !important;
  }
   /deep/.ivu-btn-small{
  padding: 0px 7px 1px;
  }
  /deep/.ivu-select-multiple .ivu-tag{
    margin: 4.5px 4px 3px 0;
  }
  /deep/.ivu-tag-text .ivu-select-max-tag{
	  margin-left:-8px;
  }

  
</style>