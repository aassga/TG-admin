<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <Icons :type="parentItem.icon || ''"/>
      <span :style="style">{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`" ><Icons :type="item.children[0].icon || ''"/><span :style="style">{{ showTitle(item.children[0]) }}</span></menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item" ></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`"
        :class="item.meta.routeKey === ($route.meta.activeKey)?'ivu-menu-item-active':''"><Icons :type="item.icon || ''"/><span :style="style">{{ showTitle(item) }}</span></menu-item>
      </template>
    </template>
  </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ],
  data(){
    return {
      style:screen.width<1500?'font-size:1.125rem !important':'',
    };
  }
}
</script>
