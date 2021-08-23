<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem v-for="(t, i) in btnList" :key="i">
          <Button class="fontColor" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click="changeBtn(t)">
            <span>{{ t }}</span>
          </Button>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker placeholder="开始日期" class="s-120" @on-change="startChange" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker placeholder="结束日期" class="s-120" @on-change="startChange" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem label="风险状态">
          <Select
            class="s-80"
            v-model="searchKey.state"
            @on-change="onChange"
            clearable
            placeholder="全部"
            :disabled="searchKey.multiple==null?false:true"
          >
            <!-- <Option value="3">正常</Option>
            <Option value="1">风险</Option>
            <Option value="2">停用</Option> -->
            <!-- <Option value="5">全部</Option> -->
            <Option value="3">利润</Option>
            <Option value="2">低倍</Option>
            <Option value="1">高倍</Option>
            <Option value="0">正常</Option>
            <Option value="4">停用</Option>
          </Select>
          <span v-show="isShow">
            -
            <Select
              class="s-80"
              v-model="searchKey.stateTow"
              @on-change="stateTwoChange"
              clearable
              placeholder="全部"
            >
              <!-- <Option value="0">全部</Option> -->
              <Option value="1">已处理</Option>
              <Option value="2">未处理</Option>
            </Select>
          </span>
        </FormItem>
        <FormItem label="等级">
          <Select class="s-80" v-model="searchKey.level" clearable placeholder="全部">
            <Option v-for="(t,i) in levelList" :key="i" :value="t.levelLabel">{{t.levelAlias}}</Option>
          </Select>
        </FormItem>
        <FormItem label="投注倍数">
          <InputNumber
            :min="1"
            text="number"
            key="multiple"
            class="s-80 ml5"
            v-model="searchKey.multiple"
            placeholder="请输入"
            :disabled="disabled"
          />
        </FormItem>
        <FormItem>
          <Select v-model="searchKey.typeTag" class="s-100">
            <Option value="userName">会员账号</Option>
            <Option value="agencyName">上级代理</Option>
            <Option value="admin">操作人</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            v-model="searchKey.content"
            :disabled="!searchKey.typeTag"
            @keyup.enter.native="searchSubmit"
            :placeholder="searchKey.typeTag == 'userName' ? '请输入会员账号' : '请输入代理账号'"
            class="s-120"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="ivu-btn search"
            @click.prevent="searchSubmit"
          >查询</Button>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.editBtnLoading"
            class="ivu-btn export"
            @click.prevent="exportExcel"
          >导出Excel</Button>
        </FormItem>
        <FormItem class="fr">
          <Poptip  trigger="hover" placement="bottom-end" class="ml5 fl">
              <div slot="content" class="mb20">
                  <div class="ft14 pt10">
                      <div>优惠占比=优惠金额/存款金额 X 100%</div>
                      <div>利润风险：现金利润/存款金额 X 100% < 7% （历史总数据）</div>
                      <div>低倍风险：0.01~2.99倍为低倍风险</div>
                      <div>高倍风险：10倍及以上为高倍风险</div>
                  </div>
              </div>
              <Icons type="bangzhutishi" color="#E4E4E4" :size="26" />
          </Poptip>
         </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :showSummary="false"
        :stripe="false"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="sortChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import { getMemberLevelData } from "@/api/member";
import {getBannedGameReports} from "@/api/finance";
import { getMemberReportsNext ,bannedGameReportsMemberBonus } from "@/api/report";
import { checkDayBtn } from "@/libs/util";
import Tables from "_c/tables";
import { Tooltip, Divider } from "view-design";
import { mapMutations, mapActions } from "vuex";
export default {
  name: "memberAudit",
  components: { Tables, Icons },
  data() {
    return {
      isShow:false,
      disabled:false,
      btnList: ["本月", "上月"],
      btnName: "本月",
      authInPage: JSON.parse(localStorage.authInPage),
      Time: [this.$root.monthDayStartTime(), this.$root.todayEndTime()],
      searchKey: {
        limit: 20,
        siteId: this.$root.nowSite.id,
        userName: "",
        typeTag: "userName",
        level: "",
        multiple: null,
        stateTow:'2'
      },
      page: 1,
      totalList: [],
      table: {
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        total: 0,
        data: [],
        columns: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            render: (h, params) => {
              if (params.row.userName == "总计") {
                return <span>总计</span>;
              } else {
                return (
                  <span
                    style="color:#2d8cf0"
                    class="cs"
                    onClick={() => {
                      const {userName,riskStatus,uid,is_agency,remark,status,betStatus,profitShare}=params.row;
                      this.setLocal(userName,riskStatus,uid,is_agency,this.page,);
                      if (new Date(this.Time[1]).getTime() - new Date(this.Time[0]).getTime() < 0) {
                      this.$Tip.info({ content: "结束时间必须大于开始时间" });
                      return false;
                    }
                      this.$router.push({
                        name: "auditDetails",
                        query: {
                          is_agency,
                          userName,
                          siteId: this.$root.nowSite.id,
                          riskStatus,
                          uid,
                          btnName:this.btnName,
                          startTime: this.$root.formatTimeX(this.Time[0] ),
                          endTime: this.$root.formatnightTimeS(this.Time[1]),
                          remark,
                          status,
                          betStatus,
                          profitShare
                        },
                        params: { from: "memberAudit" }
                      });
                    }}
                  >
                    {params.row.userName}
                  </span>
                );
              }
            }
          },
          {
            title: "上级代理",
            key: "agencyName",
            align: "center"
          },
          {
            title: "等级",
            key: "levelName",
            align: "center"
          },
          // {
          //   title: "线上支付",
          //   key: "depositAmountOnline",
          //   align: "center",
          //   sortable: "custom",
          //   render: (h, params) => {
          //     return (
          //           <div>
          //               <span class="db"> {Number(params.row.depositAmountOnline).toFixed(2)=='0.00'?'-':Number(params.row.depositAmountOnline).toFixed(2)}</span>
          //               <span class="top ft11">{params.row.depositCountOnline}笔</span>
          //           </div>
          //     );
          //   }
          // },
          // {
          //   title: "公司入款",
          //   key: "depositAmountOffline",
          //   align: "center",
          //   sortable: "custom",
          //   render: (h, params) => {
          //     return (
          //        <div>
          //             <span class="db"> {Number(params.row.depositAmountOffline).toFixed(2)=='0.00'?'-':Number(params.row.depositAmountOffline).toFixed(2)}</span>
          //             <span class="top ft11">{params.row.depositCountOffline}笔</span>
          //         </div>
          //     );
          //   }
          // },
          {
            title: "存款金额",
            key: "depositAmount",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              if (params.row.depositAmount == 0) {
                return (
                  <span>
                    {this.$root.keepTwo(params.row.depositAmount) == "0.00"
                      ? "-"
                      : this.$root.keepTwo(params.row.depositAmount)}
                  </span>
                );
              } else {
                return (
                  <div>
                    <Poptip
                      trigger="hover"
                      placement="right"
                      width="360"
                      popper-class="top-wrap"
                      transfer
                    >
                      <span
                        class={{ cs: params.row.userName != "总计" }}
                        class="red-font cs"
                        onMouseenter={e => {
                          if (params.row.userName == "总计") {
                            return false;
                          } else {
                            this.memberReportsNext(params, 3);
                          }
                        }}
                      >
                        {this.$root.keepTwo(params.row.depositAmount)}
                      </span>
                      <div
                        class="tip-box"
                        slot="content"
                        style={{
                          display:
                            params.row.userName == "总计" ||
                            this.list.length == 0
                              ? "none"
                              : "block"
                        }}
                      >
                        <div class="title">
                          <span style="width:33.33%">存款类型</span>
                          <span style="width:33.33%">存款金额</span>
                          <span style="width:33.33%">笔数</span>
                        </div>
                        <ul>
                          {this.list.map(item => (
                            <li>
                              <span style="width:33.33%">{item.title}</span>
                              <span
                                style="width:33.33%"
                                class={{
                                  "red-font": item.val > 0,
                                  "green-font": item.val < 0
                                }}
                              >
                                {item.val}
                              </span>
                              <span style="width:33.33%">
                                {parseInt(item.count)}笔
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div
                          class="footer"
                          style={{
                            display:
                              this.data1.total == 0 || this.list.length == 0
                                ? "none"
                                : "block"
                          }}
                        >
                          <span style="width:33.33%">总计</span>
                          <span style="width:33.33%">{this.data1.total}</span>
                          <span style="width:33.33%">
                            {parseInt(this.data1.totalcount)}笔
                          </span>
                        </div>
                        <Spin
                          fix
                          size="small"
                          style={{ display: this.isSpin ? "block" : "none" }}
                        ></Spin>
                      </div>
                    </Poptip>
                  </div>
                );
              }
            }
          },
          {
            title: "取款金额",
            key: "withdrawalsAmount",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              const { withdrawalsAmount, withdrawalsCount } = params.row;
              let color =
                Number(withdrawalsAmount).toFixed(2) == "0.00" ? "" : "#ff2626";
              return (
                <Tooltip placement="bottom" transfer>
                  <span class="db cs" style={{ color }}>
                    {" "}
                    {withdrawalsAmount == "0.00"
                      ? "-"
                      : Number(withdrawalsAmount).toFixed(2)}
                  </span>
                  <div slot="content">{withdrawalsCount}笔</div>
                </Tooltip>
              );
            }
          },
          {
            title: "有效投注",
            key: "validBetAmountAll",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              if (params.row.validBetAmountAll == 0) {
                return (
                  <span>
                    {this.$root.keepTwo(params.row.validBetAmountAll) == "0.00"
                      ? "-"
                      : this.$root.keepTwo(params.row.validBetAmountAll)}
                  </span>
                );
              } else {
                return (
                   <span
                  class="cs"
                  onClick={()=>{
                          this.jumpPlatformReport(params);
                        }}
                  >
                    {this.$root.keepTwo(params.row.validBetAmountAll)}</span>
                  // <div
                  // class="cs lh48" 
                  // onClick={()=>{
                  //         this.jumpPlatformReport(params);
                  //         this.isShow = false;
                  //       }}>
                  //   <Poptip
                  //     trigger="hover"
                  //     placement="right"
                  //     width="208"
                  //     popper-class="top-wrap"
                  //     transfer
                  //   >
                  //     <span
                  //       class={{ cs: params.row.userName != "总计" }}
                  //       onMouseenter={e => {
                  //         if (params.row.userName == "总计") {
                  //           return false;
                  //         } else {
                  //           this.memberReportsNext(params, 1);
                  //           this.isShow = true;
                  //         }
                  //       }}
                  //       onMouseleave={e=>{
                  //         this.isShow = false; 
                  //       }}
                  //     >
                  //       {this.$root.keepTwo(params.row.validBetAmountAll)}
                  //     </span>
                  //     <div
                  //       class="tip-box"
                  //       slot="content"
                  //       style={{
                  //         display:
                  //           params.row.userName == "总计" ||
                  //           this.list.length == 0 ||
                  //           this.isShow == false
                  //             ? "none"
                  //             : "block"
                  //       }}
                  //     >
                  //       <div class="title">
                  //         <span>游戏平台</span>
                  //         <span>有效投注</span>
                  //       </div>
                  //       <div>
                  //         <ul>
                  //           {this.list.map(item => (
                  //             <li>
                  //               <span>{item.title}</span>
                  //               <span
                  //                 style={{
                  //                   color:
                  //                     item.validBetAmount > 0
                  //                       ? "#ff2626"
                  //                       : "#239961"
                  //                 }}
                  //               >
                  //                 {item.validBetAmount}
                  //               </span>
                  //             </li>
                  //           ))}
                  //         </ul>

                  //         <div
                  //           class="footer"
                  //           style={{
                  //             display:
                  //               this.data1.totalvalidBetAmount == 0 ||
                  //               this.list.length == 0
                  //                 ? "none"
                  //                 : "block"
                  //           }}
                  //         >
                  //           <span>总计</span>
                  //           <span>{this.data1.totalvalidBetAmount}</span>
                  //         </div>
                  //         <Spin
                  //           fix
                  //           size="small"
                  //           style={{ display: this.isSpin ? "block" : "none" }}
                  //         ></Spin>
                  //       </div>
                  //     </div>
                  //   </Poptip>
                  // </div>
                );
              }
            }
          },
          // {
          //   title: "封禁投注",
          //   key: "validBetAmountUser",
          //   align: "center",
          //   render: (h, params) => {
          //     return (
          //       <span>
          //         {params.row.validBetAmountUser == "0.00"
          //           ? "-"
          //           : Number(params.row.validBetAmountUser).toFixed(2)}
          //       </span>
          //     );
          //   }
          // },
          {
            title: "投注倍数",
            key: "multiple",
            align: "center",
            render: (h, params) => {
              return (
                <span>
                  {Number(params.row.multiple).toFixed(1) == "0.0"
                    ? "-"
                    : Number(params.row.multiple).toFixed(1)}
                </span>
              );
            }
          },
          {
            title: "优惠金额",
            key: "memberBonus",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              if (params.row.memberBonus == 0) {
                 return (
                  <span>
                    {this.$root.keepTwo(params.row.memberBonus) == "0.00"
                      ? "-"
                      : this.$root.keepTwo(params.row.memberBonus)}
                  </span>
                );
              } else {
                return (
                  <div>
                    <Poptip
                      trigger="hover"
                      placement="right"
                      width="360"
                      popper-class="top-wrap"
                      transfer
                    >
                      <span
                        class={{ cs: params.row.userName != "总计" }}
                        onMouseenter={e => {
                          if (params.row.userName == "总计") {
                            return false;
                          } else {
                            this.bannedGameReportsMemberBonus(params);
                          }
                        }}
                      >
                        {this.$root.keepTwo(params.row.memberBonus)}
                      </span>
                      <div
                        class="tip-box"
                        slot="content"
                        style={{
                          display:
                            params.row.userName == "总计" ||
                            this.list.length == 0
                              ? "none"
                              : "block"
                        }}
                      >
                        <div class="title">
                          <span style="width:33.33%">优惠类型</span>
                          <span style="width:33.33%">优惠金额</span>
                          <span style="width:33.33%">优惠占比</span>
                        </div>
                        <ul>
                          {this.list.map(item => (
                            <li>
                              <span style="width:33.33%">{item.name}</span>
                              <span
                                style="width:33.33%"
                                class={{
                                  "red-font": Number(item.money) > 0,
                                  "green-font": Number(item.money) < 0
                                }}
                              >
                                {Number(item.money)}
                              </span>
                              <span style="width:33.33%">{Number(item.proportion&&((item.proportion.split('%')[0]))).toFixed(1)}%</span>
                            </li>
                          ))}
                        </ul>
                         <div
                          class="footer"
                          style={{
                            display:
                              this.yhTotal.money == 0 || this.list.length == 0
                                ? "none"
                                : "block"
                          }}
                        >
                          <span style="width:33.33%">总计</span>
                          <span style="width:33.33%">{this.yhTotal.money}</span>
                          <span style="width:33.33%">{Number(this.yhTotal.proportion&&((this.yhTotal.proportion.split('%')[0]))).toFixed(1)}%</span>
                        </div>
                        <Spin
                          fix
                          size="small"
                          style={{ display: this.isSpin ? "block" : "none" }}
                        ></Spin>
                      </div>
                    </Poptip>
                  </div>
                );
              }
            }
          },
          {
            title: "优惠占比",
            key: "discountPercentage",
            align: "center",
            sortable: "custom",
            render:(h,params)=>{
              return(<span>
                  {(Number(params.row.discountPercentage)*100).toFixed(1) == "0.0"
                    ? "-"
                    : (Number(params.row.discountPercentage)*100).toFixed(1)+'%'}
                </span>)
            }
          },
          {
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              // let color =
              //   Number(params.row.netAmount) > 0 ? "#FF0000" : "#339900";
              return (
                <span>
                  {Number(params.row.netAmount) == "0.00"
                    ? "-"
                    : Number(params.row.netAmount).toFixed(2)}
                </span>
              );
            }
          },
          {
            title: "网站盈利",
            key: "profit",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              // let color = Number(params.row.profit) > 0 ? "#FF0000" : "#339900";
              return (
                <span>
                  {Number(params.row.profit) == "0.00"
                    ? "-"
                    : Number(params.row.profit).toFixed(2)}
                </span>
              );
            }
          },
          {
            title: "现金利润",
            key: "cashProfit",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              let color =
                Number(params.row.cashProfit) > 0 ? "#FF0000" : "#339900";
              return (
                <span style={{ color: color }}>
                  {Number(params.row.cashProfit) == "0.00"
                    ? "-"
                    : Number(params.row.cashProfit).toFixed(2)}
                </span>
              );
            }
          },
          {
            title: "风险状态",
            key: "riskStatus",
            align: "center",
            width:180,
            render: (h, params) => {
              // 注意这个地方有变动  3-利润 2-低倍 1-高倍 4-停用 0-正常 5-全部
              const {riskStatus,profitShare,status,betStatus}=params.row;
              // let color=params.row.riskStatus=='2'?"#19be6b":(params.row.riskStatus=='1'?'#19be6b':(params.row.riskStatus='4'?'#ff0000':''))
              //let text=riskStatus=='0'?'正常':(riskStatus=='2'?'低倍':(riskStatus=='1'?'高倍':(riskStatus=='4'?'停用':'')));
              //let color=riskStatus=='4'?'#ff0000':((riskStatus=='2'||riskStatus=='1')?'#19be6b':'');
              //let boxClass = riskStatus=='0'?'box-green':(riskStatus=='2'?'box-blue':(riskStatus=='1'?'box-blue':(riskStatus=='4'?'box-red':'')));
              let text = status == 'yes'?'正常':'停用';
              let boxClass = status == 'yes'?'box-green':'box-red';

              let betText = betStatus == 1 ?'高倍':betStatus == 2?'低倍':'';

              if (riskStatus == "-") {
                return <span>-</span>;
              } else {
                  
                return (
                  <div class="clearfix">
                    <div>
                    <span class="ib">
                      <span class="box-green ml5" style={{display:status=='yes'&&profitShare==0&&betStatus==0?'inline-block':'none'}}>
                       {text}
                      </span>
                       <span class="box-red ml5" style={{display:status=='no'?'inline-block':'none'}}>
                       {text}
                      </span>
                      <span class="box-blue ml5" style={{display:betStatus==0?'none':'inline-block'}}>
                       {betText}
                      </span>
                      <span  class="w45x" style={{display:profitShare!=0?'inline-block':'none'}}>
                      <span class="box-orange">{profitShare==3?'利润':''}</span>
                       </span>
                    </span> 
                    <Poptip
                      trigger="hover"
                      placement="top-end"
                      transfer
                      class="fr mr10"
                      style={{
                        visibility: params.row.remark ? "visible" : "hidden"
                      }}
                    >
                      <div slot="content" >
                        <p>{params.row.remark}</p>
                      </div>
                      <Icons
                        style="width:10px"
                        type="bangzhutishi"
                        color="#E4E4E4"
                        size="16"
                      />
                    </Poptip>
                    </div>
                  </div>
                );
              }
            }
          },
          {
            title: "操作人",
            key: "admin",
            align: "center",
            render:(h,params)=>{
            return(
              <span>{this.$root.text(params.row.admin)}</span>
            )
            }
          },
          {
            title: "处理状态",
            key: "processing_state",
            align: "center",
            render:(h,params)=>{
              let type = params.row.processing_state == 1 ?'已处理':'未处理';
              let color = params.row.processing_state == 1 ?'':'#ff0000';
              if(params.row.processing_state == '-'){
                return <span>-</span>
              }else{
                return(
                  <span style={{color}}>{type}</span>
                )
              }
            }
          }
        ]
      },
      data1: [],
      list: [],
      levelList: [],
      yhTotal:[],
      isSpin: true
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$route.params.from == "complexReport") {
        vm.Time[0] = vm.$route.query.startTime;
        vm.Time[1] = vm.$route.query.endTime;
        vm.searchKey.startTime = vm.$route.query.startTime;
        vm.searchKey.endTime = vm.$route.query.endTime;
        vm.searchKey.multiple = vm.$route.query.multiple;
        vm.btnName = checkDayBtn(vm.Time, "cn", vm);
        if(vm.searchKey.state == undefined) vm.searchKey.state  = '5';
        let data = { ...vm.searchKey };
        for (let key in data) {
          if (!data[key]) delete data[key];

        }
        vm.getData({ params: data });
      }else{
        if(vm.page==1){
          let page=vm.page;
          if (vm.$root.validateTime(vm.Time)) {
          const [startTime, endTime] = vm.$root.validateTime(vm.Time);
          vm.searchKey.startTime= startTime && vm.$root.formatTimeX(startTime);
          vm.searchKey.endTime= endTime && vm.$root.formatnightTimeS(endTime);
          } else {
            return false;
          }
           if(vm.searchKey.state == undefined) vm.searchKey.state  = '5';
          let data={...vm.searchKey};
          for (let key in data) {
            if (!data[key]) delete data[key];
          }
          vm.getData({ params: data,query: { page } });
        }
      }
    });
  },
  mounted() {
    this.getLevelList({ siteId: this.$root.nowSite.id, purpose: "list" });
  },
  methods: {
    stateTwoChange(val){
      if(val == undefined) this.searchKey.stateTow = '0';
    },
    onChange(val){
      if(val==1||val==2||val==3){
        this.isShow = true;
        this.searchKey.stateTow = '2';
      }else{
        this.isShow = false;
      }
      if(val == undefined) this.searchKey.state = '5';
      this.disabled = this.searchKey.state == '5'?false:true;
    },
    ...mapMutations(["setActiveMenu", "setTagNavList"]),
    setLocal(userName,riskStatus,uid,is_agency,page) {
      let list = JSON.parse(localStorage.tagNaveList);
      list.forEach(t => {
        if (t.name == "auditDetails") {
          if(userName){
            t.query.userName = userName;
            t.query.riskStatus = riskStatus;
            t.query.uid = uid;
            t.query.is_agency = is_agency;
            t.query.page=page;
          }
          t.query.startTime = this.$root.formatTimeX(this.Time[0]);
          t.query.endTime = this.$root.formatTimeX(this.Time[1]);
        }
      });
      this.setTagNavList(list);
    },
    startChange(time, type) {
      this.btnName = checkDayBtn(this.Time, "cn", this);
      this.setLocal()
    },
    changeBtn(name) {
      if (this.page != 1) this.$refs.table.setPage();
      this.btnName = name;
      this.searchKey.startTime =
        name == "本月"
          ? this.$root.monthDayStartTime()
          : this.$root.lastMonthDayStartTime();
      this.searchKey.endTime =
        name == "本月"
          ? this.$root.monthDayEndTime()
          : this.$root.lastMonthDayEndTime();

      if (this.searchKey.sortKey) delete this.searchKey.sortKey;
      if (this.searchKey.sortVal) delete this.searchKey.sortVal;

      this.Time[0] = this.searchKey.startTime;
      this.Time[1] = this.searchKey.endTime;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.setLocal()
      this.getData({ params: data });
    },
    getLevelList(data) {
      getMemberLevelData(data).then(res => {
        if (res != undefined && res.code == 200) {
          this.levelList = res.data;
        }
      });
    },
    getData(data) {
      this.$root.startTableLoading();
      getBannedGameReports(data)
        .then(res => {
          if (res != undefined && res.code == 200) {
            let list = res.data.data;
            list.length > 0 &&
              list.forEach(t => {
                this.totalList.push({
                  depositAmountOnline: t.depositAmountOnline,
                  depositCountOnline: t.depositCountOnline,
                  depositAmountOffline: t.depositAmountOffline,
                  depositCountOffline: t.depositCountOffline,
                  depositAmount: t.depositAmount,
                  depositCount: t.depositCount,
                  discountPercentage:t.discountPercentage,
                  withdrawalsAmount: t.withdrawalsAmount,
                  withdrawalsCount: t.withdrawalsCount,
                  validBetAmountAll: t.validBetAmountAll,
                  validBetAmountUser: t.validBetAmountUser,
                  discountPercentage:t.discountPercentage,
                  multiple: t.multiple,
                  memberBonus: t.memberBonus,
                  netAmount: t.netAmount,
                  profit: t.profit,
                  cashProfit: t.cashProfit
                });
              });
            list.length && list.push(this.createTotalData(res.data.totalList));
            this.table.data = list;
            this.table.total = res.data.total;
            this.$root.endTableLoading();
          }
        })
        .catch(error => {
          this.table.data = [];
          this.$root.endTableLoading();
        });
    },
    createTotalData(total) {
      const {
        depositAmountOnline,
        depositAmountOffline,
        depositAmount,
        withdrawalsAmount,
        validBetAmountAll,
        validBetAmountUser,
        multiple,
        memberBonus,
        netAmount,
        profit,
        cashProfit,
        depositCountOffline,
        depositCountOnline,
        depositCount,
        discountPercentage,
        withdrawalsCount
      } = total;
      let item = {
        userName: "总计",
        agencyName: "-",
        levelName: "-",
        depositAmountOnline,
        depositAmountOffline,
        depositAmount,
        withdrawalsAmount,
        validBetAmountAll,
        validBetAmountUser,
        multiple,
        memberBonus,
        netAmount,
        discountPercentage,
        profit,
        cashProfit,
        depositCountOffline,
        depositCountOnline,
        depositCount,
        discountPercentage,
        withdrawalsCount,
        riskStatus: "-",
        admin: "-",
        processing_state:"-",
      };
      return item;
    },
    onPageChange(page) {
      const [startTime, endTime] = this.$root.validateTime(this.Time);
      this.searchKey.startTime = this.$root.formatTimeX(startTime);
      this.searchKey.endTime = endTime && this.$root.formatnightTimeS(endTime);
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.page = page;
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
    },
    searchSubmit() {
      const { sortKey, sortVal } = this.searchKey;
      if (sortKey) delete this.searchKey.sortKey;
      if (sortVal) delete this.searchKey.sortVal;
      this.table.columns.forEach(item => {
        if (item.sortable == "custom") this.$set(item, "sortType", "");
      });
      if(this.searchKey.state == undefined) this.searchKey.state  = '5';
      let params = { ...this.searchKey };
      for (let key in params) {
        if (!params[key]) delete params[key];
      }

      params.content = params.content && this.$root.trimAll(params.content);
      this.searchKey.content =
        this.searchKey.content && this.$root.trimAll(this.searchKey.content);
      if (!params.content) {
        delete params.content;
      } else {
        if (params.typeTag == "userName") {
          let reg = /^[0-9a-zA-Z-_]+$/;
          if (!reg.test(params.content)) {
            this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
            return false;
          }
        } else {
          let reg = /^[0-9a-zA-Z-_]+$/;
          if (!reg.test(params.content)) {
            this.$Tip.info({ content: "您所查询的代理账号不正确，请重新输入" });
            return false;
          }
        }
      }
       if(this.Time[0]=='' && this.Time[1]==''){
          this.$Tip.info({ content: "请输入开始和结束时间" });
          return false;
      }
     
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeX(startTime);
        params.endTime = endTime && this.$root.formatnightTimeS(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = params.startTime;
      this.searchKey.endTime = params.endTime;
      this.$refs.table.setPage();
      this.page = 1;
      this.getData({ params });
    },
    //排序
    sortChange({ column, key, order }) {
      delete this.searchKey.sortKey;
      delete this.searchKey.sortVal;
      let data = {
        sortKey: key,
        sortVal: order,
        ...this.searchKey
      };
      this.searchKey.sortKey = key;
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.sortVal == "normal") {
        this.table.columns.forEach(item => {
          if (item.key == column.key) this.$set(item, "sortType", "asc");
        });
        data.sortVal = "asc";
        this.searchKey.sortVal = "asc";
      } else {
        this.table.columns.forEach(item => {
          delete item.sortType;
        });
        this.searchKey.sortVal = order;
      }
      this.page == 1 ? "" : this.$refs.table.setPage();
      this.page == 1
        ? this.getData({ params: data })
        : this.getData({ params: data, query: { page: 1 } });
    },
    //导出
    exportExcel() {
       if(this.Time[0]=='' && this.Time[1]==''){
          this.$Tip.info({ content: "请输入开始和结束时间" });
          return false;
      }
      let data = { ...this.searchKey };
      const [startTime, endTime] = this.$root.validateTime(this.Time);
      data.startTime = startTime && this.$root.formatTimeX(startTime);
      data.endTime = endTime && this.$root.formatnightTimeS(endTime);
      for (let key in data) {
        if (!data[key] || key == "limit") delete data[key];
      }
      data.isExport = 1;
      let openr = window.open();
      getBannedGameReports({ params: data },true)
        .then(res => {
          if (res != undefined && res.code == 200) {
            let region = res.data.downloadUrl.split(".com")[1];
            let openr1 = openr ? openr : window;
            openr1.location.href = region;
          } else {
            openr.close();
          }
        })
        .catch(error => this.$root.endTableLoading());
    },
    // 有效投注,优惠金额列表
    memberReportsNext(params, type) {
      this.isSpin = true;
      let siteId = this.$root.nowSite.id;
      let uid = params.row.uid;
      let startTime = this.searchKey.startTime;
      let endTime = this.searchKey.endTime;
      let data = {
        siteId: siteId,
        startTime: startTime,
        endTime: endTime,
        uid: uid,
        type: type
      };
      this.$nextTick(function() {
        getMemberReportsNext(data)
          .then(res => {
            if (res != undefined && res.code == 200) {
              this.isSpin = false;
              this.data1 = res.data;
              this.list = res.data.list.filter(item => item.val != 0);
              this.data1 = res.data;
              if (res.data.list != undefined)
                this.list = res.data.list.filter(item => item.val != 0);
            }
          })
          .catch(error => {
            this.data1 = [];
            this.list = [];
          });
      });
    },
    //优惠金额列表
    bannedGameReportsMemberBonus(params){
      let siteId = this.$root.nowSite.id;
      let uid = params.row.uid;
     let startTime = this.searchKey.startTime;
      let endTime = this.searchKey.endTime;
      let depositAmount = params.row.depositAmount*1;
      let data = {
        siteId:siteId,
        startTime: startTime,
        endTime: endTime,
        depositAmount:depositAmount,
        uid: uid
      }
      this.isSpin = true;
      bannedGameReportsMemberBonus(data).then(res=>{
        if(res!=undefined&&res.code==200){
          this.isSpin = false;
          this.yhTotal = res.data.total;
          this.list = res.data.list;
          if (res.data.list != undefined)
                this.list = res.data.list.filter(item => item.money != 0);
        }
      })
      .catch(error => {
            this.yhTotal = {};
            this.list = [];
          });
    },
    //跳转平台报表
    jumpPlatformReport(params){
      let {userName} = params.row;
      let [startTime, endTime] = this.Time;
      startTime = this.$root.formatTimeS(startTime);
      endTime = this.$root.formatnightTimeS(endTime);
      this.$router.push({
                name: 'platformReport',
                query: {
                    userName,
                    startTime,
                    endTime,
                }
            });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
@import "../../styles/audit.less";
.bd-bg {
  background-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.bg-or {
  border: 1px solid #eaeaea;
  &:focus {
    box-shadow: 0 0 0 0;
  }
  &:hover {
    background: #f4f9ff;
    border: 1px solid #2d8cf0;
    color: #2d8cf0;
  }
}

</style>

