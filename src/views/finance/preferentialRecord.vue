<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="状态">
          <Select clearable class="s-86" v-model="searchKey.status">
            <Option value="success">成功</Option>
            <Option value="fail">失败</Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem>
          <Checkbox>
            <span class="pl5">模糊</span>
          </Checkbox>
        </FormItem>
        <FormItem label="会员账号">
          <Input placeholder="多个请以，逗号隔开" class="s-195" v-model="searchKey.account"/>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search ml10f mb5" @click="searchSubmit">查询</Button>
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
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        :more="table.more"
      >
        <div slot="more">
          <p class="pl10">优惠金额：
            <span class="blue-font">1000000000.00</span>
          </p>
        </div>
      </Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import { preferentialRecordData } from "@/api/data";
export default {
  name: "preferentialRecord",
  components: {
    Tables
  },
  data() {
    return {
      Time: [],
      title: "优惠记录",
      searchKey: {},
      table: {
        total: 0,
        loading: true,
        more: true,
        columns: [
          {
            title: "订单号",
            key: "orderNum",
            align: "center"
          },
          {
            title: "会员账号",
            key: "memberNum",
            align: "center"
          },
          {
            title: "优惠名称",
            key: "preName",
            align: "center"
          },
          {
            title: "优惠金额",
            key: "preMoney",
            align: "center"
          },
          {
            title: "打码倍数",
            key: "multiple",
            align: "center"
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              let color = params.row.status ? "#515a6e" : "#FF2626";
              return (
                <span style={{ color }}>
                  {params.row.status ? "成功" : "失败"}
                </span>
              );
            }
          },
          {
            title: "催账时间",
            key: "reminderTime",
            align: "center"
          },
          {
            title: "审核时间",
            key: "reviewTime",
            align: "center"
          },
          {
            title: "审核者",
            key: "reviewer",
            align: "center"
          },
          {
            title: "备注",
            key: "remarks",
            align: "center",
            tooltip: true,
            width:170,
          }
        ],
        data: []
      }
    };
  },
  methods: {
    getData(query) {
      preferentialRecordData().then(res => {
        this.table.loading = true;
        setTimeout(() => {
          this.table.data = res.data;
          this.table.loading = false;
        }, 2000);
      });
    },
    searchSubmit() {},
    onPageChange(page) {
      let query = {
        page
      };
      this.getData(query);
    },
    onPageSizeChange(count) {
      // alert(count);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  }
};
</script>
<style lang="less" scoped>
.ivu-form-item{
  &:nth-child(4){
    margin-right: -5px;
  }
}

/deep/.ivu-table-cell-tooltip-content{
  padding: 0 20px 0 20px !important;
}
</style>


