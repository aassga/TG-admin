<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <div class="v2-button mb0" v-if="rentType != 'rent'">
                    <Button @click="addSite" v-if="adminType == 'super' || authInPage.indexOf('siteManagementCreate') != -1">新增站点</Button>
                </div>
                <FormItem label="站点类型">
                    <Select clearable v-model="searchKey.site_class" class="s-86" placeholder="全部">
						<Option v-for="(t, i) in  siteClass" :key="i" :value="t.key">{{ t.name }}</Option>
					</Select>
                </FormItem>
                <FormItem label="站点名称">
                    <Input class="s-140" placeholder="请输入站点名称" v-model="searchKey.siteName" clearable />
                </FormItem>
                <FormItem>
                    <Select clearable v-model="select" class="w105x mr20" placeholder="全部">
                       <Option value='siteCode'>站点代号</Option>
                       <Option value='id'>站点编号</Option>
                    </Select>
                    <Input class="s-140" placeholder="请输入站点代号" @keyup.enter.native="submit" v-model="searchKey[select]" clearable />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" :loading="loading" @click.prevent="submit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <Row v-if='spinShow'>
            <Spin size="large" fix v-if="spinShow" style="margin-top:100px">
            <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
            <div v-for="t in 8" :key="'div'+t"></div>
          </div>
          </Spin>
        </Row>
        <Row v-else>
          <span
            v-for="(item, index) in siteList"
            :key="index"
            class="gameMaintain ib mr20 mb20 pr20 pl20"
            :name="item.name"
            :data-route-item="item"
            :class="screen>=1921?'w364x':screen<1921&&screen>=1537?'w258x':screen<1537&&screen>=1460?'w264x':'w291x'"
          >
          <P>
              <span class="w100 ib txt-l over">站点名称 : {{item.siteName}}</span>
              <span class="w100 nowrap">
                  <span class="w50 ib txt-l">站点编号 : {{item.id}}</span>
                    <span class="w50 ib txt-r">站点代号 : {{item.siteCode}}</span>
              </span>
              
          </P>
          <P>
              <span class="fr txt-r blue-font" @click="onEdit(item.id)">编辑</span>
              <span class="fl txt-l blue-font" @click="onDetail(item.id)">详情</span>
          </P>
          </Span>
        </Row>
    </div>
</template>
<script>
import Tables from '_c/tables';
import { siteManagementList, siteManagementUpdate } from '@/api/system';
import { getUserType, getAccessFromLocal } from '@/libs/util';
import { customSiteItems } from '@/api/common';
import { mapMutations,mapState } from 'vuex';

export default {
    name: 'siteList',
    components: {
        Tables
    },
    computed:{
          ...mapState({siteClass: state => state.user.siteClass,})
		},
    data() {
        return {
            screen:screen.width,
            select:'siteCode',
            spinShow:false,
            loading:false,
            siteList:[],
            rentType: localStorage.loginType,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            accessSite: getAccessFromLocal(),
            searchKey: { 
                limit: 100,
                site_class:'',
            },
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData({ params: vm.searchKey });
        });
    },
    methods: {
        ...mapMutations(['setAccess']),
        getData(data) {
            if (data.params.siteCode) data.params.siteCode = this.$root.trimAll(data.params.siteCode);
            if (data.params.siteName) data.params.siteName = this.$root.trimAll(data.params.siteName);
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            let reg = /[a-z0-9]$/;
            if (data.params.siteCode && !reg.test(data.params.siteCode)) {
                this.$Tip.info({ content: '您所查询的站点代号不正确，请重新输入' });
                return false;
            }
            this.loading=true;
            this.spinShow=true;
            siteManagementList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
                    this.siteList = data;
                    this.loading = false;
                    this.spinShow=false;
                }else{
                     this.loading = false;
                     this.spinShow=false;
                }
            }).catch(error=> this.loading = false,this.loading=false);
        },
        onPageChange(page) {
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        },
        submit() {
            if(this.select=='siteCode') delete this.searchKey.id;
            else delete this.searchKey.siteCode;
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        },
        // 查看详情
        onDetail(params) {
            this.$router.push({
                name: 'siteDetail',
                query: { siteListId: params }
            });
        },
        // 新增,编辑站点
        addSite() {
            this.$router.push({
                name: 'siteAdd',
                params: { page: 'create' },
                
            });
        },
        onEdit(params) {
            this.$router.push({
                name: 'siteAdd',
                // params: { page: "edit" },
                query: { siteListId: params, page: 'edit' }
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
@import '../../../styles/class.less';
.gameMaintain {
  border: 1px solid #dcdcdc;
  font-size: .875rem /* 14/16 */;
  height: 125px;
  border-radius: 0;
  text-align: center;
  &:hover {
    border: 1px solid #2d8cf0;
  }
  span {
    line-height: 38px;    
  }
}
.siteId {
    width: ~"calc(100% - 112px)";
}
.w258x {
  width: 258px;
}
.w364x {
  width: 364px;
}
.w264x {
  width:264px
}
.w291x {
  width: 291px;
}
.over {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.nowrap {
  white-space: nowrap;
  height: 42px;
  line-height: 42px;
}
</style>
