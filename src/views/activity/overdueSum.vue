<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<FormItem label="开始日期">
					<DatePicker v-model="Time[0]" placeholder="开始日期"></DatePicker>
				</FormItem>
				<FormItem label="结束日期">
					<DatePicker v-model="Time[1]" placeholder="结束日期"></DatePicker>
				</FormItem>
				<FormItem>
					<Select v-model="searchKey.typeTag" class="s-120" @on-change="changeTypetag">
						<Option value="userName">会员账号</Option>
						<Option value="zh_name">姓名</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Input
						v-if="searchKey.typeTag == 'userName'"
						placeholder="多个请以，逗号隔开"
						v-model="searchKey.userName"
					/>
					<Input v-else placeholder="多个请以,逗号隔开" v-model="searchKey.zh_name" />
				</FormItem>
				<FormItem>
					<Button :loading="$root.tableLoading" @click="searchSubmit" type="primary">查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				ref="tables"
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				:pageSizeOpts="table.pageSizeOpts"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
				@on-sort-change="sortChange"
			></Tables>
		</div>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	import { expiredTotal } from "@/api/activity";
	export default {
		name: "overdueSum",
		components: {
			Tables
		},
		data() {
			return {
				searchKey: {
					siteId: this.$root.nowSite.id,
					typeTag: "userName"
				},
				Time: [],
				table: {
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					loading: true,
					columns: [
						{
							title: "会员账号",
							align: "center",
							key: "userName",
							tooltip:true,
							className:"pl5,pr5",
							minWidth:85
						},
						{ title: "姓名", align: "center", key: "zh_name",minWidth:60 },
						{
							title: "借款金额",
							align: "center",
							key: "borrow_amount",
							minWidth:70,
							sortable: "custom",
							render: (h, params) => {
								return <span class="red-font">{params.row.borrow_amount}</span>;
							}
						},
						{
							title: "已还金额",
							align: "center",
							key: "repayment",
							sortable: "custom",
							minWidth:70
						},
						{
							title: "剩余欠款",
							align: "center",
							key: "remainingArrears",
							minWidth:70,
							sortable: "custom",
							render: (h, params) => {
								return (
									<span class="green-font">{params.row.remainingArrears}</span>
								);
							}
						},
						// {
						// 	title: "余额累计还款",
						// 	align: "center",
						// 	key: "yueRepaymentTotal",
						// 	sortable: "custom",
						// 	minWidth:100
						// },
						// {
						// 	title: "金管家累计折扣",
						// 	align: "center",
						// 	key: "jinguanjiaRepaymentTotal",
						// 	sortable: "custom",
						// 	minWidth:110
						// },
						// {
						// 	title: "返水累计折扣",
						// 	align: "center",
						// 	key: "fanshuiRepaymentTotal",
						// 	sortable: "custom",
						// 	minWidth:100
						// },
						{
							title: "借款时间",
							align: "center",
							key: "add_date",
							minWidth:120,
							render: (h, params) => {
								return (
									<span>
										{params.row.add_date == "-"
											? params.row.add_date
											: this.$root.unixTime(params.row.add_date)}
									</span>
								);
							}
						},
						{
							title: "逾期时间",
							align: "center",
							minWidth:120,
							key: "expired_date",
							render: (h, params) => {
								return (
									<span>
										{params.row.expired_date == "-"
											? params.row.expired_date
											: this.$root.unixTime(params.row.expired_date)}
									</span>
								);
							}
						},
						{
							title: "更新时间",
							align: "center",
							key: "add_date",
							minWidth:120,
							render: (h, params) => {
								return (
									<span>
										{params.row.add_date == "-"
											? params.row.add_date
											: this.$root.unixTime(params.row.add_date)}
									</span>
								);
							}
						}
					],
					data: []
				}
			};
		},
		created() {
			let data = {
				...this.searchKey,
				startTime: this.$root.formatTimeX(this.Time[0]),
				endTime: this.$root.formatnightTimeS(this.Time[1])
			};
			this.Time[0] = data.startTime;
			this.Time[1] = data.endTime;
			this.getData({ params: data });
		},
		methods: {
			//切换清空值
			changeTypetag(val) {
				if (val != undefined) {
					this.searchKey.userName = "";
					this.searchKey.zh_name = "";
				}
			},
			sortChange({ column, key, order }) {
				delete this.searchKey.sortName;
				delete this.searchKey.sort;
				if (order == "desc") order = "bigToSmall";
				if (order == "asc") order = "smallToBig";
				let data = {
					...this.searchKey,
					startTime: this.$root.formatTimeX(this.Time[0]),
					endTime: this.$root.formatnightTimeS(this.Time[1]),
					sortName: key,
					sort: order
				};
				this.searchKey.sortName = key;
				if (data.sort == "normal") {
					this.table.columns.forEach(item => {
						if (item.key == column.key) this.$set(item, "sortType", "asc");
						this.searchKey.sort = "smallToBig";
						data.sort = "smallToBig";
					});
				} else {
					this.searchKey.sort = order;
					this.table.columns.forEach(item => {
						delete item.sortType;
					});
				}
				this.getData({ params: data });
			},
			searchSubmit() {
				let params = { ...this.searchKey };
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTimeX(startTime);
					params.endTime = endTime && this.$root.formatnightTimeS(endTime);
				} else {
					return false;
				}
				const { startTime, endTime } = params;
				if (startTime == "" || endTime == "") {
					this.$Tip.info({ content: "请输入开始时间和结束时间!" });
					return false;
				}
				if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
					this.$Tip.info({ content: "结束时间必须大于开始时间！" });
					return false;
				}

				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;
				for (let key in params) {
					if (!params[key]) delete params[key];
				}

				if (params.userName || params.userName == "")
					params.userName = this.$root.trimAll(params.userName);
				if (params.zh_name || params.zh_name == "")
					params.zh_name = this.$root.trimAll(params.zh_name);

				if (!this.$root.validateName(params.userName)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
					return false;
				}
				if (params.zh_name && params.zh_name.length < 2) {
					this.$Tip.info({ content: "姓名最小少于2个字符！" });
					return false;
				}
				if (params.typeTag == "zh_name") {
					if (params.userName) delete params.userName;
					if (params.zh_name) params.zh_name = this.$root.trimAll(params.zh_name);
				}
				if (params.typeTag == "userName") {
					if (params.zh_name) delete params.zh_name;
					if (params.userName)
						params.userName = this.$root.trimAll(params.userName);
				}
				delete params.typeTag;
				this.$refs.tables.setPage();
				this.getData({ params: params });
			},
			getData(data) {
				this.$root.startTableLoading();
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}
				expiredTotal(data).then(res => {
					if (res.code == 200 && res.code != undefined) {
						const { data, total } = res.data;
						this.table.data = data;
						this.table.total = total;
						this.$root.endTableLoading();
					}
				}).catch(error => this.$root.endEditLoading());
			},
			onPageSizeChange(pageSize) {
				let params = {
					...this.searchKey,
					limit: pageSize
				};
				if (params.userName)
					params.userName = this.$root.trimAll(params.userName);
				if (params.zh_name) params.zh_name = this.$root.trimAll(params.zh_name);
				this.pageSize = pageSize;
				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				this.getData({ params });
			},
			onPageChange(page) {
				let params = { ...this.searchKey, limit: this.pageSize };
				if (params.userName)
					params.userName = this.$root.trimAll(params.userName);
				if (params.zh_name) params.zh_name = this.$root.trimAll(params.zh_name);
				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				this.getData({ params, query: { page } });
			}
		}
	};
</script>