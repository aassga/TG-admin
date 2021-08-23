<template>
  <div>
    <div class="expand">
      <div class="section box bb bl br">
        <div class="top clearfix">
          <div class="col fl br ti10">
            <div class="row bb h40x">佣金</div>
            <div class="row bb h40x">佣金上限：1000.00</div>
            <div class="row h40x">佣金下限：0.00</div>
          </div>
          <div class="col fl br ti10">
              <div class="row bb h40x">固定日工资</div>
              <div class="row bb h40x">最低投注额：100000.00</div>
              <div class="row h40x">固定日工资：100.00</div>
          </div>
          <div class="col fl br ti10">
              <div class="row bb h40x">分红</div>
              <div class="row bb h40x">最低负盈利：-1000.00</div>
              <div class="row h40x">分红比例：0.00%</div>
          </div>
          <div class="col fl ti10">
              <div class="row bb h40x">其它</div>
              <div class="row bb h40x">更新时间：2018-10-18 15:30</div>
              <div class="row h40x">备注：</div>
          </div>
        </div>
        <div class="bottom clearfix">
            <div class="left fl br ti10 h40x">佣金比例：0.00%</div>
            <div class="right fl h40x"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
@import '../../../styles/class.less';
.box {
  width: 100%;
  .top {
    width: 100%;
    .col {
      width: 25%;
      text-align: left;
      box-sizing: border-box;
      border-top: 1px solid #dcdcdc;
    }
  }
  .bottom{
      width: 100%;
      border-top: 1px solid #dcdcdc;
      .left{
          width: 25%;
      }
  }
}
.h40x{
    height: 40px;line-height: 40px;
}
</style>


