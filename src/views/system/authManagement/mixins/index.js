import Sortable from 'sortablejs'
import Tables from '@/components/tables'
import { sortMenu, deleteMenu } from '@/api/system'
import { mapActions } from 'vuex'
export default {
  components: { Tables },
  created () {
    this.$nextTick(() => {     
      const el = this.$refs.dragable.$el.children[0].children[0].children[1]
        .children[0].children[1]
      let that = this
      Sortable.create(el, {
        onEnd: that.endFunc
      })
    })
  },
  methods: {
    ...mapActions(['getMenu']),
    endFunc (e) {
      let movedRow = this.table.data[e.oldIndex]
      let targetRow = this.table.data[e.newIndex]
      this.table.data.splice(e.oldIndex, 1)
      this.table.data.splice(e.newIndex, 0, movedRow)
      let params = {
        current_id: movedRow.id,
        neighbor_id: targetRow.id,
        type: e.oldIndex > e.newIndex ? 'left' : 'right'
      }
      if (e.oldIndex !== e.newIndex) this.sortMenus(params)
    },
    sortMenus (params) {
      sortMenu(params).then(res => {
        this.$Tip.success({ content: res.data })
        let time = new Date().getTime()
        // this.getMenu()
        this.getNewRoute()
      })
    },
    onEdit (params) {
      this.showEditModal(params)
    },
    onDelete (params) {
      this.$Tip.confirm({
        content:
          '注意：删除操作将会导致【该菜单】以及【该菜单的全部子菜单】均被删除',
        onOk: () => {
          deleteMenu({ id: params.row.id }).then(
            res => {
              if (res.code === 200) {
                this.getData()
                this.getNewRoute()
                // this.getMenu()
              }
            }
          )
        }
      })
    }
  }
}
