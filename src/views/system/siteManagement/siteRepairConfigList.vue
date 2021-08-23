<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem
          v-show="(checkedArr.length >= 1) && (adminType == 'super' || authInPage.indexOf('siteRepairConfigUpt') != -1)"
        >
          <Button type="primary" @click="batchSet">批量设置</Button>
        </FormItem>
        <FormItem label="站点类型">
          <Select clearable v-model="searchKey.site_class" class="w80x"  placeholder="全部">
						<Option v-for="(t, i) in  siteClass" :key="i" :value="t.key">{{ t.name }}</Option>
					</Select>
        </FormItem>
        <FormItem>
          <Select :class="screen<1400?'s-120':'s-100'" v-model="searchKey.type">
            <Option value="siteName">站点名称</Option>
            <Option value="siteCode">站点代号</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input placeholder="请输入关键字" class="s-160" v-model="searchKey.siteVal" />
        </FormItem>
        <FormItem label="状态">
          <Select class="s-86" placeholder="全部" v-model="searchKey.status" clearable>
            <Option value="no">维护</Option>
            <Option value="yes">开放</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button
            class="h36"
            type="primary"
            @click="getData(searchKey)"
            :loading="$root.tableLoading||loading"
          >查询</Button>
        </FormItem>
        <FormItem>
          <Button
            class="h36"
            type="primary"
            @click="allBatchSet"
            :loading="$root.tableLoading||loading"
          >全站维护</Button>
        </FormItem>
      </Form>
    </div>
    <Row>
      <Spin size="large" fix v-if="spinShow" style="margin-top:100px">
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div'+t"></div>
        </div>
      </Spin>
      <CheckboxGroup v-model="selected" @on-change="select" v-if="!spinShow">
        <div class="checkBox fl" 
          :class="screen>=1921?'w445x':screen<1921&&screen>=1537?'w325x':screen<1537&&screen>=1460?'w330x':'w300x'" 
          v-for="item in this.table.data" :key="item.id">
          <Checkbox :label="item.siteId">{{null}}</Checkbox>
          <Icons type="weihu3" v-show="item.status=='no'" size="38" class="weihu" color="#FF5858"></Icons>
          <div style="flex:1" class="pt10 pr15">
            <Row class="nowrap">
                <span class="w70x ib nowrap">站点名称 :</span>
                <span class=" ib over">
                  <Tooltip :content="item.siteName">
                    {{item.siteName}}
                  </Tooltip >
                </span>
              <span class="w115x ib txt-r fr nowrap">站点代号 : <span class="ib w35x txt-l ">{{item.siteCode}}</span></span>
            </Row>
            <Row style="line-height:42px">
              <span class="ib nowrap" v-if="item.status == 'yes'"><span class="ib w70x">当前状态 : </span>开放</span>
              <span class="ib nowrap" v-if="item.status != 'yes'"><span class="ib w70x">当前状态 : </span><span class="red-font">维护</span></span>
              <span class="w115x ib txt-r fr nowrap" @click="setItem(item)">操作设置 : <a class="ib w35x txt-l">设定</a></span>
            </Row>
            <Row class="nowrap">
              <span
                class="ib w80 hidden"
              >{{item.status=='yes'?'结束时间 : ' : '开放时间 : '}} {{item.status=='yes'?'-':$root.newUnixTime(item.openTime)}}</span>
              <a
                class="w35x fr ib blue-font txt-l"
                v-if="item.status != 'yes'"
                @click="showDetail(item)"
            >详情</a>
            </Row>
          </div>
        </div>
      </CheckboxGroup>
    </Row>
    <Modals
      ref="setStatus"
      title="站点设置"
      width="900"
      @modalVisible="modalVisible"
      @closeModal="closeModal"
    >
      <div slot="content">
        <Form
          ref="statusTable"
          :model="statusTable"
          :rules="rules"
          style="width: 900px;"
          :label-width="130"
        >
          <FormItem  label='维护站点' class="mt20">
            <p class="w730x ib" v-if="changeObj.obj.includes('单个')">
              <span class="mr20 vm">: {{changeObj.name}}</span>
              <span class="vm">站点代号 : {{changeObj.code}}</span>
            </p>
            <!-- <p class="w730x ib" v-if="changeObj.obj.includes('多个')">多个站点</p> -->
            <div
              class="ib ft14"
              style="position: relative"
              v-if="changeObj.obj.includes('多个')"
              @click="changeShow(true)"
            >
             {{checkedArr.length}}个
              <span class="blue-font pl5">查看</span>
              <div style="position: absolute;zIndex: 9999;" class="w150x ml20" v-show="show">
                <div
                  class="top w150x txt-a white-font"
                  style="background: #2D8CF0;borderRadius: 5px"
                >
                  <p class="clearfix">
                    已选站点列表
                    <Icon
                      type="md-close"
                      color="#ffffff"
                      class="fr mt8 mr8"
                      @click.stop="changeShow(false)"
                    />
                  </p>
                  <div style="background: #ffffff;" class="blue-font insideModal b">
                    <div v-for="(t,i) in checkedArr" :key="'checked' + i">
                      <p
                        style="background: #ffffff;width: 80%;margin: auto;borderRadius: 5px;marginTop: 10px;marginBottom: 10px;"
                        class="b"
                      >
                        <span class="blue-font">{{t.siteName}}</span>
                        <Icon
                          type="md-close"
                          color="#2D8CF0"
                          class="fr mt8 mr8"
                          v-if="showClose"
                          @click.capture="removeItem(t, i)"
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem label="站点状态" prop="status">
            <RadioGroup v-model="statusTable.status">
              <Radio label="no">维护</Radio>
              <Radio label="yes">开放</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="结束时间" prop="openTime" v-if="statusTable.status == 'no'">
            <DatePicker
              type="datetime"
              v-model="statusTable.openTime"
              format="yyyy-MM-dd HH:mm"
              placeholder="请输入维护结束时间"
              :options="timeOptions"
              class="w300x"
              transfer
            ></DatePicker>
          </FormItem>
          <FormItem prop="description" label="描述信息" v-if="statusTable.status == 'no'">
            <!-- <UE :defaultMsg="defaultContent" :config="config" :id="ue1" ref="ue1"></UE> -->
            <kindeditor class="fl" :width="'700'" :height="'140'" :content="defaultContent" :id="ue1" ref="ue1" :key="ue1"></kindeditor>
          </FormItem>
          <div class="txt-a mb40">
            <Button type="primary" class="ivu-btn submit" @click.prevent="save">确认保存</Button>
          </div>
        </Form>
      </div>
    </Modals>
    <Modals ref="showDescription" title="描述信息" width="800">
      <div slot="content">
        <div class="m20 ft14 div" v-html="showDescription">{{showDescription}}</div>
      </div>
    </Modals>
  </div>
</template>
<script>
import UE from "_c/UE";
import kindeditor from '_c/kindeditor';
import Icons from "_c/icons";
import { uploadImg } from "@/api/common";
import { getToken } from "@/libs/util";
import Modals from "_c/modals";
import { siteRepairConfigList, siteRepairConfigUpt } from "@/api/system";
import { getUserType } from "@/libs/util";
import { mapState } from 'vuex';
export default {
  name: "siteRepairConfigList",
  components: {
    Modals,
    Icons,
    kindeditor,
    UE
  },
  computed:{
          ...mapState({siteClass: state => state.user.siteClass,})
		},
  data() {
    return {
      screen:screen.width,
      selected: [],
      spinShow: false,
      newIds: [],
      loading: false,
      defaultContent: "",
      config: {
        initialFrameWidth: 750,
        initialFrameHeight: 250
      },
      uploadForm: {
        headers: { Authorization: getToken() },
        action: "/api/v2/uploadImg",
        data: { siteId: "" },
        name: "img",
        defaultList: [],
        path: "",
        src: ""
      },
      ue1: "ue1",
      screen: screen.width,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      show: false,
      showClose: true,
      timeOptions: {
        disabledDate: date =>
          date &&
          date.valueOf() < new Date(this.$root.todayStartTime()).getTime()
      },
      changeObj: {
        obj: "",
        con: ""
      },
      checkedArr: [],
      showDescription: "",
      searchKey: {
        siteVal: "",
        status: "",
        type: "siteName",
        site_class: ""
      },
      statusTable: {
        id: "",
        status: "",
        description: "",
        openTime: "",
        siteId: ""
      },
      rules: {
        status: [
          {
            required: true,
            message: "请选择站点状态",
            trigger: "change",
            pattern: /.+/
          }
        ],
        openTime: [
          {
            required: true,
            message: "请输入维护结束时间",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        description: [
          { required: true, message: "请输入描述信息", trigger: "blur" }
        ]
      },
      table: {
        data: []
      }
    };
  },
  mounted() {
    console.log(this.siteClass)
    this.getData(this.searchKey);
  },
  methods: {
    setItem(data) {
      this.$refs.statusTable.resetFields();
      let { status, openTime, description, id, siteId } = data;
      this.statusTable = {
        status,
        description,
        openTime: this.$root.newUnixTime(String(openTime)),
        id,
        siteId
      };
      if (this.statusTable.openTime == "-") delete this.statusTable.openTime;
      this.changeObj = {
        obj: "单个站点",
        con: "全部内容",
        name: data.siteName,
        code:data.siteCode
      };
      this.checkedArr = [{ ...this.statusTable }];
      this.$nextTick(() => {
        this.$refs.setStatus.show();
        if (status == "no") {
          // this.$refs.ue1.setContent(description);
          this.defaultContent = description
					// this.$refs.ue1._data.editor.body.innerHTML = description;
        }
      });
    },
    select(val) {
      this.checkedArr = [];
      val.forEach(t => {
        this.table.data.forEach(m => {
          if (m.siteId == t) {
            this.checkedArr.push(m);
          }
        });
      });
    },
    showDetail(data) {
      if (data.description == "") {
        // this.$Message.info('该站点暂无维护描述信息')
      } else {
        this.showDescription = data.description;
        // this.showDescription=`<span style='color:red'>42432</span>`
        this.$refs.showDescription.show();
      }
    },
    closeModal() {
      this.checkedArr = [];
      this.selected = [];
      this.table.data.forEach(t => {
        this.$set(t, "_checked", false);
      });
    },
    getData(obj) {
      let postData = { ...obj };
      postData[obj.type] = obj.siteVal;
      delete postData.type;
      delete postData.siteVal;
      for (let key in postData) {
        if (!postData[key]) delete postData[key];
      }
      let nameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      let codeReg = /^[a-z][a-z0-9]$/;
      if (postData.siteName)
        postData.siteName = this.$root.trimAll(postData.siteName);
      if (postData.siteCode)
        postData.siteCode = this.$root.trimAll(postData.siteCode);
      if (postData.siteName && !nameReg.test(postData.siteName)) {
        this.$Tip.info({ content: "您所查询的站点名称不正确,请重新输入" });
        return false;
      }
      if (postData.siteCode && !codeReg.test(postData.siteCode)) {
        this.$Tip.info({ content: "您所查询的站点代号不正确,请重新输入" });
        return false;
      }
      this.spinShow = true;
      postData.limit=100;
      siteRepairConfigList(postData)
        .then(res => {
          if (res != undefined && res.code == 200) {
            let { total, data } = res.data;
            this.table.total = total;
            this.table.data = data;
            this.spinShow = false;
          } else {
            this.spinShow = false;
          }
        })
        .catch(() => (this.spinShow = false));
    },
    changeShow(flag) {
      this.show = flag;
    },
    removeItem(t, i) {
      this.checkedArr.splice(i, 1);
      this.selected = [];
      this.checkedArr.forEach(t => {
        this.selected.push(t.id);
      });
      let ids = [];
      this.checkedArr.forEach(k => ids.push(k.id));
      this.table.data.forEach(x => {
        this.$set(x, "_checked", ids.includes(x.id));
      });
      if (this.checkedArr.length <= 1) this.showClose = false;
    },
    modalVisible(flag) {
      if (!flag) {
        this.show = false;
      }
    },
    batchSet() {
      this.$refs.statusTable.resetFields();
      this.changeObj = {
        obj: this.checkedArr.length==1?'单个站点':"多个站点",
        con: "全部内容",
        name:this.checkedArr.length==1?this.checkedArr[0].siteName:''
      };
      this.$refs.setStatus.show();
    },
    allBatchSet() {
      this.loading = true;
      this.$refs.statusTable.resetFields();
      this.changeObj = {
        obj: "多个站点",
        con: "全部内容"
      };
      siteRepairConfigList({ limit: 100 })
        .then(res => {
          if (res != undefined && res.code == 200) {
            let ids = [];
            let siteIds = [];
            this.checkedArr = res.data.data;
            this.checkedArr.forEach(t => {
              ids.push(t.id);
              siteIds.push(t.siteId);
            });
            this.table.data.forEach(x => {
              this.$set(x, "_checked", ids.includes(x.id));
            });
            this.$refs.setStatus.show();
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    setTable() {
      let ids = [];
      let siteIds = [];
      this.checkedArr.forEach(t => {
        ids.push(t.id);
        siteIds.push(t.siteId);
      });
      this.statusTable.id = ids.length == 1 ? ids[0] : ids.join(",");
      this.statusTable.siteId =
        ids.length == 1 ? siteIds[0] : siteIds.join(",");
      this.statusTable.openTime = this.$root.formatTimeS(
        this.statusTable.openTime
      );
      this.statusTable.description = this.statusTable.description;
      this.statusTable.status = this.statusTable.status;
    },
    save() {
      // this.statusTable.description =
      //   this.statusTable.status == "no" ? this.$refs.ue1.getUEContent() :'' ;
        this.statusTable.description =
        this.statusTable.status == "no" ?this.$refs.ue1.outContent :'' ;
      this.$refs.statusTable.validate(valid => {
        if (valid) {
          this.setTable();
          let { openTime } = this.statusTable;
          let postData = { ...this.statusTable };
          if (postData.status == "yes") {
            postData.description = "";
            postData.openTime = "";
          }
          if (
            postData.status == "no" &&
            new Date(postData.openTime).getTime() <= new Date().getTime()
          ) {
            this.$Message.error("结束时间不能小于当前时间");
            return false;
          }
          this.$refs.setStatus.spinShow();
          if (postData.openTime)
            postData.openTime = this.$moment(openTime).format(
              "YYYY-MM-DD HH:mm:00"
            );
          this.table.data.forEach(t => {
            t.spinShow = true;
          });
          siteRepairConfigUpt(postData, true)
            .then(res => {
              this.$refs.setStatus.spinHide();
              if (res != undefined && res.code == 200) {
                this.checkedArr = [];
                this.selected = [];
                this.$Message.success(res.data);
                this.$refs.setStatus.hide();
                this.getData(this.searchKey);
              }
            })
            .catch(() => this.$refs.setStatus.spinHide());
          // }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button";
.insideModal {
  max-height: 150px;
  overflow-y: scroll;
}
.vm {
  vertical-align: middle
}
.w325x {
  width: 325px;
}
.w445x {
  width: 445px;
}
.w330x {
  width:330px
}
.w300x {
  width: 300px;
}
.div {
  letter-spacing: 2px;
  line-height: 25px;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 760px;
  word-wrap: break-word;
  font-size: 1.125rem;
}
/deep/.ivu-tooltip{
  width: 100%;
  height: 100%;
}
/deep/.ivu-tooltip-rel {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: top;
  line-height: 42px;
  width: 100%;
  height: 100%;
}
.over {
  overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  height: 42px;
  vertical-align: top;
  width: ~"calc(100% - 202px)";
}
.weihu {
  vertical-align: top;
  position: absolute;
  right: 0;
  top: 0;
  color:white;
  height: 36px;
  line-height: 36px;
}
.hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nowrap {
  white-space: nowrap;
  height: 42px;
  line-height: 42px;
}

/deep/.ivu-form-item-error-tip {
  font-size: 12px;
  color: red;
  font-weight: normal;
}
.ivu-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
/deep/.ivu-checkbox {
  height: 100%;
  line-height: 42px;
  padding: 10px 20px 0 10px;
}
/deep/.ivu-checkbox-group-item {
  margin-right: 0;
  width: 36px;
}
.checkBox {
  // width: 325px;
  height: 140px;
  display: flex;
  margin: 0 10px 20px 0;
  border: 1px solid #dcdcdc;
  position: relative;
   &:hover {
    border: 1px solid #2d8cf0;
  }
}
</style>