<template>
 <div ref="selectNav">
      <div class="h82 bd b">
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
           <span class="pt10 ib"> {{t.name}}</span>
          </div>
        </div>
      </div>
      <span class="btn-right ib ft20 c3Color pl10 lh82 txt-a cs fr" @click="rightmove"> 》</span>
    </div>
 </div>
</template>
<script>
import { getActivityReports } from "@/api/report";
export default{
  data(){
    return{
       width:0,
      selectList: [],
       index:0,
    }
  },
  mounted() {
      let data={siteId:this.$root.nowSite.id,
      startTime:this.$root.monthDayStartTime(),
      endTime:this.$root.monthDayEndTime()
      };
      this.getData(data);
  },
  methods: {
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
  },
    getData(data){
      getActivityReports(data).then(res=>{
        if(res!=undefined&&res.code==200){
            let selectArr = res.data.select;
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
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
@import "../../../../styles/button";


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
