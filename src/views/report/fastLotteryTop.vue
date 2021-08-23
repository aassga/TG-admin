
<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem v-for="(t, i) in btnList" :key="'btn' + i">
          <Button :class="t == currentBtn ? 'activeBtn' : 'destoryBtn'" @click="changeBtn(t)">{{t}}</Button>
        </FormItem>
        <FormItem label="站点名称">
          <Select class="w140x" placeholder="全部" clearable v-model="searchKey.siteId" filterable>
            <Option v-for="t in siteList" :key="'site' + t.id" :value="t.id">{{t.siteName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="彩票名称">
          <Select class="w140x" placeholder="全部" clearable v-model="searchKey.lotteryId" filterable>
            <Option v-for="t in lotteryList" :key="'lottery' + t.id" :value="t.id">{{t.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="会员账号">
          <Input class="w120x" placeholder="请输入会员账号" v-model="searchKey.userName" />
        </FormItem>
        <FormItem label='投注行为分析'>
          <Select v-model="searchKey.betType" multiple placeholder='全部'>
            <Option v-for="t in optionList" :key="'ball' + t.value" :value="t.value">{{t.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button :loading="$root.tableLoading" type="primary" class="w80x" @click="searchSubmit">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :value="table.data"
        :columns="table.columns"
        :total="table.total"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="onSortChange"
      ></Tables>
    </div>
    <Modals title="添加黑名单" ref="balckAddModal" width="560">
      <div slot="content">
        <Form
          ref="addInfo"
          style="width: 560px;"
          :model="addInfo"
          :rules="addInfoRules"
          :label-width="180"
        >
          <FormItem label="会员账号" prop="userName">
            <Input v-model="addInfo.userName" disabled class="w260x" />
          </FormItem>
          <FormItem label="杀回金额" prop="killAmount">
            <Input placeholder="请输入杀回金额" v-model="addInfo.killAmount" class="w260x" />
          </FormItem>
          <FormItem label="需杀次数" prop="killNum">
            <Input v-model="addInfo.killNum" placeholder="请输入需杀次数" class="w260x" />
          </FormItem>
          <FormItem label="开杀下注金额" prop="killByMaxBetAmount">
            <Input placeholder="请输入开杀下注金额" v-model="addInfo.killByMaxBetAmount" class="w260x" />
          </FormItem>
          <FormItem label="状态">
            <Select class="w260x" v-model="addInfo.status" transfer>
              <Option value="valid">概率控制</Option>
              <Option value="kill">精准控制</Option>
              <Option value="invalid">失效</Option>
            </Select>
          </FormItem>
          <FormItem class="mb40">
            <Button class=" ivu-btn submit" type="primary" @click="submit">确认添加</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Icons from '_c/icons';
import { fastLotteryTop } from "@/api/report";
import { lotteryNameList, fastLotteryBlackListAdd } from "@/api/lottery";
import { mapState } from "vuex";
import Modals from "_c/modals";
export default {
  name: "fastLotteryTop",
  components: {
    Tables,
    Modals,
    Icons
  },
  computed: {
    ...mapState({
      siteList: state => state.user.accessSite
    })
  },
  data() {
    return {
      page: 1,
      btnList: ["近7天", "近30天", "近3月"],
      currentBtn: "近7天",
      searchKey: {
        siteId: this.$root.nowSite.id,
        lotteryId: "",
        userName: "",
        startTime: "",
        endTime: "",
        betType: ''
      },
      optionList: [
        {name: '7码', value: 'moreBall_7'},
        {name: '8码', value: 'moreBall_8'},
        {name: '9码', value: 'moreBall_9'},
        {name: '10码', value: 'moreBall_10'},
        {name: '倍投', value: 'doubleBet'}
      ],
      table: {
        data: [],
        loading: true,
        total: 0,
        columns: [
          {
            title: "站点名称",
            key: "siteName",
            align: "center"
          },
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            render: (h, params) => (
              <span
                style={{color: params.row.online == 'yes' ? '#FF2626' : this.currentBtn == '近7天' ? '#57a3f3' : ""}}
                class="cs"
                onClick={() => {
                  if (this.currentBtn == "近7天") {
                    this.$router.push({
                      name: "fastLotteryTopDetail",
                      query: {
                        startTime: this.searchKey.startTime,
                        endTime: this.searchKey.endTime,
                        gameType: "lottery",
                        platform: params.row.platform,
                        userName: params.row.userName,
                        siteId: params.row.siteId,
                        siteName: params.row.siteName
                      }
                    });
                  }
                }}
              >
                {params.row.userName}
              </span>
            )
          },
          {
            title: "彩票名称",
            key: "lotteryName",
            align: "center"
          },
          {
            title: "注单数量",
            key: "betCount",
            align: "center",
            sortable: "custom"
          },
          {
            title: "投注金额",
            key: "betAmount",
            align: "center",
            sortable: "custom"
          },
          // {
          //   title: "有效投注",
          //   key: "validBetAmount",
          //   align: "center",
          //   sortable: "custom"
          // },
          {
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            sortable: "custom"
          },
          {
            align: 'center',
            tooltip: true,
            width: 350,
            renderHeader: (h, params) => {
              return (
                <Poptip trigger='hover' placement='bottom' transfer word-wrap style={{verticalAlign: 'middle'}}>
                  <div slot='content' style={{width: '457px', borderRadius: '3px',marginLeft: '35px',marginTop:'15px',marginBottom:'15px'}}>
                    <div>
                      <div style={{display:'inline-block',width:'64px',height:'22px',borderRadius:'11px',border:'1px solid #c6c6c6',textAlign:'center',marginLeft:'5px'}}>六=6码</div>
                      <div style={{display:'inline-block',width:'64px',height:'22px',borderRadius:'11px',border:'1px solid #c6c6c6',textAlign:'center',marginLeft:'10px'}}>七=7码</div>
                      <div style={{display:'inline-block',width:'64px',height:'22px',borderRadius:'11px',border:'1px solid #c6c6c6',textAlign:'center',marginLeft:'10px'}}>八=8码</div>
                      <div style={{display:'inline-block',width:'64px',height:'22px',borderRadius:'11px',border:'1px solid #c6c6c6',textAlign:'center',marginLeft:'10px'}}>九=9码</div>
                      <div style={{display:'inline-block',width:'64px',height:'22px',borderRadius:'11px',border:'1px solid #c6c6c6',textAlign:'center',marginLeft:'10px'}}>十=10码</div>
                      <div style={{display:'inline-block',width:'64px',height:'22px',borderRadius:'11px',border:'1px solid #c6c6c6',textAlign:'center',marginLeft:'10px'}}>倍=倍投</div>
                    </div>
                    <div style={{height:'2px',background:'#c6c6c6',marginTop:'10px',marginBottom:'10px'}}></div>
                    <div>
                        <span>例:表格中显示</span>
                        <div style={{display:'inline-block',width:'50px',height:'24px',borderRadius:'5px',border:'1px solid #00a5d8',background:'#bbf2ff',marginLeft:'8px',marginRight:'8px'}}>
                          <span style={{display:'inline-block',height:'24px',lineHeight:'24px',fontSize:'16px',opacity:'0.5',width:'22px',textAlign:'center',color:'#00a5d8',borderRight:'1px dashed #00a5d8'}}>倍</span>
                          <span style={{display:'inline-block',height:'24px',lineHeight:'24px',fontSize:'16px',opacity:'0.5',width:'22px',textAlign:'center',color:'#00a5d8'}}>25</span>
                        </div>
                        <span>的标签，即表示在当前搜索条件下产生了25次倍投行为</span>
                      </div>
                  </div>
                  <span>投注行为分析</span>
                  <Icons type='bangzhutishi' color='#E4E4E4' style={{paddingLeft: '8px'}}/>
                </Poptip>
              )
            },
            render: (h, params) => {
              const { moreBall_7, moreBall_8, moreBall_9, moreBall_10, doubleBet } = params.row
              let list = []
              let _list = [
                { name: '七', value: moreBall_7, bgColor: '#eaf2ff', bdColor: '1px solid #4172c6', cColor: '1px dashed #4172c6'},
                { name: '八', value: moreBall_8, bgColor: '#e2fff1', bdColor: '1px solid #239961', cColor: '1px dashed #239961'},
                { name: '九', value: moreBall_9, bgColor: '#ffecd9', bdColor: '1px solid #ea7500', cColor: '1px dashed #ea7500'},
                { name: '十', value: moreBall_10, bgColor: '#ffefef', bdColor: '1px solid #e60202', cColor: '1px dashed #e60202'},
                { name: '倍', value: doubleBet, bgColor: '##bbf2ff', bdColor: '1px solid #00a5d8', cColor: '1px dashed #00a5d8'}
              ]
              if (+moreBall_7 != 0) list.push(_list[0])
              if (+moreBall_8 != 0) list.push(_list[1])
              if (+moreBall_9 != 0) list.push(_list[2])
              if (+moreBall_10 != 0) list.push(_list[3])
              if (+doubleBet != 0) list.push(_list[4])
              return (
                <div>
                  <div style={{display: list && list.length > 0 ? 'block' : 'none',marginBottom: '5px'}}>
                    {
                      list && list.map(t => {
                        return (
                          <div style={{display:'inline-block',height:'24px',borderRadius:'5px',border:t.bdColor,background:t.bgColor,marginLeft:'8px',marginRight:'8px',marginTop:'5px'}}>
                            <span style={{display:'inline-block',height:'24px',lineHeight:'24px',fontSize:'16px',opacity:'0.5',paddingLeft: '3px',paddingRight: '3px',textAlign:'center',color:'#00a5d8',borderRight:t.cColor}}>{t.name}</span>
                            <span style={{display:'inline-block',height:'24px',lineHeight:'24px',fontSize:'16px',opacity:'0.5',paddingLeft: '3px',paddingRight: '3px',textAlign:'center',color:'#00a5d8'}}>{t.value}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div style={{display: list && list.length == 0 ? 'block' : 'none'}}>-</div>
                </div>
              )
            }
          },
          {
            title: "最近投注时间",
            key: "updated_at",
            align: "center",
            render: (h, params) => (
              <span>
                {this.$moment.unix(params.row.updated_at).format("YYYY-MM-DD")}
              </span>
            )
          },
          {
            title: "操作",
            align: "center",
            render: (h, params) => (
              <span
                class="cs"
                style={{
                  color: params.row.isBlack == "yes" ? "#cdcdcd" : "#57a3f3"
                }}
                onClick={() => {
                  if (params.row.isBlack == "no") {
                    this.$refs.addInfo.resetFields();
                    this.addInfo.userName = params.row.userName;
                    this.addInfo.siteId = params.row.siteId
                    this.addInfo.status = "valid";
                    this.$refs.balckAddModal.show();
                  }
                }}
              >
                加入黑名单
              </span>
            )
          }
        ]
      },
      lotteryList: [],
      addInfo: {
        userName: "",
        killAmount: "",
        killNum: "",
        killByMaxBetAmount: "",
        status: "valid"
      },
      addInfoRules: {
        userName: [{ required: true, message: "请输入会员账号" }],
        killAmount: [
          {
            required: true,
            message: "请输入正确的杀回总额",
            pattern: /^(([0-9]\d*))$/,
            trigger: "blur"
          }
        ],
        killNum: [
          {
            required: true,
            message: "请输入正确的需杀次数",
            pattern: /^(([0-9]\d*))$/,
            trigger: "blur"
          }
        ],
        killByMaxBetAmount: [
          {
            required: true,
            message: "请输入正确的开杀下注金额",
            trigger: "blur",
            pattern: /^(([0-9]\d*))$/
          }
        ]
      }
    };
  },
  mounted() {
    this.getLotteryNameList();
    this.changeBtn("近7天");
  },
  methods: {
    changeBtn(btn) {
      this.currentBtn = btn;
      this.searchKey.endTime = this.$root.todayEndTime();
      switch (btn) {
        case "近7天":
          this.searchKey.startTime = this.$moment()
            .day(this.$moment().day() - 6)
            .format("YYYY-MM-DD 00:00:00");
          break;
        case "近30天":
          this.searchKey.startTime = this.$moment()
            .day(this.$moment().day() - 29)
            .format("YYYY-MM-DD 00:00:00");
          break;
        case "近3月":
          this.searchKey.startTime = this.$moment()
            .subtract(2, "months")
            .startOf("month")
            .format("YYYY-MM-DD 00:00:00");
          break;
      }
      this.getData({ params: this.searchKey });
    },
    getLotteryNameList() {
      lotteryNameList().then(res => {
        if (res != undefined && res.code == 200)
          this.lotteryList = res.data.sort1.fast;
      });
    },
    getData(data) {
      if (data.params.betType) data.params.betType = data.params.betType.join(',')
      for (let key in data.params) {
        if (!data.params[key]) delete data.params[key];
      }
      this.$root.startTableLoading();
      fastLotteryTop(data)
        .then(res => {
          this.$root.endTableLoading();
          if (res != undefined && res.code == 200) {
            let { data, total } = res.data;
            this.table.total = total;
            this.table.data = data;
          }
        })
        .catch(error => {
          this.$root.endTableLoading();
        });
    },
    searchSubmit() {
      let { sortKey, sortVal } = this.searchKey;
      if (sortKey) delete this.searchKey.sortKey;
      if (sortVal) delete this.searchKey.sortVal;
      this.table.columns.forEach(t => {
        if (t.sortable == "custom") this.$set(t, "sortType", "");
      });
      this.$refs.table.setPage();
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.userName && !this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
        return false;
      }
      this.$refs.table.setPage();
      this.getData({ params: data });
    },
    onPageChange(page) {
      this.page = page;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.userName && !this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
        return false;
      }
      this.getData({ params: data, query: { page: this.page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.userName && !this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
        return false;
      }
      this.getData({ params: data });
    },
    submit() {
      this.$refs.addInfo.validate(valid => {
        if (valid) {
          this.$refs.balckAddModal.spinShow();
          let data = { ...this.addInfo };
          fastLotteryBlackListAdd(data, true)
            .then(res => {
              this.$refs.balckAddModal.spinHide();
              if (res != undefined && res.code == 200) {
                this.searchSubmit();
                this.$refs.balckAddModal.hide();
                this.$Message.success("加入黑名单成功");
              }
            })
            .catch(error => this.$refs.balckAddModal.spinHide());
        }
      });
    },
    onSortChange({ column, key, order }) {
      delete this.searchKey.sortKey;
      delete this.searchKey.sortVal;
      let data = { sortKey: key, sortVal: order, ...this.searchKey };
      this.searchKey.sortKey = key;
      if (data.sortVal == "normal") {
        this.table.columns.forEach(t => {
          if (t.key == column.key) this.$set(t, "sortType", "asc");
        });
        this.searchKey.sortVal = "asc";
        data.sortVal = "asc";
      } else {
        this.table.columns.forEach(t => delete t.sortType);
        this.searchKey.sortVal = order;
      }
      this.page == 1 ? "" : this.$refs.table.setPage();
      this.page == 1
        ? this.getData({ params: data })
        : this.getData({ params: data, query: { page: 1 } });
    }
  }
};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
.activeBtn {
  height: 36px;
  background-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.destoryBtn {
  height: 36px;
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
</style>

