<template>
  <div>
    <div class="v2-search">
      <Form ref="underling" inline>
        <FormItem label="注册会员">
          <Select v-model="underling.member" class="s-140">
            <Option
              v-for="(item,index) in underlingMember"
              :key="index"
              value="item.key"
            >{{item.value}}</Option>
          </Select>
        </FormItem>
                <FormItem label="开始日期">
          <DatePicker type="date" placeholder="开始时间" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" placeholder="结束时间" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem label="模糊">
          <Checkbox></Checkbox>
        </FormItem>
        <FormItem label="会员账号">
          <Input v-model="underling.account" class="s-140" placeholder="账号/姓名"/>
          <Poptip trigger="hover" content="多个请以,逗号隔开,仅支持同类型多个输入" placement="bottom-end">
            <Icons type="tishi" color="#E4E4E4" :size="26"/>
          </Poptip>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search">查询</Button>
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
        <div slot="more" class="clearfix">
          <p class="p5 b">上级/网址：a111111/342432.com?agent=2399</p>
        </div>
      </Tables>
    </div>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import Tables from "@/components/tables";
import { agencyUnderlingData } from "@/api/data";
export default {
  name: "agencyUnderling",
  components: { Icons, Tables },
  data() {
    return {
      underling: {},
      Time: [],
      underlingMember: [
        { key: "one", value: "一级代理" },
        { key: "two", value: "二级代理" },
        { key: "three", value: "三级代理" }
      ],
      table: {
        loading: true,
        more: true,
        title: "下属会员",
        data: [],
        total: 100,
        columns: [
          {
            title: "会员账号",
            key: "account",
            align: "center"
          },
          {
            title: "账号类型",
            key: "type",
            align: "center"
          },
          {
            title: "姓名",
            key: "name",
            align: "center"
          },
          {
            title: "余额",
            key: "balance",
            align: "center"
          },
          {
            title: "存款总额",
            key: "depositSum",
            align: "center",
            width: "200",
            render:(h,params)=>{
              return(
                <div>
                  <span style="color:#666666">{params.row.depositSum.split(",")[0]}</span>
                  <span style="color:#ff2626">{params.row.depositSum.split(",")[1]}</span>
                </div>
              )
            }
          },
          {
            title: "存款大笔",
            key: "glutDeposit",
            align: "center"
          },
          {
            title: "取款总额",
            key: "withdrawalSum",
            width: "200",
            align: "center",
            render:(h,params)=>{
              return(
                <div>
                  <span style="color:#666666">{params.row.withdrawalSum.split(",")[0]}</span>
                  <span style="color:#ff2626">{params.row.withdrawalSum.split(",")[1]}</span>
                </div>
              )
            }

          },
          {
            title: "总输赢",
            key: "sum",
            align: "center"
          },
          {
            title: "注册时间",
            key: "createTime",
            align: "center"
          }
        ]
      }
    };
  },
  methods: {
    getData(query) {
      agencyUnderlingData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
        }, 2000);
      });
    },
    onPageChange(page) {
      this.getData(page)
    },
    onPageSizeChange(){}
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  }
};
</script>
<style lang="less" scoped>
</style>


