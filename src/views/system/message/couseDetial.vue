<template>
    <div>
        <Form ref="formKey" :label-width='100' :model="formKey" :rules="rules">
            <div class="mb20 mt20">
                <FormItem label="信息标题" prop="title">
                    <Input placeholder="请输入标题" class="w609x ml5" v-model="formKey.title" />
                </FormItem>
            </div>
            <div class="clearfix box" style="display:flex">
                <FormItem prop="publish_at" class="clearfix fl rili" label="开始日期" style="width:344px">
                    <DatePicker
                        type="datetime"
                        placeholder="开始日期"
                        class="w150x ml5"
                        style="width: 255px;"
                        v-model="formKey.publish_at"
                        :options="options3"
                        format="yyyy-MM-dd HH:mm"
                    ></DatePicker>
                </FormItem>
                <FormItem prop="offline_at" class="ml10 fl clearfix rili" label="结束日期" style="width:344px">
                    <DatePicker
                        type="datetime"
                        placeholder="结束日期"
                        class="w150x ml5"
                        v-model="formKey.offline_at"
                        :options="options3"
                        style="width: 255px;"
                        format="yyyy-MM-dd HH:mm"
                    ></DatePicker>
                </FormItem>
            </div>
            <FormItem label="客户端" prop="newclient_type">
                <CheckboxGroup v-model="formKey.newclient_type" @on-change="checkAllGroupChange">
                    <Checkbox label="PC" class='ml5'></Checkbox>
                    <Checkbox label="H5"></Checkbox>
                    <Checkbox label="Android"></Checkbox>
                    <Checkbox label="IOS"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="编辑内容" prop="description">
                <Input class="maxw ml5" type="textarea" :rows="14" style="width:609px;" placeholder="请输入信息内容" v-model="formKey.description" />
            </FormItem>
            <FormItem label="状态">
                <!-- <Switch v-model="formKey.status" class="ml30" size="large"></Switch>
                <span class="ml20">{{ formKey.status == false ? '未启用' : '已启用' }}</span> -->
                <Select class="w190x ml5" v-model="formKey.status">
                    <Option value="yes">正常</Option>
                    <Option value="no">停用</Option>
                </Select>
                
            </FormItem>
            <FormItem label="">
                <Button class="ivu-btn addSave ml5" @click.prevent="save">{{ $route.params.page === 'edit' ? '确认保存' : '确认新增' }}</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { lanternIns, lanternUpt, lanternDetail } from '@/api/system';
export default {
    name: 'couseDetial',
    data() {
        return {
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }
                ],
                publish_at: [
                    {
                        required: true,
                        message: '请选择开始日期',
                        trigger: 'change',
                        pattern: /.+/
                    }
                ],
                offline_at: [
                    {
                        required: true,
                        message: '请选择结束日期',
                        trigger: 'change',
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
                ],
                description: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur',
                        pattern: /.+/
                    }
                ]
            },
            options3: {
                disabledDate: date => {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            options4: {
                disabledDate: date => {
                    return date && date.valueOf() < Date.now();
                }
            },
            searchKey: {
                text: 'text'
            },
            type: false,
            content: '12312323',
            switch1: false,
            indeterminate: true,
            checkAll: false,
            checkAllGroup: ['PC'],
            list: [ { value: '2', name: '登录后' },{ value: '1', name: '登录前' }, { value: '3', name: '不限制' }],
            formKey: {
                siteId: '',
                siteName: '',
                type: 'lantern',
                title: '',
                publish_at: '',
                offline_at: '',
                // publish_at: this.$root.startTime(),
                // offline_at: this.$root.formatnightTimeS(),
                desc_format_type: 'text',
                description: '',
                status: 'yes',
                client_type: '',
                newclient_type: []
            }
        };
    },
    created() {
        if (this.$route.params.page === 'edit') {
            const data = { id: this.$route.query.id, siteId: this.$root.nowSite.id };
            this.onDetails(data);
        }
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        onText() {},
        onImg() {},
        //新增公告成功
        save() {
            this.$refs.formKey.validate(valid => {
                if (valid) {
                    if (this.$route.params.page === 'add') {
                        const params = { ...this.formKey };
                        let Time = [params.publish_at, params.offline_at];
                        if (this.$root.validatecourseTime(Time)) {
                            params.publish_at = this.$root.formatTimeS(params.publish_at);
                            params.offline_at = this.$root.formatTimeS(params.offline_at);
                        } else {
                            return false;
                        }
                        params.siteId = this.$root.nowSite.id;
                        params.siteName = this.$root.nowSite.siteName;
                        //if (params.status == true) params.status = 'yes';
                        //else params.status = 'no';
                        delete params.newclient_type;
                        lanternIns(params, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success(res.data);
                                this.$router.push({
                                    name: 'notice',
                                    params: { page: 'success' }
                                });
                            }
                        });
                    }
                    if (this.$route.params.page === 'edit') {
                        const params = { ...this.formKey };
                        let Time = [params.publish_at, params.offline_at];
                        if (this.$root.validatecourseTime(Time)) {
                            params.publish_at = this.$root.formatTimeS(params.publish_at);
                            params.offline_at = this.$root.formatTimeS(params.offline_at);
                        } else {
                            return false;
                        }
                        params.siteId = this.$root.nowSite.id;
                        params.id = this.$route.query.id;
                        params.siteName = this.$root.nowSite.siteName;
                       // if (params.status == true) params.status = 'yes';
                        //else params.status = 'no';
                        delete params.newclient_type;
                        lanternUpt(params, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success('新增走马灯成功');
                                this.$router.push({
                                    name: 'notice',
                                    params: { page: 'success' }
                                });
                            }
                        });
                    }
                } else {
                    // this.$Message.error("请填写正确的信息！");
                }
            });
        },
        // 改变富文本框
        handleChange(html, text) {
            this.formKey.description = text;
        },
        changeContent() {
            this.$refs.editor.setHtml('<p>powered by wangeditor</p>');
        },
        change(status) {
            //   this.$Message.info("开关状态：" + status);
        },
        // 全选
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                this.checkAllGroup = ['PC', 'H5', 'Android', 'IOS'];
            } else {
                this.checkAllGroup = [];
            }
        },
        checkAllGroupChange() {
            let clientlist = [];
            this.showh5 = this.formKey.newclient_type.some(item => item == 'H5' || item == 'Android' || item == 'IOS');
            this.formKey.newclient_type.map(item => {
                clientlist.push(item);
            });
            if (clientlist.length > 1) this.formKey.client_type = clientlist.join(',');
            else this.formKey.client_type = clientlist[0];
        },
        onDetails(data) {
            lanternDetail(data).then(res => {
                Object.keys(this.formKey).forEach(key => {
                    if (key == 'status') {
                        this.formKey[key] = res.data[key];
                    } else if (key == 'newclient_type' || key == 'newappears_location') {
                        this.formKey[key] = this.formKey[key];
                    } else if (key == 'publish_at' || key == 'offline_at') {
                        this.formKey[key] = this.$root.unixTime(res.data[key]);
                    } else {
                        this.formKey[key] = res.data[key];
                    }
                });
                const { newclient_type, client_type, publish_at, offline_at } = this.formKey;
                if (client_type.length == 1) newclient_type.push(client_type);
                else
                    client_type.split(',').map(item => {
                        newclient_type.push(item);
                    });
            });
        }
    }
};
</script>
<style scoped lang="less">
@import '../../../styles/button.less';

/deep/.ivu-form-item-error-tip {
    margin-left: 80px;
}
.upLoad {
    width: 345px;
    height: 140px;
    border: 1px solid #e4e4e4;
}
.upLoad :nth-child(1) {
    border-left: 0;
}
.upLoadPC {
    width: 690px;
    height: 140px;
    border: 1px solid #e4e4e4;
}
// /deep/.ivu-form-item-content{
//   .ivu-form-item-error-tip{
//     margin-top:3px
//   }
// }
/deep/ .ivu-select-dropdown {
    z-index: 1000;
}
/deep/.mt30 label {
    line-height: 30px;
}
/deep/.maxw textarea {
    max-height: 300px;
}
//日历样式
.rili {
    /deep/.ivu-select-dropdown {
    width: 255px;
    z-index: 1000;
    height: 343px;
    .ivu-picker-panel-body {
        width: 100%;
        height: 290px;
        .ivu-picker-confirm {
            padding: 8;
            height: 53px;
            .ivu-btn {
                height: 36px;
                line-height: 36px;
            }
        }
        .ivu-time-picker-cells-list {
            width: 50%;
            min-height: 290px;
        }
        .ivu-picker-panel-content {
            .ivu-time-picker-cells-cell {
                padding: 0;
                text-align: center;
            }
        }
        .ivu-date-picker-cells {
            width: 238px;
            span {
                width: 34px;
                height: 34px;
                margin: 0;
            }
            em {
                width: 34px;
                height: 34px;
                margin: 0;
                line-height: 34px;
            }
        }
    }
}
}

</style>