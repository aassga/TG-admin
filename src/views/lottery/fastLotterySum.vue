<template>
	<div>
		<div class="v2-search">
			<Form inline ref="searchKey">
				<FormItem label="站点类型">
					<Select clearable v-model="searchKey.type" class="s-86" placeholder="全部">
						<Option v-for="(t, i) in  siteClass" :key="i" :value="t.key">{{ t.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="开始日期">
					<DatePicker type="date" v-model="Time[0]" placeholder="开始日期" class="s-120"></DatePicker>
				</FormItem>
				<FormItem label="结束日期">
					<DatePicker type="date" v-model="Time[1]" placeholder="结束日期" class="s-120"></DatePicker>
				</FormItem>
				<FormItem>
					<Button type="primary" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				editable
				ref="table"
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				:page="false"
				:pageSizeOpts="table.pageSizeOpts"
			></Tables>
		</div>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	import {  mapMutations,mapState } from "vuex";
	import { fastLotteryStatistical } from "@/api/system";
	export default {
		name: "fastLotterySum",
		components: {
			Tables
		},
		computed:{
          ...mapState({siteClass: state => state.user.siteClass,})
		},
		data() {
			return {
        mData:[],
				// siteList: [
				// 	{
				// 		name: "云博",
				// 		key: "yunbo"
				// 	},
				// 	{
				// 		name: "彩票",
				// 		key: "lottery"
				// 	},
				// 	{
				// 		name: "包网",
				// 		key: "cover_network"
				// 	}
				// ],
				searchKey: {
					type: "all"
				},
				Time: [this.$root.formatTime(), this.$root.formatTime()],
				table: {
					total: 0,
					loading: true,
					pageSizeOpts: [20, 30, 40, 50],
					data: [],
					columns: [
						{
							title: "彩票名称",
							key: "name",
							align: "center",
							render: (h, params) => {	
								if(params.row.name!='总计'){
									return(
										<span class="blue-font" onClick={()=>{
											const { id } = params.row;
											if(!this.searchKey.type||this.searchKey.type==undefined){this.searchKey.type='all'; }
											const { startTime, endTime, type } = this.searchKey;
													this.$router.push({
												name: "fastLotterySumDetials",
												query: { id, startTime, endTime, type }
											});
										}}>{params.row.name}</span>
									)
								}else{
									return(
										<span>{params.row.name}</span>
									)
								}
								
								
						}},
						{
							title: "有效投注",
							key: "validBetAmount",
							align: "center",
							minWidth: 65,
							render: (h, params) => {
								return (
									<span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
								);
							}
						},
						{
							title: "会员输赢",
							key: "netAmount",
							align: "center",
							minWidth: 55,
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
							title: "实际杀数",
							key: "rate",
							align: "center",
							render:(h,params)=>{
								return(
									<span>{params.row.rate}</span>
								)
							}
						},
						{
							title: "投注人数",
							key: "count",
							align: "center",
							minWidth: 55
						}
					]
				}
			};
    },
		mounted() {
			const data = {
				startTime: this.$root.formatTime(this.Time[0]),
				endTime: this.$root.formatTime(this.Time[1]),
				type: this.searchKey.type
			};
		
			this.searchKey.startTime = data.startTime;
			this.searchKey.endTime = data.endTime;
			this.getData({ params: data });
		},
		methods: {
			searchSubmit() {
				let data = {
					startTime: this.$root.formatTime(this.Time[0]),
					endTime: this.$root.formatTime(this.Time[1]),
					type: this.searchKey.type
        };
        if(!data.type||data.type==undefined){
          data.type='all';
        }
				this.searchKey.startTime = data.startTime;
				this.searchKey.endTime = data.endTime;
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
         this.mData=data;
				this.getData({ params: data });
			},
			getData(data) {
				this.$root.startTableLoading();
				fastLotteryStatistical(data)
					.then(res => {
						if (res!=undefined && res.code == 200) {
							const { list,totla} = res.data;
							if(list==undefined){
                              this.table.data=[];
							}else{
								list.length && list.push(this.createTotalData(totla));
							    this.table.data = list;
							}
							
							this.$root.endTableLoading();
						}
					})
					.catch(error => {
						this.$root.endTableLoading();
					});
			},
			createTotalData(total){
				   const{validBetAmount,netAmount,count,rate}=total;
				   let item = {
					 name: '总计',
                     validBetAmount,
                     netAmount,
                     count,
                     rate,
                   };
            return item;
			}
		}
	};
</script>
<style lang="less" scoped>
	/deep/.ivu-table-row {
		td {
			&:nth-child(3) {
				.ivu-table-cell {
					color: rgb(35, 153, 97);
				}
			}
		}
	}
	/deep/.ivu-table-summary {
		border-bottom:1.3px solid #dcdcdc !important;
		border-top:1.3px solid #dcdcdc !important;
	}
</style>