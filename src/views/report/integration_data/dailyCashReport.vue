<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<FormItem  label="站点名称">
          <Select
           v-if="accessSite.length>1"
          	class="w100x"
						v-model="searchKey.siteId"
					>
						<Option v-for="(t, i) in accessSite" :key="i" :value="t.id">{{
							t.siteName
						}}</Option>
					</Select>
				</FormItem>
				<FormItem label="分组"  v-show="this.$root.groupLenth()&&this.$root.groupLenth()>1" >
						<GroupSelect
						class="aaa"
						placeholder="全部"
						ref="GroupSelect"
						
						clearable
						width="86"
						:levelType="'group'"
						@on-level-change="groupChange"
					/>
				</FormItem>
				<FormItem v-for="(t, i) in btnList" :key="i">
					<Button
						class="fontColor"
						:class="btnName == t ? 'bd-bg' : 'bg-or'"
						@click="changeBtn(t)"
					>
						<span>{{ t }}</span>
					</Button>
				</FormItem>
				<FormItem label="开始日期">
					<DatePicker
						placeholder="开始日期"
						@on-change="startChange"
						class="s-120"
						type="date"
						v-model="Time[0]"
					></DatePicker>
				</FormItem>
				<FormItem label="结束日期">
					<DatePicker
						placeholder="结束日期"
						type="date"
						@on-change="startChange"
						class="s-120"
						v-model="Time[1]"
					></DatePicker>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						:loading="$root.tableLoading"
						class="ivu-btn search"
						@click.prevent="searchSubmit"
						>查询</Button
					>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click.prevent="exportExcel"
						>导出Excel</Button
					>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				ref="table"
				:loading="$root.tableLoading"
				:columns="table.columns"
				:value="table.data"
				:total="table.total"
				:showSizer="false"
				:page-size-opts="table.pageSizeOpts"
				@on-sort-change="sortChange"
				@on-page-change="onPageChange"
			></Tables>
		</div>
	</div>
</template>
<script>
	import Icons from "@/components/icons";
	import { dayReport, dayReportByDepositType } from "@/api/report";
	import { checkDayBtn } from "@/libs/util";
	import Tables from "_c/tables";
	import GroupSelect from "@/components/group-select";
	import { Tooltip } from "view-design";
  import { mapState } from "vuex";
	export default {
		name: "dailyCashReport",
		components: { Tables, Icons ,GroupSelect,},
		data() {
			return {
				lhcList: "",
				screen: screen.width,
				page: 1,
				btnList: ["本月", "上月"],
				btnName: "本月",
				Time: [this.$root.startTime(1), this.$root.endTime(1)],
				list: [],
				depositedData: [],
				depositedTotal: [],
				isSpin: true,
				searchKey: {
					siteId: this.$root.nowSite.id,
					limit: 40,
				},
				table: {
					loading: true,
					data: [],
					pageSizeOpts: [40],
					total: 0,
					columns: [
						{
							title: "日期",
							align: "center",
							key: "data_date",
							minWidth: 110,
							render: (h, params) => {
								let lhcListSum = this.lhcList.filter(function (
									element,
									index,
									self
								) {
									return self.indexOf(element) === index;
								});
								let count = [];
								const { data_date } = params.row;
								lhcListSum.forEach((t) => {
									if (t == this.$moment.unix(data_date).format("YYYY-MM-DD")) {
										count.push(t);
									}
								});
								if (data_date == "总计") {
									return <span>{data_date}</span>;
								} else {
									return (
										<div style="margin:auto;position:relative;" class="clerafix">
											<span class="ib">
												{this.$moment.unix(data_date).format("YYYY-MM-DD")}
											</span>
											<span
												style={{
													display:
														count ==
														this.$moment.unix(data_date).format("YYYY-MM-DD")
															? "inline-block"
															: "none",
												}}
											>
												<Icons
													type="liuhey"
													style="padding-left:6px;position: absolute;top:-7px;right:0;"
													color="#FF8049"
													size="36"
												></Icons>
											</span>
										</div>
									);
								}
							},
						},
						{
							title: "新增存款",
							align: "center",
							key: "",
							minWidth: 60,
							children: [
								{
									title: "注册",
									align: "center",
									key: "registerUserCount",
									minWidth: 60,
								},
								{
									title: "金额",
									align: "center",
									key: "depositNewAmount",
									sortable: "custom",
									minWidth: 110,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.depositNewAmount}</span>;
										else
											return (
												<span>{Math.floor(params.row.depositNewAmount)}</span>
											);
									},
								},
								{
									title: "人数",
									align: "center",
									key: "depositNewUserCount",
									minWidth: 60,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.newDepositUserCount}</span>;
										else return <span>{params.row.depositNewUserCount}</span>;
									},
								},
							],
						},
						{
							title: "新增首存",
							align: "center",
							key: "",
							minWidth: 100,
							children: [
								{
									title: "金额",
									align: "center",
									key: "firstDepositAmount",
									sortable: "custom",
									minWidth: 110,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return (
												<span>{Math.floor(params.row.firstDepositAmount)}</span>
											);
										else
											return (
												<span>{Math.floor(params.row.firstDepositAmount)}</span>
											);
									},
								},
								{
									title: "人数",
									align: "center",
									key: "firstDepositUserCount",
									minWidth: 60,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.firstDepositUserCount}</span>;
										else return <span>{params.row.firstDepositUserCount}</span>;
									},
								},
							],
						},
						// {
						// 	title: "代理佣金",
						// 	align: "center",
						// 	key: "agencyBonusAmount",
						// 	sortable: "custom",
						// 	minWidth: 80,
						// 	render: (h, params) => {
						// 		const { data_date } = params.row;
						// 		if (data_date == "总计")
						// 			return <span>{Math.floor(params.row.agencyBonusAmount)}</span>;
						// 		else return <span>{Math.floor(params.row.agencyBonusAmount)}</span>;
						// 	}
						// },
						// {
						// 	title: "佣金人数",
						// 	align: "center",
						// 	key: "agencyBonusUserCount",
						// 	minWidth: 60,
						// 	render: (h, params) => {
						// 		const { data_date } = params.row;
						// 		if (data_date == "总计")
						// 			return <span>{Math.floor(params.row.agencyBonusUserCount)}</span>;
						// 		else return <span>{Math.floor(params.row.agencyBonusUserCount)}</span>;
						// 	}
						// },
						{
							title: "优惠金额",
							align: "center",
							key: "",
							minWidth: 100,
							children: [
								{
									title: "金额",
									align: "center",
									key: "memberBonusAmount",
									sortable: "custom",
									minWidth: 120,
								},
								{
									title: "人数",
									align: "center",
									key: "memberBonusCount",
									minWidth: 60,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.memberBonusUserCount}</span>;
										else return <span>{params.row.memberBonusCount}</span>;
									},
								},
							],
						},
						{
							title: "有效投注",
							align: "center",
							key: "",
							// minWidth: 100,
							children: [
								{
									title: "金额",
									align: "center",
									key: "validBetAmount",
									sortable: "custom",
									minWidth: 110,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{Math.floor(params.row.validBetAmount)}</span>;
										else
											return <span>{Math.floor(params.row.validBetAmount)}</span>;
									},
								},
								{
									title: "人数",
									align: "center",
									key: "betUserCount",
									minWidth: 60,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.betUserCount}</span>;
										else return <span>{params.row.betUserCount}</span>;
									},
								},
								{
									title: "倍数",
									align: "center",
									key: "betMultiple",
									minWidth: 60,
									render: (h, params) => {
										const { betMultiple, data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.betMultiple}</span>;
										else return <span>{params.row.betMultiple}</span>;
									},
								},
							],
						},
						{
							title: "存款金额",
							align: "center",
							key: "",
							minWidth: 100,
							children: [
								{
									title: "金额",
									align: "center",
									key: "depositAmount",
									sortable: "custom",
									minWidth: 110,
									render: (h, params) => {
										let {
											depositAmount,
											depositCount,
											depositUserCount,
											data_date,
										} = params.row;
										// console.log(depositAmount)
										if (depositAmount == 0) {
											return (
												<span>{depositAmount == 0 ? "-" : depositAmount}</span>
											);
										} else {
											return (
												<div>
													<Poptip
														trigger="hover"
														placement="right"
														width="440"
														popper-class="top-wrap"
														transfer
													>
														<span
															class={{ cs: data_date != "总计" }}
															class="red-font cs"
															onMouseenter={(e) => {
																// console.log(params.row.data_date)
																if (params.row.data_date == "总计") {
																	return false;
																} else {
																	this.depositedSum(params, "depositAmount");
																}
															}}
														>
															{depositAmount}
														</span>
														<div
															class="tip-box"
															slot="content"
															style={{
																display:
																	params.row.data_date == "总计" ||
																	this.list.length == 0
																		? "none"
																		: "block",
															}}
														>
															<div class="title">
																<span style="width:25%">存款类型</span>
																<span style="width:25%">存款金额</span>
																<span style="width:25%">人数</span>
																<span style="width:25%">笔数</span>
															</div>
															<ul>
																{this.list.map((item) => (
																	<li>
																		<span style="width:25%">
																			{item.depositClassName}
																		</span>
																		<span style="width:25%">
																			{Number(item.depositAmount).toFixed(2)}
																		</span>
																		<span style="width:25%">
																			{item.depositUserCount}
																		</span>
																		<span style="width:25%">
																			{item.depositCount}
																		</span>
																	</li>
																))}
															</ul>
															<div
																class="footer"
																style={{
																	display:
																		this.depositedTotal == 0 ||
																		this.list.length == 0
																			? "none"
																			: "block",
																}}
															>
																<span style="width:25%">
																	{this.depositedTotal.depositClassName}{" "}
																</span>
																<span style="width:25%">
																	{this.depositedTotal.depositAmount}
																</span>
																<span style="width:25%">
																	{this.depositedTotal.depositUserCount}
																</span>
																<span style="width:25%">
																	{this.depositedTotal.depositCount}
																</span>
															</div>
															<Spin
																fix
																size="small"
																style={{
																	display: this.isSpin ? "block" : "none",
																}}
															></Spin>
														</div>
													</Poptip>
												</div>
											);
										}
									},
								},
								{
									title: "人数",
									align: "center",
									key: "depositUserCount",
									minWidth: 60,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.depositUserCount}</span>;
										else {
											return <span>{params.row.depositUserCount}</span>;
										}
									},
								},
							],
						},
						{
							title: "取款金额",
							align: "center",
							key: "",
							minWidth: 100,
							children: [
								{
									title: "金额",
									align: "center",
									key: "withdrawalsAmount",
									sortable: "custom",
									minWidth: 110,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return (
												<span>{Math.floor(params.row.withdrawalsAmount)}</span>
											);
										else
											return (
												<span>{Math.floor(params.row.withdrawalsAmount)}</span>
											);
									},
								},
								{
									title: "人数",
									align: "center",
									key: "withdrawalsUserCount",
									minWidth: 60,
									render: (h, params) => {
										const { data_date } = params.row;
										if (data_date == "总计")
											return <span>{params.row.withdrawalUserCount}</span>;
										else return <span>{params.row.withdrawalsUserCount}</span>;
									},
								},
							],
						},
						{
							title: "损益报表",
							align: "center",
							key: "",
							minWidth: 100,
							children: [
								{
									title: "网站盈利",
									key: "memberReport",
									align: "center",
									sortable: "custom",
									minWidth: 110,
									render: (h, params) => {
										//let color = params.row.memberReport > 0 ? ' #FF2626 ' : 'rgb(35, 153, 97)';
										return <span>{params.row.memberReport}</span>;
									},
								},
								{
									title: "现金利润",
									align: "center",
									key: "moneyReport",
									sortable: "custom",
									minWidth: 110,
									render: (h, params) => {
										let lhcListSum = this.lhcList.filter(function (
											element,
											index,
											self
										) {
											return self.indexOf(element) === index;
										});
										let color =
											params.row.moneyReport > 0
												? "#FF2626 "
												: "rgb(35, 153, 97)";
										let count = [];
										const { data_date } = params.row;
										lhcListSum.forEach((t) => {
											if (
												t == this.$moment.unix(data_date).format("YYYY-MM-DD")
											) {
												count.push(t);
											}
										});
										return (
											<div>
												<div style="display:inline-block;" style={{ color }}>
													{Math.floor(params.row.moneyReport)}
												</div>
											</div>
										);
									},
								},
								{
									title: "占比",
									align: "center",
									key: "cashRatio",
									sortable: "custom",
									minWidth: 60,
									render: (h, params) => {
										const { data_date, cashRatio } = params.row;
										if (cashRatio) {
											let newCashRatio = cashRatio.split("%")[0];
											let color = newCashRatio > 0 ? "" : "rgb(35, 153, 97)";
											if (data_date == "总计")
												return <span style={{ color }}>{cashRatio}</span>;
											else return <span style={{ color }}>{cashRatio}</span>;
										}
									},
								},
							],
						},
					],
				},
			};
		},
		computed: {
			...mapState({
				accessSite: (state) => state.user.accessSite,
			}),
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm=>{
        const {newStartTime, newEndTime,newId,newBtName}=vm.$route.params;
		vm.$refs.GroupSelect.init(vm.$root.nowSite.id);  
		
        if(newStartTime==undefined|| newEndTime==undefined||newId==undefined){
          //刷新
            vm.changeBtn("本月");
            vm.btnName='本月';
        }else{
          vm.$nextTick(()=>{
            vm.searchKey.siteId=vm.$route.params.newId;
            vm.btnName=vm.$route.params.newBtName;
          })
           vm.changeBtn("跳转");

        }
      })
    },
		methods: {
			depositedSum(params, type) {

				this.isSpin = true;
				let data = {
					siteId: this.$root.nowSite.id,
					startTime: this.$root.unixTime(params.row.data_date),
					endTime: this.$root.unixTime(params.row.data_date),
				};
				data.startTime = this.$root.formatTimeS(data.startTime);
				data.endTime = this.$root.formatnightTimeS(data.endTime);
				dayReportByDepositType(data).then((res) => {
					if (res != undefined && res.code == 200) {
						this.isSpin = false;
						// this.list=res.data;

						// this.depositedData=res.data;

						const { total, list } = res.data;
						this.list = list;
						this.depositedTotal = total;
					}
				});
			},
				groupChange(res){
                this.searchKey.group_id = res.group_id;
			},
			startChange(time, type) {
				this.btnName = checkDayBtn(this.Time, "cn", this);
			},
			changeBtn(name) {
				console.log(name);
        if (this.page != 1) this.$refs.table.setPage();
        this.btnName = name;


				this.searchKey.startTime =
					name == "本月"
						? this.$root.monthDayStartTime()
						: name == "上月"
						? this.$root.lastMonthDayStartTime()
						: this.$route.params.newStartTime;
				this.searchKey.endTime =
					name == "本月"
						? this.$root.monthDayEndTime()
						: name == "上月"
						? this.$root.lastMonthDayEndTime()
						: this.$route.params.newEndTime;
				this.searchKey.siteId =
					name == "跳转" ? this.$route.params.newId : this.searchKey.siteId;
				if (this.searchKey.sortKey) delete this.searchKey.sortKey;
				if (this.searchKey.sortVal) delete this.searchKey.sortVal;
				this.table.columns.forEach((item) => {
					if (item.sortable == "normal") this.$set(item, "sortType", "");
				});
				this.Time[0] = this.searchKey.startTime;
        this.Time[1] = this.searchKey.endTime;

        let data={...this.searchKey};
				this.getData({ params:data });
			},
			getData(data) {
				this.$root.startTableLoading();
				dayReport(data)
					.then((res) => {
						if (res.data.data) {
							const { list, total, lhc } = res.data.data;
							this.lhcList = lhc;
							list.length && list.push(this.createTotalData(total));
							this.table.data = list;
							this.table.total = res.data.total;
						} else {
							this.tabla.data = [];
							this.table.total = 0;
						}
						this.$root.endTableLoading();
					})
					.catch((error) => this.$root.endTableLoading());
			},
			exportExcel() {
				let data = {
					...this.searchKey,
					startTime: this.$root.formatTimeS(this.Time[0]),
					endTime: this.$root.formatnightTimeS(this.Time[1]),
				};
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				let { startTime, endTime } = data;
				if (startTime == "Invalid date" || endTime == "Invalid date") {
					this.$Tip.info({ content: "请输入开始和结束时间！" });
					return false;
				}
				if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
					this.$Tip.info({ content: "结束时间必须大于开始时间" });
					return false;
				}
				this.searchKey.startTime = data.startTime;
				this.searchKey.endTime = data.endTime;
				data.isExport = 1;
				this.$root.startEditLoading();
				let openr = window.open();
				dayReport({ params: data })
					.then((res) => {
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
					.catch((error) => this.$root.endEditLoading());
			},
			createTotalData(total) {
				const {
					registerUserCount,
					firstDepositUserCount,
					betUserCount,
					giftBonusUserCount,
					agencyBonusUserCount,
					refandAmountUserCount,
					betCount,
					validBetAmount,
					betMultiple,
					refandAmount,
					giftBonusAmount,
					agencyBonusAmount,
					memberReport,
					depositNewAmount,
					depositAmountOnline,
					firstDepositAmount,
					newDepositUserCount,
					memberBonusUserCount,
					depositCountOnline,
					withdrawalUserCount,
					depositAmountOffline,
					depositCountOffline,
					depositAmount,
					depositCount,
					withdrawalsAmount,
					cashRatio,
					withdrawalsCount,
					moneyReport,
					moneyReportRate,
					depositUserOnline,
					depositUserOffline,
					depositUserCount,
					withdrawalsUserCount,
					memberBonusAmount,
				} = total;
				let item = {
					data_date: "总计",
					registerUserCount,
					agencyBonusUserCount,
					betCount,
					validBetAmount,
					refandAmount,
					giftBonusAmount,
					agencyBonusAmount,
					memberReport,
					depositNewAmount,
					firstDepositUserCount,
					firstDepositAmount,
					newDepositUserCount,
					memberBonusUserCount,
					depositUserCount,
					depositCountOnline,
					betUserCount,
					betMultiple,
					withdrawalUserCount,
					depositAmountOnline,
					depositCountOffline,
					depositAmountOffline,
					depositCount,
					depositAmount,
					withdrawalsCount,
					withdrawalsAmount,
					cashRatio,
					moneyReport,
					moneyReportRate,
					memberBonusAmount,
				};
				return item;
			},
			searchSubmit() {
				if (this.page != 1) this.$refs.table.setPage();
				let { sortKey, sortVal } = this.searchKey;
				if (sortKey) delete this.searchKey.sortKey;
				if (sortVal) delete this.searchKey.sortVal;
				this.table.columns.forEach((item) => {
					if (item.sortable == "normal") this.$set(item, "sortType", "");
				});
				let data = {
					...this.searchKey,
					startTime: this.$root.formatTimeS(this.Time[0]),
					endTime: this.$root.formatnightTimeS(this.Time[1]),
				};
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				let { startTime, endTime } = data;
				if (startTime == "Invalid date" || endTime == "Invalid date") {
					this.$Tip.info({ content: "请输入开始和结束时间！" });
					return false;
				}
				if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
					this.$Tip.info({ content: "结束时间必须大于开始时间" });
					return false;
				}
				this.searchKey.startTime = data.startTime;
				this.searchKey.endTime = data.endTime;
				this.getData({ params: data });
			},
			sortChange({ column, key, order }) {
				delete this.searchKey.sortKey;
				delete this.searchKey.sortVal;
				let data = {
					sortKey: key,
					sortVal: order,
					...this.searchKey,
				};
				this.searchKey.sortKey = key;
				if (data.sortVal == "normal") {
					this.table.columns.forEach((item) => {
						if (item.key == column.key) this.$set(item, "sortType", "asc");
					});
					this.searchKey.sortVal = "asc";
					data.sortVal = "asc";
				} else {
					this.table.columns.forEach((item) => delete item.sortType);
					this.searchKey.sortVal = order;
				}
				this.page == 1 ? "" : this.$refs.table.setPage();
				this.page == 1
					? this.getData({ params: data })
					: this.getData({ params: data, query: { page: 1 } });
			},
			onPageChange(page) {
				this.page = page;
				this.getData({ params: this.searchKey, query: { page } });
			},
		},
	};
</script>
<style lang="less" scoped>
	@import "../../../styles/button.less";
	/deep/.ivu-table-column-center {
		height: 48px;
		line-height: 48px;
	}
	@media screen and (min-width: 960px) and (max-width: 1460px) {
		/deep/.ivu-table-header thead tr:nth-child(1) th {
			height: 37px !important;
			line-height: 37px !important;
			padding: 0;
			.ivu-table-cell span {
				font-size: 1rem;
			}
		}
		/deep/.ivu-table-header thead tr:nth-child(2) th {
			height: 37px !important;
			line-height: 37px !important;
			padding: 0;
			.ivu-table-cell span {
				font-size: 0.9375rem;
			}
		}
	}
	@media screen and (min-width: 1660px) and (max-width: 2000px) {
		/deep/.ivu-table-header thead tr:nth-child(1) th {
			height: 37px !important;
			line-height: 37px !important;
			padding: 0;
			.ivu-table-cell span {
				font-size: 1rem;
			}
		}
		/deep/.ivu-table-header thead tr:nth-child(2) th {
			height: 37px !important;
			line-height: 37px !important;
			padding: 0;
			.ivu-table-cell span {
				font-size: 0.9375rem;
			}
		}
		/deep/.ivu-table-tbody {
			tr {
				td {
					.ivu-table-cell {
						font-size: 0.8rem !important;
						color: #444 !important;
						height: 44px !important;
						line-height: 44px !important;
					}
				}
			}
		}
	}

	// /deep/.ivu-table-cell {
	//     line-height: 44px !important;
	//     height: 44px !important;
	// }
	.bd-bg {
		height: 36px;
		background-color: #2d8cf0;
		color: #ffffff;
		box-shadow: 0;
		&:focus {
			box-shadow: 0 0 0 0;
		}
	}
	.bg-or {
		height: 36px;
		border: 1px solid #eaeaea;
		&:focus {
			box-shadow: 0 0 0 0;
		}
		&:hover {
			background: #f4f9ff;
			border: 1px solid #2d8cf0;
			color: #2d8cf0;
		}
	}
	.lhcColor {
		width: 10px;
		height: 10px;
		background: pink;
	}
	/deep/.ivu-badge-count {
		margin-top: -12px;
	}
	.demo-badge {
		width: 42px;
		height: 42px;
		background: #eee;
		border-radius: 6px;
		display: inline-block;
	}

	.test5 {
		height: 0;
		width: 0;
		overflow: hidden;
		font-size: 0;
		line-height: 0;
		border-color: #ff9600 #3366ff transparent transparent;
		border-style: solid solid dashed dashed;
		border-width: 40px 40px 0 0;
	}
</style>

