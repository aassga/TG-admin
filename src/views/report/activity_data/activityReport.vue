<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem v-for="(t, i) in btnList" :key="i">
          <Button class="fontColor" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click="changeBtn(t)">
            <span>{{ t }}</span>
          </Button>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker
            placeholder="开始日期"
            :options="options1"
            @on-change="startChange"
            class="s-120"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            placeholder="结束日期"
            :options="options2"
            @on-change="startChange"
            class="s-120"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="ivu-btn search"
            @click.prevent="searchSubmit"
          >查询</Button>
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
    <div class="mt10 p10 bd h150 b txt-a" v-if="!isShow">
      <img style="" src="../../../assets/images/no-dada.png" alt />
    </div>
    <div class="h82 bd b" v-if="isShow">
      <span class="btn-left ib ft20 c3Color pr10 lh82 txt-a cs fl" @click="leftmove">《 </span>
      <div class="wrap-scroll pt10 pl30 ib" ref="box">
        <div class="nav" :style="{'transform': 'translateX('+width+')'}">
          <div
            class="cs ib w120x h60 lh15 txt-a ft14 mr10 p10 b bd"
            :class="t.checked?'b white-font bgSend':''"
            v-for="(t,i) in selectList"
            :key="i"
            @click="() => checkOne(t,i,t.checked,t.name)"
          >
            <span>{{Number(t.money)}}</span>
            <br />
           <span class="pt10 ib"> {{t.name}}</span>
          </div>
        </div>
      </div>
      <span class="btn-right ib ft20 c3Color pl10 lh82 txt-a cs fr" @click="rightmove"> 》</span>
    </div>

    <div class="v2-table mt20" v-if="isShow">
      <Tables
        ref="table"
        :stripe="false"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        :row-class-name="rowClassName"
        :page="false"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import { getActivityReports } from "@/api/report";
import { checkDayBtn } from "@/libs/util";
import Tables from "_c/tables";
import { Tooltip, Divider } from "view-design";
export default {
  name: "activelyReport",
  components: { Tables, Icons },
  data() {
    return {
      width:0,
      len:0,
      index:0,
      btnName:'',
      isShow:true,
      isSearh:false,
      idList:[],
      val:[],
      copyList: [],
      screen: screen.width,
      page: 1,
      btnList: ["本月", "上月"],
      btnNae: "本月",
      Time: [],
      searchKey: {
        siteId: this.$root.nowSite.id,
        type: ""
      },
      table: {
        loading: true,
        data: [],
        columns: []
      },
      selectList: [],
      activityList: [],
      columnList: [],
      options1:{
        disabledDate:date =>{
           return date && date.valueOf() > Date.now() || date.valueOf() < new Date(this.$root.sixmonth());
        }
      },
      options2:{
        disabledDate:date =>{
           return date && date.valueOf() > Date.now() || date.valueOf() < new Date(this.$root.sixmonth())
        }
      },
      selectLen:'',
    };
  },
  mounted() {
    //获取默认显示的本月时间
    this.changeBtn("本月");


  },
  methods: {
    rowClassName(row,index){
      //console.log(index)
      if (index%2 != 0) {
        return 'demo-table-info-row';
                }
        return 'demo-table-all';
    },

    startChange(time, type) {
      this.btnName = checkDayBtn(this.Time, "cn", this);
    },
    changeBtn(name) {
      if (this.page != 1) this.$refs.table.setPage();
      this.btnName = name;
      // this.searchKey.startTime =
      //   name == "本月"
      //     ? this.$root.monthDayStartTime()
      //     : this.$root.lastMonthDayStartTime();
      // if (
      //   (this.searchKey.endTime =
      //     name == "本月" &&
      //     this.$root.todayStartTime() == this.$root.monthDayStartTime())
      // ) {
      //   this.searchKey.endTime =
      //     name == "本月"
      //       ? this.$root.todayStartTime()
      //       : this.$root.lastMonthDayEndTime();
      // } else {
      //   this.searchKey.endTime =
      //     name == "本月"
      //       ? this.$root.yesterdayStartTime()
      //       : this.$root.lastMonthDayEndTime();
      // }
       this.searchKey.startTime =
        name == "本月"
          ? this.$root.monthDayStartTime()
          : this.$root.lastMonthDayStartTime();
      this.searchKey.endTime =
        name == "本月"
          ? this.$root.monthDayEndTime()
          : this.$root.lastMonthDayEndTime();

      if (this.searchKey.sortKey) delete this.searchKey.sortKey;
      if (this.searchKey.sortVal) delete this.searchKey.sortVal;
      this.Time[0] = this.searchKey.startTime;
      this.Time[1] = this.searchKey.endTime;
      this.getData(this.searchKey);

      //  let num = Math.ceil((this.$refs.box.offsetWidth-30)/130);
        let num = ((this.$refs.box.offsetWidth-30)/130).toFixed(1);
        this.selectLen = this.selectList.length - num;
        this.width = 0;
    },
    getData(data) {
      this.$root.startTableLoading();
      getActivityReports(data)
        .then(res => {
          if (res != undefined && res.code == 200) {
            if(JSON.stringify(res.data) == '{}') this.isShow = false;
            else this.isShow = true;

           if(this.isSearh) this.$Message.success('查询成功');

            let obj = res.data.list;
            let objArr = [];
            for (let key in obj) {
              objArr.push(obj[key]);
            }
            this.table.data = objArr;

            let selectArr = res.data.select;
            console.log(selectArr)
            let arr = [];
             for(let key in selectArr){
                if(key<9){
                    selectArr[key].checked = true;
                }else{
                   selectArr[key].checked = false;
                }
               arr.push(selectArr[key]);
            }
            this.selectList = arr;
            console.log(this.selectList)

              let listArr = [];
              let idArr = [];
              for (let key in this.selectList) {
                if (key < 9) {
                  listArr.push(this.selectList[key].name);
                  idArr.push(this.selectList[key].id);
                }
              }
              this.activityList = listArr;
              this.idList = idArr;
            let columns = {};
            let colArr = [
              {
                title: "日期",
                align: "center",
                key: "data_date",
                className: 'demo-table-info-column',
                minWidth: 80,
                render: (h, params) => {
                  let data_date = params.row[0].data_date;
                  return (
                    <span class="ml5">
                      {this.$moment.unix(data_date).format("YYYY-MM-DD")}
                    </span>
                  );
                }
              }
            ];
            let allArr = [];
            for (let key in this.selectList) {
              if (key < this.idList.length) {
                // console.log(this.selectList[key].name)
                let columns = {
                  title: this.selectList[key].name,
                  id:this.selectList[key].id,
                  align: "center",
                  minWidth:90,
                  children:[
                    {
                      title:'金额',
                      align:'center',
                      minWidth:60,
                      render:(h,params) => {
                        if(this.selectList[key].name=='优惠总额'){
                          return <span style="width:100%">{Number(params.row[Number(key) + 1].money)}</span>
                        }else{
                          return(
                          <span>

                            <Tooltip trigger="hover" class="cs" placement="right-start" transfer style={{display:params.row[Number(key) + 1].accounted==undefined?'none':'block'}}>
                              {Number(params.row[Number(key) + 1].money)}
                            <div slot="content">占比{params.row[Number(key) + 1].accounted}</div>
                          </Tooltip>
                          </span>
                        )
                        }


                      }
                    },
                    {
                      title:'人数',
                      align:'center',
                      minWidth:30,
                      render:(h,params) => {
                        return <span style="width:100%">{params.row[Number(key) + 1].num}</span>
                      }
                    }
                  ]

                };

                colArr.push(columns);
              }
              let allColumns = {
                  title: this.selectList[key].name,
                  id:this.selectList[key].id,
                  align: "center",
                  minWidth:90,
                  children:[

                    {
                      title:'金额',
                      align:'center',
                      minWidth:60,
                      render:(h,params) => {
                        if(this.selectList[key].name=='优惠总额'){
                          return <span style="width:100%">{Number(params.row[Number(key) + 1].money)}</span>
                        }else{
                          return(
                          <span>

                            <Tooltip trigger="hover" class="cs" placement="right-start" transfer style={{display:params.row[Number(key) + 1].accounted==undefined?'none':'block'}}>
                              {Number(params.row[Number(key) + 1].money)}
                            <div slot="content">占比{params.row[Number(key) + 1].accounted}</div>
                          </Tooltip>
                          </span>
                        )
                        }
                      //   console.log(params.row[Number(key) + 1].accounted)
                      //   return(
                      //     <span>
                      //       <Poptip trigger="hover" placement="right-start">
                      //       {Number(params.row[Number(key) + 1].money)}
                      //       <div slot="content">{Number(params.row[Number(key) + 1].accounted)}</div>
                      //     </Poptip>
                      //     </span>
                      //   )
                      // }
                    }},
                    {
                      title:'人数',
                      align:'center',
                      minWidth:30,
                      render:(h,params) => {
                        return <span>{params.row[Number(key) + 1].num}</span>
                      }
                    }
                  ]

                };
              allArr.push(allColumns);
            }
            this.table.columns = colArr;
            this.columnList = allArr;

            //显示多个活动分类
            // let num = Math.floor((this.$refs.box.offsetWidth-30)/130);
            let num = ((this.$refs.box.offsetWidth-30)/130).toFixed(1);
            this.selectLen = this.selectList.length - num;
          }

          this.$root.endTableLoading();
        })
        .catch(error => this.$root.endTableLoading());
    },
    checkOne(t,index,checked,name) {
        if(this.activityList.length<=5&&t.checked){
            this.$Message.warning('最少选择5项活动');
            return;
        }
         if(!t.checked){
             this.activityList.splice(index,0,t.name);
        }else{
            if(this.activityList.length>5&&t.checked==true){
                let i = this.activityList.indexOf(t.name)
                if(i!=-1) this.activityList.splice(i,1);
            }
        }


        if(!t.checked){
            let i = this.idList.indexOf(t.id)
            this.idList.splice(index,0,t.id)
        }else{
            let i = this.idList.indexOf(t.id)
            if(i!=-1) this.idList.splice(i,1)
        }
      for(let key in this.selectList){
          if(index == key){
              this.selectList[key].checked = !this.selectList[key].checked;
          }
      }

      let list = [];
      this.selectList.forEach(t=>{
        if(t.checked){
          list.push(t);
        }
      })

      let arr = [
          {
                  title: '日期',
                  align: 'center',
                  key: 'data_date',
                  minWidth: 80,
                  className: 'demo-table-info-column',
                  render: (h, params) => {
                      let data_date = params.row[0].data_date
                      return <span class="ml5">{this.$moment.unix(data_date).format('YYYY-MM-DD')}</span>;
                  }
              }
      ];

      list.forEach(k => {
          this.columnList.forEach((t,i)=>{
             if(k.name==t.title&&k.id==t.id){
                arr.push(t);
              }
          })
      });
      //console.log(arr);
      this.table.columns = arr;
    },
    searchSubmit() {
      this.isSearh = true;
      let data = { ...this.searchKey, type: this.idList.join(",") };
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        data.startTime = startTime && this.$root.formatTimeX(startTime);
        data.endTime = endTime && this.$root.formatnightTimeS(endTime);
      } else {
        return false;
      }
      this.getData(data);
    },
    exportExcel() {
      let data = { ...this.searchKey, type: this.idList.join(",") };
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        data.startTime = startTime && this.$root.formatTimeX(startTime);
        data.endTime = endTime && this.$root.formatnightTimeS(endTime);
      } else {
        return false;
      }
      data.isExport = 1;

      let startDate = data.startTime.split(' ')[0].split('-')[1]+'-'+data.startTime.split(' ')[0].split('-')[2];
      let endDate = data.endTime.split(' ')[0].split('-')[1]+'-'+data.endTime.split(' ')[0].split('-')[2];
      let text = `您确定导出${startDate}至${endDate}的活动报表吗`
      this.$Tip.confirm({
        content:text,
        onOk:()=>{
          this.$root.startEditLoading();
          let openr = window.open();
          getActivityReports(data,true)
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
            }
      })

    },
    //左右移动
    leftmove() {
        if (this.index < 0) {
          if(Math.abs(this.index)>5) {
            this.index += 5;
            this.width = this.index * 132 + 'px';
          }else{
            this.index += Math.abs(this.index);
            this.width = this.index * 132 + 'px';
          }
        }
    },
   rightmove() {
        if ((this.index+this.selectLen)>0) {
            if(this.index+this.selectLen>5){
              this.index -= 5;
              this.width = this.index * 132 + 'px';
              } else{
              this.index -= this.index+this.selectLen;
              this.width = this.index * 132 + 'px';
            }
        }
  }

  }

};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";


.bd-bg {
  background-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.bg-or {
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
.wrap-scroll {
  width: 94%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
}
.nav{
  -webkit-transition: -webkit-transform 0.5s ease-in-out;
    transition: -webkit-transform 0.5s ease-in-out;
    transition: transform 0.5s ease-in-out;
    transition: transform 0.5s ease-in-out, -webkit-transform 0.5s ease-in-out;
}
.btn-left {
  border-right: 1px solid #dcdcdc;
}
.btn-right {
  border-left: 1px solid #dcdcdc;
}

/deep/.v2-table .ivu-table-header thead tr:nth-child(1) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 1rem;
    }
}
/deep/.v2-table .ivu-table-header thead tr:nth-child(2) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 0.9375rem;
    }
}
/deep/.ivu-table-tbody{
  font-size: 13px !important;
  /deep/.ivu-table-row{
    font-size: 13px !important;
    /deep/.ivu-table-cell{
      /* text-align:left!important; */
      font-size: 13px !important;
      span{
        font-size:13px !important;
      }
    }
  }
}


    /deep/.ivu-table td.demo-table-info-column{
        text-align:center!important;
        color: #fff;
    }

</style>

