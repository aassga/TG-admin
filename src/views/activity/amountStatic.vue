<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="开始日期">
          <DatePicker type="date" class="s-140" placeholder="开始日期" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" class="s-140" placeholder="结束日期" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem>
          <Checkbox v-model="searchKey.isLike"></Checkbox>
          <span>模糊</span>
        </FormItem>
        <FormItem label="会员账号">
          <Input placeholder="账号/姓名" class="s-140" v-model="searchKey.account"/>
        </FormItem>
        <FormItem>
          <Poptip
            trigger="hover"
            content="多个请以,逗号隔开,仅支持同类型多个输入"
            placement="bottom-start"
            class="ml14f"
          >
            <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
          </Poptip>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" :loading='$root.tableLoading'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        :loading="$root.tableLoading"
        :total="table.total"
        :value="table.data"
        :columns="table.columns"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Icons from "_c/icons";
import { overDueStatic } from "@/api/data";
export default {
  name: "amountStatic",
  components: { Tables, Icons },
  data() {
    return {
      Time: [],
      searchKey: {},
      table: {
        loading: true,
        total: 100,
        data: [],
        columns: [
          {
            title: '会员账号',
            key: 'account',
            align: 'center'
          },
          {
            title: '总借款',
            key: 'borrow',
            align: 'center'
          },
          {
            title: '总还款',
            key: 'repay',
            align: 'center'
          },
          {
            title: '总欠款',
            key: 'balance',
            align: 'center'
          },
          {
            title: '余额还款',
            key: 'balanceBorrow',
            align: 'center'
          },
          {
            title: '金管家抵扣',
            key: 'manaAmount',
            align: 'center'
          },
          {
            title: '返水抵扣',
            key: 'refundAmount',
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'update',
            align: 'center'
          }
        ]
      }
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      overDueStatic().then(res => {
        res.data.length && res.data.push(this.allData('c'))
        res.data.length && res.data.push(this.allData('a'))
        this.table.data = res.data;
        this.$root.endTableLoading()
      });
    },
    allData(stage) {
      let item = {
        account: '总计',
        borrow: '100000000.00',
        repay: '100000000.00',
        balance: '100000000.00',
        balanceBorrow: '100000000.00',
        manaAmount: '100000000.00',
        refundAmount: '100000000.00',
        update: '-'
      }
      stage == 'c' ? item.account = '本页统计' : '总计'
      return item
    }
  }
};
</script>

