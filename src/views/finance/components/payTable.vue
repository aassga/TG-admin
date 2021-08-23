<template>
	<div ref="payTable" class="W80%" style="margin-botton:30px;height:190px">
		<Tables
			style="margin-left:30px;padding-top:18px"
			:width="810"
			:columns="tableData.columns"
			:loading="tableData.loading"
			:value="tableData.data"
			:page="tableData.page"
			:total="tableData.total"
			:more="tableData.more"
		></Tables>
	</div>
</template>
<script>
	import Tables from "_c/tables";
	import { withdrawalsDetail } from "@/api/finance";
	export default {
		props: ["id", "time"],
		components: {
			Tables
		},
		data() {
			return {
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
							title: "现金盈利",
							key: "cash_profit",
							align: "center"
						},
						{
							title: "会员输赢",
							key: "net_amount",
							align: "center"
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
				}
			};
		},
		mounted() {},
		methods: {
			getData() {
				const data = {
					id: this.id,
					timestamp: this.time,
					siteId: this.$root.nowSite.id
				};
				withdrawalsDetail(data).then(res => {
					const { one_day, thirty_day } = res.data.finance_report;
					let arr = [];
					arr.push(one_day, thirty_day);
					this.tableData.data = arr;
				});
			}
		}
	};
</script>
