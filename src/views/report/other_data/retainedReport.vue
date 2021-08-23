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
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel">导出Excel</Button>
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
import Tables from '@/components/tables';
import tableMixins from '@/mixins/table';
import { getKeepReports, keepReports } from '@/api/system';

export default {
    name: 'retainedReport',
    mixins: [tableMixins],
    components: { Tables },
    data() {
        return {
            newData:[],
            page: 1,
            searchKey: {
                startTime: this.$root.fromNow(15, 1),
                endTime: this.$root.formatnightTimeS()
            },
            Time: [this.$root.fromNow(15, 1), this.$root.formatnightTimeS()],
            table: {
                total: 0,
                columns: [
                    {
                        title: '时间',
                        key: 'see_date',
                        align: 'center',
                        // Width: 40
                    },
                    {
                        title: '基准数据',
                        key: 'num',
                        align: 'center',
                        minWidth: 170,
                        render:(h,params)=>{
                        const {deposit,cash,validBetAmount,betMultiple,num,percent}=params.row;
                            if(parseInt(deposit)==0&&parseInt(cash)==0&&parseInt(validBetAmount)==0&&parseInt(betMultiple)==0&&parseInt(num)==0){
                               return <div class="h90"></div>
                            }else{
                            return(
                                <div class="boxB">
                                    <div class="boxBleft">
                                        <div class="box1">
                                        <p  class="red-font mt5">{parseInt(deposit)==0?'-':parseInt(deposit)}</p>
                                        <p>存款</p>   
                                        </div>
                                        <div class="box2">
                                            <p  class="red-font mt5">{parseInt(cash)==0?'-':parseInt(cash)}</p>
                                            <p>利润</p>
                                        </div>
                                        <div class="box3">
                                        
                                        <p  class="red-font mt5">{parseInt(validBetAmount)==0?'-':parseInt(validBetAmount)}</p>
                                        <p>投注</p>
                                            </div>
                                        <div class="box4">
                                        <p  class="red-font mt5">{parseInt(betMultiple)==0?'-':parseInt(betMultiple)}</p>
                                            <p>倍数</p>
                                            </div>
                                        </div>
                                        
                                    <div class="boxBRight">
                                        <p class="one red-font mt5">{parseInt(num)==0?'-':parseInt(num)}</p>
                                        <p>人数</p>  
                                    </div>
                                </div>   
                            )
                            }
                        }
                    },
                    {
                        title: '次日留存',
                        key: 'twonum',
                        align: 'center',
                        minWidth: 170,
                        render: (h, params) => {
                            const {deposit1,cash1,validBetAmount1,betMultiple1,num1,percent1}=params.row;
                            if(parseInt(deposit1)==0&&parseInt(cash1)==0&&parseInt(validBetAmount1)==0&&parseInt(betMultiple1)==0&&parseInt(num1)==0&&parseInt(percent1)==0){
                                return <div class="h90"></div>
                            }else{
                                return(
                            <div class="boxB">
                                <div class="boxBleft">
                                    <div class="box1">
                                        <p  class="red-font mt5">{parseInt(deposit1)==0?'-':parseInt(deposit1)}</p>
                                        <p>存款</p> 
                                    </div>
                                    <div class="box2">
                                        <p class="red-font mt5">{parseInt(cash1)==0?'-':parseInt(cash1)}</p>
                                        <p>利润</p>
                                    </div>
                                    <div class="box3">
                                        <p  class="red-font mt5">{parseInt(validBetAmount1)==0?'-':parseInt(validBetAmount1)}</p>
                                        <p>投注</p> 
                                    </div>
                                     <div class="box4">
                                        <p  class="red-font mt5">{parseInt(betMultiple1)==0?'-':parseInt(betMultiple1)}</p>
                                        <p>倍数</p>
                                     </div>
                                 </div>
                                 <div class="boxBRight">
                                    <div class="box5">
                                        <p class="red-font mt5">{parseInt(num1)==0?'-':parseInt(num1)}</p>
                                        <p>人数</p>
                                    </div>
                                    <div class="box6">
                                        <p class="red-font mt5">{parseInt(percent1)==0?'-':parseInt(percent1)+'%'}</p>
                                        <p>占比</p>
                                    </div>
                                 </div>   
                            </div>   
                            )
                            }
                        }
                    },
                    {
                        title: '3日留存',
                        key: 'threenum',
                        align: 'center',
                        minWidth: 170,
                        render: (h, params) => {
                            const {deposit3,cash3,validBetAmount3,betMultiple3,num3,percent3}=params.row;
                            if(parseInt(deposit3)==0&&parseInt(cash3)==0&&parseInt(validBetAmount3)==0&&parseInt(betMultiple3)==0&&parseInt(num3)==0&&parseInt(percent3)==0){
                                return <div class="h90"></div>
                            }else{
                                return(
                            <div class="boxB">
                                <div class="boxBleft">
                                    <div class="box1">
                                       <p  class="red-font mt5">{parseInt(deposit3)==0?'-':parseInt(deposit3)}</p>
                                       <p>存款</p>   
                                    </div>
                                    <div class="box2">
                                        <p  class="red-font mt5">{parseInt(cash3)==0?'-':parseInt(cash3)}</p>
                                         <p>利润</p>
                                    </div>
                                    <div class="box3">
                                       
                                      <p  class="red-font mt5"> {parseInt(validBetAmount3)==0?'-':parseInt(validBetAmount3)}</p>
                                      <p>投注</p>
                                        </div>
                                    <div class="box4">
                                       <p  class="red-font mt5">{parseInt(betMultiple3)==0?'-':parseInt(betMultiple3)}</p>
                                        <p>倍数</p>
                                    </div>
                                 </div>
                                 <div class="boxBRight">
                                    <div class="box5">
                                       <p  class="red-font mt5">{parseInt(num3)==0?'-':parseInt(num3)}</p>
                                        <p>人数</p>
                                    </div>
                                    <div class="box6">
                                       <p class="red-font mt5">{parseInt(percent3)==0?'-':parseInt(percent3)+'%'}</p>
                                        <p>占比</p>
                                    </div> 
                                 </div>   
                            </div>   
                            )
                            }
                        }
                    },
                    {
                        title: '5日留存',
                        key: 'fivenum',
                        align: 'center',
                        minWidth: 170,
                        render: (h, params) => {
                            const {deposit5,cash5,validBetAmount5,betMultiple5,num5,percent5}=params.row;
                            if(parseInt(deposit5)==0&&parseInt(cash5)==0&&parseInt(validBetAmount5)==0&&parseInt(betMultiple5)==0&&parseInt(num5)==0&&parseInt(percent5)==0){
                                return <div class="h90"></div>
                            }else{
                                return(
                            <div class="boxB">
                                <div class="boxBleft">
                                    <div class="box1">
                                       <p  class="red-font mt5">{parseInt(deposit5)==0?'-':parseInt(deposit5)}</p>
                                       <p>存款</p>   
                                    </div>
                                    <div class="box2">
                                        <p  class="red-font mt5">{parseInt(cash5)==0?'-':parseInt(cash5)}</p>
                                         <p>利润</p>
                                    </div>
                                    <div class="box3">
                                       
                                      <p  class="red-font mt5">{parseInt(validBetAmount5)==0?'-':parseInt(validBetAmount5)}</p>
                                      <p>投注</p>
                                        </div>
                                    <div class="box4">
                                       <p  class="red-font mt5">{parseInt(betMultiple5)==0?'-':parseInt(betMultiple5)}</p>
                                        <p>倍数</p>
                                    </div>
                                 </div>
                                 <div class="boxBRight">
                                    <div class="box5">
                                       <p  class="red-font mt5">{parseInt(num5)==0?'-':parseInt(num5)}</p>
                                        <p>人数</p>
                                    </div>
                                    <div class="box6">
                                       <p  class="red-font mt5">{parseInt(percent5)==0?'-':parseInt(percent5)+'%'}</p>
                                        <p>占比</p>
                                    </div> 
                                 </div>   
                            </div>   
                            )
                            }
                        }
                    },
                    {
                        title: '7日留存',
                        key: 'sevennum',
                        align: 'center',
                        minWidth: 170,
                        render: (h, params) => {
                            const {deposit7,cash7,validBetAmount7,betMultiple7,num7,percent7}=params.row;
                            if(parseInt(deposit7)==0&&parseInt(cash7)==0&&parseInt(validBetAmount7)==0&&parseInt(betMultiple7)==0&&parseInt(num7)==0&&parseInt(percent7)==0){
                                return <div class="h90"></div>
                            }else{
                                return(
                            <div class="boxB">
                                <div class="boxBleft">
                                    <div class="box1">
                                       <p  class="red-font mt5">{parseInt(deposit7)==0?'-':parseInt(deposit7)}</p>
                                       <p>存款</p>   
                                    </div>
                                    <div class="box2">
                                        <p  class="red-font mt5">{parseInt(cash7)==0?'-':parseInt(cash7)}</p>
                                         <p>利润</p>
                                    </div>
                                    <div class="box3">
                                       
                                      <p  class="red-font mt5">{parseInt(validBetAmount7)==0?'-':parseInt(validBetAmount7)}</p>
                                      <p>投注</p>
                                        </div>
                                    <div class="box4">
                                       <p  class="red-font mt5">{parseInt(betMultiple7)==0?'-':parseInt(betMultiple7)}</p>
                                        <p>倍数</p>
                                    </div>
                                 </div>
                                 <div class="boxBRight">
                                    <div class="box5">
                                       <p  class="red-font mt5">{parseInt(num7)==0?'-':parseInt(num7)}</p>
                                        <p>人数</p>
                                    </div>
                                    <div class="box6">
                                       <p  class="red-font mt5">{parseInt(percent7)==0?'-':parseInt(percent7)+'%'}</p>
                                        <p>占比</p>
                                    </div> 
                                 </div>   
                            </div>   
                            )
                            }
                        }
                    },
                    {
                        title: '15日留存',
                        key: 'onefivenum',
                        align: 'center',
                        minWidth: 170,
                        render: (h, params) => {
                            const {deposit15,cash15,validBetAmount15,betMultiple15,num15,percent15}=params.row;
                            if(parseInt(deposit15)==0&&parseInt(cash15)==0&&parseInt(validBetAmount15)==0&&parseInt(betMultiple15)==0&&parseInt(num15)==0&&parseInt(percent15)==0){
                                return <div class="h90"></div>
                            }else{
                                return(
                            <div class="boxB">
                                <div class="boxBleft">
                                    <div class="box1">
                                       <p class="red-font">{parseInt(deposit15)==0?'-':parseInt(deposit15)}</p>
                                       <p>存款</p>   
                                    </div>
                                    <div class="box2">
                                        <p  class="red-font mt5">{parseInt(cash15)==0?'-':parseInt(cash15)}</p>
                                         <p>利润</p>
                                    </div>
                                    <div class="box3">
                                       
                                      <p  class="red-font mt5">{parseInt(validBetAmount15)==0?'-':parseInt(validBetAmount15)}</p>
                                      <p>投注</p>
                                        </div>
                                    <div class="box4">
                                        <p  class="red-font mt5">{parseInt(betMultiple15)==0?'-':parseInt(betMultiple15)}</p>
                                        <p>倍数</p>
                                    </div>
                                 </div>
                                 <div class="boxBRight">
                                    <div class="box5">
                                       <p  class="red-font mt5">{parseInt(num15)==0?'-':parseInt(num15)}</p>
                                        <p>人数</p>
                                    </div>
                                    <div class="box6">
                                       <p class="red-font mt5">{parseInt(percent15)==0?'-':parseInt(percent15)+'%'}</p>
                                        <p>占比</p>
                                    </div> 
                                 </div>   
                            </div>   
                            )
                            }
                        }
                    },
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
                this.$Tip.info({ content: '请输入开始和结束时间！' });
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
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }
            params.isExport = 1;
            this.$root.startEditLoading();
            let openr = window.open();
            keepReports({ params },true)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let region = res.data.downloadUrl;
                        let nowHost = region.split('.com')[1];
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
            this.newData = [];
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            this.$root.startTableLoading();
            keepReports(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let datalist = res.data.data;
                        // JSON.parse(JSON.stringify(datalist).replace(/1deposit/g, 'deposit1'))    
                        if (datalist.length > 0) {
                            // let newData = [];
                            let obj = {};
                            datalist.map(item => {
                                obj = item;
                                obj['deposit1'] = item['1deposit'];  
                                delete obj['1deposit'];
                                obj['cash1'] = item['1cash'];  
                                delete obj['1cash'];
                                obj['validBetAmount1'] = item['1validBetAmount'];  
                                delete obj['1validBetAmount'];
                                obj['betMultiple1'] = item['1betMultiple'];  
                                delete obj['1betMultiple'];
                                obj['num1'] = item['1num'];  
                                delete obj['1num'];
                                obj['percent1'] = item['1percent'];  
                                delete obj['1percent'];

                                obj['deposit3'] = item['3deposit'];  
                                delete obj['3deposit'];
                                obj['cash3'] = item['3cash'];  
                                delete obj['3cash'];
                                obj['validBetAmount3'] = item['3validBetAmount'];  
                                delete obj['3validBetAmount'];
                                obj['betMultiple3'] = item['3betMultiple'];  
                                delete obj['3betMultiple'];
                                obj['num3'] = item['3num'];  
                                delete obj['3num'];
                                obj['percent3'] = item['3percent'];  
                                delete obj['3percent'];

                                obj['deposit5'] = item['5deposit'];  
                                delete obj['5deposit'];
                                obj['cash5'] = item['5cash'];  
                                delete obj['5cash'];
                                obj['validBetAmount5'] = item['5validBetAmount'];  
                                delete obj['5validBetAmount'];
                                obj['betMultiple5'] = item['5betMultiple'];  
                                delete obj['5betMultiple'];
                                obj['num5'] = item['5num'];  
                                delete obj['5num'];
                                obj['percent5'] = item['5percent'];  
                                delete obj['5percent'];

                                obj['deposit7'] = item['7deposit'];  
                                delete obj['7deposit'];
                                obj['cash7'] = item['7cash'];  
                                delete obj['7cash'];
                                obj['validBetAmount7'] = item['7validBetAmount'];  
                                delete obj['7validBetAmount'];
                                obj['betMultiple7'] = item['7betMultiple'];  
                                delete obj['7betMultiple'];
                                obj['num7'] = item['7num'];  
                                delete obj['7num'];
                                obj['percent7'] = item['7percent'];  
                                delete obj['7percent'];
                               
                                obj['deposit15'] = item['15deposit'];  
                                delete obj['15deposit'];
                                obj['cash15'] = item['15cash'];  
                                delete obj['15cash'];
                                obj['validBetAmount15'] = item['15validBetAmount'];  
                                delete obj['15validBetAmount'];
                                obj['betMultiple15'] = item['15betMultiple'];  
                                delete obj['15betMultiple'];
                                obj['num15'] = item['15num'];  
                                delete obj['15num'];
                                obj['percent15'] = item['15percent'];  
                                delete obj['15percent'];

                                this.newData.push(obj)       
                            })
                            // console.log(this.newData)
            //                 datalist.forEach(t=>{
            //                     for (let key in t){
            // //                         '1deposit'       => '次日留存-存款',
            // // '1cash'      => '次日留存-利润',
            // // '1validBetAmount'      => '次日留存-投注',
            // // '1betMultiple'      => '次日留存-倍数',
            // // '1betCont'      => '次日留存-人数',
            // // '1percent'      => '次日留存-占比',
            
      
                                    
      
                            this.table.data =this.newData;
                        } else {
                            this.table.data = [];
                        }
                        this.table.total = res.data.total;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        // GetPercent(num, total) {
        //     num = parseFloat(num);
        //     total = parseFloat(total);
        //     if (isNaN(num) || isNaN(total)) {
        //         return '-';
        //     }
        //     return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0 + '%';
        // },
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
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.content) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.content && !this.$root.validateName(params.content)) {
                this.$Tip.info({
                    content: `您所查询的${params.typeTag == 'userName' ? '会员' : '代理'}账号不正确，请重新输入`
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
                this.$Tip.info({ content: '请输入开始和结束时间！' });
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
@import '../../../styles/button.less';
@import '../../../styles/retained.less';
/* /deep/.ivu-table-cell{
  
    div{
        height: 86px;
        span{
            display: inline-block;
            line-height: 20px;
            width:120px;
            height: 40px;
            color: #ffffff;
            /* margin-right:1px;
            margin-bottom: 1px;    */
            /* p{
                width:60px;
                height:20px;
                line-height:20px;
                float: left;
            }
        }
    }
} */ 

.bg34{ background-color: #34a7ff;}
.bg12{background-color: #12c6d6;}
.bf0{background-color: #f08484;}
.bg98{background-color:  #98a9bf;}
.bgf08{background-color:#95abf5;}
.bg95{ background-color: #95abf5;}

</style>
