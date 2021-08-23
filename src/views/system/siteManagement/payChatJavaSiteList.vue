<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <div class="v2-button mb0">
          <Button
            @click="addPay"
            v-if="adminType == 'super' || authInPage.indexOf('payChatJavaSite') != -1"
          >新增上分站点</Button>
        </div>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        :value="table.data"
        :columns="table.columns"
        :loading="table.loading"
        :page="false"
      ></Tables>
    </div>
    <Modals
      ref="addModals"
      :title="type=='add'?'新增上分站点':type=='shangfen'?'编辑上分':'编辑优惠'"
      :width="760"
    >
      <div slot="content">
        <Form :label-width="280" ref="formKey" :model="formKey" :rules="rules">
          <FormItem label="站点名称" prop="siteId">
            <Select class="w260x" filterable transfer v-model="formKey.siteId" v-if="type=='add'">
              <Option v-for="(t,index) in  accessSite" :disabled="siteIdList.includes(t.id)" :value="t.id" :key="t.id">{{t.siteName}}</Option>
            </Select>
            <Input :value="formKey.siteName" disabled class="w260x" v-else />
          </FormItem>
          <FormItem label v-if="type=='shangfen'">
            <RadioGroup v-model="formKey.method" @on-change="val=>{$forceUpdate();formKey.addNumber=''}">
              <Radio label="add">
                <span>上分</span>
              </Radio>
              <Radio label="reduce">
                <span>减分</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            :label="formKey.method=='add'?'加分金额':'减分金额'"
            :key="formKey.method=='add'?'加分金额':'减分金额'"
            v-if="type=='shangfen'"
            prop="addNumber"
          >
            <InputNumber
              class="w260x"
              :min="1"
              :max="9999999999"
              :value="formKey.addNumber||null"
              @on-change="val=>{formKey.addNumber=val}"
              :placeholder="formKey.method=='add'?'请输入加分金额':'请输入减分金额'"
            />
          </FormItem>
          <FormItem label="站点优惠" v-if="type!='shangfen'">
            <InputNumber
              :value="Number(formKey.preferential)||null"
              @on-change="val=>{formKey.preferential=val}"
              :min="0"
              :max="100"
              :step="0.001"
              :formatter="value =>formKey.preferential = value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]"
              class="w260x"
              placeholder="请输入站点优惠"
            />%
          </FormItem>
          <FormItem label="上分金额" key="maxMoney" v-if="type=='add'" prop="maxMoney">
            <InputNumber
              :value="formKey.maxMoney||null"
              @on-change="val=>{formKey.maxMoney=val}"
              :min="1"
              :max="999999999"
              class="w260x"
              placeholder="请输入上分金额"
            />
          </FormItem>
          <FormItem>
            <Button
              class="ft20 ivu-btn submit"
              :loading="loading"
              type="primary"
              @click.prevent="save()"
            >提交保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import { payChatJavaSiteList, payChatJavaSite } from "@/api/system";
import { getUserType, getAccessFromLocal } from "@/libs/util";
import Modals from "@/components/modals";
import { mapMutations } from "vuex";
import { Tooltip, Content } from "view-design";
export default {
  name: "payChatJavaSiteList",
  components: {
    Tables,
    Modals
  },
  data() {
    const validateAddNumber = (rule, value, cb) => {
      value=this.formKey.addNumber;
      if (!value || value == "") {
        if (this.formKey.method == "add") {
          cb("请输入加分金额");
        } else {
          cb("请输入减分金额");
        }
      } else {
        if (
          this.formKey.method == "reduce" &&
          Number(this.formKey.maxMoney) - Number(this.formKey.addNumber) < 0
        ) {
          cb("剩余余额不足");
        }else{
          cb()
        }
      }
    };
    return {
      loading: false,
      siteIdList:[],
      type: "add",
      accessSite: getAccessFromLocal(),
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      searchKey: {
        limit: 20,
        page: 1
      },
      formKey: {
        siteId: "",
        preferential: "",
        maxMoney: "",
        state: 0
      },
      rules: {
        siteId: [
          {
            required: true,
            message: "请选择站点",
            trigger: "change",
            pattern: /.+/
          }
        ],
        preferential: [
          {
            required: true,
            message: "请输入优惠",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        maxMoney: [
          {
            required: true,
            message: "请输入上分金额",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        addNumber: [
          {
            required: true,
            trigger: "blur",
            validator: validateAddNumber,
            pattern: /.+/
          }
        ]
      },
      table: {
        total: 0,
        data: [],
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "站点名称",
            key: "siteName",
            align: "center",
            minWidth: 65,
            className: "pl10 pr10"
          },
          {
            title: "站点代号",
            key: "siteCode",
            align: "center",
            minWidth: 55,
            className: "pl10 pr10"
          },
          {
            title: "上分总额",
            key: "maxMoney",
            align: "center",
            minWidth: 85,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.maxMoney)}</span>
            )
          },
          {
            title: "剩余余额",
            key: "nowMoney",
            align: "center",
            minWidth: 80,
            className: "pl10 pr10",
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.maxMoney-params.row.nowMoney)}</span>
            )
          },
          {
            title: "站点优惠",
            key: "preferential",
            align: "center",
            minWidth: 80,
            className: "pl10 pr10",
            render: (h, params) => (
              <span>{params.row.preferential?params.row.preferential*100+'%':'-'}</span>
            )
          },
          {
            title: "更新人",
            key: "admin",
            align: "center",
            minWidth: 80,
            className: "pl10 pr10"
          },
          {
            title: "更新时间",
            key: "updated_at",
            align: "center",
            minWidth: 100,
            render: (h, params) => (
              <span>{this.$root.newUnixTime(params.row.updated_at)}</span>
            )
          },
          {
            title: "状态",
            key: "state",
            align: "center",
            minWidth: 80,
            className: "pl10 pr10",
            render: (h, params) => (
              <span style={{ color: params.row.state == 0 ? "" : "red" }}>
                {params.row.state == 0 ? "正常" : "停用"}
              </span>
            )
          },
          {
            title: "操作",
            align: "center",
            minWidth: 65,
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("payChatJavaSite") != -1
                          ? "inlinr-block"
                          : "none"
                    }}
                    onClick={() => {
                      this.changeStatus(params);
                    }}
                  >
                    {params.row.state == 0 ? "正常" : "启用"}
                  </a>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("payChatJavaSite") != -1
                          ? "inlinr-block"
                          : "none"
                    }}
                    onClick={() => {
                      this.info("shangfen",params);
                    }}
                  >
                    上分
                  </a>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        this.adminType == "super" ||
                        this.authInPage.indexOf("payChatJavaSite") != -1
                          ? "inline-block"
                          : "none"
                    }}
                    onClick={() => {
                      this.info("youhui",params);
                    }}
                  >
                    优惠
                  </a>
                </div>
              );
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    info(type,params) {
      this.type = type;
      this.formKey = {
        siteId: params.row.siteId,
        siteName: params.row.siteName,
        preferential: params.row.preferential*100,
        maxMoney: params.row.maxMoney,
        state: 0
      };
      if (type == "shangfen") {
        this.formKey.method = "add";
        this.formKey.addNumber = "";
      }
      this.$refs["formKey"].resetFields();
      this.$refs.addModals.show();
    },
    getData() {
      this.siteIdList=[];
      this.table.loading = true;
      payChatJavaSiteList()
        .then(res => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data;
            this.table.loading = false;
            this.table.data.forEach(t=>{
              this.siteIdList.push(t.siteId);
            })
          }
          console.log(this.siteIdList)
          this.$forceUpdate();
        })
        .catch(error => (this.table.loading = false));
    },
    save() {
      this.$refs.formKey.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.type != "add") {
            delete this.formKey.siteName;
          }else {
            delete this.formKey.method;
            delete this.formKey.addNumber
          }
          if (this.type == "shangfen") {
            if (this.formKey.method == "add")
              this.formKey.maxMoney =
                Number(this.formKey.maxMoney) + Number(this.formKey.addNumber);
            if (this.formKey.method == "reduce")
              this.formKey.maxMoney =
                Number(this.formKey.maxMoney) - Number(this.formKey.addNumber);
            delete this.formKey.addNumber;
            delete this.formKey.method;
          }

          if(!this.formKey.preferential) this.formKey.preferential=0;
          let data={...this.formKey};
          data.preferential=(this.formKey.preferential/100).toFixed(4);
          payChatJavaSite(data, true)
            .then(res => {
              if (res && res.code == 200) {
                this.$Message.success(
                  `${this.type == "add" ? "新增" : "更新成功"}`
                );
                this.$refs.addModals.hide();
                this.getData();
                this.loading = false;
              } else {
                this.loading = false;
              }
            })
            .catch(error => (this.loading = false));
        }
      });
    },
    changeStatus(params) {
      this.$Tip.confirm({
        content: `您确定要${
          params.row.state == 0 ? "停用" : "启用"
        }该站点上分功能吗？`,
        onOk: () => {
          let data = {
            siteId: params.row.siteId,
            maxMoney: params.row.maxMoney,
            state: params.row.state == 0 ? 1 : 0,
            preferential: params.row.preferential/100
          };
          payChatJavaSite(data, true).then(res => {
            if (res && res.code == 200) {
              this.$Message.success(
                `${params.row.state == 0 ? "停用" : "启用"}成功`
              );
              this.getData();
            }
          });
        }
      });
    },
    // 新增,编辑站点
    addPay() {
      this.type = "add";
      for (let key in this.formKey) {
        this.formKey[key] = "";
      }
      this.formKey.state=0;
      this.$refs["formKey"].resetFields();
      this.$refs.addModals.show();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";
</style>
<style lang="less" scoped>
</style>
