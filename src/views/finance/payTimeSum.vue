
<template>
	<div class="v2-search">
		<Form ref="searchKey" inline class="ib mb20">
			<FormItem v-for="(t,i) in btnList" :key="i">
				<Button :class="btnName == t ? 'bd-bg' : 'bg-or'" @click..prevent="changeBtn(t)" >
          <span >{{t}}</span></Button>
			</FormItem>
			<FormItem label="开始时间">
				<DatePicker
					type="date"
					placeholder="开始日期"
					@on-change="startChange"
					class="s-120"
					v-model="Time[0]"
				></DatePicker>
			</FormItem>
			<FormItem label="结束时间">
				<DatePicker
					type="date"
					placeholder="结束日期"
					@on-change="endChange"
					class="s-120"
					v-model="Time[1]"
				></DatePicker>
			</FormItem>
			<FormItem>
				<Button type="primary" class="search mb5 " @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
			</FormItem>
			<FormItem>
				<!-- <Button
					type="primary"
					class="ivu-btn export mb5"
					:loading="$root.editBtnLoading"
					@click="exportExcel"
				>导出Excel</Button> -->
			</FormItem>
		</Form>
		<div class="v2-table">
			<Tables
				editable
				ref="table"
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
        @on-sort-change="sortChange"
				:pageSizeOpts="table.pageSizeOpts"
			></Tables>
		</div>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
	// import tableMixins from "@/mixins/table";
	import { accessAuditTotalItems } from "@/api/finance";
	export default {
		name: "accessAuditTotal",
		// mixins: [tableMixins],
		components: {
			Tables
		},
		data() {
			return {
				searchKey: {
					siteId: this.$root.nowSite.id
				},
				setPage: "",
				pageSize: "",
				btnList: ["本月", "上月"],
				btnName: "本月",
				Time: [],
				startBtnList: [
					this.$root.monthDayStartTime(),
					this.$root.lastMonthDayStartTime()
				],
				endBtnList: [
					this.$root.monthDayEndTime(),
					this.$root.lastMonthDayEndTime()
				],
				table: {
					total: 0,
					loading: true,
					pageSizeOpts: [20, 30, 40, 50],
					data: [],
					columns: [
						{
							title: "日期",
							key: "date_time",
							align: "center",
							render: (h, params) => {
								return (
									<span
										class={{ "blue-font": params.row.date_time !== "总计" }}
										onClick={() => {
											if (params.row.date_time != "总计") {
												let newTime = params.row.date_time;
												this.$router.push({
													name: "payTimeDetail",
													query: { newTime }
												});
											}
										}}
									>
										{params.row.date_time}
									</span>
								);
							}
						},
						{
							title: "平均存款审核时间",
							key: "deposit_mean_time",
							align: "center",
              minWidth: 65,
              sortable: "custom",
							render: (h, params) => {
								return (
									<span>
										{this.$root.hoursTime(params.row.deposit_mean_time)}
                  </span>
								);
							}
						},
						{
							title: "平均取款审核时间",
							key: "withdw_mean_time",
							align: "center",
              minWidth: 55,
              sortable: "custom",
							render: (h, params) => {
								return (
                  <span>{this.$root.hoursTime(params.row.withdw_mean_time)}</span>
								);
							}
						}
					]
				}
			};
		},
		mounted() {
			if(!this.$route.query.startTime){
				this.changeBtn("本月");
			}else{
				this.Time = [this.$route.query.startTime,this.$route.query.endTime];
				this.searchKey.startTime =	this.Time[0];
				this.searchKey.endTime = this.Time[1];
				this.getData({ params: this.searchKey });
			}
		},
		methods: {
      //排序
      sortChange({ column, key, order}){

          delete this.searchKey.sortKey;
          delete this.searchKey.sortVal;
          let  data={
            sortKey:key,
            sortVal:order,
            ...this.searchKey,
            siteId:this.$root.nowSite.id
          }
          this.searchKey.sortKey=key;
          if(data.sortVal=="normal"){
            this.table.columns.forEach(item=>{
                if (item.key == column.key) this.$set(item, "sortType", "asc");
                  this.searchKey.sortVal = "asc";
                  data.sortVal = "asc";
            })
          }else {
          this.table.columns.forEach(item => {
            delete item.sortType;
          });
          this.searchKey.sortVal = order;
        }
        this.page == 1 ? "" : this.$refs.table.setPage();
       this.page == 1
        ? this.getData({ params: data })
        : this.getData({ params: data, query: { page: 1 } });
        this.getData({params:data})
      },
			startChange(time, type) {
				let st = this.$root.formatTime(this.Time[0]);
				let et = this.$root.formatTime(this.Time[1]);
				if (
					st == this.$root.monthStartTime() &&
					et == this.$root.monthEndTime()
				)
					this.btnName = "本月";
				if (
					st == this.$root.lastMonthStartTime() &&
					et == this.$root.lastMonthEndTime()
				)
					this.btnName = "上月";
				if (this.startBtnList.indexOf(st) == -1) this.btnName = "";
			},
			endChange(time, type) {
				let st = this.$root.formatTime(this.Time[0]);
				let et = this.$root.formatTime(this.Time[1]);
				if (
					st == this.$root.monthStartTime() &&
					et == this.$root.monthEndTime()
				)
					this.btnName = "本月";
				if (
					st == this.$root.lastMonthStartTime() &&
					et == this.$root.lastMonthEndTime()
				)
					this.btnName = "上月";
				if (this.endBtnList.indexOf(et) == -1) this.btnName = "";
			},
			changeBtn(name) {
				this.btnName = name;
				switch (name) {
					case "本月":
						this.searchKey.startTime = this.$root.monthStartTime();
						this.searchKey.endTime = this.$root.monthEndTime();
						break;
					case "上月":
						this.searchKey.startTime = this.$root.lastMonthStartTime();
						this.searchKey.endTime = this.$root.lastMonthEndTime();
						break;
				}
				this.Time[0] = this.searchKey.startTime;
				this.Time[1] = this.searchKey.endTime;
				this.getData({ params: this.searchKey });
			},
			getData(data) {
				this.$root.startTableLoading();
				accessAuditTotalItems(data).then(res => {
          if(res!=undefined&&res.code==200){
            const { audit_total } = res.data;
            const { data, total } = res.data;
           data.length && data.push(this.createTotalData(audit_total));
            this.table.data = data;
            this.table.total = total;
          }
					this.$root.endTableLoading();
				}).catch(err=>this.$root.endTableLoading())
			},
			createTotalData(audit_total) {
				const {deposit_mean_time, withdw_mean_time } = audit_total;
				let item = {
					date_time: "总计",
          deposit_mean_time,
					withdw_mean_time
        };

        return item;

			},
			searchSubmit() {
				let data = {
					...this.searchKey,
					startTime: this.$root.formatTime(this.Time[0]),
					endTime: this.$root.formatTime(this.Time[1])
				};
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				let { startTime, endTime } = data;

				this.searchKey.startTime = data.startTime;
				this.searchKey.endTime = data.endTime;
				this.getData({ params: data });
			},
			exportExcel() {},
			onPageChange(page) {
				const params = {
					...this.searchKey,
					startTime: this.$root.formatTime(this.Time[0]),
					endTime: this.$root.formatTime(this.Time[1]),
					siteId: this.$root.nowSite.id,
					limit: this.pageSize
				};
				this.getData({ params: params, query: { page } });
			},
			onPageSizeChange(pageSize) {
				const params = {
					...this.searchKey,
					limit: pageSize,
					startTime: this.$root.formatTime(this.Time[0]),
					endTime: this.$root.formatTime(this.Time[1]),
					siteId: this.$root.nowSite.id
				};
				this.getData({ params: params });
				this.pageSize = pageSize;
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	//今天，上月，昨天按钮的样式
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
</style>