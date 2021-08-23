<template>
    <div style="marginBottom:20px;">
        <div class="v2-search" style="margin-bottom:20px">
            <Form ref="searchKey" inline>
                <FormItem v-for="(btn, i) in btns" :key="btn">
                    <Button class="fontColor" :class="index == i ? 'bd-bg' : 'bg-or'" @click.prevent="changeDate(i)">
                        <span>{{ btn }}</span>
                    </Button>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" :options="options3" placeholder="开始日期" class="s-120" v-model="Time[0]" @on-change="startChange"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" :options="options4" placeholder="结束日期" class="s-120" v-model="Time[1]" @on-change="startChange"></DatePicker>
                </FormItem>
                <FormItem label="时区">
                    <Select v-model="searchKey.timeType" class="s-120" @on-change="changtime">
                        <Option value="cn">北京时间</Option>
                        <Option value="en">美东时间</Option>
                        <Option value="cw">财务时间</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="spinShow" class="ivu-btn search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <div>
                        <div class="clearfix">
                            <span class="fl">计算公式</span>
                            <Poptip trigger="hover" placement="bottom-end" class="ml5 fl">
                                <div slot="content" class="mb20">
                                    <div>网站盈利= -（会员输赢+总佣金+总优惠）</div>
                                    <div class="mt15">现金利润=总存款-总取款</div>
                                    <!-- <div class="mt15">本月利润=本月总存款-本月总取款</div>
                  <div>本月利率=本月利润/本月总存款</div> -->
                                    <!-- <div class="mt15">首存金额=用户首次存款当日00：00：00到23：59：59的所有存款总和</div> -->
                                    <div v-if="$root.modeName() == 'no' || $root.modeName() == 'mode_a' || $root.modeName() == 'mode_b'" class="mt15">
                                        <p>总佣金=自身返佣+下级返佣+日工资+月分红</p>
                                        <p>自身返佣=自身有效洗码量*佣金分润点</p>
                                        <p>下级返佣=下级有效洗码量总和*佣金分润点</p>
                                    </div>
                                    <div v-if="$root.modeName() == 'mode_c'" class="mt15">
                                        <p>总佣金=直推佣金+级差佣金</p>
                                    </div>
                                    <div class="mt15"><p>留存计算公式为：（统计日）已登录打码用户数/基准日首存用户数*100%</p></div>
                                    <div class="mt15">
                                        <p>新增存款：当日注册用户在当日的总存款；</p>
                                        <p>首日存款：当日或历史注册用户在首次存款当日的总存款；</p>
                                        <!-- <p>首存金额：留存用户的首次存款；</p> -->
                                    </div>
                                    <div class="mt15">时区统计时间：</div>
                                    <div>北京时间：00:00:00~23:59:59</div>
                                    <div>美东时间：12:00:00~次日11:59:59</div>
                                    <div>财务时间：08:00:00~次日07:59:59</div>
                                </div>
                                <Icons type="bangzhutishi" color="#E4E4E4" :size="26" />
                            </Poptip>
                        </div>
                    </div>
                </FormItem>
            </Form> 
        </div>
        <div class="mb50" style="position:relative;">
            <Spin fix v-show="spinShow">
                <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
                    <div v-for="t in 8" :key="'div' + t"></div>
                </div>
            </Spin>
            <ul class="top clearfix pt20 pb20 pl20" style="padding-left:0px;">
                <li class="fl w20" style="height: 80px;">
                    <div class="circle bgBule fl" style="marginTop: 18px;">
                        <Icons type="zonghebaobiaoyouxiaotouzhu" class="ib hv" style="color:#fff;marginTop:4px;marginLeft:7px;" size="21"></Icons>
                    </div>
                    <div class="fl ml10" style="marginTop: 18px;">
                        <span class="db">有效投注</span>
                        <span class="red-font ft14">{{ $root.keepTwo(betData.validBetAmount) }}/{{ betData.betUserCount }}人</span>
                    </div>
                </li>
                <li class="fl w20" style="height: 80px;">
                    <div class="circle bgPurple fl" style="marginTop: 18px;">
                        <Icons type="zonghebaobiaohuiyuanshuying" class="ib hv" style="color:#fff;marginTop:3px;marginLeft:8px;" size="23"></Icons>
                    </div>
                    <div class="fl ml10" style="marginTop: 18px;">
                        <span class="db">会员输赢</span>
                        <span class="ft14 red-font">{{ $root.keepTwo(betData.netAmount) }}</span>
                    </div>
                </li>
                <li class="fl w20" style="height: 80px;">
                    <div class="circle bgOrange fl" style="marginTop: 18px;">
                        <Icons type="zonghebaobiaopingtaiyingli" class="ib hv" style="color:#fff;margin-top:4px;margin-left:7px;" size="22"></Icons>
                    </div>
                    <div class="fl ml10" style="marginTop: 18px;">
                        <span class="db">网站盈利</span>
                        <span class="ft14 red-font">{{ $root.keepTwo(otherData.webProfit) }}</span>
                    </div>
                </li>
                <li class="fl w20" style="height: 80px;">
                    <div class="circle bgGreen fl" style="marginTop: 18px;">
                        <Icons type="zonghebaobiaopingtaiyingshuai" class="ib hv" style="color:#fff;marginLeft:8px;marginTop:4px;" size="23"></Icons>
                    </div>
                    <div class="fl ml10" style="marginTop: 18px;">
                        <span class="db">现金利润</span>
                        <span class="ft14 red-font">{{ $root.keepTwo(otherData.moneyProfit) }}</span>
                    </div>
                </li>
                <li class="fl w20" style="height: 80px;">
                    <div class="circle fl c1" style="marginTop: 18px;">
                        <Icons type="jiankang" class="ib hv" style="color:#fff;marginLeft:6px;marginTop:4px;" size="23" />
                    </div>
                    <div class="fl ml10" style="marginTop: 18px;">
                        <span class="db">会员余额</span>
                        <span class="ft14 red-font">{{ otherData.userBalanceAmount }}</span>
                    </div>
                </li>
            </ul>
            <div class="mt20 clearfix">
                <!-- 总存款 -->
                <div class="fl w30 bl bb br bt">
                    <div class="f6f8-bg bb clearfix">
                        <span class="ib pt12 pb12 pl20">总存款</span>
                        <div class="fr pt12 pb12 ib mr20 red-font">
                            <span class="ib pl20 cs" @click="toDetail('depositDetail')">{{ $root.keepTwo(depositData.amount) }}/</span>
                            <span class="cs" @click="toDetail('depositDetail')">{{ depositData.userCount }}人/</span>
                            <span class="cs" @click="toDetail('depositCount')">{{ depositData.count }}笔</span>
                        </div>
                    </div>
                    <ul class="middle-con">
                        <ul v-if="depositData.typeCount" class="middle-con">
                            <li
                                class="pt12 bb"
                                v-for="(t, i) in depositData.typeCount"
                                :key="i"
                                v-show="!($root.keepTwo(t.depositAmount) == '0.00' && t.depositUserCount == 0 && t.depositCount == 0)"
                            >
                                <span class="ib pl15 pb12 pl20"  >
                                    <span class="ib box mr5" :key="i" :class="sstt[i]"></span>
                                    <span > {{ t.depositClassName }}</span>
                                </span>
                                <div class="fr mr20 blue">
                                    <div @click="toDetail('depositCountOne',t.depositClassName)" class="cs">
                                        <span class="ib pl20">{{ $root.keepTwo(t.depositAmount) }}/</span>
                                        <span v-if="t.depositClassName=='USDT转账'">{{t.usdtCount}}个/</span>
                                        <span v-if="t.depositClassName=='USDT支付'">{{t.usdtCount}}个/</span>
                                        <span>{{ t.depositUserCount }}人/</span>
                                        <span>{{ t.depositCount }}笔</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </ul>
                    <div class="f6f8-bg bb">
                        <span class="ib pt12 pb12 pl20 ft14">总优惠</span>
                        <div class="fr pt12 pb12 ib mr20 red-font">
                            <span class="ib pl20">{{ $root.keepTwo(bonusData.amount) }}/</span>
                            <span>{{ bonusData.userCount }}人</span>
                        </div>
                    </div>
                    <div class="middle-con ft14">
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                存款优惠
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(bonusData.systemAmount) }}/</span>
                                <span>{{ bonusData.systemUserCount }}人</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss2 mr5"></span>
                                活动优惠
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(bonusData.adminAmount) }}/</span>
                                <span>{{ bonusData.adminUserCount }}人</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss3 mr5"></span>
                                返水优惠
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(bonusData.rebateAmount) }}/</span>
                                <span>{{ bonusData.rebateUserCount }}人</span>
                            </div>
                        </li>
                        
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss4 mr5"></span>
                                <span class="ml5">借呗未还</span>
                                <Poptip trigger="hover" placement="bottom-start" class="ml5">
                                    <div slot="content" class="mb20 f-color">
                                        <div class="mt10">
                                            <p>借呗未还=所选时段借款 - 所选时段还款（包含在这段时间借的人和历</p>
                                            <p>史借的人在这段时间内的还款）</p>
                                        </div>
                                        <div class="mt10">
                                            <p>如：a.所选时段借款10万，所选时段还款5万</p>
                                            <p>借呗未还=10万-5万=5万</p>
                                            <p>b.所选时段借款10万，所选时段还款15万</p>
                                            <p>借呗未还=10万-15万= -5万</p>
                                        </div>
                                        <div class="mt10">
                                            <p>当存款优惠+活动优惠+返水优惠=10万，</p>
                                            <p>a.借呗未还= 5万,总优惠=10 + 5= 15万</p>
                                            <p>b.借呗未还= -5万,总优惠=10 - 5= 5万</p>
                                        </div>
                                    </div>
                                    <Icons type="bangzhutishi" class="ib" color="#E4E4E4" :size="14" />
                                </Poptip>
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(bonusData.jiebeiWeihuanAmount) }}/</span>
                                <span>{{ bonusData.jiebeiWeihuanUserCount }}人</span>
                            </div>
                        </li>
                          <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                免费彩金
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(bonusData.registerThreeStepAmount) }}/</span>
                                <span>{{ bonusData.registerThreeStepUserCount }}人</span>
                            </div>
                        </li>
                    </div>
                    <div>
                        <div class="f6f8-bg">
                            <span class="ib pt12 pb12 pl20">总佣金</span>
                            <div class="fr pt12 pb12 ib mr20 red-font cs" @click="toCommission">
                                <span class="ib pl20">{{ $root.keepTwo(commissionData.amount) }}</span>
                                <span>/{{ commissionData.userCount }}人</span>
                            </div>
                            <Poptip trigger="hover" placement="right">
                                <div slot="content">
                                    <div>总佣金=直推返佣+级差返佣</div>
                                    <div class="mt15">直推返佣=下级直属代理自身业绩/上级代理团队业绩所在佣金级别业绩额度*上级代理团队业绩所在佣金级别返佣金额</div>
                                    <div class="mt15">级差返佣=(上级代理所在佣金级别金额-下级直属代理所在佣金级别返佣金额)*下级直属团队业绩</div>
                                    <div class="mt15">佣金级别：根据每个代理的团队业绩所在区域评定佣金级别</div>
                                    <div class="mt15">团队业绩：只包含下级及下下级，不包含代理本身业绩</div>
                                    <!-- <div class="mt15">业绩：由派彩金额（包含本金）与有效投注组成</div> -->
                                    <div class="mt15">业绩：有效投注金额</div>
                                    <!-- <div class="red-font">(赢：只计算派彩金额   输：只计算有效投注)</div> -->
                                </div>
                                <Icons type="bangzhutishi" size="18" color="#cdcdcd" class="ml10" v-if="$root.modeName() == 'mode_c'" />
                            </Poptip>
                        </div>
                        <!-- 下级返佣去除 -->
                        <!-- <ul class="middle-con">
              <ul v-if="commissionData.typeCount" class="middle-con">
                <li class="pt12 bb" v-for="(t,i) in commissionData.typeCount" :key="i">
                  <span class="ib pl15 pb12 pl20">
                    <span class="ib box mr5" :key="i" :class="sstt[i]"></span>
                    {{t.name}}
                  </span>
                  <div class="fr mr20 blue-font">
                    <span class="ib pl20">{{$root.keepTwo(t.amount)}}</span>
                    <span>/{{t.userCount}}人</span>
                  </div>
                </li>
              </ul>
            </ul> -->
                    </div>
                    <div>
                        <!-- 领取佣金去掉，暂时先注释 -->
                        <!-- <div>
              <span class="ib pt12 pb12 pl20">领取佣金</span>
              <div class="fr pt12 pb12 ib mr20 red-font">
                <span class="ib pl20">{{$root.keepTwo(commissionReceiveData.amount)}}/</span>
                <span>{{commissionReceiveData.userCount}}人</span>
              </div>
            </div> -->
                    </div>
                </div>
                <!-- 总取款 -->
                <div class="fl w30 b ml20">
                    <div class="f6f8-bg bb">
                        <span class="ib pt12 pb12 pl20 ft14">总取款</span>
                        <div class="fr pt12 pb12 ib mr20 red-font">
                            <span class="ib pl20 cs" @click="toDetail('withDetail')">{{ $root.keepTwo(withdrawalData.amount) }}/</span>
                            <span class="cs" @click="toDetail('withDetail')">{{ withdrawalData.userCount }}人/</span>
                            <span class="cs" @click="toDetail('withCount')">{{ withdrawalData.count }}笔</span>
                        </div>
                    </div>
                    <ul class="middle-con ft14">
                         <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss3 mr5"></span>
                                全自动出款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(withdrawalData.allWithdrawalsAutoAmount) }}/</span>
                                <span>{{ withdrawalData.allWithdrawalsAutoUserCount }}人/</span>
                                <span>{{ withdrawalData.allWithdrawalsAutoCount }}笔</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                自动出款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(withdrawalData.autoAmount) }}/</span>
                                <span>{{ withdrawalData.autoUserCount }}人/</span>
                                <span>{{ withdrawalData.autoCount }}笔</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss2 mr5"></span>
                                审核出款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(withdrawalData.systemAmount) }}/</span>
                                <span>{{ withdrawalData.systemUserCount }}人/</span>
                                <span>{{ withdrawalData.systemCount }}笔</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss3 mr5"></span>
                                货币出款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(withdrawalData.virtualAmount) }}/</span>
                                <span>{{ withdrawalData.virtualUsdtCount }}个/</span>
                                <span>{{ withdrawalData.virtualUserCount }}人/</span>
                                <span>{{ withdrawalData.virtualUsdt}}笔</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss4 mr5"></span>
                                人工取款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(withdrawalData.adminAmount) }}/</span>
                                <span>{{ withdrawalData.adminUserCount }}人/</span>
                                <span>{{ withdrawalData.adminCount }}笔</span>
                            </div>
                        </li>
                        <li>
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss2 mr5"></span>
                                其它
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(withdrawalData.otherAmount) }}/</span>
                                <span>{{ withdrawalData.otherUserCount }}人/</span>
                                <span>{{ withdrawalData.otherCount }}笔</span>
                            </div>
                        </li>
                    </ul>
                    <!-- 其它 -->
                    <div class="f6f8-bg bb bt">
                        <span class="ib pt12 pb12 pl20 ft14">其它</span>
                        <div class="fr pt12 pb12 ib mr20 red-font">
                            <span class="ib pl20">{{ $root.keepTwo(middleOther.amount) }}/</span>
                            <span>{{ middleOther.userCount }}人/</span>
                            <span>{{ middleOther.count }}笔</span>
                        </div>
                    </div>
                    <ul class="middle-con ft14">
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                借呗借款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(middleOther.jiebeiAmount)}}/</span>
                                <span>{{ middleOther.jiebeiUserCount}}人/</span>
                                <span>{{ middleOther.jiebeiCount}}笔</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss2 mr5"></span>
                                借呗还款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(middleOther.deductionAmount) }}/</span>
                                <span>{{ middleOther.deductionUserCount }}人/</span>
                                <span>{{ middleOther.deductionCount }}笔</span>
                            </div>
                        </li>
                         <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss3 mr5"></span>
                                撤销借款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(middleOther.cancelLoanUserCount) }}/</span>
                                <span>{{ middleOther.cancelLoanCount }}人/</span>
                                <span>{{ middleOther.cancelLoanAmount}}笔</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss4 mr5"></span>
                                误存取款
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(middleOther.errorAmount) }}/</span>
                                <span>{{ middleOther.errorUserCount }}人/</span>
                                <span>{{ middleOther.errorCount }}笔</span>
                            </div>
                        </li>
                        <li>
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                额度转换失败
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue">
                                <span class="ib pl20">{{ $root.keepTwo(middleOther.transferAmount) }}/</span>
                                <span>{{ middleOther.transferUserCount }}人/</span>
                                <span>{{ middleOther.transferCount }}笔</span>
                            </div>
                        </li>
                    
                    </ul>
                    <div class="bt f6f8-bg">
                        <span class="ib pt12 pb12 pl20">注册人数</span>
                        <div class="fr pt12 pb12 ib mr20 red-font">
                            <span class="pl20">{{ otherData.registerUserCount }}人</span>
                        </div>
                    </div>
                    <div class="bb bt ">
                        <span class="ib pt12 pb12 pl20">入款时间</span>
                        <div class="fr pt12 pb12 ib mr20 red-font cs" @click="timeToDetail">
                            <span class="ib pl35">{{ $root.hoursTime(depositData.averageTime) }}</span>
                        </div>
                    </div>
                    <div class="bb f6f8-bg">
                        <span class="ib pt12 pb12 pl20">取款时间</span>
                        <div class="fr pt12 pb12 ib mr20 red-font cs" @click="timeToDetail">
                            <span class="ib pl35">{{ $root.hoursTime(withdrawalData.averageTime) }}</span>
                        </div>
                    </div>
                    <div class="bb">
                        <span class="ib pt12 pb12 pl20">入款拒绝</span>
                        <div class="fr pt12 pb12 ib mr20 red-font cs" @click="refuseIn('in')">
                            <span class="ib pl35">{{ this.$root.keepTwo(depositData.depositRefuse) }}/</span>
                            <span>{{ depositData.depositRefuseNum }}人</span>
                        </div>
                    </div>
                    <div class="f6f8-bg bb">
                        <span class="ib pt12 pb12 pl20">取款拒绝</span>
                        <div class="fr pt12 pb12 ib mr20 red-font cs" @click="refuseIn('out')">
                            <span class="ib pl35">{{ this.$root.keepTwo(withdrawalData.withdrawalsRefuse) }}/</span>
                            <span>{{ withdrawalData.withdrawalsRefuseNum }}人</span>
                        </div>
                    </div>

                    <div v-for="(t, i) in otherData.newDeposit" :key="'newDeposit' + i" :class="i % 2 == 1 ? 'f6f8-bg clearfix' : 'bb clearfix'">
                        <span class="ib mt12 mb12 pl20">{{ t.name }}</span>
                        <div class="fr pt12 pb12 ib mr20 red-font cs" @click="toDetail('newDeposit')">
                            <span class="pl20">{{ $root.keepTwo(t.amount) }}/</span>
                            <span>{{ t.userCount }}人</span>
                        </div>
                    </div>
                    <div class="f6f8-bg">
                        <span class="ib pt12 pb12 pl20">首日存款</span>
                        <!-- <div class="fr pt12 pb12 ib mr20 red-font cs" @click="toFirst"> -->
                        <div class="fr pt12 pb12 ib mr20 red-font cs" @click="toDetail('firstMoney')">
                            <span class="ib pl35">{{ $root.keepTwo(otherData.firstDepositAmount) }}/</span>
                            <span>{{ otherData.firstDepositUserCount }}人</span>
                        </div>
                    </div>
                      <div class="bt" >
                        <span class="ib pt12 pb12 pl20">免费回充</span>
                        <!-- <div class="fr pt12 pb12 ib mr20 red-font cs" @click="toFirst"> -->
                        <div class="fr pt12 pb12 ib mr20 red-font ">
                            <span class="ib pl35">{{ $root.keepTwo(otherData.freeDepositAmount) }}/</span>
                            <span>{{ otherData.freeDepositUserCount }}人</span>
                        </div>
                    </div>
                </div>
                <div class="fl w30 b ml20">
                    <div class="f6f8-bg bb"  @click="changePort('all')">
                        <span class="ib pt12 pb12 pl20 ft14 cs">在线人数</span>
                        <div class="fr pt12 pb12 ib mr20 cs ">
                              
                             <Tooltip trigger="hover" placement="bottom"  theme="light" >
                                <div slot="content">
                                  在线人数
                                </div>
                                 <span  class="red-font">{{allOnlineData.count_now ? allOnlineData.count_now : 0 }}人</span>
                             </Tooltip>
                             <span class="red-font">/</span>
                             <Tooltip trigger="hover" placement="bottom" theme="light" >
                                <div slot="content">
                                  总人数
                                </div>
                                <span class="red-font" >{{allOnlineData.count_range ? allOnlineData.count_range : 0 }}人</span>
                             </Tooltip>
                        </div>
                    </div>
                    <ul class="middle-con ft14"></ul>
                    <ul class="middle-con">
                        <ul class="middle-con">
                            <li class="pt12 bb" v-for="(t, i) in portOnlineData" :key="i" @click="changePort(t)">
                                <span class="ib pl15 pb12 pl20 cs" >
                                    <span class="ib box mr5" :key="i" :class="sstt[i]"></span>
                                    {{t.device=='pc'?'PC':(t.device=='h5'?'H5':(t.device=='android'?'Android':'IOS'))}}
                                </span>
                                <div class="fr mr20 blue-font">
                                    <div>
                                     
                                    <Tooltip trigger="hover" placement="bottom"  theme="light" >
                                    <div slot="content">
                                    在线人数
                                    </div>
                                    <span>{{t.user_count_now}}人/</span>
                                </Tooltip>
                                <Tooltip trigger="hover" placement="bottom" theme="light" >
                                    <div slot="content">
                                    总人数
                                    </div>
                                    <span  >{{t.user_count_range }}人</span>
                                </Tooltip>
                                <span>/{{ t.amount }}/</span>
                                <span>{{ t.quantity }}笔</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </ul>
                   
                    <div class="f6f8-bg bb">
                        <span class="ib pt12 pb12 pl20 ft14">留存用户</span>
                        <!-- <div class="fr pt12 pb12 ib mr20 red-font">
                            <span v-if="userKeepData.depositFirst" class="ib pl20"
                                >{{ userKeepData.depositFirst.firstAmount == null ? 0.0 : $root.keepTwo(userKeepData.depositFirst.firstAmount) }}/</span
                            >
                            <span
                                class="cs"
                                @click="
                                    () => {
                                        $router.push({ name: 'retainedReport' });
                                    }
                                "
                                >{{ userKeepData.depositFirst != null ? userKeepData.depositFirst.uid : 0 }}人</span
                            >
                        </div> -->
                    </div>
                    <ul class="middle-con ft14">
                        <li class="bb clearfix">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                次日留存
                            </span>

                            <div class="fr pt12 pb12 ib mr20 blue-font" @click="keepTrend('userKeep')">
                                <span class="ib">{{ this.oneUserKeepData.num }}人/</span>
                                <span class="ib">{{ this.oneUserKeepData.percent }}%</span>
                                <!-- <span class="ib txt-l" @click="keepTrend('userKeep')">
                                    <Icon type="ios-arrow-round-up" size="24" class="bb-color" v-if="oneUserKeepData.ysetodayPercent > 0" />
                                    <Icon type="ios-arrow-round-down" size="24" class="red-font" v-if="oneUserKeepData.ysetodayPercent < 0" />
                                    {{ oneUserKeepData.ysetodayPercent }}%
                                </span>
                                -->
                            </div>
                        </li>
                        <li class="bb clearfix">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss2 mr5"></span>
                                3日留存
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue-font" @click="keepTrend('threeData')">
                                <span class="ib">{{ this.treeUserKeepData.num }}人/</span>
                                <span class="ib">{{ this.treeUserKeepData.percent }}%</span>
                                <!-- <span class="ib txt-l" @click="keepTrend('threeData')">
                                    <Icon type="ios-arrow-round-up" size="24" class="bb-color" v-if="treeUserKeepData.ysetodayPercent > 0" />
                                    <Icon type="ios-arrow-round-down" size="24" class="red-font" v-if="treeUserKeepData.ysetodayPercent < 0" />
                                    {{ treeUserKeepData.ysetodayPercent }}%
                                </span>
                                -->
                            </div>
                        </li>
                        <li class="bb clearfix">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss4 mr5"></span>
                                7日留存
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue-font" @click="keepTrend('sevenData')">
                                <span class="ib">{{ this.sevenKeepData.num }}人/</span>
                                <span class="ib">{{ this.sevenKeepData.percent }}%</span>
                                <!-- <span class="ib txt-l" @click="keepTrend('sevenData')">
                                    <Icon type="ios-arrow-round-up" size="24" class="bb-color" v-if="sevenKeepData.ysetodayPercent > 0" />
                                    <Icon type="ios-arrow-round-down" size="24" class="red-font" v-if="sevenKeepData.ysetodayPercent < 0" />
                                    {{ sevenKeepData.ysetodayPercent }}%
                                </span>
                                -->
                            </div>
                        </li>
                        <li class="bb clearfix">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss3 mr5"></span>
                                15日留存
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue-font" @click="keepTrend('oneFiveData')">
                                <span class="ib">{{ this.oneFiveData.num }}人/</span>
                                <span class="ib">{{ this.oneFiveData.percent }}%</span>
                                <!-- <span class="ib txt-l" @click="keepTrend('oneFiveData')">
                                    <Icon type="ios-arrow-round-up" size="24" class="bb-color" v-if="oneFiveData.ysetodayPercent > 0" />
                                    <Icon type="ios-arrow-round-down" size="24" class="red-font" v-if="oneFiveData.ysetodayPercent < 0" />
                                    {{ oneFiveData.ysetodayPercent }}%
                                </span>
                                -->
                            </div>
                        </li>
                    </ul>
                    <!-- 新加的风险用户 -->
                    <div class="f6f8-bg bb">
                        <span class="ib pt12 pb12 pl20 ft14">风险用户</span>
                        <div class="fr pt12 pb12 ib mr20 red-font">
                            <span class="ib pl20">{{$root.keepTwo(allTimes.money) }}/</span>
                            <span>{{allTimes.countUser }}人</span>
                        </div>
                    </div>
                    <ul class="middle-con ft14">
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                1倍打码
                            </span>
                            <div 
                            class="fr pt12 pb12 ib mr20 blue-font" 
                            @click="userDtail('risk',1)">
                                <span class="ib pl20">{{oneTimes.money }}/</span>
                                <span>{{oneTimes.countUser }}人/</span>
                                <span>{{oneTimes.proportion }}%</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss2 mr5"></span>
                                2倍打码
                            </span>
                            <div 
                            class="fr pt12 pb12 ib mr20 blue-font" 
                            @click="userDtail('risk',2)">
                                <span class="ib pl20">{{twoTimes.money }}/</span>
                                <span>{{twoTimes.countUser }}人/</span>
                                <span>{{twoTimes.proportion }}%</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                3倍打码
                            </span>
                            <div 
                            class="fr pt12 pb12 ib mr20 blue-font" 
                            @click="userDtail('risk',3)">
                                <span class="ib pl20">{{treeTimes.money}}/</span>
                                <span>{{treeTimes.countUser}}人/</span>
                                 <span>{{treeTimes.proportion}}%</span>
                            </div>
                        </li>
                    </ul>
                    <!-- 流失用户 -->
                    <div class="f6f8-bg bb">
                        <span class="ib pt12 pb12 pl20 ft14">流失用户</span>
                        <div class="fr pt12 pb12 ib mr20 red-font">
                            <span class="ib pl20">{{$root.keepTwo(allLoss.deposit)}}/</span>
                            <span>{{allLoss.countUser}}人</span>
                        </div>
                    </div>
                    <ul class="middle-con ft14">
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                7日流失
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue-font" @click="userDtail('losee', 7)">
                                <span class="ib pl20">{{sevenLoss.deposit}}/</span>
                                <span>{{sevenLoss.countUser}}人/</span>
                                <span>{{sevenLoss.proportion}}%</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss2 mr5"></span>
                                15日流失
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue-font" @click="userDtail('losee', 15)">
                                <span class="ib pl20">{{fifteenLoss.deposit}}/</span>
                                <span>{{fifteenLoss.countUser}}人/</span>
                                <span>{{fifteenLoss.proportion}}%</span>
                            </div>
                        </li>
                        <li class="bb">
                            <span class="ib pt12 pb12 pl20">
                                <span class="ib box ss1 mr5"></span>
                                30日流失
                            </span>
                            <div class="fr pt12 pb12 ib mr20 blue-font" @click="userDtail('losee', 30)">
                                <span class="ib pl20">{{thirtyLoss.deposit}}/</span>
                                <span>{{thirtyLoss.countUser}}人/</span>
                                <span>{{thirtyLoss.proportion}}%</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <Modals title="存取款详情" ref="detail" width="1200" @modalVisible="visibleChange">
           
            <div slot="content" style="width:1150px"  class="ml20 mb20 modal-overflow">
                <div class="v2-search" style="width:100%" > <Button @click="exportExcel" type="primary" :loading="$root.editBtnLoading" class=" ml10">导出</Button></div>
                <Tables
                    ref="table"
                    :loading="$root.tableLoading"
                    :columns="depositOneType==true?table.columns:table.columnsNew"
                    :value="table.data"
                    :total="table.total"
                    :show-sizer="false"
                    :page-size-opts="table.pageSizeOpts"
                    :pageFix="10"
                    pageFixShow
                    @on-page-change="onPageChange"
                    @on-sort-change="sortChange"
                ></Tables>
            </div>
        </Modals>
        <!-- 留存率 -->
        <Modals :title="keepTitle" ref="keepTrend" width="880">
            <div slot="content" style="width: 800px;" class="ml20 mb50 modal-overflow">
                <KeepChats ref="KeepChats" :chats-data="KeepChatsData" :title="keepTitle"></KeepChats>
            </div>
        </Modals>
        <!-- 风险用户详情 -->
        <Modals title="风险用户详情" ref="riskDetail" width="1040" @modalVisible="visibleChange1">
            <div slot="content" style="width: 1000px;" class="ml20 mb20 modal-overflow">
                <Tables
                    ref="table1"
                    :loading="$root.tableLoading"
                    :columns="table1.columns"
                    :value="table1.data"
                    :total="table1.total"
                    :show-sizer="false"
                    :page-size-opts="table.pageSizeOpts"
                    :pageFix="10"
                    pageFixShow
                    @on-page-change="userOnPageChange"
                    @on-sort-change="sortChange1"
                ></Tables>
            </div>
        </Modals>
        <!-- 流失用户详情 -->
        <Modals title="流失用户详情" ref="lossDetail" width="1040" @modalVisible="visibleChange1">
            <div slot="content" style="width: 1000px;" class="ml20 mb20 modal-overflow">
                <Tables
                    ref="table2"
                    :loading="$root.tableLoading"
                    :columns="table2.columns"
                    :value="table2.data"
                    :total="table2.total"
                    :show-sizer="false"
                    :page-size-opts="table.pageSizeOpts"
                    :pageFix="10"
                    pageFixShow
                    @on-page-change="userOnPageChange"
                    @on-sort-change="sortChange1"
                ></Tables>
            </div>
        </Modals>
        <onlinePort ref="onlinePort"></onlinePort>
    </div>
</template>
<script>
import Icons from '@/components/icons';
import Modals from '_c/modals';
import Tables from '_c/tables';
import { checkDayBtn } from '@/libs/util';
import KeepChats from './components/keep-chats';
import onlinePort from './components/onlineModals';
import { getmultipleReports, multipleReportsByDepositAmount, getMultipleReportsByRiskUser, multipleReportsByKeep, getMultipleReportsByLossUser } from '@/api/report';
export default {
    name: 'complexReport',
    components: { Icons, Modals, Tables, KeepChats,onlinePort },
    data() {
        return {
            exportData:[],
            oneUserKeepData: [],
            depositOneType:false,//判断总存款
            newType:'',
            treeUserKeepData: [],
            sevenKeepData: [],
            oneFiveData: [],
            userType: '',
            type: 1,
            page: 1,
            sstt: ['ss1', 'ss2', 'ss3', 'ss4', 'ss1', 'ss2', 'ss3', 'ss4', 'ss1', 'ss2','ss3', 'ss4',],
            table: {
                total: 0,
                data: [],
                pageSizeOpts: [10],
                loading: true,
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '等级',
                        key: 'level',
                        align: 'center'
                    },
                    {
                        title: '在线支付',
                        key: 'depositOnlineAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '公司入款',
                        key: 'depositOfflineAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '存款总额',
                        key: 'depositAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '取款总额',
                        key: 'withdrawalsAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '现金盈利',
                        key: 'profit',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '打码量',
                        key: 'validBetAmount',
                        align: 'center'
                    },
                    {
                        title: '打码倍数',
                        key: 'multiple',
                        align: 'center'
                    }
                ],
                  columnsNew: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '等级',
                        key: 'level',
                        align: 'center'
                    },
                    {
                        title: '在线支付',
                        key: 'depositOnlineAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '公司入款',
                        key: 'depositOfflineAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                       {
                        title: '',
                        key: 'payment_class_amount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '存款总额',
                        key: 'depositAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '取款总额',
                        key: 'withdrawalsAmount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '现金盈利',
                        key: 'profit',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '打码量',
                        key: 'validBetAmount',
                        align: 'center'
                    },
                    {
                        title: '打码倍数',
                        key: 'multiple',
                        align: 'center'
                    }
                ]
            },
            table1: {
                total: 0,
                data: [],
                pageSizeOpts: [10],
                loading: true,
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '等级',
                        key: 'levelAlias',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '账户余额',
                        key: 'balance',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100
                    },
                    {
                        title: '存款总额',
                        key: 'depositAmount',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '取款总额',
                        key: 'withdrawalsAmount',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '现金利润',
                        key: 'profit',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '打码量',
                        key: 'validBetAmount',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return <span>{this.$root.newUnixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '打码倍数',
                        key: 'multiple',
                        align: 'center',
                        minWidth: 100
                    }
                ]
            },
            table2: {
                total: 0,
                data: [],
                pageSizeOpts: [10],
                loading: true,
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '等级',
                        key: 'levelAlias',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '账户余额',
                        key: 'balance',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100
                    },
                    {
                        title: '存款总额',
                        key: 'depositAmount',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '取款总额',
                        key: 'withdrawalsAmount',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '现金利润',
                        key: 'profit',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '打码量',
                        key: 'validBetAmount',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '未登录/天',
                        key: 'lastTime',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return <span>{this.$root.newUnixTime(params.row.created_at)}</span>;
                        }
                    }
                ]
            },
            terminalVal:'',
            RiskUserData: {},
            LossUserData: {},
            lossUsersSum: '',
            riskUserSum: '',
            oneTimes: '',
            twoTimes: '',
            treeTimes: '',
            allTimes: '',
            sevenLoss: '',
            fifteenLoss: '',
            thirtyLoss: '',
            allLoss: '',
            spinShow: false,
            index: 0,
            btns: ['今天', '昨天', '本月', '上月'],
            searchKey: {
                timeType: 'cn',
                startTime: this.$root.startTime(),
                endTime: this.$root.midnight(),
                siteId: this.$root.nowSite.id
            },
            Time: [this.$root.startTime(), this.$root.midnight()],
            otherData: {},
            allOnlineData:{},//总在线人数
            portOnlineData:{},//各端在线人数
            depositData: [],
            agencyIncome: {},
            withdrawalData: [],
            commissionData: [],
            commissionReceiveData: [],
            middleOther: [],
            options3: {
                disabledDate: date => {
                    return (date && date.valueOf() < new Date(this.$root.totalDataStartTime())) || (date && date.valueOf() > new Date(this.$root.todayStartTime()).getTime());
                }
            },
            options4: {
                disabledDate: date => {
                    return (date && date.valueOf() < new Date(this.$root.totalDataStartTime())) || (date && date.valueOf() > new Date(this.$root.todayEndTime()).getTime());
                }
            },
            bonusData: [
                { title: '活动派送', amount: '100000000.00', number: '1000' },
                { title: '返水派送', amount: '100000000.00', number: '1000' },
                {
                    title: '人工派送',
                    amount: '100000000.00',
                    number: '1000',
                    data: [
                        { title: '活动', amount: '100000000.00', number: '100' },
                        { title: '返水', amount: '100000000.00', number: '100' }
                    ]
                }
            ],
            betData: {},
            totalMonth: {},
            totalLastMonth: {},
            userKeepData: {},
            keepTitle: '',
            keepData: [],
            KeepChatsData: {}
        };
    },
    created() {
        let data = { siteId: this.$root.nowSite.id };
        this.changeDate(0);
    },
    watch: {
        'searchKey.timeType'(val, oldVal) {
            if (!this.index) {
                if (oldVal == 'cn' && val == 'cw')
                    this.Time[0] =
                        this.Time[0] &&
                        this.$moment(this.Time[0])
                            .subtract(1, 'days')
                            .format('YYYY-MM-DD 08:00:00');
                if (oldVal == 'cn' && val == 'en') this.Time[0] = this.Time[0] && this.$moment(this.Time[0]).format('YYYY-MM-DD 00:00:00');
                if (oldVal == 'cw' && val == 'en')
                    this.Time[0] =
                        this.Time[0] &&
                        this.$moment(this.Time[0])
                            .add(1, 'days')
                            .format('YYYY-MM-DD 00:00:00');
                if (oldVal == 'cw' && val == 'cn')
                    this.Time[0] =
                        this.Time[0] &&
                        this.$moment(this.Time[0])
                            .add(1, 'days')
                            .format('YYYY-MM-DD 00:00:00');
                if (oldVal == 'en' && val == 'cw')
                    this.Time[0] =
                        this.Time[0] &&
                        this.$moment(this.Time[0])
                            .subtract(1, 'days')
                            .format('YYYY-MM-DD 08:00:00');
                if (oldVal == 'en' && val == 'cn') this.time[0] = this.Time[0] && this.$moment(this.Time[0]).format('YYYY-MM-DD 00:00:00');
            }
        },
        'userKeepData.depositFirst'(val, oldVal) {
            this.userKeepData.depositFirst = val;
        }
    },

    methods: {
        exportExcel(){
            this.$root.startEditLoading();
            	let openr = window.open();
                   this.exportData.params.isExport=1;
                 
					multipleReportsByDepositAmount(this.exportData,true)
						.then(res => {
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
						.catch(error => this.$root.endEditLoading());

        },
        changePort(t){
            if(t!='all'){
                const {device}=t;
                this.terminalVal=device;

            }else{
                this.terminalVal="all"
            }
             this.$refs.onlinePort.showModals(this.terminalVal);
        },
        startChange(time, type) {
            const { timeType } = this.searchKey;
            let st, et, btnName;
            this.index =
                checkDayBtn(this.Time, timeType, this) == '今天'
                    ? 0
                    : checkDayBtn(this.Time, timeType, this) == '昨天'
                    ? 1
                    : checkDayBtn(this.Time, timeType, this) == '本月'
                    ? 2
                    : checkDayBtn(this.Time, timeType, this) == '上月'
                    ? 3
                    : null;
        },
        toDetail(stage,type) {

            this.$refs.detail.show();
            this.searchKey.siteId = this.$root.nowSite.id;
            if (stage == 'newDeposit') {
                this.searchKey.type = 'is_today_register';
            } else if (stage == 'firstMoney') {
                this.searchKey.type = 'is_first_deposit';
            } else if (stage == 'withDetail') {
                this.searchKey.type = 'withdrawalsAmount';
            }else if(stage=='depositCountOne'){
                 this.searchKey.payment_class_cn =type;
            }else {
                if (this.searchKey.type) delete this.searchKey.type;
            }
            let data = { params: this.searchKey };
            this.getDetailData(data,type);
        },
        changeDate(i) {
            if (this.searchKey.type) delete this.searchKey.type;
            this.index = i;
            const { timeType } = this.searchKey;
            let startDate, endDate;
            if (i == 0) {
                startDate = timeType == 'cn' ? this.$root.todayStartTime() : timeType == 'cw' ? this.$root.cwTodayStartTime() : this.$root.enTodayStartTime();
                endDate = timeType == 'cn' ? this.$root.todayEndTime() : timeType == 'cw' ? this.$root.cwTodayEndTime() : this.$root.enTodayEndTime();
            } else if (i == 1) {
                startDate = timeType == 'cn' ? this.$root.yesterdayStartTime() : timeType == 'cw' ? this.$root.cwYesterdayStartTime() : this.$root.enYesterdayStartTime();
                endDate = timeType == 'cn' ? this.$root.yesterdayEndTime() : timeType == 'cw' ? this.$root.cwYesterdayEndTime() : this.$root.enYesterdayEndTime();
            } else if (i == 2) {
                startDate = timeType == 'cn' ? this.$root.monthDayStartTime() : timeType == 'cw' ? this.$root.cwMonthStartTime() : this.$root.enMonthStartTime();
                endDate = timeType == 'cn' ? this.$root.monthDayEndTime() : timeType == 'cw' ? this.$root.cwMonthEndTime() : this.$root.enMonthEndTime();
            } else if (i == 3) {
                startDate = timeType == 'cn' ? this.$root.lastMonthDayStartTime() : timeType == 'cw' ? this.$root.cwLastMonthStartTime() : this.$root.enLastMonthStartTime();
                endDate = timeType == 'cn' ? this.$root.lastMonthDayEndTime() : timeType == 'cw' ? this.$root.cwLastMonthEndTime() : this.$root.enLastMonthEndTime();
            }
            this.Time = [startDate, endDate];
            this.searchKey.startTime = startDate;
            this.searchKey.endTime = endDate;
            this.searchSubmit();
        },
        changtime(val) {
            if (this.searchKey.type) delete this.searchKey.type;
            if (this.index) {
                this.changeDate(this.index);
            } else {
                let [startTime, endTime] = this.Time;
                let st, et;
                st =
                    val == 'cn'
                        ? startTime && this.$root.formatTimeX(startTime)
                        : val == 'en'
                        ? startTime && this.$root.enTimeS(startTime)
                        : startTime && this.$root.cwTimeS(startTime);
                et =
                    val == 'cn'
                        ? endTime && this.$root.formatnightTimeS(endTime)
                        : val == 'en'
                        ? endTime && this.$root.enNightTime(endTime)
                        : endTime && this.$root.cwNightTime(endTime);
            }
        },
        getData(data) {
            this.spinShow = true;
            getmultipleReports(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let {
                            agencyIncome,
                            bet,
                            RiskUser,
                            LossUser,
                            bonus,
                            deposit,
                            firstDepositUserCount,
                            firstDepositByRegUserCount,
                            firstDepositByRegAmount,
                            onlineUserCount,
                            onlineUser,
                            profit,
                            profitRate,
                            registerUserCount,
                            totalLastMonth,
                            totalMonth,
                            userBalanceAmount,
                            firstDepositAmount,
                            withdrawals,
                            moneyProfit,
                            webProfit,
                            validUser,
                            commission,
                            commissionReceive,
                            other,
                            newDeposit,
                            healthIndex,
                            cancellations,
                            userKeepData,
                             freeDepositAmount,
                            freeDepositUserCount,
                        } = res.data;
                    
                        this.otherData = {
                            freeDepositAmount,
                            freeDepositUserCount,
                            moneyProfit,
                            profit,
                            profitRate,
                            userBalanceAmount,
                            onlineUserCount,
                            onlineUser,
                            firstDepositUserCount,
                            firstDepositByRegUserCount,
                            registerUserCount,
                            firstDepositByRegAmount,
                            firstDepositAmount,
                            webProfit,
                            validUser,
                            newDeposit,
                            healthIndex,
                            cancellations
                        };
                      
                         this.allOnlineData=onlineUser.total_online_user;
                         this.portOnlineData=onlineUser.device_online_user;
                      
                        this.middleOther = other;
                        this.depositData = deposit;
                        this.commissionData = commission;
                        // if (this.$root.modeName() == 'mode_c') {
                        //   let arr = []
                        //   this.commissionData.typeCount.forEach(t => {
                        //     if (t.name =='级差佣金' || t.name == '直推佣金') arr.push(t)
                        //   })
                        //   this.commissionData.typeCount = arr
                        // }
                        this.agencyIncome = agencyIncome;
                        this.withdrawalData = withdrawals;
                       
                        this.bonusData = bonus;
                        console.log(this.bonusData)
                        this.betData = bet;
                        this.RiskUserData = RiskUser;
                        this.LossUserData = LossUser;
                        for (let key in this.RiskUserData) {
                            if (key == '1times') this.oneTimes = this.RiskUserData[key];
                            if (key == '2times') this.twoTimes = this.RiskUserData[key];
                            if (key == '3times') this.treeTimes = this.RiskUserData[key];
                            if (key == 'all') {
                                this.allTimes = this.RiskUserData[key];
                                this.riskUserSum = this.allTimes.users;
                            }
                        }
                        for (let key in this.LossUserData) {
                            if (key == '7') this.sevenLoss = this.LossUserData[key];
                            if (key == '15') this.fifteenLoss = this.LossUserData[key];
                            if (key == '30') this.thirtyLoss = this.LossUserData[key];
                            if (key == 'all') {
                                this.allLoss = this.LossUserData[key];
                                this.lossUsersSum = this.allLoss.users;
                            }
                        }
                        this.commissionReceiveData = commissionReceive;
                        this.totalMonth = totalMonth;
                        this.totalLastMonth = totalLastMonth;
                        this.userKeepData = userKeepData;
                        this.oneUserKeepData = this.userKeepData[1];
                        this.treeUserKeepData = this.userKeepData[3];
                        this.sevenKeepData = this.userKeepData[7];
                        this.oneFiveData = this.userKeepData[15];
                        this.spinShow = false;
                    } else {
                        this.spinShow = false;
                    }
                })
                .catch(error => (this.spinShow = false));
        },
        searchSubmit() {
            if (this.searchKey.type) delete this.searchKey.type;
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            if (params.timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.formatTimeX(startTime);
                    params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                } else return false;
            } else if (params.timeType == 'cw') {
                if (this.$root.mdValidateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.cwTimeS(startTime);
                    params.endTime = endTime && this.$root.cwNightTime(endTime);
                } else return false;
            } else if (params.timeType == 'en') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.enTimeS(startTime);
                    params.endTime = endTime && this.$root.enNightTime(endTime);
                }
            }

            for (let key in params) {
                if (!params[key]) delete params[key];
            }

            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间' });
                return false;
            }

            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (params.timeType == 'cw') params.timeType = 'cn';
            this.getData(params);
        },
        getDetailData(data,type) {
        
            this.newType=type;
            if (!data.params.limit) data.params.limit = 10;
            if (!data.params.siteId) data.params.siteId = this.$root.nowSite.id;
            let newData = JSON.parse(JSON.stringify(data));
            this.exportData=newData;
            if (newData.params.timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    newData.params.startTime = startTime && this.$root.formatTimeX(startTime);
                    newData.params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                } else return false;
            } else if (newData.params.timeType == 'cw') {
                if (this.$root.mdValidateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    newData.params.startTime = startTime && this.$root.cwTimeS(startTime);
                    newData.params.endTime = endTime && this.$root.cwNightTime(endTime);
                } else return false;
            } else if (newData.params.timeType == 'en') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    newData.params.startTime = startTime && this.$root.enTimeS(startTime);
                    newData.params.endTime = endTime && this.$root.enNightTime(endTime);
                }
            }
             if(type==''||type==undefined){
                 newData.params.payment_class_cn='';
                
            }
            for (let key in newData.params) {
                if (!newData.params[key]) delete newData.params[key];
            }
            this.searchKey.startTime = newData.params.startTime;
            this.searchKey.endTime = newData.params.endTime;
            if (newData.params.timeType == 'cw') newData.params.timeType = 'cn';
           
            this.$root.startTableLoading();
            multipleReportsByDepositAmount(newData)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                    
                        let { data, total } = res.data;
                      
                        if(type=='在线支付'||type==undefined||type=='公司入款'||type==''){
                             this.depositOneType=true;
                        }else{
                            this.depositOneType=false;
                            this.table.columnsNew.forEach(t=>{
                                if(t.key=="payment_class_amount"){
                                   t.title=type;
                                }
                            })
                        }
                       
                        this.table.data = data;
                        this.table.total = total;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        onPageChange(page) {
            this.page = page;
            this.getDetailData({ params: this.searchKey, query: { page } },this.newType);
        },
        sortChange({ column, key, order }) {
          

            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = {
                sortKey: key,
                sortVal: order,
                ...this.searchKey
            };
            this.searchKey.sortKey = key;
            if (data.sortVal == 'normal') {
                this.table.columns.forEach(item => {
                    if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                });
                this.searchKey.sortVal = 'asc';
                data.sortVal = 'asc';
            } else {
                this.searchKey.sortVal = order;
                this.table.columns.forEach(item => {
                    delete item.sortType;
                });
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
           
            this.page == 1 ? this.getDetailData({ params: data },this.newType) : this.getDetailData({ params: data, query: { page: 1 }, },this.newType);
        },
        visibleChange(flag) {
            if (!flag) {
                this.table.columns.forEach(item => {
                    if (item.sortable == 'custom') this.$set(item, 'sortType', '');
                });
                delete this.searchKey.sortKey;
                delete this.searchKey.sortVal;
                this.table.data = [];
                this.$refs.table.setPage();
            }
        },
        //跳转存取统计详情
        timeToDetail() {
            let data = { ...this.searchKey };
            let { timeType, startTime, endTime } = data;
            data.startTime = this.$moment(startTime).format('YYYY-MM-DD');
            data.endTime = this.$moment(endTime).format('YYYY-MM-DD');
            delete data.timeType;
            this.$router.push({
                name: 'accessAuditTotal',
                query: {
                    from: 'complex',
                    startTime: data.startTime,
                    endTime: data.endTime
                }
            });
            // this.$router.push({
            //   name: 'accessAuditTotal'
            // })
        },
        // 佣金报表
        toCommission() {
            const { startTime, endTime } = this.searchKey;
            this.$router.push({
                name: 'commissionReport',
                query: {
                    startTime,
                    endTime,
                    from: 'complex'
                }
            });
        },
        //首存报表
        // toFirst() {
        //   let { startTime, endTime, timeType } = this.searchKey
        //   let data = {}
        //   if (timeType == 'cn' || timeType == 'cw') {
        //     data.startTime = startTime
        //     data.endTime = endTime
        //   } else if (timeType == 'en') {
        //     data.startTime = this.$moment(startTime).add(12, 'hours').startOf('second').format('YYYY-MM-DD HH:mm:ss')
        //     data.endTime = this.$moment(endTime).add(12, 'hours').startOf('second').format('YYYY-MM-DD HH:mm:ss')
        //   }
        //   this.$router.push({
        //     name: 'firstDepositReport',
        //     query: { startTime: data.startTime, endTime: data.endTime, type: 'firstTime'},
        //     params: {
        //       from: 'complex'
        //     }
        //   })
        // },
        // 入款拒绝 取款拒绝
        refuseIn(type) {
            let data = { ...this.searchKey };
            delete data.timeType;
            let { startTime, endTime } = data;
            data.startTime = this.$moment(startTime).format('YYYY-MM-DD');
            data.endTime = this.$moment(endTime).format('YYYY-MM-DD');
            let time = (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60 * 60 * 24);
            if (time > 7) {
                this.$Tip.info({ content: '跳转页面查询大于7天记录，会员账号必填' });
            } else {
                this.$router.push({
                    name: type == 'in' ? 'payCompany' : 'withdrawalsOnline',
                    query: {
                        startTime: data.startTime,
                        endTime: data.endTime,
                        status: 'fail'
                    },
                    params: {
                        from: 'complex'
                    }
                });
            }
        },

        keepTrend(type) {
            let data = {
                siteId: this.$root.nowSite.id,
                key: type == 'userKeep' ? '1' : type == 'threeData' ? '3' : type == 'sevenData' ? '7' : type == 'oneFiveData' ? '15' : ''
            };
            switch (type) {
                case 'userKeep':
                    this.KeepData = this.userKeepData['1'];
                    this.keepTitle = '次日留存率';
                    break;
                case 'threeData':
                    this.KeepData = this.userKeepData['3'];
                    this.keepTitle = '3日留存率';
                    break;
                case 'sevenData':
                    this.KeepData = this.userKeepData['7'];
                    this.keepTitle = '7日留存率';
                    break;
                case 'oneFiveData':
                    this.KeepData = this.userKeepData['15'];
                    this.keepTitle = '15日留存率';
                    break;
            }
            let xData = [],
                yData = [];
            data.data_date = this.KeepData.data_date;
            multipleReportsByKeep(data).then(res => {
                res.data.map(item => {
                    xData.push(item.see_date);
                    yData.push(item[data.key + 'percent']);
                });
                this.KeepChatsData = {
                    xData: xData,
                    yData: yData
                };
                this.$refs.KeepChats.init();
                this.$refs.keepTrend.show();
            });
        },
        //风险用户详情
        userDtail(userType, type) {
            userType == 'risk' ? this.$refs.riskDetail.show() : this.$refs.lossDetail.show();
            const { startTime, endTime, siteId } = { ...this.searchKey };
            this.userType = userType;
            this.type = type;
            let data = {
                siteId: siteId,
                limit: 10,
                startTime: startTime,
                endTime: endTime,
                sortKey: 'balance',
                sortVal: 'desc',
                type: type
            };
            let params = { params: data };
            userType == 'risk' ? this.getRiskData(params) : this.getLossData(params);
        },
        getRiskData(data) {
            this.$root.startTableLoading();
            getMultipleReportsByRiskUser(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        this.table1.data = res.data.data;
                        this.table1.total = res.data.total;
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        getLossData(data) {
            this.$root.startTableLoading();
            getMultipleReportsByLossUser(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        this.table2.data = res.data.data;
                        this.table2.total = res.data.total;
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        userOnPageChange(page) {
            const { startTime, endTime, siteId } = { ...this.searchKey };
            this.page = page;
            let data = {
                siteId: siteId,
                limit: 10,
                startTime: startTime,
                endTime: endTime,
                sortKey: 'balance',
                sortVal: 'desc',
                type: this.type
            };
            this.userType == 'risk' ? this.getRiskData({ params: data, query: { page } }) : this.getLossData({ params: data, query: { page } });
        },
        sortChange1({ column, key, order }) {
            const { startTime, endTime, siteId } = { ...this.searchKey };
            let data = {
                siteId: siteId,
                limit: 10,
                startTime: startTime,
                endTime: endTime,
                sortKey: key,
                sortVal: order,
                type: this.type
            };
            if (this.userType == 'risk') {
                if (data.sortVal == 'normal') {
                    this.table1.columns.forEach(item => {
                        if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                    });
                    data.sortVal = 'asc';
                } else {
                    data.sortVal = order;
                    this.table1.columns.forEach(item => {
                        delete item.sortType;
                    });
                }
                this.page == 1 ? '' : this.$refs.table1.setPage();
                this.page == 1 ? this.getRiskData({ params: data }) : this.getRiskData({ params: data, query: { page: 1 } });
            } else {
                if (data.sortVal == 'normal') {
                    this.table2.columns.forEach(item => {
                        if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                    });
                    data.sortVal = 'asc';
                } else {
                    data.sortVal = order;
                    this.table2.columns.forEach(item => {
                        delete item.sortType;
                    });
                }
                this.page == 1 ? '' : this.$refs.table2.setPage();
                this.page == 1 ? this.getLossData({ params: data }) : this.getLossData({ params: data, query: { page: 1 } });
            }
        },
        visibleChange1(flag) {
            if (!flag) {
                if (this.userType == 'risk') {
                    this.table1.columns.forEach(item => {
                        if (item.sortable == 'custom') this.$set(item, 'sortType', '');
                    });
                    this.table1.data = [];
                    this.$refs.table1.setPage();
                } else {
                    this.table2.columns.forEach(item => {
                        if (item.sortable == 'custom') this.$set(item, 'sortType', '');
                    });
                    this.table2.data = [];
                    this.$refs.table1.setPage();
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
/deep/.v2-search .ivu-form-item {
    &:last-child {
        .ivu-form-item-content {
            line-height: 36px;
        }
    }
}
.ss1 {
    background: #2d8cf0;
}
.ss2 {
    background: #ee8470;
}
.ss3 {
    background: #91c58a;
}
.ss4 {
    background: #f6d467;
}

.w30 {
    width: 32%;
}
.ml10 {
    .db {
        font-size: 1rem;
    }
}
.pl30 {
    border-bottom: 1px solid #dcdcdc;
}
.pb20 {
    padding-bottom: 0px;
    padding-top: 0px;
}
.w25 {
    padding: 20px 0px;
    width: 24.15%;
}
.pb20 li {
    margin-left: 10px;
    border: 1px solid #dcdcdc;
    padding-left: 40px;
    &:first-child {
        margin-left: 0px;
    }
}
.btn80 {
    width: 80px;
    height: 36px;
}
.circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #fff;
}
.circle:hover {
    border-color: #2d8cf0;
}
.dot {
    display: inline-block;
    background-color: #62befd;
    width: 6px;
    height: 6px;
}
.left-con {
    li {
        &:nth-last-child(2) {
            border-top: 1px solid #dcdcdc;
        }
    }
}
.right-con {
    li {
        &:nth-child(2n-1) {
            background: #f6f6f8;
        }
        &:nth-last-child(1) {
            border-bottom: none;
        }
    }
}
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
.box {
    width: 9px;
    height: 9px;
}
.modal-overflow {
    max-height: 1150px;
}

/deep/.ivu-table-header {
    tr {
        th {
            font-size: 1rem;
            .ivu-table-cell {
                font-weight: 549;
            }
        }
    }
}
.c1 {
    background-color: #ff979e;
}
.w20 {
    width: 19.2%;
}
/deep/.ivu-page-total {
    font-size: 0.875rem;
}
.mr1 {
    margin-right: 24px;
}
.mr2 {
    margin-right: 20px;
}
.top /deep/.iconfont{
    cursor:default;
}
</style>


