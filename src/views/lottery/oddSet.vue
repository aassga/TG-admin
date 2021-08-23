<template>
  <div>
    <div class="v2-search">
      <Form ref="lotterySetting" inline>
        <FormItem label="彩票分类">
          <!-- <Select v-model="lotteryId" class="s-140" clear placeholder='全部'>
            <Option v-for="(t,i) in selectData" :key="'oddSet' + i" :value="t.id">{{t.name}}</Option>
          </!-->
          <LotterySelect ref="LotterySelect" stage="odd" class="s-140" @on-lottery-change="onLotteryChange" @send-all-data='getAllData' @clearSelect='clear'></LotterySelect>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" @click="submit" :loading="table.loading">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables :columns="table.columns" :loading="table.loading" :value="table.data" :page="false"></Tables>
    </div>
  </div>
</template>

<script>
// import { getlotteryClassData } from "@/api/common";
import { lotteryNameList } from "@/api/lottery";
import Tables from "@/components/tables";
import LotterySelect from "@/components/lottery-select";
import { getUserType } from '@/libs/util';
export default {
  name: "oddSet",
  components: {
    Tables,
    LotterySelect
  },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      selectData: [],
      lotteryId: 0,
      allList:[],
      lotteryList: [],
      table: {
        total: 0,
        data: [],
        loading: true,
        columns: [
          {
            title: "彩票名称",
            key: "name",
            align: "center",
            minWidth:120,
          },
          {
            title: "操作",
            align: "center",
            minWidth:120,
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="mr5"
                    style={{
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('lotteryOddsSiteidLid') != -1) ? 'inline-block' : 'none'
                    }}
                    onClick={() => {
                      if(params.row.classUpId=='10010'){
                        this.$router.push({
                          name: "oddsSetting",
                          query: { lotteryId: params.row.id, classId:params.row.classId,lotterName:params.row.name}
                        });
                      }else{
                        this.$router.push({
                          name: "oddsSetting1",
                          query: { lotteryId: params.row.id, classId:params.row.classId,lotterName:params.row.name}
                        });
                      }
                      
                    }}
                  >
                    赔率设置
                  </a>
                </div>
              );
            }
          }
        ]
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.$refs.LotterySelect.init()
      // this.getSelectData()
      // this.getData(false)
    });
  },
  methods: {
    // getSelectData() {
    //   getlotteryClassData().then(res => {
    //     if (res != undefined && res.code == 200) this.selectData = res.data
    //   })
    // },
    // getData(flag) {
    //   this.$root.startTableLoading()
    //   lotteryNameList().then(res => {
    //     if (res != undefined && res.code == 200) {
    //       const { sort1, sort2 } = res.data
    //       if (!flag) this.table.data = [ ...sort1.official, ...sort1.fast]
    //       else {
    //         if (this.lotteryId) this.table.data = sort2[this.lotteryId].list
    //         else this.table.data = [ ...sort1.official, ...sort1.fast ]
    //       }
    //     }
    //     this.$root.endTableLoading()
    //   }).catch(error => this.$root.endTableLoading())
    // },
    submit() {
      this.table.loading = true
      setTimeout(() => {
        if (this.lotteryId) this.table.data = this.lotteryList[this.lotteryId].list
        else this.table.data = this.allList
        this.table.loading = false
      }, 500)
    },
    clear() {
      delete this.lotteryId
    },
    onLotteryChange(res) {
      this.lotteryId = res;
    },
    getAllData(res) {
      this.table.loading = true
      setTimeout(() => {
        const { sort1, sort2 } = res
        this.table.data = [...sort1.official, ...sort1.fast]
        this.allList = JSON.parse(JSON.stringify(this.table.data))
        this.lotteryList = sort2
        this.table.loading = false
      }, 500)
    }
  }
};
</script>