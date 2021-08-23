<template>
  <div>
    <div class="expand">
      <div class="section flex-row br">
        <div class="row w15 bt bl ti10" style="width:20%;">
          <div class="col bb">团队净盈利：1000000.00</div>
          <div class="col bb">团队返点：10000.00</div>
          <div class="col bb">团队返水：1000000.00</div>
          <div class="col bb">优惠金额：10000000.00</div>
        </div>
        <div class="row w30 bt bl ti10 ">
          <div class="col bb">
            存款总额：1000000.00
            <span class="red-font">（500000笔，10000人）</span>
          </div>
          <div class="col bb">
            公司入款：200000.00
            <span class="red-font">（500笔，100人）</span>
          </div>
          <div class="col bb">
            线上支付：800.00
            <span class="red-font">（500笔，100人）</span>
          </div>
          <div class="col bb">
            取款总额：6000.00
            <span class="red-font">（500笔，100人）</span>
          </div>
        </div>
        <div class="row w15 bt bl ti10">
          <div class="col bb">输赢报表：100000000.00</div>
          <div class="col bb">投注金额：100000000.00</div>
          <div class="col bb">中奖金额：10000000.00</div>
          <div class="col bb">现金报表：0.00</div>
        </div>

        <div class="row w15 bt bl ti10" v-show="(!search_type) || (search_type == 'vip')">
          <div class="col bb">代理工资：10000.00</div>
          <div class="col bb">代理佣金：10000.00</div>
          <div class="col bb">代理分红：1000.00</div>
          <div class="col bb">
            赔率详情：
            <a><span class="blue-font" @click="this.check">点此查看</span></a>
          </div>
        </div>

        <div class="row w40 bt bl ti10" v-show="search_type == 'agency'">
          <div class="col bb">投注人数：100</div>
          <div class="col bb">有效投注：10000.00</div>
          <div class="col bb">
            赔率详情：
            <a class="blue-font"><span class="blue-font" @click="this.check">点此查看</span></a>
          </div>
          <div class="col bb">注册时间:2019-1-23 16:00:35</div>
        </div>
        <div class="row w20 bt bl ti10" v-show="(!search_type) || (search_type == 'vip')">
          <div class="col bb">投注人数：10000</div>
          <div class="col bb">有效投注：1000000.00</div>
          <div class="col bb">
            下级人数:
            <a><span class="blue-font-nc" >202</span></a>
            <Tooltip placement="right">
              <Icons type="bangzhutishi" :size="18"/>
              <div slot="content">代理：100，会员：10人</div>
            </Tooltip>
          </div>
          <div class="col bb">注册时间:2019-1-23 16:00:35</div>
        </div>
      </div>
      <div class="remarks ti10 bl br bb">备注：</div>
    </div>
    <Modals ref="odds" title="赔率详情">
      <div slot="content">
        <div>
          <p class="ft16">返点信息</p>
          <div class="con">
            <ButtonGroup class="ml15">
              <Button
                v-for="(item,index) in fdList"
                :key="index"
                value="item.key"
                :class="fd_type == item.key ? 'active m15 detail-bt' : 'm15 detail-bt'"
                @click="() => {change_fd_style(item.key)}"
              >{{item.value}}</Button>
            </ButtonGroup>
            <ul>
              <li
                v-for="(item,index) in fdData"
                :key="index"
                class="inblo ml15 mb20 ft14 w15"
              >{{item.value}}：0.5%</li>
          
            </ul>
          </div>
        </div>
        <div class="mt15">
          <p class="ft16">返水信息</p>
          <div class="con">
            <ButtonGroup class="ml15">
              <Button
                v-for="(item,index) in fsList"
                :key="index"
                :class="fs_type == item.key ? 'active m20 detail-bt' : 'm20 detail-bt'"
                @click="() => {change_fs_style(
                  item.key)}"
              >{{item.value}}</Button>
            </ButtonGroup>
            <ul>
              <li
                v-for="(item,index) in fsData"
                :key="index"
                class="inblo mb20 ft14 w15 ml15"
              >{{item.value}}：0.5%</li>
            </ul>
          </div>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import Modals from "@/components/modals";
import vuex from "@/store";
import { mapState } from "vuex";
export default {
  props: ["fd_type", "fs_type", "search_type"],
  components: {
    Icons,
    Modals
  },
  computed: {
    ...mapState({
      fdList: state => state.info.lotteryType,
      fsList: state => state.info.fsList
    })
  },
  methods: {
    check() {
      this.$refs.odds.show();
    },
    change_fd_style(key) {
      this.$emit("change_fd_type", key);
    },
    change_fs_style(key) {
      this.$emit("change_fs_type", key);
    },
    //获取返点信息
    getData() {
      let list = this.fdList.filter(item => {
        if (item.key == this.fd_type) {
          return item.info;
        }
      });
      this.fdData = list[0].info;
    },
    //获取返水信息
    getData2() {
      let list = this.fsList.filter(item => {
        if (item.key == this.fs_type) {
          return item.info;
        }
      });
      this.fsData = list[0].info;
    }
  },
  data() {
    return {
      fdData: [],
      fsData: []
    };
  },
  watch: {
    fd_type() {
      this.getData();
    },
    fs_type() {
      this.getData2();
    }
  },
  mounted() {
    this.getData();
    this.getData2();
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/class.less";
.detail-bt {
  width: 100px;
  height: 36px;
  border-radius: 5px !important;
}
.con {
  // height: 100px;
  background: #e4e4e4;
}
.inblo {
  display: inline-block;
}
</style>


