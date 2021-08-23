<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="还款状态">
          <Select v-model="searchKey.status" class="s-86">
            <!-- <Option value="0">待审核</Option> -->
            <Option value="1">成功</Option>
            <Option value="2">失败</Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker
            type="date"
            class="s-140"
            placeholder="开始日期"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            type="date"
            class="s-140"
            placeholder="结束日期"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <FormItem label="会员账号">
          <Input
            class="w190x"
            v-model="searchKey.userName"
            @keyup.enter.native="searchSubmit"
            placeholder="请输入会员账号"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="search"
            :loading="$root.tableLoading"
            @click.prevent="searchSubmit"
            >查询</Button
          >
        </FormItem>
      </Form>
    </div>
    <!-- <div class="v2-search bb mb20">
            <ButtonGroup class="repay-button" style="margin-bottom:.3px !important">
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'balance';
                        }
                    "
                    :class="currentBtn == 'balance' ? 'active' : ''"
                    >余额还款</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'management';
                        }
                    "
                    :class="currentBtn == 'management' ? 'active' : ''"
                    >金管家抵扣</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'refund';
                        }
                    "
                    :class="currentBtn == 'refund' ? 'active' : ''"
                    >返水抵扣</Button
                >
            </ButtonGroup>
        </div> -->
    <balanceRepay v-show="currentBtn == 'balance'" ref="balance"></balanceRepay>
    <managementRepay
      v-show="currentBtn == 'management'"
      ref="management"
    ></managementRepay>
    <refundRepay v-show="currentBtn == 'refund'" ref="refund"></refundRepay>
  </div>
</template>
<script>
import balanceRepay from "../components/balanceRepay";
import managementRepay from "../components/managementRepay";
import refundRepay from "../components/refundRepay";
export default {
  name: "activityRepay",
  components: {
    balanceRepay,
    managementRepay,
    refundRepay,
  },
  data() {
    return {
      searchKey: {
        status: "1",
        siteId: this.$root.nowSite.id,
        startTime: this.$root.yesterdayStartTime(),
        endTime: this.$root.formatnightTimeS(),
      },
      Time: [this.$root.yesterdayStartTime(), new Date()],
      //当前按钮
      currentBtn: "balance",
      payType: 8,
    };
  },
  watch: {
    currentBtn: {
      handler(val, oldVal) {
        switch (val) {
          case "balance":
            this.payType = 8;
            break;
          case "management":
            this.payType = 6;
            break;
          default:
            this.payType = 7;
            break;
        }
        this.searchSubmit();
      },
    },
  },
  mounted() {
    let data = { ...this.searchKey, pay_type: this.payType };
    this.$refs.balance.getData({ params: data });
  },
  methods: {
    searchSubmit() {
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
        pay_type: this.payType,
      };
      let { startTime, endTime } = data;
      if (startTime == "Invalid date" || endTime == "Invalid date") {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }
      if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        this.$Tip.info({ content: "结束时间必须大于开始时间" });
        return false;
      }
      if (data.startTime == "Invalid date") delete data.startTime;
      if (data.endTime == "Invalid date") delete data.endTime;
      let reg = /^[0-9A-Za-z-_]{5,20}$/;
      if (data.userName) data.userName = this.$root.trimAll(data.userName);
      if (data.userName && !reg.test(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.$refs[this.currentBtn].getData({ params: data });
      // this.$refs[this.currentBtn].resetTable()
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
</style>


