<template>
  <div>
    <div class="v2-button" v-if="adminType == 'super' || authInPage.indexOf('memberProfitConfigList') != -1">
      <Button type="primary" @click="add('add')">添加分红等级</Button>
    </div>
    <div class="v2-table">
      <Tables :loading='$root.tableLoading' :value='table.data' :page='false' :columns='table.columns'></Tables>
    </div>
    <Modals :title="title" width='560' ref="profitModal">
      <div slot="content">
        <Form ref="profitInfo" :model='profitInfo' :rules='profitRules' style="width: 560px;" :label-width='180'>
          <FormItem label='分红等级' prop='level'>
            <Select v-model="profitInfo.level" class="w260x" transfer placeholder='请选择分红等级' :disabled="title == '编辑分红等级'">
              <Option v-for="t in wageLevelList" :key="'wave' + t.value" :value="t.value">{{t.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label='等级别称' prop='levelName'>
            <Input v-model="profitInfo.levelName" class="w260x" placeholder="请输入等级别称"/>
          </FormItem>
          <FormItem label='网站盈利' prop='profit'>
            <Input placeholder="请输入网站盈利金额" class="w260x" v-model="profitInfo.profit"/>
          </FormItem>
          <FormItem label='分红比例' prop='proportion'>
            <Input v-model="profitInfo.proportion" class="w260x" placeholder="请输入发放比例"/> %
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
import { memberProfitConfigList, memberProfitConfigStatusUpt, memberProfitConfigAdd, memberProfitConfigUpt } from '@/api/member'
import Tables from '_c/tables'
import { mapState } from 'vuex'
import { getUserType } from "@/libs/util"
import Modals from '_c/modals'
export default {
  name: 'memberProfitConfigList',
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
      title: '添加分红等级',
      profitInfo: {
        id: '',
        siteId: this.$root.nowSite.id,
        levelName: '',
        level:'',
        profit: '',
        proportion: ''
      },
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      profitRules: {
        level: [{ required: true, message: '请选择分红等级', trigger: 'change', pattern: /.+/ }],
        profit: [{ required:true, message: '请输入正确的平台盈利金额', trigger: 'blur', pattern: /^(([0-9]\d*))(\.\d{1,2})?$/ }],
        proportion: [{ required:true, message: '请输入正确的发放比例', trigger: 'blur', pattern: /^(([0-9]\d*))(\.\d{1,2})?$/ }]
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
            align:'center'
          },
          {
            title: '网站盈利',
            key: 'profit',
            align: 'center'
          },
          {
            title: '分红比例',
            key: 'proportion',
            align: 'center',
            render: (h, params) => <span>{params.row.proportion}%</span>
          },
          {
            title: '编辑时间',
            key: 'updated_at',
            align: 'center',
            render: (h, params) => <span>{this.$root.newUnixTime(params.row.updated_at)}</span>
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
                <a class='mr10' style={{ display: this.adminType == 'super' || this.authInPage.indexOf('memberProfitConfigStatusUpt') != -1}} onClick={() => { this.changeStatus(params) }}>{params.row.status == 'yes' ? '停用' : '正常'}</a>
                <a class='mr10' style={{ display: this.adminType == 'super' || this.authInPage.indexOf('memberProfitConfigUpt') != -1}} onClick={() => { this.add('edit', params) }}>编辑</a>
              </div>
            )
          }
        ]
      }
    }
  },
  mounted() {
    this.$Message.config({ top: 50, duration: 1 })
    this.getData()
  },
  methods: {
    getData() {
      this.$root.startTableLoading()
      memberProfitConfigList({ siteId: this.$root.nowSite.id }).then(res => {
        if (res != undefined && res.code == 200) this.table.data = res.data
        this.$root.endTableLoading()
      }).catch(error => this.$root.endTableLoading())
    },
    changeStatus(params) {
      let msg = params.row.status == 'yes' ? `您确定停用第${params.row.level}阶吗？` : `您确定启用第${params.row.level}阶吗？`
      let tip = params.row.status == 'yes' ? '停用成功' : '启用成功'
      let data = { id: params.row.id, siteId: this.$root.nowSite.id, status: params.row.status == 'yes' ? 'no' : 'yes' }
      this.$Tip.confirm({
        content: msg,
        onOk: () => {
          memberProfitConfigStatusUpt(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(tip)
              this.table.data[params.index].status = data.status
            }
          })
        }
      })
    },
    add(type, params) {
      this.$refs.profitInfo.resetFields()
      this.title = type == 'add' ? '添加分红等级' : '编辑分红等级'
      this.$refs.profitModal.show()
      if (type == 'edit') {
        let { id, levelName, profit, proportion, siteId, level, status } = params.row
        this.profitInfo = { id, siteId, levelName, level, profit, proportion, status }
      }
    },
    save() {
      let data = {}
      this.$refs.profitInfo.validate(valid => {
        if (valid) {
          this.$refs.profitModal.spinShow()
          let { siteId, level, levelName, profit, proportion } = this.profitInfo
          data = { siteId, level, levelName, profit, proportion }
          if (this.title == '添加分红等级') {
            memberProfitConfigAdd(data, true).then(res => {
              this.$refs.profitModal.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('添加成功')
                this.getData()
                this.$refs.profitModal.hide()
              }
            }).catch(error => this.$refs.profitModal.spinHide())
          } else {
            data.id = this.profitInfo.id
            memberProfitConfigUpt(data, true).then(res => {
              this.$refs.profitModal.spinHide()
              if (res != undefined && res.code == 200) {
                this.$Message.success('编辑成功')
                this.getData()
                this.$refs.profitModal.hide()
              }
            }).catch(error => this.$refs.profitModal.spinHide())
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

