<template>
	<div>
		<div class="v2-search clearfix">
			<Form ref="searchKey" inline class="fl">
				<FormItem label="时区">
					<Select v-model="searchKey.timeType" class="s-140">
						<Option value="cn">北京时间</Option>
						<Option value="en">美东时间</Option>
					</Select>
				</FormItem>
				<FormItem label="开始时间">
					<DatePicker placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
				</FormItem>
				<FormItem label="结束时间">
					<DatePicker placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
				</FormItem>
				<!-- <FormItem>
          <Checkbox>模糊</Checkbox>
				</FormItem>-->
				<FormItem label="会员账号">
					<Input
						v-model="searchKey.userName"
						class="s-140"
						placeholder="多个请以,逗号隔开"
						format="yyyy-MM-dd HH:mm:ss"
					/>
				</FormItem>
				<FormItem>
					<Button type="primary" :loading="$root.tableLoading" class="search" @click="searchSubmit">查询</Button>
				</FormItem>
				<FormItem>
					<!-- <a :href="'http://'+ downUrl" target="_blank" ref="toPage"></a> -->
					<Button
						type="primary"
						:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click="exportExcel"
					>导出Excel</Button>
				</FormItem>
			</Form>
			<div class="fr ft18 mt5" style="font-weight:bolder;"  v-if="table.data[0]">
				当前彩票：{{table.data[0].gameName}}
			</div>
		</div>
		<div class="v2-table">
			<Tables
				ref="table"
				:loading="$root.tableLoading"
				:columns="table.columns"
				:total="table.total"
				:value="table.data"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
				@on-sort-change="sortChange"
			></Tables>
		</div>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	import tableMixins from "@/mixins/table";
	import { getlotteryReportDetailData } from "@/api/report";
	export default {
		name: "lotteryReportDetail",
		mixins: [tableMixins],
		components: {
			Tables
		},
		data() {
			return {
				page: 1,
				// downUrl: '',
				searchKey: {
					timeType: "cn",
					startTime: this.$root.startTime(),
					endTime: this.$root.formatnightTimeS()
				},
				// Time: [this.$root.startTime(), this.$root.formatTimeS()],
				Time: [this.$root.newstartTime(), new Date()],
				table: {
					total: 0,
					data: [],
					columns: [
						{
							title: "会员账号",
							key: "userName",
							align: "center",
							render: (h, params) => {
								const { userName } = params.row;
								return (
									<span
										class={{ "blue-font": userName !== "总计" }}
										onClick={() => this.goGameRecordPage(params)}
									>
										{userName}
									</span>
								);
							}
						},
						{
							title: "注单数量",
							key: "betCount",
							align: "center",
							sortable: "custom"
						},
						{
							title: "投注金额",
							key: "validBetAmount",
							align: "center",
							sortable: "custom",
							render: (h, params) => (
								<span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
							)
						},
						{
							title: "有效投注",
							key: "betAmount",
							sortable: "custom",
							align: "center",
							render: (h, params) => (
								<span>{this.$root.keepTwo(params.row.betAmount)}</span>
							)
						},
						// {
						//   title: "中奖金额",
						//   key: "winAmount",
						//   align: "center",
						//   sortable: "custom",
						//   render: (h, params) => <span>{this.$root.keepTwo(params.row.winAmount)}</span>
						// },
						{
							title: "撤单金额",
							key: "cancelBetAmount",
							sortable: "custom",
							align: "center",
							render: (h, params) => (
								<span>{this.$root.keepTwo(params.row.cancelBetAmount)}</span>
							)
						},
						{
							title: "返点金额",
							key: "rebatePointsAmount",
							sortable: "custom",
							align: "center",
							render: (h, params) => (
								<span>{this.$root.keepTwo(params.row.rebatePointsAmount)}</span>
							)
						},
						{
							title: "平台输赢",
							key: "netAmount",
							align: "center",
							sortable: "custom",
							render: (h, params) => {
								let color =
									params.row.netAmount > 0 ? "#FF2626" : "rgb(35, 153, 97)";
								return (
									<span style={{ color }}>
										{this.$root.keepTwo(params.row.netAmount)}
									</span>
								);
							}
						},
						{
							title: "盈率",
							key: "winRate",
							align: "center",
							sortable: "custom",
							render: (h, params) => {
								let color =
									params.row.winRate > 0 ? "#FF2626" : "rgb(35, 153, 97)";
								return <span style={{ color }}>{params.row.winRate}%</span>;
							}
						}
					]
				}
			};
		},
		created() {
			const { startTime, endTime, userName } = this.$route.query;
			this.searchKey = { ...this.searchKey, ...this.$route.query };
			this.Time = [startTime, endTime];
		},
		// watch: {
		//   'searchKey.timeType'(val, oldVal) {
		//     if (val != oldVal && val == 'en') {
		//       this.Time[0] = this.Time[0] && this.$moment(this.Time[0]).format('YYYY-MM-DD 00:00:00')
		//       // this.Time[0] = this.Time[0] && this.$moment(this.Time[0]).subtract(1, 'days').format('YYYY-MM-DD 12:00:00')
		//     }
		//     if (val != oldVal && val == 'cn') {
		//       this.Time[0] = this.Time[0] && this.$moment(this.Time[0]).format('YYYY-MM-DD :59:59')
		//       // this.Time[0] = this.Time[0] && this.$moment(this.Time[0]).add(1, 'days').format('YYYY-MM-DD 11:59:59')
		//     }
		//   }
		// },
		methods: {
			goGameRecordPage(params) {
				const { userName } = params.row;
				let platform = this.$route.query.platform;
				let [startTime, endTime] = this.Time;
				if (this.searchKey.timeType == "cn") {
					startTime = this.$root.formatTimeS(startTime);
					endTime = this.$root.formatnightTimeS(endTime);
				} else {
					startTime = this.$moment(startTime).format("YYYY-MM-DD 12:00:00");
					endTime = this.$moment(endTime)
						.add(1, "days")
						.format("YYYY-MM-DD 11:59:59");
				}
				this.$router.push({
					name: "gameReport",
					query: {
						type: "lottery",
						userName,
						startTime,
						endTime,
						platform,
						gameType: "lottery"
					}
				});
			},
			sortChange({ column, key, order }) {
				delete this.searchKey.sortKey;
				delete this.searchKey.sortVal;
				let data = {
					sortKey: key,
					sortVal: order,
					siteId: this.$root.nowSite.id,
					...this.searchKey
				};
				this.searchKey.sortKey = key;
				if (data.sortVal == "normal") {
					this.table.columns.forEach(item => {
						if (item.key == column.key) this.$set(item, "sortType", "asc");
					});
					this.searchKey.sortVal = "asc";
					data.sortVal = "asc";
				} else {
					this.table.columns.forEach(item => delete item.sortType);
					this.searchKey.sortVal = order;
				}
				this.page == 1 ? "" : this.$refs.table.setPage();
				this.page == 1
					? this.getData({ params: data })
					: this.getData({ params: data, query: { page: 1 } });
			},
			onPageChange(page) {
				this.page = page;
				let params = { ...this.searchKey };
				params.siteId = this.nowSite.id;
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTimeS(startTime);
					params.endTime = endTime && this.$root.formatnightTimeS(endTime);
				} else {
					return false;
				}

				if (!params.startTime || !params.endTime) {
					this.$Tip.info({ content: "请输入开始和结束时间" });
					return false;
				}

				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;
				if (!params.userName) delete params.isLike;

				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				if (params.userName)
					params.userName = this.$root.trimAll(params.userName);
				if (params.isLike) {
					let reg = /^[a-zA-Z0-9-_]{1,}$/;
					if (!reg.test(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				} else {
					if (!this.$root.validateName(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				}
				this.getData({ params, query: { page } });
			},
			onPageSizeChange(pageSize) {
				this.searchKey.limit = pageSize;
				let params = { ...this.searchKey };
				params.siteId = this.nowSite.id;
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTimeS(startTime);
					params.endTime = endTime && this.$root.formatnightTimeS(endTime);
				} else {
					return false;
				}

				if (!params.startTime || !params.endTime) {
					this.$Tip.info({ content: "请输入开始和结束时间" });
					return false;
				}

				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;
				if (!params.userName) delete params.isLike;

				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				if (params.userName)
					params.userName = this.$root.trimAll(params.userName);
				if (params.isLike) {
					let reg = /^[a-zA-Z0-9-_]{1,}$/;
					if (!reg.test(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				} else {
					if (!this.$root.validateName(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				}
				this.getData({ params });
			},
			getData(data) {
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.Time;
					if (dataParams.timeType == "cn") {
						dataParams.startTime = startTime && this.$root.formatTimeS(startTime);
						dataParams.endTime = endTime && this.$root.formatnightTimeS(endTime);
					} else {
						dataParams.startTime = startTime && this.$root.enTimeS(startTime);
						dataParams.endTime = endTime && this.$root.enNightTime(endTime);
					}
				} else {
					return false;
				}
				this.$root.startTableLoading();
				if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
				getlotteryReportDetailData(data).then(res => {
					if (res != undefined && res.code == 200) {
						const { list, total } = res.data.data;
						list.length && list.push(this.createTotalData(total));
						this.table.data = list;
						this.table.total = res.data.total;
					}
					this.$root.endTableLoading();
				}).catch(error=> this.$root.endTableLoading());
			},
			// toDown() {
			//   let e = new MouseEvent('click')
			//   let e1 = e.initEvent('click', {})
			//   this.$refs.toPage.dispatchEvent(e)
			// },
			createTotalData(total) {
				const {
					betUser,
					betCount,
					betAmount,
					validBetAmount,
					netAmount,
					cancelBetAmount,
					rebatePointsAmount,
					winAmount,
					winRate
				} = total;
				let item = {
					userName: "总计",
					betUser,
					betCount,
					betAmount,
					validBetAmount,
					netAmount,
					cancelBetAmount,
					rebatePointsAmount,
					winAmount,
					winRate
				};
				return item;
			},
			searchSubmit() {
				let { sortKey, sortVal } = this.searchKey;
				if (sortKey) delete this.searchKey.sortKey;
				if (sortVal) delete this.searchKey.sortVal;
				this.table.columns.forEach(item => {
					if (item.sortable == "custom") this.$set(item, "sortType", "");
				});
				this.$refs.table.setPage();
				let params = { ...this.searchKey };
				params.siteId = this.nowSite.id;
				const { timeType } = params;
				// if (timeType == 'cn') {
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.Time;
					params.startTime = startTime && this.$root.formatTimeS(startTime);
					params.endTime = endTime && this.$root.formatnightTimeS(endTime);
				} else return false;
				// } else {
				//   if (this.$root.mdValidateTime(this.Time)) {
				//     const [ startTime, endTime ] = this.Time
				//     params.startTime = startTime && this.$root.enTimeS(startTime)
				//     params.endTime = endTime && this.$root.enNightTime(endTime)
				//   } else return false
				// }

				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;
				if (!params.userName) delete params.isLike;

				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				if (params.userName)
					params.userName = this.$root.trimAll(params.userName);
				if (params.isLike) {
					let reg = /^[a-zA-Z0-9-_]{1,}$/;
					if (!reg.test(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				} else {
					if (!this.$root.validateName(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				}

				this.getData({ params });
			},
			exportExcel() {
				let params = { ...this.searchKey };
				params.siteId = this.nowSite.id;
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					params.startTime = startTime && this.$root.formatTimeS(startTime);
					params.endTime = endTime && this.$root.formatnightTimeS(endTime);
				} else {
					return false;
				}

				this.searchKey.startTime = params.startTime;
				this.searchKey.endTime = params.endTime;
				if (!params.userName) delete params.isLike;

				if (!params.startTime || !params.endTime) {
					this.$Tip.info({ content: "请输入开始和结束时间" });
					return false;
				}

				for (let key in params) {
					if (!params[key]) delete params[key];
				}

				if (params.userName)
					params.userName = this.$root.trimAll(params.userName);
				if (params.isLike) {
					let reg = /^[a-zA-Z0-9-_]{1,}$/;
					if (params.userName && !reg.test(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				} else {
					if (params.userName && !this.$root.validateName(params.userName)) {
						this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
						return false;
					}
				}

				params.isExport = 1;
				this.$root.startEditLoading(this);
				let openr = window.open();
				getlotteryReportDetailData({ params }).then(res => {
					if(res!=undefined&&res.data.downloadUrl){
						if(res.code==200){
							let region=res.data.downloadUrl;
							let nowHost = region.split('.com')[1];
                            let openr1 = openr ? openr : window;
                            openr1.location.href = nowHost;
						}else{
							openr.close();
						}
					}
					// if (res.data.downloadUrl) {
					// 	window.open(`http://${res.data.downloadUrl}`);
					// }
				});
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../../styles/button.less";
</style>

