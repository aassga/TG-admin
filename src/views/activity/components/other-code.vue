<template>
	<Tables
		:loading="$root.tableLoading"
		:total="table.total"
		:value="table.data"
		:columns="table.columns"
		:pageSizeOpts="table.pageSizeOpts"
		@on-page-change="onPageChange"
		@on-page-size-change="onPageSizeChange"
	></Tables>
</template>
<script>
	import Tables from "_c/tables";
	import Icons from "_c/icons";
	import { jinGuanJiaShow } from "@/api/activity";
	export default {
		props: ["type", "showBtn", "newSearchKey"], //chess || game || lottery  showBtn=true不可编辑
		components: {
			Tables,
			Icons
		},
		data() {
			return {
				originData: [],
				newType: "",
				table: {
          pageSize: 20,
          newPageSize:"",
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					data: [],
					loading: true,
					columns: [
						{
							title: "会员账号",
							key: "userName",
							align: "center",
							minWidth:95,
							tooltip:true,
						},
						{
							title: "金管家等级",
							key: "level",
							align: "center",
							minWidth:75,
							render:(h,params) =>{
								return <span>{params.row.level}级</span>
							}
						},
						{
							title: "累积打码",
							key: "bet_money",
							align: "center",
							minWidth:85,
							render: (h, params) => {
								return h("div", [
									h(
										"span",
										{
											style: {
												display: this.showBtn ? "block" : "none"
											}
										},
										params.row.bet_money
									),
									h("Input", {
										style: {
											display: this.showBtn ? "none" : "block",
											width: "95%",
											margin: "0 auto"
										},
										props: {
											value: params.row.bet_money
										},
										on: {
											"on-change": e => {
												this.table.data[params.index].bet_money = e.target.value;
												this.$emit("sendNewData", this.table.data);
											}
										}
									})
								]);
							}
						},
						{
							title: "晋级礼金",
							key: "level_money",
							align: "center",
							minWidth:55,
							render: (h, params) => {
								return h("div", [
									h(
										"span",
										{
											style: {
												display: this.showBtn ? "block" : "none"
											}
										},
										params.row.level_money
									),
									h("Input", {
										style: {
											display: this.showBtn ? "none" : "block",
											width: "95%",
											margin: "0 auto"
										},
										props: {
											value: params.row.level_money
										},
										on: {
											"on-change": e => {
												this.table.data[params.index].level_money =
													e.target.value;
												this.$emit("sendNewData", this.table.data);
											}
										}
									})
								]);
							}
						},
						{
							title: "月俸禄",
							key: "every_month_reward",
							align: "center",
							minWidth:60,
							render: (h, params) => {
								return h("div", [
									h(
										"span",
										{
											style: {
												display: this.showBtn ? "block" : "none"
											}
										},
										params.row.every_month_reward
									),
									h("Input", {
										style: {
											display: this.showBtn ? "none" : "block",
											width: "95%",
											margin: "0 auto"
										},
										props: {
											value: params.row.every_month_reward
										},
										on: {
											"on-change": e => {
												this.table.data[params.index].every_month_reward =
													e.target.value;
												this.$emit("sendNewData", this.table.data);
											}
										}
									})
								]);
							}
						},
						{
							title: "周俸禄",
							key: "every_week_reward",
							align: "center",
							minWidth:60,
							render: (h, params) => {
								return h("div", [
									h(
										"span",
										{
											style: {
												display: this.showBtn ? "block" : "none"
											}
										},
										params.row.every_week_reward
									),
									h("Input", {
										style: {
											display: this.showBtn ? "none" : "block",
											width: "95%",
											margin: "0 auto"
										},
										props: {
											value: params.row.every_week_reward
										},
										on: {
											"on-change": e => {
												this.table.data[params.index].every_week_reward =
													e.target.value;
												this.$emit("sendNewData", this.table.data);
											}
										}
									})
								]);
							}
						},
						{
							title: "借呗额度",
							key: "jiebei_amount",
							align: "center",
							minWidth:55,
							render: (h, params) => {
								return h("div", [
									h(
										"span",
										{
											style: {
												display: this.showBtn ? "block" : "none"
											}
										},
										params.row.jiebei_amount
									),
									h("Input", {
										style: {
											display: this.showBtn ? "none" : "block",
											width: "95%",
											margin: "0 auto"
										},
										props: {
											value: params.row.jiebei_amount
										},
										on: {
											"on-change": e => {
												this.table.data[params.index].jiebei_amount =
													e.target.value;
												this.$emit("sendNewData", this.table.data);
											}
										}
									})
								]);
							}
						},
						{
							key: "level_status",
							align: "center",
							minWidth:55,
							renderHeader: (h, params) => {
								return h("p", [
									h("span", "状态"),
									h(
										"Poptip",
										{
											props: {
												trigger: "hover",
												content: "锁定会员不可自动晋级，可手动调节等级",
												placement: "top-end",
												transfer:true,
												style: {
													marginTop: "-4px"
												}
											}
										},
										[
											h(Icons, {
												props: {
													type: "bangzhutishi"
												},
												style: {
													color: "#b3b3b3",
													marginLeft: "5px"
												}
											})
										]
									)
								]);
							},
							render: (h, params) => {
								return h("div", [
									h(
										"span",
										{
											style: {
												color: params.row.level_status ? "" : "#FF0000",
												display: this.showBtn ? "block" : "none"
											}
										},
										params.row.level_status ? "未锁定" : "已锁定"
									),
									h(
										"Select",
										{
											style: {
												display: this.showBtn ? "none" : "block",
												width: "90px",
												margin: "0 auto",
												color: params.row.level_status ? "" : "#FF0000"
											},
											props: {
												value: params.row.level_status ? "on" : "off"
											},
											on: {
												"on-change": val => {
													this.table.data[params.index].level_status = !this.table
														.data[params.index].level_status;
													this.$emit("sendNewData", this.table.data);
												}
											}
										},
										[
											h("Option", {
												props: {
													value: "off",
													label: "已锁定"
												}
											}),
											h("Option", {
												props: {
													value: "on",
													label: "未锁定"
												}
											})
										]
									)
								]);
							}
						},
						{
							title: "晋级总额",
							key: "level_total",
							align: "center",
							minWidth:55,
						},
						{
							title: "总月俸禄",
							key: "month_total",
							align: "center",
							minWidth:60,
						},
						{
							title: "总周俸禄",
							key: "week_total",
							align: "center",
							minWidth:60,
						},
						{
							title: "更新时间",
							key: "update_time",
							align: "center",
							minWidth:110,
							render: (h, params) => {
								return (
									<span>{this.$root.newUnixTime(params.row.update_time)}</span>
								);
							}
						}
					]
				}
			};
		},
		methods: {
			getData(data) {
				this.$root.startTableLoading(this);
				jinGuanJiaShow(data).then(res => {
					this.table.data = res.data.data.data;
					this.table.total = res.data.data.total;
					this.$root.endTableLoading()
				}).catch(error=> this.$root.endTableLoading());
			},
			//设置改变后的数据
			setNewData(data) {
				this.table.data = data;
				this.originData = JSON.parse(JSON.stringify(this.table.data));
			},
			//取消编辑
			exit() {
				this.table.data = this.originData;
				this.originData = JSON.parse(JSON.stringify(this.table.data));
			},
			//点击分页
			onPageChange(page) {
				let data = {
					params: {
						...this.newSearchKey,
						siteId: this.$root.nowSite.id,
						active_type: this.$root.nowSite.id,
						active_type: this.type,
						limit: this.newPageSize
					},
					query: { page }
				};
				let dataParams = data.params;
				for (let key in dataParams) {
					if (!dataParams[key]) delete dataParams[key];
				}
				this.getData(data);
			},
			//切换页数
			onPageSizeChange(pageSize) {
        this.newPageSize=pageSize
				let data = {
					...this.newSearchKey,
					siteId: this.$root.nowSite.id,
					active_type: this.type,
					limit: pageSize
				};
				this.getData({ params: data });
			}
		}
	};
</script>
<style lang="less" scoped>
/deep/.ivu-table-header{
  font-size: 1rem;
  font-weight:normal;
  .ivu-table-cell{
    font-weight: 549;
  }
}
/deep/.ivu-table {

  color:#444;
}
</style>

