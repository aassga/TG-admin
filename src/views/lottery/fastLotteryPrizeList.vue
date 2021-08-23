
<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<FormItem label="站点名称">
					<Select
						class="w100x"
						@on-change="changeName"
						placeholder="全部"
						v-model="searchKey.siteIds"
						clearable
					>
						<Option v-for="(t,i) in  siteSum" :key="i" :value="t.key">{{t.name}}</Option>
					</Select>
					<span v-if="show">
						-
						<Select
							clearable
							class="w100x"
							@on-change="changeSecond"
							placeholder="全部"
							v-model="searchKey.id"
						>
							<Option v-for="(m,i) in  this.siteList" :key="i+1" :value="m.id">{{m.siteName}}</Option>
						</Select>
					</span>
				</FormItem>
				<FormItem label="开始时间">
					<DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
				</FormItem>
				<FormItem label="结束时间">
					<DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
				</FormItem>
				<FormItem>
					<Button
						:loading="$root.tableLoading"
						type="primary"
						style="height:36px"
						class="w80x"
						@click.prevent="searchSubmit"
					>查询</Button>
				</FormItem>
				<FormItem>
					<Button
						:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click="exportExcel"
						type="primary"
					>导出Excel</Button>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				ref="table"
				:loading="$root.tableLoading"
				:value="table.data"
				:columns="table.columns"
				:total="table.total"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
				@on-sort-change="onSortChange"
			></Tables>
		</div>
	</div>
</template>
<script>
	import Tables from "_c/tables";
	import Icons from "_c/icons";
	import { fastLotteryTop } from "@/api/report";
	import {
		fastLotteryPrizeList,
		fastLotteryBlackListAdd,
		fastLotteryPrizeSummary,
		fastLotteryPrizeSummarySelect
	} from "@/api/lottery";
	import { mapState } from "vuex";
	import Modals from "_c/modals";
	export default {
		name: "fastLotteryTop",
		components: {
			Tables,
			Modals,
			Icons
		},
		computed:{
         ...mapState({
			 siteClass:state=>state.user.siteClass,
			 accessSite: state => state.user.accessSite,})
		},
		data() {
			return {
				show: false,
        ids: [],
        qList:[],
				idsCopy: [],
				idSecond: [],
				// dataList: [],
				siteN: [],
				siteList: [],
				siteSum: [],
				page: 1,
				Time: [this.$root.newstartTime(), new Date()],
				searchKey: {
					siteIds: "[全部]",
					userName: "",
					status: "",
					limit: 20,
					id: ""
				},
				table: {
					data: [],
					loading: true,
					total: 0,
					columns: [
						{
							title: "站点名称",
							key: "siteName",
							align: "center",
							render: (h, params) => {
								const { siteName } = params.row;
								let color = siteName == "总计" ? "" : "#2d8cf0";
								if (siteName == "总计") {
									return <span>总计</span>;
								} else {
									return (
										<span
											class="cs"
											style={{ color }}
											onClick={() => {
												let siteId = params.row.siteId;
												const { startTime, endTime } = this.searchKey;
												this.$router.push({
													name: "fastLotteryPrizeListDetials",
													query: { siteId, siteName, startTime, endTime }
												});
											}}
										>
											{params.row.siteName}
										</span>
									);
								}
							}
						},
						{
							title: "昨日有效投注",
							key: "valid_bet_amount",
							align: "center",
							sortable: "custom"
						},
						{
							title: "昨日会员输赢",
							key: "net_amount",
							align: "center",
							sortable: "custom",
							render: (h, params) => {
								let color =
									params.row.net_amount > 0 ? "#FF2626" : "rgb(35, 153, 97)";
								return (
									<span style={{ color }}>
										{this.$root.keepTwo(params.row.net_amount)}
									</span>
								);
							}
						},
						{
							title: "发放人数",
							key: "give_count",
							align: "center"
						},
						{
							title: "领取人数",
							key: "get_count",
							align: "center"
						},
						{
							title: "发放金额",
							key: "give_amount",
							align: "center",
							sortable: "custom"
						},
						{
							title: "领取金额",
							key: "get_amount",
							align: "center",
							sortable: "custom",
							render: (h, params) => {
								return <span class="red-font">{params.row.get_amount}</span>;
							}
						}
					]
				}
			};
		},
		mounted() {
			fastLotteryPrizeSummarySelect().then(res => {
				this.siteSum = [];
				this.dataList = JSON.parse(JSON.stringify(res.data));
				if (this.accessSite) {
		
							if(this.searchKey.siteIds=='[全部]'){
								let c = [];
								this.accessSite.forEach(m=>{
									this.siteClass.forEach(f=>{
										if(m.site_class==f.key){
											c.push(m.id);
										}
											
									})
								})
								this.searchKey.siteIds =JSON.stringify(c);
								this.qList=JSON.stringify(c);
								let data={...this.searchKey,};
								this.getData({ params: data });
								this.searchKey.siteIds='全部'
                             
								
							}
					
				}
	
				this.siteClass.forEach(t=>{
					this.siteSum.push(t)
				})
				for (let key in this.siteClass) {
					if (this.siteN == key) {
						this.siteList.push(res.data[key]);
					}
				}
			});

			this.Time = [
				this.$root.formatTimeS(this.Time[0]),
				this.$root.formatnightTimeS(this.Time[1])
			];
			(this.searchKey.startTime = this.Time[0]),
        (this.searchKey.endTime = this.Time[1]);

		},
		methods: {
			changeName(t) {
				this.siteList=[];
				this.ids = [];
				this.idsCopy=[];
        if (t == undefined) {//删除
          this.ids =JSON.parse(this.qList);
					this.show = false;
		} else {//未删除
				
          this.show = true;
		  this.siteN = t;
		  this.accessSite.forEach(m=>{
			  if(m.site_class==this.siteN){
				this.siteList.push(m);
			    this.ids.push(m.id)
			  }
			  this.idsCopy=this.ids;
		  })
		}
			},
			//二级选择
			changeSecond(m) {
				if (m == undefined) {
					this.ids = this.idsCopy;
				} else {
          let b=[];
          b.push(this.searchKey.id);
					this.ids =b;
				}
			},

			exportExcel() {
        let data = { ...this.searchKey };
         if(this.searchKey.siteIds=='全部'){data.siteIds=this.qList}else{
          data.siteIds=JSON.stringify(this.ids);
        }
        for (let key in  data){
          if(!data[key]) delete  data[key];
        }
				data.isExport = 1;
				let openr = window.open();
				fastLotteryPrizeSummary({ params: data },true).then(res => {
					if (res != undefined && res.code == 200) {
						let region = res.data.downloadUrl;
						let nowHost = region.split(".com")[1];
						let openr1 = openr ? openr : window;
						openr1.location.href = nowHost;
					} else {
						openr.close();
					}
				});
			},
			getData(data) {
				this.$root.startTableLoading();
				for (let key in data.params) {
					if (!data.params[key]) delete data.params[key];
				}
				fastLotteryPrizeSummary(data, true)
					.then(res => {
						if (res != undefined && res.code == 200) {
							if (res.data.data) {
								this.table.data = res.data.data.list;
								this.table.total = res.data.total;
								let list = res.data.data.list;
								list.length &&
									list.push(this.createTotalData(res.data.data.extra));
								this.table.data = list;
							} else {
								this.table.data = [];
								this.table.total = 0;
							}
							this.$root.endTableLoading();
						}
					})
					.catch(error => this.$root.endTableLoading());
			},
			createTotalData(total) {
				const {
					total_valid_bet_amount,
					total_net_amount,
					total_give_count,
					total_get_count,
					total_give_amount,
					total_get_amount
				} = total;
				let item = {
					siteName: "总计",
					valid_bet_amount: total_valid_bet_amount,
					net_amount: total_net_amount,
					give_count: total_give_count,
					get_count: total_get_count,
					get_amount: total_get_amount,
					give_amount: total_give_amount
				};
				return item;
			},
			searchSubmit() {
        this.$refs.table.setPage();
        let data = { ...this.searchKey, siteIds: JSON.stringify(this.ids) };
         if(this.searchKey.siteIds=='全部'){data.siteIds=this.qList}
				for (let key in data) {
					if (key == "id") {
						delete data[key];
					}
				}
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					data.startTime = startTime && this.$root.formatTimeS(startTime);
					data.endTime = endTime && this.$root.formatnightTimeS(endTime);
				} else {
					return false;
				}

				this.searchKey.startTime = data.startTime;
				this.searchKey.endTime = data.endTime;

				const { startTime, endTime } = data;
				if (startTime == "" || endTime == "") {
					this.$Tip.info({ content: "请输入开始和结束时间" });
					return false;
				}
				if (
					this.searchKey.userName &&
					!this.$root.validateName(this.searchKey.userName)
				) {
					this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
					return false;
				}
				this.table.columns.forEach(item => {
					if (item.sortable == "custom") this.$set(item, "sortType", "");
				});
				delete this.searchKey.sort;
				delete this.searchKey.field;
				this.getData({ params: data });
			},
			onPageChange(page) {
				this.page = page;
        let data = { ...this.searchKey };
         if(this.searchKey.siteIds=='全部'){data.siteIds=this.qList}else{
          data.siteIds=JSON.stringify(this.ids);
        }
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				data.page = page;
				if (data.userName && !this.$root.validateName(data.userName)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
					return false;
				}
				this.getData({ params: data, query: { page } });
			},
			onPageSizeChange(pageSize) {
				this.searchKey.limit = pageSize;
        let data = { ...this.searchKey };
        if(this.searchKey.siteIds=='全部'){data.siteIds=this.qList}else{
          data.siteIds=JSON.stringify(this.ids);
        }
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				if (data.userName && !this.$root.validateName(data.userName)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
					return false;
				}
				this.getData({ params: data });
			},
			onSortChange({ column, key, order }) {
				delete this.searchKey.field;
				delete this.searchKey.sort;
        let data = { field: key, sort: order, ...this.searchKey };
        if(this.searchKey.siteIds=='全部'){data.siteIds=this.qList}else{
          data.siteIds=JSON.stringify(this.ids);
        }
				this.searchKey.field = key;
				if (data.sort == "normal") {
					this.table.columns.forEach(t => {
						if (t.key == column.key) this.$set(t, "sortType", "asc");
					});
					this.searchKey.sort = "asc";
					data.sort = "asc";
				} else {
					this.table.columns.forEach(t => delete t.sortType);
					this.searchKey.sort = order;
				}
				this.page == 1 ? "" : this.$refs.table.setPage();
				this.page == 1
					? this.getData({ params: data })
					: this.getData({ params: data, query: { page: 1 } });
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	.activeBtn {
		height: 36px;
		background-color: #2d8cf0;
		color: #ffffff;
		box-shadow: 0;
		&:focus {
			box-shadow: 0 0 0 0;
		}
	}
	.destoryBtn {
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
</style>

