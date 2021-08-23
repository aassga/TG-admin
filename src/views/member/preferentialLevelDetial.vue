<template>
 <div>
     <div class="v2-search">
            <Form inline>
                <FormItem label="优惠等级">
                       <Select v-model="searchKey.level" clearable>
                           <Option v-for="(t,i) in  gradeList" :value="t.level" :key="i">{{t.level_alias}}</Option>
                       </Select>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker v-model="Time[0]" placeholder="开始日期"></DatePicker>
                </FormItem>
                 <FormItem label="结束日期">
                    <DatePicker v-model="Time[1]" placeholder="结束日期"></DatePicker>
                </FormItem>
                <FormItem label="会员账号">
                   <Input  v-model="searchKey.username" class="w80x" placeholder="请输入会员账号"/>
                </FormItem>
                <FormItem>
                    <Button  @click.prevent="searchSubmit" :loading="$root.tableLoading" type="primary">查询</Button>
                </FormItem>
                 <FormItem>
                    <Button type="primary" 	:loading="$root.editBtnLoading"
						class="ivu-btn export"
						@click="exportExcel">导出EXCEL</Button>
                </FormItem>
            </Form>
        </div>
               <div class="v2-table">
      <Tables
        ref="tables"
        :columns="table.columns"
          @on-sort-change="sortChange"
        :loading="$root.tableLoading"
        :value="table.data"
        	@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
    </div> 
 </div>
</template>
<script>
import Tables from "@/components/tables";
import {bonusLevelSelectList,bonusLevelDetail}from "@/api/member";
export  default{
    name:'preferentialLevelDetial',
    components:{
        Tables
    },
    data(){
        return{
            Time: [],
            searchKey:{
                level:'',
                siteId:this.$root.nowSite.id,
            

            },
            gradeList:[],
                  table: {
        page: false,
        loading: true,
        columns: [
          {
            title: "会员账号",
            key: "username",
            align: "center",
            minWidth: 60,
          },
          {
            title: "等级别称",
            key: "level_alias",
            align: "center",
            minWidth: 60,
          },
          {
            title: "有效投注",
            key: "valid_bet_amount",
            align: "center",
            minWidth: 60,
             sortable: "custom",
          },
          {
            title: "优惠金额",
            key: "bonus_amount",
            align: "center",
            minWidth: 60,
            sortable: "custom",
          },
          {
            title: "存款金额",
            key: "deposit_amount",
            align: "center",
            minWidth: 60,
             sortable: "custom",
          },
          {
            title: "取款金额",
            key: "withdrawals_amount",
            align: "center",
            minWidth: 60,
             sortable: "custom",
          },
          {
            title: "网站盈利",
            key: "profit_amount",
            align: "center",
            minWidth: 60,
             sortable: "custom",
          },
          {
            title: "现金利润",
            key: "report_cash_amount",
            align: "center",
            minWidth: 110,
             sortable: "custom",
           render: (h, params) => {
                            let color = params.row.report_cash_amount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.report_cash_amount)}</span>;
                        }
          },
          {
            title: "打码倍数",
            key: "report_multiple",
            align: "center",
            minWidth: 60,
          },
        ],
        data: [],
      },
        }
    },
    beforeRouteEnter(to,from,next){
         next(vm=>{
         
      
             let data={siteId:vm.$root.nowSite.id};
        bonusLevelSelectList(data).then(res=>{
            if(res!=undefined&&res.code==200){
                console.log(res)
                vm.gradeList=res.data;
                console.log(vm.gradeList)
            }
        })
          
         })
    },
    mounted(){

            const {level,startTime,endTime}=this.$route.query;
            console.log(startTime,endTime)
            if(this.$route.query){

              this.searchKey.level=Number(level);
               this.Time[0]=this.searchKey.startTime=startTime;
                this.Time[1]=this.searchKey.endTime=endTime;
            }
                 let detialData={
                      ...this.searchKey,
            siteId:this.$root.nowSite.id,
         
        };
    
        for (let key  in  detialData){
            if(!detialData[key]) delete  detialData[key];

        }
        this.getData({params:detialData});


    },
    methods:{
        searchSubmit(){
          let data={...this.searchKey};
                     if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        this.searchKey.startTime = data.startTime =
          startTime && this.$root.formatTimeS(startTime);
        this.searchKey.endTime = data.endTime =
          endTime && this.$root.formatnightTimeS(endTime);
      } else {
        return false;
      }
      console.log(data)
          for (let key in data) {
					if (!data[key]) delete data[key];
				}

          this.getData({params:data});

        },
        exportExcel(){
 let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      data.isExport = 1;
      let openr = window.open();
                  bonusLevelDetail({ params: data }, true).then((res) => {
        if (res != undefined && res.code == 200) {
          console.log(res);
          let region = res.data.downloadUrl.split(".com")[1];
          let openr1 = openr ? openr : window;
          openr1.location.href = region;
        } else {
          openr.close();
        }
      });
        },
       sortChange({ column, key, order }){
          	delete this.searchKey.sort_key;
				    delete this.searchKey.sort_val;
            			let data = {
					sort_key: key,
					sort_val: order,
					...this.searchKey,
					siteId: this.$root.nowSite.id
				};
        	this.searchKey.sortKey = key;
				if (data.sort_val == "normal") {
					this.table.columns.forEach(item => {
						if (item.key == column.key) this.$set(item, "sortType", "asc");
					});
					this.searchKey.sort_val = "asc";
					data.sort_val = "asc";
				} else {
					this.table.columns.forEach(item => {
						delete item.sortType;
					});
					this.searchKey.sort_val = order;
				}
        	this.page == 1 ? "" : this.$refs.tables.setPage();
				this.page == 1
					? this.getData({ params: data })
					: this.getData({ params: data, query: { page: 1 } });
        },
        		onPageSizeChange(pageSize) {
				this.searchKey.limit = pageSize;
				let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
				this.getData({ params: data });
			},
        onPageChange(page) {
				this.page = page;
				let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
				data = { ...data };
				this.getData({ params: data, query: { page } });
			},
        getData(detialData){
            this.$root.startTableLoading();
            bonusLevelDetail(detialData).then(res=>{
                if(res!=undefined&&res.code==200){
                    const {data,total}=res.data;
                     this.table.data = data;
                     this.table.total=total;
                }
                 this.$root.endTableLoading();
            }).catch((err) => this.$root.endTableLoading());
        }
    }
}
</script>