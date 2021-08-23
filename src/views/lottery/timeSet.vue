<template>
  <div>
    <div class="v2-search">
      <Form ref="lotterySetting" inline>
        <FormItem label="彩票分类">
          <LotterySelect ref="LotterySelect" class="s-140" stage="odd" @on-lottery-change="onLotteryChange"  @send-all-data='getAllData' @clearSelect='clear'></LotterySelect>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" @click.prevent="submit" :loading="table.loading">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="table.loading"
        :value="table.data"
        :page="false"
      ></Tables>
    </div>
  </div>
</template>
<script>
import { lotteryNameList } from "@/api/lottery";
import Tables from "@/components/tables";
import LotterySelect from "@/components/lottery-select";
import { getUserType } from "@/libs/util";
import { mapState } from "vuex";
export default {
  name: "timeSet",
  components: {
    Tables,
    LotterySelect
  },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      lotteryList: [],
      lotteryId: null,
      table: {
        loading: true,
        data: [],
        columns: [
          {
            title: "彩票名称",
            key: "name",
            align: "center",
            minWidth: 120
          },
          {
            title: "操作",
            align: "center",
            minWidth: 120,
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="mr5"
                    style={{
                      display:
                        this.adminType == "super" ||
                        (this.authInPage.indexOf("lotteryTimeList") != -1 &&
                          params.row.name != "香港六合彩") ||
                        (this.authInPage.indexOf("lotteryLhcTimeList") != -1 &&
                          params.row.name == "香港六合彩")
                          ? "inline-block"
                          : "none"
                    }}
                    onClick={e => {
                      let { name, id } = params.row;
                      if (params.row.name == "香港六合彩") {
                        this.$router.push({
                          name: "markTimeSetting",
                          query: { name }
                        });
                      } else {
                        // 低频彩需要显示开奖日期
                        if (this.table.data[0].classId == 10009) {
                          this.$router.push({
                            name: "timesSettingAno",
                            query: { lid: id, name, type: "低频彩" }
                          });
                        } else {
                          this.$router.push({
                            name: "timesSettingAno",
                            query: { lid: id, name }
                          });
                        }
                      }
                    }}
                  >
                    时间设置
                  </a>
                </div>
              );
            }
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      tagNavList: state => state.app.tagNavList
    })
  },
  mounted() {
    this.$refs.LotterySelect.init();
  },
  methods: {
    submit() {
      this.table.loading = true
      setTimeout(() => {
        if (this.lotteryId) this.table.data = this.lotteryList[this.lotteryId].list
        else this.table.data = this.allList
        this.table.loading = false
      }, 500)
    },
    onLotteryChange(res) {
      this.lotteryId = res;
    },
    clear() {
      delete this.lotteryId
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
