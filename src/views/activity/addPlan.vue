
<template>
  <Form :label-width="80" :class="this.$route.query.page=='create'||(this.$route.query.page == 'edit'&&formKey.status=='close')?'':'ft_c8'">
    <FormItem label="红包组成" v-if="this.$route.query.page != 'look'">
      <div class="fr mr20 r10">
        <div class="clearfix">
          <span class="fl" style="line-height:38px">字段说明</span>
          <Poptip trigger="hover" placement="bottom-end" class="ml5 fl" :width='600'>
            <div slot="content" style="white-space: normal;">
              <div class="ft16 mb15">字段说明</div>
              <div class="mb15">1、红包组成:红包组成结构，至少选择一项。最大红包可不填"</div>
              <div class="mb15">2、生效时间:计划开始生效执行时间，业绩也是从该事件开始统计。</div>
              <div class="mb15">3、结束时间:计划结束时间，可有具体节点，也可选择长期有效。</div>
              <div class="mb15">4、发放节点:红包计算业绩的节点，间隔周期可依据情况选择。</div>
              <div class="mb15">5、发放方式:结算时间（中午12:30进行统一发放），随机发放（中午12:30至晚上22:00随机进行发放）</div>
              <div class="mb15">6、发放名目:游戏随机（当前用户停留在哪个游戏的投注页，则以哪个游戏的名目进行发放），指定游戏（以从指定游戏的列表中随机选择一个游戏的名目进行发放）</div>
              <div class="mb15">7、未领取红包处理:已发放的红包，如果用户在下一次红包结算的时候，还未领取时，对领取红包的处理方式。可累计，可失效。累计则未领取红包的金额累计至下一次红包金额一起发放。失效则红包未领取失效处理，不能再领取</div>
            </div>
            <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
          </Poptip>
        </div>
      </div>
      <Checkbox class="ml20 mb10" v-model="isBetting">
        <span class="ml5 ft_c4">投注红包</span>
      </Checkbox>
      <div class="ml20" v-for="(item,i) in formKey.betting_gift_rule" :key="'index'+i">
        <div class="v2-search" style="margin-bottom:0;">
          <div class="bb h62 lh62 w824x" style="border-bottom:0 !important">
            <Form inline class="mt12 ft" >
              <FormItem class="ml15" label="最低投注">
                <InputNumber
                  :value="Number(formKey.betting_gift_rule[i].min)||null"
                  class="w140x ml12"
                  :max="999999999"
                  :min='0'
                  :precision='0'
                  @on-change="value=>{formKey.betting_gift_rule[i].min=value}"
                  placeholder="输入整数金额"
                />
              </FormItem>
              <FormItem class="ml15" label="发放比例">
                <InputNumber
                  :value="Number(formKey.betting_gift_rule[i].proportion)||null"
                  class="w140x"
                  :max="100"
                  :min='0'
                  :step="0.1"
                  :formatter="value =>formKey.betting_gift_rule[i].proportion= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]"
                  placeholder="输入发放比例"
                />
                <span class="ml5">%</span>
              </FormItem>
              <FormItem class="ml15" label="最大红包">
                <InputNumber
                  :max="99999"
                  :min='0'
                  :value="Number(formKey.betting_gift_rule[i].max)||null"
                  @on-change="value=>{formKey.betting_gift_rule[i].max=value}"
                  class="w140x"
                  :precision='0'
                  placeholder="输入整数金额"
                />
              </FormItem>
              <FormItem class="ml5" v-if="formKey.betting_gift_rule.length>1">
                <Icon size="16" class="close" type="md-close" @click="bettingDel(i)" />
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="w824x h40x bb txt-a lh40 f4-bg mb20 ml20" @click="add">
        <Icons color="#62b1fd" type="tianjialunbotuanniu"></Icons>
        <span class="c62Color ml10">新增</span>
      </div>
      <Checkbox class="ml20 mb10" v-model="isNegative">
        <span class="ml5 ft_c4">负盈利红包</span>
      </Checkbox>
      <div class="ml20" v-for="(t,k) in  formKey.negative_profit_gift_rule" :key="k">
        <div class="v2-search" style="margin-bottom:0">
          <div class="bb h62 lh62 w824x" style="border-bottom:0">
            <Form inline class="mt12 ft">
              <FormItem class="ml15" label="最低负盈利">
                <InputNumber
                  class="w140x"
                  :max="999999999"
                  :min='0'
                  :precision='0'
                  :value="Number(formKey.negative_profit_gift_rule[k].min)||null"
                  @on-change="value=>{formKey.negative_profit_gift_rule[k].min=value}"
                  placeholder="输入整数金额"
                />
              </FormItem>
              <FormItem class="ml15" label="发放比例">
                <InputNumber
                  class="w140x"
                  :max="100"
                  :min='0'
                  :step="0.1"
                  :value="Number(formKey.negative_profit_gift_rule[k].proportion)||null"
                  :formatter="value =>formKey.negative_profit_gift_rule[k].proportion= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]"
                  placeholder="输入发放比例"
                />
                <span class="ml5">%</span>
              </FormItem>
              <FormItem class="ml15" label="最大红包" >
                <InputNumber
                  class="w140x"
                  :max="99999"
                  :min='0'
                  :precision='0'
                  :value="Number(formKey.negative_profit_gift_rule[k].max)||null"
                  @on-change="value=>{formKey.negative_profit_gift_rule[k].max=value}"
                  placeholder="输入整数金额"
                />
              </FormItem>
              <FormItem class="ml5" v-if="formKey.negative_profit_gift_rule.length>1">
                <Icon size="16" class="close" type="md-close" @click="negDel(k)" />
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="w824x ml20 h40x bb txt-a lh40 f4-bg" @click="negativeAdd">
        <Icons color="#62b1fd" type="tianjialunbotuanniu"></Icons>
        <span class="c62Color ml10">新增</span>
      </div>
    </FormItem>
    <FormItem label="红包组成" v-if="this.$route.query.page == 'look'">
      <div class="ml20">
        <P v-if="this.formKey.betting_gift_rule" class="ft_c4">投注红包</P>
        <div v-for="(item, i) in this.formKey.betting_gift_rule" :key="'betting' + i">
          <span class="w240x ib">最低投注 : {{item.min}}元</span>
          <span class="w240x ib">发放比例 : {{item.proportion}}%</span>
          <span class="w240x ib">最大红包 : {{item.max?item.max+'元':'-'}}</span>
        </div>
        <P v-if="this.formKey.negative_profit_gift_rule" class="ft_c4">负盈利红包</P>
        <div v-for="(item, i) in this.formKey.negative_profit_gift_rule" class="ft_c8" :key="'negative' + i">
          <span class="w240x ib">最低负利 : {{item.min}}元</span>
          <span class="w240x ib">发放比例 : {{item.proportion}}%</span>
          <span class="w240x ib">最大红包 : {{item.max?item.max+'元':'-'}}</span>
        </div>
      </div>
    </FormItem>
    <hr class="dotted mb20" />
    <FormItem label="生效时间" style="margin-bottom:0">
      <div class="v2-search">
        <Form inline>
          <FormItem
            :class="this.$route.query.page=='create'||(this.$route.query.page == 'edit'&&formKey.status=='close')?'ml5 ml20 ft':'ml5 ml20 ft_cr8'"
            label="生效时间"
          >
            <DatePicker
              v-if="this.$route.query.page == 'create'||(this.$route.query.page == 'edit'&&formKey.status=='close')"
              :disabled="(this.$route.query.page !='create'&&formKey.status!='close')?true:false"
              type="date"
              placeholder="开始日期"
              v-model="formKey.start_time"
              :options="options3"
              format="yyyy-MM-dd"
              @on-change="startTimeChange"
            ></DatePicker>
            <span v-else class="ib w260x ml20">{{this.$root.formatTimeS(formKey.start_time)}}</span>
          </FormItem>
          <FormItem
            label="结束时间"
            :class="this.$route.query.page=='create'||(this.$route.query.page == 'edit'&&formKey.status=='close')?'ml5 ml20 ft':'ft_cr8'"
          >
            <RadioGroup
              v-model="valid_time"
              v-if="this.$route.query.page == 'create'||(formKey.status=='close'&&this.$route.query.page == 'edit')"
              @on-change="changeValid"
            >
              <Radio label="长期有效"></Radio>
              <Radio label="结束时间"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <DatePicker
              v-if="this.$route.query.page == 'create'||(this.$route.query.page == 'edit'&&formKey.status=='close')"
              type="date"
              placeholder="结束日期"
              v-model="formKey.end_time"
              @on-change="endTimeChange"
              format="yyyy-MM-dd"
              :disabled="valid_time=='长期有效'?true:false"
              :options="startTimeOptions"
            ></DatePicker>
            <span v-else>{{formKey.end_time?this.$root.formatTimeS(lookEndTime*1000):'长期有效'}}</span>
          </FormItem>
        </Form>
      </div>
    </FormItem>
    <hr class="dotted" v-if="this.$route.query.page =='look'" />
    <FormItem label="状态" class="mt20" v-if="this.$route.query.page =='look'">
      <span
        class="ml20"
      >{{this.formKey.status=='open'?'启用':this.formKey.status=='close'?'待启用':'已结束'}}</span>
    </FormItem>
    <hr class="dotted" v-if="formKey.start_time" />
    <FormItem label="发放节点" class="mt20" v-if="formKey.start_time">
      <div class="v2-search" v-if="this.$route.query.page == 'create'||(this.$route.query.page == 'edit'&&formKey.status=='close')">
        <RadioGroup class="ml15" v-model="formKey.delivery_time_type">
          <Radio label="cycle">按周期</Radio>
          <Radio label="select_date">选择时间</Radio>
        </RadioGroup>
        <DatePicker
          class="noPic"
          type="date"
          placeholder="结束日期"
          v-model="formKey.delivery_time"
          :disabled="formKey.delivery_time_type == 'cycle'?true:false"
          :options="endTimeOptions"
          multiple
          @on-change="dataChange "
          format="yyyy-MM-dd"
        ></DatePicker>
      </div>
      <div
        class="w543x h62 bb ml20 mt20"
        style="line-height:62px;"
        v-if="formKey.delivery_time_type == 'cycle'&&(this.$route.query.page == 'create'||(this.$route.query.page=='edit'&&formKey.status=='close'))"
      >
        <span class="ml20 mr20">周期间隔</span>
        <RadioGroup style="display:inline-block" v-model="days">
          <Radio label="1">每天</Radio>
          <Radio label="3">3天</Radio>
          <Radio label="7">7天</Radio>
          <Radio label="自定义"></Radio>
        </RadioGroup>
        <InputNumber
          class="w90x txt-a"
          placeholder="输入天数"
          :max="999"
          :min="1"
          :precision='0'
          :value="Number(customDay)||null"
          @on-change="value=>{customDay=String(value)}"
          :disabled="days !='自定义'?true:false"
        /> 天
      </div>

      <div
        class="w543x bb ml20 mt20 pl10 pr10 pb10"
        style=" overflow: hidden;box-sizing:border-box "
        v-if="formKey.delivery_time_type == 'select_date'&&(this.$route.query.page == 'create'||(this.$route.query.page=='edit'&&formKey.status=='close'))"
      >
        <div class="ib txt-a mr10 w16 fl lh62" style="height:100%">
          <span>结算日期</span>
        </div>
        <div class="ib mt20" style="width:82%">
          <Button class="mr10 mb5 but w130x" v-for="(item ,i) in dateBut" :key="'date' + i">
            {{item}}
            <Icon size="16" class="close" type="md-close" @click="delDate(i)" />
          </Button>
        </div>
      </div>
      <!-- 编辑页面显示 查看-->
      <span
        class="ml20"
        v-if="formKey.delivery_time_type == 'cycle'&&this.$route.query.page != 'create'&&!(this.$route.query.page == 'edit'&&formKey.status=='close')"
      >每 {{this.formKey.delivery_time}} 天结算</span>
      <div
        class="w1055x ml20"
        v-if="formKey.delivery_time_type != 'cycle'&&this.$route.query.page != 'create'&&!(this.$route.query.page == 'edit'&&formKey.status=='close')"
      >
        <div class="ib" style="width:100%">
          <Button class="mb5 mr10 w130x ft_c8" v-for="(item ,i) in dateBut" :key="'btn' + i">{{item}}</Button>
        </div>
      </div>
    </FormItem>
    <hr class="dotted" />

    <FormItem label="发放方式" class="mt15">
      <RadioGroup
        class="ml20"
        v-model="formKey.delivery_type"
        v-if="this.$route.query.page == 'create'||(this.$route.query.page == 'edit'&&formKey.status=='close')"
      >
        <Radio label="settlementTime">结算时间</Radio>
        <Radio label="randomTime">随机发放</Radio>
      </RadioGroup>
      <Span
        class="ml20"
        v-else
      >{{this.formKey.delivery_type == 'settlementTime'?'结算时间':'随机发放'}}</Span>
    </FormItem>

    <hr class="mt20 dotted" />
    <FormItem label="发放名目" class="mt15">
      <div>
        <RadioGroup
          class="ml20 ft_c4"
          style="display:inline-block"
          v-model="formKey.show_content_type"
          v-if="this.$route.query.page != 'look'"
        >
          <Radio label="randomGameName">游戏随机</Radio>
          <Radio label="designationGameName">指定游戏</Radio>
        </RadioGroup>
        <Select
          class="w200x"
          :max-tag-count="1"
          v-if="this.$route.query.page != 'look'"
          :disabled="formKey.show_content_type == 'randomGameName'?true:false"
          v-model="content"
          placeholder="请选择游戏"
          multiple
        >
          <Option :value="item.name" v-for="item in gameList2" :key="item.name">{{item.name}}</Option>
        </Select>
      </div>
      <div
        class="w543x bb ml20 mt20 pl10 pr10 pb10"
        style=" overflow: hidden;box-sizing:border-box "
        v-if="formKey.show_content_type == 'designationGameName'&&this.$route.query.page != 'look'"
      >
        <div class="ib txt-a mr10 w16 fl lh62" style="height:100%">
          <span :class="this.$route.query.page!='look'?'ft_c4':''">指定游戏</span>
        </div>
        <div class="ib mt20" style="width:82%">
          <Button class="mr10 mb5 but w130x" v-for="(item ,i) in content" :key="i">
            {{item}}
            <Icon size="16" class="close" type="md-close" @click="delGame(i)" />
          </Button>
        </div>
      </div>
      <span
        class="ml20"
        v-if="this.$route.query.page == 'look'"
      >{{this.formKey.show_content_type=='randomGameName'?'游戏随机':'指定游戏'}}</span>
    </FormItem>
    <hr class="dotted" />
    <FormItem label="未领红包" class="mt15">
      <RadioGroup
        class="ml20"
        style="display:inline-block"
        v-model="formKey.not_acquired_handle"
        v-if="this.$route.query.page == 'create'||(this.$route.query.page == 'edit'&&formKey.status=='close')"
      >
        <Radio label="fail">失效</Radio>
        <Radio label="accumulation">累计</Radio>
      </RadioGroup>
      <span
        class="ml20"
        v-else
      >{{this.formKey.not_acquired_handle=='fail'?'失效':'累积'}}</span>
    </FormItem>
    <hr class="dotted" />
    <FormItem label="参与游戏" class="mt20">
      <ul class="bb lh62 w1055x ml20" v-if="this.$route.query.page == 'create'||(this.$route.query.page == 'edit'&&formKey.status=='close')">
        <li v-for="(item,t) in gameList" :key="t"
          :class="t >= (gameList.length - count) && t < gameList.length ? 'game bn' : 'game'"
        >
          <Checkbox-group v-model="game" class="ml15" @on-change="changeGame">
            <Checkbox :label="item.id">{{item.name}}</Checkbox>
          </Checkbox-group>
        </li>
      </ul>
      <ul class="w1055x" v-else>
        <li
        :key="i"
          v-for="(item,i) in formKey.GameList"
          class="ib ml20 w90x"
          style="color: #666666;"
        >{{item.name}}</li>
      </ul>
    </FormItem>
    <hr class="dotted" v-if="this.$route.query.page=='look'" />
    <FormItem label="配置时间" class="mt20" v-if="this.$route.query.page=='look'">
      <span class="ml20">{{this.$root.formatTime(this.formKey.created_at*1000) }}</span>
    </FormItem>
    <hr class="dotted" v-if="this.$route.query.page=='look'" />
    <FormItem label="发放详情" class="mt20" v-if="this.$route.query.page!='create'&&!(this.$route.query.page == 'edit'&&formKey.status=='close')">
      <div class="table" style="width:1055px;margin-left:20px">
        <ul class="ul1">
          <li v-for="item in grant" :key="item">{{item}}</li>
        </ul>
        <ul class="ul2">
          <li class="ft_cl" @click="OutDetails('receive')">{{table.receive_amount}}</li>
          <li class="ft_cl" @click="OutDetails('pending')">{{table.wait_gift}}</li>
          <li class="ft_cl" @click="OutDetails('fail')">{{table.fail_amount}}</li>
          <li>{{table.person_total}}</li>
        </ul>
      </div>
    </FormItem>
    <div style="margin-left:400px">
      <Button
        v-if="!(this.$route.query.page=='look'&&formKey.status=='finish')"
        class="w140x h50 mr20 ft18"
        :style="this.$route.query.page=='look'?'background:#2D8CF0;color:white':'background:#cdcdcd;color:white'"
        @click="change"
      >{{this.$route.query.page=='look'?'编辑':'取消'}}</Button>
      <Button class="w140x h50 mr20 ft18" type="primary" @click="submit">确认保存</Button>
    </div>
    <OutTheDetails ref="OutTheDetails"></OutTheDetails>
  </Form>
</template>
<script>
import Icons from "@/components/icons";
import OutTheDetails from "./components/outTheDetails";
import {
  gameList,
  hongYunAdd,
  hongYunEdit,
  hongYunUp,
  activityHongyundangtouGiveOutInfo
} from "@/api/activity";
import { format } from "path";
export default {
  name: "addPlan",
  components: { Icons, OutTheDetails },
  data() {
    return {
      // clickBtn:'',
      lookEndTime:'',
      count: 0, //最后一行数据
      content: [],
      gameList: [], //参与游戏列表
      gameList2: [], //指定游戏下列数据
      game: [], //选中游戏
      dateBut: [], //发放时间列表
      isBetting: true,
      isNegative: true,
      valid_time: "长期有效",
      days: "1", //周期天数,
      customDay: '', //自定义天数
      grant: ["发放金额", "待领取金额", "失效金额", "领取人数"],
      table: {},
      formKey: {
        gift_type: "negativeProfitAndBetting", //'红包组成类型；negativeProfitAndBetting：投注红包和负盈利红包,negativeProfit：负盈利红包,betting：投注红包,other：其他',
        betting_gift_rule: [{ min: "", proportion: "", max: "" }], //'投注红包组成规则
        negative_profit_gift_rule: [{ min: "", proportion: "", max: "" }], //负盈利红包组成规则
        start_time: "", //开始时间
        end_time: "", //结束时间；此字段值为1时是永久有效',
        delivery_time_type: "cycle", //发放的时间类型；cycle：按周期,select_date：按自选时间',
        delivery_time: "", //'20190720,20190721,20190723',//发放的时间 delivery_time_type=cycle时，周期为每3天时，此字段值为 3。delivery_type=select_date时，此字段值为 20190722,20190724 日期英文逗号分隔',
        delivery_type: "randomTime", //发放方式 settlementTime:按结算时间（默认是当天中午发放）,randomTime:随机时间（默认是当天中午到当天22点前的每30分钟发一批）
        show_content_type: "randomGameName", //发放名目类型 randomGameName:游戏随机（前端根据此值显示当前下注的彩票类型名称）,designationGameName:指定游戏
        show_content: [], //发放名目（红包页面显示内容相关）:{0:"快速赛车",1:"3分赛车"}',
        not_acquired_handle: "fail", //'结算日当天未领取的红包处理方式 fail:失效,accumulation:累积',
        lottery_ids: "", //参与的彩票游戏id
        siteId: this.$root.nowSite.id, //'网站ID'
        siteName: this.$root.nowSite.siteName //'网站名称'
      },
      options3: {
        disabledDate: date => {
          return date && date.valueOf() < Date.now();
        }
      },
      startTimeOptions: {
        disabledDate: date => {
          let startTime = this.formKey.start_time
            ? new Date(this.formKey.start_time).valueOf() - 24 * 60 * 60 * 1000
            : Date.now();
          return date.valueOf() < startTime;
        }
      },
      endTimeOptions: {
        disabledDate: date => {
          let startTime = this.formKey.start_time
            ? new Date(this.formKey.start_time).valueOf() - 24 * 60 * 60 * 1000
            : Date.now();
          let endTime =
            this.formKey.end_time && this.formKey.end_time != ""
              ? new Date(this.formKey.end_time).valueOf()
              : Date.now();
          if (this.formKey.end_time) {
            return (
              date.valueOf() < startTime +24 * 60 * 60 * 1000 || date.valueOf() > endTime
            );
          } else {
            return date.valueOf() < startTime;
          }
        }
      },
      rules: {
        min: [
          { required: true, message: "请输入最低投注", trigger: "blur" },
          {
            required: true,
            message: "请输入正确金额",
            pattern: /^(([1-9]\d*))?$/,
            trigger: "blur"
          }
        ],
        proportion: [
          {
            required: true,
            message: "请输入发放比例",
            trigger: "change"
          },
          {
            required: true,
            message: "请输入正确数值(最多两位小数)",
            pattern: /^(([0-9]\d*))(\.\d{1,2})?$/,
            trigger: "blur"
          }
        ],
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      if(this.$route.query.gift_type=="betting"){
        this.isNegative = false
      }else if(this.$route.query.gift_type=="negativeProfit"){
        this.isBetting = false;
      }
      let data = {
        id: this.$route.query.id,
        siteId: this.$route.query.siteId,
        gift_type: this.$route.query.gift_type
      };
      //若为编辑页获取数据
      hongYunEdit(data).then(res => {
        if (res.code == 200) {
          this.formKey = res.data;
          this.gameList2 = this.formKey.GameList
          this.lookEndTime=this.formKey.end_time;
          this.formKey.betting_gift_rule = JSON.parse(
            this.formKey.betting_gift_rule
          );
          this.formKey.negative_profit_gift_rule = JSON.parse(
            this.formKey.negative_profit_gift_rule
          );
          this.formKey.start_time = this.$root.formatTime(
            this.formKey.start_time * 1000
          );
          if (this.formKey.end_time == 1) {
            this.valid_time == "长期有效";
            this.formKey.end_time = "";
          } else {
            this.valid_time = "结束时间";
            this.formKey.end_time = this.$root.formatnightTimeS(
              this.formKey.end_time * 1000
            );
          }
          if (this.formKey.delivery_time_type == "select_date") {
            this.formKey.delivery_time.split(",").map(item => {
              item = this.$moment(item).format("X");
              item = this.$root.formatTime(item * 1000);
              this.dateBut.push(item);
            });
          } else {
            this.days = this.formKey.delivery_time;
          }
          if (this.formKey.show_content_type == "designationGameName") {
            let obj = JSON.parse(this.formKey.show_content)[0];
            for (let i in obj) {
              this.content.push(obj[i]);
            }
          }
          this.formKey.show_content = [];
          let gameObj = this.formKey.lottery_ids.split(",");
          for (let i in gameObj) {
            this.game.push(Number(gameObj[i]));
          }
        }
      });

      //获取发放金额
      let data2 = {
        siteId: this.$root.nowSite.id,
        config_id: this.$route.query.id
      };
      activityHongyundangtouGiveOutInfo(data2).then(res => {
        this.table = res.data;
      });
    }
    //获取游戏列表
    let data = { siteId: this.$root.nowSite.id };
    gameList(data).then(res => {
      this.gameList = res.data;
      if (this.$route.query.page == "create") {
        this.gameList2 = res.data;
        res.data.map(item => {
          this.game.push(item.id);
        });
      }
      this.count =
        this.gameList.length != 0
          ? this.gameList.length % 9 == 0
            ? 9
            : this.gameList.length % 9
          : 0;
    });
  },
  methods: {
    numChange(value,i){
      let x = String(value).indexOf('.') + 1;
      let y =String(value).length - x; 
      if(y>=2){
        value = value.toFixed(2);
      }
      this.formKey.betting_gift_rule[i].proportion=Number(value)/1;
    },
    startTimeChange: function(e) {
      this.formKey.start_time = e;
      this.formKey.delivery_time = "";
      this.dateBut = "";
    },
    endTimeChange: function(e) {
      this.formKey.end_time = this.$root.formatnightTimeS(e);
      this.formKey.delivery_time = "";
      this.dateBut = "";
    },
    changeValid(val) {
      if (val == "长期有效") {
        this.formKey.end_time = "";
      }
    },
    OutDetails(val) {
      this.$refs.OutTheDetails.getData(val);
    },
    add() {
      this.formKey.betting_gift_rule.push({ min: "", proportion: "", max: "" });
    },
    negativeAdd() {
      this.formKey.negative_profit_gift_rule.push({
        min: "",
        proportion: "",
        max: ""
      });
    },
    bettingDel(i) {
      this.formKey.betting_gift_rule.splice(i, 1);
    },
    negDel(i) {
      this.formKey.negative_profit_gift_rule.splice(i, 1);
    },
    //日期变化时
    dataChange(val) {
      this.dateBut = val.split(",").sort(function(a,b){
        if(a>b)return 1
				else return -1
      });
      this.formKey.delivery_time = this.dateBut;
    },
    changeGame(val){
      this.gameList2=[];
      val.map(item=>{
        this.gameList.map(t=>{
          if(t.id==item){
            this.gameList2.push(t)
          }
        })
      })
    },
    //删除日期
    delDate(i) {
      this.dateBut.splice(i, 1);
      this.formKey.delivery_time = this.dateBut;
    },
    delGame(i) {
      this.content.splice(i, 1);
    },
    //取消
    change() {
      if (this.$route.query.page == "look") {
        this.$router.push({
          name: "addPlan",
          params: { page: "edit" },
          query: { id: this.$route.query.id, siteId: this.$root.nowSite.id,page: "edit"}
        });
        return;
      }
      this.$router.push({ name: "activityHongyundangtouConfigList" });
    },
    //跳转编辑页
    toEdit() {
      this.$router.push({
        name: "addPlan",
        params: { page: "edit" },
        query: { id: this.$route.query.id, siteId: this.$root.nowSite.id }
      });
    },
    //提交
    submit() {
      
      if (this.$route.query.page == "look") {
        this.$router.push({ name: "activityHongyundangtouConfigList" });
        return;
      };
      //判断红包组成
       this.formKey.gift_type = this.isBetting && this.isNegative?"negativeProfitAndBetting":
       this.formKey.gift_type = this.isBetting&&!this.isNegative?'betting':
       this.formKey.gift_type = !this.isBetting&&this.isNegative?'negativeProfit':'other'
      if (this.formKey.gift_type=='negativeProfitAndBetting'||this.formKey.gift_type=='betting') {
        for (let item of this.formKey.betting_gift_rule) {
          if (!item.min) {
            this.$Message.error("请输入最低投注");
            return;
          }else if( !/^(([1-9]\d*))?$/.test(item.min)){
            this.$Message.error('请输入整数金额');
            return
          }
          if (!item.proportion) {
            this.$Message.error("请输入发放比例");
            return;
          }else if(!/^(([0-9]\d*))(\.\d{1,2})?$/.test(item.proportion)){
            this.$Message.error("请输入正确发放比例(最多两位小数)");
            return;
          }
        }
        if(this.formKey.betting_gift_rule.length>=2){
          for(let i=0; i<this.formKey.betting_gift_rule.length-1;i++ ){
            if(this.formKey.betting_gift_rule[i+1].min-this.formKey.betting_gift_rule[i].min<=0){
              this.$Message.error('下列最低投注必须大于上列最低投注');
              return
            }
          }
        }
      }
      if(this.formKey.gift_type=='negativeProfitAndBetting'||this.formKey.gift_type=='negativeProfit'){
        for (let item of this.formKey.negative_profit_gift_rule) {
          if (!item.min) {
            this.$Message.error("请输入最低负盈利");
            return;
          }else if( !/^(([1-9]\d*))?$/.test(item.min)){
            this.$Message.error('请输入整数金额');
            return
          }
          if (!item.proportion) {
            this.$Message.error("请输入发放比例");
            return;
          }else if(!/^(([0-9]\d*))(\.\d{1,2})?$/.test(item.proportion)){
            this.$Message.error("请输入正确发放比例(最多两位小数)");
            return;
          }
          if( !/^(([1-9]\d*))?$/.test(item.max)){
            this.$Message.error("请输入整数");
            return;
          }
        };
        if(this.formKey.negative_profit_gift_rule.length>=2){
          for(let i=0; i<this.formKey.negative_profit_gift_rule.length-1;i++ ){
            if(this.formKey.negative_profit_gift_rule[i+1].min-this.formKey.negative_profit_gift_rule[i].min<=0){
              this.$Message.error('下列最低投注必须大于上列最低投注');
              return
            }
          }
        };
      }
      if(this.formKey.gift_type=='other'){
        this.$Message.error('请选择红包组成');
        return
      }
      //结束时间类型+时间判断
      if (!this.formKey.start_time) {
        this.$Message.error("请选择生效时间");
        return;
      }
      if (this.valid_time == "长期有效") {
        this.formKey.end_time = "";
      } else {
        if (!this.formKey.end_time) {
          this.$Message.error("请选择结束时间");
          return;
        }
        if (new Date(this.formKey.end_time).getTime() -new Date(this.formKey.start_time).getTime() <0) {
          this.$Message.error("结束时间必须大于生效时间");
          return;
        }
      }
        //发放节点
        if (this.formKey.delivery_time_type == "cycle") {
          if (this.days != "自定义") {
            this.customDay = "";
            if (!this.days) {
              this.$Message.error("请选择周期");
              return;
            }
            this.formKey.delivery_time = this.days;
          } else {
            if(this.customDay=='null'||!this.customDay||this.customDay==undefined){
              this.$Message.error('请输入自定义天数');
              return
            }
            this.formKey.delivery_time = this.customDay;
          }
        } else {
          if (this.formKey.delivery_time.length >= 1) {
            this.formKey.delivery_time = this.dateBut.join(",");
          } else {
            this.$Message.error("请选择日期");
            return;
          }
        }
        //获取指定参与游戏
        if (this.formKey.show_content_type == "designationGameName") {
          if(this.content.length==0){
            this.$Message.error('请选择指定游戏');
            return
          }else{
            let gameObj = {};
            this.content.map(item => {
              this.gameList.map(t => {
                if (t.name == item) {
                  let id = t.id;
                  gameObj[id] = item;
                }
              });
            });
            this.formKey.show_content.push(gameObj);
          }
        }
        //参与游戏ID
        if(this.game.length==0){
          this.$Message.error("请选择参与游戏");
          return
        }
        this.formKey.lottery_ids = this.game.join(",");

        let data = { ...this.formKey };
        //时间转换时间戳
        data.start_time = this.$moment(data.start_time).format("X");
        if (data.end_time != "1") {
          data.end_time = this.$moment(this.$root.formatnightTimeS(data.end_time)).format("X")
        }
        if (this.valid_time == "长期有效") {
          data.end_time = 1;
        }
        if (this.formKey.delivery_time_type != "cycle") {
          let arr = this.formKey.delivery_time.split(",");
          data.delivery_time = [];
          arr.map(item => {
            item = this.$root.formatTime2(item);
            data.delivery_time.push(item);
          });
          data.delivery_time = data.delivery_time.join(",");
        }
        data.betting_gift_rule = JSON.stringify(data.betting_gift_rule);
        data.negative_profit_gift_rule = JSON.stringify(
        data.negative_profit_gift_rule
        );
        data.show_content = JSON.stringify(data.show_content);
        //新增

        if (this.$route.query.page == "create") {
          hongYunAdd(data, true).then(res => {
            if (res.code == 200) {
              this.$Message.success("活动创建成功");
              this.$router.push({ name: "activityHongyundangtouConfigList" });
            }
          });
        } else {
          //编辑
          hongYunUp(data, true).then(res => {
            if (res.code == 200) {
              this.$Message.success("活动更新成功");
              this.$router.push({ name: "activityHongyundangtouConfigList" });
            }
          });
        }

    }
  }
};
</script>
<style lang="less" scoped>
.bb {
  border: 1px solid #e4e4e4;
}
.close {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #cecece;
  background: #f6f6f8;
  color: #cccccc;
}
/deep/.ivu-form-item-content{
  margin-left: 80px !important;
}
.mt12 {
  box-sizing: border-box;
}
.game {
  display: inline-block;
  width: 117px;
  border-bottom: 1px solid #cdcdcd;
  line-height: 62px;
}
.bn {
  border-bottom: none;
}
.but {
  position: relative;
  padding-left: 0;
  .close {
    position: absolute;
    right: 5px;
    top: 8px;
  }
}
.ft_c4 {
  color: #444444;
}
.ft_c8 {
  color: #888888;
}
.ft_cr8 {
  color: #888888;
  /deep/.ivu-form-item-label {
    font-size: 0.875rem;
    color: #888888;
  }
}
.table {
  ul {
    width: 100%;
    border: 1px solid #e4e4e4;
    border-right: 0;
    li {
      display: inline-block;
      width: 25%;
      line-height: 40px;
      height: 40px;
      text-align: center;
      border-right: 1px solid #e4e4e4;
    }
    .ft_cl {
      color: #62b1fd;
      cursor: pointer;
    }
  }
  .ul1 {
    border-bottom: 0;
  }
}
.noPic {
  /deep/.ivu-input-suffix {
    display: none !important;
  }
}
/deep/.ivu-radio-wrapper {
  margin-right: 30px;
}
/deep/.endTime {
  .ivu-form-item-label {
    padding-right: 10px;
  }
}
/deep/.ivu-form-item {
  margin-bottom: 15px;
}
/deep/.ivu-form-item-label {
  font-size: 1rem;
}
.ft {
  /deep/.ivu-form-item-label {
    font-size: 0.875rem;
  }
}
</style>
