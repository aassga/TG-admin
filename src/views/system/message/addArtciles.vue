<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" :model="searchKey" :rules="rules">
                <div class="mb20">
                    <FormItem label="文章标题" prop="title">
                        <Select class="w190x" v-model="searchKey.title" @on-change="changeType" clearable>
                            <Option v-for="(item, index) in artcilesList" :value="item.name" :key="index">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </div>
                <div class="mb20">
                    <FormItem v-if="seltext" label="自定义标题" prop="newtitle">
                        <Input class="w190x" v-model="searchKey.newtitle" placeholder="请输入自定义标题" />
                    </FormItem>
                </div>
                <div class="mb20">
                    <FormItem v-if="seltext" label="自定义地址" prop="custom_url">
                        <Input class="w190x" v-model="searchKey.custom_url" placeholder="请输入自定义地址" />
                    </FormItem>
                </div>
                <div class="mb20">
                    <FormItem label="发布平台" prop="newclient_type">
                        <CheckboxGroup v-model="searchKey.newclient_type" @on-change="changeplatform">
                            <Checkbox label="PC"></Checkbox>
                            <Checkbox label="H5"></Checkbox>
                            <Checkbox label="Android"></Checkbox>
                            <Checkbox label="IOS"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </div>
                <div class="clearfix" v-show="showPC">
                    <!-- <span class="ml40 fl">PC</span> -->
                    <div class="fl client" style="width: 4%; margin-right:12px">PC</div>
                    <!-- <editor class="w690x fl ml30" ref="editor" :value="contentpc" @on-change="handleChangepc"/> -->
                    <UE class="fl" style="width: 90%;" :defaultMsg="defaultMsg1" :config="config" :id="ue1" ref="ue1" :key="ue1"></UE>
                </div>
                <div class="clearfix mt30" v-show="showh5">
                    <div class="fl client" style="width: 4%;margin-right:12px">手机端</div>
                    <!-- <span class="ml20 fl">手机端</span> -->
                    <!-- <editor
            class="w690x fl ml30"
            ref="editor"
            :value="contentphone"
            @on-change="handleChangephone"
          /> -->
                    <UE class="fl" style="width: 90%;" :defaultMsg="defaultMsg3" :config="config" :id="ue2" ref="ue2" :key="ue2"></UE>
                    <!-- <VueQuillEditor class="fl" style="width: 90%;" :defaultMsg="defaultMsg3" :config="config" :id="ue2" ref="ue2" :key="ue2"></VueQuillEditor> -->
                    <!-- <kindeditor class="fl" style="width: 90%;" :defaultMsg="defaultMsg3" :config="config" :id="ue2" ref="ue2" :key="ue2"></kindeditor> -->
                </div>
                <div class="mt30">
                    <FormItem label="状态">
                        <Select class="w190x" v-model="searchKey.status">
                            <Option value="yes">已启用</Option>
                            <Option value="no">未启用</Option>
                        </Select>
                        <div class="wz-btn">
                            <Button class="ivu-btn mt30 addSave" @click.prevent="save">{{ $route.params.page === 'edit' ? '确认保存' : '确认新增' }}</Button>
                        </div>
                    </FormItem>
                </div>
            </Form>
        </div>
    </div>
</template>
<script>
import UE from '_c/UE';
//import VueQuillEditor from '_c/VueQuillEditor';
//import kindeditor from '_c/kindeditor';
import { articleIns, articleDetail, articleUpt } from '@/api/system';
export default {
    name: 'addArtciles',
    components: {
        UE,
        //VueQuillEditor,
        //
    },
    data() {
        return {
            editorText: '直接初始化值', // 双向同步的变量
            editorTextCopy: '',  // content-change 事件回掉改变的对象
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'change'
                    }
                ],
                custom_url: [
                    {
                        required: true,
                        message: '请输入自定义地址',
                        trigger: 'blur'
                        // pattern: /.+/
                    }
                ],
                newtitle: [
                    {
                        required: true,
                        message: '请输入自定义标题',
                        trigger: 'blur',
                        pattern: /.+/
                    }
                ],
                newclient_type: [
                    {
                        required: true,
                        message: '请选择客户端',
                        trigger: 'change',
                        pattern: /.+/
                    }
                ]
            },
            defaultMsg1: '',
            defaultMsg3: '',
            config: {
                initialFrameWidth: 900,
                initialFrameHeight: 350
            },
            ue1: 'ue1',
            ue2: 'ue2',
            seltext: false,
            otherList: false,
            showh5: true,
            showPC: true,
            searchKey: {
                siteId: '',
                siteName: '',
                type: 'article',
                title: '',
                client_type: 'PC',
                newclient_type: ['PC', 'H5', 'Android', 'IOS'],
                description: '',
                status: 'yes',
                desc_mobile: '',
                custom_url: '',
                newtitle: ''
            },
            artcilesList: [
                { value: '0', name: '自定义' },
                { value: '1', name: '关于我们' },
                { value: '2', name: '公司简介' },
                { value: '3', name: '联系我们' },
                { value: '4', name: '新手指南' },
                { value: '5', name: '合作加盟' },
                { value: '6', name: '优惠活动' },
                { value: '7', name: '合作伙伴' },
                { value: '8', name: '存款帮助' },
                { value: '9', name: '取款帮助' },
                { value: '9', name: '常见问题' }
            ],
            fruit: [],
            contentpc: '',
            contentphone: ''
        };
    },
    mounted() {
        if (this.$route.params.page === 'edit') {
            const data = { id: this.$route.query.id, siteId: this.$root.nowSite.id };
            this.searchKey.newclient_type = [];
            this.searchKey.client_type = '';
            this.onDetails(data);
        } else this.changeplatform();
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        onContentChange(val){
            this.editorTextCopy = val;
            console.log(this.editorTextCopy,131)
        },
        // 改变富文本框
        handleChangepc(html, text) {
            this.searchKey.description = html.toString();
        },
        handleChangephone(html, text) {
            this.searchKey.desc_mobile = html.toString();
        },
        changeContent() {
            this.$refs.editor.setHtml('<p>powered by wangeditor</p>');
        },
        changeplatform() {
            let platformList = [];
            this.showPC = this.searchKey.newclient_type.some(item => item == 'PC');
            this.showh5 = this.searchKey.newclient_type.some(item => item == 'H5' || item == 'Android' || item == 'IOS');
            this.searchKey.newclient_type.forEach((item, index) => {
                if (platformList.indexOf(this.searchKey.newclient_type[index]) == -1) {
                    platformList.push(item);
                }
            });
            if (platformList.length > 1) this.searchKey.client_type = platformList.join(',');
            else this.searchKey.client_type = platformList[0];
        },
        //自定义可以编辑
        changeType() {
            if (this.searchKey.title == '自定义') {
                this.seltext = true;
            } else {
                this.seltext = false;
            }
        },
        save() {
            const params = { ...this.searchKey };
            this.$refs.searchKey.validate(valid => {
                if (valid) {
                    if (this.$route.params.page === 'create') {
                        console.log( this.searchKey)
                        if (this.showPC && !this.showh5) {
                            this.searchKey.description = this.$refs.ue1.getUEContent();
                        }
                        console.log(3424234)
                        if (this.showh5 && !this.showPC) {
                            this.searchKey.desc_mobile = this.$refs.ue2.getUEContent();
                        }
                        console.log(99999)
                        if (this.showh5 && this.showPC) {
                            this.searchKey.description = this.$refs.ue1.getUEContent();
                            this.searchKey.desc_mobile = this.$refs.ue2.getUEContent();
                        }
                        console.log(2)
                        const params = { ...this.searchKey };
                        params.siteId = this.$root.nowSite.id;
                        params.siteName = this.$root.nowSite.siteName;
                        // if (params.status == "1") params.status = "yes";
                        // else params.status = "no";
                        if (params.title == '自定义') {
                            params.title = params.newtitle;
                        } else {
                            delete params.custom_url;
                        }
                        console.log(2)
                        if (params.client_type == 'PC') {
                            delete params.desc_mobile;
                            params.description = this.$refs.ue1.getUEContent();
                            if (!params.description) {
                                this.$Message.error('请填写PC端文章内容！');
                                return false;
                            }
                        } else if (!/PC/.test(params.client_type)) {
                            delete params.description;
                        }
                         console.log(2)
                        if (/(Android)|(IOS)|(H5)/.test(params.client_type)) {
                            params.desc_mobile = this.$refs.ue2.getUEContent();
                            if (!params.desc_mobile) {
                                this.$Message.error('请填写手机端文章内容！');
                                return false;
                            }
                        }
                        delete params.newtitle;
                        delete params.newclient_type;
                        for (let key in params) {
                            if (!params[key]) delete params[key];
                        }
                         console.log(params)
                        articleIns(params, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success(res.data);
                                this.$router.go(-1);
                            }
                        });
                    }
                    if (this.$route.params.page === 'edit') {
                        if (this.showPC && !this.showh5) {
                            this.searchKey.description = this.$refs.ue1.getUEContent();
                        }
                        if (this.showh5 && !this.showPC) {
                            this.searchKey.desc_mobile = this.$refs.ue2.getUEContent();
                        }
                        if (this.showh5 && this.showPC) {
                            this.searchKey.description = this.$refs.ue1.getUEContent();
                            this.searchKey.desc_mobile = this.$refs.ue2.getUEContent();
                        }
                        const params = { ...this.searchKey };
                        params.siteId = this.$root.nowSite.id;
                        params.id = this.$route.query.id;
                        params.siteName = this.$root.nowSite.siteName;
                        // if (params.status == true) params.status = "yes";
                        // else params.status = "no";
                        if (params.title == '自定义') {
                            params.title = params.newtitle;
                        } else {
                            delete params.custom_url;
                        }
                        if (params.client_type == 'PC') {
                            delete params.desc_mobile;
                            if (!params.description) {
                                this.$Message.error('请填写PC端文章内容！');
                                return false;
                            }
                        } else if (!/PC/.test(params.client_type)) {
                            delete params.description;
                        }
                        if (params.client_type.includes('H5')) {
                            if (!params.desc_mobile) {
                                this.$Message.error('请填写手机端文章内容！');
                                return false;
                            }
                        }
                        delete params.newtitle;
                        delete params.newclient_type;
                        console.log(params)
                        articleUpt(params, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success('新增文章成功');
                                this.$router.push({ name: 'siteArtciles' });
                            }
                        });
                    }
                } else {
                    this.$Message.error('请填写正确的信息！');
                }
            });
        },
        onDetails(data) {
            articleDetail(data).then(res => {
                Object.keys(this.searchKey).forEach(key => {
                    if (key == 'status') {
                        this.searchKey[key] = res.data[key];
                        // this.searchKey[key] = res.data[key] == "yes" ? true : false;
                    } else if (key == 'newclient_type' || key == 'newtitle') {
                        this.searchKey[key] = this.searchKey[key];
                    } else {
                        this.searchKey[key] = res.data[key];
                    }
                });
                if (!/PC/.test(this.searchKey.client_type)) {
                    this.searchKey.description = '';
                }
                if (!/H5|Android|IOS/.test(this.searchKey.client_type)) {
                    this.searchKey.desc_mobile = '';
                }
                const { newclient_type, client_type, title, newtitle, custom_url, description, desc_mobile } = this.searchKey;
                if (client_type.length == 1) newclient_type.push(client_type);
                else
                    client_type.split(',').map(item => {
                        newclient_type.push(item);
                    });
                this.showh5 = newclient_type.some(item => item == 'H5' || item == 'Android' || item == 'IOS');
                this.showPC = newclient_type.some(el => el === 'PC');
                // this.$refs.ue1._data.editor.body.innerHTML=description
                // this.defaultMsg1=description
                this.$nextTick(() => {
                    this.defaultMsg1 = description;
                    this.defaultMsg3 = desc_mobile;
                });
                if (custom_url) {
                    this.seltext = true;
                    this.searchKey.newtitle = this.searchKey.title;
                    this.searchKey.title = '自定义';
                }
            });
        }
    }
};
</script>
<style scoped lang="less">
@import '../../../styles/button.less';

/deep/.ivu-select-dropdown {
    z-index: 200000000 !important;
}
/deep/.ivu-form-item-label {
    width: 5% !important;
    text-align: right;
    min-width: 100px;
    padding-right: 10px !important;
}
.client {
    margin-right: 12px;
    width: 5% !important;
    text-align: right;
    min-width: 100px;
    padding-right: 10px !important;
}
/deep/.ivu-form-item .ivu-form-item-label {
    line-height: 46px;
}
/deep/.ivu-table .ivu-table-tip {
    height: auto !important;
    .ivu-table-tip td {
        height: 48px;
    }
}
.wz-btn {
    width: 100%;
    margin-bottom: 50px;
}
</style>
