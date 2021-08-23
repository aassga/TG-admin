<template>
  <div>
    <div class="v2-table mt20 box">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
      <div slot="more" class="mt30 iconColor ft14">
        <div>
          温馨提示：活动期间内累计存款达到最低存款要求，即可免费领取兑换码（统计时间依据北京时间）
        </div>
        <div class="mt20">
          <p>活动规则：</p>
          <p>1.必须绑定姓名和银行账号。</p>
          <p>2.会员在客户端主动领取,每个会员有且只能领领1个app应用的兑换码。</p>
          <p>
            3.领取规则：间隔累计达到每一门槛存款要求，每一个门槛短期/中期/长期兑换码各可领取1次，当同时达到多个门槛要求，发放达到最高门槛要求的兑换码。（如会员达到门槛1的要求，没去领。然后再去存款累积达到门槛2的要求。这时候去领的话，是只能领门槛2的兑换码，门槛1的就不能领了）。
          </p>
          <p>4.存在活动黑名单的玩家不能参与此活动。</p>
        </div>
      </div>
    </div>
    <Modals
      :title="type == 'add' ? '新增代理线' : '编辑代理线'"
      ref="codeModals"
      :rules="rules"
      :model="formKey"
      width="760"
    >
      <div
        slot="content"
        :style="
          formKey.group.length >= 3 ? 'height:600px;overflow-y: auto;' : ''
        "
      >
        <Form ref="formKey" :label-width="260" :model="formKey" :rules="rules">
          <FormItem label="代理账号">
            <AutoSearch
              :disabled="this.type == 'add' ? false : true"
              :stage="'all'"
              ref="autoSearch"
              :width="260"
              :siteId="$root.nowSite.id"
              @sendSuperior="getUserName"
              :placeholder="'关键字查询'"
            ></AutoSearch>
          </FormItem>
          <FormItem label="应用名称" prop="app_name">
            <Input
              class="w260x"
              v-model="formKey.app_name"
              placeholder="请输入应用名称"
            />
          </FormItem>
          <FormItem label="活动日期">
             <DatePicker
                        type="datetime"
                        placeholder="开始日期"
                        class="w120x"
                        v-model="formKey.start_time"
                       
                        size="large"
                        format="yyyy-MM-dd"
                        transfer
                    ></DatePicker>
                    <span class="ml8 mr8">-</span>
                     <DatePicker
                        transfer
                        type="datetime"
                        placeholder="结束日期"
                        class="w120x"
                        v-model="formKey.end_time"
                        size="large"
                        format="yyyy-MM-dd"
                    ></DatePicker>

          </FormItem>
          <FormItem label="兑换码类型" prop="group">
            <CheckboxGroup @on-change="changeGroup" v-model="formKey.group">
              <Checkbox label="短期" border></Checkbox>
              <Checkbox label="中期" border></Checkbox>
              <Checkbox label="长期" border></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <div v-if="groupList.includes('短期')">
            <FormItem label="最低存款" prop="type1_min_deposit">
              <Input
                class="w260x"
                v-model="formKey.type1_min_deposit"
                placeholder="0表示不用存款"
              >
                <span slot="prepend">短期兑换码</span>
              </Input>
            </FormItem>
            <FormItem
              :label="this.type == 'add' ? '兑换码' : '新增兑换码'"
              :prop="this.type == 'add' ? 'type1_exchange_code' : ''"
            >
              <Input
                v-model="formKey.type1_exchange_code"
                class="w260x"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="1行1个，如
    xxxxxx
    yyyy"
              />
            </FormItem>
          </div>
          <div v-if="groupList.includes('中期')">
            <FormItem label="最低存款" prop="type2_min_deposit">
              <Input
                class="w260x"
                v-model="formKey.type2_min_deposit"
                placeholder="0表示不用存款"
              >
                <span slot="prepend">中期兑换码</span>
              </Input>
            </FormItem>
            <FormItem
              :label="this.type == 'add' ? '兑换码' : '新增兑换码'"
              :prop="this.type == 'add' ? 'type2_exchange_code' : ''"
            >
              <Input
                class="w260x"
                v-model="formKey.type2_exchange_code"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="1行1个，如
    xxxxxx
    yyyy"
              />
            </FormItem>
          </div>
          <div v-if="groupList.includes('长期')">
            <FormItem label="最低存款" prop="type3_min_deposit">
              <Input
                class="w260x"
                v-model="formKey.type3_min_deposit"
                placeholder="0表示不用存款"
              >
                <span slot="prepend">长期兑换码</span>
              </Input>
            </FormItem>
            <FormItem
              :label="this.type == 'add' ? '兑换码' : '新增兑换码'"
              :prop="this.type == 'add' ? 'type3_exchange_code' : ''"
            >
              <Input
                class="w260x"
                v-model="formKey.type3_exchange_code"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="1行1个，
  如xxxxxx
  yyyy"
              />
            </FormItem>
          </div>
          <FormItem>
            <Button
              type="primary"
              @click="saveSubmit"
              :loading="$root.editBtnLoading"
              class="ivu-btn submit w260x ft14"
              >{{ type == "add" ? "确认新增" : "确认保存" }}</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
    <!-- 重复弹框一 -->
    <Modals title="温馨提示" ref="appTip" width="600" :mask-closable="false">
      <div slot="content" style="text-align: center">
        <div class="content w400x ib txt-a">
          <p class="ft16 mb10 txt-l">
            <Icon type="ios-alert" size="30" color="#2d8cf0" />
            {{ titleName }}中有以下<span class="red-font"
              >{{ codeCount }}个</span
            >兑换码与{{ this.codeIn }}中兑换码重复,请重新输入
          </p>
          <Input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            class="w400x"
            v-model="codeContent"
            readonly
          />
          <Button
            type="primary"
            class="ivu-btn submit w60x ft14 mt20 mb20"
            @click="onConfirm"
            >确认</Button
          >
        </div>
      </div>
    </Modals>
    <Modals title="兑换码详情" ref="detialModal" height="600">
      <div slot="content" style="height:600px;overflow-y:auto">
        <div class="clearfix mr20" >
          <ul style="wdith: 300px" class="clearfix boxTitle fl">
            <li
              v-for="(item, index) in nameList"
              :key="index"
              :class="activeTab == item.tab ? 'activeNav' : ''"
              @click="onTab(index,item)"
              class="cs"
              style="width: 100px; height: 40px; float: left"
            >
              {{ item.tab }}
            </li>
          </ul>
          <div class="fr mr10">
            <Input
              @input="search($event)"
              v-model="text"
              clearable
              placeholder="请输入关键字"
            />
          </div>
        </div>
        <div class="mt10 ml20 clearfix mr30">
          <div v-show="showTab1" class="clearfix" >
            <p
              class="ft14 blue-font mt20 "
              v-if="yesShortExchange.length > 0"
            >
              已兑换码
            </p>
            <div class="clearfix mt10" v-if="yesShortExchange.length > 0" >
              <div
                style="
                  word-warp: break-word;
                  line-height: 36px;
                  height:36px;
                  border: 1px solid #e1e1e1;
                "
                class="ml10 w120x txt-a fl ft14"
                v-for="(t, i) in yesShortExchange.filter((t) =>
                  t.includes(text)
                )"
                :key="i + 1"
              >
               <Poptip trigger="hover" v-show="t.length>12" placement="top-end" transfer>
               <div slot="content">
                  <p>{{t}}</p>
                </div>
              <span :style="t.length>11?'overflow:hidden;display:inline-block;line-height: 36px;height:36px':''">
                 {{ t.length>11?`${t.substring(0,12)}...`:t }}
                 </span>
               </Poptip>
               <span v-show="t.length<=12">{{t}}</span>
              </div>
            </div>

            <p
              class="ft14 blue-font mt20 "
              v-if="notShortExchange.length > 0"
            >
              未兑换码
            </p>
            <div class="clearfix mb20" v-if="notShortExchange.length > 0" >
              <div
                class="ml10 w130x fl txt-a ft14 mt10"
                style="line-height: 36px; border: 1px solid #e1e1e1;height:36px"
                v-for="(t, i) in notShortExchange.filter((t) =>
                  t.includes(text)
                )"
                :key="i + 'a'"
              >
             <Poptip trigger="hover" v-show="t.length>12" placement="top-end" transfer>
               <div slot="content">
                  <p>{{t}}</p>
                </div>
              <span :style="t.length>11?'overflow:hidden;display:inline-block;line-height: 36px;height:36px':''">
                 {{ t.length>11?`${t.substring(0,12)}...`:t }}
                 </span>
               </Poptip>
               <span v-show="t.length<=12">{{t}}</span>
              
              </div>
            </div>
          </div>
          <div v-show="showTab2">
            <p
              class="ft14 blue-font mt20 "
              v-if="yesMiddleExchange.length > 0"
            >
              已兑换码
            </p>
            <div class="clearfix" v-if="yesMiddleExchange.length > 0">
              <div
                class="ml10 w120x txt-a fl ft14"
                style="line-height: 36px; height:36px; border: 1px solid #e1e1e1"
                v-for="(t, i) in yesMiddleExchange.filter((t) =>
                  t.includes(text)
                )"
                :key="i + 2"
              >
                <!-- {{ t == "" ? "暂无数据" : t }} -->
                 <Poptip trigger="hover" v-show="t.length>12" placement="top-end" transfer>
               <div slot="content">
                  <p>{{t}}</p>
                </div>
              <span :style="t.length>11?'overflow:hidden;display:inline-block;line-height: 36px;height:36px':''">
                 {{ t.length>11?`${t.substring(0,12)}...`:t }}
                 </span>
               </Poptip>
               <span v-show="t.length<=12">{{t}}</span>
              </div>
            </div>
              <!-- v-if="notMiddleExchange.length > 0" -->
            <p
              class="ft14 blue-font mt20 "
           
            >
              未兑换码
            </p>
            <!-- v-if="notMiddleExchange.length > 0" -->
            <div class="clearfix"  v-if="notMiddleExchange.length > 0">
              <div
                class="ml10 w120x txt-a fl ft14 mt10"
                style="line-height: 36px; height:36px; border: 1px solid #e1e1e1"
                v-for="(t, i) in notMiddleExchange.filter((t) =>
                  t.includes(text)
                )"
                :key="i + 'b'"
              >
                <!-- {{ t == "" ? "暂无数据" : t }} -->
                 <Poptip trigger="hover" v-show="t.length>12" placement="top-end" transfer>
               <div slot="content">
                  <p>{{t}}</p>
                </div>
              <span :style="t.length>11?'overflow:hidden;display:inline-block;line-height: 36px;height:36px':''">
                 {{ t.length>11?`${t.substring(0,12)}...`:t }}
                 </span>
               </Poptip>
               <span v-show="t.length<=12">{{t}}</span>
              </div>
            </div>
          </div>
          <div v-show="showTab3">
            <p
              class="ft14 blue-font mt20 "
              v-if="yesLongExchange.length > 0"
            >
              已兑换码
            </p>
            <div class="clearfix" v-if="yesLongExchange.length > 0">
              <div
                class="ml10 w120x txt-a fl ft14 mt10"
                style="line-height: 36px; height:36px; border: 1px solid #e1e1e1"
                v-for="(t, i) in yesLongExchange.filter((t) =>
                  t.includes(text)
                )"
                :key="i + 3"
              >
                <!-- {{ t == "" ? "暂无数据" : t }} -->
                 <Poptip trigger="hover" v-show="t.length>12" placement="top-end" transfer>
               <div slot="content">
                  <p>{{t}}</p>
                </div>
              <span :style="t.length>11?'overflow:hidden;display:inline-block;line-height: 36px;height:36px':''">
                 {{ t.length>11?`${t.substring(0,12)}...`:t }}
                 </span>
               </Poptip>
               <span v-show="t.length<=12">{{t}}</span>
              </div>
            </div>
            <p
              class="ft14 blue-font mt20 "
              v-if="notLongExchange.length > 0"
            >
              未兑换码
            </p>
            <div class="clearfix" v-if="notLongExchange.length > 0">
              <div
                class="ml10 w120x txt-a fl ft14 mt10"
                style="line-height: 36px; height:36px; border: 1px solid #e1e1e1"
                v-for="(t, i) in notLongExchange.filter((t) =>
                  t.includes(text)
                )"
                :key="i + 'c'"
              >
                <!-- {{ t == "" ? "暂无数据" : t }} -->
                 <Poptip trigger="hover" v-show="t.length>12" placement="top-end" transfer>
               <div slot="content">
                  <p>{{t}}</p>
                </div>
              <span :style="t.length>11?'overflow:hidden;display:inline-block;line-height: 36px;height:36px':''">
                 {{ t.length>11?`${t.substring(0,12)}...`:t }}
                 </span>
               </Poptip>
               <span v-show="t.length<=12">{{t}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Modals from "@/components/modals";
import {
  appExchangeCodeList,
  appExchangeCodeCreate,
  appExchangeCodeDelete,
  appExchangeCodeEdit,
  getActiveChessTaskDateAndSwitch,
  appExchangeCodeStatus
} from "@/api/activity";
import AutoSearch from "_c/auto-search";
export default {
  components: {
    Tables,
    Modals,
    AutoSearch,
  },
  props: ["tList"],
  data() {
    return {
      Time: [],
      searchKey: {
        siteId: this.$root.nowSite.id,
        active_type: "A0025",
        star_time: "",
        end_time: "",
      },
      Time: [],
      status: false,
      titleName: "",
      text: "",
      activeIndex: 0,
      activeTab:'短期兑换码',
      notShortExchange: [],
      yesShortExchange: [],
      notMiddleExchange: [],
      yesMiddleExchange: [],
      notLongExchange: [],
      yesLongExchange: [],
      nameList: [],
      showTab1: true,
      showTab2: false,
      showTab3: false,
      codeIn: "",
      codeCount: "",
      codeContent: "",
      type: "add",
      title: "新增代理线",
      groupList: [],
      code: [],
      searchKey: { siteId: this.$root.nowSite.id },
      formKey: {
        siteId: this.$root.nowSite.id,
        username: "",
        app_name: "",
        start_time:'',
        end_time:'',
        group: [],
        type1_min_deposit: "",
        type1_exchange_code: "",
        type2_min_deposit: "",
        type2_exchange_code: "",
        type3_min_deposit: "",
        type3_exchange_code: "",
      },
      rules: {
        group: [
          {
            type: "array",
            min: 1,
            required: true,
            message: "请选择兑换码类型",
            trigger: "change",
            pattern: /.+/,
          },
        ],
        app_name: [
          {
            required: true,
            message: "请输入应用名称",
            trigger: "blur",
            pattern: /.+/,
          },
        ],

        type1_min_deposit: [
          {
            required: true,
            message: "请输入最低存款",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        type2_min_deposit: [
          {
            required: true,
            message: "请输入最低存款",
            trigger: "blur",
            pattern: /.+/,
          },
        ],

        type3_min_deposit: [
          {
            required: true,
            message: "请输入最低存款",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        type1_exchange_code: [
          {
            required: true,
            message: "请输入兑换码",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        type2_exchange_code: [
          {
            required: true,
            message: "请输入兑换码",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        type3_exchange_code: [
          {
            required: true,
            message: "请输入兑换码",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
      },
      table: {
        total: 10,
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        data: [],
        columns: [
          {
            title: "代理账号",
            key: "username",
            className: "backBox",
             minWidth:70,
            align: "center",
            tooltip: true,
          },
          {
            title: "应用名称",
             minWidth:70,
            key: "app_name",
            align: "center",
            tooltip: true,
          },
          {
            title: "短期兑换码",
            key: "",
            align: "center",
            children: [
              {
                title: "最低存款",
                key: "type1_min_deposit",
                align: "center",
                minWidth:80,
              },
              {
                title: "兑换码总计",
                key: "type1_total_count",
                align: "center",
                 minWidth:90,
              },
              {
                title: "已领个数",
                key: "type1_received_count",
                align: "center",
                  minWidth:80,
                render: (h, params) => {
                  const {
                    type2_received_count,
                    username,
                    app_name,
                  } = params.row;
                  return (
                    <span
                      class="blue-font"
                      onClick={() => {
                        this.$router.push({
                          name: "recordCode",
                          query: {
                            appName: app_name,
                            userName: username,
                          },
                        });
                      }}
                    >
                      {params.row.type1_received_count}
                    </span>
                  );
                },
              },
              {
                title: "剩余个数",
                key: "type1_remaining_count",
                align: "center",
                  minWidth:80,
              },
            ],
          },
          {
            title: "中期兑换码",
            key: "",
            align: "center",
            children: [
              {
                title: "最低存款",
                key: "type2_min_deposit",
                align: "center",
                 minWidth:80,
              },
              {
                title: "兑换码总计",
                key: "type2_total_count",
                align: "center",
                 minWidth:80,
              },
              {
                title: "已领个数",
                key: "type2_received_count",
                align: "center",
                 minWidth:80,
                render: (h, params) => {
                  const {
                    type2_received_count,
                    username,
                    app_name,
                  } = params.row;
                  return (
                    <span
                      class="blue-font"
                      onClick={() => {
                        this.$router.push({
                          name: "recordCode",
                          query: {
                            appName: app_name,
                            userName: username,
                          },
                        });
                      }}
                    >
                      {params.row.type2_received_count}
                    </span>
                  );
                },
              },
              {
                title: "剩余个数",
                key: "type2_remaining_count",
                align: "center",
               minWidth:80,
              },
            ],
          },
          {
            title: "长期兑换码",
            key: "",
            align: "center",
            children: [
              {
                title: "最低存款",
                key: "type3_min_deposit",
                align: "center",
                 minWidth:80,
              },
              {
                title: "兑换码总计",
                key: "type3_total_count",
                align: "center",
                 minWidth:80,
              },
              {
                title: "已领个数",
                key: "type3_received_count",
                align: "center",
                width:90,
                render: (h, params) => {
                  const {
                    type2_received_count,
                    username,
                    app_name,
                  } = params.row;
                  return (
                    <span
                      class="blue-font"
                      onClick={() => {
                        this.$router.push({
                          name: "recordCode",
                          query: {
                            appName: app_name,
                            userName: username,
                          },
                        });
                      }}
                    >
                      {params.row.type3_received_count}
                    </span>
                  );
                },
              },
              {
                 minWidth:80,
                title: "剩余个数",
                key: "type3_remaining_count",
                align: "center",
              },
            ],
          },
          {
            title: "操作",
            align: "center",
             minWidth:120,
            render: (h, params) => {
              let color = params.row.status == 'on' ? '#2d8cf0' : '#FF2626';
             
              return (
                <div>
                  <span
                  style={{ color: color }}
                    class="mr5 blue-font"
                    onClick={() => {
                      this.onChangeStatus(params);
                      this.type = "edit";
                    }}
                  >
                    {params.row.status=='on'?'正常':'停用'}
                  </span>
                  <span
                    class="mr5 blue-font"
                    onClick={() => {
                      this.onEdit(params.row);
                      this.type = "edit";
                    }}
                  >
                    编辑
                  </span>
                  <span
                    class="mr5 blue-font"
                    onClick={() => {
                      this.onDetial(params);
                    }}
                  >
                    详情
                  </span>
                  <span
                    class="mr5 blue-font"
                    onClick={() => {
                      this.onDelete(params);
                    }}
                  >
                    删除
                  </span>
                </div>
              );
            },
          },
        ],
      },
    };
  },
  mounted() {
    let data = {
      siteId: this.$root.nowSite.id,
    };
    this.getData({ params: data });
  },
  methods: {
    onChangeStatus(params){
      // console.log(params)
       let text, msg;
      const {status,username,id}=params.row;
      // console.log(status)
      if(status=='on'){
          text = '您确定停用【' + username + '】代理线吗？';
           msg = '停用成功';
      }
      if(status=='off'){
         text = '您确定启用【' + username + '】代理线吗？';
           msg = '停用成功';

      }
       const data = {
                siteId: this.$root.nowSite.id,
                id,
                status: params.row.status == 'on' ? 'off' : 'on'
            };
         this.$Tip.confirm({
                content: text,
                onOk: () => {
                    appExchangeCodeStatus(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            if (typeof res.data === 'string') {
                                this.$Message.config({
                                    top: 150
                                });
                                this.$Message.success({ content: msg });
                            }
                        }
                        params.row.status = status == 'on' ? 'off' : 'on';
                    });
                }
            });


    },
    // onSave() {
    //   if (this.$root.validateTime(this.Time)) {
    //     this.searchKey.startTime = this.$root.formatTimeS(this.Time[0]);
    //     this.searchKey.endTime = this.$root.formatTimeS(this.Time[1]);
    //   }
    //   let data = {
    //     ...this.searchKey,
    //     active_type: "A0025",
    //     status: this.status == false ? "off" : "open",
    //   };

    //   if (this.searchKey.startTime == "") {
    //     this.$Message.warning("活动日期不能为空！");
    //     return;
    //   }
    //   if (this.searchKey.endTime == "") {
    //     this.$Message.warning("活动日期不能为空！");
    //     return;
    //   }
    
    //   getActiveChessTaskDateAndSwitch(data, true).then((res) => {
    //     if (res && res.code == 200) {
          
    //       let newData = { siteId: this.$root.nowSite.id, active_type: "A0025" };
    //       this.getData({ params: newData });
    //       this.$parent.getData(newData);
    //     ;
    //     }
    //   });
    // },
    search() {
      let search = event.data;
    },
    onTab(index,item) {
      // console.log(index)
      // console.log(item.tab)
      this.activeTab=item.tab;
      this.activeIndex = index;
      if(item.tab=='短期兑换码'){
         this.showTab1 = true;
        this.showTab2 = false;
        this.showTab3 = false;
      }else if(item.tab=='中期兑换码'){
         this.showTab1 = false;
        this.showTab2 = true;
        this.showTab3 = false;
      }else if(item.tab=='长期兑换码'){
         this.showTab1 = false;
        this.showTab3 = true;
        this.showTab2 = false;

      }

    },

    onDetial(params) {
       this.activeTab='短期兑换码';
       
            if(this.activeTab=='短期兑换码'){
         this.showTab1 = true;
        this.showTab2 = false;
        this.showTab3 = false;
      }else if(this.activeTab=='中期兑换码'){
         this.showTab1 = false;
        this.showTab2 = true;
        this.showTab3 = false;
      }else if(this.activeTab=='长期兑换码'){
         this.showTab1 = false;
        this.showTab3 = true;
        this.showTab2 = false;

      }
      this.$refs.detialModal.show();
      const {
        type1_exchange_code,
        type1_exchange_code_received,
        type2_exchange_code,
        type2_exchange_code_received,
        type3_exchange_code,
        type3_exchange_code_received,
      } = params.row;

      this.notShortExchange =type1_exchange_code && type1_exchange_code.split(",");
      this.yesShortExchange =type1_exchange_code_received&& type1_exchange_code_received.split(",");
      this.notMiddleExchange = type2_exchange_code&&type2_exchange_code.split(",");
      this.yesMiddleExchange = type2_exchange_code_received&&type2_exchange_code_received.split(",");
      this.notLongExchange =type3_exchange_code&& type3_exchange_code.split(",");
      this.yesLongExchange =type3_exchange_code_received&& type3_exchange_code_received.split(",");
    
      // 短期
      this.notShortExchange =this.notShortExchange&& this.notShortExchange.filter((m) => m);
      this.yesShortExchange =this.yesShortExchange&& this.yesShortExchange.filter((m) => m);
    
      //中期
      this.notMiddleExchange = this.notMiddleExchange&&this.notMiddleExchange.filter((m) => m);
      this.yesMiddleExchange = this.yesMiddleExchange&&this.yesMiddleExchange.filter((m) => m);
      //长期
      this.notLongExchange =this.notLongExchange&& this.notLongExchange.filter((m) => m);
      this.yesLongExchange =this.yesLongExchange&& this.yesLongExchange.filter((m) => m);
      // console.log( this.notShortExchange,'短期未兑换')
      //  console.log( this.yesShortExchange,'短期已经兑换')
      //   console.log( this.notMiddleExchange,'中期为兑换')
      //  console.log( this.yesMiddleExchange,'中期已经兑换')
      //   console.log( this.notLongExchange,'长期为兑换')
      //  console.log( this.yesLongExchange,'长期已兑换')
      if (
        (this.notShortExchange.length != 0 ||
          this.yesShortExchange.length != 0) &&
        (this.notMiddleExchange.length != 0 ||
          this.yesShortExchange.length != 0) &&
        (this.notLongExchange.length != 0 || this.yesLongExchange.length != 0)
      ) {
        this.nameList = [
          { tab: "短期兑换码" },
          { tab: "中期兑换码" },
          { tab: "长期兑换码" },
        ];
      } else if (
        (this.notShortExchange.length != 0 ||
          this.yesShortExchange.length != 0) &&
        (this.notLongExchange.length != 0 || this.yesLongExchange.length != 0)
      ) {
        this.nameList = [{ tab: "短期兑换码" }, { tab: "长期兑换码" }];
        // this.showTab1=true;
        //  this.showTab3=true;
      } else if (
        (this.notMiddleExchange.length != 0 ||
          this.yesShortExchange.length != 0) &&
        (this.notLongExchange.length != 0 || this.yesLongExchange.length != 0)
      ) {
        this.nameList = [{ tab: "中期兑换码" }, { tab: "长期兑换码" }];
        this.showTab2=true;
         this.showTab3=true;
      } else if (
        (this.notShortExchange.length != 0 ||
          this.yesShortExchange.length != 0) &&
        (this.notMiddleExchange.length != 0 ||
          this.yesShortExchange.length != 0)
      ) {
        this.nameList = [{ tab: "短期兑换码" }, { tab: "中期兑换码" }];
      } else if (
        this.notLongExchange.length != 0 ||
        this.yesLongExchange.length != 0
      ) {
        this.nameList = [{ tab: "长期兑换码" }];
         this.showTab3=true;
      } else if (
        this.notMiddleExchange.length != 0 ||
        this.yesShortExchange.length != 0
      ) {
        this.nameList = [{ tab: "中期兑换码" }];
        this.showTab2=true;
      } else if (
        this.notShortExchange.length != 0 ||
        this.yesShortExchange.length != 0
      ) {
        this.nameList = [{ tab: "短期兑换码" }];
      }
   
     
    },
    onEdit(params) {
      // console.log(params)
       this.$refs.formKey.resetFields();
      this.title = "编辑代理线";
      const {
        id,
        siteId,
        username,
        app_name,
        type1_min_deposit,
        type1_exchange_code,
        type2_exchange_code,
        type2_min_deposit,
        type3_exchange_code,
        type3_min_deposit,
        start_time,
        end_time
      } = params;
     
        this.formKey.start_time = this.$root.returnDayTime(start_time);
        this.formKey.end_time = this.$root.returnDayTime(end_time);
      this.formKey.type1_exchange_code = "";
      this.formKey.type2_exchange_code = "";
      this.formKey.type3_exchange_code = "";
 
      if(type1_min_deposit==0){ this.formKey.type1_min_deposit ='';
      }else{ this.formKey.type1_min_deposit = type1_min_deposit; }
      
       if(type2_min_deposit==0){ this.formKey.type2_min_deposit ='';
      }else{ this.formKey.type2_min_deposit = type2_min_deposit; }
         if(type3_min_deposit==0){ this.formKey.type3_min_deposit ='';
      }else{ this.formKey.type3_min_deposit = type3_min_deposit; }

  
      this.formKey.username = username;
      this.formKey.id = id;
      this.formKey.app_name = app_name;
      this.$refs.autoSearch.setDefault(username);

      if (
        type1_min_deposit != 0 &&
        type2_min_deposit == 0 &&
        type3_min_deposit == 0
      ) {
        this.groupList = this.formKey.group = ["短期"];
      } else if (
        type2_min_deposit != 0 &&
        type1_min_deposit == 0 &&
        type3_min_deposit == 0
      ) {
        this.groupList = this.formKey.group = ["中期"];
      } else if (
        type3_min_deposit != 0 &&
        type1_min_deposit == 0 &&
        type2_min_deposit == 0
      ) {
        this.groupList = this.formKey.group = ["长期"];
      } else if (
        (type1_min_deposit != 0) &&
       ( type2_min_deposit != 0 )&&
       ( type3_min_deposit != 0)
      ) {
        this.groupList = this.formKey.group = ["短期", "中期", "长期"];
      } else if ((type1_min_deposit != 0 &&type2_min_deposit != 0 )&&type3_min_deposit == 0) {
        this.groupList = this.formKey.group = ["短期", "中期"];
      } else if (( type1_min_deposit != 0 && type3_min_deposit != 0)&& type2_min_deposit == 0) {
        this.groupList = this.formKey.group = ["短期", "长期"];
      } else if ((type2_min_deposit != 0 &&type3_min_deposit != 0 )&&type1_min_deposit== 0) {
        this.groupList = this.formKey.group = ["中期", "长期"];
      } 
    
      this.$refs.codeModals.show();
    },
    changeGroup(val) {
      this.groupList = val;
    },
    onDelete(params) {
      const { id, username } = params.row;
      let data = { id, siteId: this.$root.nowSite.id };
      let text = "您确定删除" + `${username}` + "代理线吗?";
      let msg = "删除成功";
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          appExchangeCodeDelete(data, true).then((res) => {
            if (res.code == 200) {
              this.table.data.splice(params.index, 1);
              this.table.total--;
              this.$Message.success({ content: "删除成功" });
            }
          });
        },
      });
    },
    getUserName(val) {
      this.formKey.username = val;
    },
    onAdd() {
      // console.log(this.$refs.formKey)
     this.$refs.formKey.resetFields();
      this.type = "add";
      this.formKey = {};
      this.formKey.group = [];
      this.groupList = [];
      this.$refs.autoSearch.removeDefault();
      // resetFields
      this.$refs.codeModals.show();
    },
    getData(data) {
      this.$root.startTableLoading();
      appExchangeCodeList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    onPageChange(page) {
      let data = { siteId: this.$root.nowSite.id };
         for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      let data = { siteId: this.$root.nowSite.id, limit: pageSize };

        for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
    },
    onConfirm() {
      this.$refs.appTip.hide();
    },
    saveSubmit() {
      this.$root.startEditLoading();
 
     let data = { ...this.formKey, siteId: this.$root.nowSite.id,status:'on' };
     data.start_time=this.$root.formatTime(data.start_time);
       data.end_time=this.$root.formatTime(data.end_time);
    
           if (new Date(data.end_time).getTime() - new Date(data.start_time).getTime() < 0) {
        this.$Message.warning({ content: "结束日期必须大于开始日期" });
         this.$root.endEditLoading();
        return false;
      }

      if (
        (data.type1_min_deposit && data.type1_exchange_code) ||
        (data.type2_min_deposit && data.type2_exchange_code) ||
        (data.type3_min_deposit && data.type3_exchange_code)
      ) {
        data.type1 = JSON.stringify({
          min_deposit: data.type1_min_deposit,
          exchange_code: data.type1_exchange_code,
        });
        data.type2 = JSON.stringify({
          min_deposit: data.type2_min_deposit,
          exchange_code: data.type2_exchange_code,
        });
        data.type3 = JSON.stringify({
          min_deposit: data.type3_min_deposit,
          exchange_code: data.type3_exchange_code,
        });
      }

      if (!data.username) {
        this.$Tip.info({ content: "请输入代理账号" });
        return false;
      }
      for (let key in data) {
        if (!data[key]) delete data[key];
        if (key == "type1_exchange_code") delete data[key];
        if (key == "type1_min_deposit") delete data[key];
        if (key == "type2_exchange_code") delete data[key];
        if (key == "type2_min_deposit") delete data[key];
        if (key == "type3_exchange_code") delete data[key];
        if (key == "type3_min_deposit") delete data[key];
      }
    
      this.$refs.formKey.validate((valid) => {
        if (valid) {
          if (this.type == "add") {
            appExchangeCodeCreate(data, true).then((res) => {
              if (res != undefined && res.code == 200) {
                this.$Message.success({ content: "新增成功" });
                let params = { ...this.searchKey };
                this.getData({ params });
                this.$root.endTableLoading();
                if (res.data) {
                  this.codeCount = res.data.length; //重复的个数；
                  this.codeContent = String(res.data[0].code);
                  if (res.data == '添加成功') {
                    this.$refs.codeModals.hide();
                  }
                
                  if(res.data!='添加成功'){

                    if (res.data&&res.data[0].in.substr(0, 1) == 1) {
                      this.titleName = "【短期】";
                    } else if (res.data&&res.data[0].in.substr(0, 1) == 2) {
                      this.titleName = "【中期】";
                    } else if (res.data&&res.data[0].in.substr(0, 1) == 3) {
                      this.titleName = "【长期】";
                    }
  
                    if (res.data&&res.data[0].in == "13") {
                      this.codeIn = "【长期】";
                    } else if (res.data&&res.data[0].in == "12") {
                      this.codeIn = "【中期】";
                    } else if (res.data&&res.data[0].in == "123") {
                      this.codeIn = "【中期】和【长期】";
                    }
                  }
                }
                if (this.codeCount > 0 && res.data != "添加成功") {
                  this.$refs.appTip.show();
                }
              }
            });
          }
          if (this.type == "edit") {
            appExchangeCodeEdit(data, true).then((res) => {
              if (res != undefined && res.code == 200) {
                let params = { ...this.searchKey };
                this.getData({ params });
                this.$Message.success({ content: "修改成功" });
                this.$root.endTableLoading();
                if (res.data) {
                  this.codeCount = res.data.length; //重复的个数；
               
                  this.codeContent = String(res.data[0].code);
                      if (this.codeContent == undefined) {
                    this.$refs.codeModals.hide();
                  }
                    if (res.data == '编辑成功') {
                    this.$refs.codeModals.hide();
                  }
                  
                if(res.data!='编辑成功'){

                  if (res.data&&res.data[0].in.substr(0, 1) == 1) {
                    this.titleName = "【短期】";
                  } else if (res.data&&res.data[0].in.substr(0, 1) == 2) {
                    this.titleName = "【中期】";
                  } else if (res.data&&res.data[0].in.substr(0, 1) == 3) {
                    this.titleName = "【长期】";
                  }
                

                  if (res.data&&res.data[0].in == "13") {
                    this.codeIn = "【长期】";
                  } else if (res.data&&res.data[0].in == "12") {
                    this.codeIn = "【中期】";
                  } else if (res.data&&res.data[0].in == "123") {
                    this.codeIn = "【中期】和【长期】";
                  }
                }
              
                }
                if (this.codeCount > 0 && res.data != "编辑成功") {
                  this.$refs.appTip.show();
                }
              }
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../../styles/button.less";

/deep/ .box .ivu-row {
  margin-top: 15px !important;
}
.boxTitle {
  width: 400px;
  padding-left: 10px;
  li {
    width: 200px;
    border: 1px solid #e4e4e4;
    text-align: center;
    padding: 10px;
  }
}
.activeNav {
  background-color: #2d8cf0;
  color: white;
  font-size: 14px;
}
.backBox {
  margin-left: 5px;
  margin-right: 5px;
}
</style>