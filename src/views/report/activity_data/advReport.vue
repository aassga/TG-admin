<template>
  <div>
    <div class="section">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="contentBox">
        <div class="v2-search">
          <Form inline class="v2-seach" ref="searchKey">
            <FormItem>
              <Button @click="addAdv()" type="primary">新增广告</Button>
            </FormItem>
            <FormItem v-if="tabName == '明细表' || tabName == '月报表'">
              <Button
                v-for="(t, i) in dayList"
                :key="i"
                @click.prevent="changeBtn(t)"
                :class="activeBtn == t ? 'activeClass' : ''"
                class="mr20"
                >{{ t }}
              </Button>
            </FormItem>
            <FormItem v-if="tabName == '明细表'">
              <FormItem label="开始日期">
                <DatePicker
                  class="w120x"
                  placeholder="开始日期"
                  v-model="Time[0]"
                ></DatePicker>
              </FormItem>
              <FormItem label="结束日期">
                <DatePicker
                  class="w120x"
                  placeholder="结束日期"
                  v-model="Time[1]"
                ></DatePicker>
              </FormItem>
            </FormItem>
            <FormItem label="状态" v-if="tabName == '总报表'||tabName == '明细表'" >
              <Select
                class="w120x"
                v-model="searchKey.status"
                placeholder="全部"
                clearable
              >
                <Option value="started" >进行中</Option>
                <Option value="stop">未开始</Option>
                <Option value="finish"  >已结束</Option>
                <Option value="black">黑名单</Option>
              </Select>
            </FormItem>
            <FormItem label="状态" v-if="tabName == '期末表'" >
              <Select
                class="w120x"
                v-model="searchKey.status"
                placeholder="全部"
                clearable
              >
                <Option value="started"  >进行中</Option>
              
                <Option value="finish" >已结束</Option>
             
              </Select>
            </FormItem>
            <FormItem label="广告名称">
              <Input
                class="w140x"
                v-model="searchKey.domain"
                placeholder="请输入广告名称"
              />
            </FormItem>
            <FormItem label="代理账号">
              <Input
                class="w140x"
                v-model="searchKey.username"
                placeholder="多个请以,逗号隔开"
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                class="search"
                :loading="$root.tableLoading"
                @click="searchSubmit('search')"
                >查询</Button
              >
            </FormItem>
            <FormItem>
              <Button
                class="ivu-btn export"
                type="primary"
                @click.prevent="exportExcel"
                :loading="$root.editBtnLoading"
                >导出EXCEL</Button
              >
            </FormItem>
          </Form>
        </div>
        <div class="v2-search bb">
          <ButtonGroup class="repay-button1" style="margin-bottom: 0.3px">
            <Button
              @click.native="tabClick(t)"
              class="fontColor"
              v-for="(t, i) in btnList"
              :key="i"
              :class="tabName == t.name? 'active' : ''"
              >{{ t.name}}</Button
            >
          </ButtonGroup>
          <Button
            v-if="this.tabName == '总报表'"
            @click="searchSubmit('count')"
            class="fr blue-font"
            >近3日到期<span class="red-font">{{ countData }}</span
            >条</Button
          >
        </div>
        <div class="v2-table">
          <Tables
            ref="table"
            :rowClassName="mydefineRow"
            :loading="$root.tableLoading"
            :columns=" tabName == '总报表'  ? table.columns : tabName == '明细表' ? table._columns : table.montenColumns"
            :value="table.data"
            :total="table.total"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
            @on-sort-change="sortChange"
          ></Tables>
        </div>
        <advModals ref="advModals" :tabName="tabName"></advModals>
      </div>
    </div>
    <Modals :title="isSetPassword == false?'设置广告报表密码':'广告报表密码'" ref="advPasswordModals" width="600" @modalVisible="modalVisible(arguments)" >
      <div slot="content">
        <Form :label-width="180" ref="formKey" :model="formKey" :rules="rules" autocomplete="off">
          <p
            v-if="isSetPassword == false"
            class="lh40 ft14 txt-a f4faffBg mb20"
            style="
              width: 90%;
              margin: 20px auto;
              display: flex;
              justify-content: center;
            "
          >
            <Icons
              type="danchuangtishi"
              size="20"
              class="ib "
              style="color: #b3b3b3"
            />
            <span class="ml5">请先设置广告报表查看密码</span>
          </p>
          <!-- 初始设置密码 -->
          <FormItem
            v-if="isSetPassword == false"
            label="密码"
            prop="new_password"
          >
            <Input
              class="w260x"
              autocomplete=“off”
              v-model="formKey.new_password"
              placeholder="请设置广告报表查看密码" 
            />
          </FormItem>
          <FormItem
            v-if="isSetPassword == false"
            label="确认密码"
            
            prop="new_password_confirmation"
          >
            <Input
              class="w260x"
               autocomplete=“off”
              v-model="formKey.new_password_confirmation" 
              placeholder="请确认广告报表查看密码"
            />
          </FormItem>
          <!-- 登入密码 -->
         
          <!-- <FormItem v-if="isSetPassword == true" label="密码" prop="password" autocomplete="off">
             <input type="text" οnkeydοwn="passWordSave"  class="w260x focusInput" name="password" autocomplete="new-password" onfocus="this.type='password'" v-model="formKey.password">
          </FormItem> -->
           <FormItem v-if="isSetPassword == true" label="密码" prop="password" >
               <Input
              class="w260x"
               type="password"
               @keyup.enter.native="  passWordSave(
                  isSetPassword == false ? 'reSetPassword' : 'checkedPassword'
                )" 
              v-model="formKey.password"
              placeholder="请输入广告报表密码"
            />
          </FormItem>
          <FormItem>
            <Button
              :class="isSetPassword == false ? 'w260x  ' : 'w260x '"
              class="ivu-btn commonSubmit"
              type="primary"
              @click="
                passWordSave(
                  isSetPassword == false ? 'reSetPassword' : 'checkedPassword'
                )
              "
              :loading="$root.editBtnLoading"
            >
              {{ isSetPassword == false ? "确认保存" : "确认" }}</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import advModals from "./components/advModals";
import Icons from "@/components/icons";
import Modals from "@/components/modals";
import { mapState, mapMutations } from "vuex";
import {
  adReportList,
  adDetailList,
  adDetailDelete,
  adDetailSimpleList,
  adReportDelete,
  adBlacklistDelete,
  adReportCountdown,
  adVerifyPassword,
  adReportMonthlyList,
  adAssertSetPassword,
  adReportLastList
} from "@/api/report";
import {routeEqual,getTagNavListFromLocalstorage} from "@/libs/util";
// adResetPassword
import { adResetPassword } from "@/api/user";
import { Tooltip } from "view-design";
export default {
  // name: "advReport",
  components: {
    Tables,
    advModals,
    Icons,
    Modals,
  },
  data() {
    const validatorNewpassword = (rule, val, cb) => {
      if (!val || val == "" || val == undefined) {
        cb("请设置广告报表查看密码");
      } else {
        let reg = /^[0-9a-zA-Z_-]{8,20}$/;
        if (!reg.test(val)) {
          //未通过
          if (val.length < 8 || val.length > 20) {
            cb("请输入长度为8~20位字符的密码");
            return;
          } else {
            cb("必须为字母，数字，中划线或下划线字符构成");
            return;
          }
        } else {
          cb();
        }
      }
    };

    const validatorNewpasswordConfirmation = (rule, val, cb) => {
      if (!val || val == "" || val == undefined) {
        cb("请确认广告报表查看密码");
      } else {
        let reg = /^[0-9a-zA-Z_-]{8,20}$/;
        if (!reg.test(val)) {
          //未通过
          if (val.length < 8 || val.length > 20) {
            cb("请输入长度为8~20位字符的密码");
            return;
          } else {
            cb("必须为字母，数字，中划线或下划线字符构成");
            return;
          }
        } else {
          cb();
        }
      }
    };

    return {
      toList:"",
      isSetPassword: false, //是否设置过初始密码
       authInPage: JSON.parse(localStorage.authInPage),
      // title: "设置广告报表密码",
      spinShow: true,
      timeType: "search",
      page: 1,
      passType: false,
      countData: "",
      searchKey: {
        domain: "",
        username: "",
        siteId: this.$root.nowSite.id,
        status: "started",
      },
      formKey: {
        password: "",
        siteId: this.$root.nowSite.id,
        new_password: "",
        new_password_confirmation: "",
      },
      rules: {
        password: [
          {
            required: true,
            message: "请输入广告报表查看密码",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        new_password: [
          {
            required: true,
            validator: validatorNewpassword,
            trigger: "blur",
          },
        ],
        new_password_confirmation: [
          {
            required: true,
            validator: validatorNewpasswordConfirmation,
            trigger: "blur",
          },
        ],
      },
      daySumList: [],
      isSpin: true,
      pageSize: "",
      Time: [],
      dayList: ["本月", "上月"],
      tabName: "总报表",
      activeBtn: "本月 ",
      // btnList: ["总报表", "月报表",'期末表', "明细表"],
      btnList:[
       {name:'总报表',val:'allTable'},
      // {name:'月报表',val:'monthTable'},
      {name:'期末表',val:'endTable'},
      {name:'明细表',val:'detialTable'},
      ],
      table: {
        total: 10,
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        data: [],
        columns: [
          {
            title: "上广告日期",
            key: "start_time",
            align: "center",
            width: "130",
            render: (h, params) => {
              //  状态 stop: 未开始 started: 进行中 finish: 已结束 black: 黑名单
              const {
                start_time,
                end_time,
                status,
                start_time2,
                end_time2,
              } = params.row;
              let sumTime = `${start_time2}` + `~` + ` ${end_time2}`;
              let timeTip = start_time + `~` + end_time;
              if (timeTip.includes("总计")) {
                return <span>总计</span>;
              } else if (timeTip.includes("小计")) {
                return <span>小计</span>;
              } else {
                if (status == "stop") {
                  //未开始
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                      onMouseenter={(e) => {
                        this.daySum(params);
                      }}
                    >
                      <Icons
                        type="weikaishi"
                        style="position: absolute;top:-7px;left:0;"
                        color="#5A8DFF"
                        size="34"
                      ></Icons>
                      <span>
                        <Tooltip
                          trigger="hover"
                          class="cs"
                          placement="bottom"
                          transfer
                        >
                          {sumTime}
                          <div slot="content">
                            {" "}
                            <span>{timeTip}</span>
                          </div>
                        </Tooltip>
                        <Poptip
                          trigger="hover"
                          popper-class="top-wrap"
                          width="530"
                          transfer
                          placement="right"
                        >
                          <Icons
                            type="bangzhutishi"
                            class="ml5"
                            color="#E4E4E4"
                            size="16"
                          />
                          <div class="tip-box" slot="content">
                            <div class="title">
                              <span style="width:12%">期数</span>
                              <span style="width:33%">上广告日期</span>
                              <span style="width:25%">价格</span>
                              <span style="width:30%">备注</span>
                            </div>
                            <ul>
                              {this.daySumList.length > 0 ? (
                                this.daySumList.map((item) => (
                                  <li>
                                    <span style="width:12%">第{item.i}期</span>
                                    <span style="width:33%">
                                      {item.start_time}-{item.end_time}
                                    </span>
                                    <span style="width:25%">{item.amount}</span>
                                    <span style="width:30%">
                                      <Tooltip
                                        placement="right"
                                        max-width="500"
                                        style={{
                                          display:
                                            item.remark.length > 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        <p style="width:120px">
                                          {item.remark
                                            ? item.remark &&
                                              item.remark.substring(0, 6)
                                            : "-"}
                                          ...
                                        </p>
                                        <div
                                          slot="content"
                                          style="width:200px;max-width:400px;"
                                        >
                                          <div style="width:200px;word-break:break-all;">
                                            {item.remark ? item.remark : "-"}
                                          </div>
                                        </div>
                                      </Tooltip>
                                      <p
                                        style={{
                                          display:
                                            item.remark.length <= 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        {item.remark ? item.remark : "-"}
                                      </p>
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li style="width:100%">暂无数据</li>
                              )}
                            </ul>

                            <Spin
                              fix
                              size="small"
                              style={{
                                display: this.isSpin ? "block" : "none",
                              }}
                            ></Spin>
                          </div>
                        </Poptip>
                      </span>
                    </div>
                  );
                }
                if (status == "started") {
                  //进行中
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                      onMouseenter={(e) => {
                        this.daySum(params);
                      }}
                    >
                      <Tooltip
                        trigger="hover"
                        class="cs"
                        placement="bottom"
                        transfer
                      >
                        {sumTime}
                        <div slot="content">
                          {" "}
                          <span>{timeTip}</span>
                        </div>
                      </Tooltip>
                      <Icons
                        type="jinhangzhong"
                        style="position: absolute;top:-7px;left:0;"
                        color="#FF5858"
                        size="34"
                      ></Icons>
                      <span>
                        <Poptip
                          trigger="hover"
                          popper-class="top-wrap"
                          width="530"
                          transfer
                          placement="right"
                        >
                          <Icons
                            type="bangzhutishi"
                            class="ml5"
                            color="#E4E4E4"
                            size="16"
                            onMouseenter={(e) => {
                              this.daySum(params);
                            }}
                          />
                          <div class="tip-box" slot="content">
                            <div class="title">
                              <span style="width:12%">期数</span>
                              <span style="width:33%">上广告日期</span>
                              <span style="width:25%">价格</span>
                              <span style="width:30%">备注</span>
                            </div>
                            <ul>
                              {this.daySumList.length > 0 ? (
                                this.daySumList.map((item) => (
                                  <li>
                                    <span style="width:12%">第{item.i}期</span>
                                    <span style="width:33%">
                                      {item.start_time}-{item.end_time}
                                    </span>
                                    <span style="width:25%">{item.amount}</span>
                                    <span style="width:30%">
                                      <Tooltip
                                        placement="right"
                                        max-width="500"
                                        style={{
                                          display:
                                            item.remark.length > 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        <p style="width:120px">
                                          {item.remark
                                            ? item.remark &&
                                              item.remark.substring(0, 6)
                                            : "-"}
                                          ...
                                        </p>
                                        <div
                                          slot="content"
                                          style="width:200px;max-width:400px;"
                                        >
                                          <div style="width:200px;word-break:break-all;">
                                            {item.remark ? item.remark : "-"}
                                          </div>
                                        </div>
                                      </Tooltip>
                                      <p
                                        style={{
                                          display:
                                            item.remark.length <= 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        {item.remark ? item.remark : "-"}
                                      </p>
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li style="width:100%">暂无数据</li>
                              )}
                            </ul>
                            <Spin
                              fix
                              size="small"
                              style={{
                                display: this.isSpin ? "block" : "none",
                              }}
                            ></Spin>
                          </div>
                        </Poptip>
                      </span>
                    </div>
                  );
                }
                if (status == "finish") {
                  //已结束
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                      onMouseenter={(e) => {
                        this.daySum(params);
                      }}
                    >
                      <Tooltip
                        trigger="hover"
                        class="cs"
                        placement="bottom"
                        transfer
                      >
                        {sumTime}
                        <div slot="content">
                          {" "}
                          <span>{timeTip}</span>
                        </div>
                      </Tooltip>
                      <Icons
                        type="yijieshu"
                        style="position: absolute;top:-7px;left:0;"
                        color="#999999"
                        size="34"
                      ></Icons>
                      <span>
                        <Poptip
                          trigger="hover"
                          popper-class="top-wrap"
                          width="530"
                          transfer
                          placement="right"
                        >
                          <Icons
                            type="bangzhutishi"
                            class="ml5"
                            color="#E4E4E4"
                            size="16"
                          />
                          <div class="tip-box" slot="content">
                            <div class="title">
                              <span style="width:12%">期数</span>
                              <span style="width:33%">上广告日期</span>
                              <span style="width:25%">价格</span>
                              <span style="width:30%">备注</span>
                            </div>
                            <ul>
                              {this.daySumList.length > 0 ? (
                                this.daySumList.map((item) => (
                                  <li>
                                    <span style="width:12%">第{item.i}期</span>
                                    <span style="width:33%">
                                      {item.start_time}-{item.end_time}
                                    </span>
                                    <span style="width:25%">{item.amount}</span>
                                    <span style="width:30%">
                                      <Tooltip
                                        placement="right"
                                        max-width="500"
                                        style={{
                                          display:
                                            item.remark.length > 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        <p style="width:120px">
                                          {item.remark
                                            ? item.remark &&
                                              item.remark.substring(0, 6)
                                            : "-"}
                                          ...
                                        </p>
                                        <div
                                          slot="content"
                                          style="width:200px;max-width:400px;"
                                        >
                                          <div style="width:200px;word-break:break-all;">
                                            {item.remark ? item.remark : "-"}
                                          </div>
                                        </div>
                                      </Tooltip>
                                      <p
                                        style={{
                                          display:
                                            item.remark.length <= 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        {item.remark ? item.remark : "-"}
                                      </p>
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li style="width:100%">暂无数据</li>
                              )}
                            </ul>

                            <Spin
                              fix
                              size="small"
                              style={{
                                display: this.isSpin ? "block" : "none",
                              }}
                            ></Spin>
                          </div>
                        </Poptip>
                      </span>
                    </div>
                  );
                }
                if (status == "black") {
                  //黑名单
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                      onMouseenter={(e) => {
                        this.daySum(params);
                      }}
                    >
                      <Tooltip
                        trigger="hover"
                        class="cs"
                        placement="bottom"
                        transfer
                      >
                        {sumTime}
                        <div slot="content">
                          {" "}
                          <span>{timeTip}</span>
                        </div>
                      </Tooltip>
                      <Icons
                        type="heimingdan1"
                        style="position: absolute;top:-7px;left:0;"
                        color="#3F3F3F"
                        size="34"
                      ></Icons>
                      <span>
                        <Poptip
                          trigger="hover"
                          popper-class="top-wrap"
                          width="530"
                          transfer
                          placement="right"
                        >
                          <Icons
                            type="bangzhutishi"
                            class="ml5"
                            color="#E4E4E4"
                            size="16"
                            onMouseenter={(e) => {
                              this.daySum(params);
                            }}
                          />
                          <div class="tip-box" slot="content">
                            <div class="title">
                              <span style="width:12%">期数</span>
                              <span style="width:35%">上广告日期</span>
                              <span style="width:25%">价格</span>
                              <span style="width:30%">备注</span>
                            </div>
                            <ul>
                              {this.daySumList.length > 0 ? (
                                this.daySumList.map((item) => (
                                  <li>
                                    <span style="width:12%">第{item.i}期</span>
                                    <span style="width:33%">
                                      {item.start_time}-{item.end_time}
                                    </span>
                                    <span style="width:25%">{item.amount}</span>
                                    <span style="width:30%">
                                      <Tooltip
                                        placement="right"
                                        max-width="500"
                                        style={{
                                          display:
                                            item.remark.length > 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        <p style="width:120px">
                                          {item.remark
                                            ? item.remark &&
                                              item.remark.substring(0, 6)
                                            : "-"}
                                          ...
                                        </p>
                                        <div
                                          slot="content"
                                          style="width:200px;max-width:400px;"
                                        >
                                          <div style="width:200px;word-break:break-all;">
                                            {item.remark ? item.remark : "-"}
                                          </div>
                                        </div>
                                      </Tooltip>
                                      <p
                                        style={{
                                          display:
                                            item.remark.length <= 10
                                              ? "inline-block"
                                              : "none",
                                        }}
                                      >
                                        {item.remark ? item.remark : "-"}
                                      </p>
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li style="width:100%">暂无数据</li>
                              )}
                            </ul>
                            <div>
                              {this.daySumList.map((item) => (
                                <span style="margin-left:15px;height:30px;line-height:30px;display: inline-block">
                                  黑名单：{item.black_remark}
                                </span>
                              ))}
                            </div>
                            <Spin
                              fix
                              size="small"
                              style={{
                                display: this.isSpin ? "block" : "none",
                              }}
                            ></Spin>
                          </div>
                        </Poptip>
                      </span>
                    </div>
                  );
                }
              }
            },
          },
          {
            title: "广告名称",
            key: "main_domain",
            align: "center",
            minWidth: 12,
            render: (h, params) => {
              const { sub_domain, main_domain } = params.row;
              let c = Array(main_domain).concat(sub_domain);

              if (main_domain == "-") {
                return <span>-</span>;
              } else
                return (
                  <div
                    class="box"
                    style=" display: flex;flex-direction: row;justify-content: center;align-items: center;"
                  >
                    <span
                      class="ib box-left text-overflow-ellipsis"
                      style="width:70px"
                    >
                      {main_domain}
                    </span>
                    <Poptip
                      trigger="hover"
                      placement="right"
                      max-height="20"
                      word-wrap
                      transfer
                    >
                      <div
                        slot="content"
                        style="max-height:300px;;overflow-y:auto;overflow-x:hidden"
                      >
                        <ul>
                          {c.map((t) => (
                            <li>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <Icons
                        type="bangzhutishi"
                        // class="ml5"
                        color="#E4E4E4"
                        size="16"
                      />
                    </Poptip>
                  </div>
                );
            },
          },
          {
            title: "代理账号",
            key: "username",
            align: "center",
          },
          {
            title: "总价格",
            key: "amount",
            // width: ,
            //  width: 85,
            align: "center",
            sortable: "custom",
          },
          {
            title: "",
            key: "used_day",
            sortable: "custom",
            align: "center",
            width: 68,
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "消耗天数",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "天数",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            key: "used_amount",
            sortable: "custom",

            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "总消耗金额",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "金额",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            key: "remaining_amount",
            sortable: "custom",
            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "剩余金额",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "余额",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            width: 68,
            key: "register_count",
            sortable: "custom",
            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "注册人数",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "注册",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            width: 68,
            key: "deposit_count",
            sortable: "custom",
            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "充值人数",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "充值",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "转换率",
            key: "deposit_rate",
            sortable: "custom",
            width: 100,
            align: "center",
            render: (h, params) => {
              return <span>{params.row.deposit_rate}%</span>;
            },
          },
          {
            title: "回充",
            key: "re_deposit_rate",
            width: 80,
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              return <span>{params.row.re_deposit_rate}%</span>;
            },
          },
          {
            title: "总存款",
            key: "deposit_amount",
            sortable: "custom",
            align: "center",
          },
          {
            title: "总取款",
            key: "withdrawals_amount",
            sortable: "custom",
            align: "center",
          },
          {
            title: "现金利润",
            key: "cash_profit",
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              let color =
                params.row.cash_profit > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return <span style={{ color }}>{params.row.cash_profit}</span>;
            },
          },
          {
            title: "回收",
            key: "rec_rate",
            width: 80,
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              let color =
                params.row.rec_rate > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return <span style={{ color }}>{params.row.rec_rate}%</span>;
            },
          },
          {
            title: "注册成本",
            sortable: "custom",
            key: "register_cost",
            align: "center",
          },
          {
            title: "充值成本",
            key: "deposit_cost",
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              let color = params.row.deposit_cost > 2500 ? "#FF2626" : "";
              return <span style={{ color }}>{params.row.deposit_cost}</span>;
            },
          },
          {
            title: "操作",
            key: "typeName",
            align: "center",
            width: 180,
            render: (h, params) => {
              const { status, start_time } = params.row;
              if (start_time == "总计") return <span>-</span>;
              if (start_time == "小计") return <span>-</span>;
              else
                return (
                  <div class="cs blue-font">
                    <span
                      onClick={() => {
                        this.onVt(params);
                      }}
                    >
                      {status != "black" ? "	续费" : ""}
                    </span>
                    <span
                      class="ml5 mr5 cs"
                      onClick={() => {
                        this.onDetial(params);
                      }}
                    >
                      明细
                    </span>
                    <span
                      style={{
                        color: status == "started" ? "#c3c3c3" : "#2d8cf0",
                      }}
                      onClick={() => {
                        if (status != "started") {
                          if (status == "black") {
                            this.outBlack(params);
                          } else this.onBlack(params);
                        }
                      }}
                      class="ml5"
                    >
                      {status == "black" ? "移除黑名单" : "黑名单"}
                    </span>
                    <span
                      class="ml5"
                      onClick={() => {
                        this.delete(params, "all");
                      }}
                    >
                      删除
                    </span>
                  </div>
                );
            },
          },
        ],
        _columns: [
          {
            title: "广告时段",
            key: "start_time",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              //  状态 stop: 未开始 started: 进行中 finish: 已结束 black: 黑名单
              const { start_time, end_time, status } = params.row;
              let sumTime = `${start_time}` + `~` + ` ${end_time}`;
              if (sumTime.includes("总计")) {
                return <span>总计</span>;
              } else if (sumTime.includes("小计")) {
                return <span>小计</span>;
              } else {
                if (status == "stop") {
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                    >
                      <span>{sumTime}</span>
                      <Icons
                        type="weikaishi"
                        style="position: absolute;top:-7px;left:0;"
                        color="#5A8DFF"
                        size="34"
                      ></Icons>
                    </div>
                  );
                }
                if (status == "started") {
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                    >
                      <span>{sumTime}</span>

                      <Icons
                        type="jinhangzhong"
                        style="position: absolute;top:-7px;left:0;"
                        color="#FF5858"
                        size="34"
                      ></Icons>
                    </div>
                  );
                }
                if (status == "finish") {
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                    >
                      <span>{sumTime}</span>

                      <Icons
                        type="yijieshu"
                        style="position: absolute;top:-7px;left:0;"
                        color="#999999"
                        size="34"
                      ></Icons>
                    </div>
                  );
                }
                if (status == "black") {
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                    >
                      <span>{sumTime}</span>

                      <Icons
                        type="heimingdan1"
                        style="position: absolute;top:-7px;left:0;"
                        color="#3F3F3F"
                        size="34"
                      ></Icons>
                    </div>
                  );
                }
              }
            },
          },
          {
            //明细报表
            title: "广告名称",
            key: "main_domain",
            align: "center",
            minWidth: 60,
            render: (h, params) => {
              const { sub_domain, main_domain } = params.row;
              let c = Array(main_domain).concat(sub_domain);
              if (main_domain == "-") {
                return <span>-</span>;
              } else
                return (
                  <div
                    class="box"
                    style=" display: flex;flex-direction: row;justify-content: center;"
                  >
                    <span class="ib box-left" style="width:120px">
                      {main_domain}
                    </span>
                    <Poptip
                      trigger="hover"
                      placement="right"
                      word-wrap
                      transfer
                    >
                      <div
                        slot="content"
                        class="box-right"
                        style="max-height:300px;;overflow-y:auto;overflow-x:hidden"
                      >
                        <ul>
                          {c.map((t) => (
                            <li>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <Icons
                        style={{
                          display: c.length > 1 ? "inline-block" : "none",
                        }}
                        type="bangzhutishi"
                        color="#E4E4E4"
                        size="16"
                      />
                    </Poptip>
                  </div>
                );
            },
          },
          {
            title: "代理账号",
            key: "username",
            align: "center",
          },
          {
            title: "本期价格",
            key: "amount",
            align: "center",
            render: (h, params) => {
              const { amount, remark } = params.row;
              return (
                <div style="display:flex;flex-direction: row;justify-content: center;align-items: center;">
                  <span class="ib" style="width:70px">
                    {amount}
                  </span>
                  <Poptip trigger="hover" placement="right" word-wrap transfer>
                    <div slot="content">{remark}</div>
                    <Icons
                      style={{ display: remark ? "inline-block" : "none" }}
                      type="bangzhutishi"
                      class="ml5"
                      color="#E4E4E4"
                      size="16"
                    />
                  </Poptip>
                </div>
              );
            },
          },
          {
            title: "消耗天数",
            key: "used_day",
            align: "center",
          },
          {
            title: "剩余天数",
            key: "remaining_day",
            align: "center",
          },
          {
            title: "本期消耗",
            key: "used_amount",
            align: "center",
          },
          {
            title: "剩余金额",
            key: "remaining_amount",
            align: "center",
          },
          {
            title: "操作",
            key: "typeName",
            align: "center",
            render: (h, params) => {
              const { start_time } = params.row;
              if (start_time == "总计") return <span>-</span>;
              if (start_time == "小计") return <span>-</span>;
              else
                return (
                  <div class="cs blue-font">
                    <span
                      onClick={() => {
                        this.edit(params);
                      }}
                    >
                      编辑
                    </span>
                    <span
                      onClick={() => {
                        this.delete(params, "detial");
                      }}
                      class="ml5"
                    >
                      删除
                    </span>
                  </div>
                );
            },
          },
        ],
        montenColumns: [
          {
            title: "广告时段",
            key: "start_time",
            align: "center",
            width: "130",
            render: (h, params) => {
              const {
                start_time,
                end_time,
                status,
                start_time2,
                end_time2,
              } = params.row;
              let sumTime = `${start_time2}` + `~` + ` ${end_time2}`;
              let timeTip = start_time + `~` + end_time;

              if (timeTip.includes("总计")) {
                return <span>总计</span>;
              } else if (timeTip.includes("小计")) {
                return <span>小计</span>;
              } else
             {
               if(status=='started'){//进行中
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                    >
                      <span>{sumTime}</span>

                      <Icons
                        type="jinhangzhong"
                        style="position: absolute;top:-7px;left:0;"
                        color="#FF5858"
                        size="34"
                      ></Icons>
                    </div>
                  );

               }
               if(status=='finish'){//已结束
                  return (
                    <div
                      style="margin:auto;position:relative;"
                      class="clerafix"
                    >
                      <span>{sumTime}</span>

                      <Icons
                        type="yijieshu"
                        style="position: absolute;top:-7px;left:0;"
                        color="#999999"
                        size="34"
                      ></Icons>
                    </div>
                  );

               }
                  return (
                  <span>
                    <Tooltip
                      trigger="hover"
                      class="cs"
                      placement="bottom"
                      transfer
                    >
                      {sumTime}
                      <div slot="content">
                        {" "}
                        <span>{timeTip}</span>
                      </div>
                    </Tooltip>
                  </span>
                );
             }
            },
          },
          {
            title: "广告名称",
            key: "main_domain",
            align: "center",
            minWidth: 12,
            render: (h, params) => {
              const { sub_domain, main_domain } = params.row;
              let c = Array(main_domain).concat(sub_domain);

              if (main_domain == "-") {
                return <span>-</span>;
              } else
                return (
                  <div
                    class="box"
                    style=" display: flex;flex-direction: row;justify-content: center;align-items: center;"
                  >
                    <span
                      class="ib box-left text-overflow-ellipsis"
                      style="width:70px"
                    >
                      {main_domain}
                    </span>
                    <Poptip
                      trigger="hover"
                      placement="right"
                      max-height="20"
                      word-wrap
                      transfer
                    >
                      <div
                        slot="content"
                        style="max-height:300px;;overflow-y:auto;overflow-x:hidden"
                      >
                        <ul>
                          {c.map((t) => (
                            <li>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <Icons
                        type="bangzhutishi"
                        // class="ml5"
                        color="#E4E4E4"
                        size="16"
                      />
                    </Poptip>
                  </div>
                );
            },
          },
          {
            title: "代理账号",
            key: "username",
            align: "center",
          },
          {
            title: "总价格",
            key: "amount",
            // width: ,
            //  width: 85,
            align: "center",
            sortable: "custom",
          },
          {
            title: "",
            key: "used_day",
            sortable: "custom",
            align: "center",
            width: 68,
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "消耗天数",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "天数",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            key: "used_amount",
            sortable: "custom",

            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "总消耗金额",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "金额",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            key: "remaining_amount",
            sortable: "custom",
            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "剩余金额",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "余额",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            width: 68,
            key: "register_count",
            sortable: "custom",
            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "注册人数",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "注册",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "",
            width: 68,
            key: "deposit_count",
            sortable: "custom",
            align: "center",
            renderHeader: (h, params) => {
              return h("span", [
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "充值人数",
                      trigger: "hover",
                      size: "small",
                      placement: "top-start",
                      transfer: true,
                      cursor: "pointer",
                      theme: "light",
                    },
                  },
                  [
                    h("span", {
                      domProps: {
                        innerHTML: "充值",
                      },
                    }),
                  ]
                ),
              ]);
            },
          },
          {
            title: "转换率",
            key: "deposit_rate",
            sortable: "custom",
            width: 100,
            align: "center",
            render: (h, params) => {
              return <span>{params.row.deposit_rate}%</span>;
            },
          },
          {
            title: "回充",
            key: "re_deposit_rate",
            width: 80,
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              return <span>{params.row.re_deposit_rate}%</span>;
            },
          },
          {
            title: "总存款",
            key: "deposit_amount",
            sortable: "custom",
            align: "center",
          },
          {
            title: "总取款",
            key: "withdrawals_amount",
            sortable: "custom",
            align: "center",
          },
          {
            title: "现金利润",
            key: "cash_profit",
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              let color =
                params.row.cash_profit > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return <span style={{ color }}>{params.row.cash_profit}</span>;
            },
          },
          {
            title: "回收",
            key: "rec_rate",
            width: 80,
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              let color =
                params.row.rec_rate > 0 ? "#FF2626" : "rgb(35, 153, 97)";
              return <span style={{ color }}>{params.row.rec_rate}%</span>;
            },
          },
          {
            title: "注册成本",
            sortable: "custom",
            key: "register_cost",
            align: "center",
          },
          {
            title: "充值成本",
            key: "deposit_cost",
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              let color = params.row.deposit_cost > 2500 ? "#FF2626" : "";
              return <span style={{ color }}>{params.row.deposit_cost}</span>;
            },
          },
        ],
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.toList=to;
      //设置过密码
      adAssertSetPassword({ siteId: vm.$root.nowSite.id }).then((res) => {
        if (res != undefined && res.code == 200) {
          vm.isSetPassword = res.data;
          vm.formKey.password = "";
          vm.$refs.formKey.resetFields();
          let newCheckStatus=JSON.parse(localStorage.accessSite).find(t=>t.id==vm.$root.nowSite.id).status;
          // let changeStatus=localStorage.status;
        // if (( newCheckStatus =='true')||(newCheckStatus==true))
          if (newCheckStatus==true) {
         
            vm.spinShow = false;
            let data = { ...vm.searchKey };
            for (let key in data) {
              if (!data[key]) delete data[key];
            }
            vm.getData({ params: data },'allTable');
            let timeData = { siteId: vm.$root.nowSite.id };
            vm.getTimeData(timeData);
          } else {
            //未设置密码
            vm.spinShow = true;
            vm.$refs.advPasswordModals.show();
          }
        }
      });
    });
  },
  methods: {
    ...mapMutations([
    "closeTag",
    ]),
    modalVisible(flag){
       let e1 = event.currentTarget;
      let e2 = event.target;
      let value=flag[0];
      if(e1!=e2){
        if(value==false){
         let newTag=getTagNavListFromLocalstorage()[0];
         if(newTag.name=="memberSearch"){
           this.$router.push({name: this.$config.homeName});
           this.closeTag(this.toList);
         }else{
            this.closeTag(this.toList);
         }
        }
      }
    },
    afterSave() {//取消密码
      this.$refs.advPasswordModals.hide();
      this.spinShow = false;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data },'allTable');
      let timeData = { siteId: vm.$root.nowSite.id };
      vm.getTimeData(timeData);
    },
    passWordSave(type) { 
      //'reSetPassword'  重置密码
      // 'checkedPassword' 验证密码
      let passData = { ...this.formKey };
      for (let key in passData) {
        if (!passData[key]) delete passData[key];
      }
      this.$refs.formKey.validate((valid) => {
        if (valid) {
          this.$root.startEditLoading();
          if (type == "reSetPassword") {
            adResetPassword(passData, true).then((res) => {
              if (res != undefined && res.code == 200) {
              this.$root.endEditLoading();
              localStorage.status =true;
              let newAccessSite=JSON.parse(localStorage.accessSite);
              newAccessSite.forEach(t=>{
                if(t.id==this.$root.nowSite.id){
                  this.$set(t,'status',true)
                }
              })
              localStorage.accessSite=JSON.stringify(newAccessSite);
                this.$refs.advPasswordModals.hide();
                let data = { ...this.searchKey };
                this.spinShow = false;
                for (let key in data) {
                  if (!data[key]) delete data[key];
                }
                this.getData({ params: data },'allTable');
                let timeData = { siteId: this.$root.nowSite.id };
                this.getTimeData(timeData);
              }
            });
          }
          if (type == "checkedPassword") {
            adVerifyPassword(passData, true).then((res) => {
              if (res != undefined && res.code == 200) {
                this.$root.endEditLoading();
                localStorage.status =true;
              let newAccessSite=JSON.parse(localStorage.accessSite);
              newAccessSite.forEach(t=>{
                if(t.id==this.$root.nowSite.id){
                  this.$set(t,'status',true)
                }
              })
              localStorage.accessSite=JSON.stringify(newAccessSite);
                this.passType = true;
                this.$refs.advPasswordModals.hide();
                this.spinShow = false;
                let data = { ...this.searchKey };
                for (let key in data) {
                  if (!data[key]) delete data[key];
                }
                this.getData({ params: data },'allTable');
                let timeData = { siteId: this.$root.nowSite.id };
                this.getTimeData(timeData);
              }
            });
          }
        }
      });
       
    },
    getTimeData(data) {
      //时间查询
      adReportCountdown(data).then((res) => {
        if (res != undefined && res.code == 200) {
          this.countData = res.data;
        }
      });
    },
    mydefineRow(row, index) {
      //金额达到条件
      if (
        row.deposit_cost > 2500 &&
        row.start_time != "小计" &&
        row.start_time != "总计"
      ) {
        return "demo-row-red";
      } else {
        return "";
      }
    },
    sortChange({ column, key, order }) {
      //排序
      delete this.searchKey.sort_key;
      delete this.searchKey.sort_val;
      let data = {
        sort_key: key,
        sort_val: order,
        ...this.searchKey,
        siteId: this.$root.nowSite.id,
      };
      this.searchKey.sort_key = key;
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.sort_val == "normal") {
        this.table.columns.forEach((item) => {
          if (item.key == column.key) this.$set(item, "sortType", "asc");
        });
        this.searchKey.sort_val = "asc";
        data.sort_val = "asc";
      } else {
        this.searchKey.sort_val = order;
        this.table.columns.forEach((item) => delete item.sortType);
      }
      if (this.tabName == "明细表") {
        this.getData({ params: data },'detialTable');
      }
           if (this.tabName == "月报表") {
        data.month = "0";
        for (let key in data) {
          if (key == "status" || key == "start_time" || key == "end_time") {
            delete data[key];
          }
        }
        // this.changeBtn("本月");
          this.getData({ params: data },'monthTable');
    
      }
        if (this.tabName  == "总报表") {
        if (data.start_time) delete data.start_time;
        if (data.end_time) delete data.end_time;
        this.getData({ params: data },'allTable');
      }
      
       if(this.tabName=='期末表'){
          for (let key in data) {
          if (key == "start_time" || key == "end_time") {
            delete data[key];
          }
        }
         this.getData({ params: data },'endTable');

      }
    },
    exportExcel() {
      //导出
      let data = {
        ...this.searchKey,
        start_time: this.$root.formatTimeS(this.Time[0]),
        end_time: this.$root.formatnightTimeS(this.Time[1]),
      };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      const { start_time, end_time } = data;
      if (start_time == "Invalid date" || end_time == "Invalid date") {
        this.$Tip.info({ content: "请输入开始和结束日期！" });
        return false;
      }
      if (new Date(end_time).getTime() - new Date(start_time).getTime() < 0) {
        this.$Tip.info({ content: "结束日期必须大于开始日期" });
        return false;
      }
      this.searchKey.start_time = data.start_time;
      this.searchKey.end_time = data.end_time;
      data.isExport = 1;
      this.$root.startEditLoading();
      let openr = window.open();
      if (this.tabName == "明细表") {
        adDetailList({ params: data },true)
          .then((res) => {
            if (res != undefined && res.code == 200) {
              let region = res.data.downloadUrl;
              let nowHost = region.split(".com")[1];
              let openr1 = openr ? openr : window;
              openr1.location.href = nowHost;
            } else {
              openr.close();
            }
            this.$root.endEditLoading();
          })
          .catch((error) => this.$root.endEditLoading());
      }
      if (this.tabName == "月报表") {
        for (let key in data) {
          if (key == "status") delete data[key];
          if (key == "start_time") delete data[key];
          if (key == "end_time") delete data[key];
          if (!data[key]) delete data[key];
        }
        if (this.activeBtn == "本月") {
          data.month = "0";
        }
        if (this.activeBtn == "上月") {
          data.month = "1";
        }
        adReportMonthlyList({ params: data },true)
          .then((res) => {
            if (res != undefined && res.code == 200) {
              let region = res.data.downloadUrl;
              let nowHost = region.split(".com")[1];
              let openr1 = openr ? openr : window;
              openr1.location.href = nowHost;
            } else {
              openr.close();
            }
            this.$root.endEditLoading();
          })
          .catch((error) => this.$root.endEditLoading());
      }
            if (this.tabName == "期末表") {
        for (let key in data) {
      
          if (key == "start_time") delete data[key];
          if (key == "end_time") delete data[key];
          if (!data[key]) delete data[key];
        }
     
        adReportLastList({ params: data })
          .then((res) => {
            if (res != undefined && res.code == 200) {
              let region = res.data.downloadUrl;
              let nowHost = region.split(".com")[1];
              let openr1 = openr ? openr : window;
              openr1.location.href = nowHost;
            } else {
              openr.close();
            }
            this.$root.endEditLoading();
          })
          .catch((error) => this.$root.endEditLoading());
      }
      if (this.tabName == "总报表") {
        for (let key in data) {
          if (key == "status") delete data[key];
          if (key == "start_time") delete data[key];
          if (key == "end_time") delete data[key];
          if (!data[key]) delete data[key];
        }
        adReportList({ params: data })
          .then((res) => {
            if (res != undefined && res.code == 200) {
              let region = res.data.downloadUrl;
              let nowHost = region.split(".com")[1];
              let openr1 = openr ? openr : window;
              openr1.location.href = nowHost;
            } else {
              openr.close();
            }
            this.$root.endEditLoading();
          })
          .catch((error) => this.$root.endEditLoading());
      }
    },
    onDetial(params) {
      //详情
      this.tabName = "明细表";
      this.searchKey.status = "";
      this.searchKey.username = params.row.username;
      let data = { siteId: this.$root.nowSite.id, ...this.searchKey };

      for (let key in data) {
        if (!data[key]) delete data[key];
        if (key == "start_time") {
          delete data[key];
        }
        if (key == "end_time") {
          delete data[key];
        }
      }
       this.getData({ params: data },'detialTable');
      
    },
    daySum(params) {
      this.isSpin = true;
      const { uid } = params.row;
      let data = {
        siteId: this.$root.nowSite.id,
        uid,
      };
      adDetailSimpleList(data).then((res) => {
        if (res && res.code == 200) {
          this.isSpin = false;
          const { data } = res;
          this.daySumList = data;
          let a = this.daySumList.length;
          this.daySumList.forEach((item, i) => {
            item.i = a--;
          });
        }
      });
    },
    onVt(params) {
      this.$refs.advModals.show("vt", params);
    },
    outBlack(params) {
      let text =
        "您确定将【" + `${params.row.username}` + "】移出广告黑名单吗？";
      let msg = "移除广告黑名单成功";
      const { id } = params.row;
      let data = {
        id,
        siteId: this.$root.nowSite.id,
        type: "report",
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          adBlacklistDelete(data, true).then((res) => {
            if (res && res.code == 200) {
              this.table.data.splice(params.index, 1);
            }
          });
        },
      });
    },
    onBlack(params) {
      this.$refs.advModals.show("blank", params);
    },
    searchSubmit(type) {
      this.timeType = type;
      if (type == "search") {
        //导航查询
        if (this.page != 1) this.$refs.table.setPage();
        let { sort_key, sort_val } = this.searchKey;
        if (sort_key) delete this.searchKey.sort_key;
        if (sort_val) delete this.searchKey.sort_val;
        let data = {
          ...this.searchKey,
        };
        this.table.columns.forEach((item) => {
          if (item.sortable == "custom") this.$set(item, "sortType", "");
        });
        if (data.username) data.username = this.$root.trimAll(data.username);
        if (data.domain) data.domain = this.$root.trimAll(data.domain);

        for (let key in data) {
          if (!data[key]) delete data[key];
        }
        if (this.tabName == "月报表") {
          if (this.activeBtn == "本月") {
            data.month = "0";
          }
          if (this.activeBtn == "上月") {
            data.month = "1";
          }

          for (let key in data) {
            if (!data[key]) delete data[key];
            if (key == "start_time") {
              delete data[key];
            }
            if (key == "end_time") {
              delete data[key];
            }
            if (key == "status") {
              delete data[key];
            }
          }
          if (data.username) {
            if (!this.$root.validateName(data.username)) {
              this.$Tip.info({
                content: "您所查询的代理账号不正确，请重新输入",
              });
              return false;
            }
          }
          this.getData({ params: data },'monthTable');
        }
          if (this.tabName == "期末表") {
        

          for (let key in data) {
            if (!data[key]) delete data[key];
            if (key == "start_time") {
              delete data[key];
            }
            if (key == "end_time") {
              delete data[key];
            }
            // if (key == "status") {
            //   delete data[key];
            // }
          }
          if (data.username) {
            if (!this.$root.validateName(data.username)) {
              this.$Tip.info({
                content: "您所查询的代理账号不正确，请重新输入",
              });
              return false;
            }
          }
          this.getData({ params: data },'endTable');
        }

        if (this.tabName == "明细表") {
          data.start_time = this.$root.formatTime(this.Time[0]);
          data.end_time = this.$root.formatTime(this.Time[1]);
          for (let key in data) {
            if (!data[key]) delete data[key];
            if (data[key] == "Invalid date") {
              delete data[key];
            }
          }
          this.searchKey.start_time = data.start_time;
          this.searchKey.end_time = data.end_time;
          const { start_time, end_time } = data;

          if (data.username) {
            if (!this.$root.validateName(data.username)) {
              this.$Tip.info({
                content: "您所查询的代理账号不正确，请重新输入",
              });
              return false;
            }
          }
          this.getData({ params: data },'detialTable');
        }
        if (this.tabName == "总报表") {
          if (data.username) {
            if (!this.$root.validateName(data.username)) {
              this.$Tip.info({
                content: "您所查询的代理账号不正确，请重新输入",
              });
              return false;
            }
          }
          this.getData({ params: data },'allTable');
        }
      } else {
        let data = { siteId: this.$root.nowSite.id, status: "countdown" };
        this.getData({ params: data },'allTable');
      }
    },
    changeBtn(name) {
      if (this.page != 1) this.$refs.table.setPage();
      this.activeBtn = name;
      switch (name) {
        case "本月":
          this.searchKey.start_time = this.$root.monthStartTime();
          this.searchKey.end_time = this.$root.monthEndTimeNew();
          break;
        case "上月":
          this.searchKey.start_time = this.$root.lastMonthStartTime();
          this.searchKey.end_time = this.$root.lastMonthEndTime();
          break;
      }

      let data = { ...this.searchKey };
      const { start_time, end_time } = this.searchKey;
      this.Time[0] = start_time;
      this.Time[1] = end_time;
      for (let key in data) {
        if (!data[key]) delete data[key];
      }

      if (this.tabName == "明细表") {
      
         this.getData({ params: data },'detialTable');
      }
      if (this.tabName == "月报表") {
        if (this.activeBtn == "本月") {
          data.month = "0";
        }
        if (this.activeBtn == "上月") {
          data.month = "1";
        }
        for (let key in data) {
          if (key == "status" || key == "start_time" || key == "end_time") {
            delete data[key];
          }
        }
        this.getData({ params: data },'monthTable');
      }
    },
    delete(params, type) {
      let text = "您确定将删除此条广告吗?";
      let msg = "删除成功";
      const { id } = params.row;
      let data = {
        id,
        siteId: this.$root.nowSite.id,
      };

      this.$Tip.confirm({
        content: text,
        onOk: () => {
          if (type == "all") {
            adReportDelete(data, true).then((res) => {
              if (res && res.code == 200) {
                this.table.total--;
                if (this.table.total > 1) {
                  this.table.data.splice(params.index, 1);
                } else {
                  let searchData = {
                    siteId: this.$root.nowSite.id,
                    ...this.searchKey,
                  };
                  for (let key in searchData) {
                    if (!searchData[key]) delete searchData[key];
                  }
                  this.getData({ params: searchData });
                }

                this.$Message.success({ content: "删除成功" });
              }
            });
          }
          if (type == "detial") {
            adDetailDelete(data, true).then((res) => {
              if (res && res.code == 200) {
                this.table.total--;
                if (this.table.total > 1) {
                  this.table.data.splice(params.index, 1);
                } else {
                  let searchData = {
                    siteId: this.$root.nowSite.id,
                    ...this.searchKey,
                  };
                  for (let key in searchData) {
                    if (!searchData[key]) delete searchData[key];
                  }
                   this.getData({ params: searchData },'detialTable');
                 
                }
                this.$Message.success({ content: "删除成功" });
              }
            });
          }
        },
      });
    },
    edit(params) {
      this.$refs.advModals.show("edit", params);
    },
    addAdv() {
      this.$refs.advModals.show("add");
    },
    tabClick(item) {
    
      this.tabName = item.name;//选中的按钮
      let data = { ...this.searchKey };
      if (data.username) data.username = this.$root.trimAll(data.username);
      if (data.domain) data.domain = this.$root.trimAll(data.domain);
      if (data.username) {
        if (!this.$root.validateName(data.username)) {
          this.$Tip.info({ content: "您所查询的代理账号不正确，请重新输入" });
          return false;
        }
      }
      for (let key in data) {
        if (!data[key]) delete data[key];
      }

      if (this.tabName == "明细表") {
        this.getData({ params: data },'detialTable');
      }
      if (this.tabName == "月报表") {
        data.month = "0";
        for (let key in data) {
          if (key == "status" || key == "start_time" || key == "end_time") {
            delete data[key];
          }
        }
        // this.changeBtn("本月");
          this.getData({ params: data },'monthTable');
    
      }
      if (this.tabName  == "总报表") {
        if (data.start_time) delete data.start_time;
        if (data.end_time) delete data.end_time;
        this.getData({ params: data },'allTable');
      }
      if(this.tabName=='期末表'){
          for (let key in data) {
          if (key == "start_time" || key == "end_time") {
            delete data[key];
          }
        }
         this.getData({ params: data },'endTable');

      }
    },
    getData(data,activeTable) {
  
      this.$root.startTableLoading();
      if(activeTable=='allTable'){

        adReportList(data)
          .then((res) => {
            if (res != undefined && res.code == 200) {
              const { data, total_amount, page_amount } = res.data;
              data.length && data.push(this.createTotalDataSmall(page_amount,'small'));
               data.length && data.push(this.createTotalDataBig(total_amount,'big'));
              this.table.data = res.data.data.filter((item) => item);
              this.table.total = res.data.total;
            }
            this.$root.endTableLoading();
          })
          .catch((error) => this.$root.endTableLoading());
      }
   

      //月报表
      if(activeTable=='monthTable'){
        this.activeBtn='本月';
             adReportMonthlyList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total_amount, page_amount } = res.data;
            data.length && data.push(this.createTotalDataSmall(page_amount,'small'));
               data.length && data.push(this.createTotalDataBig(total_amount,'big'));
            this.table.data = res.data.data.filter((item) => item);
            this.table.total = res.data.total;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
      }
      //期末
        if(activeTable=='endTable'){
            adReportLastList(data).then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total_amount, page_amount } = res.data;
               data.length && data.push(this.createTotalDataSmall(page_amount,'small'));
               data.length && data.push(this.createTotalDataBig(total_amount,'big'));

            this.table.data = res.data.data.filter((item) => item);
            this.table.total = res.data.total;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());

      }
      //明细
         if(activeTable=='detialTable'){
          adDetailList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total_amount, page_amount } = res.data;
               data.length && data.push(this.createTotalDataSmall(page_amount,'detialSmall'));
               data.length && data.push(this.createTotalDataBig(total_amount,'detialBig'));

            this.table.data = res.data.data.filter((item) => item);
            this.table.total = res.data.total;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());

      }
    }, 
    createTotalData(total_amount) {
      const {
        amount,
        used_day,
        used_amount,
        remaining_amount,
        register_count,
        deposit_count,
        deposit_amount,
        withdrawals_amount,
        deposit_rate,
        re_deposit_rate,
        cash_profit,
        rec_rate,
        register_cost,
        deposit_cost,
        remaining_day,
      } = total_amount;
      let item = {
        start_time: "总计",
        amount,
        used_day,
        username: "-",
        main_domain: "-",
        used_amount,
        remaining_amount,
        register_count,
        deposit_count,
        deposit_amount,
        withdrawals_amount,
        deposit_rate,
        re_deposit_rate,
        cash_profit,
        rec_rate,
        register_cost,
        deposit_cost,
        remaining_day,
      };
      return item;
    },
    createTotalDataBig(total_amount,type){
      if(type=='big'){
          const {
        amount,
        used_day,
        used_amount,
        remaining_amount,
        register_count,
        deposit_count,
        deposit_amount,
        withdrawals_amount,
        deposit_rate,
        re_deposit_rate,
        cash_profit,
        rec_rate,
        register_cost,
        deposit_cost,
        remaining_day,
      } = total_amount;
      let item = {
        start_time: "总计",
        amount,
        used_day,
        username: "-",
        main_domain: "-",
        used_amount,
        remaining_amount,
        register_count,
        deposit_count,
        deposit_amount,
        withdrawals_amount,
        deposit_rate,
        re_deposit_rate,
        cash_profit,
        rec_rate,
        register_cost,
        deposit_cost,
        remaining_day,
      };
      return item;
      }
      if(type=='detialBig'){
          const {
        amount,
        remaining_amount,
        remaining_day,
        used_amount,
        used_day,
      } = total_amount;
      let item = {
        start_time: "总计",
        username: "-",
        main_domain: "-",
        amount,
        remaining_amount,
        remaining_day,
        used_amount,
        used_day,
      };
      return item;

      }
    },
       createTotalDataSmall(page_amount,type){
         if(type='small'){
             const {
        amount,
        used_day,
        used_amount,
        remaining_amount,
        register_count,
        deposit_count,
        deposit_amount,
        withdrawals_amount,
        deposit_rate,
        re_deposit_rate,
        cash_profit,
        rec_rate,
        register_cost,
        deposit_cost,
        remaining_day,
      } = page_amount;
      let item = {
        start_time: "小计",
        amount,
        used_day,
        username: "-",
        main_domain: "-",
        used_amount,
        remaining_amount,
        register_count,
        deposit_count,
        deposit_amount,
        withdrawals_amount,
        deposit_rate,
        re_deposit_rate,
        cash_profit,
        rec_rate,
        register_cost,
        deposit_cost,
        remaining_day,
      };
      return item;

         }
   
        if(type=='detialBig'){
            const {
        amount,
        remaining_amount,
        remaining_day,
        used_amount,
        used_day,
      } = page_amount;
      let item = {
        start_time: "小计",
        username: "-",
        main_domain: "-",
        amount,
        remaining_amount,
        remaining_day,
        used_amount,
        used_day,
      };
      return item;
        }
       },
    onPageChange(page) {
      this.page = page;
      let data = { ...this.searchKey };

      if (this.tabName == "总报表") {
        if (this.timeType == "search") {
          for (let key in data) {
            if (!data[key]) delete data[key];
            if (key == "start_time") delete data[key];
            if (key == "end_time") delete data[key];
          }
          this.getData({ params: data, query: { page } },'allTable');
        } else {
          let timeData = { siteId: this.$root.nowSite.id, status: "countdown" };

          this.getData({ params: timeData, query: { page } },'allTable');
        }
      }
      if (this.tabName == "明细表") {
        for (let key in data) {
          if (!data[key]) delete data[key];
        }
  
        this.getData({ params: data ,query: { page } },'detialTable');
      }
      if (this.tabName == "月报表") {
        for (let key in data) {
          if (key == "start_time") delete data[key];
          if (key == "end_time") delete data[key];
          if (!data[key]) delete data[key];
        }
        this.getData({ params: data, query: { page } },'monthTable');
      }
      if(this.tabName=='期末表'){
         for (let key in data) {
          if (key == "start_time") delete data[key];
          if (key == "end_time") delete data[key];
          if (!data[key]) delete data[key];
        }
        this.getData({ params: data, query: { page } },'endTable');
        
      }
    },
    onPageSizeChange(pageSize) {
      let data = { ...this.searchKey, limit: pageSize };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (this.tabName == "总报表") {

        if (this.timeType == "search") {
          for (let key in data) {
            if (!data[key]) delete data[key];
            if (key == "start_time") delete data[key];
            if (key == "end_time") delete data[key];
          }
          this.getData({ params: data },'allTable');
        } else {
          let timeData = {
            siteId: this.$root.nowSite.id,
            limit: pageSize,
            status: "countdown",
          };

          this.getData({ params: timeData },'allTable');
        }
      }
      if (this.tabName == "明细表") {
        for (let key in data) {
          if (!data[key]) delete data[key];
        }
  
         this.getData({ params: data },'detialTable');
        
      }
      if (this.tabName == "月报表") {
        for (let key in data) {
          if (!data[key]) delete data[key];
          if (key == "status") delete data[key];
          if (key == "start_time") delete data[key];
          if (key == "end_time") delete data[key];
        }
        this.getData({ params: data },'monthTable');
      }
       if (this.tabName == "期末表") {
        for (let key in data) {
          if (!data[key]) delete data[key];
       
          if (key == "start_time") delete data[key];
          if (key == "end_time") delete data[key];
        }
        this.getData({ params: data },'endTable');
      }
      this.pageSize = pageSize;
    },
  },
};
</script>
<style lang="less" scoped >

@import "../../../styles/button.less";


/deep/.ivu-table-cell {
  height: 48px;
  line-height: 48px;
}
.activeClass {
  background-color: #2d8cf0;
  color: #fff;
}
/deep/.ivu-table .demo-row-red td {
  background-color: #ffecf6 !important;
  color: #fff;
}

/deep/.ivu-form-item-error-tip {
  width: 250px;
}
/deep/.focusInput{
  height: 36px;
  border:1px solid #c5c8ce ;
  border-radius: 5px;
}

/deep/.focusInput:focus{
  outline:none;   //去除高亮直角边框
  border:0.5px solid #2d8cf0;
  border-radius: 5px;
}
</style>
