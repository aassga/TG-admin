<template>
<div>
   <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="游戏类型">
          <Select style="width:100px" v-model="searchKey.type">
            <Option v-for="item in gameList" :value="item.value" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="游戏平台">
          <Select v-model="searchKey.gamePlatform" class="s-120" clearable>
            <Option
              v-for="(item,index) in gamePlatformList"
              :key="index"
              :value="item.value"
            >{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间">
          <DatePicker type="date" class="s-120" v-model="searchKey.startTime"></DatePicker>
        </FormItem>
          <!-- <span class="ml10 mr10 " style="color:#e4e4e4">—</span> -->
        <FormItem label="结束时间">
          <DatePicker type="date" class="s-120" v-model="searchKey.endTime"></DatePicker>
        </FormItem>

        <FormItem label="账号类型">
          <Select style="width:100px">
            <Option v-for="item in accountList" :value="item.value" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem class="ml10">
          <Checkbox>模糊</Checkbox>
        </FormItem>
        <FormItem label="会员账号">
          <Input v-model="searchKey.account" placeholder="多个请以，逗号隔开" class="s-140"/>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search">查询</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" class="ivu-btn export" @click="exportEXCEL">导出Excel</Button>
        </FormItem>
      </Form>
    </div>
      <div class="v2-table">
           <Tables
          editable
            :columns="table.columns"
            :loading="$root.tableLoading"
            :value="table.data"
            :total="table.total"
             :more="table.more"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          >
            <div slot="footer">
              <span class="td4">总计</span>
              <span class="td3">{{betSum|unit}}</span>
              <span class="td3">{{numberSum|unit}}</span>
              <span class="td3">{{moneySum|unit}}</span>
              <span class="td3">{{betValidSum|unit}}</span>
              <span class="td3">{{menberSySum|unit}}</span>
              <span class="td3">{{rateSum|unit}}%</span>
              <span class="td3">{{hdCashSum|unit}}</span>
              <span class="td3">{{memberBackwaterSum|unit}}</span>
              <span class="td3">{{agencyRebatesSum|unit}}</span>
              <span class="td3">{{agencyBackwaterSum|unit}}</span>
              <span class="td3">{{agencyCashSum|unit}}</span>
              <span class="td3">{{agencyPaySum|unit}}</span>
              <span class="td3">{{agencyProfitSum|unit}}</span>
            </div>
          </Tables>
      </div>
</div>
</template>
<script>
import Tables from "@/components/tables";
import {reportTotalData} from "@/api/data";
import { mapState } from 'vuex';

export default {
  name: "totalReportGameChildren",
  components: {
    Tables
  },
  data(){
    return{
      gamePlatformList: [],
     currentName: "name1",
       betSum: 0,
      numberSum: 0,
      moneySum: 0,
      betValidSum: 0,
      menberSySum: 0,
      rateSum: 0,
      hdCashSum: 0,
      memberBackwaterSum: 0,
      agencyRebatesSum: 0,
      agencyBackwaterSum: 0,
      agencyCashSum: 0,
      agencyPaySum: 0,
      agencyProfitSum: 0,

     table: {
        more: true,
        loading: false,
        total: 100,
        columns: [
           {
            title: "游戏平台",
            // key: "bet",
            align: "center",
          },
          {
            title: "会员账号/类型",
            key: "type",
            align: "center",
            render: (h, params) => {
            return h(
              "a",
              {
                on:{
                  click:()=>{
                   this.$router.push({name:"totalReportChildren"})
                  }
                }
              },
              params.row.type
            )
            }
          },
          {
            title: "投注人数",
            key: "bet",
            align: "center"
          },
          {
            title: "注单数量",
            key: "number",
            align: "center"
          },
          {
            title: "投注金额",
            key: "money",
            align: "center"
          },
          {
            title: "有效投注",
            key: "validPepole",
            align: "center"
          },
          {
            title: "会员输赢",
            key: "menberSy",
            align: "center"
          },
        ],
        data: []
      },
       searchKey: {},
        gameList: [
        {
          value: "真人视讯"
        },
        {
          value: "电子游戏"
        },
        {
          value: "棋牌游戏"
        },
        {
          value: "彩票游戏"
        },
        {
          value: "VR彩票"
        },
        {
          value: "体育赛事"
        }
      ],
       accountList: [
        {
          value: "大股东"
        },
        {
          value: "会员"
        },
        {
          value: "代理"
        }
      ]
    }
  },
  methods:{
     getGamePlatform(type) {
      // this.typeList.map(item => {
      //   if (item.key == type) {
      //     this.gamePlatformList = item.gameList;
      //   }
      // });
    },

    exportEXCEL() {

    },
      getData(query) {
      this.betSum = this.numberSum = this.moneySum = this.betValidSum = this.menberSySum = 0;
        reportTotalData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
          this.table.data.map(item => {
            this.betSum += item.bet * 1;
            this.numberSum += item.number * 1;
            this.moneySum += item.money * 1;
            this.betValidSum += item.betValid * 1;
            this.menberSySum += item.menberSy * 1;
          });
        }, 2000);
      });
    },
       onPageChange(page) {
      let query = {
        page: page
      };
      this.getData(query);

    },
    onPageSizeChange(count) {
      alert(count);
    },
    changeName(name) {
      this.currentName = name;
    },

  },
  watch: {
    "searchKey.type"() {
      this.getGamePlatform(this.searchKey.type);
    }
  },
  computed:{
    ...mapState({
      typeList:state=>state.info.platformReport
    })
  },
  mounted(){
      this.$nextTick(() => {
      reportTotalData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
        }, 2000);
      });
      this.getData();
    });
  }, filters: {
    unit(value) {
      return value.toFixed(2);
    }
  }


  }
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
.td,
.td2 {
  display: inline-block;
  width: 14.28%;
  text-align: center;
  border-right: 1px solid #dcdcdc;
  font-size: .8125rem /* 13/16 */;
}
.td3,
.td4 {
  display: inline-block;
  width: 7.14%;
  text-align: center;
  border-right: 1px solid #dcdcdc;
  font-size: .8125rem /* 13/16 */;
}
</style>
