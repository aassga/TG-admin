<template>
  <div>
    <!-- 站点信息  小写x-->
    <div>
      <p class="ft14 blue-font mb15">站点信息</p>
      <Form
        ref="siteInfo"
        :model="siteInfo"
        :rules="siteInfoRules"
        class="clearfix"
        :label-width="90"
      >
        <FormItem label="站点名称" class="ib fl w16" prop="siteName">
          <Input
            placeholder="请输入站点名称"
            class="w120x"
            v-model="siteInfo.siteName"
            :disabled="$route.query.siteListId ? true : false"
          />
        </FormItem>
        <FormItem
          label="站点代号"
          :class="screen < 1600 ? 'ib fl w20 ml20' : 'ib fl w16'"
          prop="siteCode"
          v-if="!$route.query.siteListId"
        >
          <Input
            class="w120x"
            placeholder="以小写字母或数字开头"
            v-model="siteInfo.siteCode"
          />
          <Poptip
            trigger="hover"
            placement="top"
            content="以小写字母或数字开头，以小写字母或数字结尾"
          >
            <Icons
              type="bangzhutishi"
              :size="20"
              color="#E4E4E4"
              class="ib ml5"
            ></Icons>
          </Poptip>
        </FormItem>
        <FormItem
          label="服务器"
          class="ib fl w16"
          prop="dbid"
          v-if="!$route.query.siteListId"
        >
          <Select class="w100x" v-model="siteInfo.dbid">
            <Option v-for="(t, i) in dbList" :key="'db' + i" :value="t.db_id">{{
              t.db_name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="结束日期"
          :class="screen < 1600 ? 'ib fl w16 ml20' : 'ib fl w20'"
          v-show="newStatus"
        >
          <DatePicker
            type="datetime"
            v-model="siteConfig.timeEnd"
            format="yyyy-MM-dd HH:mm"
            :class="screen < 1600 ? 'w130x' : 'w165x'"
            placeholder="结束日期"
            :options="timeOptions"
          ></DatePicker>
        </FormItem>
        <div v-show="newStatus" class="mb20">
          <Input
            type="textarea"
            placeholder="请输入描述"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="siteConfig.tip"
          />
        </div>
      </Form>
    </div>
    <div
      v-show="
        !$route.query.siteListId ||
        ($root.modeName() != 'mode_b' && $route.query.siteListId)
      "
    >
      <RebateSelect
        ref="rebateSelect"
        v-show="mode != 'mode_c' && mode != 'mode_b'"
        :data="rebateData"
        :isShareholder="true"
        wordClass="blue"
      ></RebateSelect>
    </div>
    <!-- 佣金配置 -->
    <div class="mt15 bb bt pt15" v-if="personal && showPersonal">
      <p class="ft14 mb15 blue-font">佣金设置</p>
      <p class="ft14 mb15">佣金规则设置</p>
      <div class="bt bl br">
        <p style="marginleft: 25px" class="mt15">
          代理佣金体验阶段
          <span class="c3Color"
            >（满足则可继续进行转账，超过则不可再次转账）</span
          >
        </p>
        <Form
          ref="commission"
          :model="commission"
          :rules="commissionRules"
          :label-width="140"
          class="mt15 clearfix"
        >
          <FormItem
            label="佣金转账至金额<"
            class="fl w40 pl25"
            prop="limit_amount"
          >
            <Input
              v-model="commission.limit_amount"
              placeholder="请输入转账金额"
              class="w160x"
            />
          </FormItem>
          <FormItem
            label="且  转账次数<"
            class="fl w40 pl25"
            prop="draw_money_num"
          >
            <Input
              v-model="commission.draw_money_num"
              placeholder="请输入转账次数"
              class="w160x"
            />
          </FormItem>
          <p class="fl btd w100 pt15">
            <span class="pl25">代理佣金转账激活</span>
            <span class="c3Color">（满足则可再次转账，永久有效）</span>
          </p>
          <FormItem
            label="单个会员存款>="
            class="fl w25 mt15 pl25"
            prop="deposit_amount"
          >
            <Input
              v-model="commission.deposit_amount"
              class="w160x"
              placeholder="请输入单个会员存款"
            />
          </FormItem>
          <FormItem
            label="且 会员个数>="
            class="fl w25 mt15 pl25"
            prop="valid_member"
          >
            <Input
              v-model="commission.valid_member"
              placeholder="请输入会员个数"
              class="w160x"
            />
          </FormItem>
          <FormItem
            label="| 且 总存款>="
            class="fl w25 mt15 pl25"
            prop="total_amount"
          >
            <Input
              v-model="commission.total_amount"
              placeholder="总存款"
              class="w160x"
            />
          </FormItem>
          <FormItem
            label="且 总投注>="
            class="fl w25 mt15 pl25"
            prop="total_bet"
          >
            <Input
              v-model="commission.total_bet"
              placeholder="请输入总投注"
              class="w160x"
            />
          </FormItem>
        </Form>
      </div>
      <div style="borderbottom: none">
        <CommissionSelect
          ref="commissionSelect"
          :data="platformDataList"
        ></CommissionSelect>
      </div>
    </div>
    <!-- 站点设置 -->
    <div>
      <p class="ft14 blue-font mt15 mb15">站点设置</p>
      <Form
        ref="siteConfig"
        :model="siteConfig"
        :rules="siteConfigRules"
        :label-width="140"
      >
        <div style="display: flex; flex-wrap: wrap">
          <FormItem :class="this.class" label="快三样式">
            <Select class="w120x fontColor" v-model="siteConfig.k3Theme">
              <Option value="default" class="fontColor">默认样式</Option>
              <Option value="k3Theme" class="fontColor">主题一</Option>
            </Select>
          </FormItem>
          <FormItem :class="this.class" label="佣金最低转账" prop="transAmount">
            <Input
              placeholder="请输入佣金最低转账"
              class="w120x"
              v-model="siteConfig.transAmount"
            />
          </FormItem>
          <FormItem
            :class="this.class"
            label="彩票最高下注"
            prop="lotteryBetMax"
          >
            <Input
              class="w120x"
              v-model="siteConfig.lotteryBetMax"
              placeholder="请输入"
            />
          </FormItem>
          <FormItem
            label="是否需要打码"
            :class="this.class"
            prop="withdrawalsMultiple"
          >
            <Select
              v-model="siteConfig.withdrawalsMultiple"
              class="w120x fontColor"
            >
              <Option value="1" class="fontColor">是</Option>
              <Option value="0" class="fontColor">否</Option>
            </Select>
            <Poptip trigger="hover" placement="right-end">
              <div slot="content">
                <p>当需要打码时,打码倍数默认为1</p>
              </div>
              <Icons
                type="bangzhutishi"
                :size="20"
                color="#E4E4E4"
                class="ib ml5"
              ></Icons>
            </Poptip>
          </FormItem>
          <FormItem
            :class="this.class"
            label="银行转账最低"
            prop="paymentLimit"
          >
            <Input
              class="w120x"
              v-model="siteConfig.paymentLimit"
              placeholder="最低存款"
            />
          </FormItem>
          <FormItem :class="this.class" label="运营模式">
            <Select class="w120x fontColor" v-model="siteConfig.site_model">
              <Option value="invite_link" class="fontColor">邀请链接</Option>
              <Option value="invite_code" class="fontColor">邀请码</Option>
            </Select>
          </FormItem>
          <!-- <FormItem :class="this.class" label=" USDT存款汇率" prop="usdtDepositRate"> -->
          <FormItem :class="this.class" label=" USDT存款汇率">
            <Input
              placeholder="请输入"
              class="w120x"
              v-model="siteConfig.usdtDepositRate"
            />
          </FormItem>
          <FormItem
            :class="this.class"
            label="彩票最低下注"
            prop="lotteryBetMin"
          >
            <Input
              placeholder="请输入"
              class="w120x"
              v-model="siteConfig.lotteryBetMin"
            />
          </FormItem>
          <FormItem
            :class="this.class"
            label="取款金额<="
            prop="checkBetAmount"
          >
            <Input
              :placeholder="
                screen < 1600 ? '0或空需审核打码' : '0或空表示需要审核打码'
              "
              :class="screen < 1600 ? 'w128x' : 'w165x'"
              v-model="siteConfig.checkBetAmount"
            />
            <span class="pl5">且</span>
          </FormItem>
          <FormItem
            label="利润占比<="
            prop="moneyProportion"
            :class="this.class"
            class="clearfix aa"
          >
            <Input v-model="siteConfig.moneyProportion" class="w100x fl">
              <span slot="append">%</span>
            </Input>
            <Poptip
              trigger="hover"
              placement="top"
              class="fl"
              width="500"
              word-wrap
            >
              <div slot="content">
                <p>
                  线上取款时，单笔取款金额在设定金额及以下且利润占比小于等于设定占比时，线上取款为注单审核通过状态，可不审核打码
                </p>
                <p>
                  单笔取款金额大于设定金额切利润占比大于设定占比时，线上取款为待审核状态，需审核打码
                </p>
                <p>注：利润占比=(历史总存-历史总取)/总存款*100%</p>
              </div>
              <Icons
                type="bangzhutishi"
                :size="20"
                color="#E4E4E4"
                class="pl5"
              ></Icons>
            </Poptip>
          </FormItem>
          <FormItem
            :class="this.class"
            label="最低取款"
            prop="withdrawalsLimit"
          >
            <Input
              placeholder="请输入"
              class="w120x"
              v-model="siteConfig.withdrawalsLimit"
            />
          </FormItem>
          <FormItem :class="this.class" label=" USDT取款汇率">
            <Input
              placeholder="请输入"
              class="w120x"
              v-model="siteConfig.usdtWithdrawalsRate"
            />
          </FormItem>
          <FormItem :class="this.class" label=" USDT最低存款">
            <Input
              placeholder="请输入"
              class="w120x"
              v-model="siteConfig.usdtMinDeposit"
            />
          </FormItem>
          
          <FormItem :class="this.class" label="存款优惠" class="clearfix" style="display:flex;align-items:center;margin-top:-3px" >
            <div class="red-font ib" style="margin-left:-80px;vertical-align:center;display:flex;justify-content:center;align-items:center">
              <span style="margin-top:6px">*</span>
              <span
                class="blue-font ib ib ml70"
                @click="showSetting"
                >优惠设置</span
              >
            </div>
          </FormItem>
          <FormItem :class="this.class" label="充值前驗證手機" class="clearfix" style="display:flex;align-items:center;margin-top:-3px" >
            <Switch v-model="siteConfig.depositPhoneValidate" true-value="on" false-value="off" />
          </FormItem>
          <FormItem :class="this.class" label="充值前驗證銀行卡" class="clearfix" style="display:flex;align-items:center;margin-top:-3px" >
            <Switch v-model="siteConfig.depositBankValidate" true-value="on" false-value="off" />
          </FormItem>
        </div>
        <FormItem label="注册配置" class="pt30 bt register">
          <div class="b">
            <ButtonGroup class="mt20 ml20">
              <Button
                v-for="(t, i) in btnList"
                :key="'btn' + i"
                class="fontColor"
                :class="currentBtn == t.value ? 'bd-bg mr20' : 'bg-or mr20'"
                @click="
                  () => {
                    currentBtn = t.value;
                  }
                "
              >
                <span>{{ t.name }}</span>
              </Button>
            </ButtonGroup>
            <!-- pc -->
            <CheckboxGroup
              v-show="currentBtn == 'pc'"
              style="marginleft: 50px"
              class="mt20 mb20"
              @on-change="changeGroup"
              v-model="checkedArr.pc"
            >
              <Checkbox class="ml10" label="phone" v-if="showPhone"
                >手机</Checkbox
              >
              <Checkbox class="ml10" label="phone" v-if="!showPhone" disabled
                >手机</Checkbox
              >
              <Checkbox class="ml10" label="sms" disabled v-if="showInput"
                >短信验证</Checkbox
              >
              <Checkbox class="ml10" label="sms" v-if="!showInput"
                >短信验证</Checkbox
              >
              <Checkbox class="ml10" label="email">邮箱</Checkbox>
              <Checkbox class="ml10" label="wechat">微信</Checkbox>
              <Checkbox class="ml10" label="realName">真实姓名</Checkbox>
              <Checkbox class="ml10" label="payPassword">支付密码</Checkbox>
              <Checkbox class="ml10" label="registerOnOff">注册开关</Checkbox>
            </CheckboxGroup>
            <!-- h5 -->
            <CheckboxGroup
              v-show="currentBtn == 'h5'"
              style="marginleft: 50px"
              class="mt20 mb20"
              v-model="checkedArr.h5"
              @on-change="changeGroup1"
            >
              <Checkbox class="ml10" label="phone" v-if="showPhone1"
                >手机</Checkbox
              >
              <Checkbox class="ml10" label="phone" v-if="!showPhone1" disabled
                >手机</Checkbox
              >
              <Checkbox class="ml10" label="sms" disabled v-if="showInput1"
                >短信验证</Checkbox
              >
              <Checkbox class="ml10" label="sms" v-if="!showInput1"
                >短信验证</Checkbox
              >
              <Checkbox class="ml10" label="email">邮箱</Checkbox>
              <Checkbox class="ml10" label="wechat">微信</Checkbox>
              <Checkbox class="ml10" label="realName">真实姓名</Checkbox>
              <Checkbox class="ml10" label="payPassword">支付密码</Checkbox>
              <Checkbox class="ml10" label="registerOnOff">注册开关</Checkbox>
            </CheckboxGroup>
            <CheckboxGroup
              v-show="currentBtn == 'app'"
              style="marginleft: 50px"
              class="mt20 mb20"
              @on-change="changeGroup2"
              v-model="checkedArr.app"
            >
              <Checkbox class="ml10" label="phone" v-if="showPhone2"
                >手机</Checkbox
              >
              <Checkbox class="ml10" label="phone" v-if="!showPhone2" disabled
                >手机</Checkbox
              >
              <Checkbox class="ml10" label="sms" disabled v-if="showInput2"
                >短信验证</Checkbox
              >
              <Checkbox class="ml10" label="sms" v-if="!showInput2"
                >短信验证</Checkbox
              >
              <Checkbox class="ml10" label="email">邮箱</Checkbox>
              <Checkbox class="ml10" label="wechat">微信</Checkbox>
              <Checkbox class="ml10" label="realName">真实姓名</Checkbox>
              <Checkbox class="ml10" label="payPassword">支付密码</Checkbox>
              <Checkbox class="ml10" label="registerOnOff">注册开关</Checkbox>
            </CheckboxGroup>
          </div>
        </FormItem>
        <FormItem label="登陆注册验证配置" class="pt30 register">
          <div class="b">
            <div style="width: 1000px">
              <ButtonGroup class="mt20 ml20">
                <Button
                  v-for="(t, i) in loginList"
                  :key="'loginbtn' + i"
                  class="fontColor"
                  :class="showBtn == t.value ? 'bd-bg mr20' : 'bg-or mr20'"
                  @click="
                    () => {
                      showBtn = t.value;
                    }
                  "
                >
                  <span>{{ t.name }}</span>
                </Button>
              </ButtonGroup>
            </div>
            <RadioGroup
              v-show="showBtn == 'pc'"
              class="mt20 mb20 ib ml20"
              v-model="checkedLogin.pc"
            >
              <Radio class="ml10" label="imgCode">图像验证码</Radio>
              <!-- <Radio class="ml10" label="tCode">滑动验证</Radio> -->
              <Radio class="ml10" label="wyCode">滑动</Radio>
              <Radio class="ml10" label="yiDunText">文字点选</Radio>
              <Radio class="ml10" label="yiDunImage">图标点选</Radio>
              <Radio class="ml10" label="yiDunInference">推理拼图</Radio>
              <Radio class="ml10" label="smartMode">智能验证</Radio>
            </RadioGroup>
            <!-- h5 -->
            <RadioGroup
              v-show="showBtn == 'h5'"
              class="mt20 mb20 ib ml20"
              v-model="checkedLogin.h5"
            >
              <Radio class="ml10" label="imgCode">图像验证码</Radio>
              <!-- <Radio class="ml10" label="tCode">滑动验证</Radio> -->
              <Radio class="ml10" label="wyCode">滑动</Radio>
              <Radio class="ml10" label="yiDunText">文字点选</Radio>
              <Radio class="ml10" label="yiDunImage">图标点选</Radio>
              <Radio class="ml10" label="yiDunInference">推理拼图</Radio>
              <Radio class="ml10" label="smartMode">智能验证</Radio>
            </RadioGroup>
            <RadioGroup
              v-show="showBtn == 'app'"
              class="mt20 mb20 ib ml20"
              v-model="checkedLogin.app"
            >
              <Radio class="ml10" label="imgCode">图像验证码</Radio>
              <!-- <Radio class="ml10" label="tCode">滑动验证</Radio> -->
              <Radio class="ml10" label="wyCode">滑动</Radio>
              <Radio class="ml10" label="yiDunText">文字点选</Radio>
              <Radio class="ml10" label="yiDunImage">图标点选</Radio>
              <Radio class="ml10" label="yiDunInference">推理拼图</Radio>
              <Radio class="ml10" label="smartMode">智能验证</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem label="客服链接" class="kefu">
          <Tables
            :value="table.data"
            :columns="table.columns"
            :more="true"
            style="width: 80%"
            :page="false"
          >
            <div slot="footer">
              <a
                class="db-ma w120x"
                @click="addService"
                :style="{ display: showAdd ? 'block' : 'none' }"
                >添加客服</a
              >
            </div>
          </Tables>
        </FormItem>
        <!-- <FormItem label="VIP系统URL" class="kefu">
          <Tables
            :value="artificial.data"
            :columns="artificial.columns"
            :more="true"
            style="width: 80%"
            :page="false"
          >
            <div slot="footer">
              <a
                class="db-ma w120x"
                @click="addArtificial"
                :style="{ display: showArtificial ? 'block' : 'none' }"
                >添加客服</a
              >
            </div>
          </Tables>
        </FormItem> -->
        <FormItem label="客户端配置" class="khd mt20">
          <div class="b mb20">
            <ButtonGroup class="ml15 mt15">
              <Button
                v-for="(t, i) in setBtnList"
                class="fontColor"
                :key="'setBtn' + i"
                :class="sysBtn == t.value ? 'bd-bg mr20' : 'bg-or mr20'"
                @click="
                  () => {
                    sysBtn = t.value;
                  }
                "
              >
                <span>{{ t.name }}</span>
              </Button>
            </ButtonGroup>
            <Form
              v-show="sysBtn == 'logo'"
              style="width: 60%"
              class="ml25 mt20 mb20"
            >
              <Uploads
                ref="uploadsCom"
                v-for="item in [
                  { ...imageConfig, showType: 'pc' },
                  { ...imageConfig, showType: 'mobile' },
                ]"
                :key="'showType' + item.showType"
                v-bind="item"
                :showType="item.showType"
                @on-success="uploadSuccess"
                @overSize="handleMaxSize"
                @on-format-error="handleFormatError"
                :editPic="$route.query.page == 'edit' ? imageShow : {}"
              ></Uploads>
            </Form>
            <!-- android -->
            <Form v-show="sysBtn == 'android'" class="mt25" :label-width="130">
              <FormItem label="版本号" class="ib w30">
                <Input
                  placeholder="请输入版本号"
                  class="w260x"
                  v-model="Android.version"
                />
              </FormItem>
              <FormItem label="下载链接" class="ib w30">
                <Input
                  placeholder="请输入下载链接"
                  class="w260x"
                  v-model="Android.link"
                />
              </FormItem>
              <FormItem label="提示文字" class="ib w30">
                <Input
                  placeholder="请输入提示文字"
                  class="w260x"
                  v-model="Android.tip"
                />
              </FormItem>
              <FormItem label="更新类型" class="ib w30">
                <RadioGroup v-model="Android.type">
                  <Radio label="yes">
                    <span>强制更新</span>
                  </Radio>
                  <Radio label="no">
                    <span>不更新</span>
                  </Radio>
                  <Radio label="selectivity">
                    <span>选择性更新</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="官方域名" class="ib w30">
                <Input
                  placeholder="请输入官方域名"
                  class="w260x"
                  v-model="Android.offcial_domain"
                />
              </FormItem>
            </Form>
            <!-- ios -->
            <Form v-show="sysBtn == 'ios'" class="mt25" :label-width="130">
              <FormItem label="版本号" class="ib w30">
                <Input
                  placeholder="请输入版本号"
                  class="w260x"
                  v-model="IOS.version"
                />
              </FormItem>
              <FormItem label="提示文字" class="ib w30">
                <Input
                  placeholder="请输入提示文字"
                  class="w260x"
                  v-model="IOS.tip"
                />
              </FormItem>
              <FormItem label="更新类型" class="ib w30">
                <RadioGroup v-model="IOS.type">
                  <Radio label="yes">
                    <span>强制更新</span>
                  </Radio>
                  <Radio label="no">
                    <span>不更新</span>
                  </Radio>
                  <Radio label="selectivity">
                    <span>选择性更新</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="下载链接" class="ib w30">
                <Input
                  placeholder="请输入下载链接"
                  class="w260x"
                  v-model="IOS.link"
                />
              </FormItem>
              <FormItem label="助手App" class="ib w30">
                <Input
                  placeholder="如：http：//www.123.com"
                  class="w260x"
                  v-model="IOS.helper_link"
                />
              </FormItem>
              <FormItem label="网页App" class="ib w30">
                <Input
                  placeholder="如：http：//www.123.com"
                  class="w260x"
                  v-model="IOS.website_app_link"
                />
              </FormItem>
              <FormItem
                class="ib w30"
                label="下载方式"
                style="margin-left: 140px"
              >
                <Select
                  placeholder="请选择下载方式"
                  class="w260x"
                  v-model="siteConfig.downloadType"
                  clearable
                >
                  <Option value="enterpriseSign">企业签</Option>
                  <Option value="superSign">超级签</Option>
                  <Option value="testflight">testflight</Option>
                </Select>
              </FormItem>
              <FormItem class="ib w30" label="掉签向导">
                <Input
                  placeholder="请输入掉签向导"
                  class="w260x"
                  v-model="IOS.open_guide"
                />
              </FormItem>
                <FormItem class="ib w30" label="超级签链接">
                <Input
                  placeholder="请输入超级签链接"
                  class="w260x"
                  v-model="IOS.supersignLink"
                />
              </FormItem>
               <FormItem class="ib w30" style="margin-left: 140px" label="企业签链接">
                <Input
                  placeholder="请输入企业签链接"
                  class="w260x"
                  v-model="IOS.enterprisesignLink"
                />
              </FormItem>
               <FormItem class="ib w30" label="testflight链接">
                <Input
                  placeholder="请输入testflight链接"
                  class="w260x"
                  v-model="IOS.testflightLink"
                />
              </FormItem>
               <FormItem class="ib w30" label="官方域名">
                <Input
                  placeholder="请输入官方域名"
                  class="w260x"
                  v-model="IOS.offcial_domain"
                />
              </FormItem>
              
            </Form>
            <Form v-show="sysBtn == 'other'" class="mt25" :label-width="130">
              <div>
                <FormItem label="主题" class="ib w30">
                  <Select class="w260x fontColor" v-model="siteConfig.theme">
                    <Option
                      class="fontColor"
                      v-for="(t, i) in systemList"
                      :key="'system' + i"
                      :value="t.key"
                      >{{ t.val }}</Option
                    >
                  </Select>
                </FormItem>
                <FormItem label="开奖推送方式" class="w30 ib">
                  <Select
                    class="w260x fontColor"
                    v-model="siteConfig.lotteryOpenUpdateModel"
                  >
                    <Option value="http" class="fontColor">普通模式</Option>
                    <Option value="websocket" class="fontColor"
                      >快速模式</Option
                    >
                  </Select>
                </FormItem>
                <FormItem label="API线路" class="ib w30">
                  <Select class="w260x" v-model="siteConfig.apiLine">
                    <Option value="default">默认</Option>
                    <Option value="backUp1">备用1</Option>
                    <Option value="backUp2">备用2</Option>
                    <Option value="github">Github</Option>
                    <Option value="gameDun">游戏盾</Option>
                  </Select>
                </FormItem>
              </div>
              <div>
                <FormItem label="落地页链接" class="w30 ib">
                  <Input
                    class="w260x fontColor"
                    v-model="siteConfig.landing_page"
                    type="text"
                    placeholder="例如 aa.com"
                  />
                </FormItem>
                <FormItem label="静态资源路径" class="ib w30">
                  <Input
                    class="w260x"
                    placeholder="请输入静态资源路径"
                    v-model="siteConfig.statics"
                  />
                </FormItem>
                <FormItem label="APP域名" class="ib w30">
                  <Input
                    class="w260x"
                    placeholder="多个请用竖线隔开,例如aa.com|bb.com"
                    v-model="siteConfig.app_domain"
                  />
                </FormItem>
             
              </div>
              <div>
                <FormItem
                  class="ib w30"
                  style="margin-left: 140px"
                  label="IOS图标"
                >
                  <Input
                    class="w260x"
                    placeholder="请输入IOS图标"
                    v-model="siteConfig.iosIcon"
                  />
                </FormItem>

                <FormItem class="ib w30" label="Android图标">
                  <Input
                    class="w260x"
                    placeholder="请输入Android图标"
                    v-model="siteConfig.androidIcon"
                  />
                </FormItem>
                <FormItem class="ib w30" label="反作弊">
                  <Switch v-model="siteConfig.antiCheatSystem" />
                </FormItem>
                     <FormItem label="热更新域名" class="ib w30"  style="margin-left: 140px">
                  <Input
                    class="w260x"
                    placeholder="请输入热更新域名，多个以请以|区分"
                    v-model="siteConfig.hot_update_domain"
                  />
                </FormItem>
                 
                  <FormItem label="获取代理线方式" class="ib w30">
                <RadioGroup v-model="siteConfig.agent_line_type">
                  <Radio label="partner">
                    <span>第三方</span>
                  </Radio>
                  <Radio label="interface">
                    <span>粘贴板/接口</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
                <FormItem label="H5域名" class="ib w30" >
                  <Input
                    class="w260x"
                    placeholder="cocos调用H5域名"
                    v-model="other.h5_url"
                  />
                </FormItem>
                 <FormItem label="导航域名" class="ib w30" style="margin-left: 140px" >
                  <Input
                    class="w260x"
                    placeholder="请输入导航域名(例abc.com|bbc.com)"
                    v-model="other.nav_domain"
                  />
                </FormItem>
                 <FormItem label="导航域名2" class="ib w30" >
                  <Input
                    class="w260x"
                    placeholder="请输入导航域名2(例abc.com|bbc.com)"
                    v-model="other.nav_domain2"
                  />
                </FormItem>
                 <FormItem label="导航域名3" class="ib w30"  >
                  <Input
                    class="w260x"
                    placeholder="请输入导航域名3(例abc.com|bbc.com)"
                    v-model="other.nav_domain3"
                  />
                </FormItem>
                  <FormItem label="热更新版本" class="ib w30"  style="margin-left: 140px" >
                  <Input
                    class="w260x"
                    placeholder="请输入热更新版本"
                    v-model="other.app_update_ver"
                  />
                </FormItem>
              </div>
            </Form>
          </div>
        </FormItem>
      </Form>
    </div>
    <div class="w140x" style="margin: 20px auto">
      <Button
        type="primary"
        class="w140x h50 ft20"
        @click="submit"
        :loading="$root.editBtnLoading"
        >{{ $route.query.siteListId ? "确认修改" : "确认添加" }}</Button
      >
    </div>
     <!-- @closeModal="closeModal" -->
    <Modals
      ref="showSetting"
      title="优惠设置"
      width="740"
      @closeModal="closeModal"
    >
      <div slot="content">
        <Form
          ref="settingTable"
          style="width: 720px"
          class="ml20 mr20"
          :label-width="80"
        >
          <FormItem>
            <div class="v2-search bb" style="margin-left: 20px">
              <ButtonGroup class="repay-button1" style="margin-bottom: 0.3px">
                <Button
                  @click.native="tabClick(t)"
                  class="fontColor"
                  v-for="(t, i) in depositList"
                  :key="i"
                  :class="tabName == t ? 'active' : ''"
                  >{{ t }}</Button
                >
              </ButtonGroup>
              <div class="fr mr40" v-if="tabName == '公司入款'">
                <span class="mr10">客户端显示</span>
                <Switch
                  size="large"
                  v-model="bankType"
                  @on-change="changeBankType"
                >
                  <span slot="open">正常</span>
                  <span slot="close">停用</span>
                </Switch>
              </div>
              <div class="fr mr40" v-if="tabName == 'USDT转账'">
                <span class="mr10">客户端显示</span>
                <Switch
                  size="large"
                  v-model="usdtType"
                  @on-change="changeUsdtType"
                >
                  <span slot="open">正常</span>
                  <span slot="close">停用</span>
                </Switch>
              </div>
            </div>
          </FormItem>
          <div class="ml20 mr40">
            <Tables
              v-if="tabName == '公司入款'"
              draggable
              :more="settingTable.table.more"
              :columns="settingTable.table.columns"
              :value="settingTable.table.data"
              :page="false"
            >
              <div slot="footer">
                <span
                  class="blue-font db txt-a w100x"
                  style="margin: auto"
                  @click="settingTableAdd(settingTable.table.data.length,'bank')"
                  >新增优惠</span
                >
              </div>
            </Tables>
            <!-- usdt优惠 -->
            <Tables
              v-if="tabName == 'USDT转账'"
              draggable
              :more="settingTable2.table.more"
              :columns="settingTable2.table.columns"
              :value="settingTable2.table.data"
              :page="false"
            >
              <div slot="footer">
                <span
                  class="blue-font db txt-a w100x"
                  style="margin: auto"
                  @click="settingTableAdd(settingTable2.table.data.length,'usdt')"
                  >新增优惠</span
                >
              </div>
            </Tables>
          </div>
          <div class="mt20 mb20">
            <Button
              type="primary"
              class="ivu-btn commonSubmit w120x db"
              style="margin: auto"
              @click.prevent="settingSave"
              >确认保存</Button
            >
          </div>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import RebateSelect from "_c/rebate-select";
import { getToken, rmRepeatItem, getUserType } from "@/libs/util";
import Tables from "_c/tables";
import Modals from "_c/modals";
import Icons from "_c/icons";
import { emptyRebateList } from "@/api/common";
import { mapMutations, mapActions, mapState } from "vuex";
import CommissionSelect from "_c/commission-select";
import Uploads from "../activeSum/components/uploads";
import {
  siteManagementDetail,
  siteManagementCreate,
  siteManagementUpdate,
  siteManagementDbId,
  siteManagementTheme,
  preferentialPaymentClass,
} from "@/api/system";
export default {
  name: "siteAdd",
  components: {
    RebateSelect,
    Tables,
    Icons,
    CommissionSelect,
    Uploads,
    Modals,
  },
  computed: {
    ...mapState({
      accessSite: (state) => state.user.accessSite,
    }),
  },
  data() {
    return {
      selectVal: "",
      selectIndex: "",
      bankType: false,
	    bankCount:0,
      usdtType: false,
      clientTypeBank: false,
      clientTypeUsdt: false,
      tabName: "公司入款",
      depositList: ["公司入款", "USDT转账"],
      adminType: getUserType(),
      mode: "",
      showPhone: true, //可以选
      showInput: true,
      showPhone1: true,
      showInput1: true,
      showPhone2: true,
      showInput2: true,
      disabled: true,
      count: 0,
      settingTable: {
        method: [],
        table: {
          more: true,
          data: [],
          columns: [
            {
              title: "优惠比例",
              align: "center",
              key: "preferential",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.preferential),
                      min: 1,
                      max: 100,

                      formatter: (value) =>
                        (this.settingTable.table.data[
                          params.index
                        ].preferential = value =/\d+(\.\d)?/g.exec(`${value}`)[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (val) => {
                        if (val) {
                          this.settingTable.table.data[
                            params.index
                          ].preferential = val;
                        }
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      style: {
                        paddingLeft: "5px",
                      },
                    },
                    "%"
                  ),
                ]);
              },
            },
            {
              title: "存款打码倍数",
              align: "center",
              key: "codeMultiples",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.codeMultiples),
                      min: 1,

                      formatter: (value) =>
                        (this.settingTable.table.data[
                          params.index
                        ].codeMultiples = value = /\d+(\.\d)?/g.exec(
                          `${value}`
                        )[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (e) => {
                        if (e) {
                          this.settingTable.table.data[
                            params.index
                          ].codeMultiples = e;
                        }
                      },
                    },
                  }),
                ]);
              },
            },
            {
              title: "后台默认",
              align: "center",
              key: "setSelection",
              render: (h, params) => {
                return h("div", [
                  h("radio", {
                    props: {
                      value: params.row.setSelection,
                    },
                    on: {
                      "on-change": (val) => {
                        params.row.setSelection = val;
                        this.selectChangeEvent(
                          params.row,
                          params.index,
                          "bankType"
                        );
                      },
                    },
                  }),
                ]);
              },
            },
            {
              title: "操作",
              align: "center",
              render: (h, params) => (
                <span
                  // style={{
                  // 	display:
                  // 		this.settingTable.table.data.length == 1
                  // 			? "none"
                  // 			: "inline-block",
                  // }}
                  class="blue-font"
                  onClick={() => {
                    this.settingTable.table.data.splice(params.index, 1);
                    this.bankCount--;
                    // this.count--;
                  }}
                >
                  删除
                </span>
              ),
            },
          ],
		
        },
      },
	    settingTableOff: {
        method: [],
        table: {
          more: true,
          data: [],
          columns: [
            {
              title: "优惠比例",
              align: "center",
              key: "preferential",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.preferential),
                      min: 1,
                      max: 100,
					//    /\d/g.exec(`${value}`)[0]
                    //   /\d+(\.\d)?/g.exec(`${value}`)[0]
                      formatter: (value) =>
                        (this.settingTable.table.data[
                          params.index
                        ].preferential = value = /\d+(\.\d)?/g.exec(`${value}`)[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (val) => {
                        if (val) {
                          this.settingTable.table.data[
                            params.index
                          ].preferential = val;
                        }
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      style: {
                        paddingLeft: "5px",
                      },
                    },
                    "%"
                  ),
                ]);
              },
            },
            {
              title: "存款打码倍数",
              align: "center",
              key: "codeMultiples",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.codeMultiples),
                      min: 1,

                      formatter: (value) =>
                        (this.settingTable.table.data[
                          params.index
                        ].codeMultiples = value = /\d+(\.\d)?/g.exec(
                          `${value}`
                        )[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (e) => {
                        if (e) {
                          this.settingTable.table.data[
                            params.index
                          ].codeMultiples = e;
                        }
                      },
                    },
                  }),
                ]);
              },
            },
			       {
              title: "后台默认",
              align: "center",
              key: "setSelection",
              render: (h, params) => {
				  // console.log(this.settingTable.table.data)
                return h("div", [
                  h("radio", {
                    props: {
                      value: params.row.setSelection,
                    },
                    on: {
                      "on-change": (val) => {
                        // console.log(val);
                        params.row.setSelection = val;
                        this.selectChangeEvent(
                          params.row,
                          params.index,
                          "bankType"
                        );
                      },
                    },
                  }),
                ]);
              },
            },
            {
              title: "操作",
              align: "center",
              render: (h, params) => (
                <span
                  // style={{
                  // 	display:
                  // 		this.settingTable.table.data.length == 1
                  // 			? "none"
                  // 			: "inline-block",
                  // }}
                  class="blue-font"
                  onClick={() => {
                    this.settingTable.table.data.splice(params.index, 1);

                    this.count--;
                    // console.log(this.count--);
                  }}
                >
                  删除
                </span>
              ),
            },
          ],
		
        },
      },
      settingTable2: {
        method: [],
        table: {
          more: true,
          data: [],
          columns: [
            {
              title: "优惠比例",
              align: "center",
              key: "preferential",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.preferential),
                      min: 1,
                      max: 100,
                      // editable:true,
                      //   disabled:"disabled",
                      // disabled:this.settingTable2.table.data.length == 1?'disabled':'',
					//   this.settingTable2.table.data[params.index].codeMultiples = value =
                      formatter: (value) =>(this.settingTable2.table.data[params.index].preferential = value = /\d+(\.\d)?/g.exec(`${value}`)[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (val) => {
                        if (val) {
                          this.settingTable2.table.data[
                            params.index
                          ].preferential = val;
                        }
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      style: {
                        paddingLeft: "5px",
                      },
                    },
                    "%"
                  ),
                ]);
              },
            },
            {
              title: "存款打码倍数",
              align: "center",
              key: "codeMultiples",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.codeMultiples),
                      min: 1,
                      formatter: (value) => (this.settingTable2.table.data[params.index].codeMultiples = value = /\d+(\.\d)?/g.exec(`${value}`)[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (e) => {
                        if (e) {
                          this.settingTable2.table.data[
                            params.index
                          ].codeMultiples = e;
                        }
                      },
                    },
                  }),
                ]);
              },
            },
            {
              title: "后台默认",
              align: "center",
              key: "setSelection",
              render: (h, params) => {
                return h("div", [
                  h("radio", {
                    props: {
                      value: params.row.setSelection,
                    },
                    on: {
                      "on-change": (val) => {
                        // console.log(val);
                        params.row.setSelection = val;
                        this.selectChangeEvent(
                          params.row,
                          params.index,
                          "usdtType"
                        );
                      },
                    },
                  }),
                ]);
              },
            },
            {
              title: "操作",
              align: "center",
              render: (h, params) => (
                <span
                  // style={{
                  // 	display:
                  // 		this.settingTable2.table.data.length == 1
                  // 			? "none"
                  // 			: "inline-block",
                  // }}
                  class="blue-font"
                  onClick={() =>
                    this.settingTable2.table.data.splice(params.index, 1)
                  }
                >
                  删除
                </span>
              ),
            },
          ],
        },
      },
	    settingTable2Off: {
        method: [],
        table: {
          more: true,
          data: [],
          columns: [
            {
              title: "优惠比例",
              align: "center",
              key: "preferential",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.preferential),
                      min: 1,
                      max: 100,
                      // editable:true,
                      //   disabled:"disabled",
                      // disabled:this.settingTable2.table.data.length == 1?'disabled':'',
                      formatter: (value) =>
                        (this.settingTable2.table.data[
                          params.index
                        ].preferential = value =/\d+(\.\d)?/g.exec(`${value}`)[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (val) => {
                        if (val) {
                          this.settingTable2.table.data[
                            params.index
                          ].preferential = val;
                        }
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      style: {
                        paddingLeft: "5px",
                      },
                    },
                    "%"
                  ),
                ]);
              },
            },
            {
              title: "存款打码倍数",
              align: "center",
              key: "codeMultiples",
              render: (h, params) => {
                return h("div", [
                  h("InputNumber", {
                    props: {
                      value: Number(params.row.codeMultiples),
                      min: 1,

                      formatter: (value) =>
                        (this.settingTable2.table.data[
                          params.index
                        ].codeMultiples = value = /\d+(\.\d)?/g.exec(
                          `${value}`
                        )[0]),
                    },
                    style: {
                      display: "inline-block",
                      width: "70%",
                      margin: "auto",
                    },
                    on: {
                      "on-change": (e) => {
                        if (e) {
                          this.settingTable2.table.data[
                            params.index
                          ].codeMultiples = e;
                        }
                      },
                    },
                  }),
                ]);
              },
            },
            {
              title: "后台默认",
              align: "center",
              key: "setSelection",
              render: (h, params) => {
                return h("div", [
                  h("radio", {
                    props: {
                      value: params.row.setSelection,
                    },
                    on: {
                      "on-change": (val) => {
                        // console.log(val);
                        params.row.setSelection = val;
                        this.selectChangeEvent(
                          params.row,
                          params.index,
                          "usdtType"
                        );
                      },
                    },
                  }),
                ]);
              },
            },
            {
              title: "操作",
              align: "center",
              render: (h, params) => (
                <span
                  // style={{
                  // 	display:
                  // 		this.settingTable2.table.data.length == 1
                  // 			? "none"
                  // 			: "inline-block",
                  // }}
                  class="blue-font"
                  onClick={() =>
                    this.settingTable2.table.data.splice(params.index, 1)
                  }
                >
                  删除
                </span>
              ),
            },
          ],
        },
      },
      screen: screen.width,
      class: screen.width < 2000 ? "ib w20" : "ib w20",
      imageConfig: {
        headers: { Authorization: getToken() },
        action: "/api/v2/uploadImg",
        data: { siteId: this.$route.query.siteListId },
        name: "img",
      },
      timeOptions: {
        disabledDate: (date) =>
          date &&
          date.valueOf() < new Date(this.$root.todayStartTime()).getTime(),
      },
      imageShow: {},
      imageData: {},
      imageList: {},
      rateList: [],
      dbList: [],
      rebateData: [], //返点信息
      idExit: false, // 佣金是编辑还是新增
      siteInfo: { siteCode: "", siteName: "", dbid: "" }, //站点信息
      personal: false, //新加入的佣金模式
      showPersonal: false, //c模式无佣金设置
      platformDataList: {}, //佣金模式数据
      commission: {
        limit_amount: "",
        siteId: this.$route.query.siteListId,
        draw_money_num: "",
        total_amount: "",
        valid_member: "",
        deposit_amount: "",
        platform_config: "",
        total_bet: "",
        personal_commission_mode: "",
      },
      commissionRules: {
        limit_amount: [
          {
            required: true,
            message: "请输入转账金额",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的转账金额",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
            trigger: "blur",
          },
        ],
        draw_money_num: [
          {
            required: true,
            message: "请输入转账次数",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的转账次数",
            pattern: /^(([0-9]\d*))$/,
            trigger: "blur",
          },
        ],
        deposit_amount: [
          {
            required: true,
            message: "请输入单个会员存款",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的单个会员存款",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
            trigger: "blur",
          },
        ],
        valid_member: [
          {
            required: true,
            message: "请输入有效会员个数",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的有效会员个数",
            trigger: "blur",
            pattern: /^(([0-9]\d*))$/,
          },
        ],
        total_amount: [
          {
            required: true,
            message: "请输入总存款",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的总存款数",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
          },
        ],
        total_bet: [
          {
            required: true,
            message: "请输入总投注",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的总投注",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
          },
        ],
      },
      siteInfoRules: {
        siteCode: [
          { required: true, message: "请输入站点代号", trigger: "blur" },
          {
            pattern: /[a-z0-9]$/,
            message:
              "站点代号必须为2位，且以小写字母或数字开头，以小写字母或数字结尾",
            trigger: "blur",
          },
        ],
        siteName: [
          { required: true, message: "请输入站点名称", trigger: "blur" },
        ],
        dbid: [
          {
            required: true,
            message: "请选择服务器",
            trigger: "change",
            pattern: /.+/,
          },
        ],
      },
      openCount: 0, //存款优惠设置的接口调用
      systemList: [],
      // apiLine:'default',
      checkedLogin: {
        pc: "imgCode",
        h5: "imgCode",
        app: "imgCode",
      },
      siteConfig: {
        // dbid: "",
        agent_line_type:'partner',
        apiLine: "default",
        withdrawalsMultiple: "",
        k3Theme: "default",
        checkBetAmount: "",
        site_model: "invite_link",
        onlineForceAudit: "",
        paymentLimit: "",
        banner_pic_size_app: "",
        withdrawalsLimit: "",
        banner_pic_size_pc: "",
        paymentBonus: 0,
        activity_pic_size_app: "",
        lotteryBetMax: "",
        activity_pic_size_pc: "",
        lotteryBetMin: "",
        timeStart: "",
        timeEnd: "",
        tip: "",
        statics: "",
        app_domain: "",
        hot_update_domain:'',
        depositPhoneValidate: 'off',
        depositBankValidate: 'off',
        

        iosIcon: "",
        androidIcon: "",
        antiCheatSystem: false,
        theme: "default",
        lotteryOpenUpdateModel: "http",
        downloadType: "", //下载方式
        landing_page: "",
        transAmount: 10,
        moneyProportion: 100,
        preferential_config: "", //存款优惠配置
        // payments: "", //优惠支付方式
        usdtWithdrawalsRate: "", //取款汇率
        usdtMinDeposit: "", //最低存款数量
      }, //站点设置里的信息
      siteConfigRules: {
        usdtWithdrawalsRate: [
          {
            required: true,
            message: "请输入USDT取款汇率",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入数字,支持2位小数",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
          },
        ],
        usdtMinDeposit: [
          {
            required: true,
            message: "请输入USDT最低存款",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入数字,支持4位小数",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,4})?$/,
          },
        ],
        checkBetAmount: [
          {
            required: false,
            message: "请输入正确的待出款审核打码量",
            pattern: /^(([0-9]\d*))(\.\d{1,6})?$/,
            trigger: "blur",
          },
        ],
        withdrawalsMultiple: [
          {
            required: true,
            message: "请选择取款打码倍数",
            trigger: "change",
            pattern: /.+/,
          },
        ],
        k3Theme: [
          {
            required: true,
            message: "请选择快三样式",
            trigger: "change",
            pattern: /.+/,
          },
        ],
        paymentLimit: [
          {
            required: true,
            message: "请输入银行转账最低存款",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的银行转账最低存款",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
          },
        ],
        banner_pic_size_app: [
          {
            required: true,
            message: "请输入移动banner图尺寸",
            trigger: "blur",
          },
          {
            pattern: /^[1-9]{1}\d{1,3}(x)[1-9]{1}\d{1,3}$/,
            message: "请输入正确的格式",
            trigger: "blur",
          },
        ],
        withdrawalsLimit: [
          {
            required: true,
            message: "请输入最低取款",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的最低取款",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
          },
        ],
        banner_pic_size_pc: [
          {
            required: true,
            message: "请输入PC端banner图尺寸",
            trigger: "blur",
          },
          {
            pattern: /^[1-9]{1}\d{1,3}(x)[1-9]{1}\d{1,3}$/,
            message: "请输入正确的格式",
            trigger: "blur",
          },
        ],
        activity_pic_size_app: [
          {
            required: true,
            message: "请输入移动端活动图尺寸",
            trigger: "blur",
          },
          {
            pattern: /^[1-9]{1}\d{1,3}(x)[1-9]{1}\d{1,3}$/,
            message: "请输入正确的尺寸",
            trigger: "blur",
          },
        ],
        lotteryBetMax: [
          {
            required: true,
            message: "请输入彩票最高下注",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的彩票最高下注",
            trigger: "blur",
            pattern: /^(([1-9]\d*))$/,
          },
        ],
        activity_pic_size_pc: [
          { required: true, message: "请输入PC端活动图尺寸", trigger: "blur" },
          {
            pattern: /^[1-9]{1}\d{1,3}(x)[1-9]{1}\d{1,3}$/,
            message: "请输入正确的图片尺寸",
            trigger: "blur",
          },
        ],
        lotteryBetMin: [
          {
            required: true,
            message: "请输入彩票最低下注",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "彩票最低下注为整数，且不能小于1",
            trigger: "blur",
            pattern: /^(([1-9]\d*))$/,
          },
        ],
        transAmount: [
          {
            required: true,
            message: "请输入限制转账金额",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的限制转账金额",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
          },
        ],
        moneyProportion: [
          {
            required: true,
            message: "请输入利润占比",
            trigger: "blur",
            pattern: /.+/,
          },
          {
            message: "请输入正确的利润占比",
            trigger: "blur",
            pattern: /^(([0-9]\d*))(\.\d{1,5})?$/,
          },
        ],
      },
      newStatus: false, //维护状态
      btnList: [
        { name: "PC注册配置", value: "pc" },
        { name: "H5注册配置", value: "h5" },
        { name: "APP注册配置", value: "app" },
      ],
      loginList: [
        { name: "PC登录配置", value: "pc" },
        { name: "H5登录配置", value: "h5" },
        { name: "APP登录配置", value: "app" },
      ],
      setBtnList: [
        { name: "Android配置", value: "android" },
        { name: "IOS配置", value: "ios" },
        { name: "其他配置", value: "other" },
      ],
      checkList: [
        { name: "手机", value: "phone", checked: "true" },
        { name: "手机", value: "qq", checked: "false" },
        { name: "邮箱", value: "email", checked: "false" },
        { name: "微信", value: "wechat", checked: "false" },
        { name: "真实姓名", value: "realName", checked: "false" },
        { name: "支付密码", value: "payPassword", checked: "false" },
        { name: "注册开关", value: "registerOnOff", checked: "false" },
      ],
      currentBtn: "pc",
      showBtn: "pc",
      sysBtn: "android",
      checkedArr: {
        pc: [],
        h5: [],
        app: [],
      },

      checkedLoginSubmit: {},
      showAdd: true,
      showArtificial: true,
      table: {
        data: [],
        columns: [
          {
            title: "序号",
            align: "center",
            width: 60,
            render: (h, params) => <span>{params.index + 1}</span>,
          },
          {
            title: "地址",
            key: "url",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      display: params.row.show ? "block" : "none",
                    },
                  },
                  params.row.url
                ),
                h("Input", {
                  props: {
                    value: params.row.url,
                  },
                  style: {
                    display: params.row.show ? "none" : "block",
                    width: "90%",
                    margin: "0 auto",
                  },
                  on: {
                    "on-blur": (e) => {
                      this.table.data[params.index].url = e.target.value;
                    },
                  },
                }),
              ]);
            },
          },
          {
            title: "备注",
            key: "remark",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      display: params.row.showRemark ? "block" : "none",
                    },
                  },
                  params.row.remark
                ),
                h("Input", {
                  props: {
                    value: params.row.remark,
                  },
                  style: {
                    display: params.row.showRemark ? "none" : "block",
                    width: "90%",
                    margin: "0 auto",
                  },
                  on: {
                    "on-blur": (e) => {
                      this.table.data[params.index].remark = e.target.value;
                    },
                  },
                }),
              ]);
            },
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              return h("i-switch", {
                props: {
                  value: params.row.status == "on" ? true : false,
                },
                on: {
                  "on-change": (val) => {
                    this.table.data[params.index].status = val ? "on" : "off";
                  },
                },
              });
            },
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => {
              return (
                <div>
                  <a
                    style={{
                      marginRight: "10px",
                      display:
                        params.row.show && params.row.showRemark
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.$set(params.row, "show", !params.row.show);
                      this.$set(
                        params.row,
                        "showRemark",
                        !params.row.showRemark
                      );
                    }}
                  >
                    编辑
                  </a>
                  <a
                    style={{
                      marginRight: "10px",
                      display:
                        params.row.show && params.row.showRemark
                          ? "none"
                          : "inline-block",
                    }}
                    onClick={() => {
                      if (params.row.url) {
                        this.$set(params.row, "show", !params.row.show);
                        this.showAdd = true;
                      } else {
                        this.$Message.error("请填写正确的地址");
                        return false;
                      }

                      this.$set(
                        params.row,
                        "showRemark",
                        !params.row.showRemark
                      );
                    }}
                  >
                    确认
                  </a>
                  <a
                    onClick={() => {
                      this.table.data.splice(params.index, 1);
                      this.showAdd = true;
                    }}
                  >
                    删除
                  </a>
                </div>
              );
            },
          },
        ],
      },
      artificial: {
        data: [],
        columns: [
          {
            title: "序号",
            align: "center",
            width: 60,
            render: (h, params) => <span>{params.index + 1}</span>,
          },
          {
            title: "地址",
            key: "url",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      display: params.row.show ? "block" : "none",
                    },
                  },
                  params.row.url
                ),
                h("Input", {
                  props: {
                    value: params.row.url,
                  },
                  style: {
                    display: params.row.show ? "none" : "block",
                    width: "90%",
                    margin: "0 auto",
                  },
                  on: {
                    "on-blur": (e) => {
                      this.artificial.data[params.index].url = e.target.value;
                    },
                  },
                }),
              ]);
            },
          },

          {
            title: "状态",
            key: "status",
            align: "center",
            render: (h, params) => {
              return h("i-switch", {
                props: {
                  value: params.row.status == "on" ? true : false,
                },
                on: {
                  "on-change": (val) => {
                    this.artificial.data[params.index].status = val
                      ? "on"
                      : "off";
                  },
                },
              });
            },
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => {
              return (
                <div>
                  <a
                    style={{
                      marginRight: "10px",
                      display: params.row.show ? "inline-block" : "none",
                    }}
                    onClick={() => {
                      this.$set(params.row, "show", !params.row.show);
                    }}
                  >
                    编辑
                  </a>
                  <a
                    style={{
                      marginRight: "10px",
                      display: params.row.show ? "none" : "inline-block",
                    }}
                    onClick={() => {
                      if (params.row.url) {
                        this.$set(params.row, "show", !params.row.show);
                        this.showArtificial = true;
                      } else {
                        this.$Message.error("请填写正确的地址");
                      }
                    }}
                  >
                    确认
                  </a>
                  <a
                    onClick={() => {
                      this.artificial.data.splice(params.index, 1);
                      this.showArtificial = true;
                    }}
                  >
                    删除
                  </a>
                </div>
              );
            },
          },
        ],
      },
      Android: { version: "", link: "", type: "", tip: "" ,offcial_domain:''},
      IOS: {
        version: "",
        link: "",
        type: "",
        tip: "",
        helper_link: "",
        website_app_link: "",
        open_guide: "",
        supersignLink:'',
        enterprisesignLink:'',
        testflightLink:'',
        offcial_domain:''
      },
       other:{
           h5_url:'',
           nav_domain:'',
           nav_domain2:'',
           nav_domain3:'',
           app_update_ver:'',
         },
    };
  },
  created() {
    this.$nextTick(() => {
      const { siteListId } = this.$route.query;

      if (siteListId) {
        this.getDetailData({ id: siteListId });
      } else this.getEmptyRebate();
      if (siteListId) {
        // this.setBtnList.unshift({ name: "LOGO配置", value: "logo" });
        // this.sysBtn = "logo";
      }
    });
  },
  mounted() {
    this.$root.startEditLoading();

    this.getSystemList();
    this.$Message.config({ top: 100, duration: 1 });
    for (let i = 0; i < 51; i++) {
      this.rateList.push(i / 10);
    }
    this.accessSite.forEach((t) => {
      if (t.id == this.$route.query.siteListId)
        this.showPersonal = t.personal_commission_mode != "mode_c";
    });
    if (this.$route.query.page != "edit") {
      this.getdbList();
    }
  },
  methods: {
    ...mapMutations([
      "setAccess",
      "setDepositPreferentialType",
      "setPreferentialConfig",
    ]),
    ...mapActions(["getNewRoute"]),
    selectChangeEvent(row, index, type) {//单选一
      this.selectIndex = index;
      if (type == "bankType") {
        for (let i = 0; i < this.settingTable.table.data.length; i++) {
			// console.log(i)
          this.settingTable.table.data[i].setSelection = false;
        }
        this.settingTable.table.data[index].setSelection = row.setSelection;
        this.settingTable.table.data = JSON.parse( JSON.stringify(this.settingTable.table.data));
        if (row.setSelection) {
        //   console.log(this.settingTable.table.data[index]);
          this.selectVal = this.settingTable.table.data[index].setSelection;
        } else {
          this.selectVal = "";
        }
      }

      if (type == "usdtType") {
		   for (let i = 0; i < this.settingTable2.table.data.length; i++) {
          this.settingTable2.table.data[i].setSelection = false;
        }
        this.settingTable2.table.data[index].setSelection = row.setSelection;
        this.settingTable2.table.data = JSON.parse(JSON.stringify(this.settingTable2.table.data));
        if (row.setSelection) {
          // console.log(this.settingTable2.table.data[index]);
          this.selectVal = this.settingTable2.table.data[index].setSelection;
        } else {
          this.selectVal = "";
        }
      }
    },
    changeBankType(val) {//优惠比例控制开关按钮
      this.bankType = this.clientTypeBank = val;
	  if(this.bankType){
		  let arr=[];
		  this.settingTable.table.columns.forEach(t=>{if(t.key!="setSelection")arr.push(t);})
		  this.settingTable.table.columns = arr;
	  }else{
		   this.settingTable.table.columns=this.settingTableOff.table.columns;
	  }

	  if(this.settingTable.table.data&&JSON.stringify(this.settingTable.table.data).includes('true')){
		//  console.log('选中')
	   }else{
		//  console.log('无选中')
		 if(!this.bankType&&this.settingTable.table.data.length>0){
            this.settingTable.table.data[0].setSelection=true;
		 }
	 }
    },
    changeUsdtType(val) {
      this.usdtType = this.clientTypeUsdt = val;
		  if(this.usdtType){
		  let arr=[];
		  this.settingTable2.table.columns.forEach(t=>{
			if(t.key!="setSelection")arr.push(t);
		})
		  this.settingTable2.table.columns = arr;
	  }else{
		   this.settingTable2.table.columns=this.settingTable2Off.table.columns;
	  }

	  	 	 if(this.settingTable2.table.data&&JSON.stringify(this.settingTable2.table.data).includes('true')){
	
	 }else{
	
		 if(!this.usdtType&&this.settingTable2.table.data.length>0){

			 this.settingTable2.table.data[0].setSelection=true;
		 }
	 }
    },
    tabClick(t) {
      this.tabName = t;
    },
    changeGroup(value) {
      if (value.includes("phone" && "sms")) {
        this.showPhone = false; //，当勾选了短信之后，手机是必须勾选，手机勾选置灰 cici
      } else {
        this.showPhone = true;
      }
      if (value.includes("phone")) {
        this.showInput = false;
      } else {
        this.showInput = true;
      }
    },
    changeGroup1(value) {
      if (value.includes("phone" && "sms")) {
        this.showPhone1 = false;
      } else {
        this.showPhone1 = true;
      }
      if (value.includes("phone")) {
        this.showInput1 = false;
      } else {
        this.showInput1 = true;
      }
    },
    changeGroup2(value) {
      if (value.includes("phone" && "sms")) {
        this.showPhone2 = false;
      } else {
        this.showPhone2 = true;
      }
      if (value.includes("phone")) {
        this.showInput2 = false;
      } else {
        this.showInput2 = true;
      }
    },
    // 获取主题列表
    getSystemList() {
      siteManagementTheme().then((res) => {
        this.systemList = res.data;
      });
    },
    settingTableAdd(row,type) {
		// console.log(row)
      if (this.tabName == "公司入款") {
        if (this.settingTable.table.data == undefined) {
          this.settingTable.table.data = [];
        }

        this.settingTable.table.data.push({
          codeMultiples: row+1,
          preferential:row+1,
        });



	if(this.settingTable.table.data&&JSON.stringify(this.settingTable.table.data).includes('true')){
		//  console.log('选中')
	 }else{
		//  console.log('无选中')
		 if(!this.bankType&&this.settingTable.table.data.length>0){

			 this.settingTable.table.data[0].setSelection=true;
		 }
	 }

      }
      if (this.tabName == "USDT转账") {
		  // console.log(this.tabName)
		  // console.log(row)
        if (this.settingTable2.table.data == undefined) {
          this.settingTable2.table.data = [];
        }

        this.settingTable2.table.data.push({
          codeMultiples: 1+row,
          preferential: 2+row,
        });

		 	  	 	 if(this.settingTable2.table.data&&JSON.stringify(this.settingTable2.table.data).includes('true')){
		//  console.log('选中')
	 }else{
		//  console.log('无选中')
		 if(!this.usdtType&&this.settingTable2.table.data.length>0){

			 this.settingTable2.table.data[0].setSelection=true;
		 }
	 }
      }
    },
    settingSave() {
      //优惠设置确认保存
      // let reg = /^(([1-9]\d*))$/;
      //  console.log(this.settingTable.table.data )
      //   console.log(this.settingTable2.table.data )
      // if (this.settingTable.table.data == undefined) {
      //   this.settingTable.table.data = [];
      // }
      // if (this.settingTable2.table.data == undefined) {
      //   this.settingTable2.table.data = [];
      // }

      if (this.settingTable.table.data.length > 0) {
        for (let t of this.settingTable.table.data) {
          // if (!reg.test(t.codeMultiples)) {
          //   this.$Message.error("存款打码倍数需为正整数");
          //   return;
          // }

          if (t.preferential == null) {
            this.$Message.error("请设置优惠比例");
            return;
          }
        }

        let list1 = []; //没去重的打码倍数
        let list2 = []; // 去重的打码倍数
        this.settingTable.table.data.forEach((t) =>
          list1.push(t.codeMultiples)
        );
        list2 = rmRepeatItem(list1);

        if (list1.length > list2.length) {
          this.$Message.error("存款打码倍数为唯一值，不可重复");
          return false;
        }
      }else{
            this.settingTable.table.data = [];
      }
      if (this.settingTable2.table.data.length > 0) {
        for (let t of this.settingTable2.table.data) {
          // if (!reg.test(t.codeMultiples)) {
          //   this.$Message.error("存款打码倍数需为正整数");
          //   return;
          // }
          if (t.preferential == null) {
            this.$Message.error("请设置优惠比例");
            return;
          }
        }
        let list1 = []; //没去重的打码倍数
        let list2 = []; // 去重的打码倍数
        this.settingTable2.table.data.forEach((t) =>
          list1.push(t.codeMultiples)
        );
        list2 = rmRepeatItem(list1);
        if (list1.length > list2.length) {
          this.$Message.error("存款打码倍数为唯一值，不可重复");
          return false;
        }
      }else{
          this.settingTable2.table.data = [];
      }

	     //开启状态提示必填

		   
	  if((this.bankType==true&&this.settingTable.table.data.length<1)&&(this.usdtType==true&&this.settingTable2.table.data.length<1)){
		    this.$Tip.info({content:'请配置公司入款和USDT优惠'})
      	   return false  
	  }

	 	  if(this.bankType==true&&this.settingTable.table.data.length<1){
		   this.$Tip.info({content:'请配置公司入款优惠'})
      	   return false  
	  }
	   if(this.usdtType==true&&this.settingTable2.table.data.length<1){
		   this.$Tip.info({content:'请配置USDT优惠'})
      	   return false  
	  }
	

      this.$refs.showSetting.hide();
    },

    uploadSuccess(res, type, useType) {
      if (res.code === 200) this.imageList[type] = res.data.path;
    },
    handleFormatError(file) {
      this.$Tip.info({ content: "请上传图片" });
    },
    handleMaxSize(file) {
      this.$Message.error("上传图片体积最大为2M");
    },
    // 获取佣金模式的默认数据数据 重新归到站点详情接口
    getPlatformData(data) {
      let { info, platForm } = data;
      if (info.platform_config != null) {
        this.idExit = true;
        let {
          limit_amount,
          draw_money_num,
          total_bet,
          total_amount,
          valid_member,
          deposit_amount,
          id,
        } = info;
        this.commission.limit_amount = limit_amount;
        this.commission.draw_money_num = draw_money_num;
        this.commission.total_bet = total_bet;
        this.commission.total_amount = total_amount;
        this.commission.valid_member = valid_member;
        this.commission.deposit_amount = deposit_amount;
        this.commission.id = id;
        if (info.platform_config == null) {
          for (let key in platForm) {
            platForm[key].child_platform.forEach(
              (item) => (item.value = "0.00")
            );
          }
        } else {
          this.idExit = true;
          let obj = info.platform_config;
          for (let key in obj) {
            for (let y in platForm) {
              if (platForm[y].class_id == key) {
                platForm[y].child_platform.forEach((item) => {
                  for (let x in obj[key]) {
                    if (x == item.id) {
                      item.value = obj[key][x];
                    }
                  }
                });
              }
            }
          }
        }
      } else {
        this.idExit = false;
        delete this.commission.id;
        for (let key in platForm) {
          platForm[key].child_platform.forEach((item) => (item.value = 0));
        }
      }
      this.platformDataList = platForm;
      this.$root.endEditLoading();
    },
    // 获取空的彩票返点数据
    getEmptyRebate() {
      emptyRebateList().then((res) => {
        this.rebateData = res.data;
        this.rebateData.forEach((item) => {
          item.rebate = "1.50";
          item.parent_rebate = "3.00";
        });
      });
      this.$forceUpdate();
    },
    //银商链接
    addArtificial() {
      let obj = { url: "", status: "on", show: false };
      this.artificial.data.push(obj);
      this.showArtificial = false;
    },
    // 获取服务器列表
    getdbList() {
      siteManagementDbId().then((res) => {
        if (res != undefined && res.code == 200) this.dbList = res.data;
      });
    },
    // 点击添加客服
    addService() {
      let obj = {
        url: "",
        remark: "",
        status: "on",
        show: false,
        showRemark: false,
      };
      this.table.data.push(obj);
      this.showAdd = false;
    },

    closeModal() {
      // console.log(this.settingTable.table._data)
      if (this.settingTable.table._data != undefined) {
        this.settingTable.table.data =
          this.settingTable.table._data &&
          this.settingTable.table._data.length > 0
            ? JSON.parse(JSON.stringify(this.settingTable.table._data))
            : [];
      } else {
        this.settingTable.table.data = [];
      }
      if (this.settingTable2.table._data != undefined) {
        this.settingTable2.table.data =
          this.settingTable2.table._data &&
          this.settingTable2.table._data.length > 0
            ? JSON.parse(JSON.stringify(this.settingTable2.table._data))
            : [];
      } else {
        this.settingTable2.table.data = [];
      }
    },
    showSetting() {//优惠比例弹框
      this.openCount = ++this.openCount;
      // console.log(this.openCount)
      if(this.openCount == 1){

      }

      // if (this.openCount == 1) {
      //   preferentialPaymentClass().then((res) => {
      //     if (res != undefined && res.code == 200) {
      //       this.payMethod = res.data;
      //     }
      //   });
      // }
      this.tabName = "公司入款";
      this.$refs.showSetting.show();
	  //如果没有默认选中，则选择第一个
	  if(this.settingTable.table.data&&JSON.stringify(this.settingTable.table.data).includes('true')){}else{
		 if(!this.bankType&&this.settingTable.table.data.length>0){this.settingTable.table.data[0].setSelection=true;}
		}
	 	 if(this.settingTable2.table.data&&JSON.stringify(this.settingTable2.table.data).includes('true')){}else{
		 if(!this.usdtType&&this.settingTable2.table.data.length>0){ this.settingTable2.table.data[0].setSelection=true;}
	  }
    this.settingTable.table.data.sort( (a, b) => a.codeMultiples - b.codeMultiples);
    this.settingTable2.table.data.sort((a, b) => a.codeMultiples - b.codeMultiples);
    },
    //  获取编辑默认数据
    getDetailData(data) {
      siteManagementDetail(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.mode = res.data.personal_commission_mode;

            if (res.data.personal_commission_mode != "no") {
              this.personal = true;
              let newData = {
                platForm: res.data.platform,
                info: res.data.commission_info,
              };
              this.getPlatformData(newData);
            }
            if (
              res.data.logo_show &&
              Object.keys(res.data.logo_show).length > 0
            ) {
              this.imageShow = JSON.parse(JSON.stringify(res.data.logo_show));
              this.$refs.uploadsCom.editPic = this.imageShow;
            }
            if (res.data.logo && Object.keys(res.data.logo).length > 0)
              this.imageData = res.data.logo;
            this.commission.personal_commission_mode =
              res.data.personal_commission_mode;
            this.siteInfo.siteCode = res.data.siteCode;
            this.siteInfo.siteName = res.data.siteName;
            let { Android, IOS,other } = res.data.siteConfig;
            if (Android.length < 1)
              this.Android = { version: "", link: "", type: "", tip: "" ,offcial_domain:''};
                
            else this.Android = Android;
              // console.log(other.length)
               if(other){
                 this.other = other;
              }else{
                  this.other = { h5_url: "",nav_domain:'',nav_domain2:'',nav_domain3:'',app_update_ver:''};
              }
            //  console.log(other)
            if (IOS.length < 1)
              this.IOS = {
                version: "",
                link: "",
                type: "",
                tip: "",
                website_app_link: "",
                open_guide: "",
                supersignLink:'',
                enterprisesignLink:'',
                testflightLink:'',
                offcial_domain:'',
                helper_link: "",
              };
            else this.IOS = IOS;
            this.rebateData = res.data.rebate;
            this.rebateData.forEach((item) => {
              item.parent_rebate = "3.00";
            });
            let { close, service, labour_service } = res.data.siteConfig;
            service &&
              service.forEach(
                (item) => ((item.show = true), (item.showRemark = true))
              );
            labour_service && labour_service.forEach((t) => (t.show = true));
            this.newStatus = close.status == "on" ? true : false;
            this.checkedArr = res.data.siteConfig.register;
            if (res.data.siteConfig.VerificationCode != undefined) {
              for (let key in res.data.siteConfig.VerificationCode) {
                res.data.siteConfig.VerificationCode[
                  key
                ] = res.data.siteConfig.VerificationCode[key].join(",");
              }
              this.checkedLogin = res.data.siteConfig.VerificationCode;
            }

            // cici 手机号
            if (this.checkedArr && this.checkedArr != undefined) {
              if (
                this.checkedArr.pc.indexOf("sms") != -1 &&
                this.checkedArr.pc.indexOf("phone") != -1
              ) {
                this.showInput = false;
                this.showPhone = false;
              } else if (this.checkedArr.pc.indexOf("phone") != -1) {
                this.showInput = false;
              } else {
                this.showInput = true;
                this.showPhone = true;
              }

              if (
                this.checkedArr.h5.indexOf("sms") != -1 &&
                this.checkedArr.h5.indexOf("phone") != -1
              ) {
                this.showInput1 = false;
                this.showPhone1 = false;
              } else if (this.checkedArr.h5.indexOf("phone") != -1) {
                this.showInput1 = false;
              } else {
                this.showInput1 = true;
                this.showPhone1 = true;
              }

              if (
                this.checkedArr.app.indexOf("sms") != -1 &&
                this.checkedArr.app.indexOf("phone") != -1
              ) {
                this.showInput2 = false;
                this.showPhone2 = false;
              } else if (this.checkedArr.app.indexOf("phone") != -1) {
                this.showInput2 = false;
              } else {
                this.showInput2 = true;
                this.showPhone2 = true;
              }
            }

            // }
            this.table.data = service;
            this.artificial.data = labour_service || [];
            let {
              limit,
              k3Theme,
              site_model,
              statics,
              apiLine,
              app_domain,
               hot_update_domain,
               depositPhoneValidate,
               depositBankValidate,
              
               agent_line_type,
              iosIcon,
              androidIcon,
              antiCheatSystem,
              theme,
              lotteryOpenUpdateModel,
              downloadType,
              landing_page,
              // payments,
              preferential_config,
            } = res.data.siteConfig;
            // console.log(preferential_config)
            if (antiCheatSystem == "on") {
              antiCheatSystem = true;
            }
            if (antiCheatSystem == "off") {
              antiCheatSystem = false;
            }

            let {
              withdrawalsMultiple,
              checkBetAmount,
              onlineForceAudit,
              paymentLimit,
              withdrawalsLimit,
              paymentBonus,
              lotteryBetMax,
              lotteryBetMin,
              transAmount,
              moneyProportion,
              usdtDepositRate,
              usdtWithdrawalsRate,
              usdtMinDeposit,
            } = limit;
            let { timeEnd, tip } = close;

            this.siteConfig = {
              withdrawalsMultiple: withdrawalsMultiple != "0" ? "1" : "0",
              k3Theme,
              checkBetAmount,
              site_model,
              onlineForceAudit: onlineForceAudit || "",
              paymentLimit,
              withdrawalsLimit,
              paymentBonus: String(paymentBonus).includes("%")
                ? paymentBonus.split("%")[0]
                : paymentBonus,
              lotteryBetMax,
              lotteryBetMin,
              timeEnd,
              tip,
              statics,
              apiLine,
              app_domain,
              hot_update_domain,
              depositPhoneValidate: depositPhoneValidate ? depositPhoneValidate : 'off',
              depositBankValidate: depositBankValidate ? depositBankValidate : 'off',
            
               agent_line_type,
              iosIcon,
              androidIcon,
              antiCheatSystem,
              theme,
              lotteryOpenUpdateModel: lotteryOpenUpdateModel || "http",
              downloadType,
              landing_page,
              transAmount: transAmount || 10,
              moneyProportion: moneyProportion || 100,
              usdtDepositRate,
              usdtWithdrawalsRate,
              usdtMinDeposit,
            };
            //编辑默认
            this.settingTable.table.data = preferential_config[0].config;
            this.settingTable2.table.data = preferential_config[1].config;
            // preferential_config
            this.clientTypeBank = preferential_config[0].status;
            this.clientTypeUsdt = preferential_config[1].status;
            this.bankType = this.clientTypeBank == "on" ? true : false;
            this.usdtType = this.clientTypeUsdt == "on" ? true : false;
			if(this.bankType==true){
          let arr=[];
				 this.settingTable.table.columns.forEach(t=>{if(t.key!="setSelection")arr.push(t);})
		      this.settingTable.table.columns = arr;
			}else{
          this.settingTable.table.columns=this.settingTableOff.table.columns;
			}
			if(this.usdtType==true){
				   let arr=[];
				   this.settingTable2.table.columns.forEach(t=>{if(t.key!="setSelection")arr.push(t);})
		      this.settingTable2.table.columns = arr;
			}else{
            this.settingTable2.table.columns=this.settingTable2Off.table.columns;
			}
            this.settingTable.table.data.sort((a, b) => a.codeMultiples - b.codeMultiples);
            this.settingTable2.table.data.sort((a, b) => a.codeMultiples - b.codeMultiples );
            this.settingTable.table._data = JSON.parse(JSON.stringify(this.settingTable.table.data));
            this.settingTable2.table._data = JSON.parse(JSON.stringify(this.settingTable2.table.data));
          }
        })
        .catch(() => {
          this.$root.endEditLoading();
        });
    },
    onRebateChange(res) {
      this.siteConfig.rebateLotteryConfig = res;
    },
    // 成功后返回列表页
    goSiteList() {
      this.$router.push({
        name: "siteList",
      });
    },
    submit() {

      this.checkedLoginSubmit = JSON.parse(JSON.stringify(this.checkedLogin));
      for (let key in this.checkedLoginSubmit) {
        this.checkedLoginSubmit[key] = [this.checkedLoginSubmit[key]];
      }
 
      let arr = [];
      this.table.data.forEach((item) =>
        arr.push({ url: item.url, status: item.status, remark: item.remark })
      );
      let arr1 = [];
      this.artificial.data.forEach((t) => {
        arr1.push({ url: t.url, status: t.status });
      });
      let postData = {};
      let { siteCode, siteName, dbid } = this.siteInfo;
      if (this.newStatus) {
        if (this.siteConfig.timeEnd) {
          if (
            new Date(this.siteConfig.timeEnd).getTime() -
              new Date(this.siteConfig.timeStart).getTime() <
            1
          ) {
            this.$Message.error("结束时间必须大于开始时间");
            return false;
          }
        } else {
          this.$Message.error("请输入网站维护截止时间");
          return false;
        }
      }

      this.settingTable.table.data.forEach((t) => {
        delete t.initRowIndex;
      });
      this.settingTable2.table.data.forEach((t) => {
        delete t.initRowIndex;
      });

	  if(this.bankType==true){
		   this.settingTable.table.data.forEach((t) => {
         t.setSelection=false;
      });

	  }
	  if(this.usdtType==true){
		  	   this.settingTable2.table.data.forEach((t) => {
       t.setSelection=false;
      });

	  }

      this.siteConfig.preferential_config = JSON.stringify(
        this.settingTable.table.data
      );

      let newArr1 = [
        {
          depositType: "bank",
          status: this.bankType == true ? "on" : "off",
          config: this.settingTable.table.data,
        },
      ];
      let newArr2 = [
        {
          depositType: "usdt",
          status: this.usdtType == true ? "on" : "off",
          config: this.settingTable2.table.data,
        },
      ];

      //确认修改优惠提示’
	  	  if((this.bankType==true&&this.settingTable.table.data.length<1)&&(this.usdtType==true&&this.settingTable2.table.data.length<1)){
		    this.$Tip.info({content:'请配置公司入款和USDT优惠'})
      	   return false  
	  }



	  if(this.bankType==true&&this.settingTable.table.data.length<1){
		   this.$Tip.info({content:'请配置公司入款优惠'})
      	   return false  
	  }
	   if(this.usdtType==true&&this.settingTable2.table.data.length<1){
		   this.$Tip.info({content:'请配置USDT优惠'})
      	   return false  
	  }
	  

      let m = newArr1.concat(newArr2);
      this.siteConfig.preferential_config = JSON.stringify(m);

      let {
        k3Theme,
        withdrawalsMultiple,
        checkBetAmount,
        site_model,
        onlineForceAudit,
        paymentLimit,
        withdrawalsLimit,
        paymentBonus,
        lotteryBetMax,
        moneyProportion,
        lotteryBetMin,
        timeEnd,
        tip,
        statics,
        apiLine,
        app_domain,
         hot_update_domain,
         agent_line_type,
        iosIcon,
        androidIcon,
        antiCheatSystem,
        theme,
        lotteryOpenUpdateModel,
        downloadType,
        landing_page,
        transAmount,
        // payments,
        preferential_config,
        usdtDepositRate,
        usdtWithdrawalsRate,
        usdtMinDeposit,
        depositPhoneValidate,
        depositBankValidate
      } = this.siteConfig;
      if (onlineForceAudit) {
        if (this.$root.trimAll(onlineForceAudit).length > 0) {
          let reg = /^(([0-9]\d*))(\.\d{1,2})?$/;
          let num = this.$root.trimAll(onlineForceAudit);
          if (!reg.test(num)) {
            this.$Message.error("自动出款上限只能为数字");
            return false;
          } else
            this.siteConfig.onlineForceAudit = this.$root.trimAll(
              onlineForceAudit
            );
        } else return false;
      }
      postData = {
        siteCode,
        siteName,
        rebateLotteryConfig: this.siteConfig.rebateLotteryConfig,
        k3Theme,
        register: this.checkedArr,
        VerificationCode: this.checkedLoginSubmit,
        close: { status: this.newStatus ? "on" : "off", timeEnd, tip },
        limit: {
          paymentLimit,
          paymentBonus,
          lotteryBetMax,
          withdrawalsLimit,
          lotteryBetMin,
          withdrawalsMultiple,
          checkBetAmount,
          onlineForceAudit,
          transAmount,
          moneyProportion,
          usdtDepositRate,
          usdtWithdrawalsRate,
          usdtMinDeposit,
        },
        statics,
        apiLine,
        app_domain,
         hot_update_domain,
         agent_line_type,
        iosIcon,
        androidIcon,
        antiCheatSystem,
        theme,
        lotteryOpenUpdateModel,
        downloadType,
        landing_page,
        Android: this.Android,
        IOS: this.IOS,
        other:this.other,
        site_model: site_model || "invite_link",
        service: arr,
        labour_service: arr1,
        // payments,
        preferential_config,
        depositPhoneValidate,
        depositBankValidate

      };

      if (postData.close.timeEnd) {
        postData.close.timeEnd = this.$root.formatTimeS(postData.close.timeEnd);
      } else {
        postData.close.timeEnd = "";
      }
      let ag1, ag2, ag3, ag4;
      let ag5 = true;
      // 表单验证
      this.$refs.siteInfo.validate((valid) => {
        ag1 = valid;
      });

      this.$refs.siteConfig.validate((valid) => {
        ag2 = valid;
      });

      this.$refs.commission &&
        this.showPersonal &&
        this.$refs.commission.validate((valid) => {
          ag5 = valid;
        });
      if (
        Number(postData.limit.lotteryBetMax) <
        Number(postData.limit.lotteryBetMin)
      ) {
        ag4 = false;
        this.$Tip.info({ content: "彩票最高下注不能低于彩票最低下注" });
      } else ag4 = true;
      if (!postData.statics) {
        this.$Tip.info({ content: "静态资源路径必须填写" });
        ag3 = false;
      } else ag3 = true;

      if (ag1 && ag2 && ag3 && ag4 && ag5) {
        if (!postData.rebateLotteryConfig && this.$refs.rebateSelect)
          postData.rebateLotteryConfig = this.$refs.rebateSelect.createData();

        postData.register = JSON.stringify(postData.register);
        postData.VerificationCode = JSON.stringify(postData.VerificationCode);
        postData.close = JSON.stringify(postData.close);
        postData.k3Theme = postData.k3Theme ? postData.k3Theme : "default";
        postData.site_model = postData.site_model
          ? postData.site_model
          : "invite_link";
        postData.limit = JSON.stringify(postData.limit);
        postData.Android = JSON.stringify(postData.Android);
        postData.IOS = JSON.stringify(postData.IOS);
        postData.other=JSON.stringify(postData.other);
        postData.service = JSON.stringify(postData.service);
        postData.labour_service = JSON.stringify(postData.labour_service);
        postData.activity_pic_size = JSON.stringify(postData.activity_pic_size);
        postData.banner_pic_size = JSON.stringify(postData.banner_pic_size);

        if (postData.antiCheatSystem == false) {
          postData.antiCheatSystem = "off";
        }
        if (!postData.app_domain) delete postData.app_domain;
        if (!postData.hot_update_domain) delete postData.hot_update_domain;
        if (!postData.agent_line_type) delete postData.agent_line_type;
        // agent_line_type
        if (!postData.iosIcon) delete postData.iosIcon;
        if (!postData.androidIcon) delete postData.androidIcon;
        if (!postData.antiCheatSystem) delete postData.antiCheatSystem;

        // iosIcon,
        //             androidIcon,
        if (!postData.activity_pic_size) delete postData.activity_pic_size;
        if (!postData.banner_pic_size) delete postData.banner_pic_size;
        if (!postData.lotteryOpenUpdateModel)
          delete postData.lotteryOpenUpdateModel;
        if (!postData.downloadType) delete postData.downloadType;
        if (!postData.landing_page) delete postData.landing_page;
        // 编辑
        if (this.$route.query.siteListId) {
          postData.id = this.$route.query.siteListId;
          if (this.personal && this.showPersonal) {
            if (
              this.commission.platform_config == "" ||
              !this.commission.platform_config ||
              this.commission.platform_config == undefined
            )
              this.commission.platform_config = this.$refs.commissionSelect.createData();
          }
          // if (!this.showPersonal) {

          //   if(this.$refs.commissionSelect){
          //     this.commission.platform_config = this.$refs.commissionSelect.initData()
          //   }
          // }
          setTimeout(() => {
            let {
              personal_commission_mode,
              limit_amount,
              draw_money_num,
              total_bet,
              total_amount,
              valid_member,
              deposit_amount,
              platform_config,
            } = this.commission;
            postData.personal_commission_mode = personal_commission_mode;
            if (personal_commission_mode != "no") {
              if (this.idExit) postData.commission_mode_id = this.commission.id;
              else delete postData.commission_mode_id;
              postData.limit_amount = limit_amount;
              postData.draw_money_num = draw_money_num;
              postData.total_bet = total_bet;
              postData.total_amount = total_amount;
              postData.valid_member = valid_member;
              postData.deposit_amount = deposit_amount;
              postData.platform_config = platform_config;
              if (postData.platform_config == "") {
                postData.platform_config = JSON.stringify({});
              }
            }
            for (let key in this.imageData) {
              if (this.imageList[key] == undefined)
                this.imageList[key] = this.imageData[key];
            }
            if (Object.keys(this.imageList).length > 0)
              postData.logo = JSON.stringify(this.imageList);
            this.$root.startEditLoading();

            if (postData.antiCheatSystem) {
              if (postData.antiCheatSystem == true) {
                postData.antiCheatSystem = "on";
              }
              if (postData.antiCheatSystem == false) {
                postData.antiCheatSystem = "off";
              }
            }

            siteManagementUpdate(postData, true)
              .then((res) => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success("修改站点配置成功");
                  let list = JSON.parse(
                    JSON.stringify(JSON.parse(localStorage.accessSite))
                  );
                  this.setAccess(list);
                  this.setPreferentialConfig(
                    JSON.parse(this.siteConfig.preferential_config)
                  );

                  // this.getNewRoute()
                  this.goSiteList();
                }
                this.$root.endEditLoading();
              })
              .catch((error) => this.$root.endEditLoading());
          }, 200);
        } else {
          if (postData.antiCheatSystem) {
            if (postData.antiCheatSystem == true) {
              postData.antiCheatSystem = "on";
            } else {
              postData.antiCheatSystem = "off";
            }
          }
          postData.dbid = dbid;
        
          siteManagementCreate(postData, true)
            .then((res) => {
              if (res != undefined && res.code == 200) {
                this.$Message.success("创建站点成功");
                this.goSiteList();
              }
              this.$root.endEditLoading();
            })
            .catch((error) => this.$root.endEditLoading());
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
.ml135 {
  margin-left: 135px;
}
/deep/.ivu-form-item-error-tip {
  width: 200px !important;
}
/deep/.ivu-btn > span {
  vertical-align: 0;
}
.status-button {
  button {
    width: 130px !important;
    margin-left: 20px !important;
  }
}
.ivu-btn-group {
  button {
    height: 36px;
    line-height: 36px;
    padding: 0;
  }
}
.db-ma {
  display: block;
  margin: 0 auto;
}
/deep/.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  padding-left: 0;
}
.cancel {
  background: #a2a2a2;
  width: 140px;
  height: 50px;
  color: #ffffff;
  font-size: 1.0625rem /* 17/16 */;
}
.bd-bg {
  width: 180px;
  background-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.bg-or {
  width: 180px;
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
.person {
  &:not(:nth-child(1)) {
    border-top: 0;
  }
}
.content {
  &:nth-child(2) {
    border-left: none;
  }
}
/deep/.ivu-table .ivu-table-tip {
  height: auto !important;
  td {
    height: 48px;
  }
}
.register,
.kefu {
  /deep/.ivu-form-item-label {
    margin-top: 50px !important;
  }
}
/deep/.khd > .ivu-form-item-label {
  margin-top: 100px !important;
}

/deep/.ivu-table {
  color: #444;
}

/deep/.ivu-table-header {
  tr {
    th {
      .ivu-table-cell {
        font-size: 1rem;
        font-weight: 549;
      }
    }
  }
}
/deep/.ivu-input[disabled] {
  background-color: #fff !important;
  color: #444 !important;
}
.aa {
  /deep/.ivu-form-item-error-tip {
    margin-top: 37px;
  }
}
/deep/.ivu-form-item-content {
  margin-left: 0px !important;
}
/deep/.ivu-form-item {
  margin-bottom: 10px !important;
}
</style>

