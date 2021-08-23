<template>
  <div>
    <div class="v2-table">
      <Tables
        ref="tables"
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :page="false"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
    </div>
    <!-- 编辑权限弹框 -->
    <Modals
      title="编辑权限"
      @modalVisible="modalChange(arguments)"
      width="1140"
      ref="editPermission"
      height="600"
    >
      <div slot="content">
        <ButtonGroup style="marginleft: 12px">
          <Button
            class="fontColor ft16 h40x"
            v-for="(t, i) in currentPermission"
            :key="i"
            :class="currentBtn == t.menu_name ? 'bd-bg w160x' : 'bg-or w160x'"
            @click="changeCurrent(t.menu_name)"
          >
            <span>{{ t.menu_name }}</span>
          </Button>
        </ButtonGroup>
        <div style="maxheight: 480px; overflow-y: auto">
          <div
            v-for="(t, i) in currentPermission"
            v-if="t.menu_name == currentBtn"
            :key="i"
            class="clearfix"
          >
            <div v-for="(item, index) in t.newList" :key="'in' + index"> 
              <div
                class="pre"
                @click="checkChange(item)"
                v-if="!item.value.includes('hide')"
              >
                <Checkbox v-model="item.checked" :label="item.name" class="ml10">
                  <span @click="checkChange(item)">{{ item.value }}</span>
                  <Poptip
                    v-if="tipList[item.name]"
                    trigger="hover"
                    :content="tipList[item.name]"
                    transfer
                  >
                    <Icons type="bangzhutishi" color="#E4E4E4" size="18"></Icons>
                  </Poptip>
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
        <Button class="tijiao" @click="savePremission">提交保存</Button>
      </div>
    </Modals>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Modals from "_c/modals";
import Icons from "_c/icons";
import { adminRolesList, adminRolesUpdate } from "@/api/system";
import Tables from "@/components/tables";
// adminRolesList adminRolesUpdate
export default {
  components: {
    Tables,
    Modals,
    Icons,
  },
  computed: {
    ...mapState({
      authMenu: (state) => state.user.authMenu,
      tipList: (state) => state.info.tipList,
    }),
  },
  data() {
    return {
      menuEdit: [],
      postData: {
        menu: [],
        newInput: "",
        id: "",
        description: "",
      },
      exitAuthMenu: [],
      currentBtn: "会员管理",
      currentPermission: [], // 总的权限
      table: {
        pageSizeOpts: [20, 30, 40, 50],
        total: 0,
        loading: true,
        columns: [
          {
            title: "ID",
            key: "id",
            align: "center",
          },
          {
            title: "角色名称",
            key: "title",
            align: "center",
          },
          {
            title: "角色描述",
            key: "description",
            align: "center",
            render: (h, params) => {
              const { description } = params.row;
              return (
                <div>
                  <span
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "none"
                          : "inline-block",
                    }}
                  >
                    {description}
                  </span>
                  <Input
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}
                    placeholder="请输入角色描述"
                    type="text"
                    value={description}
                    onInput={(e) => {
                      if (e) {
                        this.$set(params.row, "description", e);
                      } else {
                        this.$set(params.row, "description", "");
                      }
                    }}
                  />
                </div>
              );
            },
          },
          {
            title: "更新时间",
            key: "updated_at",
            align: "center",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.updated_at)}</span>;
            },
          },
          {
            title: "操作",
            key: "",
            align: "center",
            render: (h, params) => {
              const { code } = params.row;
              let color =
                code == "super" || code == "ordinary" ? "#918b8b" : "#2D8CF0";
              return (
                <div>
                  <span
                    class="blue-font cs"
                    style={{
                      display:
                        params.row.showStatus == "span"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.$set(params.row, "showStatus", "input");
                    }}
                  >
                    描述
                  </span>
                  <div
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    <a
                      onClick={() => {
                        let data = {
                          id: params.row.id,
                          description: params.row.description,
                        };
                        if (!data.description) {
                          data.description = "-";
                        }
                        adminRolesUpdate(data, true).then((res) => {
                          if (res != undefined && res.code == 200) {
                            this.$Message.success("修改成功");
                            params.row.showStatus = "span";
                            this.table.data[params.index].description =
                              data.description;
                          }
                        });
                      }}
                    >
                      确定
                    </a>
                    <a
                      class="ml10"
                      onClick={() => {
                        params.row.showStatus = "span";
                      }}
                    >
                      取消
                    </a>
                  </div>
                  <span
                    class="cs ml10"
                    style={{
                      color,
                      display:
                        params.row.showStatus == "span"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      if (code != "super" && code != "ordinary") {
                        this.postData.id = params.row.id;
                        this.postData.description = params.row.description;
                        if (params.row.menu) {
                          this.exitAuthMenu = JSON.parse(params.row.menu);
                          this.currentPermission.forEach((item) => {
                            item.newList.forEach((child) => {
                              this.exitAuthMenu.forEach((inline) => {
                                for (let key in inline.list) {
                                  if (key == child.name) {
                                    child.checked = true;
                                  }
                                }
                              });
                            });
                            
                          });

                          this.$forceUpdate();
                        } else {
                          this.exitAuthMenu = [];
                        }

                        this.$refs.editPermission.show();
                        this.currentBtn = "会员管理";
                      }
                    }}
                  >
                    编辑
                  </span>
                </div>
              );
            },
          },
        ],
        data: [],
      },
    };
  },
  created() {
    this.getData();
    this.createNew();
  },
  methods: {
    modalChange(value) {
      let falg = value[0];
      if (!falg) {
        this.createNew();
      }
    },
    createNew() {
      this.currentPermission = JSON.parse(this.authMenu);
      this.currentPermission.forEach((item) => {
        item.newList = [];
        for (let key in item.list) {
          item.newList.push({
            name: key,
            value: item.list[key],
            checked: false,
          });
        }
      

        if (this.rentType == "rent") {
          item.newList.forEach((t) => {
            for (let key in t) {
              if (
                t[key] == "快速彩票" ||
                t[key] == "彩票时间设置" ||
                t[key] == "香港六合彩开盘设置" ||
                t[key] == "赔率设置" ||
                t[key] == "官方彩开奖" ||
                t[key] == "快速彩开奖" ||
                t[key] == "快速彩票排行榜" ||
                t[key] == "高杀率名单" ||
                t[key] == "快速彩黑名单" ||
                t[key] == "回滚结算" ||
                t[key] == "彩票撤单" ||
                t[key] == "新增站点" ||
                t[key] == "全站维护" ||
                t[key] == "游戏控制/返水设置" ||
                t[key] == "游戏维护" ||
                t[key] == "系统预设" ||
                t[key] == "支付平台管理" ||
                t[key] == "鸿运当头记录/设置" ||
                t[key] == "支付统计" ||
                t[key] == "支付方式"
                // ||
                // t[key] == "工资等级"||
                // t[key] == "分红等级"||
                // t[key] == "支出工资"||
                // t[key] == "发放分红"||
                // t[key] == "催账记录"||
                //  t[key] == "支付余额"||
                //   t[key] == "活动审核"
              ) {
                t[key] = "hide";
              }
              if (t[key] == "单站游戏") {
                t[key] = "游戏管理";
              }
            }
          });
        }else{
            item.newList.forEach((t) => {
            for (let key in t) {
              if (
             
                t[key] == "工资等级"||
                t[key] == "分红等级"||
                t[key] == "支出工资"||
                t[key] == "发放分红"||
                t[key] == "催账记录"||
                 t[key] == "支付余额"||
                  t[key] == "活动审核"
              ) {
                t[key] = "hide";
              }
            
            }
          });

        }
      });
    },
    getData() {
      this.$root.startTableLoading();
      adminRolesList()
        .then((res) => {
          if (res != undefined && res.code == 200) {
            res.data.forEach((item) => (item.showStatus = "span"));
            this.table.data = res.data;
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    changeCurrent(stage) {
      this.currentBtn = stage;
    },
    checkChange(data) {
      let con = this.currentPermission
        .find((t) => t.menu_name == this.currentBtn)
        .newList.find((k) => k.name == data.name);
      this.$set(con, "checked", !con.checked);
    },
    savePremission() {
      this.postData.menu = JSON.parse(JSON.stringify(this.currentPermission));
      this.postData.menu.forEach((item) => {
        item.newList = item.newList.filter((item) => item.checked == true);

        item.newList.forEach((t) => {
          delete t.checked;
        });
      });
      this.postData.menu.forEach((item) => {
        item.list = {};
        item.newList.forEach((temp, index) => {
          item.list[temp.name] = temp.value;
        });
        delete item.newList;
      });
      let data = this.postData;
      data.menu = JSON.stringify(this.postData.menu);
      adminRolesUpdate(data, true).then((res) => {
        if (res != undefined && res.code == 200) {
          this.getData();
          this.$Message.success("修改成功");
        }
      });
      this.$refs.editPermission.hide();
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
/deep/.ivu-btn-group {
  /deep/.ivu-btn {
    span {
      margin-top: 3px;
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
.pre {
  display: block;
  width: 18.5%;
  float: left;
  margin-left: 13.5px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #e4e4e4;
  // margin-top: 20px;
  margin-block-end: 15px;
  /deep/.ivu-checkbox-wrapper,
  .ivu-checkbox-wrapper-checked,
  .ivu-checkbox-default {
    margin-left: 18px;
  }
}
.tijiao {
  display: block;
  width: 260px;
  margin: 20px auto;
  background-color: #2d8cf0;
  color: #ffffff;
  height: 50px;
  font-size: 1.25rem /* 20/16 */;
  left: 38%;
}
.clearfix {
  margin-top: 20px;
}
</style>