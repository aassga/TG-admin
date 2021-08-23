<template>
  <!-- <div> -->
  <Modals ref="PaymentModifyModal" title="支付设置" :width="900">
    <div slot="content" style="overflow:auto;position:relative">
      <div class="v2-search bb">
        <ButtonGroup class="repay-button1" style="margin-bottom:0.5px">
          <Button
            v-for="(t, i) in btnList"
            :class="btnStatus == t.val ? 'active' : ''"
            :key="i"
            @click="statusType(t.val)"
          >{{ t.name }}</Button>
        </ButtonGroup>
      </div>
      <Button
        class="mr20"
        type="primary"
        style="position:absolute;top:0;right:0"
        @click="hierarchySet"
      >套用层级</Button>
      <div v-if="btnStatus == 'pc'">
        <div class="modal-overflow" v-if='!spinShow'>
          <ul class>
            <template v-if="Array.isArray(pcList) && pcList.length > 0">
              <li
                :class="[screen < 1600 ? 'pt10 pb5' : 'pt15 pb10']"
                v-for="(pc, i) in pcList"
                :style="pcPayList.length>5?`width:${pcPayList.length*130+240}px`:''"
                :key="pc.class_id"
              >
                <label style="width:180px;" class="txt-r ib mr30 ft14 fontColor">
                  {{ pc.class_name }}
                  <div class='ib w70x txt-a'>
                    <Switch v-model="pc.common_channel" size="large" v-if="pc.show_common_channel&&pc.selected_id.split(',').length>1">
                      <span slot="open">开启</span>
                      <span slot="close">停用</span>
                    </Switch> 
                  </div>
                </label>
                <div class="box ib" :key="t" v-for="t in [0, 1, 2, 3, 4,5,6,7,8,9]">
                  <Icons
                    :type="pc.locked_payment_id.split(',').includes(pc.selected_id.split(',')[t])?'suodingpaixu1':'jiesuopaixu'"
                    v-if="pc.selected_id.split(',')[t]"
                    :color="pc.locked_payment_id.split(',').includes(pc.selected_id.split(',')[t])? 'rgb(255, 38, 38)': 'orange'"
                    @click.native="locked(i,t,pcList)"
                    class="gameLock"
                    size="20"
                  ></Icons>
                  <Select
                    clearable
                    filterable
                    v-model="pc.selected_id.split(',')[t]"
                    placement='bottom-start'
                    class="mr10 select"
                    transfer
                    style="width:90px"
                    :style="{ width: '120px', maxHeight: '150px' }"
                    :placeholder="`通道`+Number(t+1)+`,可查询`"
                    @on-clear="resetSelected('pc', i, t)"
                  >
                    <Option
                      v-for="item in pc.payment_list"
                      :value="item.id + ''"
                      :key="item.id"
                      :label="item.payName"
                      :disabled="pc.selected_id.split(',').includes(item.id + '')"
                      class="option-span"
                      @click.native="!pc.selected_id.split(',').includes(item.id + '') && onPcChange(i, t, pc.class_id, item.id,pc.selected_id.split(',')[t])"
                    >{{ item.payName }}</Option>
                  </Select>
                </div>
              </li>
              <Form style="text-align:center;">
                <Button
                  class="ivu-btn submit btw260 ft20 gd bg"
                  @click.prevent="submit"
                  type="primary"
                >提交保存</Button>
              </Form>
            </template>
            <li v-else class="txt-a">暂无支付方式</li>
          </ul>
        </div>
        <div v-else>
            <Row v-if="spinShow" style="height:300px;line-height:300px">
                <Spin size="large" fix v-if="spinShow">
                    <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
                    <div v-for="t in 8" :key="'div' + t"></div>
                    </div>
                </Spin>
            </Row>
        </div>
      </div>
      <div v-if="btnStatus == 'h5'" >
        <div class="modal-overflow" v-if='!spinShow'>
          <ul class>
            <template v-if="Array.isArray(h5List) && h5List.length > 0">
              <li
                :class="[screen < 1600 ? 'pt10 pb5' : 'pt15 pb10']"
                :style="h5PayList.length>5?`width:${h5PayList.length*130+240}px`:''"
                v-for="(h5, i) in h5List"
                :key="h5.class_id"
              >
                <label style="width:180px;" class="txt-r ib mr30 ft14 fontColor">{{ h5.class_name }}
                  <div class='ib w70x txt-a'>
                    <Switch v-model="h5.common_channel" size="large" v-if="h5.show_common_channel&&h5.selected_id.split(',').length>1">
                      <span slot="open">开启</span>
                      <span slot="close">停用</span>
                    </Switch> 
                  </div>
                </label>
                <div class="box ib" v-for="t in [0, 1, 2, 3, 4,5,6,7,8,9]" :key="t">
                  <Icons
                    :type="h5.locked_payment_id.split(',').includes(h5.selected_id.split(',')[t])?'suodingpaixu1':'jiesuopaixu'"
                    v-if="h5.selected_id.split(',')[t]"
                    :color="h5.locked_payment_id.split(',').includes(h5.selected_id.split(',')[t])? 'rgb(255, 38, 38)': 'orange'"
                    @click.native="locked(i,t,h5List)"
                    class="gameLock"
                    size="20"
                  ></Icons>
                  <Select
                    clearable
                    filterable
                    transfer
                    placement='bottom-start'
                    :key="t"
                    v-model="h5.selected_id.split(',')[t]"
                    class="mr10"
                    style="width:90px"
                    :style="{ width: '120px' }"
                    :placeholder="`通道`+Number(t+1)+`,可查询`"
                    @on-clear="resetSelected('h5', i, t)"
                  >
                    <Option
                      v-for="item in h5.payment_list"
                      :value="item.id + ''"
                      :key="item.id"
                      :label="item.payName"
                      :disabled="h5.selected_id.split(',').includes(item.id + '')"
                      class="option-span"
                      @click.native="!h5.selected_id.split(',').includes(item.id + '') && onH5Change(i, t, h5.class_id, item.id,h5.selected_id.split(',')[t])"
                    >{{ item.payName }}</Option>
                  </Select>
                </div>
              </li>
              <Form style="text-align:center">
                <Button
                  class="ivu-btn submit btw260 ft20 gd bg"
                  @click.prevent="submit"
                  type="primary"
                >提交保存</Button>
              </Form>
            </template>
            <li v-else class="txt-a">暂无支付方式</li>
          </ul>
        </div>
        <div v-else>
            <Row v-if="spinShow" style="height:300px;line-height:300px">
                <Spin size="large" fix v-if="spinShow">
                    <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
                    <div v-for="t in 8" :key="'div' + t"></div>
                    </div>
                </Spin>
            </Row>
        </div>
      </div>
      <div v-if="btnStatus=='android'">
        <div class="modal-overflow" v-if='!spinShow'>
          <ul class>
            <template v-if="Array.isArray(androidList)&&androidList.length>0">
              <li
                :class="[screen<1600?'pt10 pb5':'pt15 pb10']"
                v-for="(android,i) in androidList"
                :key="android.class_id"
              >
                <label
                  style="width:170px;"
                  class="txt-r ib mr30 ft14 fontColor"
                >{{android.class_name}}
                  <div class='ib w70x txt-a'>
                    <Switch v-model="android.common_channel" size="large" v-if="android.show_common_channel&&android.selected_id.split(',').length>1">
                      <span slot="open">开启</span>
                      <span slot="close">停用</span>
                    </Switch>
                  </div>
                </label>
                <div class="box ib" v-for="t in [0,1,2,3,4]" :key="t">
                  <Icons
                    :type="android.locked_payment_id.split(',').includes(android.selected_id.split(',')[t])?'suodingpaixu1':'jiesuopaixu'"
                    v-if="android.selected_id.split(',')[t]"
                    :color="android.locked_payment_id.split(',').includes(android.selected_id.split(',')[t])? 'rgb(255, 38, 38)': 'orange'"
                    @click.native="locked(i,t,androidList)"
                    class="gameLock"
                    size="20"
                  ></Icons>
                  <Select
                    clearable
                    filterable
                    transfer
                    :key="t"
                    placement='bottom-start'
                    v-model="android.selected_id.split(',')[t]"
                    class="mr15"
                    :style="{width:'118px'}"
                    :placeholder="'通道' + (t===0 ? '一' :t===1 ? '二' : t===2? '三' :t===3 ? '四' : '五')+' 可查询'"
                    @on-clear="resetSelected('android',i,t)"
                  >
                    <Option
                      v-for="item in android.payment_list"
                      :value="item.id+''"
                      :key="item.id"
                      :label="item.payName"
                      :disabled="android.selected_id.split(',').includes(item.id+'')"
                      class="option-span"
                      @click.native="!android.selected_id.split(',').includes(item.id+'')&&onAndroidChange(i,t,android.class_id,item.id,android.selected_id.split(',')[t])"
                    >{{item.payName}}</Option>
                  </Select>
                </div>
              </li>
              <Form style="text-align:center">
                <Button class="ivu-btn submit btw260 ft20 gd bg" @click="submit" type="primary">提交保存</Button>
              </Form>
            </template>
            <li v-else class="txt-a">暂无支付方式</li>
          </ul>
        </div>
        <div v-else>
            <Row v-if="spinShow" style="height:300px;line-height:300px">
                <Spin size="large" fix v-if="spinShow">
                    <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
                    <div v-for="t in 8" :key="'div' + t"></div>
                    </div>
                </Spin>
            </Row>
        </div>
      </div>
      <!-- ios -->
      <div v-if="btnStatus == 'ios'">
        <div class="modal-overflow" v-if='!spinShow'>
          <ul class>
            <template v-if="Array.isArray(iosList) && iosList.length > 0">
              <li
                :class="[screen < 1600 ? 'pt10 pb5' : 'pt15 pb10']"
                v-for="(ios, i) in iosList"
                :key="ios.class_id"
              >
                <label
                  style="width:180px;"
                  class="txt-r ib mr30 ft14 fontColor"
                >{{ ios.class_name }}
                  <div class='ib w70x txt-a'>
                    <Switch class="ml5" v-model="ios.common_channel" size="large" v-if="ios.show_common_channel&&ios.selected_id.split(',').length>1">
                      <span slot="open">开启</span>
                      <span slot="close">停用</span>
                    </Switch> 
                  </div>
                </label>
                <div class="box ib" v-for="t in [0,1,2,3,4]" :key="t">
                  <Icons
                    :type="ios.locked_payment_id.split(',').includes(ios.selected_id.split(',')[t])?'suodingpaixu1':'jiesuopaixu'"
                    v-if="ios.selected_id.split(',')[t]"
                    :color="ios.locked_payment_id.split(',').includes(ios.selected_id.split(',')[t])? 'rgb(255, 38, 38)': 'orange'"
                    @click.native="locked(i,t,iosList)"
                    class="gameLock"
                    size="20"
                  ></Icons>
                  <Select
                    clearable
                    filterable
                    transfer
                    placement='bottom-start'
                    :key="t"
                    v-model="ios.selected_id.split(',')[t]"
                    class="mr15"
                    :style="{ width: '118px' }"
                    :placeholder="'通道' + (t === 0 ? '一' : t === 1 ? '二' : t === 2 ? '三' : t === 3 ? '四' : '五') + ' 可查询'"
                    @on-clear="resetSelected('ios', i, t)"
                  >
                    <Option
                      v-for="item in ios.payment_list"
                      :value="item.id + ''"
                      :key="item.id"
                      :label="item.payName"
                      :disabled="ios.selected_id.split(',').includes(item.id + '')"
                      class="option-span"
                      @click.native="!ios.selected_id.split(',').includes(item.id + '') && onIosChange(i, t, ios.class_id, item.id,ios.selected_id.split(',')[t])"
                    >{{ item.payName }}</Option>
                  </Select>
                </div>
              </li>
              <Form style="text-align:center">
                <Button class="ivu-btn submit btw260 ft20 gd bg" @click="submit" type="primary">提交保存</Button>
              </Form>
            </template>
            <li v-else class="txt-a">暂无支付方式</li>
          </ul>
        </div>
        <div v-else>
            <Row v-if="spinShow" style="height:300px;line-height:300px">
                <Spin size="large" fix v-if="spinShow">
                    <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
                    <div v-for="t in 8" :key="'div' + t"></div>
                    </div>
                </Spin>
            </Row>
        </div>
      </div>
      <Modals ref="hierarchyModal" title="套用层级" :width="660">
        <div slot="content" class="pt10">
            <P class="txt-a ft14 mb30 h42" style="background: rgba(137, 180, 226, 0.1);">
              <Icons type="danchuangtishi" color="red" :size="16" class="pl10 mr10"></Icons>
                所选层级的相同客户端会和当前层级客户端支付通道的支付平台保持一致
            </P>
          <Form
            ref="hierarchy"
            :model="hierarchyData"
            style="width:1060px;"
            :rules="rules"
            :label-width="160"
          >
            <FormItem label="当前层级">
              <Input disabled v-model="hierarchyData.source_level" class="w370x" />
            </FormItem>
            <FormItem label="客户端">
              <Input
                disabled
                :value="hierarchyData.device=='pc'?'电脑端':hierarchyData.device=='h5'?'H5':hierarchyData.device=='ios'?'IOS':'Android'"
                class="w370x"
              />
            </FormItem>
            <FormItem label="套用层级" prop="target_level">
              <Select
                class="w370x"
                multiple
                v-model="hierarchyData.target_level"
                transfer
                @on-change="levelChange"
              >
                <Option class="ml20" style="line-height:28px" value="0">全部套用</Option>
                <Option
                  class="ml20"
                  style="line-height:28px"
                  v-for="t in levelList"
                  :key="t.levelLabel"
                  :value="t.levelLabel"
                >{{t.levelAlias}}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button
                style="width:370px"
                class="bg white-font white-font h50 ft18"
                @click.prevent="hierarchySubmit"
              >确认保存</Button>
            </FormItem>
          </Form>
        </div>
      </Modals>
    </div>
  </Modals>
  <!-- 
  </div>-->
</template>
<script>
import Modals from "@/components/modals";
import {
  paymentsetting,
  payMentDetail,
  copyPaymentChannel
} from "@/api/member";
import Icons from "@/components/icons";
export default {
  components: { Modals, Icons },
  data() {
    return {
      spinShow:false,
      btnStatus: "pc",
      btnList: [
        { name: "电脑端", val: "pc" },
        { name: "H5端", val: "h5" },
        { name: "苹果端", val: "ios" },
        { name: "安卓端", val: "android" }
      ],
      pcPayList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      h5PayList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      status: true,
      screen: screen.width,
      formKey: {
        levelLabel: "",
        data: {
          pc: {},
          h5: {},
          android: {},
          ios: {}
        },
        locked: {
          pc: {},
          h5: {},
          ios: {},
          android: {}
        }
      },
      hierarchyData: {
        source_level: "",
        device: 'pc',
        target_level: ""
      },
      levelList: [],
      pcList: [], // pc总数居
      h5List: [],
      androidList: [],
      iosList: [],
      pcBtnDisabled: true,
      // h5BtnDisabled: true,
      pcSelect: "",
      h5Select: "",
      rules: {
        target_level: {
          required: true,
          validator: (rule, val, cb) => {
            val = this.hierarchyData.target_level;
            if (!val.length) {
              cb(new RangeError("请选择层级"));
            } else {
              cb();
            }
          },
          trigger: "change"
        }
      }
    };
  },
  methods: {
    hierarchySet() {
      //套用层级
      this.hierarchyData.target_level = [];
      this.$refs.hierarchy.resetFields();
      this.$refs.hierarchyModal.show();
    },
    hierarchySubmit() {
      this.$refs.hierarchy.validate(valid => {
        if (valid) {
          let postData = {
            siteId: this.$root.nowSite.id,
            source_level: this.formKey.levelLabel,
            target_level: this.hierarchyData.target_level.join(","),
            device: this.hierarchyData.device
          };

          this.$Tip.confirm({
            content: "套用到目标层级,会覆盖目标原有层级内容,是否继续",
            onOk: () => {
              this.$refs.hierarchyModal.spinShow();
              copyPaymentChannel(postData, true)
                .then(res => {
                  if (res && res.code == 200) {
                    this.$Message.success("套用层级成功");
                    this.$refs.hierarchyModal.hide();
                    this.$refs.hierarchyModal.spinHide();
                  } else {
                    this.$refs.hierarchyModal.spinHide();
                  }
                })
                .catch(err => {
                  this.$refs.hierarchyModal.spinHide();
                });
            }
          });
        }
      });
    },
    levelChange(val) {
      if (val[val.length - 1] == "0") {
        this.hierarchyData.target_level = ["0"];
      } else {
        this.hierarchyData.target_level = val.filter(item => {
          return item != "0";
        });
      }
      if (!this.hierarchyData.target_level.includes("0")) {
        this.hierarchyData.target_level.sort((a, b) => {
          return a - b;
        });
      }
    },
    statusType(val) {
        this.btnStatus = val;
        this.hierarchyData.device = val;
        this.spinShow = true;
        let that = this;
        setTimeout(() => {
			that.spinShow = false;
		}, 200);
    },
    resetForm() {
      this.formKey.data.pc = {};
      this.formKey.data.h5 = {};
      this.formKey.data.android = {};
      this.formKey.data.ios = {};
    },
    init(levelLabel, levelAlias, levelList) {
      this.btnStatus = 'pc';
      this.hierarchyData.device = 'pc';
      this.resetForm();
      this.formKey.levelLabel = levelLabel;
      this.hierarchyData.source_level = levelAlias;
      this.levelList = levelList;
      const data = {
        siteId: this.$root.nowSite.id,
        levelLabel: levelLabel
      };
      this.$refs.PaymentModifyModal.show();
      this.spinShow = true;
      payMentDetail(data).then(res => {
        const { pc, h5, ios, android } = res.data;
        this.pcList = pc;
        this.h5List = h5;
        this.iosList = ios;
        this.androidList = android;
        this.delSelectedId(this.pcList);
        this.delSelectedId(this.h5List);
        this.delSelectedId(this.iosList);
        this.delSelectedId(this.androidList);
        this.spinShow = false;
      });
    },
    onPcChange(p_i, t_i, c_id, id,beforeId) {
      // this.pcBtnDisabled = false;
      this.createData("pc", p_i, t_i, c_id, id,beforeId);
    },
    onH5Change(p_i, t_i, c_id, id,beforeId) {
      // this.h5BtnDisabled = false;
      this.createData("h5", p_i, t_i, c_id, id,beforeId);
    },
    onAndroidChange(p_i, t_i, c_id, id,beforeId) {
      // this.h5BtnDisabled = false;
      this.createData("android", p_i, t_i, c_id, id,beforeId);
    },
    onIosChange(p_i, t_i, c_id, id,beforeId) {
      // this.h5BtnDisabled = false;
      this.createData("ios", p_i, t_i, c_id, id,beforeId);
    },
    createData(key, p_i, t_i, c_id, id,beforeId) {
      /**
       * key 判断平台的key,指向data的目标列表 pc | h5
       * p_i 最上层index
       * t_i 当前通道的index
       * c_id 父级id
       * id 当前选择项
       */
      // let targetList = key === "ios" ? "iosList" : ("h5"?"h5List":("ios"?"iosList":"iosList"));
      let targetList =
        key === "h5"
          ? "h5List"
          : key === "pc"
          ? "pcList"
          : key === "ios"
          ? "iosList"
          : "androidList";

      if (this[targetList][p_i].selected_id.split(",").includes(id))
        return false;
      if(this[targetList][p_i].locked_payment_id.split(",").includes(beforeId)&&this[targetList][p_i].locked_payment_id.split(",")[0]!=""){
       
        let lockIds = this[targetList][p_i].locked_payment_id.split(",");
        lockIds[t_i] = id;
        this[targetList][p_i].locked_payment_id = lockIds.join(",");
      }
      let ids = this[targetList][p_i].selected_id.split(",");
      ids[t_i] = id;
      this[targetList][p_i].selected_id = ids.join(",");
      this.formKey.data[key][c_id] = ids.join(",");
    },
    submit() {
      let params = { ...this.formKey };
      params.siteId = this.$root.nowSite.id;
      params.data.pc = this.completeParams("pc");
      params.data.h5 = this.completeParams("h5");
      params.data.android = this.completeParams("android");
      params.data.ios = this.completeParams("ios");
      params.locked.pc = this.lockedParams("pc");
      params.locked.h5 = this.lockedParams("h5");
      params.locked.ios = this.lockedParams("ios");
      params.locked.android = this.lockedParams("android");
      params = Object.assign(params, this.formKey);
      const { pc, h5, ios, android } = params.data;
      params.data = JSON.stringify(params.data);
      for (let key in params.locked) {
        for (let t in params.locked[key]) {
          if (!params.locked[key][t]) delete params.locked[key][t];
        }
        if (!Object.keys(params.locked[key]).length) delete params.locked[key];
      }
      if (!Object.keys(params.locked).length) delete params.locked;
      if (params.locked) params.locked = JSON.stringify(params.locked);
      this.$refs.PaymentModifyModal.spinShow();
      paymentsetting(params, true)
        .then(res => {
          //更改弹窗模式

          if (res != undefined && res.code == 200) {
            this.$Message.success(`修改${res.data}`);
            this.$refs.PaymentModifyModal.spinHide();
          }
          this.$refs.PaymentModifyModal.hide();
          this.resetForm();
        })
        .catch(err => {
          this.$refs.PaymentModifyModal.spinHide();
        });
    },
    completeParams(key) {
      // 如果有默认的通道并且没有触发通道change事件，则需要补全之前默认的的通道信息提交后台
      // let targetList = key === "pc" ? "pcList" : "h5List";
      let targetList =
        key === "h5"
          ? "h5List"
          : key === "pc"
          ? "pcList"
          : key === "ios"
          ? "iosList"
          : "androidList";
      let data = {};
      this[targetList].forEach(pay => {
        if (pay.selected_id) data[pay.class_id] =pay.common_channel?'0,' + pay.selected_id:pay.selected_id;
      });
      return data;
    },
    lockedParams(key) {
      let targetList =
        key === "h5"
          ? "h5List"
          : key === "pc"
          ? "pcList"
          : key === "ios"
          ? "iosList"
          : "androidList";
      let locked = {};

      this[targetList].forEach(pay => {
        if (pay.selected_id) locked[pay.class_id] = pay.locked_payment_id;
      });
      return locked;
    },
    resetStatus() {
      this.dsbBtn();
    },
    resetSelected(type, i, t) {
      if (type === "pc") {
        let arr = this.pcList[i].selected_id.split(",");
        if(this.pcList[i].locked_payment_id.split(',').includes(this.pcList[i].selected_id.split(",")[t])){
            let newLock = this.pcList[i].locked_payment_id.split(',').filter(item=>{
                return item !=this.pcList[i].selected_id.split(",")[t]
            })
            this.pcList[i].locked_payment_id = newLock.join(',')
        }
        arr[t] = undefined;
        let selected_id = arr.join(",");
        this.pcList[i].selected_id = selected_id;
        
        // this.pcBtnDisabled = false
        return;
      } else if (type === "h5") {
        let arr = this.h5List[i].selected_id.split(",");
        if(this.h5List[i].locked_payment_id.split(',').includes(this.h5List[i].selected_id.split(",")[t])){
            let newLock = this.h5List[i].locked_payment_id.split(',').filter(item=>{
                return item !=this.h5List[i].selected_id.split(",")[t]
            })
            this.h5List[i].locked_payment_id = newLock.join(',')
        }
        arr[t] = undefined;
        let selected_id = arr.join(",");
        this.h5List[i].selected_id = selected_id;
        // this.h5BtnDisabled = false
        return;
      } else if (type === "ios") {
        let arr = this.iosList[i].selected_id.split(",");
        if(this.iosList[i].locked_payment_id.split(',').includes(this.iosList[i].selected_id.split(",")[t])){
            let newLock = this.iosList[i].locked_payment_id.split(',').filter(item=>{
                return item !=this.iosList[i].selected_id.split(",")[t]
            })
            this.iosList[i].locked_payment_id = newLock.join(',')
        }
        arr[t] = undefined;
        let selected_id = arr.join(",");
        this.iosList[i].selected_id = selected_id;
        return;
      } else if (type === "android") {
         
        let arr = this.androidList[i].selected_id.split(",");
        if(this.androidList[i].locked_payment_id.split(',').includes(this.androidList[i].selected_id.split(",")[t])){
            let newLock = this.androidList[i].locked_payment_id.split(',').filter(item=>{
                return item !=this.androidList[i].selected_id.split(",")[t]
            })
            this.androidList[i].locked_payment_id = newLock.join(',')
        }
        arr[t] = undefined;
        let selected_id = arr.join(",");
        this.androidList[i].selected_id = selected_id;
        return;
      }
    },
    locked(i, t, list) {
      let arr = [];
      if (
        list[i].locked_payment_id
          .split(",")
          .includes(list[i].selected_id.split(",")[t])
      ) {
        arr = list[i].locked_payment_id.split(",").filter(item => {
          return item != list[i].selected_id.split(",")[t];
        });
      } else {
        arr = list[i].locked_payment_id.split(",").filter(item=> item!="");
        arr.push(list[i].selected_id.split(",")[t]);
      }
      list[i].locked_payment_id = arr.join(",");
      this.$forceUpdate();
    },
    // 删除在下拉框中没有的id
    delSelectedId(arg) {
      if (Array.isArray(arg) && arg.length > 0) {
        arg.forEach(el => {
          let arr = [];
          if (el.payment_list.length > 0) {
            el.payment_list.forEach(el => {
              arr.push(el.id + "");
            });
          } else {
            el.selected_id = "";
          }
          if (el.selected_id) {
            let id = el.selected_id.split(",");
            if (id.length > 0) {
              id.forEach((el, index, arr1) => {
                if (!arr.includes(el)) {
                  arr1[index] = undefined;
                }
              });
            }
            el.selected_id = id.toString();
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/tabs.less";
@import "../../../styles/button.less";
.btw260 {
  margin: 20px auto 30px;
}
.option-span.ivu-select-item {
  height: 100%;
  padding: 7px 16px;
}
.ivu-select-item {
  padding: 0;
}
.modal-overflow {
  min-height: 100px;
}
/deep/.ivu-select-input {
  color: #444;
}
ul li {
  white-space: nowrap;
}
.box {
  position: relative;
  .gameLock {
    position: absolute;
    top: -10px;
    left: -10px;
    z-index: 1000;
  }
}
&::-webkit-scrollbar {
  height: 8px !important;
}
</style>


