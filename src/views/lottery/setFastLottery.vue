<template>
    <div>
      <div class=" mr10 fl hh36 v3-button ">
        <Select v-model="searchKey.lotteryId"  @on-change="changeId">
            <Option v-for="(t,i) in fastlotteryData" @click.native="changeName(t.name,t.id)" :key="i" :value="t.id">{{t.name}}</Option>
        </Select>
      </div>
      <div class="v2-button" >
        <Button
          @click="openInit"
          class="w160x ft16 "
          v-if="(adminType == 'super') || (authInPage.indexOf('fastLotteryOpenInit') != -1) || (authInPage.indexOf('fastLotteryOpenInitBySite') != -1)"
        >预设开奖结果</Button>
      </div>
      <div class="v2-table">
        <Tables
          editable
          :columns="table.columns"
          :loading="$root.tableLoading"
          :value="table.data"
          :total="table.total"
          @on-page-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
          :pageSizeOpts="table.pageSizeOpts"
        ></Tables>
        <Modals title="预设开奖结果" width="750" ref="openInit">
          <div slot="content">
            <Form
              ref="openInitInfo"
              style="width:750px;"
              :label-width="110"
              :model="openInitInfo"
              :rules="openInitInfoRules"
            >
              <FormItem label="彩票名称">
                <span class="ft20 fontColor">{{name}}</span>
              </FormItem>
              <FormItem label="彩票期数" prop="issue" class="fix">
                <Input v-model="openInitInfo.issue" class="w320x" placeholder="请输入彩票期数"/>
                <span class="pl5">期</span>
              </FormItem>
              <FormItem label="开奖号码" class="periods">
                <div class="clearfix">
                  <p v-for="(t, i) in resultLength" :key="'lottery'+t" class="fl">
                    <Input class="inp ib" v-model="openInitInfo.resultInfo[i]"/>
                    <span class="p10 yc">-</span>
                  </p>
                </div>
              </FormItem>
              <FormItem>
                <Button type="primary" class=" ft16 ivu-btn submit " @click.prevent="addInit" style="marginLeft:135px;">确认保存</Button>
              </FormItem>
            </Form>
          </div>
        </Modals>
      </div>
    </div>
  </template>
  <script>
  import {
    fastLotteryResConfigItems,
    fastLotteryResConfigIns,
    fastLotteryResConfigDel,
    lotteryPayMoney,
    lotteryPulicData
  } from "@/api/lottery";
  import Modals from "_c/modals";
  import Tables from "@/components/tables";
  import { mapState } from "vuex";
  import Icons from '_c/icons';
  import { testfastLotteryInfo, getUserType } from "@/libs/util";
  export default {
    name: "fastLotteryDetails",
    components: { Tables, Modals, Icons },
    computed: {
      ...mapState({
        sixLotteryColor: state => state.info.sixLotteryColor
      })
    },
    data() {
      return {
        name:'快速赛车',
        id:12,
        fastlotteryData:[],
        adminType: getUserType(),
        authInPage: JSON.parse(localStorage.authInPage),
        stage: "", //single为单站  all为全站
        testInfo: {},
        searchKey: {
          lotteryId: 12,
          siteId: this.$root.nowSite.id,
          limit: 20
        },
        openInitInfo: {
          siteId: this.$root.nowSite.id,
          lotteryId: "",
          lotteryName: "",
          issue: null,
          resultInfo: []
        },
        openInitInfoRules: {
          issue: [
            {
              required: true,
              pattern: /^[+]{0,1}(\d+)$/,
              message: "请输入正确的期数"
            }
          ]
        },
        resultLength:[],
        // resultLength: this.$root.getLotteryLength(this.$route.query.lotteryId),
        table: {
          pageSizeOpts: [20, 30, 40, 50],
          loading: true,
          total: 0,
          title: "彩票详情",
          data: [],
          columns: [
            {
              title: "期数",
              key: "issue",
              align: "center",
              minWidth: 100
              // render: (h, params) => <span>{this.$root.removeYear(params.row.issue)}</span>
            },
            {
              title: "开奖结果",
              key: "resultInfo",
              align: "center",
              minWidth: 270,
              render: (h, params) => {
                let { resultInfo } = params.row;
                let { lotteryId } = this.$route.query;
                let bgColor;
                if (resultInfo) {
                  return resultInfo.split(",").map(item => {
                    if (lotteryId == 1 || lotteryId == 18 || lotteryId == 19) {
                      this.sixLotteryColor.map(color => {
                        if (color.number.includes(item * 1)) {
                          bgColor = color.color;
                        }
                      });
                    } else {
                      let c1 = parseInt(Math.random() * 256);
                      let c2 = parseInt(Math.random() * 256);
                      let c3 = parseInt(Math.random() * 256);
                      bgColor = `rgba(${c1},${c2},${c3},.9)`;
                    }
                    return h(
                      "span",
                      {
                        style: {
                          color: "#fff",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          marginLeft: "5px",
                          display: "inline-block",
                          backgroundColor: bgColor,
                          textShadow: "1px 1px 1px #000"
                        }
                      },
                      item
                    );
                  });
                } else {
                  return <span>-</span>;
                }
              }
            },
            {
              title: "状态",
              key: "status",
              align: "center",
              width: 70,
              render: (h, params) => (
                <span>{params.row.status == "no" ? "待开奖" : "已开奖"}</span>
              )
            },
            {
              title: "开奖时间",
              key: "openingTime",
              align: "center",
              minWidth: 130,
              render: (h, params) => (
                <span>{this.$root.unixTime(params.row.openingTime)}</span>
              )
            },
            {
              title: "添加时间",
              key: "created_at",
              align: "center",
              minWidth: 130,
              render: (h, params) => (
                <span>{this.$root.unixTime(params.row.created_at)}</span>
              )
            },
            {
              title: "添加者",
              key: "addUser",
              align: "center",
              minWidth:75,
              tooltip:true,
            },
            {
              title: "操作",
              align: "center",
              minWidth: 35,
              render: (h, params) => {
                let color = params.row.status == "no" ? "#2D8CF0" : "#918b8b";
                // let display;
                // if (this.stage == 'single') {
                //   display = (params.row.resultInfo == '') && ((this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryUpdateOpenBySite') != -1)) ? 'inline-block' : 'none'
                // } else {
                //   display = (params.row.resultInfo == '') && ((this.adminType == 'super') || (this.authInPage.indexOf('fastLotteryUpdateOpen') != -1)) ? 'inline-block' : 'none'
                // }
                return (
                  <div>
                    <a
                      style={{ color }}
                      onClick={() => {
                        if (params.row.status == "no") {
                          this.$Tip.confirm({
                            content: `您确定删除${
                              this.name
                            }【${params.row.issue}】吗？`,
                            onOk: () => {
                              let data = {
                                siteId: this.$root.nowSite.id,
                                id: params.row.id
                              };
                              fastLotteryResConfigDel(data, true).then(res => {
                                if (res != undefined && res.code == 200) {
                                  this.$Message.success("删除成功");
                                  this.table.data.splice(params.index, 1);
                                }
                              });
                            }
                          });
                        }
                      }}
                    >
                      删除
                    </a>
                    <a class="ml10"
                    style={{  display:
                          this.adminType == "super" ||
                          this.authInPage.indexOf("lotteryPayMoney") != -1
                            ? "inline-block"
                            : "none"}}
                    onClick={()=>{
                      let  data={
                        issue: params.row.issue,
                        lid: params.row.lotteryId,
                        siteId: this.$root.nowSite.id
                      }
                       lotteryPayMoney(data).then(res => {
                            this.getData(this.searchKey);
                          });
                    }}>结算</a>
                  </div>
                );
              }
            }
          ]
        }
      };
    },
    mounted() {
      this.resultLength=this.$root.getLotteryLength(this.searchKey.lotteryId);
      //  console.log(this.resultLength)
      this.getData(this.searchKey);
      lotteryPulicData().then(res=>{
          this.fastlotteryData=res.data.fastlottery;
      })
    },
    methods: {
      changeName(name,id){
        // console.log(name)
        // console.log(id)
        this.name=name;
        this.id=id;
        // console.log(this.$root.getLotteryLength(this.id))
        this.resultLength=this.$root.getLotteryLength(this.id);
        // console.log(this.table)  
        // console.log(this.table.data)
        // console.log(this.table.data.length)
       
      },
        changeId(t){
            // console.log(t);
            this.searchKey.lotteryId=t;
        this.getData(this.searchKey);        },
      getData(data) {
        this.$root.startTableLoading();
        fastLotteryResConfigItems(data).then(res => {
          if (res != undefined && res.code == 200) {
            let { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
         
          } 
          this.$root.endTableLoading()
        }).catch(error=> this.$root.endTableLoading());
        this.testInfo = {};
        this.testInfo = testfastLotteryInfo(this.id);
      },
      onPageChange(page) {
        this.searchKey.page = page;
        let data = { ...this.searchKey };
        this.getData(data);
      },
      onPageSizeChange(pageSize) {
        this.searchKey.limit = pageSize;
        this.getData(this.searchKey);
      },
      openInit() {
        this.$refs.openInitInfo.resetFields();
        this.$refs.openInit.show();
        this.openInitInfo.issue = "";
        this.openInitInfo.resultInfo = [];
      },
      addInit() {
        // console.log(111)
        let reg = /^[0-9]\d*$/;
        let arr = [];
        let arr1 = [];
        this.$refs.openInitInfo.validate(valid => {
          if (valid) {
          //  console.log(11111)
            this.openInitInfo.resultInfo.forEach(item => arr.push(item));
            let flag1, flag2;
            flag1 = arr.length == this.resultLength ? true : false;
            arr.forEach(item => {
              if (reg.test(item)) arr1.push(item);
            });
            flag2 = arr1.length == this.resultLength ? true : false;
            if (!flag1 || !flag2) {
              this.$Message.error("开奖号码错误，请重新输入");
              return false;
            }
            // console.log(this.testInfo)
            let obj = JSON.parse(JSON.stringify(this.testInfo));
            // console.log(11111222)
            // console.log(obj)
            if (
              this.name.includes("时时彩") ||
              this.name.includes("快3")
            )
              obj.repeat = true;
            if (!obj.repeat) {
              // console.log(this.openInitInfo.resultInfo)
              // let arr2 = [...new Set(this.openInitInfo.resultInfo)];
              let arr2=JSON.parse(JSON.stringify(this.openInitInfo.resultInfo));
              
              let arr3 = this.openInitInfo.resultInfo.filter(
                (i, v) => i < obj.maxNum
              );
              if (arr3.length != this.openInitInfo.resultInfo.length) {
                this.$Tip.info({ content: `最小为0最大为${obj.maxNum - 1}` });
                return false;
              }
            //   console.log(arr2)
            //  console.log(arr2.length)
            //  console.log(this.openInitInfo.resultInfo.length)
              if (arr2.length != this.openInitInfo.resultInfo.length) {
                this.$Tip.info({ content: "该彩票开奖不能重复" });
                return false;
              }
            } else {
              let a = this.openInitInfo.resultInfo.filter(
                (i, v) => i < obj.maxNum
              );
              if (a.length != this.openInitInfo.resultInfo.length) {
                this.$Tip.info({ content: `最小为0最大为${obj.maxNum - 1}` });
                return false;
              }
            }
         
            this.$refs.openInit.spinShow();
            let data = { ...this.openInitInfo,lotteryId:this.id,lotteryName:this.name};
        
            let list = [];
            data.resultInfo.forEach(item => {
              if (String(item).length == 1) list.push(`0${item}`);
              else list.push(item);
            });
            data.resultInfo = list.join(",");
            fastLotteryResConfigIns(data, true)
              .then(res => {
                this.$refs.openInit.spinHide();
                if (res != undefined && res.code == 200) {
                  this.$refs.openInit.hide();
                  this.$Message.success(res.data);
                  this.getData(this.searchKey);
                }
              })
              .catch(error => this.$refs.openInit.spinHide());
          }
        });
      }
    }
  };
  </script>
  <style lang="less" scoped>
  @import "../../styles/button.less";
  .inp {
    width: 40px;
    height: 36px;
  }
  .hh36 {
    height: 36px;
    line-height: 36px;
  }
  .periods {
    p {
      &:nth-last-child(1) {
        span {
          display: none !important;
        }
      }
    }
  }
  /deep/.ivu-form-item-error-tip {
    padding-left: 0;
  }
  .parentBtn{
    position: relative;
  }
  .childIcon{
    position: absolute;
    left: 10px;
  }
  </style>
  