<!--
 * @Author: your name
 * @Date: 2020-07-05 20:18:34
 * @LastEditTime: 2020-07-05 21:28:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tgweb_admin_h5_v2\src\views\system\authManagement\components\moneyModals.vue
--> 
<template>
   <Modals ref="moneyModals" title="编辑出入款操作等级" width="1200">
       <div slot="content">
        <LevelSelect v-show="false" ref="LevelSelect" mode="多选" levelType="member" @on-change="onLevelChange" />
        <div v-for="(permission, y) in levelPermission" :key="'persi' + y">
            <div v-if="permission.levels.length" class="mb10">
                <span class="ib pl50 pr10 w120x fl text-overflow-ellipsis">{{ permission.siteName }}</span>

                <Checkbox class="fl" v-model="permission.checked" :indeterminate="permission.indeterminate" @on-change="val => checkAll(permission, val)">全选</Checkbox>
                <div>
                    <div class="ib">
                        <Checkbox
                            v-for="t in permission.levels.slice(0,12)"
                            :value="t.levelLabel"
                            :key="t.id"
                            v-model="t.checked"
                            @on-change="val => checkOne(permission, t, val)"
                            >{{ t.levelName }}</Checkbox
                        >
                    </div>
                    <div class="ml80">
                        <Checkbox
                            v-for="t in permission.levels.slice(12, permission.levels.length)"
                            :value="t.levelLabel"
                            :key="t.id"
                            v-model="t.checked"
                            @on-change="val => checkOne(permission, t, val)"
                            >{{ t.levelName }}</Checkbox
                        >
                    </div>
                </div>
            </div>
        </div>
       </div>
   </Modals>
</template>
<script>
import Modals from "@/components/modals";
import LevelSelect from '@/components/level-select';
    export default{
        name:"moneyModals",
        props:['levelPermission'],
        components:{
            Modals,
            LevelSelect,

        },
        data(){
            return{
                // levelPermission: [] // 出入款等级
            }
        },
        mounted(){
            
        },
        methods:{
            show(){
                this.$refs.moneyModals.show();
                console.log(this.levelPermission)
            },
            onLevelChange(res) {
            this.formKey.levelId = res;
        },
        checkAll(parent, val) {
            // this.$set(parent, 'indeterminate', false);
            // this.$set(parent, 'checked', val);
            // parent.levels.forEach(level => {
            //     this.$set(level, 'checked', val);
            // });
            // // this.createData();
            // // .createData()
            // // this.$refs
            // // this.$parent.createData();
           this.$parent.$parent.checkAll(parent, val)
        },
        checkOne(parent, le, val){
            this.$parent.$parent.checkOne(parent, le, val)
        }
        }
    }
</script>
