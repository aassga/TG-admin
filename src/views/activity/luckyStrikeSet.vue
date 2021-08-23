<template>
  <div>
    <div class="v2-search">
      <Button type="primary" class="mb10" @click="addPlan" v-if="(adminType == 'super') || (authInPage.indexOf('activityHongyundangtouAdd') != -1)">新增计划</Button>
			<div class="fr mr20 r10">
        <div class="clearfix">
          <span class="fl" style="line-height:38px">操作说明</span>
          <Poptip trigger="hover" placement="bottom-end" class="ml5 fl">
            <div slot="content">
							<div class="ft16 mb15">操作说明</div>
              <div class="mb10">1、编辑:未启用的计划可全量编辑。启用中的计划只能编辑"红包组成"和"方法名目"</div>
							<div class="mb10">2、结束:启用状态的计划才有结算操作，一旦结束，该计划的所有业绩不再结算，所有未方法的红包全部取消。</div>
              <div class="mb10">3、查看:查看该计划发放方式和发放情况。点击金额可查看相应的明细。</div>
							<div class="mb10">4、删除:只有待启用的计划才能删除。</div>
            </div>
            <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
          </Poptip>
        </div>
      </div>
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
				@on-sort-change="onSortChange"
			></Tables>
		</div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import { hongYunList,hongYunDel,hongYunEnd } from "@/api/activity";
import { getUserType } from "@/libs/util";
import { Button } from 'view-design';
import Icons from '_c/icons';
export  default{
  name:"luckyStrikeSet",
  components:{
		Tables,
		Icons
  },
  data(){
    return{
				searchKey:{
					page:1,
					limit:20,
					siteId: this.$root.nowSite.id,
				},
				page:1,
			 	adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
      	table: {
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					columns: [
						{
							title: "红包组成",
							key: "gift_type",
							align: "center",
							minWidth: 100,
							render:(h,params)=>{
                return (<span>{params.row.gift_type=='betting'?'投注红包':params.row.gift_type=='negativeProfit'?'负盈利红包':'投注红包,负盈利红包'}</span>)
              }
						},
						{
							title: "发放节点",
							key: "delivery_time",
							align: "center",
							minWidth: 110,
							tooltip: true,
							render:(h,params)=>{
								if(params.row.delivery_time_type == 'cycle'){
									if(params.row.delivery_time == 1){
										let  time = '每天发放';
										return (
										<span>{time}</span>
										)
									}else{
										let time ='每'+ params.row.delivery_time+'天发放';
										return (
										<span>{time}</span>
										)
									}

								}else if(params.row.delivery_time_type == 'select_date'){
									let arr=[];
									params.row.delivery_time.split(',').map(item=>{
										item = this.$moment(item).format("X");
										item = this.$root.formatTime(item*1000);
										arr.push(item)
									});
									arr.sort(function(a,b){
										if(a>b)return 1
										else return -1
									});
									return (
									<Tooltip max-width='420'>
											<span>{arr[0]}</span>
											<div slot="content">
												<p class="txt-a">结算时间</p>
												{
													arr.map(t => {
														if(this.$root.formatTime(new Date())==t){
															return h ('span',{
																class:"ib p5 m5 lh32 txt-a w120x",
																style: {
																	color: 'white',
																	background:'#57a3f3'
																}
															}, t)
														}else if(this.$moment(new Date()).format("X")-this.$moment(t).format("X")>0){
															return h ('span',{
																class:"ib p5 m5 lh32 txt-a w120x",
																style: {
																	border: '1px solid #858484',
																	color: 'white',
																	background:'rgba(120,120,120,.8)'
																}
															}, t)
														}else{
															return h ('span',{
															class:"ib p5 m5 lh32 txt-a w120x",
															style: {
																border: '1px solid #858484',
																color: 'white',
															}
														}, t)
														}
													})
												}
											</div>
									</Tooltip>
									)
								}

              }
						},
						{
							title: "发放方式",
							key: "delivery_type",
							align: "center",
							minWidth: 60,
							tooltip: true,
							render:(h,params)=>{
                return (
									<span>{params.row.delivery_type=='randomTime'?'随机发放':'结算时间'}</span>
								)
              }
						},
						{
							title: "红包未领取",
							key: "not_acquired_handle",
							align: "center",
							minWidth: 60,
							tooltip: true,
							render:(h,params)=>{
                return (
									<span>{params.row.not_acquired_handle=='fail'?'失效':'累积'}</span>
								)
              }
						},
						{
							title: "发放名目",
							key: "show_content_type",
							align: "center",
							tooltip: true,
							minWidth: 95,
							render:(h,params)=>{
                return (
									<span>{params.row.show_content_type=='designationGameName'?'指定游戏':'随机游戏'}</span>
								)
              }
						},
						{
							title: "发放金额",
							key: "receiveAmount",
							align: "center",
							sortable: "custom",
							minWidth: 70,
						},
						{
							title: "生效时间",
							key: "start_time",
							align: "center",
							sortable: "custom",
							minWidth: 120,
							tooltip: true,
							render: (h, params) => <span>{this.$root.unixTime(params.row.start_time)}</span>
						},
						{
							title: "结束时间",
							key: "end_time",
							align: "center",
							minWidth: 120,
							render: (h, params) => <span>{params.row.end_time == 1?'长期生效':this.$root.unixTime(params.row.end_time)}</span>
            },
            	{
							title: "状态",
							key: "status",
							align: "center",
							minWidth: 45,
								render: (h, params) => <span style={{
									color: params.row.status =='open'?'#239961':params.row.status == 'finish' ?'#999999':'#ff2626'}}>{params.row.status == 'open'?'启用':params.row.status == 'finish'?'已结束':'待开启'}</span>
            },
            	{
							title: "操作",
							key: "status",
							align: "center",
							minWidth: 120,
							 render: (h, params) => {
                return (
                  <div>
                    <a
                      class="ib mr10"
                      style={{
                        display: ((this.adminType == 'super')|| (this.authInPage.indexOf('activityHongyundangtouConfigUpdate') != -1))&&params.row.status !='finish'? 'inline-block' : "none"
                      }}
                      onClick={() => {
                        this.onEdit(params);
                      }}
                    >
                      编辑
										</a>
										<a
											class='ib mr10'
											style={{
												display: ((this.adminType == 'super') || (this.authInPage.indexOf('activityHongyundangtouConfigStatus') != -1)) && (params.row.status == 'open') ? 'inline-block' : 'none'
											}}
											onClick={() => {
												this.onDelete(params, params.row.status)
											}}
										>结束
										</a>
                    <a
                      class="ib mr10"
                      style={{
                        display: ((this.adminType == 'super') || (this.authInPage.indexOf('activityHongyundangtouConfigDelete') != -1)) && (params.row.status == 'close')? 'inline-block' : "none"
                      }}
                      onClick={() => {
                        this.onDelete(params,params.row.status);
                      }}
                    >
                      删除
										</a>
										<a
                      class="ib"
                      style={{
                        display: (this.adminType == 'super')|| (this.authInPage.indexOf('activityHongyundangtouConfigInfo') != -1) ? 'inline-block' : "none"
                      }}
                      onClick={() => {
                        this.onLook(params);
                      }}
                    >
                      查看
                    </a>
                  </div>
                );
              }
						}
					],
					data: []
        },
    }
	},
	beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getData(vm.searchKey)
    });
  },
  methods:{
		getData(){
				//列表
		// let data={siteId: this.$root.nowSite.id};
			hongYunList(this.searchKey).then(res=>{
				if(res.code == 200) {
					this.table.data = res.data;
					this.table.total = res.data.length;
				}
			})
		},
		//跳转新增页面
    addPlan(){
     this.$router.push({
			 name:"addPlan",
			 params: { page: "create" },
			 query:{page:"create"}
			 })
		},
		//跳转编辑页
		onEdit(params) {
      this.$router.push({
        name: "addPlan",
        params: { page: "edit" },
        query: { id: params.row.id, siteId: this.$root.nowSite.id,page:"edit",gift_type:params.row.gift_type }
      });
		},
		//跳转查看页
		onLook(params){
			this.$router.push({
        name: "addPlan",
        params: { page: "look" },
        query: { id: params.row.id, siteId: this.$root.nowSite.id, page: 'look' }
      });
		},
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      this.getData(this.searchKey);
    },
    onPageChange(page) {
      this.searchKey.page = page;
      this.getData(this.searchKey);
		},
		onSortChange({ column, key, order }) {
      delete this.searchKey.start_time;
			delete this.searchKey.receiveAmount;
			this.searchKey[key]=order=='asc'?'ASC':'DESC';
			this.getData(this.searchKey)
    },
		 //删除事件
    onDelete(params,status) {
			if(status ==  'open'){
				this.$Tip.confirm({
					content: `您确定结束此计划吗？`,
        // content: `您确定结束${params.row.gift_type=="negativeProfitAndBetting"?'投注红包,负盈利红包':params.row.gift_type=="Betting"?'投注红包':'负盈利红包'}吗？`,
					onOk: () => {
						let data = {
							id: params.row.id,
							status:'finish',
							siteId: this.$root.nowSite.id
						};
						hongYunEnd(data,true).then(res => {
							if ( res != undefined && res.code == 200) {
								this.$Message.success({ content: '计划结束成功' })
								this.getData();
							}
						});
					}
				});
				return
			}else{
				this.$Tip.confirm({
					content: `您确定删除此计划吗？`,
					onOk: () => {
						let data = {
							id: params.row.id,
							siteId: this.$root.nowSite.id
						};
						hongYunDel(data,true).then(res => {
							if ( res != undefined && res.code == 200) {
								this.$Message.success({ content: '计划删除成功' })
								this.getData();
							}
						});
					}
      	});
			}
    },

  }
}
</script>
<style lang="less" scoped>
/deep/.ivu-table-wrapper {
	overflow: visible !important;
	/deep/.ivu-table {
		overflow: visible !important;
	}
}
</style>
