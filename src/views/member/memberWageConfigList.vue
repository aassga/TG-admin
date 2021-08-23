<template>
  <div>
    <div class="v2-button" v-if="adminType == 'super' || authInPage.indexOf('memberWageConfigAdd') != -1">
      <Button type="primary" @click="waveModal('add')">添加工资等级</Button>
    </div>
    <div class="v2-table">
      <Tables :loading='$root.tableLoading
      ' :value='table.data' 
      :columns='table.columns'
       :page='false'></Tables>
    </div>
    <Modals :title="title" width='560' ref="wageLevelModal">
      <div slot="content">
        <Form ref="wageAdd" :model='wageAddInfo' :rules='wageAddRules' style="width: 560px;" :label-width='180'>
          <FormItem label='工资等级' prop='level'>
            <Select class="w260x" v-model="wageAddInfo.level" transfer placeholder='请选择工资等级' :disabled="title == '编辑工资等级'">
              <Option v-for="t in wageLevelList" :key="'wave' + t.value" :value="t.value">{{t.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label='等级别称' prop='levelName'>
            <Input v-model="wageAddInfo.levelName" class="w260x" placeholder="请输入等级别称"/>
          </FormItem>
          <FormItem label='团队有效投注' prop='validBetAmount'>
            <Input v-model="wageAddInfo.validBetAmount" class="w260x" placeholder="请输入有效投注金额"/>
          </FormItem>
          <FormItem label='发放工资' prop='money'>
            <Input v-model="wageAddInfo.money" class="w260x" placeholder="请输入发放工资金额"/>
          </FormItem>
          <FormItem>
            <Button type='primary' class="ivu-btn submit" @click.prevent="save">确认保存</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from '_c/tables';
import { memberWageConfigList, memberWageConfigStatusUpt, memberWageConfigAdd, memberWageConfigU } from '@/api/member'
import Modals from '_c/modals'
import { mapState } from 'vuex'
import { getUserType } from "@/libs/util"
export default {
  name: 'memberWageConfigList',
  components: {
    Tables, Modals
  },
  computed: {
    ...mapState({
      wageLevelList: state => state.info.wageLevelList
    })
  },
  data() {
    return {
      title: '添加工资等级',
      wageAddInfo: {
        level: '',
        levelName: '',
        validBetAmount: '',
        money: '',
        siteId: this.$root.nowSite.id
      },
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      wageAddRules: {
        level: [{ required: true, message: '请选择工资等级', trigger: 'change', pattern: /.+/ }],
        validBetAmount: [{ required: true, message: '请输入正确的有效投注金额', trigger: 'blur', pattern: /^(([0-9]\d*))(\.\d{1,2})?$/ }],
        money: [{ required: true, message: '请输入正确的发放工资', trigger: 'blur', pattern: /^(([0-9]\d*))(\.\d{1,2})?$/ }]
      },
      table: {
        loading: true,
        data: [],
        columns: [
          {
            title: '等级',
            key: 'level',
            align: 'center',
            render: (h, params) => <span>{`第${params.row.level}阶`}</span>
          },
          {
            title: '等级别称',
            key: 'levelName',
            align: 'center'
          },
          {
            title: '发放人次',
            key: 'timeCount',
            align: 'center'
          },
          {
            title: '团队有效投注',
            key: 'validBetAmount',
            align: 'center'
          },
          {
            title: '发放工资',
            key: 'money',
            align: 'center'
          },
          // {
          //   title:'生效时间',
          //   key: 'updated_at',
          //   align: 'center',
          //   render: (h, params) => <span>{this.$root.newUnixTime(params.row.updated_at)}</span>
          // },
          {
            title: '创建时间',
            key: 'created_at',
            align: 'center',
            render: (h, params) => <span>{this.$root.newUnixTime(params.row.created_at)}</span>
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
    this.getData()
  },
  methods: {
    getData() {
      this.$root.startTableLoading()
      memberWageConfigList({ siteId: this.$root.nowSite.id }).then(res => {
        if (res != undefined && res.code == 200) this.table.data = res.data
        this.$root.endTableLoading()
      }).catch(error => this.$root.endTableLoading() )
    },
    changeStatus(params) {
      let msg = params.row.status == 'yes' ? `您确定停用第${params.row.level}阶吗` : `您确定启用第${params.row.level}阶吗？`
      let tip = params.row.status == 'yes' ? '停用成功' : '启用成功'
      let data = { id: params.row.id, siteId: this.$root.nowSite.id, status: params.row.status == 'yes' ? 'no' : 'yes' }
      this.$Tip.confirm({
        content: msg,
        onOk: () => {
          memberWageConfigStatusUpt(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(tip)
              this.table.data[params.index].status = data.status
            }
          })
        }
      })
    },
    waveModal(type, params) {
      this.$refs.wageAdd.resetFields()
      this.title = type == 'add' ? '添加工资等级' : '编辑工资等级'
      this.$refs.wageLevelModal.show()
      if (type == 'edit') {
        let { level, levelName, validBetAmount, money, id } = params.row
        this.wageAddInfo = { siteId: this.$root.nowSite.id, level, levelName, validBetAmount, money, id }
      }
    },
    save() {
      let data = {}
      this.$refs.wageAdd.validate(valid => {
        if (valid) {
          this.$refs.wageLevelModal.spinShow()
          let { level, levelName, validBetAmount, money, siteId } = this.wageAddInfo
          data = { siteId, level, levelName, validBetAmount, money }
          if (this.title == '添加工资等级') {
            memberWageConfigAdd(data, true).then(res => {
              this.$refs.wageLevelModal.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('添加成功')
                this.getData()
                this.$refs.wageLevelModal.hide()
              }
            }).catch(error => this.$refs.wageLevelModal.spinHide())
          } else {
            data.id = this.wageAddInfo.id
            memberWageConfigU(data, true).then(res => {
              this.$refs.wageLevelModal.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('编辑成功')
                this.getData()
                this.$refs.wageLevelModal.hide()
              }
            }).catch(error => this.$refs.wageLevelModal.spinHide())
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/button.less";
</style>
