export default {
    state: {
        flag: null,
        domainList:['A' ,'B','C','D','E','F','G',
            'H' ,'I','J','K','L','M','N',
            'O' ,'P','Q','R','S','T'],
        arr:[],
    },
    mutations: {
        setFlag(state, flag) {
            state.flag = flag
        },
        successDomainList(state,arr){
            state.arr=arr;
            localStorage.domainList=arr;
        }

    }
}