<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <!-- // 注意这个地方有变动  3-利润 2-低倍 1-高倍 4-停用 0-正常 5-全部 -->
        <FormItem>
            <p class="ft16"><span>{{$route.query.userName}}</span><span class="ml10 " 
              :style="state=='停用'?'color:#ff0000':((state=='低倍'||state=='高倍')?'color:#00a5d8':state=='利润'?'color:#ea7500':'color:#239961')"
              >(
                {{state}}
                )</span></p>
        </FormItem>
        <FormItem v-for="(t, i) in btnList" :key="i">
          <Button class="fontColor" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click="changeBtn(t)">
            <span>{{ t }}</span>
          </Button>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker placeholder="开始日期" :class="[screen<1600?'s-120':'s-120']" @on-change="startChange" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker placeholder="结束日期" :class="[screen<1600?'s-120':'s-120']" @on-change="startChange" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem label="投注倍数">
          <InputNumber :min="1" text="number"  key="multiple" class="s-80 ml5" v-model="searchKey.multiple" placeholder="请输入" />
        </FormItem>
        <FormItem label="会员账号" >
          <Input placeholder="请输入会员账号"  :class="[screen<1600?'s-100':'s-120']" v-model="searchKey.userName" />
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
        <!-- <div class="fr">
          <FormItem>
           <Button 
            type="primary" 
            class="ivu-btn bd-bg ml10" 
            @click="()=>{
                this.$router.push({
                    name:'memberDetails',
                    query:{
                        siteId:this.$root.nowSite.id,
                        uid:this.uid,
                        page:this.page
                    }
                })
                }">详情</Button> 
          </FormItem>
          <FormItem>
            <Button 
            v-if="this.adminType == 'super' || this.authInPage.indexOf('memberUpdate') != -1"
            type="primary" 
            class="ivu-btn bd-bg"
            @click="()=>{
              this.$router.push({
                  name:'memberEdit',
                  query:{
                      siteId:this.$root.nowSite.id,
                      uid:this.uid,
                      account_type:this.is_agency?0:1,
                      page:this.page,
                      riskStatus:this.riskStatus,
                      startTime:this.searchKey.startTime,
                      endTime:this.searchKey.endTime,
                      btnName:this.btnName,
                  },
                  params:{page: 'edit'}
                  })
              }"
            >编辑</Button> 
          </FormItem>
        </div> -->
        <!-- <div class="fr">
          <FormItem>
           <Button 
            type="primary" 
            class="ivu-btn bd-bg ml10" 
            @click="statusUp(status)">{{status=='yes'?'正常':'停用'}}</Button> 
          </FormItem>
          <FormItem>
            <Button 
            v-if="this.adminType == 'super' || this.authInPage.indexOf('memberUpdate') != -1"
            type="primary" 
            class="ivu-btn bd-bg"
            @click="()=>{
              this.$refs.remark.show();
              }"
            >备注</Button> 
          </FormItem>
        </div> -->
      </Form>
    </div>
    <div class="v2-table">
      <div v-show="isTitle" class="ft13 f-color lh26 btl" style="border-bottom:none">
        <!-- <table>
          <tr>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
            <td width="16.666%">1</td>
          </tr>
        </table> -->
        <div class="flex-start">
          <span class="ib w166 txt-l h40x lh40 bb br pl10">
            <p>
              <span class="clearfix">
                <span class="fl">会员账号：{{this.searchKey.userName}}</span>
                <span 
                class="ml10 fr mr10 mt10" 
                :class="state=='停用'?'b-red':((state=='低倍'||state=='高倍')?'b-blue':state=='利润'?'b-orange':'b-green')"
                >{{state}}</span>
                </span>
              </p>
          </span>
          
          <span class="ib w166 txt-l h40x lh40  bb br pl10">
            登录时间：{{this.$root.newUnixTime(totalUser.lastTime)}}
          </span>
          <span class="ib w166 txt-l h40x lh40  bb br  pl10" :class="totalUser.depositAmount>0?'cs':''">
            <!-- <span class="ml20">总优惠：{{totalUser.depositAmount}}</span> -->
            <Poptip trigger="hover" placement="right" width="208" popper-class="top-wrap" transfer>
              <span class="ib txt-a" @mouseenter="memberReportsNext('depositAmount',3)">
                存款总额：{{totalUser.depositAmount}}
              </span>
              <div class="tip-box" slot="content">
                <div class="title">
                    <span>存款类型</span>
                    <span>存款金额</span>
                </div>
                <ul>
                  <li v-for="(item,i) in list" :key="i">
                    <span>{{item.title}}</span>
                    <span :style="item.val > 0 ? 'color:#ff2626' : 'color:#239961'">{{item.val}}</span>
                  </li>
                </ul>
                <div class="footer">
                  <span>总计</span>
                  <span>{{this.data1.total}}</span>
                </div>
                  <Spin fix size="small" v-show="this.isSpin"></Spin>
              </div>
          </Poptip>
          </span>
          <!-- <span class="ib w166 txt-l h40x lh40  bb br pl10">
            公司入款：{{totalUser.gsry}}
          </span>
          <span class="ib w166 txt-l h40x lh40  bb br pl10">
            在线支付：{{totalUser.zxzf }}
          </span> -->
          <!-- <span class="ib txt-a ml20" v-show="totalUser.depositAmount != '0.00'">
            总存款：{{totalUser.depositAmount}}
          </span> -->
          <span class="ib w166 txt-l h40x lh40  bb br pl10">
            取款总额：{{totalUser.withdrawalsAmount}}
          </span> 
           <span class="ib w166 txt-l h40x lh40  bb br pl10" :class="totalUser.memberBonus>0?'cs':''">
            <span class="ml20" v-if="Number(totalUser.memberBonu) == 0">累计优惠：{{totalUser.memberBonus}}</span>
            <Poptip trigger="hover" placement="right" width="208" popper-class="top-wrap" transfer>
              <span v-if="Number(totalUser.memberBonu) != 0" class="ib txt-a" @mouseenter="bannedGameReportsMemberBonus('memberBonus',2)">
                累计优惠：{{totalUser.memberBonus}}
              </span>
              <div class="tip-box" slot="content">
                <div class="title">
                    <span>优惠类型</span>
                    <span>优惠金额</span>
                </div>
                <!-- height:288px -->
                <ul  class="modal-overflo modal-overflow" :style="list.length&&list.length>9?'height:288px;overflow-y: auto;':''">
                  <li v-for="(item,i) in list" :key="i">
                    <span>{{item.name}}</span>
                    <span :style="item.money > 0 ? 'color:#ff2626' : 'color:#239961'">{{item.money}}</span>
                  </li>
                </ul>
                <div class="footer">
                  <span>总计</span>
                  <span>{{this.yhTotal.money}}</span>
                </div>
                  <Spin fix size="small" v-show="this.isSpin"></Spin>
              </div>
          </Poptip>
          <!-- <span class="ml10 fr mr10">
            占比： {{totalUser.discountPercentage}}%
          </span> -->
          </span>
          
          <span class="ib w166 txt-l h40x lh40  bb br pl10">
            <span>
              现金利润：<span :style="totalUser.cashProfit>0?'color:#ff2626':'color:#19be6b'">{{totalUser.cashProfit}}</span>
            </span>
            <!-- <span class="ml10 fr mr10">
            占比：<span :style="totalUser.cashRatio>0?'color:#ff2626':'color:#19be6b'">{{totalUser.cashRatio}}%</span>
            </span>  -->
          </span>
          <span class="ib w166 txt-l h40x lh40  bb br pl10">
            真实姓名：{{totalUser.realName}}<span class="red-font fr mr10">{{totalUser.levelName}}</span>
          </span>
          <!-- <span class="ib fl w166 txt-l pl40"  v-show="totalUser.withdrawalsAmount !='0.00'">
            总取款：{{totalUser.withdrawalsAmount}}
          </span> -->
         
          <span class="ib w166 txt-l h40x lh40 bb br pl10" :class="totalUser.validBetAmount>0?'cs':''">
            <span class="ml20" v-if="Number(totalUser.validBetAmount)==0">有效投注：{{totalUser.validBetAmount}}</span>
            <Poptip trigger="hover" placement="right" width="208" popper-class="top-wrap" transfer>
              <span class="ib txt-a" v-if="Number(totalUser.validBetAmount)!=0">
                有效投注：{{totalUser.validBetAmount}}
              </span>
              <div class="tip-box" slot="content">
                <div class="title">
                    <span>游戏类型</span>
                    <span>有效投注</span>
                </div>
                <ul>
                  <li v-if="Number(totalUser.betAmountByLive) !=0">
                    <span>视讯投注</span>
                    <span>{{totalUser.betAmountByLive}}</span>
                  </li>
                  <li v-if="Number(totalUser.betAmountByChess) !=0">
                    <span>棋牌投注</span>
                    <span>{{totalUser.betAmountByChess}}</span>
                  </li>
                  <li v-if="Number(totalUser.betAmountBySport) !=0">
                    <span>体育投注</span>
                    <span>{{totalUser.betAmountBySport}}</span>
                  </li>
                  <li v-if="Number(totalUser.betAmountByLottery) !=0">
                    <span>彩票投注</span>
                    <span>{{totalUser.betAmountByLottery}}</span>
                  </li>
                  <li v-if="Number(totalUser.betAmountBySlot) !=0">
                    <span>电子投注</span>
                    <span>{{totalUser.betAmountBySlot}}</span>
                  </li>
                  <li v-if="Number(totalUser.betAmountByFish) !=0">
                    <span>捕鱼投注</span>
                    <span>{{totalUser.betAmountByFish}}</span>
                  </li>
                </ul>
                <div class="footer" v-if="Number(totalUser.validBetAmount) !=0">
                  <span>总计</span>
                  <span>{{totalUser.validBetAmount}}</span>
                </div>
                  <!-- <Spin fix size="small" v-show="this.isSpin"></Spin> -->
              </div>
          </Poptip>
          </span>
          <span class="ib w166 txt-l h40x lh40  bb br pl10">
            网站盈利：{{totalUser.profit}}
          </span>
          <span class="ib w166 txt-l h40x lh40  bb br pl10">
            投注倍数：{{totalUser.multiple}}
          </span>
           <span class="ib w166 txt-l h40x lh40  bb br pl10">
            优惠占比：{{totalUser.discountPercentage}}%
          </span>
           <span class="ib w166 txt-l h40x lh40  bb br pl10" >
            现金占比：<span :style="totalUser.cashRatio>0?'color:#ff2626':'color:#19be6b'">{{totalUser.cashRatio}}%</span>
          </span>
         
          <!-- <span class="ib w166 txt-l pl20">
            视讯投注：{{totalUser.betAmountByLive}}
          </span>
          <span class="ib w166 txt-l pl20">
            棋牌投注： {{totalUser.betAmountByChess}}
          </span>
          <span class="ib w166 txt-l pl20">
            体育投注： {{totalUser.betAmountBySport}}
          </span>
          <span class="ib w166 txt-l pl20" >
            彩票投注：{{totalUser.betAmountByLottery}}
          </span>
          <span class="ib w166 txt-l pl20">
            电子投注： {{totalUser.betAmountBySlot}}
          </span>
          <span class="ib w166 txt-l pl20" >
            捕鱼投注：{{totalUser.betAmountByFish}}
          </span> -->
        </div>
        <div>
          <span class="ib w166 txt-l h40x lh40  br pl10 cs bb-color">
            <span class="mr10" @click="loginHistory">历史登入</span>
            <span class="mr10" @click="statusUp(status)">
              {{status=='yes'?'正常':'停用'}}
            </span>
            <span
            class="mr10"
            @click="()=>{
                this.$refs.remark.show();
                }"
            >
              备注
            </span>
            <span class="mr10" @click="chuli">
              {{totalUser.processing_state== 1 ?'已处理':'未处理'}}
            </span>
          </span>
          <span class="ib txt-l h40x lh40  br pl10" style="width:83.333%">
              <span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：{{totalUser.remark}}</span>
            <!-- <Tooltip placement="bottom" class="w100" v-show="totalUser.remark&&totalUser.remark.length>7">
              <span style="vertical-align:middle" class="ib cs w70 text-overflow-ellipsis">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：{{totalUser.remark}}</span>
              <div slot="content">{{totalUser.remark}}</div>
            </Tooltip> -->
          </span>
        </div>
      </div>
      <Tables
        ref="table"
        :stripe="false"
        :showSummary="false"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        :showSizer="false"
        :pageSizeOpts="table.pageSizeOpts"
        @on-sort-change="sortChange"
        @on-page-change="onPageChange"
      ></Tables>
       <!--  -->
    </div>
     <Modals title="备注信息" ref="remark" width="600"  @modalVisible="modalChange(arguments)" >
            <div slot="content" style="width:420px; margin:30px auto" class="ml20 mb20 modal-overflow">
              <Form :label-width='75'> 
                <FormItem label="备注信息">
                  <Select class="s-140" transfer v-model="remarkText" @on-change="remark=remarkText=='自定义'?'':remarkText">
                    <Option v-for="t in msg" :value='t' :key='t'>{{t}}</Option>
                  </Select>
                </FormItem>
                <FormItem >
                  <Input
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 10 }"
                      v-model="remark"
                      placeholder="此备注关联会员查询编辑中备注信息"
                      class="w345x"
                        />
                </FormItem>
                  <FormItem>
                    <Checkbox v-model="isRemark" @on-change="onChange">{{processing_state  == 1 ?'已处理':'未处理'}}</Checkbox>
                  </FormItem>
              
                <Button type="primary" class="w140x h50 ft20 ml150" :loading="$root.tableLoading" @click="submit">确认保存</Button>
              </Form>
            </div>
     </Modals>
     <HistoryModal :uid="this.uid"  ref="historyModal"></HistoryModal>
  </div>
</template>
<script>
  // 
import Icons from "@/components/icons";
import Modals from "_c/modals";
import { memberModifyStatus } from "@/api/member";
import { getReviewDetail,memberRemarkUp } from "@/api/finance";
import {getMemberReportsNext,bannedGameReportsMemberBonus} from '@/api/report';
import { checkDayBtn } from "@/libs/util";
import { getUserType } from "@/libs/util";
import Tables from "_c/tables";
import { Tooltip, Divider } from "view-design";
import { mapMutations,mapActions} from 'vuex';
import HistoryModal from "./components/historyModals";
export default {
  name: "auditDetails",
  components: { Tables, Icons,Modals,HistoryModal},
  data() {
    return {
      isRemark:false,
      processing_state:'',
      state:'',
      screen: screen.width,
      btnList: ["本月", "上月"],
      btnName: "",
      betStatus:this.$route.query.betStatus,
      profitShare:this.$route.query.profitShare,
      status:this.$route.query.status,
      remark:this.$route.query.remark,
      is_agency:this.$route.query.is_agency,
      uid:this.$route.query.uid,
      riskStatus:this.$route.query.riskStatus,
      Time: [this.$route.query.startTime,this.$route.query.endTime],
      searchKey: {
        limit: 40,
        siteId: this.$root.nowSite.id,
        userName:this.$route.query.userName,
        multiple:null,
      },
      authInPage: JSON.parse(localStorage.authInPage),
      adminType: getUserType(),
      page: 1,
      totalList:[],
      remarkText:'自定义',
      msg:[
					'自定义'
					,'注册多个帐号，停用帐号只保留一个'
					,'严重套利视讯1倍打码，停用帐号人工提出余额，新注册帐号及时上报站长'
					,'视讯长庄长闲下注，锁定返水0.2%取消全部优惠，新注册帐号及时上报站长'
					,'锁定返水0.１%取消全部优惠，发现新注册账号一律锁定返水0.１%取消全部优惠'
					,'长期彩票1倍打码，停用帐号人工提出余额，新注册帐号及时上报站长'
					,'严重套利等待会员存款第一时间停用帐号人工提出余额'
					,'体育注单异常停用帐号人工提出余额，新注册帐号及时上报站长'
					,'体育1倍打码套利入款优惠及赔率差，停用帐号人工提出余额'
					,'游戏第三方下架游戏，停用帐号人工提出余额'
					,'游戏站内/站外对打，停用帐号人工提出余额'
					,'支付刷单，停用帐号人工提出余额'
					,'支付骗单，停用帐号人工提出余额'
					,'投诉第三方支付，停用帐号人工提出余额'
				],
      table: {
        loading: true,
       pageSizeOpts: [40],
        total: 0,
        data: [],
        columns: [
          {
            title: "时间",
            key: "data_date",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
                if(params.row.userName == '总计') return <span>{params.row.userName }</span>
              else return <span>{this.$root.returnDayTime(params.row.data_date)}</span>;
            }
          },
          
          // {
          //   title: "线上支付",
          //   key: "depositAmountOnline",
          //   align: "center",
          //   sortable: "custom",
          //   render: (h, params) => {
          //     return (
          //       <div>
          //            <span class="db">{Number(params.row.depositAmountOnline).toFixed(2)}</span>
          //           <span class="top ft11">{params.row.depositCountOnline}笔</span>
          //      </div>
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
          //          <span class="db cs">{Number(params.row.depositAmountOffline).toFixed(2)}</span>
          //           <span class="top ft11">{params.row.depositCountOffline}笔</span>
          //        </div>
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
                                return <span>
                                    {this.$root.keepTwo(params.row.depositAmount)=='0.00'?'-':this.$root.keepTwo(params.row.depositAmount)}
                                 </span>
                            } else {
                                return (
                                    <div>
                                        <Poptip trigger="hover" placement="right" width="360" popper-class="top-wrap" transfer>
                                            <span
                                                class={{ cs: params.row.userName != '总计' }}
                                                class="red-font cs"
                                                onMouseenter={e => {
                                                    if (params.row.userName == '总计') {
                                                        return false;
                                                    } else {
                                                        this.memberReportsNext(params, 3);
                                                    }
                                                }}
                                            >
                                                {this.$root.keepTwo(params.row.depositAmount)}
                                            </span>
                                            <div class="tip-box" slot="content" style={{ display: params.row.userName == '总计' || this.list.length == 0 ? 'none' : 'block' }}>
                                                <div class="title">
                                                    <span style="width:33.33%">存款类型</span>
                                                    <span style="width:33.33%">存款金额</span>
                                                    <span style="width:33.33%">笔数</span>
                                                </div>
                                                <ul>
                                                    {this.list.map(item => (
                                                        <li>
                                                            <span style="width:33.33%">{item.title}</span>
                                                            <span style="width:33.33%" class={{ 'red-font': item.val > 0,'green-font': item.val < 0 }}>{item.val}</span>
                                                            <span style="width:33.33%">{parseInt(item.count)}笔</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div class="footer" style={{ display: this.data1.total == 0 || this.list.length == 0 ? 'none' : 'block' }}>
                                                    <span style="width:33.33%">总计</span>
                                                    <span style="width:33.33%">{this.data1.total}</span>
                                                    <span style="width:33.33%">{parseInt(this.data1.totalcount)}笔</span>
                                                </div>
                                                <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
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
              const {withdrawalsAmount,withdrawalsCount}  = params.row;
              let color=Number(withdrawalsAmount).toFixed(2)=='0.00'?'':'#ff2626';
              return (
                 <Tooltip placement="bottom" transfer>
                  <span class="db cs " style={{color}}> {withdrawalsAmount=='0.00'?'-':Number(withdrawalsAmount).toFixed(2)}</span>
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
                );
              }
            }
          },
          // {
          //   title: "封禁投注",
          //   key: "validBetAmountUser",
          //   align: "center",
          //    render: (h, params) => {
          //     return <span>{Number(params.row.validBetAmountUser).toFixed(2)=='0.00'?'-':Number(params.row.validBetAmountUser).toFixed(2)}</span>
          //   }
          // },
          {
            title: "投注倍数",
            key: "multiple",
            align: "center",
             render: (h, params) => {
              return <span>{Number(params.row.multiple).toFixed(1)=='0.0'?'-':Number(params.row.multiple).toFixed(1)}</span>
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
                            this.bannedGameReportsMemberBonus(params,'oneMemberBonus');
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
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            sortable: "custom",
            render: (h, params) => {
              // let color =
              //   Number(params.row.netAmount) > 0 ? "#FF0000" : "#339900";
              return (
                <span >
                  {Number(params.row.netAmount).toFixed(2)=='0.00'?'-':Number(params.row.netAmount).toFixed(2)}
                </span>
              );
            }
          },
          // {
          //   title: "网站盈利",
          //   key: "profit",
          //   align: "center",
          //   sortable: "custom",
          //   render: (h, params) => {
          //     return (
          //       <span >
          //         {Number(params.row.profit).toFixed(2)=='0.00'?'-':Number(params.row.profit).toFixed(2)}
          //       </span>
          //     );
          //   }
          // },
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
                  {Number(params.row.cashProfit).toFixed(2)=='0.00'?'-':Number(params.row.cashProfit).toFixed(2)}
                </span>
              );
            }
          }
        ]
      },
      data1: [],
      list: [],
      isSpin: true,
      yhTotal:[],
      totalUser:[],
      isTitle:false
    };
  },
   beforeRouteEnter(to, from, next) {
      next(vm=>{
        if(from.name=='memberAudit'){
              vm.searchKey.startTime = vm.$route.query.startTime;
              vm.searchKey.endTime = vm.$route.query.endTime;
              vm.searchKey.userName = vm.$route.query.userName;
              vm.Time[0]=vm.$route.query.startTime;
              vm.Time[1]=vm.$route.query.endTime;
              vm.btnName=vm.$route.query.btnName;
              let data = {...vm.searchKey};
              for(let key in data){
                  if(!data[key]) delete data[key];
              }
              vm.getData({params:data});

        }else if(from.name=='memberEdit'){
          vm.searchKey.userName = vm.$route.query.userName;
          vm.searchKey.startTime = vm.$route.query.startTime;
          vm.searchKey.endTime = vm.$route.query.endTime;
          vm.Time[0]=vm.$route.query.startTime;
          vm.Time[1]=vm.$route.query.endTime;
          vm.btnName=vm.$route.query.btnName;
          let data = {...vm.searchKey};
              for(let key in data){
                  if(!data[key]) delete data[key];
              }
              vm.getData({params:data});
          
        }else{
          vm.searchKey.startTime = vm.$route.query.startTime;
              vm.searchKey.endTime = vm.$route.query.endTime;
              vm.searchKey.userName = vm.$route.query.userName;
              vm.Time[0]=vm.$route.query.startTime;
              vm.Time[1]=vm.$route.query.endTime;
              vm.btnName=vm.$route.query.btnName;
              let data = {...vm.searchKey};
              for(let key in data){
                  if(!data[key]) delete data[key];
              }
              vm.getData({params:data});
        }
      })
  },
  beforeRouteLeave(to,from,next){
  
    localStorage.catchTime=[this.searchKey.startTime,this.searchKey.endTime];
    next()     
  },
  mounted() {
    if(this.status == 'yes'&&this.betStatus==0&&this.profitShare==0){
      this.state = '正常';
    }else if(this.status == 'no'){
      this.state = '停用';
    }else if(this.status == 'yes'&&this.betStatus!=0&&this.profitShare==0){
      this.state = this.betStatus==1?'高倍':'低倍';
    }else if(this.status == 'yes'&&this.betStatus!=0&&this.profitShare!=0){
      this.state = this.betStatus==1?'高倍':'低倍';
    }else if(this.status == 'yes'&&this.betStatus==0&&this.profitShare!=0){
      this.state = '利润';
    }
  },
  methods: {
    modalChange(value){
     let flag=value[0];
      if(flag==true)this.remarkText='自定义';
    },
    chuli(){
      if(this.totalUser.processing_state == null) this.processing_state =0;
      let text = this.totalUser.processing_state == 1 ? '未处理' : '已处理';
      let state =  this.processing_state == 1? 0 : 1;
      this.$Tip.confirm({
            content: `您确定将此会员标记为【${text}】吗？`,
            onOk: () => {
            let data = {
                siteId:this.$root.nowSite.id,
                uid:this.uid,
                remark:this.totalUser.remark,
                processing_state:state
              }
              this.$root.startTableLoading();
              memberRemarkUp(data,true).then(res=>{
                if(res!=undefined&&res.code==200){
                  this.$Message.success('修改成功');
                  let data = {...this.searchKey};
                      for(let key in data){
                          if(!data[key]) delete data[key];
                      }
                  this.getData({params:data});
                  this.$root.endTableLoading();
                }
              }).catch(error=>this.$root.endTableLoading())
                  }
              });
    },
    onChange(val){
      this.processing_state = val==true? 1 : 0;
    },
    ...mapMutations(['setActiveMenu','setTagNavList']),

    loginHistory(){
      this.$refs.historyModal.getShow()
    },
    startChange(time, type) {
      this.btnName = checkDayBtn(this.Time, "cn", this);
       this.setLocal()
    },
  
    changeBtn(name) {
      if (this.page != 1) this.$refs.table.setPage();
      this.btnName = name;
      this.searchKey.startTime = name == "本月" ? this.$root.monthDayStartTime() : this.$root.lastMonthDayStartTime();
      this.searchKey.endTime = name == "本月" ? this.$root.monthDayEndTime() : this.$root.lastMonthDayEndTime();

      if (this.searchKey.sortKey) delete this.searchKey.sortKey;
      if (this.searchKey.sortVal) delete this.searchKey.sortVal;
      
      this.Time[0] = this.searchKey.startTime;
      this.Time[1] = this.searchKey.endTime;
     
      let data = { ...this.searchKey };
       this.setLocal();
      for(let key in data){
          if(!data[key]) delete data[key]
      }
      this.getData({ params: data });
    },
    //状态修改
    statusUp(){
      let status = this.status=="yes"?0:1;
      let text = status == 1?'启用':'停用';
      let account = this.searchKey.userName;
      let data = {
        siteId:this.$root.nowSite.id,
        uid:this.uid,
        statusKey:'status',
        statusVal:status
      }
      this.$Tip.confirm({
            content: `您确定${text}帐号【${account}】吗？`,
            onOk: () => {
              memberModifyStatus(data, true).then(res => {
              if (res != undefined && res.code == 200) {
                this.$Message.success('修改成功');
                this.status = this.status == 'yes'?'no':'yes';
                this.status == 'yes'? 0 : 4;
                if(this.status == 'yes'&&this.betStatus==0&&this.profitShare==0){
                  this.state = '正常';
                }else if(this.status == 'no'){
                  this.state = '停用';
                }else if(this.status == 'yes'&&this.betStatus!=0&&this.profitShare==0){
                  this.state = this.betStatus==1?'高倍':'低倍';
                }else if(this.status == 'yes'&&this.betStatus!=0&&this.profitShare!=0){
                  this.state = this.betStatus==1?'高倍':'低倍';
                }else if(this.status == 'yes'&&this.betStatus==0&&this.profitShare!=0){
                  this.state = '利润';
                }
              }
          })
        },
            
      })
			
    },
    // 修改备注
    submit(){
      if(this.processing_state==''||this.processing_state==null)this.processing_state=0;
      let data = {
        siteId:this.$root.nowSite.id,
        uid:this.uid,
        remark:this.remark,
        processing_state:this.processing_state
      }

       this.$root.startTableLoading();
      memberRemarkUp(data,true).then(res=>{
        if(res!=undefined&&res.code==200){
          this.$Message.success('修改成功');
          let data = {...this.searchKey};
              for(let key in data){
                  if(!data[key]) delete data[key];
              }
          this.getData({params:data});
          this.$refs.remark.hide();
           this.$root.endTableLoading();
        }
      }).catch(error=>this.$root.endTableLoading())
    },
    getData(data) {
      this.$root.startTableLoading();
      getReviewDetail(data)
        .then(res => {
          if (res != undefined && res.code == 200) {
                      this.totalUser = res.data.totalUser;
                      if(this.totalUser.processing_state == null) this.totalUser.processing_state = 0;
                      this.processing_state  = this.totalUser.processing_state;
                      this.isRemark = this.totalUser.processing_state == 1 ? true : false;
                      let total = 0;
                      for(let key in this.totalUser){
                        if(key!='created_at'&&key!='siteId'&&key!='uid'){
                           total += Number(this.totalUser[key]);
                        }
                      }
                      this.isTitle = total==0? false : true;
                    
                      let list = res.data.data;
                        list.length > 0 &&
                            list.forEach(t => {
                                this.totalList.push({
                                  depositAmountOnline:t.depositAmountOnline,
                                  depositCountOnline:t.depositCountOnline,
                                  depositAmountOffline:t.depositAmountOffline,
                                  depositCountOffline:t.depositCountOffline,
                                  depositAmount:t.depositAmount,
                                  depositCount:t.depositCount,
                                  withdrawalsAmount:t.withdrawalsAmount,
                                  withdrawalsCount:t.withdrawalsCount,
                                  validBetAmountAll:t.validBetAmountAll,
                                  validBetAmountUser:t.validBetAmountUser,
                                  multiple:t.multiple,
                                  memberBonus:t.memberBonus,
                                  netAmount:t.netAmount,
                                  profit:t.profit,
                                  cashProfit:t.cashProfit
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
                const {depositAmountOnline,depositAmountOffline,depositAmount,withdrawalsAmount,validBetAmountAll,
                validBetAmountUser,multiple,memberBonus,netAmount,profit,cashProfit,depositCountOffline,
                depositCountOnline,depositCount,withdrawalsCount
                } = total;
                let item = {
                    userName: '总计',
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
                    withdrawalsCount,
                };
                return item;
        },
    onPageChange(page) {
      this.page = page;
      let data={...this.searchKey};
      for (let key in  data){
        if(!data[key]) delete  data[key]
      }
      this.getData({ params: data, query: { page } });
    },
    setLocal(){
       let list = JSON.parse(localStorage.tagNaveList)
								list.forEach(t=>{
									if(t.name=='auditDetails'){
										t.query.startTime = this.$root.formatTimeX(this.Time[0]);
										t.query.endTime = this.$root.formatTimeX(this.Time[1]);
									}
								})
							this.setTagNavList(list)
    },
    searchSubmit(){
      const  {sortKey, sortVal}=this.searchKey;
      if (sortKey) delete this.searchKey.sortKey;
				if (sortVal) delete this.searchKey.sortVal;
				this.table.columns.forEach(item => {
					if (item.sortable == "custom") this.$set(item, "sortType", "");
				});
        //this.btnName="本月";
 

        let params = {...this.searchKey}
        for(let key in params){
          if(!params[key]) delete params[key];
        }
        if(this.Time[0]=='' && this.Time[1]==''){
          this.$Tip.info({ content: "请输入开始和结束时间" });
          return false;
      }
        if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeX(startTime);
        params.endTime = endTime && this.$root.formatnightTimeS(endTime);
        this.searchKey.startTime=	params.startTime;
        this.searchKey.endTime=	params.endTime;
          } else {
              return false;
          }
         
        this.$refs.table.setPage();
      this.page = 1;
        this.getData({params})
    },
    //排序
	sortChange({ column, key, order }) {
    delete this.searchKey.sortKey;
		delete this.searchKey.sortVal;  
		let data = {
			sortKey: key,
			sortVal: order,
			...this.searchKey,
    };
    this.searchKey.sortKey=key;
       for( let key in  data){
      if(!data[key]) delete data[key];
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
            if (!data[key] || key == 'limit') delete data[key];
        }
        data.isExport = 1;
        let openr = window.open();
        getReviewDetail({params:data})
            .then(res => {
                if (res != undefined && res.code == 200) {
                    let region = res.data.downloadUrl.split('.com')[1];
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
      let data;
      if(params == 'memberBonus'||params=='depositAmount'||params=='validBetAmount'){
          let startTime = this.$root.unixTime(this.totalUser.created_at).split(' ')[0] +' 00:00:00';
          data = {
          siteId: this.$root.nowSite.id,
          startTime: startTime,
          endTime: this.$root.formatnightTimeS(this.Time[1]),
          uid:this.totalUser.uid,
          type: type
        };
      }else{
           data = {
          siteId: this.$root.nowSite.id,
          startTime: this.$root.returnDayTime(params.row.data_date)+' 00:00:00',
          endTime: this.$root.returnDayTime(params.row.data_date)+' 23:59:59',
          uid:params.row.uid,
          type: type
        };
      }
      this.isSpin = true;
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
    bannedGameReportsMemberBonus(params,type){
      let data;
      if(type=='oneMemberBonus'){
        const {uid,data_date,depositAmount}=params.row;
        data = {
        siteId:this.$root.nowSite.id,
        startTime:this.$root.returnDayTime(data_date)+' 00:00:00',
        endTime: this.$root.returnDayTime(data_date)+' 23:59:59',
        depositAmount:depositAmount*1,
        uid
      }

      }else{
        let startTime = this.$root.unixTime(this.totalUser.created_at).split(' ')[0] +' 00:00:00';
        let newTime = new Date().getTime();
        let endTime = this.$root.formatTimeS(newTime);
          data = {
          siteId: this.$root.nowSite.id,
          startTime: startTime,
          endTime: endTime,
          uid:this.totalUser.uid,
          depositAmount:this.totalUser.depositAmount,
          type: type
        };

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

/deep/.ivu-table-cell .top {
  display: block;
  width:40%;
  height: 35%;
  position: absolute;
  top:0;
  right: 0;
  background-color: rgba(45, 140, 240,0.2);
  color: #2d8cf0;
}
/deep/ .ivu-table-border td{
  position: relative;
}
/deep/.ivu-table-title, .ivu-table-footer{
  background:#f4faff;
}
</style>

