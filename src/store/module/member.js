export default {
    state: {
        typeTagListType: [],
        noTable: [],
        typeTagList: [
            { value: "userName", name: "会员账号" },
            { value: "agencyName", name: "上级代理" },
            { value: "realName", name: "真实姓名" },
            { value: "phone", name: "手机号码" },
            { value: "shareholder", name: "大股东" },
            { value: "lastIp", name: "登录IP" },
            { value: "createIp", name: "注册IP" },
            { value: "wechat", name: "微信号" },
            { value: "email", name: "Email" }
        ],
        typeTagListNo: [
            { value: "userName", name: "会员账号" },
            { value: "agencyName", name: "上级代理" },
            { value: "InviteFriendsRegister", name: "邀请好友" },
            { value: "realName", name: "真实姓名" },
            { value: "phone", name: "手机号码" },
            { value: "shareholder", name: "大股东" },
            { value: "lastIp", name: "登录IP" },
            { value: "createIp", name: "注册IP" },
            { value: "wechat", name: "微信号" },
            { value: "email", name: "Email" }
        ],
    },
    mutations: {
        setTypeTagListType(state, list) {
            state.typeTagListType = list
        },
        setNoTable(state, table) {
            state.noTable = table
        }
    }
}