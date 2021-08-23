<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <div class="v2-button mb5">
          <Button
            @click="$router.push({ path: 'paymentAdd' })"
            v-if="
              adminType == 'super' ||
              authInPage.indexOf('paymentChannelCreate') != -1
            "
            >添加支付平台</Button
          >
          <span v-if="rentType != 'rent'">
            <Button
              @click="$router.push({ path: 'paymentGroups' })"
              v-if="
                adminType == 'super' ||
                authInPage.indexOf('paymentClassDelete') != -1
              "
              >支付方式</Button
            >
          </span>
        </div>
        <FormItem label="支付方式">
          <Select
            clearable
            v-model="searchKey.typeId"
            class="s-140"
            placeholder="全部"
          >
            <Option v-for="(item, i) in payWay" :key="i" :value="item.id">{{
              item.className
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="支付平台">
          <Select
            clearable
            v-model="searchKey.payName"
            class="s-140"
            placeholder="全部"
            filterable
          >
            <Option
              v-for="(item, i) in payList"
              :key="i"
              :value="item.payName"
              >{{ item.payName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="search"
            :loading="$root.tableLoading"
            @click="searchSubmit"
            >查询</Button
          >
        </FormItem>
      </Form>
    </div>
    <div class="v2-search bb">
      <ButtonGroup class="repay-button1" style="margin-bottom: 0.3px">
        <Button
          class="fontColor"
          :class="status ? 'active' : ''"
          @click="statusOn"
          >正常</Button
        >
        <Button
          class="fontColor"
          :class="status ? '' : 'active'"
          @click="statusOff"
          >停用</Button
        >
      </ButtonGroup>
    </div>
    <div class="v2-table">
      <Tables
        v-if="status"
        ref="tables"
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-edit="edit"
        @on-change-status="changeStatus"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        @on-delete="deletei"
        :draggable="true"
        @on-drag-drop="onDragDrop"
      ></Tables>

      <Tables
        v-else
        ref="tables"
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-edit="edit"
        @on-page-change="onPageChange"
        @on-change-status="changeStatus"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-size-change="onPageSizeChange"
        @on-delete="deletei"
        :draggable="true"
        @on-drag-drop="onDragDrop"
      ></Tables>
    </div>
    <Modals ref="paymentModifyModal" title="支付修改" :width="700">
      <div
        slot="content"
        class="modal-overflow"
        :style="
          (payform.paymentClass && payform.paymentClass.length > 3) ||
          (newplatdata.newarray && newplatdata.newarray.length) > 3
            ? 'height:500px;overflow-y: auto !important'
            : ''
        "
      >
        <Form
          ref="paymentModifyForm"
          :model="paymentModifyForm"
          :label-width="200"
        >
          <FormItem label="支付平台">
            <span class="ft14">{{ payform.payName }}</span>
          </FormItem>
          <FormItem label="支付方式">
            <div class="ml5">
              <paymentRadio
                style="width: 360px"
                :methodsdetail="paymentlist"
                :defaultChecked="methodsid"
                @sendArray="getArray"
                ref="payment"
              ></paymentRadio>
            </div>
          </FormItem>
          <!-- <FormItem class="ml5" label="银行编码" v-if="showID" prop="bankCode">
            <Input
              class="w360x ml10"
              :rows="4"
              type="textarea"
              placeholder="请输入银行编码"
              v-model="platform.bankCode"
            />
					</FormItem>-->
          <FormItem>
            <Button
              type="primary"
              :loading="$root.editBtnLoading"
              class="ivu-btn submit ml40 h50"
              @click="save"
              >确认保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import paymentRadio from "./components/payment-radio-group";
import Modals from "@/components/modals";
import tableMixins from "@/mixins/table";
import Sortable from "sortablejs";
import { getUserType } from "@/libs/util";
import {
  paymentChannelSequence,
  sitePlatformList,
  paymentManagerData,
  changpaymentstatus,
  deletepayment,
  updatepayment,
  getpaymentID,
  getpaymentName,
} from "@/api/finance";
export default {
  // name: "paymentManager",
  mixins: [tableMixins],
  components: {
    Tables,
    Modals,
    Icons,
    paymentRadio,
  },
  data() {
    return {
      rentType: localStorage.loginType,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      searchKey: {
        status: "yes",
      },
      platform: {
        bankCode: "",
      },
      payform: "",
      flag: false,
      newplatdata: "",
      showID: false,
      paymentInfo: {
        id: "",
        siteId: "",
        siteName: "",
        classId: "",
        payName: "",
        status: "yes",
        businessNo: "",
        redirect_domain: "",
        remarks: "",
        queryName: "",
      },
      payWay: "", //支付方式
      pageSize: "",
      payList: [], //支付平台
      buttonText: "确认添加",
      insideColumns: "",
      detailData: {},
      paymentForm: { b: [] },
      status: true,
      modalTitle: "支付修改",
      paymentModifyForm: {},
      paymentlist: [],
      methodsid: [],
      table: {
        loading: true,
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "排序",
            align: "center",
            width: 60,
            render: (h, params) => {
              return h(Icons, {
                props: {
                  type: "paixukongjian",
                  color: "#dadada",
                  size: 20,
                },
              });
            },
          },
          {
            title: "商户编号",
            key: "businessNo",
            align: "center",
            minWidth: 120,
            tooltip: true,
            className: "pl10 pr10",
          },
          {
            title: "支付平台",
            key: "payName",
            align: "center",
            minWidth: 70,
            tooltip: true,
            className: "pr5 pl5",
          },
          {
            title: "支付方式",
            key: "paymentClass",
            align: "center",
            minWidth: 85,
            render: (h, params) => {
              return params.row.paymentClass
                ? params.row.paymentClass.length
                  ? params.row.paymentClass.map((item) => {
                      return h(
                        "div",
                        {
                          style: {
                            color: "#444",
                            // borderBottom: "1px solid #dcdcdc"
                          },
                        },
                        item.name
                      );
                    })
                  : h("span", "-")
                : h("span", "-");
            },
          },
          {
            title: "支付金额",
            key: "paymentClass",
            align: "center",
            className: "pl20 pr20",
            minWidth: screen.width < 1600 ? 190 : 310,
            render: (h, params) => {
              return params.row.paymentClass
                ? params.row.paymentClass.length
                  ? params.row.paymentClass.map((item) => {
                      return h(
                        "div",
                        {
                          style: {
                            color: "#444",
                            paddingLeft: "6px",
                            paddingRight: "6px",
                          },
                        },
                        item.amount_limit
                      );
                    })
                  : h("span", "-")
                : h("span", "-");
            },
          },
          // {
          // 	title: "常用金额",
          // 	key: "paymentClass",
          //   align: "center",
          //   className: "pl20 pr20",
          //   minWidth: screen.width < 1600 ? 150 : 280,
          //   	render: (h, params) => {
          //       const {paymentClass}=params.row;
          // 		return paymentClass
          // 			? paymentClass.length
          // 				? paymentClass.map(item => {
          // 						return h(
          // 							"div",
          // 							{
          // 								style: {
          // 									color: "#444"
          // 								}
          // 							},
          // 							item.quick_amount ?item.quick_amount:"-"
          // 						);
          // 				  })
          // 				: h("span", "-")
          // 			: h("span", "-");
          // 	}
          // },
          {
            title: "状态",
            key: "status",
            align: "center",
            width: 80,
            render: (h, params) => {
              return (
                <span class={params.row.status === "yes" ? "" : "red-font"}>
                  {params.row.status === "yes" ? "正常" : "停用"}
                </span>
              );
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 165,
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("paymentChannelModifyStatus") !=
                          -1
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.changeStatus(params);
                    }}
                  >
                    {params.row.status == "yes" ? "停用" : "启用"}
                  </a>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("thirdPaymentChannelUpdate") !=
                          -1
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.edit(params);
                    }}
                  >
                    编辑
                  </a>
                  <a
                    class="in mr5"
                    onClick={() => {
                      this.deletei(params);
                    }}
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("paymentChannelDelete") != -1
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    删除
                  </a>
                  <a
                    class="in mr5"
                    style={{
                      color: "#2D8cF0",
                      cursor: "pointer",
                      marginLeft: "5px",
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("singlePaymentChannelUpdate") !=
                          -1
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.platform.bankCode = params.row.bankCode;
                      this.payform = params.row;
                      this.methodsid = [];
                      this.paymentlist = [];
                      params.row.paymentClass.map((item) => {
                        this.methodsid.push(item.id);
                        this.paymentlist.push(item);
                        if (item.name == "网银在线") this.showID = true;
                        else this.showID = false;
                      });
                      if (this.methodsid.length > 0) {
                        this.$refs.paymentModifyModal.show(this.payform);
                      }
                    }}
                  >
                    支付修改
                  </a>
                </div>
              );
            },
          },
        ],
        data: [],
      },
    };
  },
  created() {
    if (this.$route.query.status) {
      this.searchKey.status = this.$route.query.status;
      this.status = this.$route.query.status == "yes" ? true : false;
    }
    this.getselectdata();
    this.getselectlist();
    this.$Message.config({
      top: 50,
      duration: 1,
    });
  },
  methods: {
    //获取支付平台下拉列表平台
    getselectlist() {
      getpaymentName({ siteId: this.$root.nowSite.id }).then((res) => {
        this.payList = res.data;
      });
    },
    getQuery(params) {
      this.searchkey = {
        siteId: this.$root.nowSite.id,
        status: params.status,
        levelLabel: params.levelLabel,
      };
      let data = { params: this.searchkey };
      this.getData(data);
    },
    getData(data) {
      let params = {
        ...data,
      };

      this.$root.startTableLoading();
      paymentManagerData(data)
        .then((res) => {
          this.table.data = res.data.data;
          this.table.total = res.data.total;
          this.$root.endTableLoading();
        })
        .catch((err) => this.$root.endTableLoading());
    },
    //修改状态
    changeStatus(params) {
      let text, msg;
      const { status, id, payName } = params.row;
      if (status === "yes") {
        text = `您确定停用${payName}吗？`;
        msg = `停用${payName}成功`;
      }
      if (status === "no") {
        text = `您确定启用${payName}吗？`;
        msg = `启用${payName}成功`;
      }

      const data = {
        siteId: this.$root.nowSite.id,
        id,
        status: status === "yes" ? "no" : "yes",
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          changpaymentstatus(data, true).then((res) => {
            if (res != undefined && res.code == 200) {
              if (typeof res.data === "string") {
                this.$Message.config({
                  top: 150,
                });
                this.$Message.success({ content: msg });

                params.row.status = status === "yes" ? "no" : "yes";
                this.table.data.splice(params.index, 1);
                this.searchSubmit();
                this.table.total--;
                if (this.table.data.length < 1) {
                  this.searchSubmit();
                }

                // if (this.table.data.length < 1) {
                //   this.searchSubmit();
                //   this.setPage--;

                // }
                // let page = this.setPage;
                // this.getData({ params: newData, query: { page } });
              }
            }
          });
        },
      });
    },
    //编辑
    edit(params) {
      this.$router.push({
        name: "paymentEdit",
        query: {
          id: params.row.id,
        },
      });
    },
    // 删除
    deletei(params) {
      const data = { id: params.row.id, siteId: this.$root.nowSite.id };
      let text = "您确定删除" + params.row.payName + "吗？";
      let msg = `删除${params.row.payName}成功`;
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          deletepayment(data, true).then((res) => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(msg);
              let newStatus = { status: params.row.status };
              let newData = Object.assign(newStatus, data);
              if (res != undefined && res.code == 200) {
                this.table.total--;
                this.table.data.splice(params.index, 1);

                //翻页第二页的数据，21条，删除，页面和条数进行对应的变化
                if (this.table.data.length < 1) {
                  this.searchSubmit();
                  this.setPage--;
                }

                let page = this.setPage;
                this.getData({ params: newData, query: { page } });
              }
            }
          });
        },
      });
    },
    //切换 正常状态下
    statusOn() {
      this.status = true;
      const params = {
        siteId: this.$root.nowSite.id,
        status: "yes",
        limit: this.pageSize,
        classId: this.searchKey.typeId,
      };
      this.getData({ params });
    },
    //切换 停用状态下
    statusOff() {
      this.status = false;
      const params = {
        siteId: this.$root.nowSite.id,
        status: "no",
        limit: this.pageSize,
        classId: this.searchKey.typeId,
      };
      this.searchSubmit();
    },
    //拖拽排序
    onDragDrop(oldIndex, newIndex) {
      if (oldIndex == newIndex || oldIndex == "") return;
      let page = this.setPage;
      let newStatus = this.status ? "yes" : "no";
      const params = {
        current_id: this.$refs.tables.insideTableData[oldIndex].id,
        neighbor_id: this.$refs.tables.insideTableData[newIndex].id,
        siteId: this.$root.nowSite.id,
        direction: +oldIndex > +newIndex ? "up" : "down",
      };

      paymentChannelSequence(params, true).then((res) => {});
      //更改不请求数据
      this.$refs.tables.insideTableData.splice(
        newIndex,
        0,
        ...this.$refs.tables.insideTableData.splice(oldIndex, 1)
      );
      // this.$refs.tables.insideTableData.splice(newIndex, 1, ...this.$refs.tables.insideTableData.splice(oldIndex, 1,this.$refs.tables.insideTableData[newIndex]))
      //page等于unfind  就是第一页， 当点击第二页就会触发page，获取到page的页数
      // if (newStatus == "yes") {
      // 	console.log(status);
      // 	console.log(params);
      // 	this.getData({ params, query: { page } });
      // 	if (page > 1) {
      // 		console.log(params);
      // 		params.status = newStatus;
      // 		this.getData({ params, query: { page } });
      // 	}
      // }
      // if (newStatus == "no") {
      // 	params.status = newStatus;
      // 	this.getData({ params, query: { page } });
      // }
    },

    //支付修改的确认保存
    save() {
      this.$root.startEditLoading();
      // console.log(this.payform)
      this.$refs.payment.sendCheckedArray();
      // this.$refs.content.getpayselectlist()
      let params = { ...this.newplatdata, payName: "" };
      if (
        JSON.stringify(params.formatAmount) == "{}" &&
        JSON.stringify(params.limitAmount) == "{}"
      ) {
        this.$Tip.info({ content: "请选择支付方式" });
        return false;
      }

      let newArray = [];
      for (let key in params.formatAmount) {
        newArray = params.formatAmount[key];

        //没有选择支付方式的提示

        //当固定金额的值为空的时候的提示
        if (
          newArray.formatAmount !== null &&
          newArray.formatAmount !== undefined &&
          newArray.formatAmount.trim() === ""
        ) {
          this.$Tip.info({ content: "请输入固定金额" });
          return;
        }

        //当输入为字母的时候提示
        if (newArray.formatAmount) {
          let Regx = /^(((([1-9]\d*|(\.\d{1,2}))((,)(?!0))?){1,}\d)|[1-9])$/;
          if (Regx.test(newArray.formatAmount)) {
          } else {
            this.$Tip.info({ content: "请输入正确的固定金额" });
            newArray.formatAmount = " ";
            return false;
          }
        }
      }
      params.siteId = this.$root.nowSite.id;
      params.id = this.payform.id;
      params.payName = this.payform.payName;

      params.siteName = this.$root.nowSite.siteName;
      let classIds = [];
      params.newarray.map((item) => {
        classIds.push(item.id);
      });
      if (classIds.length > 1) params.classId = classIds.join(",");
      else params.classId = classIds[0];

      delete params.newarray;
      params.formatAmount = JSON.stringify(params.formatAmount);
      params.limitAmount = JSON.stringify(params.limitAmount);
      params.bankCode = this.platform.bankCode;
      let mess = false;
      let limitmess = false;

      if (params.formatAmount == "{}") {
        delete params.formatAmount;
      } else {
        let format;
        format = Object.values(JSON.parse(params.formatAmount));
        format.forEach((item) => {
          if (item.formatAmount == null) {
            this.$Tip.info({ content: "请输入固定金额" });
            mess = true;
            3;
            return false;
          }

          if (item.quick_amount == null || item.quick_amount == "") {
            this.$Tip.info({ content: "请输入常用金额" });
            limitmess = true;
            return false;
          }

          if (
            item.handle_fee &&
            (
              item.handle_fee == 0 ||
              item.handle_fee.substr(-1) === '.' ||
              item.handle_fee.split('.').length > 2 ||
              item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].length > 4 ||
              item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].substr(-1) === '0' ||
              parseFloat(item.handle_fee) > 30
            )
          ) {
            this.$Tip.info({ content: "请输入正确的手续费比例(小数点最多四位)" });
            limitmess = true;
            return false
          }
        });

        // handele_fee 為空時刪除
        params.formatAmount = this.listKeyDelete(params.formatAmount, 'handle_fee')
      }

      if (params.limitAmount == "{}") {
        delete params.limitAmount;
      } else {
        let limitdata;
        limitdata = Object.values(JSON.parse(params.limitAmount));
        limitdata.forEach((item) => {
          if ((item.maxAmount == null || item.minAmount == null) && item.name!='VIP充值') {
            this.$Tip.info({ content: "请输入单笔金额" });
            limitmess = true;
            return false;
          }
          if (Number(item.maxAmount) <= Number(item.minAmount) && item.name!='VIP充值') {
            this.$Tip.info({ content: "单笔上限必须大于单笔下限" });
            limitmess = true;
            return false;
          }
          if ((item.quick_amount == null || item.quick_amount == "") && item.name!='VIP充值') {
            this.$Tip.info({ content: "请输入常用金额" });
            limitmess = true;
            return false;
          }
          
          if (
              item.name!='VIP充值' &&
              (
                item.handle_fee &&
                (
                  item.handle_fee == 0 ||
                  item.handle_fee.substr(-1) === '.' ||
                  item.handle_fee.split('.').length > 2 ||
                  item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].length > 4 ||
                  item.handle_fee.split('.')[1] && item.handle_fee.split('.')[1].substr(-1) === '0' ||
                  parseFloat(item.handle_fee) > 30
                )
              )
            ) {
              this.$Tip.info({ content: "请输入正确的手续费比例(小数点最多四位)" });
              limitmess = true;
              return false
            }
        });

        // handele_fee 為空時刪除
        params.limitAmount = this.listKeyDelete(params.limitAmount, 'handle_fee')
      }
      if (mess || limitmess) {
        return false;
      }
      updatepayment(params, true).then((res) => {
        if (res != undefined && res.code == 200) {
          this.$refs.paymentModifyModal.hide();
          this.searchSubmit();
          this.$Message.success("支付修改成功");
          // this.$Tip.success({
          //   content: "支付修改成功",

          //   onOk: () => {
          //     // const params = { siteId: this.$root.nowSite.id,status:params.row.status};
          //     // this.getData({ params });
          //   }
          // });
        }
      });
    },
    //获取支付方式组件的选中值
    getArray(data) {
      this.newplatdata = data;
      if (this.newplatdata.newarray.length == 0) {
        this.showID = false;
      }
      this.newplatdata.newarray.map((item) => {
        if (item.className == "网银在线") this.showID = true;
      });
      this.$forceUpdate();
    },
    //查询
    searchSubmit() {
      // 正常状态
      let page = this.setPage;
      if (this.status == true) {
        let status = this.status ? "yes" : "no";

        const params = {
          classId: this.searchKey.typeId,
          siteId: this.$root.nowSite.id,
          payName: this.searchKey.payName,
          status: status,
          limit: this.pageSize,
        };

        this.$refs.tables.setPage();
        this.getData({ params });
      }

      //停用状态
      if (this.status == false) {
        let status = this.status ? "yes" : "no";

        const params = {
          classId: this.searchKey.typeId,
          siteId: this.$root.nowSite.id,
          payName: this.searchKey.payName,
          status: status,
          limit: this.pageSize,
        };
        this.$refs.tables.setPage();
        this.getData({ params });
        this.$root.endSearchBtnLoading();
      }
    },
    // 获取支付方式下拉框
    getselectdata() {
      const params = { classType: "payment" };
      getpaymentID(params).then((res) => {
        this.payWay = res.data;
      });
    },
    //点击分页
    onPageChange(page) {
      this.setPage = page;
      const params = {
        ...this.$parent.searchKey,
        classId: this.searchKey.typeId,
        siteId: this.$root.nowSite.id,
        payName: this.searchKey.payName,
        status: this.status ? "yes" : "no",
        limit: this.pageSize,
      };
      this.getData({ params: params, query: { page } });
    },
    onPageSizeChange(pageSize) {
      const params = {
        ...this.$parent.searchKey,
        classId: this.searchKey.typeId,
        siteId: this.$root.nowSite.id,
        payName: this.searchKey.payName,
        status: this.status ? "yes" : "no",
        limit: pageSize,
      };

      this.getData({ params: params });
      this.pageSize = pageSize;
    },
    // formatAmount & limitAmount parameter 刪除
    listKeyDelete(listJSONString, key) {
      const list = JSON.parse(listJSONString);

      for (let id in list) {
        const payment = list[id]
        if (payment[key] === '') {
          delete payment[key]
        }
      }

      return JSON.stringify(list)
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
@import "../../styles/class.less";
.box {
  border: 1px solid #eaeaea;
  > span {
    box-sizing: border-box;
    display: inline-block;
    width: 33.33%;
    height: 100px;
    text-align: center;
    border-right: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;
    padding: 25px;
    &:nth-of-type(3n) {
      border-right: 0;
    }
    &:nth-last-of-type(1) {
      width: 100%;
      border-right: 0;
    }
    &:nth-last-of-type(1) {
      border-bottom: 0;
    }
    > p {
      &:nth-child(1) {
        font-size: 1.125rem;
        color: #666666;
      }
      &:nth-child(2) {
        font-size: 0.875rem;
        color: #c3c3c3;
      }
    }
  }
}
/deep/.ivu-btn > span {
  vertical-align: 0;
}
/deep/.ivu-table-tbody {
  color: #444;
}
//表格内td调整样式
/deep/.ivu-table td {
  padding: 10px 10px;
  color: #444;
}
.btngroup {
  margin-bottom: 30px;

  /deep/.zcBtn {
    span {
      vertical-align: 0;
    }
  }
}

.status-button {
  button {
    padding: 0 20px;
    height: 36px;
    line-height: 34px;
    font-size: 1rem;
  }
}
</style>
