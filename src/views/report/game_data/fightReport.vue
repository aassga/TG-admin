<template>
<div>
   <div class="v2-search">
      <Form ref="searchKey" inline>
          <FormItem label="对打日期">
            <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
            <span class="ml5 mr5" >-</span>
            <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
          </FormItem>
          <FormItem  label="对打站点">
              <Select class="s-120" clearable v-model="searchKey.siteId" placeholder="全部">
                  <Option v-for="(t,i) in accessSite" :value="t.id" :key="i" >{{t.siteName}}</Option>
              </Select>
          </FormItem>
          <FormItem>
            <GameSelect 
             ref="GameSelect" 
             :showPlateform="false"
             @on-game-change="onGameChange" 
             @clearData="clearData"
             :gameClear="true" 
             ></GameSelect>
        </FormItem>
        <FormItem label="会员账号">
              <Input placeholder="请输入会员账号" class="s-120" v-model="searchKey.userName" />
        </FormItem>
        <FormItem >
          <Button type="primary" class="search"  :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
        </FormItem>
      </Form>
      <FightModals ref="fightDetials"  ></FightModals>
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
    @on-sort-change="sortChange"
    @on-page-size-change="onPageSizeChange"
></Tables> 
   </div>
</div>
</template>
<script>
import Tables from "@/components/tables";
import GameSelect from '@/components/game-select';
import {getReportMutual} from "@/api/report";
import FightModals from "./components/fightModals";
import { mapState } from 'vuex';
    export default{
    name:'fightReport',
    computed:{
        ...mapState({
        accessSite: state => state.user.accessSite,
    }),
    },
    components:{
      Tables,
      GameSelect,
      FightModals
    },
    data(){
        return{   
            Time:[],
            searchKey:{
              row:20,
              page:1,
            },
            table:{
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                loading: false,
                data:[],
                columns:[
                    {
                        title:'对打站点A',
                        align:'center',
                        key:'from_siteName',
                    },
                    {
                        title:'对打会员A',
                        align:'center',
                        key:'from_userName',
                    },
                    {
                        title:'对打站点B',
                        align:'center',
                        key:'to_siteName',
                    },
                    {
                        title:'对打会员B',
                        align:'center',
                        key:'to_userName',
                    },
                    {
                        title:'游戏类型',
                        align:'center',
                        key:'gameName',
                    },
                    {
                        title:'对打笔数',
                        align:'center',
                        sortable:'custom',
                        key:'betCount',
                    },
                    {
                        title:'对打金额',
                        align:'center',
                        sortable:'custom',
                        key:'betAmount',
                    },
                    {
                        title:'对打日期',
                        align:'center',
                        sortable:'custom',
                        key:'data_date',
                        render:(h,params)=>{
                            return(
                                <span>{this.$root.returnDayTime(params.row.data_date)}</span>
                            )
                        }
                    },
                    {
                        title:'操作',
                        align:'center',
                        render:(h,params)=>{
                            const {to_uid,to_siteId,from_uid,from_siteId,data_date,gameId,gameClass}=params.row;
                            let detialData={to_uid,to_siteId,from_uid,from_siteId,data_date,gameId,gameClass}
                            return(
                                <a class="cs" onClick={()=>{
                                    this.$refs.fightDetials.show(detialData)
                                }}>详情</a>
                            )
                        }
                    }
                ]
                
            }

        }
    },
    mounted(){
        this.$refs.GameSelect.init();
        let data={...this.searchKey};
       this.getData({params:data});
    },
    methods:{
        getData(data){
            this.$root.startTableLoading()
            getReportMutual(data).then(res=>{
                if(res!=undefined&&res.code==200){
                  this.$root.endTableLoading()
                  const{data,rowCount}=res.data; 
                  this.table.data=data;
                  this.table.total=rowCount;
                }
            }).catch(err=>{this.$root.endTableLoading()})

        },
        searchSubmit(){
            const {orderName,order}=this.searchKey;
            if(orderName)delete this.searchKey.orderName;
            if(order)delete this.searchKey.order;
            this.table.columns.forEach(item => {
					if (item.sortable == "custom") this.$set(item, "sortType", "");
				});
            this.$refs.tables.setPage();
            let  data={...this.searchKey};
            // if(data.row)(delete data)
            if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    this.searchKey.startTime = data.startTime =startTime&& this.$root.formatTime(startTime);
                    this.searchKey.endTime = data.endTime=endTime && this.$root.formatTime(endTime);
             } else return false;
           
         
             if (new Date(this.searchKey.endTime).getTime() - new Date(this.searchKey.startTime).getTime() < 0) {
					this.$Tip.info({ content: "结束时间必须大于开始时间" });
					return false;
             }

             for (let key in data) {
                    if (!data[key]) delete data[key];
                    if(key=='page') data[key]=1;
                }
             if(data.userName){ data.userName = this.$root.trimAll(data.userName);}
            let reg = /^[0-9a-zA-Z_-]{5,20}$/;
            if (data.userName && !reg.test(data.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
             this.getData({params:data});
        },
        clearData() {
            delete this.searchKey.gameName;
        },
        sortChange({ column, key, order }){
            delete this.searchKey.orderName;
            delete this.searchKey.order;
            let data={
                ...this.searchKey,
                orderName:key,
                order:order,
            }
            this.searchKey.orderName=key;
            if(data.order=='normal'){
                this.table.columns.forEach(item => {
						if (item.key == column.key) this.$set(item, "sortType", "asc");
                });
                this.searchKey.order = "asc";
				data.order = "asc"; 
            }else{
                this.table.columns.forEach(item => {
						delete item.sortType;
					});
				this.searchKey.order= order;
            }
            for (let key in data) {
                    if (!data[key]) delete data[key];
                    if(key=='page') data[key]=1;
            }
            this.searchKey.page == 1 ? "" : this.$refs.tables.setPage();
            this.getData({ params: data })
           
        },
        onGameChange(res){
            this.searchKey.gameClass=res;
        },
        onPageChange(page){
         this.searchKey.page=page;
         let data={...this.searchKey};
         for (let key in data){
             if(!data[key]) delete data[key];
         }
        this.getData({params:data})
        },
        onPageSizeChange(pageSize){
            this.searchKey.row=pageSize;
            let data={...this.searchKey};
            for (let key in data){
             if(!data[key]) delete data[key];
         }
            this.getData({params:data});
        }
    }
    }
</script>