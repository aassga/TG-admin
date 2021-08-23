/* eslint-disable space-before-function-paren */
// 表格页的mixins
import { mapState } from 'vuex'

const listMixins = {
  data() {
    return {
      Time: [],
      // autoFresh: '0',
      // autoFreshTimer: null,
      searchKey: {},
      page: 1,
      sortParams: {},
      mixinPage: 1
    }
  },
  computed: {
    ...mapState({
      nowSite: state => state.user.nowSite
    })
  },
  watch: {
    // 自动刷新
    // autoFresh(newVal, oldVal) {
    //   if (newVal !== oldVal) this.autoFreshFun(newVal)
    // }
  },
  filters: {},
  mounted() {
    let data = { siteId: this.$root.nowSite.id }
    const { name, params } = this.$route
    if (name === 'memberOnline') {
      let postData = {params: { ...this.searchKey, siteId: this.nowSite.id, isLike: false }}
      if (params.editPage && Number(params.editPage) !== 1) {
        postData.query = { page: params.editPage }
      }
      this.getData(postData)
    } else {
      this.getData({ params: { ...this.searchKey, ...data, isLike: false } })
    }
  },
  methods: {
    // 分页
    onPageChange(page) {
      this.mixinPage = page
      // 全局tablemixin修改传字段空值删除掉会员查询银行卡管理
      if (this.searchKey.cardNum) this.searchKey.cardNum = this.$root.trimAll(this.searchKey.cardNum)
      if (this.searchKey.cardNum !== undefined) {
        let reg = /^\d{1,}$/
        if (this.searchKey.cardNum && reg.test(this.searchKey.cardNum)) {
          Object.keys(this.searchKey).forEach(el => {
            if (this.searchKey[el] === '') {
              delete this.searchKey[el]
            }
          })
        } else if (this.searchKey.cardNum && !reg.test(this.searchKey.cardNum)) {
          this.$Tip.info({ content: '您所查询的银行卡号不正确，请重新输入' })
          return false
        }
      }
      // 不要删除
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key]
      }
      let data = { ...this.searchKey, siteId: this.nowSite.id }
      delete data.startTime
      delete data.endTime
      if (this.$root.formatTimeS(this.Time[0]) !== 'Invalid date') {
        data.startTime = this.$root.formatTimeS(this.Time[0])
        data.endTime = this.$root.formatnightTimeS(this.Time[1])
      }
      if (data.userName !== undefined && data.userName.includes('')) {
        data.userName = data.userName.trim()
        if (!data.userName) {
          delete data.userName
        }
      }
      if (data.content !== undefined && data.content.includes('')) {
        data.content = data.content.trim()
      }
      if (data.code !== undefined && data.code.includes('')) {
        data.code = data.code.trim()
        if (!data.code) {
          delete data.code
        }
      }
      this.page = page
      data = { ...data, ...this.sortParams }
      this.getData({ params: data, query: { page } })
    },
    // 每页显示几条
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize
      if (this.searchKey.cardNum) this.searchKey.cardNum = this.$root.trimAll(this.searchKey.cardNum)
      if (this.searchKey.cardNum !== undefined) {
        let reg = /^\d{1,}$/
        if (this.searchKey.cardNum && reg.test(this.searchKey.cardNum)) {
          Object.keys(this.searchKey).forEach(el => {
            if (this.searchKey[el] === '') {
              delete this.searchKey[el]
            }
          })
        } else if (this.searchKey.cardNum && (!reg.test(this.searchKey.cardNum))) {
          this.$Tip.info({ content: '您所查询的银行卡号不正确，请重新输入' })
          return false
        }
      }
      let data = { ...this.searchKey, siteId: this.nowSite.id, limit: pageSize }
      delete data.startTime
      delete data.endTime
      if (this.$root.formatTimeS(this.Time[0]) !== 'Invalid date') {
        data.startTime = this.$root.formatTimeS(this.Time[0])
        data.endTime = this.$root.formatnightTimeS(this.Time[1])
      }
      if (data.userName !== undefined && data.userName.includes('')) {
        data.userName = data.userName.trim()
        if (!data.userName) {
          delete data.userName
        }
      }
      if (data.code !== undefined && data.code.includes('')) {
        data.code = data.code.trim()
        if (!data.code) {
          delete data.code
        }
      }
      if (data.content !== undefined && data.content.includes('')) {
        data.content = data.content.trim()
      }
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key]
      }
      this.getData({ params: data })
    },
    // 排序
    sortChange({ column, key, order }) {
      let data = { sortKey: key, sortVal: order, siteId: this.$root.nowSite.id }
      this.searchKey.startTime = this.$root.formatTimeS(this.Time[0])
      this.searchKey.endTime = this.$root.formatnightTimeS(this.Time[1])
      if (data.sortVal === 'normal') {
        delete data.sortKey
        delete data.sortVal
      } else {
        this.searchKey.sortKey = key
        this.searchKey.sortVal = order
      }
      this.sortParams = {}
      this.sortParams = { ...data }
      if (this.page !== 1) {
        this.getData({ params: { ...this.searchKey, ...data }, query: { page: 1 } })
      } else {
        this.getData({ params: { ...this.searchKey, ...data } })
      }
      // this.getData({ params: { ...this.searchKey, ...data } })
    },
    exportExcel() {
      this.$root.exportBtnLoading = true
      this.$root.exportBtnLoading = false
    }
    // autoFreshFun(val) {
    //   const data = { ...this.searchKey, siteId: this.$root.nowSite.id }
    //   this.getData({ params: data })
    //   if (val === '0') {
    //     clearInterval(this.autoFreshTimer)
    //   } else {
    //     clearInterval(this.autoFreshTimer)
    //     this.autoFreshTimer = setInterval(() => {
    //       this.getData({ params: data })
    //     }, val * 1000)
    //   }
    // },
    // catchError() {
    //   clearInterval(this.autoFreshTimer)
    //   this.autoFresh = '0'
    // }
  }
  // activated() {
  //   this.autoFreshFun(this.autoFresh)
  // },
  // deactivated() {
  //   clearInterval(this.autoFreshTimer)
  // }
}
export default listMixins
