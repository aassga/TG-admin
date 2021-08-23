<template>
  <div>
    <div class="v2-search bb">
        <div class="mb20">
          <Button type="primary"  @click="waveModal('add')">添加业绩等级</Button>
          <div class="fr mr20 r10">
            <div class="clearfix" @click="showTip">
              <span class="fl cs" style="line-height:38px;color:#2D8CF0">佣金说明</span>
              <!-- <Icons type="bangzhutishi" class="pl5 pr5" color="#E4E4E4" :size="26"/> -->
            </div>
          </div>
        </div>
      <div>
        <span class="repay-button1" style="margin-bottom:.3px">
          <span class="pl20 pr20 ib ft16"
            v-for="(item,key,i) in classNameList"
            :key='i'
            style="border:0"
            @click="type = key"
            :class="type == key ? 'active cs' : 'classBtn cs'">
            {{item}}
          </span>
        </span>
      </div>
		</div>
    <div class="v2-table">
      <Tables :loading='$root.tableLoading' :value='table.data[type]' :columns='table.columns' :page='false'></Tables>
    </div>
    <Modals :title="title" width='560' ref="performanceModal">
      <div slot="content">
        <Form ref="performance" :model='wageAddInfo' :rules='performanceRules' style="width: 560px;" :label-width='180'>
          <FormItem label='游戏类型' prop="type">
            <Select v-model="wageAddInfo.type" class="w260x" transfer placeholder='请选择游戏类型' :disabled="title == '编辑业绩等级'">
              <Option v-for="(t,key) in classNameList" :key="'wave' + t" :value="key">{{t}}</Option>
            </Select>
          </FormItem>
          <FormItem label='业绩等级' prop='level'>
            <Select v-model="wageAddInfo.level" class="w260x" transfer placeholder='请选择业绩等级'>
              <Option v-for="t in wageLevelList" :key="'wave' + t.value" :value="t.value">{{t.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label='等级别称' prop='levelTitle'>
            <Input v-model="wageAddInfo.levelTitle" class="w260x" placeholder="如等级1"/>
          </FormItem>
          <FormItem label='团队业绩' prop='profit'>
            <InputNumber
              :max="9999999999"
              :min='1'
              :precision='0'
              class="w260x"
              :value="Number(wageAddInfo.profit)||null"
              @on-change="value=>{wageAddInfo.profit=value}"
              placeholder="请输入团队业绩"/>/日
          </FormItem>
          <FormItem label='业绩别称' prop='profitTitle'>
              <Input v-model="wageAddInfo.profitTitle" class="w260x" placeholder="请输入业绩别称"/>/日
          </FormItem>
          <FormItem label='返佣比例' prop='proportion'>
              <InputNumber
                class="w260x"
                :max="9999999999.99"
                :min='0.01'
                :step='0.01'
                :value="Number(wageAddInfo.proportion)||null"
                :formatter="value => wageAddInfo.proportion= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]"
                placeholder="请输入返佣比例"/>&nbsp;‱
          </FormItem>
          <FormItem label='比例别称' prop='proportionTitle'>
            <Input v-model="wageAddInfo.proportionTitle" class="w260x" placeholder="如每万返佣10"/>
          </FormItem>
          <FormItem>
            <Button type='primary' class="w260x  ivu-btn submit" @click="save">{{isEdit?'确认修改':'确认添加'}}</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
    <Modals title="佣金说明" width='1205' ref="yejidengji">
      <div slot="content" class="pl20 pr20 imgBox" style="height:700px;overflow:hide;overflow-y:auto;transform: translateY(-20px)">
        <img src='../../assets/svg/yongjin2.svg' style="width:1160px"/>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from '_c/tables';
import { performanceConfigList, performanceConfigStatusUpt, performanceConfigAdd, performanceConfigUpt } from '@/api/member'
import Modals from '_c/modals'
import { mapState } from 'vuex'
import Icons from '_c/icons';
import { getUserType } from "@/libs/util"
export default {
  name: 'performance',
  components: {
    Tables, Modals ,Icons
  },
  computed: {
    ...mapState({
      wageLevelList: state => state.info.wageLevelList
    })
  },
  data() {
    return {
      type:'chess',
      title: '添加工资等级',
      isEdit :false,
      wageAddInfo: {
        type:'',//游戏类型
        level: '',//等级
        levelTitle:'',//等级别称
        profit:'',//团队业绩
        profitTitle:'',//业绩别称
        proportion:'',//返佣
        proportionTitle:'',//返佣别称
        siteId: this.$root.nowSite.id
      },
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      performanceRules: {
        type: [{ required: true, message: '请选择游戏类型', trigger: 'change', pattern: /.+/ }],
        level: [{ required: true, message: '请选择业绩等级', trigger: 'change', pattern: /.+/ }],
        levelTitle: [{required: true, message: '请输入等级别称', trigger: 'change', pattern: /.+/ }],
        profit: [{ required: true, message: '请输入团队业绩', trigger: 'blur', pattern: /^(([0-9]\d*))(\.\d{1,2})?$/ }],
        profitTitle:[{required: true, message: '请输入业绩别称', trigger: 'blur'}],
        proportion: [{required: true, message: '请输入返佣比例', trigger: 'blur'}],
        proportionTitle:[{required: true, message: '请输入比例别称', trigger: 'blur'}]
      },
      classNameList:[],
      table: {
        loading: true,
        data: [],
        columns: [
          {
            title: '业绩等级',
            key: 'level',
            align: 'center',
            render: (h, params) => (
              <span>
                {'第'+params.row.level+'阶'}
              </span>
            )
          },
          {
            title: '等级别称',
            key: 'levelTitle',
            align: 'center'
          },
          {
            title: '团队业绩/日',
            key: 'profit',
            align: 'center'
          },
          {
            title: '业绩别称/日',
            key: 'profitTitle',
            align: 'center'
          },
          {
            title: '返佣比例(‱)',
            key: 'proportion',
            align: 'center'
          },
          {
            title: '比例别称',
            key: 'proportionTitle',
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render: (h, params) => <span style={{color: params.row.status == 'yes' ? '#239961' : '#ff2626' }}>{params.row.status == 'yes' ? '正常' : '停用'}</span>
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => (
              <div>
                <a class='ib mr10' style={{ display: this.adminType == 'super' || this.authInPage.indexOf('memberWageConfigStatusUpt') != -1}} onClick={() =>{ this.changeStatus(params)}}>{params.row.status == 'yes' ? '停用' : '启用'}</a>
                <a class='ib mr10' style={{ display: this.adminType == 'super' || this.authInPage.indexOf('memberWageConfigUpt') != -1}} onClick={() => { this.waveModal('edit', params)}}>编辑</a>
              </div>
            )
          }
        ]
      }
    }
  },
  mounted() {
    this.$Message.config({
      top: 50,
      duration: 1
    })
    this.getData();
  },
  methods: {
    showTip(){
      this.$refs.yejidengji.show()
    },
    getData() {
      this.$root.startTableLoading()
      performanceConfigList({ siteId: this.$root.nowSite.id }).then(res => {
        if (res != undefined && res.code == 200) {
          this.table.data = res.data;
          // this.classNameList = res.data.cate;
          this.classNameList = {chess: "棋牌游戏",
                                getfish: "捕鱼游戏",
                                slot: "电子游艺",
                                live: "真人视讯",
                                lottery: "彩票游戏",
                                sport: "体育赛事"}
        };
        this.$root.endTableLoading()
      }).catch(error => this.$root.endTableLoading() )
    },
    changeStatus(params) {
      let msg = params.row.status == 'yes' ? `您确定停用第${params.row.level}阶吗` : `您确定启用第${params.row.level}阶吗？`
      let tip = params.row.status == 'yes' ? '停用成功' : '启用成功'
      let data = { id: params.row.id, siteId: this.$root.nowSite.id, type: this.type, status: params.row.status == 'yes' ? 'no' : 'yes' }
      this.$Tip.confirm({
        content: msg,
        onOk: () => {
          performanceConfigStatusUpt(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(tip);
              this.table.data[this.type][params.index].status = data.status;
            }
          })
        }
      })
    },
    waveModal(type, params) {

      this.$refs.performance.resetFields()
      this.title = type == 'add' ? '添加业绩等级' : '编辑业绩等级'
      this.$refs.performanceModal.show();
      if (type == 'edit') {
        this.isEdit = true;
        let { type,level, levelTitle, profit, profitTitle,proportion,proportionTitle,id } = params.row
        this.wageAddInfo = { siteId: this.$root.nowSite.id, type,level, levelTitle, profit, profitTitle,proportion,proportionTitle, id }
          // console.log(this.wageAddInfo.profit)
      }
    },
    save() {
      let data = {}
      this.$refs.performance.validate(valid => {
        if (valid) {
          this.$refs.performanceModal.spinShow()
          let { type,level, levelTitle, profit, profitTitle,proportion,proportionTitle, siteId } = this.wageAddInfo;
          data = { type,level, levelTitle, profit, profitTitle,proportion,proportionTitle, siteId };
          if (this.title == '添加业绩等级') {
            performanceConfigAdd(data, true).then(res => {
              this.$refs.performanceModal.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('添加业绩等级成功')
                this.getData()
                this.$refs.performanceModal.hide()
              }
            }).catch(error => this.$refs.performanceModal.spinHide())
          } else {
            data.id = this.wageAddInfo.id
            performanceConfigUpt(data, true).then(res => {
              this.$refs.performanceModal.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('编辑业绩等级成功')
                this.getData()
                this.$refs.performanceModal.hide()
                this.isEdit = false;
              }
            }).catch(error => this.$refs.performanceModal.spinHide())
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.repay-button1{
  height: 36px;
  span{
    line-height: 36px;
  }
}
.active {
  border:1px solid #2b85e4 !important;
  margin-right: 1px;
  border-bottom: 0 !important;
  box-sizing: border-box;
  color:#2b85e4;
}
.classBtn {
  margin:0 1px;
  box-sizing: border-box;
}
.imgBox{
  background-image: url("../../assets/svg/stripes-light.png")
}
</style>