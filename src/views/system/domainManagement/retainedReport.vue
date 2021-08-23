<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<FormItem label="开始日期">
					<DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
				</FormItem>
				<FormItem label="结束日期">
					<DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
				</FormItem>
				<FormItem>
					<Button type="primary" :loading="$root.tableLoading" class="search" @click="searchSubmit">查询</Button>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click.prevent="exportExcel"
					>导出Excel</Button>
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
	import { getKeepReports } from "@/api/system";
	import { Tooltip } from "view-design";
	export default {
		name: "retainedReport",
		mixins: [tableMixins],
		components: { Tables },
		data() {
			return {
				page: 1,
				searchKey: {
					startTime: this.$root.startTime(),
					endTime: this.$root.formatnightTimeS()
				},
				Time: [this.$root.startTime(), this.$root.formatnightTimeS()],
				table: {
					total: 0,
					columns: [
						{
							title: "时间",
							key: "data_date",
							align: "center",
							minWidth: 95,
							render: (h, params) => (
								<span>{this.$root.formatTimeS(params.row.data_date * 1000)}</span>
							)
						},
						{
							title: "基准数据",
							key: "depositnum",
							align: "center",
							minWidth: 95
						},
						{
							title: "次日留存",
							key: "twonum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.twonum == 0 ? "none" : "block";
								return (
									<div class="flex-colum" style={{ display }}>
										<div class="bb mt2">{params.row.twonum}</div>
										<div>{params.row.twonumBet}</div>
									</div>
								);
							}
						},
						{
							title: "3日留存",
							key: "threenum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.threenum == 0 ? "none" : "block";
								return (
									<div class="flex-colum" style={{ display }}>
										<div class="bb mt2">{params.row.threenum}</div>
										<div>{params.row.threenumBet}</div>
									</div>
								);
							}
						},
						{
							title: "4日留存",
							key: "fournum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.fournum == 0 ? "none" : "block";
								return (
									<div class="flex-colum" style={{ display }}>
										<div class="bb mt2">{params.row.fournum}</div>
										<div>{params.row.fournumBet}</div>
									</div>
								);
							}
						},
						{
							title: "5日留存",
							key: "fivenum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.fivenum == 0 ? "none" : "block";
								return (
									<div class="flex-colum" style={{ display }}>
										<div class="bb mt2">{params.row.fivenum}</div>
										<div>{params.row.fivenumBet}</div>
									</div>
								);
							}
						},
						{
							title: "6日留存",
							key: "sixnum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.sixnum == 0 ? "none" : "block";
								return (
									<div class="flex-colum" style={{ display }}>
										<div class="bb mt2">{params.row.sixnum}</div>
										<div>{params.row.sixnumBet}</div>
									</div>
								);
							}
						},
						{
							title: "7日留存",
							key: "sevennum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.sevennum == 0 ? "none" : "block";
								return (
									<div class="flex-colum" style={{ display }}>
										<div class="bb mt2">{params.row.sevennum}</div>
										<div>{params.row.sevennumBet}</div>
									</div>
								);
							}
						},
						{
							title: "15日留存",
							key: "onefivenum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.onefivenum == 0 ? "none" : "block";
								return (
									<div class="flex-colum" style={{ display }}>
										<div class="bb mt2">{params.row.onefivenum}</div>
										<div>{params.row.onefivenumBet}</div>
									</div>
								);
							}
						},
						{
							title: "30日留存",
							key: "threezeronum",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								let display = params.row.threezeronum == 0 ? "none" : "block";
								let month = this.$root
									.formatTimeS(params.row.data_date * 1000)
									.split(" ")[0]
									.split("-");
								return (
									<Tooltip transfer style={{ display }}>
										<div slot="content">
											<p>
												在{month[1]}月{month[2]}日统计的基准行为
											</p>
											<p>
												用户{params.row.depositnum}人中，有
												{params.row.threezeronum}人在第二天
											</p>
											<p>内进行过登录行为事件</p>
										</div>
										<div class="flex-colum">
											<div class="mt2">{params.row.threezeronum}</div>
											<div>{params.row.threezeronumBet}</div>
										</div>
									</Tooltip>
								);
							}
						}
					],
					data: []
				}
			};
		},
		methods: {
			searchSubmit() {
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
					this.$Tip.info({ content: "请输入开始和结束时间！" });
					return false;
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
				if (!params.startTime || !params.endTime) {
					this.$Tip.info({ content: "请输入开始和结束时间！" });
					return false;
				}
				params.isExport = 1;
				this.$root.startEditLoading();
				let openr = window.open();
				getKeepReports({ params })
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
			getData(data) {
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}
				this.$root.startTableLoading();
				getKeepReports(data)
					.then(res => {
						if (res != undefined && res.code == 200) {
							let datalist = res.data.data;
							if (datalist.length > 0) {
								datalist.forEach(num => {
									let {
										depositnum,
										twonum,
										threenum,
										fournum,
										fivenum,
										sixnum,
										sevennum,
										onefivenum,
										threezeronum
									} = num;
									num.twonumBet = this.GetPercent(twonum, depositnum);
									num.threenumBet = this.GetPercent(threenum, depositnum);
									num.fournumBet = this.GetPercent(fournum, depositnum);
									num.fivenumBet = this.GetPercent(fivenum, depositnum);
									num.sixnumBet = this.GetPercent(sixnum, depositnum);
									num.sevennumBet = this.GetPercent(sevennum, depositnum);
									num.onefivenumBet = this.GetPercent(onefivenum, depositnum);
									num.threezeronumBet = this.GetPercent(threezeronum, depositnum);
								});
								this.table.data = datalist;
							} else {
								this.table.data = [];
							}
							this.table.total = res.data.total;
						}
						this.$root.endTableLoading();
					})
					.catch(error => this.$root.endTableLoading());
			},
			GetPercent(num, total) {
				num = parseFloat(num);
				total = parseFloat(total);
				if (isNaN(num) || isNaN(total)) {
					return "-";
				}
				return total <= 0
					? "0%"
					: Math.round((num / total) * 10000) / 100.0 + "%";
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
					this.$Tip.info({ content: "请输入开始和结束时间！" });
					return false;
				}

				if (!params.content) delete params.isLike;

				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				if (params.content) params.content = this.$root.trimAll(params.content);
				if (params.content && !this.$root.validateName(params.content)) {
					this.$Tip.info({
						content: `您所查询的${
							params.typeTag == "userName" ? "会员" : "代理"
						}账号不正确，请重新输入`
					});
					return false;
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
					this.$Tip.info({ content: "请输入开始和结束时间！" });
					return false;
				}
				for (let key in params) {
					if (!params[key]) delete params[key];
				}
				this.getData({ params });
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../../styles/button.less";
</style>
