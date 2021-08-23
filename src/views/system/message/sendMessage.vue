<template>
    <div>
        <Form ref="sendmessg" :model="sendmessg" :rules="rules">
            <FormItem class="ml5">
                <span class="ml20 pr3">收件人</span>
                <ButtonGroup class="ml10 "  size="large">
                    <Button
                       size="large"
                        class="w120x f6Color "
                        style="color:#444;height:40px"
                        :class="currentBtn == item.value ? 'active' : ''"
                        v-for="item in sendtoList"
                        :value="item.value"
                        :key="item.label"
                        :label="item.label"
                        :defult="item.label"
                        @click="sendpersor(item.value, item.label, item.tip, item.placeholder)"
                        >{{ item.label }}</Button
                    >
                </ButtonGroup>
            </FormItem>
            <FormItem :label="defult" v-if="labeltype == 'member' || labeltype == 'agency'" class="" prop="sendVal">
                <!-- <Select
            v-model="sendmessg.sendVal"
            filterable
            multiple
            class="w600x "
            remote
            :remote-method="remoteMethod2"
            :placeholder="this.placeholder"
            :loading="loading2">
            <Option v-for="(option, index) in options2" :value="option.id" :key="index">{{option.userName}}</Option>
          </Select> -->
                <Input
                    v-model="sendmessg.sendVal"
                    placeholder="可批量添加，以英文逗号隔开"
                    :rows="rowsNum"
                    type="textarea"
                    class="w600x"
                    :autosize="{ minRows: rowsNum, maxRows: 5 }"
                    @on-change="separate(sendmessg.sendVal)"
                />
            </FormItem>

            <FormItem :label="defult" prop="memberGroup" v-if="labeltype == 'memberGroup'" class="">
                <LevelSelect key="member" ref="memberLevelSelect" class="w600x fl" clearable levelType="member" :mode="selectval" @on-level-change="levelChange" />
            </FormItem>

            <FormItem label="信息标题 " prop="title">
                <i-input type="text" class="w600x" placeholder="请输入标题(20字以内)" v-model="sendmessg.title" :maxlength="20"></i-input>
            </FormItem>
            <FormItem label="信息内容" class="message" prop="content">
                <Input type="textarea" :rows="14" placeholder="请输入信息内容" class="w600x" v-model="sendmessg.content" />
            </FormItem>
            <Button type="primary" class="ivu-btn send ft20 ml90" :loading="loading" @click="send">发送</Button>
        </Form>
        <Modals title="温馨提示" ref="failureTips" width="600" :mask-closable="false">
            <div slot="content">
                <div class="content w400x txt-a">
                    <p class="ft16 mb10 txt-l">
                        <Icon type="ios-alert" size="30" color="#2d8cf0" />
                        以下有<span class="red-font">{{ accountNum }}</span
                        >个账户不存在
                    </p>
                    <Input type="textarea" :rows="5" :placeholder="accountUser" class="w400x" readonly />
                    <Button class="btn mt30 ft20" type="primary" :loading="loading" @click.prevent="confirm">确认</Button>
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import { letterSend } from '@/api/system';
import { agencyGetName } from '@/api/agency';
import LevelSelect from '@/components/level-select';
import Modals from '@/components/modals';
export default {
    name: 'sendMessage',
    components: {
        LevelSelect,
        Modals
    },
    data() {
        return {
            rowsNum: 1,
            accountNum: 0,
            loading:false,
            accountUser: 'afdfdf',
            rules: {
                sendVal: [
                    {
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }
                ],
                title: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ]
            },
            loading2: false,
            currentBtn: '',
            selectval: '多选',
            placeholder: '',
            options2: [],
            sendtoList: [
                { value: 'member', label: '指定会员', tip: '会员账号', placeholder: '请输入会员账号' },
                { value: 'agency', label: '指定代理', tip: '代理账号', placeholder: '请输入代理名称' },
                { value: 'memberGroup', label: '会员组', tip: '会员等级', placeholder: '请选择' },
                { value: 'memberAll', label: '全部会员', tip: '', placeholder: '' },
                { value: 'agencyAll', label: '全部代理', tip: '', placeholder: '' }
            ],
            defult: '指定会员',
            labeltype: 'member',
            sendmessg: {
                title: '',
                content: '',
                send_content: '',
                sendVal: '',
                memberGroup: ''
            }
        };
    },
    mounted() {
        this.$Message.config({
            top: 50,
            duration: 1
        });
        const { value, label, tip, placeholder } = this.sendtoList[0];
        this.sendpersor(value, label, tip, placeholder);
    },
    methods: {
        sendpersor(value, label, tip, placeholder) {
            this.currentBtn = value;
            this.sendmessg.sendVal = '';
            this.options2 = [];
            if (tip) this.defult = tip;
            if (placeholder) this.placeholder = placeholder;
            this.labeltype = value;
            if (this.labeltype == 'memberGroup') {
                this.$nextTick(() => {
                    this.$refs.memberLevelSelect.init(this.$root.nowSite.id);
                });
            }
        },
        separate(val) {
            let str = val.replace(/\s+/g, ',');
            let last = str.substr(str.length - 1, 1);
            if (last == ',') {
                this.sendmessg.sendVal = str.substr(0, str.length - 1);
            } else {
                this.sendmessg.sendVal = str;
            }
            let row = Math.ceil(this.sendmessg.sendVal.split(',').length / 10);
            this.rowsNum = row == 0 ? 1 : row > 5 ? 5 : row;
        },
        confirm() {
            this.loading = true;
            this.$refs.failureTips.hide();
            this.$Message.success('发送成功！');
            this.$router.go(-1);
        },
        send() {
            this.$refs.sendmessg.validate(valid => {
                if (valid) {
                    this.loading = true;
                    const params = { ...this.sendmessg };
                    params.siteId = this.$root.nowSite.id;
                    params.send_type = this.labeltype;
                    if (params.sendVal.length != 0) {
                        if (params.sendVal.length > 1) params.send_content = params.sendVal;
                        else params.send_content = params.sendVal[0].toString();
                    }
                    if (params.send_type == 'memberAll' || params.send_type == 'agencyAll') {
                        delete params.send_content;
                    }
                    delete params.sendVal;
                    delete params.memberGroup;
                    letterSend(params, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            if (params.send_type == 'member' || params.send_type == 'agency') {
                                this.accountUser = res.data.err_user.toString();
                                this.accountNum = res.data.err_user.length;
                                if (this.accountNum == 0) {
                                    this.$Message.success(res.data.message);
                                    this.$router.go(-1);
                                } else {
                                    this.$refs.failureTips.show();
                                }
                            } else {
                                this.$Message.success(res.data);
                                this.$router.go(-1);
                            }
                            this.loading = false;
                        }else{
                            this.loading = false;
                        }
                    });
                }
            });
        },
        remoteMethod2(query) {
            if (query !== '') {
                this.options2 = [];
                this.loading2 = true;
                let postData = {
                    type: this.labeltype,
                    content: query,
                    siteId: this.$root.nowSite.id
                };
                agencyGetName(postData).then(res => {
                    this.loading2 = false;
                    this.options2 = res.data;
                });
            } else {
                this.options2 = [];
            }
        },
        levelChange(res) {
            if (res.levelLabel.length > 1) this.sendmessg.send_content = res.levelLabel.join(',');
            else this.sendmessg.send_content = res.levelLabel[0].toString();
        }
    }
};
</script>
<style scoped lang="less">
@import '../../../styles/button.less';
.pr3 {
    padding-right: 3px;
}
.content {
    margin: 30px auto;
    .btn {
        width: 100px;
        height: 40px;
        line-height: 25px;
    }
}
/deep/.ivu-form .ivu-form-item-label {
    width: 90px;
}
/deep/.ivu-form-item-error-tip {
    top: 0;
    left: 690px;
}
/deep/.ivu-btn {
    color: #2d8cf0;
    outline: 0;
    outline: none !important;
    box-shadow: none !important;
}
.ml10 .ivu-btn {
    color: #808080;
}
/deep/.ml10 .active {
    border: 1px solid #dcdcdc;
    border-top: 1px solid #2d8cf0 !important;
    outline: none !important;
    color: #2d8cf0 !important;
}
.message {
    /deep/textarea.ivu-input {
        max-height: 600px;
    }
}
/deep/.ivu-select-multiple {
    width: 600px !important;
}
/deep/.ivu-btn {
    color: #fff;
}
/deep/.ivu-btn,ivu-btn-default{
		height: 32px;
		line-height: 32px;
		span{
			height: 32px;
			margin-top:-11px;
		line-height: 32px;
		}

	}
</style>
