<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <Button type="primary" @click="openModal">添加条件红包</Button>
        </FormItem>
        <FormItem label="统计类型">
          <Select placeholder="全部" v-model="searchKey.count_type" clearable class="w120x">
            <Option v-for="(t,i) in typeList" :key="i" :value="t.value">{{t.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态">
          <Select placeholder="全部" v-model="searchKey.status" clearable class="w120x">
            <Option value="weikaishi">未开始</Option>
            <!-- <Option value="jinxingzhongi">进行中</Option> -->
            <Option value="yijieshu">已结束</Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="search"
            @click.prevent="searchSubmit"
          >查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="tables"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        :stripe="false"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-change-status="changeStatus"
        @on-delete="onDelete"
        @on-edit="onEdit"
      ></Tables>
    </div>
    <Modals ref="redSetModal" :title="title" :width="760" @closeModal="closeModel">
      <div slot="content" class="pt30">
        <Form ref="formKey" class="clearfix" :model="formKey" :rules="rules" :label-width="200">
          <FormItem label="统计类型" prop="count_type">
            <Select prop="bankName" v-model="formKey.count_type" class="w400x">
              <Option v-for="(t,i) in typeList" :key="i" :value="t.value">{{t.name}}</Option>
            </Select>
          </FormItem>
          <div class="clearfix" v-show="formKey.count_type">
            <FormItem
              class="ib fl"
              :label="
                                formKey.count_type == 'bet' ? '打码范围' : formKey.count_type == 'yingli' ? '赢利范围' : formKey.count_type == 'kuisun' ? '亏损范围' : formKey.count_type == 'chongzhi'?'存款范围': formKey.count_type == 'xianjinshu'?'现金输范围': formKey.count_type == 'xianjinying'?'现金赢范围':''
                            "
              prop="count_min"
            >
              <!-- <Input class="w180x" v-model="formKey.count_min"  placeholder="下限金额" :maxlength="13" /> -->
              <InputNumber
                class="w180x"
                v-model="formKey.count_min"
                placeholder="下限金额"
                :min="1.0"
                :max="9999999999.0"
              />
            </FormItem>
            <span class="fl ib ml20 mr10 h36">-</span>
            <FormItem class="ib fl" style="margin-left:-195px" prop="count_max">
              <!-- <Input class="w180x" v-model="formKey.count_max" placeholder="上限金额"  :maxlength="13" /> -->
              <InputNumber
                class="w180x"
                v-model="formKey.count_max"
                placeholder="下限金额"
                :min="1.0"
                :max="9999999999.0"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="红包占比" prop="zhanbi">
              <!-- /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,1}$)/ -->
              <!-- ^\d+(\.\d{2})?$ -->
              <!-- <Input class="w400x" v-model="formKey.zhanbi" placeholder="请输入红包占比" /><span class="ml5">%</span> -->
              <!-- :min="1" -->
              <InputNumber
                class="w400x"
                v-model="formKey.zhanbi"
                placeholder="请输入红包占比"
                :max="9999999999.0"
              />
              <span class="ml5">%</span>
            </FormItem>
          </div>
          <!-- <div v-if="formKey.count_type&&formKey.count_type=='bet'">
                        <FormItem label="最低存款" prop="pay_min">
                            <InputNumber class="w400x" v-model="formKey.pay_min" placeholder="请输入最低存款" :max="9999999999.0" />
                        </FormItem>
          </div>-->
          <div v-if="formKey.count_type">
            <FormItem label="存款倍数" prop="bet_beishu">
              <!-- <Input class="w400x" v-model="formKey.zhanbi" placeholder="请输入红包占比" /><span class="ml5">%</span> -->
              <InputNumber
                class="w400x"
                v-model="formKey.bet_beishu"
                placeholder="请输入存款打码倍数"
                :max="9999999999.0"
              />
            </FormItem>
          </div>
           <div v-if="formKey.count_type">
            <FormItem label="取款倍数" prop="multiple">
              <!-- <Input class="w400x" v-model="formKey.zhanbi" placeholder="请输入红包占比" /><span class="ml5">%</span> -->
              <InputNumber
                class="w400x"
                v-model="formKey.multiple"
                placeholder="请输入取款打码倍数"
                :min="1"
                :max="9999999999.0"
              />
            </FormItem>
          </div>
          <div>

            <FormItem label="红包上限" prop="gift_money_max">
              <!-- <Input class="w400x" v-model="formKey.zhanbi" placeholder="请输入红包占比" /><span class="ml5">%</span> -->
              <InputNumber
                class="w400x"
                v-model="formKey.gift_money_max"
                placeholder="请输入红包上限"
                :max="9999999999.0"
              />
            </FormItem>
          </div>
          <div class="clearfix">
            <FormItem class="ib fl" label="统计时段" prop="count_time_start">
              <DatePicker
                type="datetime"
                 format="yyyy-MM-dd HH:mm:ss"
                v-model="formKey.count_time_start"
                placeholder="开始时间"
                class="w180x"
                placement="top"
              ></DatePicker>
            </FormItem>
            <span class="fl ib ml20 mr10 h36">-</span>
            <FormItem class="ib fl" style="margin-left:-195px" prop="count_time_end">
              <DatePicker
                type="datetime"
                 format="yyyy-MM-dd HH:mm:ss"
                v-model="formKey.count_time_end"
                placeholder="结束时间"
                class="w180x"
                placement="top"
              ></DatePicker>
            </FormItem>
          </div>
          <FormItem label="派发时间" prop="send_time">
            <DatePicker
              type="datetime"
              v-model="formKey.send_time"
              placeholder="请选择"
              class="w400x"
              placement="top"
            ></DatePicker>
          </FormItem>
          <FormItem prop="undone_type" label="未达条件">
            <Select class="w400x" v-model="formKey.undone_type">
              <Option value="no">不派发</Option>
              <Option value="yes">派发</Option>
            </Select>
          </FormItem>
          <FormItem label="派发方式">
             <Select placeholder="请选择派发方式" class="w400x" v-model="formKey.send_type">
              <Option value="1">红包雨</Option>
              <Option value="2">砸金蛋</Option>
            </Select>
          </FormItem>
          <FormItem prop="undone_money" label="派发金额" v-if="formKey.undone_type == 'yes'">
            <InputNumber
              class="w400x"
              v-model="formKey.undone_money"
              :max="9999999999.0"
              placeholder="请输入派发金额"
            />
          </FormItem>
          <FormItem class="mt50 mb20">
            <Button
              type="primary"
              class="ivu addSave ml30"
              style="width:300px"
              @click.prevent="submit"
              :loading="$root.tableLoading"
            >确认</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Modals from "@/components/modals";
import {
  paiFaHongBaoConfig,
  redSetList,
  delRedSet,
  paiFaHongBaoConfigSta
} from "@/api/activity";

export default {
  name: "redSet",
  components: {
    Tables,
    Modals
  },
  data() {
    return {
      page: 1,
      pageSize: 20,
      title: "添加条件红包",
      Time: [],
      typeList: [
        {
          name: "按打码",
          value: "bet"
        },
        {
          name: "按赢利",
          value: "yingli"
        },
        {
          name: "按亏损",
          value: "kuisun"
        },
        {
          name: "按存款",
          value: "chongzhi"
        },
        {
          name: "按现金输",
          value: "xianjinshu"
        },
        {
          name: "按现金赢",
          value: "xianjinying"
        }
      ],
      searchKey: {
        siteId: this.$root.nowSite.id,
        undone_type: "",
        count_type: "",
        limit: 20
      },
      formKey: {
        count_type: "",
        count_min: null,
        count_max: null,
        zhanbi: null,
        pay_min: null,
        bet_beishu: null,
        multiple:null,
        gift_money_max: null,
        count_time_start: "",
        count_time_end: "",
        send_time: "",
        undone_type: "",
        send_type:'',
        undone_money: null
      },
      rules: {
        count_type: [
          {
            required: true,
            message: "请选择统计类型",
            trigger: "change",
            pattern: /.+/
          }
        ],
        count_min: [
          {
            required: true,
            message: "下限金额不能为0可保留两位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ],
        count_max: [
          {
            required: true,
            message: "上限金额不能为0可保留两位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ],
        zhanbi: [
          {
            required: true,
            message: "红包占比不能为0可保留两位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ],
        pay_min: [
          {
            required: true,
            message: "最低存款不能为0可保留两位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ],
        bet_beishu: [
          {
            required: true,
            message: "存款倍数不能为0可保留两位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ],
        multiple: [
          {
            required: true,
            message: "打码倍数最低1倍,可保留2位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ],
        gift_money_max: [
          {
            required: true,
            message: "红包上限不能为0可保留两位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ],
        count_time_start: [
          {
            required: true,
            message: "请选择统计时段",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        count_time_end: [
          {
            required: true,
            message: "请选择统计时段",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        send_time: [
          {
            required: true,
            message: "请选择派发时间",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        undone_type: [
          {
            required: true,
            message: "请选择是否派发",
            trigger: "blur",
            pattern: /.+/
          }
        ],
         send_type: [
          {
            required: true,
            message: "请选择派发方式",
            trigger: "change",
            pattern: /.+/
          }
        ],
    
        undone_money: [
          {
            required: true,
            message: "派发金额不能为0可保留两位小数",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
          }
        ]
      },
      table: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        data: [],
        columns: [
          {
            title: "红包代号",
            key: "code",
            minWidth: 60,
            align: "center"
          },
          {
            title: "统计类型",
            key: "count_type",
            minWidth: 60,
            align: "center",
            render: (h, params) => {
              let count_type =
                params.row.count_type == "bet"
                  ? "按打码"
                  : params.row.count_type == "yingli"
                  ? "按赢利"
                  : params.row.count_type == "kuisun"
                  ? "按亏损"
                  : params.row.count_type == "chongzhi"
                  ? "按存款"
                  : params.row.count_type == "xianjinshu"
                  ? "按现金输"
                  : "按现金赢"
              return <span>{count_type}</span>;
            }
          },
          {
            title: "派发条件",
            key: "undone_type",
            minWidth: 130,
            align: "center",
            render: (h, params) => {
              return (
                <div>
                  <span>{params.row.count_min}</span>-
                  <span>{params.row.count_max}</span>
                </div>
              );
            }
          },
          {
            title: "红包占比",
            key: "zhanbi",
            minWidth: 60,
            align: "center",
            render: (h, params) => {
              return <span>{Number(params.row.zhanbi).toFixed(2)} %</span>;
            }
          },
          // {
          //     title: '最低存款',
          //     key: 'pay_min',
          //     minWidth: 60,
          //     align: 'center',
          //     render: (h, params) => {
          //         return <span>{Number(params.row.pay_min).toFixed(2)}</span>;
          //     }
          // },
          {
            title: "存款倍数",
            key: "bet_beishu",
            minWidth: 90,
            align: "center",
            render: (h, params) => {
              return <span>{Number(params.row.bet_beishu)}</span>;
            }
          },
          {
            title: "取款倍数",
            key: "multiple",
            minWidth: 90,
            align: "center",
            render: (h, params) => {
              return <span>{Number(params.row.multiple)}</span>;
            }
          },
          {
            title: "红包上限",
            key: "gift_money_max",
            minWidth: 60,
            align: "center",
            render: (h, params) => {
              return (
                <span>{Number(params.row.gift_money_max).toFixed(2)}</span>
              );
            }
          },
          {
            title: "统计时段",
            key: "",
            minWidth: 250,
            align: "center",
            render: (h, params) => {
              return (
                <div>
                  <span>
                    {this.$root.newUnixTime(params.row.count_time_start)}
                  </span>{" "}
                  -{" "}
                  <span>
                    {this.$root.newUnixTime(params.row.count_time_end)}{" "}
                  </span>
                </div>
              );
            }
          },
          {
            title: "派发时间",
            key: "send_time",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return (
                <span>{this.$root.newUnixTime(params.row.send_time)}</span>
              );
            }
          },
          {
            title: "未达条件",
            key: "undone_money",
            minWidth: 90,
            align: "center",
            render: (h, params) => {
              let undone =
                params.row.undone_type == "yes"
                  ? "派发：" + params.row.undone_money
                  : "不派发";
              return <span>{undone}</span>;
            }
          },
            {
            title: "派发方式",
            key: "send_type",
            minWidth: 90,
            align: "center",
            render: (h, params) => {
            
              let send_type =params.row.send_type == "1" ? "红包雨":(params.row.send_type=='2'?'砸金蛋':'默认');
              return <span>{send_type}</span>;
            }
          },
          {
            title: "状态",
            key: "status ",
            minWidth: 70,
            align: "center",
            render: (h, params) => {
              let status =
                params.row.status == "weikaishi"
                  ? "未开始"
                  : params.row.status == "jinxingzhong"
                  ? "进行中"
                  : "已结束";
              let color =
                params.row.status == "yijieshu"
                  ? "#ff0000"
                  : params.row.status == "jinxingzhong"
                  ? "#239961"
                  : "";
              return <span style={{ color }}>{status}</span>;
            }
          },
          {
            title: "添加人",
            key: "admin_user",
            minWidth: 100,
            align: "center"
          },
          {
            title: "变更时间",
            key: "updated_at",
            minWidth: 130,
            align: "center",
            render: (h, params) => {
              return (
                <span>{this.$root.newUnixTime(params.row.updated_at)}</span>
              );
            }
          },
          {
            title: "操作",
            key: "userName",
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return (
                <div>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        params.row.status == "yijieshu"
                          ? "none"
                          : "inline-block"
                    }}
                    onClick={() => {
                      this.changeStatus(params);
                    }}
                  >
                    {params.row.is_open == "yes" ? "正常" : "停用"}
                  </a>
                  <a
                    class="ib mr10"
                    style={{
                      display:
                        params.row.status == "yijieshu"
                          ? "none"
                          : "inline-block"
                    }}
                    onClick={() => {
                      this.onEdit(params);
                      this.title = "编辑条件红包";
                      this.$refs.redSetModal.show();
                    }}
                  >
                    编辑
                  </a>
                  <a
                    class="ib mr10"
                    onClick={() => {
                      this.onDelete(params);
                    }}
                  >
                    删除
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
    for (let key in this.searchKey) {
      if (!this.searchKey[key]) delete this.searchKey[key];
    }
    let data = { ...this.searchKey };
    this.getData({ params: data });
  },
  methods: {
    openModal() {
      this.title = "添加条件红包";
      this.formKey.count_type = '';
      this.formKey.count_min = null;
      this.formKey.count_max = null;
      this.formKey.zhanbi = null;
      this.formKey.pay_min = null;
      this.formKey.bet_beishu = null;
      this.formKey.multiple = null;
      this.formKey.gift_money_max = null;
      this.formKey.count_time_start = '';
      this.formKey.count_time_end = '';
      this.formKey.send_time = '';
      this.formKey.undone_type = '';
        this.formKey.send_type = '';
      this.formKey.undone_money = null;
      delete this.formKey.id;
      this.$refs.redSetModal.show();
    },
    getData(data) {
      this.$root.startTableLoading();
      redSetList(data)
        .then(res => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.$root.endTableLoading();
          }
        })
        .catch(error => {
          this.$root.endTableLoading();
          this.table.data = [];
        });
    },
    onPageChange(page) {
      this.page = page;
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      let data = { ...this.searchKey };
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      let data = { ...this.searchKey };
      this.getData({ params: data });
    },
    changeStatus(params) {
      let text, msg;
      let type =
        params.row.count_type == "bet"
          ? "打码"
          : params.row.count_type == "yingli"
          ? "盈利"
          : params.row.count_type == "kuisun"
          ? "亏损"
          : params.row.count_type == "chongzhi"
          ? "存款"
          : params.row.count_type == "xianjinshu"
          ? "现金输"
          : "现金赢"
      const { is_open, id } = params.row;
      if (is_open === "yes") {
        text = `您确定停用按${type}红包活动${params.row.code}吗？`;
        msg = `停用红包成功`;
      }
      if (is_open === "no") {
        text = `您确定启用按${type}红包活动${params.row.code}吗？`;
        msg = `红包启用成功`;
      }
      const data = {
        siteId: this.$root.nowSite.id,
        id,
        is_open: params.row.is_open === "yes" ? "no" : "yes"
      };

      this.$Tip.confirm({
        content: text,
        onOk: () => {
          paiFaHongBaoConfigSta(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.config({
                top: 150
              });
              this.$Message.success({ content: msg });
              for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
              }
              let data = { ...this.searchKey };
              this.getData({ params: data, query: { page: this.page } });
            }
            params.row.is_open = is_open === "yes" ? "no" : "yes";
          });
        }
      });
    },
    onDelete(params) {
      let type =
        params.row.count_type == "bet"
          ? "打码"
          : params.row.count_type == "yingli"
          ? "盈利"
          : params.row.count_type == "kuisun"
          ? "亏损"
          : params.row.count_type == "chongzhi"
          ? "存款"
          : params.row.count_type == "xianjinshu"
          ? "现金输"
          : "现金赢"
      let text = `您确定删除按${type}红包活动【${params.row.code}】吗？`;
      let msg = `删除红包成功`;
      const data = {
        id: params.row.id,
        siteId: this.$root.nowSite.id
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          delRedSet(data, true).then(res => {
            if (res != undefined && res.code == 200)
              this.$Message.config({
                top: 150
              });
            this.$Message.success({ content: msg });
            this.table.data.splice(params.index, 1);
            for (let key in this.searchKey) {
              if (!this.searchKey[key]) delete this.searchKey[key];
            }
            let data = { ...this.searchKey };
            this.getData({ params: data, query: { page: this.page } });
          });
        }
      });
    },
    onEdit(params) {
      this.formKey.count_type = params.row.count_type;
      this.formKey.count_min = params.row.count_min * 1;
      this.formKey.count_max = params.row.count_max * 1;
      this.formKey.zhanbi = params.row.zhanbi * 1;
      this.formKey.pay_min = params.row.pay_min * 1;
      this.formKey.bet_beishu = params.row.bet_beishu * 1;
      this.formKey.multiple = params.row.multiple * 1;
      this.formKey.gift_money_max = params.row.gift_money_max * 1;
      this.formKey.count_time_start = this.$root.unixTime(
        params.row.count_time_start
      );
      this.formKey.count_time_end = this.$root.unixTime(
        params.row.count_time_end
      );
      this.formKey.send_time = this.$root.unixTime(params.row.send_time);
      this.formKey.undone_type = params.row.undone_type;
      this.formKey.send_type =String(params.row.send_type);
      
      this.formKey.undone_money = params.row.undone_money * 1;
      this.formKey.id = params.row.id;
    },
    submit() {
      this.$refs.formKey.validate(valid => {
        if (valid) {
          for (let key in this.formKey) {
            if (!this.formKey[key]) delete this.formKey[key];
          }
          let data = { ...this.formKey };
          let reg = /[\s\:\-]+/g;
          if (this.formKey.count_time_end <= this.formKey.count_time_start) {
            this.$Message.error("结束时间必须大于开始时间！");
            return;
          }
          if (this.formKey.send_time <= this.formKey.count_time_end) {
            this.$Message.error("派发时间必须大于结束时间！");
            return;
          }
          data.count_time_start = this.$root
            .formatTimeS(this.formKey.count_time_start)
            .replace(reg, "");
          data.count_time_end = this.$root
            .formatTimeS(this.formKey.count_time_end)
            .replace(reg, "");
          data.send_time = this.$root
            .formatTimeS(this.formKey.send_time)
            .replace(reg, "");
          data.siteId = this.$root.nowSite.id;
          if (this.title == "添加条件红包") delete data.id;
          this.$root.startTableLoading();
          paiFaHongBaoConfig(data).then(res => {
            if (res != undefined && res.code == 200) {
              for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
              }
              let data = { ...this.searchKey };
              this.getData({ params: data, query: { page: this.page } });
              this.$refs.redSetModal.hide();
              //this.$refs.formKey.resetFields();
              this.$root.endTableLoading();
            }
          });
        }
      });
    },
    closeModel() {
     this.$refs.formKey.resetFields();
    },
    searchSubmit() {
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      let params = { ...this.searchKey };
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTime(startTime);
        params.endTime = endTime && this.$root.formatTime(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = params.startTime;
      this.searchKey.endTime = params.endTime;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      this.getData({ params });
      this.$refs.tables.setPage();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
/deep/.money_min {
  width: 230px;
  .ivu-input-wrapper {
    left: 0%;
  }
}
/deep/.money_max {
  width: 160px;
  .ivu-input-wrapper {
    left: -80%;
  }
}
/deep/.ivu-form-item-error-tip {
  width:220px;
  padding-left: 0;
}
</style>