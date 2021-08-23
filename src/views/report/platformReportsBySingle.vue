<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="开始时间">
          <DatePicker
            type="datetime"
            placeholder="开始时间"
            class="s-180"
            v-model="Time[0]"
            :options="options3"
            format="yyyy-MM-dd HH:mm:ss"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker
            type="datetime"
            placeholder="结束时间"
            class="s-180"
            v-model="Time[1]"
            :options="options3"
            format="yyyy-MM-dd HH:mm:ss"
          ></DatePicker>
        </FormItem>
        <FormItem label="会员账号">
          <Input v-model="searchKey.userName" placeholder="请输入会员账号" class="s-140"/>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="search"
            @click="searchSubmit"
          >查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :page="false"
        @on-sort-change="sortChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Icons from "_c/icons";
import { platformReportsBySingle } from "@/api/report";
import { getUserType } from "@/libs/util";
import GameSelect from "@/components/game-select";
export default {
  name: "platformReportsBySingle",
  components: { Tables, GameSelect, Icons },
  data() {
    return {
      gameStartime: "",
      gameEndtime: "",
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      page: 1,
      searchKey: {
        timeType: "cn",
        startTime: this.$root.startTime(),
        endTime: this.$root.midnight()
      },
      options3: {
        disabledDate: date => {
          return (
            date &&
            date.valueOf() < new Date(this.$root.totalDataStartTime()).getTime()
          );
        }
      },
      Time: [this.$root.startTime(), this.$root.midnight()],
      timeList: [
        { value: "cn", name: "北京时间" },
        { value: "en", name: "美东时间" }
      ],
      table: {
        loading: true,
        data: [],
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "游戏平台",
            key: "platformName",
            align: "center",
            minWidth: 75,
            render: (h, params) => {
              const { platformName } = params.row;
              return (
                <span
                  class={{
                    "blue-font":
                      platformName !== "总计" &&
                      (this.adminType == "super" ||
                        this.authInPage.indexOf(
                          "platformReportsDetailBySingle"
                        ) != -1)
                  }}
                  onClick={() => {
                    if (
                      this.adminType == "super" ||
                      this.authInPage.indexOf(
                        "platformReportsDetailBySingle"
                      ) != -1
                    ) {
                      if (platformName != "总计") this.goDetailPage(params);
                    }
                  }}
                >
                  {platformName}
                </span>
              );
            }
          },
          {
            title: "注单数量",
            key: "betCount",
            align: "center",
            sortable: "custom",
            minWidth: 75
          },
          {
            title: "投注金额",
            key: "betAmount",
            align: "center",
            sortable: "custom",
            minWidth: 75,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.betAmount)}</span>
            )
          },
          {
            title: "有效投注",
            key: "validBetAmount",
            align: "center",
            sortable: "custom",
            minWidth: 75,
            render: (h, params) => (
              <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
            )
          },
          {
            title: "平台输赢",
            key: "netAmount",
            align: "center",
            sortable: "custom",
            minWidth: 75,
            render: (h, params) => (
              <span class="red-font">
                {this.$root.keepTwo(params.row.netAmount)}
              </span>
            )
          },
          {
            title: "盈率",
            key: "winRate",
            align: "center",
            sortable: "custom",
            minWidth: 75,
            render: (h, params) => {
              let { winRate } = params.row;
              if (String(winRate).includes("%")) {
                return (
                  <span class="red-font">
                    {" "}
                    {this.$root.keepTwo(winRate.split("%")[0])}%{" "}
                  </span>
                );
              } else {
                return <span class="red-font">{winRate}%</span>;
              }
            }
          }
        ]
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { gameSearchkey, gameUsername } = vm.$route.params;
      if (gameSearchkey == undefined) {
        return false;
      } else {
        const { startTime, endTime } = gameSearchkey;
        vm.searchKey.userName = gameUsername;
        vm.Time = [
          vm.$root.formatTimeX(startTime),
          vm.$root.formatnightTimeS(endTime)
        ];
        let data = {
          ...vm.searchKey,
          siteId: vm.$root.nowSite.id,
          startTime: vm.$root.formatTimeX(startTime),
          endTime: vm.$root.formatnightTimeS(endTime),
          userName: gameUsername
        };
        vm.getData(data);
      }
    });
  },
  methods: {
    getData(data) {
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.$root.startTableLoading();
      platformReportsBySingle(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { list, total } = res.data;
        list.length && list.push(this.createTotalData(total));
        this.table.data = list;
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    goDetailPage(params) {
      const { platform, platformName } = params.row;
      const { timeType, type, userName } = this.searchKey;
      let [startTime, endTime] = this.Time;
      startTime = this.$root.formatTimeS(startTime);
      endTime = this.$root.formatTimeS(endTime);
      this.$router.push({
        name: "gameReport",
        query: {
          platform,
          startTime,
          endTime,
          timeType,
          platformName,
          userName,
          gameType: params.row.type
        }
      });
    },
    createTotalData(total) {
      const {
        betUser,
        betCount,
        betAmount,
        validBetAmount,
        netAmount,
        winRate,
        actUser,
        actAmount
      } = total;
      let item = {
        platformName: "总计",
        betUser,
        betCount,
        betAmount,
        validBetAmount,
        netAmount,
        winRate,
        actUser,
        actAmount
      };
      return item;
    },
    sortChange({ column, key, order }) {
      if (this.searchKey.userName) {
        delete this.searchKey.sortKey;
        delete this.searchKey.sortVal;
        let data = {
          sortKey: key,
          sortVal: order,
          ...this.searchKey,
          siteId: this.$root.nowSite.id
        };
        this.searchKey.sortKey = key;
        if (data.sortVal == "normal") {
          this.table.columns.forEach(item => {
            if (item.key == column.key) this.$set(item, "sortType", "asc");
          });
          this.searchKey.sortVal = "asc";
          data.sortVal = "asc";
        } else {
          this.searchKey.sortVal = order;
          this.table.columns.forEach(item => {
            delete item.sortType;
          });
        }
        this.getData(data);
        // this.page == 1 ? "" : this.$refs.table.setPage();
        // this.page == 1
        // 	? this.getData({ params: data })
        // 	: this.getData({ params: data, query: { page: 1 } });
      } else {
        this.$Tip.info({ content: "当前暂无可排序数据" });
      }
    },
    searchSubmit() {
      let { sortKey, sortVal } = this.searchKey;
      if (sortKey) delete this.searchKey.sortKey;
      if (sortVal) delete this.searchKey.sortVal;
      this.table.columns.forEach(item => {
        if (item.sortable == "custom") this.$set(item, "sortType", "");
      });
      // this.$refs.table.setPage();
      let params = { ...this.searchKey };
      params.siteId = this.$root.nowSite.id;
      if (this.$root.effectTime(this.Time)) {
        const [startTime, endTime] = this.$root.effectTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeS(startTime);
        params.endTime = endTime && this.$root.formatTimeS(endTime);
      } else {
        return false;
      }
      if (!params.userName) {
        this.table.data = [];
        return false;
      }

      let { startTime, endTime } = params;
      this.searchKey.startTime = startTime;
      this.searchKey.endTime = endTime;

      if (!params.userName) delete params.isLike;

      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);
      let reg = /^[0-9a-zA-Z_-]{5,20}$/;
      if (params.userName && !reg.test(params.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.getData(params);
    },
    clearData() {
      delete this.searchKey.type;
    },
    checkAll(res) {
      return res === "ALL"
        ? Reflect.deleteProperty(this.searchKey, "type")
        : false;
    }
    // onPageChange(page) {
    // 	this.page = page;
    // 	let params = { ...this.searchKey };
    // 	params.siteId = this.$root.nowSite.id;
    // 	if (this.$root.effectTime(this.Time)) {
    // 		const [startTime, endTime] = this.$root.effectTime(this.Time);
    // 		params.startTime = startTime && this.$root.formatTimeS(startTime);
    // 		params.endTime = endTime && this.$root.formatTimeS(endTime);
    // 	} else {
    // 		return false;
    // 	}
    // 	if (!params.userName) {
    // 		this.$Tip.info({ content: "请输入您所查询的会员账号" });
    // 		this.table.data = [];
    // 		return false;
    // 	}

    // 	let { startTime, endTime } = params;
    // 	this.searchKey.startTime = startTime;
    // 	this.searchKey.endTime = endTime;

    // 	if (!params.userName) delete params.isLike;

    // 	for (let key in params) {
    // 		if (!params[key]) delete params[key];
    // 	}
    // 	if (params.userName)
    // 		params.userName = this.$root.trimAll(params.userName);
    // 	let reg = /^[0-9a-zA-Z_-]{5,20}$/;
    // 	if (params.userName && !reg.test(params.userName)) {
    // 		this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
    // 		return false;
    // 	}
    // 	this.getData(params);
    // },
    // onPageSizeChange(pageSize) {
    // 	this.searchKey.limit = pageSize;
    // 	let data = {
    // 		...this.searchKey,
    // 		siteId: this.$root.nowSite.id,
    // 		limit: pageSize
    // 	};
    // 	delete data.startTime;
    // 	delete data.endTime;
    // 	if (this.$root.formatTimeS(this.Time[0]) !== "Invalid date") {
    // 		data.startTime = this.$root.formatTimeS(this.Time[0]);
    // 		data.endTime = this.$root.formatTimeS(this.Time[1]);
    // 	}
    // 	if (!data.userName) delete data.isLike;

    // 	if (!data.userName) {
    // 		this.$Tip.info({ content: "请输入您所查询的会员账号" });
    // 		this.table.data = [];
    // 		return false;
    // 	}

    // 	for (let key in data) {
    // 		if (!data[key]) delete padatarams[key];
    // 	}
    // 	if (data.userName) data.userName = this.$root.trimAll(data.userName);
    // 	let reg = /^[0-9a-zA-Z_-]{5,20}$/;
    // 	if (data.userName && !reg.test(data.userName)) {
    // 		this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
    // 		return false;
    // 	}
    // 	this.getData(data);
    // }
  }
};
</script>

