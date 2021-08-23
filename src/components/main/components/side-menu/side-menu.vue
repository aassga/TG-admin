<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu
      ref="menu"
      v-show="!collapsed"
      :active-name="showActiveName"
      :open-names="openedNames"
      :accordion="accordion"
      :theme="theme"
      width="auto"
      @on-open-change='openChange'
      @on-select="handleSelect"
    >
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1 && !item.meta.hideInMenu">
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <menu-item
            v-else
            :name="getNameOrHref(item, true)"
            :key="`menu-${item.children[0].name}`"
            :class="item.name === ($route.meta.activeKey) ? 'ivu-menu-item-active':''"
          >
            <Icons :type="item.children[0].icon || ''"/>
            <span>{{ showTitle(item.children[0]) }}</span>
          </menu-item>
        </template>
        <template v-else>
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item" :class="item.icon === ($route.meta.icon)?'ivu-menu-item-active':''"></side-menu-item>
          <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`" :class="item.name === ($route.meta.activeKey)?'ivu-menu-item-active':''">
            <Icons :type="item.icon || ''"/>
            <span :style="style">{{ showTitle(item) }}</span>
          </menu-item>
        </template>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu
          v-if="item.children && item.children.length > 1"
          @on-click="handleSelect"
          hide-title
          :root-icon-size="rootIconSize"
          :icon-size="iconSize"
          :theme="theme"
          :parent-item="item"
          :key="`drop-menu-${item.name}`"
        ></collapsed-menu>
        <Tooltip
          transfer
          v-else
          theme="dark"
          :content="showTitle(item.children && item.children[0] ? item.children[0] : item)"
          placement="right"
          :key="`drop-menu-${item.name}`"
        >
          <a
            @click="handleSelect(getNameOrHref(item, true))"
            class="drop-menu-a"
            :style="{textAlign: 'center'}"
          >
            <Icons
              :size="rootIconSize"
              color="#808080"
              :type="item.icon || (item.children && item.children[0].icon)"
            />
          </a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
import SideMenuItem from "./side-menu-item.vue";
import CollapsedMenu from "./collapsed-menu.vue";
import { getUnion } from "@/libs/tools";
import mixin from "./mixin";

export default {
  name: "SideMenu",
  mixins: [mixin],
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: "light"
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ""
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      style:screen.width<1500?'font-size:1.125rem !important':'',
      screen:screen.width,
      openedNames: [],
      showActiveName: this.activeName
    };
  },
  computed: {
    textColor() {
      return this.theme === "dark" ? "#fff" : "#495060";
    },
    menuItem () {
      return this.$store.state.app.menuItem.count
    }
  },
  watch: {
    activeName(name) {
      if (this.accordion) {
        this.openedNames = this.getOpenedNamesByActiveName(name);
      } else {
        this.openedNames = getUnion( this.openedNames, this.getOpenedNamesByActiveName(name) );
      }
      this.$nextTick(() => {
        this.showActiveName = name
      })
    },
    openNames(newNames) {
      this.openedNames = newNames;
    },
    openedNames() {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened();
      });
    },
    menuItem () {
      this.refreshActiveName(this.$store.state.app.menuItem.name)
    }
  },
  mounted() {
    this.openedNames = getUnion(
      this.openedNames,
      this.getOpenedNamesByActiveName(name)
    );
  },
  methods: {
    openChange(name) {
      this.menuList.forEach(i=>{
        if(i.name === name[0]) {
          // this.handleSelect(i.children[0].name)
        }
      })
    },
    handleSelect(name) {
      this.$emit("on-select", name);
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched
        .map(item => item.name)
        .filter(item => item !== name);
    },
    updateOpenName(name) {
      if (name === this.$config.homeName) this.openedNames = [];
      else this.openedNames = this.getOpenedNamesByActiveName(name);
    },
    refreshActiveName (val) {
      this.showActiveName = ''
      this.$nextTick(()=> this.showActiveName = val)
    }
  }
};
</script>
<style lang="less">
@import "./side-menu.less";
@import "../../main.less";
</style>
