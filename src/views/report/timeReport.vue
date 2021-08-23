<template>
  <div>
    <!-- 时间存取报表 -->
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem v-for="(t,i) in btnList" :key="'btn'+i">
          <Button :class="btnName == t ? 'bd-bg' : 'bg-or'" @click="changeBtn(t)">{{t}}</Button>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="$root.searchBtnLoading" class="ivu-btn search">查询</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="$root.editBtnLoading" class="ivy-btn export">导出Excel</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table"></div>
  </div>
</template>
<script>
import Tables from "_c/tables";
export default {
  name: "timeReport",
  components: { Tables },
  data() {
    return {
      btnList: ["本月", "上月"],
      btnName: "本月",
      searchKey: {
        siteId: this.$root.nowSite.id
      },
      table: {
        loading: true,
        data: [],
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "日期",
            key: "",
            align: "center"
          },
          {
            title: "平均存款审核时间",
            key: "",
            align: "center"
          },
          {
            title: "平均取款审核时间",
            key: "",
            align: "center"
          }
        ]
      }
    };
  },
  methods: {
    changeBtn(name) {
      this.btnName = name;
      switch (name) {
        case "本月":
          this.searchKey.startTime = this.$moment()
            .month(this.$moment().month())
            .startOf("month")
            .set("hours", 0)
            .set("minutes", 0)
            .set("seconds", 0)
            .format("YYYY-MM-DD HH:mm:ss");
          this.searchKey.endTime = this.$moment()
            .endOf("day")
            .set("hours", 23)
            .set("minutes", 59)
            .set("seconds", 59)
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "上月":
          this.searchKey.startTime = this.$moment()
            .month(this.$moment().month() - 1)
            .startOf("month")
            .set("hours", 0)
            .set("minutes", 0)
            .set("seconds", 0)
            .format("YYYY-MM-DD HH:mm:ss");
          this.searchKey.endTime = this.$moment()
            .month(this.$moment().month() - 1)
            .endOf("month")
            .set("hours", 23)
            .set("minutes", 59)
            .set("seconds", 59)
            .format("YYYY-MM-DD HH:mm:ss");
          break;
      }
      this.Time[0] = this.searchKey.startTime;
      this.Time[1] = this.searchKey.endTime;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
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


