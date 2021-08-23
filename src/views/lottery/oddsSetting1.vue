<template>
  <div>
    <div class="v2-search clearfix">
      <div class="v2-button fl" v-if="(adminType == 'super') || (authInPage.indexOf('lotteryUpdateOddsSiteidLid') != -1)">
        <Button class="w120x" v-show="oddsStatus" @click="btnShow">修改赔率</Button>
        <div v-show="!oddsStatus" class="ib">
          <Button @click="save(1)" :loading="$root.editBtnLoading" class="w120x">确认保存</Button>
          <Button @click="save(0)" class="w120x">取消修改</Button>
        </div>
      </div>
      <div class="fl clearfix">
        <span class="ib mr15">玩法描述</span>
        <Input placeholder="请输入完整的玩法描述" v-model="play" class="w165x h36"/>
        <Button type="primary" class="ivu-btn bg ib ml20" @click="toTegional">查询</Button>
      </div>
      <div class="font-bold ft18 fr mr30">当前彩票：{{$route.query.lotterName || ""}}</div>
    </div>
    <div class="v2-table">
      <!-- <Spin size='large' fix v-if="spinShow"></Spin> -->
      <table class="bt ivu-table ivu-table-default ivu-table-border" cellspacing="0" cellpadding="0" border="0" >
        <tr style="font-size:1rem;">
          <th class="ivu-table-column-center w15 bl font549">玩法描述</th>
          <th class="ivu-table-column-center w60 font549">号码</th>
          <th class="ivu-table-column-center w10 font549">赔率</th>
          <th class="ivu-table-column-center w10 font549">返水</th>
        </tr>
        <tr v-for="(item,i) in oddData.oddsInfo" :key="'row'+ i">
          <td class="ivu-table-column-center w15 bl" :id="item.title" :style="{color: play == item.title ? '#2D8CF0' : ''}">{{item.title}}</td>
          <td class="ivu-table-column-center w60" :style="{color: play == item.title ? '#2D8CF0' : ''}">{{item.ball}}</td>
            <!-- 赔率 -->
          <td class="ivu-table-column-center w10">
            <span v-if="oddsStatus">{{item._oddsMin}}</span>
            <span v-else class="ib clearfix">
              <InputNumber v-model="item.oddsMin" v-if="typeof item.oddsMin === 'number'" :step="0.01" :min="0" />
              <span v-else>
                <InputNumber class="ib w40" v-model="item.oddsMin[0]" :step="0.01" :min="0" />
                <InputNumber class="ib w40" v-model="item.oddsMin[1]" :step="0.01" :min="0" />
              </span>
            </span>
          </td>
          <!-- 返水 -->
          <td class="ivu-table-column-center w10">
            <span v-if="oddsStatus">{{item._fsrate}}</span>
            <InputNumber v-else v-model="item.fsrate" :step="0.01" :min="0" :disabled="!item.editable" />%
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { lotteryOddsSiteId, lotteryUpdateOddsSiteidLid } from "@/api/lottery";
import { getUserType } from '@/libs/util';
export default {
  data() {
    return {
      spinShow: true,
      newArray:"",
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      play: '', //搜索玩法的关键字
      oddData: {},
      formKey: {
        lotteryId: this.$route.query.lotteryId,
        siteId: this.$root.nowSite.id,
        lotterName:this.$route.query.lotterName,
      },
      isTitle:false,
      oddsStatus: true
    };
  },
  created() {
    this.getData(this.formKey);
    this.$Message.config({
      top: 50,
      duration: 1
    })
  },
  methods: {
    btnShow() {
      this.oddsStatus = false;
      this.transform();
    },
    transform() {
      let { oddsInfo } = this.oddData;
      if (this.oddsStatus) {
        // 当取消修改的时候，返回原来的值
        oddsInfo.forEach(item => {
          item.oddsMin = item._oddsMin;
          item.oddsMax = item._oddsMax;
        });
      } else {
        // 点击修改按钮的时候，做以下操作
        oddsInfo.forEach(item => {
          if (typeof item.oddsMin === "string" && item.oddsMin.includes("/")) {
            item.oddsMin = item.oddsMin.split("/");
            item.oddsMin = item.oddsMin.map(Number);
            item.oddsMax = item.oddsMax.split("/");
            item.oddsMax = item.oddsMax.map(Number);
          }
        });
      }
    },
    getData(data) {
      this.spinShow = true
      // 正码B 特码B返水可修改 其他不可修改
      lotteryOddsSiteId(data).then(res => {
        res.data.oddsInfo.forEach(item => {
          if ((item.title).includes('正码B') || (item.title).includes('特码B')) this.$set(item, 'editable', true)
          item._oddsMin = item.oddsMin;
          item._oddsMax = item.oddsMax;
          item._fsrate = item.fsrate;
          // 初始化数据
          item.oddsMin = item.oddsMin + "";
          if (!item.oddsMin.includes("/")) {
            item.oddsMin = +item.oddsMin;
            item.oddsMax = +item.oddsMax;
            item._oddsMin = +item.oddsMin;
            item._oddsMax = +item.oddsMax;
          }
          item.fsrate = +item.fsrate;
        });
        this.oddData = res.data;
        let arr=[];
        this.oddData.oddsInfo.forEach(item=>{
          arr.push(item.title)
        })
        this.newArray=arr;
        this.spinShow = false
      });
    },
    toTegional() {
      if(this.newArray.includes(this.play)){
      }else if(this.play==""){

      }else{
        this.$Tip.success({content:"请输入正确的玩法描述"})
        return  false
      }

      if(this.play){
          document.querySelector(`#${this.play}`).scrollIntoView(true)
      }
    },
    // 赔率修改
    save(flag) {
      // 确认保存
      if (flag == 1) {
        let { oddsInfo } = this.oddData;
        let _oddsInfo = JSON.parse(JSON.stringify(oddsInfo));
        _oddsInfo.forEach(item => {
          if (Array.isArray(item.oddsMin)) {
            if (item.oddsMin[0] == null || item.oddsMin[0] == '') item.oddsMin[0] = 0
            if (item.oddsMin[1] == null || item.oddsMin[1] == '') item.oddsMin[1] = 0
            if (item.oddsMax[0] == null || item.oddsMax[0] == '') item.oddsMax[0] = 0
            if (item.oddsMax[1] == null || item.oddsMax[1] == '') item.oddsMax[1] = 0
            item.oddsMin = item.oddsMin.join("/");
            item.oddsMax = item.oddsMax.join("/");
          } else {
            if (item.oddsMin == null || item.oddsMin == '') item.oddsMin = 0
            if (item.oddsMax == null || item.oddsMax == '') item.oddsMax = 0
          }
          if (item.fsrate == null || item.fsrate == '' || !item.editable) item.fsrate = 0
          delete item._oddsMin;
          delete item._oddsMax;
          delete item._fsrate;
        });
        _oddsInfo.forEach(item => {
          item.oddsMax = item.oddsMin
        })
        let data = {
          id: this.oddData.id,
          oddsInfo: JSON.stringify(_oddsInfo)
        };
        this.$root.startEditLoading();
        lotteryUpdateOddsSiteidLid(data, true).then(res => {
          if(res != undefined && res.code == 200){
            this.$Message.success('修改赔率成功')
            this.oddsStatus = true;
            this.getData(this.formKey);
          }
        });
      } else {
        this.oddsStatus = true;
        this.transform();
      }
    }
  }
};
</script>
<style lang="less" scoped >
@import '../../styles/button.less';
.ivu-btn{vertical-align: 0;}
.clearfix {
  .dqcp {
    width: 40%;
    border: 1px solid #dcdcdc;
    text-align: center;
    line-height: 32px;
  }
}
/deep/.ivu-input{height: 36px;}
/deep/.v2-button{
  button:last-child{margin-right: 20px;}
}
.ivu-table {
  width: 100%;
  color:#444;
}
.ivu-input-number {
  margin: auto;
}
/deep/.ivu-table-cell-tooltip-content {
  padding: 0 100px 0 100px !important;
}
/deep/.ivu-input-number-input {
  border-radius: 0px !important;
}

</style>


