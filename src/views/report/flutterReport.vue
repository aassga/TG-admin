<template>
  <!-- 流失报表 -->
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label='对比时间'>
          <DatePicker placeholder='开始时间' v-model="Time[0]" class="s-120"></DatePicker>
          <DatePicker placeholder='结束时间' v-model="Time[1]" class="s-120"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker placeholder='开始时间' v-model="Time[3]" class="s-120"></DatePicker>
          <DatePicker placeholder='结束时间' v-model="Time[4]" class="s-120"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="$root.searchBtnLoading" class="ivu-btn search">查询</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="$root.editBtnLoading" class="ivy-btn export">导出Excel</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-search bb">
      <ButtonGroup class="repay-button">
        <Button v-for="(t,i) in btnList" :key="'btn'+i" @click="() => {currentBtn = t}" :class="currentBtn == t ? 'active' : ''">{{t}}</Button>
      </ButtonGroup>
    </div>
    <div class="v2-table">
      <Tables
        :loading='$root.tableLoading'
        :value='table.data'
        :columns='table.columns'
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables';
export default {
  name: 'flutterReport',
  components: {Tables},
  data() {
    return {
      btnList: ['流失会员','新增会员','未登录'],
      currentBtn: '流失会员',
      table: {
        loading: true,
        total: 0,
        data: [],
        columns: [
          {
            title: '会员账号',
            key: '',
            align: 'center'
          },
          {
            title: '姓名',
            key: '',
            align: 'center'
          },
          {
            title: '等级',
            key: '',
            align: 'center'
          },
          {
            title: '余额',
            key: '',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '在线支付',
            key: '',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '公司入款',
            key: '',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '取款金额',
            key: '',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '最大单笔',
            key: '',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '会员输赢',
            key: '',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '更新时间',
            key: '',
            align: 'center'
          }
        ]
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
</style>

