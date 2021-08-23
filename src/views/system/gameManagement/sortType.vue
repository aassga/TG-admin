<template>
  <div>
    <div class="v2-search">
      <div class="mb20">
        <Button
          class="mr20 lh48 h48 w120x txt-a"
          v-for="t in btnClass"
          :key="t.id"
          :class="searchKey.id==t.id? 'activeType':''"
          @click.stop="searchKey.id=t.id; type='title';getData('title')"
        >{{t.name}}</Button>
      </div>
    </div>
    <Tabs
      @on-click="change"
      :value="type"
      :animated="false"
      v-if="searchKey.id=='1'||searchKey.id=='2'||searchKey.id=='3'"
    >
      <TabPane name="title" :label="searchKey.id==1?'棋牌游戏标签':searchKey.id==2?'电子游戏标签':'捕鱼游戏标签'">
        <div class="v2-table">
          <Tables
            ref="tables"
            :columns="table.columns"
            :value="table.data"
            :total="table.total"
            :loading="$root.tableLoading"
            :draggable="true"
            @on-drag-drop="onDragDrop"
            :page="false"
          ></Tables>
        </div>
      </TabPane>
      <TabPane name="platform" :label="searchKey.id==1?'棋牌游戏平台':searchKey.id==2?'电子游戏平台':'捕鱼游戏平台'">
        <div class="v2-table">
          <Tables
            ref="tables"
            :columns="table.columns"
            :value="table.data"
            :total="table.total"
            :loading="$root.tableLoading"
            @on-expand="onExpand"
            :draggable="true"
            @on-drag-drop="onDragDrop"
            :page="false"
          ></Tables>
        </div>
      </TabPane>
    </Tabs>
    <div class="v2-table" v-if="searchKey.id!='1'&&searchKey.id!='2'&&searchKey.id!='3'">
      <Tables
        ref="tables"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        :loading="$root.tableLoading"
        :draggable="searchKey.id == 4?true:false"
        @on-drag-drop="onDragDrop"
        @on-expand="onExpand"
        :page="false"
      ></Tables>
    </div>
  </div>
</template>
<script>
import {
  GameGroupList, //游戏列表
  GameGroupEditor, //修改
  GameGroupAdd, //新增分类
  GameGroupDel, //删除分类
  GameGroupUpSort //排序
} from "@/api/system";
import Tables from "@/components/tables";
import { getUserType } from "@/libs/util";
import { Row } from "view-design";
import Icons from "_c/icons";
export default {
  name: "sortType",
  components: { Tables, Icons },
  data() {
    return {
      editInfo: [],
      searchKey: {
        limit: 20,
        page: 1,
        id: 1
      },
      loading: false,
      adminType: getUserType(),
      type: "title",
      authInPage: JSON.parse(localStorage.authInPage),
      btnClass: [
        { id: 1, name: "棋牌游戏" },
        { id: 2, name: "电子游艺" },
        { id: 3, name: "捕鱼游戏" },
        { id: 4, name: "彩票游戏" },
        { id: 5, name: "真人视讯" },
        { id: 6, name: "体育赛事" },
        { id: 7, name: "手机端" }
      ],
      columns3: [
        {
          title: "排序大类",
          key: "name",
          align: "center",
          minWidth: 90,
          render: (h, params) => <span>手机端</span>
        },
        {
          title: "小类",
          key: "name",
          align: "center",
          minWidth: 90
        }
      ],
      table: {
        data: [],
        loading: true,
        total: 0,
        columns: [],

        columns2: [
          {
            title: "",
            align: "center",
            width: 120,
            render: (h, params) => {
              return (
                <div>
                  <span
                    class="w50 txt-a ib cs"
                    onClick={() =>
                      params.index == 0 || !params.row.id
                        ? ""
                        : this.sort(params, "up", 3, params.row.topIndex)
                    }
                  >
                    <Icon
                      class="paixu"
                      type="md-arrow-round-up"
                      color={
                        params.row.sort == 1 || !params.row.id
                          ? "#b3b3b3"
                          : "#2D8cF0"
                      }
                      size="16"
                    />
                  </span>
                </div>
              );
            }
          },
          {
            title: "",
            align: "center",
            width: 120,
            render: (h, params) => {
              let arr = this.table.data[params.row.topIndex].list[
                params.row.parentIndex
              ].list.filter(t => {
                if (t.id) return t;
              });
              return (
                <div>
                  <span
                    class="w50 txt-a ib cs"
                    onClick={() =>
                      params.index == !params.row.id || arr.length - 1
                        ? ""
                        : this.sort(params, "down", 3, params.row.topIndex)
                    }
                  >
                    <Icon
                      class="paixu"
                      type="md-arrow-round-down"
                      color={
                        params.index == arr.length - 1 || !params.row.id
                          ? "#b3b3b3"
                          : " #2D8cF0"
                      }
                      size="16"
                    />
                  </span>
                </div>
              );
            }
          },
          {
            title: "",
            key: "name",
            align: "center",
            minWidth: 300,
            render: (h, params) => {
              return (
                <div>
                  <span style={{ display: params.row.edit ? "none" : "" }}>
                    {params.row.name ? params.row.name : "-"}
                  </span>
                  <Input
                    value={params.row.name}
                    style={{ display: params.row.edit ? "" : "none" }}
                    class="w80"
                    disabled={params.index ? false : true}
                    onInput={e => (params.row.name = e)}
                    placeholder="请输入三级分类"
                  />
                </div>
              );
            }
          },
          {
            title: "",
            key: "",
            align: "center",
            minWidth: 60,
            render: (h, params) => {
              if (params.row.name == "全部" && params.row.type != "add") {
                return <span>--</span>;
              } else {
                return (
                  <div>
                    <a
                      class="mr10"
                      onClick={() =>
                        this.eidt(
                          params.row,
                          params.row.parentIndex,
                          "3",
                          params.row.topIndex
                        )
                      }
                    >
                      {params.row.edit ? "确定" : "编辑"}
                    </a>
                    <a
                      class="mr10"
                      onClick={() =>
                        this.del(
                          params.row,
                          params.row.parentIndex,
                          "3",
                          params.row.topIndex
                        )
                      }
                    >
                      删除
                    </a>
                  </div>
                );
              }
            }
          }
        ]
      },
      columns1: [
        {
          title: "",
          align: "center",
          width: 120,
          render: (h, params) => {
            let arr = this.table.data[params.row.parentIndex].list.filter(t => {
              if (t.id) return t;
            });
            return (
              <div>
                <span
                  class="w50 txt-a ib cs"
                  onClick={() =>
                    params.index == 0 || !params.row.id
                      ? ""
                      : this.sort(params, "up", 2)
                  }
                >
                  <Icon
                    class="paixu"
                    type="md-arrow-round-up"
                    color={
                      params.index == 0 || !params.row.id
                        ? "#b3b3b3"
                        : "#2D8cF0"
                    }
                    size="16"
                  />
                </span>
                <span
                  class="w50 txt-a ib cs"
                  onClick={() =>
                    !params.row.id || params.index == arr.length - 1
                      ? ""
                      : this.sort(params, "down", 2)
                  }
                >
                  <Icon
                    class="paixu"
                    type="md-arrow-round-down"
                    color={
                      params.index == arr.length - 1 || !params.row.id
                        ? "#b3b3b3"
                        : " #2D8cF0"
                    }
                    size="16"
                  />
                </span>
              </div>
            );
          }
        },
        {
          title: "",
          key: "name",
          align: "center",
          minWidth: 200,
          render: (h, params) => {
            return (
              <div>
                <span style={{ display: params.row.edit ? "none" : "" }}>
                  {params.row.name ? params.row.name : "-"}
                </span>
                <Input
                  value={params.row.name}
                  style={{ display: params.row.edit ? "" : "none" }}
                  class="w80"
                  disabled={params.index ? false : true}
                  onInput={e => (params.row.name = e)}
                  placeholder="请输入二级分类"
                />
              </div>
            );
          }
        },
        {
          title: "",
          key: "",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            if (params.row.name == "全部游戏" && params.row.type != "add") {
              if (this.searchKey.id == "1") {
                return <span>--</span>;
              } else {
                return (
                  <a
                    class="mr10"
                    style={{ display: params.row.list ? "" : "none" }}
                    onClick={() => {

                      this.addType(params.row, params.row.parentIndex, 3),
                        (params.row._expanded = true);
                    }}
                  >
                    添加三级分类
                  </a>
                );
              }
            } else {
              return (
                <div>
                  <a
                    class="mr10"
                    onClick={() =>
                      this.eidt(params.row, params.row.parentIndex, "2")
                    }
                  >
                    {params.row.edit ? "确定" : "编辑"}
                  </a>
                  <a
                    class="mr10"
                    style={{
                      display:
                        params.row.list && this.searchKey.id == 2 ? "" : "none"
                    }}
                    onClick={() => {
                      this.addType(params.row, params.row.parentIndex, 3),
                        (params.row._expanded = true);
                    }}
                  >
                    添加三级分类
                  </a>
                  <a
                    class="mr10"
                    onClick={() =>
                      this.del(params.row, params.row.parentIndex, "2")
                    }
                  >
                    删除
                  </a>
                </div>
              );
            }
          }
        },
        {
          title: "",
          type: "expand",
          align: "center",
          minWidth: 40,
          render: (h, params) => {

            if (params.row.list && params.row.list.length) {
              params.row.list.forEach(t => {
                t.parentIndex = params.index;
                t.topIndex = params.row.parentIndex;
                if (!t.edit) t.edit = false;
              });
              return (
                <div class='expandTable2'>
                  <Tables
                    loading={this.loading}
                    show-header={false}
                    columns={this.table.columns2}
                    value={params.row.list}
                    page={false}
                    draggable={false}
                  ></Tables>
                </div>
              );
            } else {
              return (
                <Row class="txt-a b lh48">
                  <Col span="24" class="ft14">
                    暂无数据
                  </Col>
                </Row>
              );
            }
          }
        }
      ],

      columns: [
        {
          title: "排序",
          key: "sort",
          align: "center",
          render: (h, params) => (
            <Icons type="paixukongjian" color="#dadada" size="20" />
          ),
          width: 60
        },
        // {
        //     title: "排序",
        //     align: "center",
        //     width: 120,
        //     render: (h, params) => {
        //       return (
        //         <div>
        //           <span
        //             class="w50 txt-a ib cs"
        //             onClick={() =>
        //               params.index == 0 || !params.row.id
        //                 ? ""
        //                 : this.sort(params, "up", 1)
        //             }
        //           >
        //             <Icon
        //               class="paixu"
        //               type="md-arrow-round-up"
        //               color={
        //                 params.index == 0 || !params.row.id
        //                   ? "#b3b3b3"
        //                   : "#2D8cF0"
        //               }
        //               size="16"
        //             />
        //           </span>
        //           <span
        //             class="w50 txt-a ib cs"
        //             onClick={() =>
        //               !params.row.id || params.index == this.table.data.length - 1
        //                 ? ""
        //                 : this.sort(params, "down", 1)
        //             }
        //           >
        //             <Icon
        //               class="paixu"
        //               type="md-arrow-round-down"
        //               color={
        //                 params.index == this.table.data.length - 1 || !params.row.id
        //                   ? "#b3b3b3"
        //                   : " #2D8cF0"
        //               }
        //               size="16"
        //             />
        //           </span>
        //         </div>
        //       );
        //     }
        //   },
        {
          title: "游戏类型",
          key: "name",
          align: "center",
          minWidth: 90,

          render: (h, params) => {
            let id = this.searchKey.id;
            return (
              <div>

               <span>
                {id == 1
                  ? "棋牌游戏"
                  : id == 2
                  ? "电子游艺"
                  : id == 3
                  ? "捕鱼游戏"
                  : id == 4
                  ? "彩票游戏"
                  : id == 5
                  ? "真人视讯"
                  : id == 6
                  ? "体育赛事"
                  : "手机端"}
              </span>
              </div>

            );
          }
        },
        {
          title: "游戏标签",
          key: "name",
          align: "center",
          minWidth: 90,
          className: "pr",
            className: "pr",
          render: (h, params) => {
            return (
              <div>
                <span
                  class="celan pl10 pr10"
                  style={{
                    display:
                      params.row.hot && this.type == "platform"
                        ? "inline-block"
                        : "none"
                  }}
                >
                  热门
                </span>
                <span
                  class="celan pl10 pr10"
                  style={{
                    display:
                      params.row.leftColumn && this.type == "title"
                        ? "inline-block"
                        : "none"
                  }}
                >
                  移动侧栏
                </span>
                <span>{params.row.name}</span>
              </div>
            );
          }
        },
        {
          title: "显示",
          key: "status",
          align: "center",
          minWidth: 50,
          render: (h, params) => {
            if (params.row.status == "no") {
              return <span class="pr20 pl20 red-font">终止</span>;
            } else {
              return <span class="pr20 pl20">正常</span>;
            }
          }
        },

        {
          title: "操作",
          align: "center",
          key: "",
          minWidth: 80,
          render: (h, params) => {
            if (this.type == "title") {
              return (
                //标签
                <a
                  onClick={() => {
                    this.setLeftColumn(params.row, "leftColumn");
                  }}
                >
                  {params.row.leftColumn ? "取消侧栏" : "加入侧栏"}
                </a>
              );
            } else {

              return (
								//平台

                <div>
                  	   <a class="mr10"onClick={()=>{
                   this.onHot(params.row)
                 }} > {params.row.hot=='1'?"取消热门":"加入热门"}</a>
                 <a style={{display:this.searchKey.id!=3?'inline-block':"none"}}
                  onClick={() => {
										console.log(3333)
										console.log(params.row._index)
                    this.addType(params.row, params.row._index, 2);
                  }}
                >
                  添加二级分类
                </a>
                </div>

              );
            }
          }
        },
        {
          title: "",
          key: "list",
          align: "center",
          type: "expand",
          minWidth: 80,
          render: (h, params) => {


              if (params.row.list && params.row.list.length) {
                params.row.list.forEach(t => {
                  t.parentIndex = params.index;
                  if (!t.edit) t.edit = false;
                });
                return (
                  <div class='expandTable'>
                    <Tables
                      loading={this.loading}
                      show-header={false}
                      columns={this.table.columns1}
                      value={params.row.list}
                      on-expand={this.onExpand}
                      page={false}
                      draggable={false}

                    ></Tables>
                  </div>
                );
              } else {
                return (
                  <Row class="txt-a b lh48">
                    <Col span="24" class="ft14">
                      暂无数据
                    </Col>
                  </Row>
                );
              }

          }
        }
      ]
    };
  },
  mounted() {
    this.getData(this.type);
  },
  methods: {
    onHot(params){
       let name = params.name;
      let Msg = params.hot ? `您确定取消【${name}】的热门吗?`
        : `您确定将【${name}】加入热门吗?`;
          this.$Tip.confirm({
        content: Msg,
        onOk: () => {
          let data = {
            id: params.id,
            val: params.hot ? 0 : 1,
            key:"hot"
          };
          GameGroupEditor(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success("操作成功");
              this.getData();
            }
          });
        }
      });

    },
    sort(params, key, num, topIndex) {
      let data = [];
      if (num == 1) {
        data = {
          id: params.row.id,
          oldIndex: params.row.sort,
          newIndex:
            key == "up"
              ? this.table.data[params.index - 1].sort
              : this.table.data[params.index + 1].sort
        };
      } else if (num == 2) {
        data = {
          id: params.row.id,
          oldIndex: params.row.sort,
          newIndex:
            key == "up"
              ? this.table.data[params.row.parentIndex].list[params.index - 1]
                  .sort
              : this.table.data[params.row.parentIndex].list[params.index + 1]
                  .sort
        };
      } else {
        data = {
          id: params.row.id,
          oldIndex: params.row.sort,
          newIndex:
            key == "up"
              ? this.table.data[topIndex].list[params.row.parentIndex - 1].list[
                  params.index - 1
                ].sort
              : this.table.data[topIndex].list[params.row.parentIndex + 1].list[
                  params.index + 1
                ].sort
        };
      }
      GameGroupUpSort(data, true).then(res => {
        if (res && res.code) {
          this.$Message.success("排序成功");
          this.getData(params.row.parentIndex, num, topIndex);
        }
      });
      this.$forceUpdate();
    },
    onExpand(row, status) {
      this.table.data.forEach(t => {
        if (t.id == row.id) t._expanded = status;
      });
    },
    change(name) {
      //Tab切换
      if (name == this.type) return;
      else this.type = name;
      this.getData();
    },
    addType(params, i, num) {
			console.log(params.list)
			console.log(num)
      let obj = {
        upId: params.id,
        name: "",
        type: "add",
        topIndex: params.parentIndex,
        level: Number(params.level) + 1,
        leftColumn: 0,
        edit: true
      };
      if (!params.list.length) {
        obj.name = num == 2 ? "全部游戏" : "全部";
      }
      params.list.push(obj);
      if (num == 2) {
        this.table.data[i]._expanded = true;
        this.table.data[i].list = params.list;
      } else {
        this.table.data[i].list[params._index].list = params.list;
        this.table.data[i].list[params._index]._expanded = true;
      }
      this.$forceUpdate();
    },
    eidt(params, i, num, topIndex) {
      if (num == 2) {
        for (let index in this.table.data[i].list) {
          if (
            this.table.data[i].list[index].name == params.name &&
            this.table.data[i].list[index].id &&
            this.table.data[i].list[index].id != params.id
          ) {
            this.$Message.error("改游戏平台名称重复,请重新输入");
            return;
          }
        }
      } else {
        for (let index in this.table.data[topIndex].list[i].list) {
          if (
            this.table.data[topIndex].list[i].list[index].name == params.name &&
            this.table.data[topIndex].list[i].list[index].id &&
            this.table.data[topIndex].list[i].list[index].id != params.id
          ) {
            this.$Message.error("改游戏平台名称重复,请重新输入");
            return;
          }
        }
      }
      if (params.edit) {
        //确定
        if (params.type == "add") {
          //新增平台
          let data = {
            upId: params.upId,
            name: params.name,
            leftColumn: 0,
            level: params.level
          };
          if(!data.name) {
            this.$Message.error('请输入平台名称');
            return
          }
          GameGroupAdd(data, true).then(res => {
            if (res && res.code) {
              this.$Message.success("添加成功");
              this.getData(i, num, topIndex);
            }
          });
        } else {
          //编辑平台
          if (this.table.data[i].list[params._index].name == params.name) {
            this.$Message.success("操作成功");
            params.edit = false;
            return;
          }
          let data = {
            id: params.id,
            val: params.name,
            key: "name"
          };
          if(!data.val) {
            this.$Message.error('请输入平台名称');
            return
          }
          GameGroupEditor(data, true).then(res => {
            if (res && res.code) {
              this.$Message.success("修改成功");
              this.getData(i, num, topIndex);
            }
          });
        }
        params.edit = false;
      } else {
        //编辑
        params.edit = true;
      }
    },
    del(params, i, num, topIndex) {
      if (!params.id) {
        if (num == 2) {
          this.table.data[i].list.splice(params._index, 1);
        } else {
          this.table.data[topIndex].list[i].list.splice(params._index, 1);
        }
        return;
      }
      this.$Tip.confirm({
        content: `您确定要删除【${params.name}】吗?`,
        onOk: () => {
          let data = { id: params.id };
          GameGroupDel(data, true).then(res => {
            if (res && res.code) {
              this.$Message.success("删除成功");
              this.getData(i, num, topIndex);
            }
          });
        }
      });
    },
    setLeftColumn(params, key) {
      //设置侧栏
      let name = params.name;
      let Msg = params.leftColumn
        ? `您确定取消【${name}】的移动侧栏吗?`
        : `您确定将【${name}】标记为移动侧栏吗?`;
      this.$Tip.confirm({
        content: Msg,
        onOk: () => {
          let data = {
            id: params.id,
            val: params.leftColumn ? 0 : 1,
            key
          };
          GameGroupEditor(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success("操作成功");
              this.getData();
            }
          });
        }
      });
    },
    //  拖拽排序
    onDragDrop(oldIndex, newIndex) {
      if (oldIndex == newIndex || oldIndex == "") return;
      const params = {
        id: this.$refs.tables.insideTableData[oldIndex].id,
        oldIndex: this.$refs.tables.insideTableData[oldIndex].sort,
        newIndex: this.$refs.tables.insideTableData[newIndex].sort
      };
      GameGroupUpSort(params, true).then(res => {
        this.getData();
        //不请求接口更改排序
        // this.$refs.tables.insideTableData.splice(newIndex, 0, ...this.$refs.tables.insideTableData.splice(oldIndex, 1));
      });
    },
    getData(i, num, topIndex) {
      if (!num) this.$root.startTableLoading();
      else this.loading = true;
      let id = this.searchKey.id;
      GameGroupList({ id })
        .then(res => {
          if (res && res.code == 200) {
            if (id == 1 || id == 2 || id == 3) {
              //棋牌电子捕鱼
              if (this.type == "title") {
                this.table.data = res.data[0].list.sort((a, b) => {
                  //内容根据sort排序
                  return a.sort - b.sort;
                });
                this.table.columns = this.columns.filter(
                  t => t.key != "status" && t.key != "list"
                );
                this.table.columns.forEach(t => {
                  if (t.title == "游戏平台") t.title = "游戏标签";
                });
              } else {
                this.table.data = res.data[1].list.sort((a, b) => {
                  //内容根据sort排序
                  return a.sort - b.sort;
                });
                this.table.data.forEach(t => {
                  t.list.sort((a, b) => {
                    return a.sort - b.sort;
                  });
                  t.list.forEach(m => {
                    if (m.list) {
                      m.list.sort((a, b) => {
                        return a.sort - b.sort;
                      });
                    }
                  });
                });
                if (i == 0 || i) {
                  //设置默认展开
                  if (num == 2) {
                    res.data[1].list[i]._expanded = true;
                  } else {
                    this.table.data[topIndex]._expanded = true;
                    this.table.data[topIndex].list[i]._expanded = true;
                  }
								}
								console.log(id)
                if (id == 1) {
                  this.table.columns1 = this.columns1.filter(
                    t => t.type != "expand"
                  );
                } else if (id == 2) {
                  this.table.columns1 = this.columns1;
                }
                if (id == 3) {
									//捕鱼去掉操作
									this.table.columns=this.columns
                  // this.table.columns = this.columns.filter(
                  //   t => t.key != "" && t.key != "list"
                  // );
                }
                 else {
                  this.table.columns = this.columns;
                  this.table.columns.forEach(t => {
                    if (t.title == "游戏标签") t.title = "游戏平台";
                  });
                }
                this.loading = false;
                this.$forceUpdate();
              }
            } else {
              //彩票等
              this.table.data = res.data;
              if (id == 7) {
                this.table.columns = this.columns3;
              } else {
                this.table.columns = this.columns.filter(
                  t => t.key != "" && t.key != "list"
                );
                this.table.columns.forEach(t => {
                  if (t.title == "游戏标签") t.title = "游戏平台";
                });
              }
            }
            this.$root.endTableLoading();
          } else {
            this.$root.endTableLoading();
          }
        })
        .catch(error => this.$root.endTableLoading());
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../styles/button.less";
.bold {
  font-weight: bold;
}
/deep/.ivu-tabs-tab {
  font-size: 16px !important;
}
.ivu-table {
  color: #444;
}
.activeType {
  background: #2d8cf0;
  color: white;
}
/deep/.pr {
  position: relative;
}
/deep/.celan {
  line-height: 20ox;
  background: rgb(208, 81, 87);
  color: white;
  position: absolute;
  top: 0;
  right: 0;
}
/deep/.expandTable {
  /deep/ tr:nth-child(2n) {
    td {
      background: white !important;
    }
  };
  /deep/ tr:nth-child(2n-1) {
    td {
      background: #fbfbfb !important;
    }
  }

}
/deep/.expandTable2 {
  /deep/ tr:nth-child(2n) {
    td {
      background: white !important;
    }
  }
}
</style>