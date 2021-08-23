<template>
  <div>
    <Modals
      :title="
        type == 'add'
          ? '新增广告'
          : type == 'edit'
          ? '编辑广告'
          : type == 'blank'
          ? '加入广告黑名单'
          : '续费广告'
      "

      	@closeModal="closeWithdrawal()"
      width="760"
      ref="showAdv"
    >
      <div slot="content">
        <Form
          style="position: relative"
          ref="formKey"
          :model="formKey"
          :rules="rules"
          :label-width="260"
        >
          <FormItem label="代理账号">
            <span class="red-font ib" style="position: absolute; left: -78px"
              >*</span
            >
            <AutoSearch
              v-model="formKey.username"
              :stage="'all'"
              ref="autoSearch"
              :width="260"
              v-if="type == 'edit'|| type == 'add'"
              :siteId="$root.nowSite.id"
              @sendSuperior="getUserName"
              :placeholder="'关键字查询'"
            ></AutoSearch>
            <Input
              class="w260x"
              v-if="type == 'vt' || type == 'blank'"
              disabled
              v-model="formKey.username"
              placeholder="关键字查询"
            />
          </FormItem>
          <FormItem label="主域名" prop="main_domain">
            <Input
              :disabled="type == 'vt' || type == 'blank'"
              v-model="formKey.main_domain"
              class="w260x"
              placeholder="如xxx.com"
            />
          </FormItem>
          <FormItem label="子域名">
            <Input
              type="textarea"
              :disabled="type == 'vt' || type == 'blank'"
              class="w260x"
              :autosize="{ minRows: 2, maxRows: 6 }"
              v-model="formKey.sub_domain"
              placeholder="可批量添加，一行一个，如xxx.com  yyy.com"
            />
          </FormItem>
          <FormItem
            style="position: relative"
            label="广告日期"
            v-if="type != 'blank'"
          >
            <span class="red-font ib" style="position: absolute; left: -78px"
              >*</span
            >
            <DatePicker
              transfer
              class="w120x"
              type="date"
              v-model="Time[0]"
              placeholder="开始日期"
              :options="timeOptions"
            />
            <span class="ml5"></span>
            -
            <span class="mr5"></span>
            <DatePicker
              type="date"
              transfer
              :options="timeOptions"
              v-model="Time[1]"
              class="w120x"
              placeholder="结束日期"
            />
          </FormItem>
          <FormItem label="本期价格" prop="amount" v-if="type != 'blank'">
            <Input
              type="number"
              v-model="formKey.amount"
              class="w260x"
              placeholder="请输入本期价格"
            />
          </FormItem>
          <FormItem label="备注">
            <Input
              v-model="formKey.remark"
              maxlength="50"
              class="w260x"
              placeholder="请输入不超过50字描述"
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="saveSubmit"
              class="ivu-btn submit w260x ft14"
              :loading="$root.editBtnLoading"
              >确认保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
    <Modals
      title="温馨提示"
      ref="blackTipMain"
      width="600"
      :mask-closable="false"
      v-show="mainExistsCount > 0 && mainExistsList"
    >
      <div slot="content" style="text-align: center">
        <div class="content w400x ib txt-a">
          <p class="ft16 mb10 txt-l">
            <Icon type="ios-alert" size="30" color="#2d8cf0" />
            以下有<span
              class="red-font"
              v-if="mainExistsCount > 0 && mainExistsList"
            >
              {{ mainExistsCount }}</span
            >个主域名已存在广告黑名单中，请重新输入
          </p>
          <Input
            type="textarea"
            v-if="mainExistsCount > 0 && mainExistsList"
            :autosize="{ minRows: 5, maxRows: 10 }"
            :placeholder="mainExistsList"
            class="w400x"
            readonly
          />
          <Button
            class="btn mt30 ft20 mb20"
            type="primary"
            @click.prevent="onConfirmMain"
            >确认</Button
          >
        </div>
      </div>
    </Modals>
    <Modals
      title="温馨提示"
      ref="blackTipSub"
      width="600"
      :mask-closable="false"
      v-show="subExistsCount > 0 && subExistsCount"
    >
      <div slot="content" style="text-align: center">
        <div class="content w400x ib txt-a">
          <p class="ft16 mb10 txt-l">
            <Icon type="ios-alert" size="30" color="#2d8cf0" />
            以下有<span
              class="red-font"
              v-if="subExistsCount > 0 && subExistsCount"
              >{{ subExistsCount }}</span
            >个子域名已存在广告黑名单中，请重新输入
          </p>
          <Input
            type="textarea"
            v-if="subExistsCount > 0 && subExistsCount"
            :autosize="{ minRows: 5, maxRows: 10 }"
            :placeholder="subExistsList"
            class="w400x"
            readonly
          />
          <Button
            class="btn mt30 ft20 mb20"
            type="primary"
            @click.prevent="onConfirmSub"
            >确认</Button
          >
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Modals from "@/components/modals";
import { adDetailCreate, adDetailEdit, adBlacklistCreate } from "@/api/report";
import AutoSearch from "_c/auto-search";
export default {
  name: "addAdv",
  components: {
    Modals,
    AutoSearch,
  },
  props:['tabName'],
  data() {
    return {
      timeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 31536000000;
        },
      },
      newId: "",
      formKey: {
        siteId: this.$root.nowSite.id,
        username: "",
        main_domain: "",
        sub_domain: "",
        amount: "",
        remark: "",
        end_time: "",
        start_time: "",
      },
      rules: {
        main_domain: [
          {
            required: true,
            message: "请输入主域名",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        amount: [
          {
            required: true,
            message: "请输入本期价格",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
      },
      Time: [],
      mainExistsCount: "", //主域名个数
      mainExistsList: "",
      subExistsCount: "", //主域名个数
      subExistsList: "",

      type: "add",
    };
  },
  methods: {
    closeWithdrawal(){
     this.$refs.showAdv.spinHide();
    },
    onConfirmMain() {
      this.$refs.blackTipMain.hide();
    },
    onConfirmSub() {
      this.$refs.blackTipSub.hide();
    },
    getUserName(val) {
      this.formKey.username = val;
    },
    show(type, params) {
      this.$refs.formKey.resetFields();
      this.type = type;
      // this.formKey.username = val;
      if (type == "edit") {
        const {
          username,
          main_domain,
          sub_domain,
          start_time,
          end_time,
          amount,
          remark,
          id,
        } = params.row;
        console.log(username)
        this.$refs.autoSearch.setDefault(username);
        this.formKey.username = username;
        this.formKey.main_domain = main_domain;
        this.formKey.id = id;
        
        let newSubdomain = String(sub_domain);
        let reg = /(?=,(\s\S)*),/g;
        newSubdomain = newSubdomain.replace(reg, "\n");
        this.formKey.sub_domain = newSubdomain;
        this.formKey.amount = amount;
        this.formKey.remark = remark;
        this.Time[0] = start_time;
        this.Time[1] = end_time;
      }
      if (type == "vt") {
        const { username, main_domain, sub_domain, amount } = params.row;
       
        this.formKey.username = username;
        this.formKey.main_domain = main_domain;

        this.Time = [];

        this.formKey.sub_domain = String(sub_domain);
      }
      if (type == "blank") {
        const { username, main_domain, sub_domain, amount, id } = params.row;
        this.formKey.remark="";
        this.newId = id;
        this.formKey.username = username;
        this.formKey.main_domain = main_domain;
        this.Time = [];
        this.formKey.sub_domain = String(sub_domain);
      }
      if (type == "add") {
        this.formKey.username="";
        this.formKey = {};
        this.$refs.formKey.resetFields();
        this.Time = [];
      }
      this.$refs.showAdv.show();
    },

    saveSubmit() {
      this.$root.startEditLoading();
   
      this.$refs.formKey.validate((valid) => {
        if (valid) {
          
          this.$refs.showAdv.spinShow();
          if (this.type == "edit") {
            let data = {
              ...this.formKey,
              siteId:this.$root.nowSite.id,
              start_time: this.$root.formatTime(this.Time[0]),
              end_time: this.$root.formatTime(this.Time[1]),
            };
            if (!data.start_time || !data.end_time) {
              this.$Tip.info({ content: "请输入广告日期" });
              return false;
            }

            if (
              data.start_time == "Invalid date" ||
              data.end_time == "Invalid date"
            ) {
              this.$Tip.info({ content: "请输入开始和结束日期！" });
              return false;
            }
            if (
              new Date(data.end_time).getTime() -
                new Date(data.start_time).getTime() <
              0
            ) {
              this.$Tip.info({ content: "结束日期必须大于开始日期" });
              return false;
            }
            for (let key in data) {
              if (!data[key]) delete data[key];
        
            }

            adDetailEdit(data, true).then((res) => {
              if (res && res.code == 200) {
                 this.$refs.showAdv.spinHide();
                this.$refs.showAdv.hide();
                let params = { ...this.$parent.searchKey };
                for (let key in params) {
                  if (!params[key]) delete params[key];
                }
                this.$parent.getData({ params },'detialTable');
              }
            }).catch(()=>{  this.$refs.showAdv.spinHide();})
          }

          if (this.type == "add" || this.type == "vt") {
            let data = {
              ...this.formKey,
              siteId: this.$root.nowSite.id,
              start_time: this.$root.formatTime(this.Time[0]),
              end_time: this.$root.formatTime(this.Time[1]),
            };
            for (let key in data) {
              if (!data[key]) delete data[key];
            }
            if (!data.username) {
              this.$Tip.info({ content: "请输入代理账号" });
              return false;
            }

            if (!data.start_time || !data.end_time) {
              this.$Tip.info({ content: "请输入广告日期" });
              return false;
            }

            if (
              data.start_time == "Invalid date" ||
              data.end_time == "Invalid date"
            ) {
              this.$Tip.info({ content: "请输入开始和结束日期！" });
              return false;
            }
            if (
              new Date(data.end_time).getTime() -
                new Date(data.start_time).getTime() <
              0
            ) {
              this.$Tip.info({ content: "结束日期必须大于开始日期" });
              return false;
            }

            adDetailCreate(data).then((res) => {
              if (res && res.code == 200) {
                  this.$root.endEditLoading();
         
                  this.$refs.showAdv.spinHide();
              
                let params = { ...this.$parent.searchKey };
                for (let key in params) {
                  if (!params[key]) delete params[key];
                }
                if(this.tabName=='总报表'){
                  this.$parent.getData({ params },'allTable');
                }
                 if(this.tabName=='明细表'){
                  // this.$parent.getDetailData({ params });
                    this.$parent.getData({ params },'detialTable');
                }
                
                //主域名  子域名

                const { main_exists, sub_exists, exists_domain } = res.data;
                if (main_exists) {
                  if (typeof main_exists == "string") {
                    this.mainExistsCount = Array(main_exists).length;
                  }
                  if (typeof main_exists == "object") {
                    this.mainExistsCount = main_exists.length;
                  }
                }
                if (sub_exists) {
                  this.subExistsCount = sub_exists.length;
                }

                this.mainExistsList = main_exists;
                this.subExistsList = sub_exists.join(",");
                if (this.mainExistsCount > 0) this.$refs.blackTipMain.show();
                if (this.subExistsCount > 0) this.$refs.blackTipSub.show();
                if (this.mainExistsCount == 0 && this.subExistsCount == 0) {
                  this.$refs.showAdv.hide();
                }
                if (this.type == "add") {
                  this.$nextTick(() => {
                    this.$refs.autoSearch.removeDefault();
                  });
                }
              }
            }).catch(()=>{ this.$refs.showAdv.spinHide();})
          }

          if (this.type == "blank") {
            let data = {
              ...this.formKey,
              siteId: this.$root.nowSite.id,
              report_id: this.newId,
            };
            for (let key in data) {
              if (!data[key]) delete data[key];
            }
            adBlacklistCreate(data).then((res) => {
              if (res && res.code == 200) {
                this.$refs.showAdv.spinHide();
                this.$refs.showAdv.hide();
                const { main_exists, sub_exists, exists_domain } = res.data;
                if (main_exists) {
                  if (typeof main_exists == "string") {
                    this.mainExistsCount = Array(main_exists).length;
                  }
                  if (typeof main_exists == "object") {
                    this.mainExistsCount = main_exists.length;
                  }
                }
                if (sub_exists) {
                  this.subExistsCount = sub_exists.length;
                }
                this.mainExistsList = main_exists;
                this.subExistsList = sub_exists && sub_exists.join(",");

                if (this.mainExistsCount > 0) this.$refs.blackTipMain.show();
                if (this.subExistsCount > 0) this.$refs.blackTipSub.show();
                if (this.mainExistsCount == 0 && this.subExistsCount == 0) {
                  this.$refs.showAdv.hide();
                }
              }
            }).catch(()=>{  this.$refs.showAdv.spinHide();})
            let params = { siteId: this.$root.nowSite.id };
            this.$parent.getData({ params },'allTable');
          }
          this.$root.endEditLoading();
          // this.$refs.formKey.resetFields();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../../styles/button.css";
/deep/.content {
  text-align: center;
  form {
    margin: 40px auto;
  }
  .ivu-btn {
    width: 120px;
    height: 50px;
    font-size: 20px;
  }
}
</style>