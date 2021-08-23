<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="开始日期">
          <DatePicker type="date" v-model="Time[0]" class="s-140" placeholder="开始日期"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" v-model="Time[1]" class="s-140" placeholder="结束日期"></DatePicker>
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
          :total="table.total"
          :loading="$root.tableLoading"
          :value="table.data"
          :columns='table.columns'
        ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables';
import Icons from "_c/icons";
import { overDueStatic } from '@/api/data';
export default {
  name: 'overDueStatic',
  components: {Tables,Icons},
  data() {
    return {
      searchKey: {},
      Time: [],
      table: {
        total: 100,
        loading:true,
        data: [],
        columns: [
          {
            title: '会员账号',
            key: 'account',
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '借款金额',
            key: 'borrow',
            align: 'center',
            render: (h,params) => <span class="red-font">{params.row.borrow}</span>
          },
          {
            title: '已还金额',
            key: 'repay',
            align: 'center'
          },
          {
            title: '剩余欠款',
            key: 'balance',
            align: 'center',
            render: (h,params) => <span style={{color:'#118C1E'}}>{params.row.balance}</span>
          },
          {
            title: '余额累计还款',
            key: 'balanceBorrow',
            align: 'center'
          },
          {
            title: '金管家累计抵扣',
            key: 'manaAmount',
            align: 'center'
          },
          {
            title: '返水累计抵扣',
            key: 'refundAmount',
            align: 'center'
          },
          {
            title: '提交时间',
            key: 'updateTime',
            align: 'center'
          },
          {
            title: '逾期时间',
            key: 'overDate',
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'update',
            align: 'center'
          }
        ]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      overDueStatic().then(res => {
        res.data.length && res.data.push(this.createTotal('c'));
        res.data.length && res.data.push(this.createTotal('a'));
        this.table.data = res.data
        this.$root.endTableLoading()
      })
    },
    // 本页统计数据
    createTotal(stage) {
      let item = {
        account: '总计',
        name: '-',
        borrow: '1000000.00',
        repay: '100000000.00',
        balance: '100000000.00',
        balanceBorrow: '100000000.00',
        manaAmount: '100000000.00',
        refundAmount: '100000000.00',
        updateTime: '-',
        overDate: '-',
        update: '-'
      }
      stage == 'c' ? item.account = '本页统计' : '总计'
      return item
    }
  }
}
</script>

