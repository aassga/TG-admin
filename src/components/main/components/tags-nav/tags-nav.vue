<template>
  <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer @on-click="handleTagsOption" style="margin-top:7px;">
        <div size="small" type="text" >
          <Icon :size="18" type="ios-close-circle-outline" style="margin-top:-17px" />
        </div>
        <DropdownMenu slot="list" >
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <ul
      v-show="visible"
      :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}"
      class="contextmenu"
    >
      <li v-for="(item, key) of menuList" @click="handleTagsOption(key)" :key="key" >{{item}}</li>
    </ul>
    <div class="btn-con left-btn" v-show="leftBtnShow">
      <Button type="text" @click="handleScroll(240)">
        <Icon :size="18" type="ios-arrow-back"/>
      </Button>
    </div>
    <!-- <div class="btn-con right-btn">
      <Button type="text" @click="handleScroll(-240)">
        <Icon :size="18" type="ios-arrow-forward"/>
      </Button>
    </div> -->
    <div
      class="scroll-outer"
      ref="scrollOuter"
      @DOMMouseScroll="handlescroll"
      @mousewheel="handlescroll"
    >
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
       <!-- <draggable 
        element='div'
        :list='list'
        :sort='true'
        :forceFallbac='false'
        :group="{ name: 'tagNav', pull: 'clone', put: 'clone' }"
        filter='.disabled'
        @start="dragging=true"
        @end='dragging=false'
        @update='onUpdate'
       > -->
          <transition-group name="taglist-moving-animation">
          <Tag
            v-for="(item, index) in list"
            :class="index == 0 ? (isCurrentTag(item) ? 'v2-tag-active disabled' : 'disabled') : (isCurrentTag(item) ? 'v2-tag-active' : '')"
            ref="tagsPageOpened"
            draggable
            :key="`tag-nav-${index}`"
            :name="item.name"
            :data-route-item="item"
            @on-close="handleClose(item)"
            @click.native="handleClick(item)"
            :closable="item.name !== $config.homeName"
            @contextmenu.prevent.native="contextMenu(item, $event)"
            @dragstart.native="menuItemDrag(index)"
            @dragover.native="menuItemOver"
            @drop.native="menuItemDrop($event,index)"
            @dragend.native="menuItemDragEnd"
          >{{ showTitleInside(item) }}</Tag>
        </transition-group>
       <!-- </draggable> -->
      </div>
    </div>
  </div>
</template>

<script>
import { showTitle, routeEqual } from "@/libs/util";
import draggable from 'vuedraggable'
import { mapMutations,mapActions} from 'vuex';
import beforeClose from "@/router/before-close";
export default {
  name: "TagsNav",
  components: { draggable },
  props: {
    value: Object,
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      style: { left: "5px" },
      leftBtnShow:false,
      count: 0,
      tagBodyLeft: 0,
      rightOffset: 40,
      outerPadding: 4,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      visible: false,
      menuList: {
        others: "关闭其他",
        all: "关闭所有"
      },
      _list: [],
    };
  },
  computed: {
    currentRouteObj() {
      const { name, params, query } = this.value;
      return { name, params, query };
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    }
  },
  watch: {
    $route(to) {
      this.setActiveMenu(to.matched[0].name)
      this.getTagElementByRoute(to);
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    tagBodyLeft(value){
      if(value < 0) this.leftBtnShow = true;
    },
    //最多只能打开10个，大于10个默认关闭首页外的第一个
    list(val,oldVal) {
      if(val.length > 10) {
        val.splice(1,1)
      }
      this._list = JSON.parse(JSON.stringify(val))
    }
  },
  mounted() {
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setTimeout(() => {
      this.getTagElementByRoute(this.$route);
    }, 200);
    this.showLeftBtn();
  },
  methods: {
    ...mapMutations(['setActiveMenu','setTagNavList']),
    ...mapActions(["changeFresh", "clearTime", "setTimer"]),
    showLeftBtn() {
      let scrollOuterWidth = this.$refs.scrollOuter.offsetWidth;
      let allTagWidth = (this.tagNavList.length - 1 ) * 139;
      if(allTagWidth > scrollOuterWidth){
        this.style.left = "28px";
        this.leftBtnShow = true;
      } else {
        this.style.left = "5px";
        this.leftBtnShow = false;
      }
    },
    handlescroll(e) {
      var type = e.type;
      let delta = 0;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      this.handleScroll(delta);
    },
    handleScroll(offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft;
          } else {
            this.tagBodyLeft = Math.max(
              this.tagBodyLeft + offset,
              outerWidth - bodyWidth
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
    },
    handleTagsOption(type) {
      if (type.includes("all")) {
        // 关闭所有，除了home
        this.setActiveMenu('member')
        setTimeout(() => {
          let res = this.list.filter(item => item.name === this.$config.homeName);
          this.$emit("on-close", res, "all");
        },50)
        // 当关闭所有的公 司入款刷新按钮需要关闭状态
        this.changeFresh({ stage: "payCompany", val:'0'}); //改变时间
        this.changeFresh({ stage: "payOnline", val:'0' });
        this.changeFresh({ stage: "with", val:'0'})
        this.changeFresh({ stage: "virtualIncome", val:'0' });
            this.changeFresh({ stage: "moneyWithdrawal", val: "0" });
      } else if (type.includes("others")) {
        // 关闭除当前页和home页的其他页
        let res = this.list.filter(
          item =>
            routeEqual(this.currentRouteObj, item) ||
            item.name === this.$config.homeName
        );
        this.$emit("on-close", res, "others", this.currentRouteObj);
        setTimeout(() => {
          this.getTagElementByRoute(this.currentRouteObj);
          this.tagBodyLeft = 0;
        }, 100);
      }
      this.leftBtnShow = false;
    },
    handleClose(current) {
      this.showLeftBtn();
      if ( current.meta && current.meta.beforeCloseName && current.meta.beforeCloseName in beforeClose ) {
        new Promise(beforeClose[current.meta.beforeCloseName]).then(close => {
          if (close) {
            this.close(current);
          }
        });
      } else {
        this.close(current);
      }
      if(this.list.length == 2){
        this.$router.push({name: this.$config.homeName})
      }
    },
    close(route) {
      if (route.meta.related && route.meta.related.length > 0) {
        for (let routerName of route.meta.related) {
          let deepRoutes = this.tagNavList.filter((item) => item.name === routerName)
          if (deepRoutes.length > 0) {
            this.close(deepRoutes[0])
          }
        }
      }

      let res = this.tagNavList.filter(item => !routeEqual(route, item));
      this.$emit("on-close", res, undefined, route);
    },
    handleClick(item) {
      this.setActiveMenu(item.path.split('/')[1])
      setTimeout(() => {  //延时是为了页面所有导航的同步效果
        this.showLeftBtn();
        this.$emit("input", item);
      },80)
    },
    showTitleInside(item) {
      return showTitle(item, this);
    },
    isCurrentTag(item) {
      return routeEqual(this.currentRouteObj, item);
    },
    moveToView(tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0;
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding;
      } else if (
        tag.offsetLeft > -this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding
        );
      } else {
        // 标签在可视区域右侧
        if (this.$route.name == 'memberSearch') this.tagBodyLeft = 0
        else this.tagBodyLeft = -( tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth) );
      }
    },
    getTagElementByRoute(route) {
      this.$nextTick(() => {
        this.refsTag = this.$refs.tagsPageOpened;
        this.refsTag.forEach((item, index) => {
          if (routeEqual(route, item.$attrs["data-route-item"])) {
            let tag = this.refsTag[index].$el;
            this.moveToView(tag);
          }
        });
      });
    },
    contextMenu(item, e) {
      if (item.name === this.$config.homeName) {
        return;
      }
      this.visible = true;
      const offsetLeft = this.$el.getBoundingClientRect().left;
      this.contextMenuLeft = e.clientX - offsetLeft + 10;
      this.contextMenuTop = e.clientY - 64;
    },
    closeMenu() {
      this.visible = false;
    },
     //拖拽排序
    menuItemDrag (i) {
      this.i = i;
    },
    menuItemDragEnd() {
      this.i = null;
    },
    menuItemOver (e) {
      if (this.i !== null) e.preventDefault();
    },
    menuItemDrop ($event,newIndex) {
      if (this.i !== null) {
        let changeOne = this.list[this.i];
        if(this.i==0||newIndex==0){
          return
        }else{
          this.list.splice(this.i,1);
          this.list.splice(newIndex,0,changeOne);
          this.setTagNavList(this.list)
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./tags-nav.less";

</style>
