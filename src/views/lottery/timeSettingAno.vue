<template>
  <div>
    <div class="v2-search clearfix">
      <div class="v2-button fl">
        <Button @click="() => {$refs.editTime.show();batchTimeInfo.tt = '1';batchTimeInfo.time = 0}" type="primary" class="w140x"
            v-if="(adminType == 'super') ||  (authInPage.indexOf('lotteryTimeUp') != -1)"
          >批量修改时间</Button>
      </div>
      <div class="font-bold fr ft18">当前彩票：{{$route.query.name}}</div>
    </div>
    <div class="v2-table">
      <Tables
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
    </div>
    <Modals ref="editPeriods" title="编辑时间" width="560">
      <div slot="content" class="v2-form-wrapper">
        <Form ref="singleEditTime" :model="singleEditTime" :rules="editTimeInfoValidate" :label-width="160" style="width:560px;" >
          <FormItem label="期数">
            <Input placeholder="1" v-model="singleEditTime.issue" disabled class="w260x"/>
          </FormItem>
          <FormItem label="开盘时间" prop="openTime">
            <TimePicker type="time" placeholder="请设置开盘时间" class="w260x" v-model="singleEditTime.openTime" ></TimePicker>
          </FormItem>
          <FormItem label="封盘时间" prop="closeTime">
            <TimePicker type="time" placeholder="请设置封盘时间" class="w260x" v-model="singleEditTime.closeTime" ></TimePicker>
          </FormItem>
          <FormItem label="开奖时间" prop="openingTime">
            <TimePicker type="time" placeholder="请设置开奖时间" class="w260x" v-model="singleEditTime.openingTime" ></TimePicker>
          </FormItem>
          <FormItem v-if="$route.query.type" label="日期选择">
            <Select class="w260x" v-model="singleEditTime.openDay" transfer multiple>
              <Option v-for="t in weekList" :key="t.value" :value="t.value">{{t.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="偏移校正" class="mt15" prop="offset">
            <InputNumber v-model="singleEditTime.offset" class="w260x"></InputNumber>
          </FormItem>
          <FormItem>
            <Button
              class="ivu-btn submit bg"
              @click.prevent="editTimeInfoSave('singleEditTime')"
              :loading="$root.editBtnLoading"
            >确认保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
    <!-- 批量修改时间 -->
    <Modals ref="editTime" title="批量修改时间" width="560">
      <div slot="content" class="v2-form-wrapper">
        <Form ref="timeInfo" inline class="batch">
          <FormItem label="时间类型" :label-width="120" class="mb10">
            <Select v-model="batchTimeInfo.tt" class="w140x">
              <Option value="1">开盘时间</Option>
              <Option value="2">封盘时间</Option>
              <Option value="3">开奖时间</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="error" class="ml30" @click="batchTimeChange('reduce')">-</Button>
            <Input v-model="batchTimeInfo.time" class="w50x ml10 mr10"/>
            <Button type="info" @click="batchTimeChange('add')">+</Button>
            <span class="pl5">秒</span>
          </FormItem>
          <div class="mt20">
            <Button
              class="ivu-btn save ml105 mb20"
              type="primary"
              style="width:250px;"
              @click.prevent="editTimeInfoSave('batchEditTime')"
              :loading="$root.editBtnLoading"
            >确认修改</Button>
          </div>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import {
  lotteryTimeList,
  lotteryTimeOneUp,
  lotteryTimeUp
} from "@/api/lottery";
import { getUserType } from '@/libs/util';
import Tables from "@/components/tables";
import Modals from "@/components/modals";
export default {
  // name: "timeSettingAno",
  components: {
    Tables,
    Modals
  },
  data() {
    return {
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      page: 0,
      searchKey: {},
      singleEditTime: {},
      weekList: [
        { value: "1", name: "星期一" },
        { value: "2", name: "星期二" },
        { value: "3", name: "星期三" },
        { value: "4", name: "星期四" },
        { value: "5", name: "星期五" },
        { value: "6", name: "星期六" },
        { value: "7", name: "星期日" }
      ],
      editTimeInfoValidate: {
        openTime: [
          {
            required: true,
            message: "请设置开盘时间",
            trigger: "change"
          }
        ],
        closeTime: [
          {
            required: true,
            message: "请设置封盘时间",
            trigger: "change"
          }
        ],
        openingTime: [
          {
            required: true,
            message: "请设置开奖时间",
            trigger: "change"
          }
        ],
        offset: [
          {
            required: true,
            message: "偏移矫正不正确",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      //批量信息
      batchTimeInfo: {
        time: 0,
        tt: '1'
      },
      table: {
        loading: true,
        total: 100,
        data: [],
        pageSizeOpts: [50],
        title: "时间设置",
        columns: [
          {
            title: "期数",
            key: "issue",
            align: "center"
            // render: (h, params) => <span>{this.$root.removeYear(params.row.issue)}</span>
          },
          {
            title: "开盘时间",
            key: "openTime",
            align: "center"
          },
          {
            title: "封盘时间",
            key: "closeTime",
            align: "center"
          },
          {
            title: "开奖时间",
            key: "openingTime",
            align: "center"
          },
          {
            title: "偏移校正",
            key: "offset",
            align: "center"
          },
          {
            title: "开奖日期(周)",
            key: "openDay",
            className: "day",
            align: "center",
            render: (h, params) => <span>{this.$root.text(params.row.openDay)}</span>
          },
          {
            title: "操作",
            align: "center",
            render: (h,params) => {
              return (
                <a
                  onClick={() => {this.onEdit(params)}}
                  style={{
                    display: (this.adminType == 'super') || (this.authInPage.indexOf('lotteryTimeOneUp') != -1) ? 'inline-block' : 'none'
                  }}
                >编辑</a>
              )
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getData({ lid: this.$route.query.lid })
    this.$nextTick(() => {
      this.$Message.config({
        top: 50,
        duration: 1
      })
    })
  },
  watch: {
    '$root.nowSite': {
      handler(val) {
        this.getData({ lid: this.$route.query.lid })
      },
      deep: true
    }
  },
  methods: {
    getData(data,stage) {
      this.$root.startTableLoading();
      lotteryTimeList(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { data, total } = res.data;
        this.table.total = total;
        this.table.data = data;
        if (!this.$route.query.type) {
          if(stage == 'true') this.table.columns.splice(5,1)
        }
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    onPageChange(page) {
      let data = {
        lid: this.$route.query.lid,
        params: { page }
      };
      this.page = page;
      this.getData(data,'false');
    },
    onEdit(params) {
      this.$refs.singleEditTime.resetFields()
      this.$refs.editPeriods.show();
      this.singleEditTime = JSON.parse(JSON.stringify(params.row));
      this.singleEditTime.openDay = this.singleEditTime.openDay.split(",");
    },
    //编辑时间 包含单独和批量  singleEditTime单独,需要验证 batchEditTime批量，不需要验证
    editTimeInfoSave(name) {
      const { id, openTime, closeTime, openingTime, offset, openDay } = this.singleEditTime;
      const { tt, time, type } = this.batchTimeInfo;
      let data = {
        lid: this.$route.query.lid,
        params: { page: this.page }
      };
      let postData = {};
      if (name == "singleEditTime") {
        this.$refs.editPeriods.spinShow();
        this.$refs[name].validate(valid => {
          if (valid) {
            postData = {
              id,
              openTime,
              closeTime,
              openingTime,
              offset,
              openDay: openDay.join(","),
              lid: this.$route.query.lid
            };
            lotteryTimeOneUp(postData, true)
              .then(res => {
                this.$refs.editPeriods.spinHide();
                if(res != undefined && res.code == 200){
                  this.$Message.success(res.data)
                  this.$refs.editPeriods.hide();
                  this.getData(data,'false');
                }
              })
              .catch(error => {
                this.$refs.editPeriods.spinHide();
              });
          } else {
            this.$refs.editPeriods.spinHide();
          }
        });
      } else {
        //tt:1开盘,2封盘,3开奖  time:时间 type:1增加,2减少  lid:彩种id
        if (this.batchTimeInfo.tt) {
          this.$refs.editTime.spinShow();
          postData = {
            tt,
            time: Math.abs(time),
            type: time >= 0 ? 1 : 2,
            lid: this.$route.query.lid
          };
          lotteryTimeUp(postData, true).then(res => {
            this.$refs.editTime.spinHide();
            if(res != undefined && res.code == 200) {
              this.$Message.success(res.data)
              this.$refs.editTime.hide();
              this.getData(data,'false');
            }
          }).catch(error => {
            this.$refs.editTime.spinHide();
          })
          // this.batchTimeInfo = {
          //   time: 0,
          //   tt: ""
          // };
        } else {
          this.$Message.error("请选择批量修改的时间类型");
        }
      }
    },
    //批量修改 点击的加减类型
    batchTimeChange(type) {
      type == "reduce" ? this.batchTimeInfo.time-- : this.batchTimeInfo.time++;
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.w120x {
  width: 120px;
  height: 36px;
  line-height: 36px;
  background: #ffffff;
  border: 1px solid #62b1fd;
  color: #62b1fd;
}
/deep/.ivu-form {
  margin-top: 20px;
}
/deep/.ivu-btn{
  height: 36px;
  span{
    margin-top:-5px;
  }
}
</style>


