
<template>
  <div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :max-height="maxHeight"
      :loading="loading"
      :show-summary="showSummary"
      :summary-method="handleSummary"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      :draggable="draggable"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-select-all-cancel="onCancelAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
      @on-drag-drop="onDragDrop"
    >
      <template slot-scope="{ row, index }" slot="operation">
        <Icon
          type="md-refresh"
          size="20"
          class="ml5 blue-font"
          :class="isRotate ? 'rotate' : 'rotate1'"
          @click="shuaxin(index, row)"
        />
        <Button size="small" type="primary" @click="clickBJ(row)">编辑</Button>
      </template>

      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading">
        <div
          style="color: rgba(48, 140, 240, 0.7)"
          class="la-line-spin-fade la-sm"
        >
          <div v-for="t in 8" :key="'div' + t"></div>
        </div>
        <!-- <div class="sk-circle">
          <div v-for="t in 13" :key='t' :class="'sk-circle'+t+' '+'sk-child'"></div>
        </div> -->
      </slot>
    </Table>
    <Row style="margin-top: 15px" v-show="value.length > 0">
      <Col v-if="more" span="12">
        <slot name="more"></slot>
      </Col>
      <Col :span="more ? 12 : 24">
        <Page
          ref="page"
          transfer
          v-if="page"
          :total="total"
          showTotal
          :current.sync="currentpage"
          :show-sizer="showSizer"
          :styles="pageStyle"
          :page-size="pageSize"
          :page-size-opts="pageSizeOpts"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
        <span class="page-fix" v-if="pageFixShow">{{ pageFix }}条/页</span>
      </Col>
    </Row>
    <a
      id="hrefToExportTable"
      style="display: none; width: 0px; height: 0px"
    ></a>
  </div>
</template>

<script>
import TablesEdit from "./edit.vue";
import handleBtns from "./handle-btns";
import "./index.less";
export default {
  name: "Tables",
  props: {
    value: {
      type: [Array, Number, String],
      default() {
        return [];
      },
    },
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    pageFix: {
      type: [String, Number],
      default: 10,
    },
    showSizer: {
      type: Boolean,
      default: true,
    },
    size: String,
    width: {
      type: [Number, String],
    },
    height: {
      type: [Number, String],
    },
    maxHeight: {
      type: [Number, String],
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    highlightRow: {
      type: Boolean,
      default: false,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    rowClassName: {
      type: Function,
      default() {
        return "";
      },
    },
    context: {
      type: Object,
    },
    noDataText: {
      type: String,
      default: "",
    },
    noFilteredDataText: {
      type: String,
    },
    disabledHover: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Boolean,
      default: true,
    },
    total: {
      type: [Number, String],
      default: 0,
    },
    pageSizeOpts: {
      type: [Array],
      default: () => [20, 30, 40, 50],
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 是否有左边的统计数据
     */
    more: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    //会员登录日志的固定10页显示
    pageFixShow: {
      type: Boolean,
      default: false,
    },
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      isRotate: false,
      pageStyle: {
        textAlign: "right",
      },
      insideColumns: [],
      insideTableData: [],
      edittingCellId: "",
      edittingText: "",
      currentpage: 1,
    };
  },
  computed: {
    pageSize() {
      return this.pageSizeOpts[0];
    },
  },
  watch: {
    columns(columns) {
      // console.log(columns)
      this.handleColumns(columns);
    },
    value(val) {
      this.handleTableData();
    },
  },
  mounted() {
    //会员登录日志的固定10页显示
    this.showPageFix();
    this.handleColumns(this.columns);
    this.handleTableData();
  },
  methods: {
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable,
          },
          on: {
            input: (val) => {
              this.edittingText = val;
            },
            "on-start-edit": (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`;
              this.$emit("on-start-edit", params);
            },
            "on-cancel-edit": (params) => {
              this.edittingCellId = "";
              this.$emit("on-cancel-edit", params);
            },
            "on-save-edit": (params) => {
              this.value[params.row.initRowIndex][
                params.column.key
              ] = this.edittingText;
              this.$emit("input", this.value);
              this.$emit(
                "on-save-edit",
                Object.assign(params, { value: this.edittingText })
              );
              this.edittingCellId = "";
            },
          },
        });
      };
      return item;
    },
    surportHandle(item) {
      let options = item.options || [];
      let insideBtns = [];
      options.forEach((item) => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item]);
      });
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
      item.render = (h, params) => {
        params.tableData = this.value;
        return h(
          "div",
          btns.map((item) => item(h, params, this))
        );
      };
      return item;
    },
    handleColumns(columns) {
      // console.log(columns)
      this.insideColumns = columns.map((item, index) => {
        let res = item;
        if (res.editable) res = this.suportEdit(res, index);
        if (res.key === "handle") res = this.surportHandle(res);
        return res;
      });
    },
    handleClear(e) {
      if (e.target.value === "") this.insideTableData = this.value;
    },
    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        let res = item;
        res.initRowIndex = index;
        return res;
      });
    },
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params);
    },
    clearCurrentRow() {
      this.$refs.talbesMain.clearCurrentRow();
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("on-current-change", currentRow, oldCurrentRow);
    },
    handleSummary(data) {
      let sums;
      this.$emit("summary-method", data.columns, data.data, (val) => {
        sums = val;
        return sums;
      });
      return sums;
    },
    onSelect(selection, row) {
      this.$emit("on-select", selection, row);
    },
    onSelectCancel(selection, row) {
      this.$emit("on-select-cancel", selection, row);
    },
    onSelectAll(selection) {
      this.$emit("on-select-all", selection);
    },
    onCancelAll(selection) {
      this.$emit("on-select-all-cancel", selection);
    },
    onSelectionChange(selection) {
      this.$emit("on-selection-change", selection);
    },
    onSortChange(column, key, order) {
      this.$emit("on-sort-change", column, key, order);
    },
    onFilterChange(row) {
      this.$emit("on-filter-change", row);
    },
    onRowClick(row, index) {
      this.$emit("on-row-click", row, index);
    },
    onRowDblclick(row, index) {
      this.$emit("on-row-dblclick", row, index);
    },
    onExpand(row, status, frost) {
      this.$emit("on-expand", row, status, frost);
    },
    onPageChange(page) {
      this.$emit("on-page-change", page);
    },
    onPageSizeChange(pageSize) {
      this.$emit("on-page-size-change", pageSize);
    },
    onDragDrop(index1, index2) {
      this.$emit("on-drag-drop", index1, index2, this.value);
    },
    // 切换彩种 页码不更新
    setPage(num) {
      this.currentpage = num == undefined ? 1 : num;
    },
    //会员登录日志的固定10页显示
    showPageFix() {
      if (this.pageFixShow) {
        this.pageStyle = {
          textAlign: "right",
          marginRight: "95.35px",
        };
      }
    },
    shuaxin(index, row) {
      // console.log(row)
      const { _index } = row;

      if (index == _index) {
        this.isRotate = !this.isRotate;
        // console.log(this.isRotate )
      }

      this.$emit("shuaxin", index, row);
    },
  },
};
</script>
<style scoped>
.ivu-table-body {
  overflow: hidden;
}
.ivu-table th,
.ivu-table td {
  height: 40px;
}
.ivu-table-row {
  height: 40px;
}
.ivu-page-options-sizer {
  margin-right: 0px;
}

.ivu-page-item,
.ivu-page-prev,
.ivu-page-next,
.ivu-select-selection {
  border-radius: 0;
  border-color: #dcdcdc !important;
}
/* 会员登录日志的固定10页显示样式 */
.page-fix {
  position: absolute;
  right: 5px;
  bottom: 1px;
  display: block;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 24px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
}

.ivu-table .demo-row-red td {
  background-color: #2db7f5 !important;
  color: #fff;
}

.rotate {
  transition: all 1s;
}
.rotate1 {
  transform: rotate(360deg);
  -ms-transform: rotate(360deg); /* IE 9 */
  -moz-transform: rotate(360deg); /* Firefox */
  -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
  -o-transform: rotate(360deg); /* Opera */
  transition: all 1s;
}
</style>
