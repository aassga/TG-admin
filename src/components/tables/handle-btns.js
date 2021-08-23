const btns = {
  delete: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-delete', params)
            // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
          }
        }
      },
      '删除'
    )
  },
  list: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-list', params)
          }
        }
      },
      '游戏列表'
    )
  },
  reply: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-reply', params)
            // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
          }
        }
      },
      '回复'
    )
  },
  edit: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-edit', params)
          }
        }
      },
      '编辑'
    )
  },
  details: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-details', params)
          }
        }
      },
      '详情'
    )
  },
  status: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-change-status', params)
          }
        }
      },
      params.row.status === 'yes' ? '停用' : '启用'
    )
  },
  frost: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          // color: '#2D8CF0'
          color: (params.row.agent_type - 1) > 0 ? '#2D8CF0' : '#918b8b'
        },
        on: {
          click: () => {
            vm.$emit('on-change-frost', params)
          }
        }
      },
      params.row.admin_status === 1 ? '解冻' : '冻结'
    )
  },
  frostStatus: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          // color: '#2D8CF0'
          color: (params.row.agent_type - 1) > 0 ? '#2D8CF0' : '#918b8b'
        },
        on: {
          click: () => {
            vm.$emit('on-change-frostStatus', params)
          }
        }
      },
      params.row.status === 'yes' ? '停用' : '启用'
    )
  },
  odds: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-check-odds', params)
          }
        }
      },
      '赔率'
    )
  },
  remove: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-remove', params)
          }
        }
      },
      '移出黑名单'
    )
  },
  initialize: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-initialize', params)
          }
        }
      },
      '初始化'
    )
  },
  classStatus: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-change-classStatus', params)
          }
        }
      }, params.row.classStatus === 'yes' ? '停用' : '启用'
    )
  },
  preview: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-preview', params)
            // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
          }
        }
      },
      '预览'
    )
  },
  look: (h, params, vm) => {
    return h(
      'a', {
        style: {
          margin: '0 5px',
          color: '#2D8CF0'
        },
        on: {
          click: () => {
            vm.$emit('on-look', params)
            // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
          }
        }
      },
      '查看'
    )
  },
}
export default btns
